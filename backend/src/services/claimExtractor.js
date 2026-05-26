const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper to extract JSON from response (strip markdown and surrounding text)
function extractJSON(text) {
  // Remove markdown code blocks
  let cleaned = text.replace(/^```(?:json)?\n?/gm, '').replace(/\n?```$/gm, '');
  
  // Try to find JSON array
  const arrayMatch = cleaned.match(/\[\s*(?:[^\[\]]*\{[^\}]*\}[^\[\]]*)*\s*\]/s);
  if (arrayMatch) return arrayMatch[0];
  
  // Try to find JSON object
  const objectMatch = cleaned.match(/\{[^{}]*\}/s);
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
        console.log(`[claimExtractor] Rate limited, retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw error;
      }
    }
  }
}

async function claimExtractor(text) {
  try {
    // Optimize: Reduce text size and max tokens for speed
    const response = await retryWithBackoff(() =>
      client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_completion_tokens: 200, // Reduced from 256 - still gets enough claims
        messages: [
          {
            role: 'system',
            content: `Extract 5-8 factual claims with numbers: stats, dates, money, tech specs. 
Respond ONLY with JSON array, no markdown: [{"claim":"..."}]`,
          },
          {
            role: 'user',
            content: `Extract claims:\n${text.slice(0, 3000)}`, // Reduced from 5000 for speed
          },
        ],
      })
    );

    const content = response.choices[0].message.content;
    const jsonString = extractJSON(content);
    let parsed = JSON.parse(jsonString);
    
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
      typeof item === 'string' ? item : (item.claim || JSON.stringify(item))
    ).filter(c => c && c.length > 5);

    console.log(`[claimExtractor] Extracted ${claims.length} claims`);
    return claims;
  } catch (error) {
    console.error('[claimExtractor] Error extracting claims:', error.message);
    return [];
  }
}

module.exports = claimExtractor;
