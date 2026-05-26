const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper to extract JSON from response (strip markdown and surrounding text)
function extractJSON(text) {
  // Remove markdown code blocks
  let cleaned = text.replace(/^```(?:json)?\n?/gm, '').replace(/\n?```$/gm, '');
  
  // Try to find JSON array (greedy match for nested structures)
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) return arrayMatch[0];
  
  // Try to find JSON object
  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];
  
  return cleaned.trim();
}

// Helper function to retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, initialDelayMs = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delayMs = initialDelayMs * Math.pow(2, i);
        console.log(`[claimExtractor] Rate limited, retrying in ${delayMs}ms (attempt ${i + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

async function claimExtractor(text) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('[claimExtractor] GROQ_API_KEY is not set');
      return [];
    }

    // Optimize: Reduce text size and max tokens for speed
    const response = await retryWithBackoff(() =>
      client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_completion_tokens: 400,
        messages: [
          {
            role: 'system',
            content: `You are a fact-checking assistant. Extract 5-8 specific, verifiable factual claims from the text. Focus on claims that contain:
- Statistics and numbers
- Dates and time references
- Named entities (people, companies, places)
- Specific assertions that can be verified

Respond ONLY with a JSON array, no markdown, no explanation:
[{"claim":"The specific factual claim here"}]`,
          },
          {
            role: 'user',
            content: `Extract verifiable factual claims from this text:\n\n${text.slice(0, 4000)}`,
          },
        ],
      })
    );

    const content = response.choices[0].message.content;
    console.log(`[claimExtractor] Raw LLM response: ${content.substring(0, 200)}...`);
    
    const jsonString = extractJSON(content);
    let parsed;
    
    try {
      parsed = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error(`[claimExtractor] JSON parse failed: ${parseErr.message}`);
      console.error(`[claimExtractor] Attempted to parse: ${jsonString.substring(0, 200)}`);
      return [];
    }
    
    // Ensure it's an array
    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }
    
    // Limit to 8 claims for speed
    if (parsed.length > 8) {
      console.log(`[claimExtractor] Limiting ${parsed.length} claims to top 8 for speed`);
      parsed = parsed.slice(0, 8);
    }

    // Extract claim text
    const claims = parsed.map(item => 
      typeof item === 'string' ? item : (item.claim || item.text || item.fact || JSON.stringify(item))
    ).filter(c => c && c.length > 5);

    console.log(`[claimExtractor] Extracted ${claims.length} claims:`);
    claims.forEach((c, i) => console.log(`  [${i + 1}] ${c.substring(0, 80)}`));
    
    return claims;
  } catch (error) {
    console.error('[claimExtractor] Error extracting claims:', error.message);
    if (error.status === 429) {
      console.error('[claimExtractor] Rate limited - wait before retrying');
    }
    return [];
  }
}

module.exports = claimExtractor;
