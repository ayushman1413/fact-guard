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
    // Optimize: Reduce text size and max tokens
    const response = await retryWithBackoff(() =>
      client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_completion_tokens: 256, // Reduced from 512 - still gets ~10 claims
        messages: [
          {
            role: 'system',
            content: `Extract factual claims with numbers: stats, dates, money, tech specs. Return ONLY JSON array. No markdown.`,
          },
          {
            role: 'user',
            content: text.slice(0, 5000), // Reduced from 10000 - still enough for claims
          },
        ],
      })
    );

    const content = response.choices[0].message.content;
    const jsonString = extractJSON(content);
    let parsed = JSON.parse(jsonString);
    
    // Limit to top 10 claims to save tokens on verification
    if (Array.isArray(parsed) && parsed.length > 10) {
      console.log(`[claimExtractor] Limiting ${parsed.length} claims to top 10`);
      parsed = parsed.slice(0, 10);
    }

    if (!Array.isArray(claims)) {
      console.warn('[claimExtractor] Response was not an array, treating as empty');
      return [];
    }

    return claims;
  } catch (error) {
    console.error('[claimExtractor] Error extracting claims:', error.message);
    return [];
  }
}

module.exports = claimExtractor;
