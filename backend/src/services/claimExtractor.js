const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function claimExtractor(text) {
  try {
    const response = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: `You are a claim extraction expert. Extract ALL specific factual claims from the provided text. Focus on: statistics and percentages, dates and years, financial figures, named facts with specific values, technical specifications. Return ONLY a valid JSON array of strings. Each string must be one complete, self-contained claim. No preamble, no markdown, no explanation. Just the JSON array.`,
        },
        {
          role: 'user',
          content: text.slice(0, 15000),
        },
      ],
    });

    const content = response.choices[0].message.content;
    const claims = JSON.parse(content);

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
