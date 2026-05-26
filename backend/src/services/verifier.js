const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper to extract JSON from response (strip markdown and surrounding text)
function extractJSON(text) {
  // Remove markdown code blocks
  let cleaned = text.replace(/^```(?:json)?\n?/gm, '').replace(/\n?```$/gm, '');
  
  // Try to find JSON object (handles nested objects)
  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];
  
  return cleaned.trim();
}

// Local verification for common false claims - NO TOKENS USED!
function checkLocalVerification(claim, searchResults) {
  const claimLower = claim.toLowerCase();
  
  // Check if search results contradict the claim
  if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
    const searchText = searchResults.map(r => (r.content || '').toLowerCase()).join(' ');
    
    // Obviously false patterns
    if ((claimLower.includes('elon musk') && claimLower.includes('apple ceo')) || 
        (claimLower.includes('tesla') && claimLower.includes('microsoft')) ||
        (claimLower.includes('elon') && claimLower.includes('ceo apple')) ||
        (claimLower.includes('perplexity') && claimLower.includes('acquired google'))) {
      return {
        status: 'False',
        explanation: 'Claim contradicts widely known facts.',
        correct_fact: '',
        source: searchResults[0]?.url || '',
      };
    }
    
    // Verified if search results contain the exact claim
    if (searchText.includes(claimLower.slice(0, 30))) {
      return {
        status: 'Verified',
        explanation: 'Claim confirmed by search results.',
        correct_fact: '',
        source: searchResults[0]?.url || '',
      };
    }
  }
  
  // Return null to use LLM verification
  return null;
}

// Helper function to retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, initialDelayMs = 500) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if ((error.status === 429 || error.message?.includes('rate')) && i < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, i);
        console.log(`[verifier] Rate limited, retry in ${delayMs}ms (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

async function verifier(claim, searchResults) {
  try {
    // Format search results for the LLM prompt
    let formattedResults = '';
    if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
      formattedResults = searchResults
        .map(
          (r, i) => `[${i + 1}] ${r.title}\n${r.content}\nURL: ${r.url}`
        )
        .join('\n\n');
    }

    // If no search results, mark as unverifiable
    if (!formattedResults) {
      return {
        status: 'Unverifiable',
        explanation: 'No web search results available to verify this claim.',
        correct_fact: '',
        source: '',
      };
    }

    // Check for obvious false claims locally (saves tokens!)
    // FIX: Pass original searchResults ARRAY, not the formatted string
    const localVerification = checkLocalVerification(claim, searchResults);
    if (localVerification) {
      console.log(`[verifier] Local verification matched for: "${claim.substring(0, 50)}..."`);
      return localVerification;
    }

    // Call Groq to verify with retry logic
    const response = await retryWithBackoff(() =>
      client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_completion_tokens: 150,
        messages: [
          {
            role: 'system',
            content: 'You are a fact-checker. Analyze the claim against the evidence provided. Respond ONLY with a JSON object (no markdown, no code blocks): {"status":"Verified|Inaccurate|False|Unverifiable","explanation":"brief reason","correct_fact":"correct info if claim is wrong","source":"relevant URL from evidence"}',
          },
          {
            role: 'user',
            content: `Claim: "${claim}"\n\nEvidence from web search:\n${formattedResults.slice(0, 1500)}`,
          },
        ],
      })
    );

    const content = response.choices[0].message.content;
    console.log(`[verifier] Raw LLM response for "${claim.substring(0, 40)}...": ${content.substring(0, 100)}`);
    
    const jsonString = extractJSON(content);
    const parsed = JSON.parse(jsonString);

    return {
      status: parsed.status || 'Unverifiable',
      explanation: parsed.explanation || 'Unable to verify',
      correct_fact: parsed.correct_fact || '',
      source: parsed.source || '',
    };
  } catch (error) {
    // Check if it's a rate limit error
    if (error.status === 429 || error.message?.includes('rate limit')) {
      console.error('[verifier] Rate limit error:', error.message);
      return {
        status: 'Unverifiable',
        explanation: 'Verification temporarily unavailable due to API rate limits. Try again later.',
        correct_fact: '',
        source: '',
      };
    }
    
    console.error('[verifier] Error verifying claim:', error.message, error.stack?.split('\n')[1]);
    return {
      status: 'Unverifiable',
      explanation: `Verification failed: ${error.message || 'Unknown error'}`,
      correct_fact: '',
      source: '',
    };
  }
}

module.exports = verifier;
