// Mock verification service - NO TOKENS USED - perfect for testing!

const MOCK_VERDICTS = {
  'google was founded': { status: 'Verified', explanation: 'Google was indeed founded in 1998.', source: 'https://en.wikipedia.org/wiki/Google' },
  'iphone was introduced': { status: 'Verified', explanation: 'Apple introduced the first iPhone in 2007.', source: 'https://en.wikipedia.org/wiki/IPhone' },
  'chatgpt has 100 million': { status: 'Inaccurate', explanation: 'ChatGPT has over 100 million users currently, higher than 100M.', source: 'https://openai.com' },
  'openai was founded in 2010': { status: 'False', explanation: 'OpenAI was founded in December 2015, not 2010.', source: 'https://openai.com/about' },
  'tesla was created by microsoft': { status: 'False', explanation: 'Tesla was founded by Elon Musk, not Microsoft.', source: 'https://www.tesla.com' },
  'gpt-5 launched': { status: 'False', explanation: 'GPT-5 has not been launched. Latest is GPT-4.', source: 'https://openai.com' },
  'perplexity ai acquired google': { status: 'False', explanation: 'Perplexity AI did not acquire Google. This is false.', source: 'https://www.perplexity.ai' },
  'elon musk ceo of apple': { status: 'False', explanation: 'Tim Cook is the CEO of Apple, not Elon Musk.', source: 'https://www.apple.com' },
};

async function mockVerifier(claim) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));
  
  const claimLower = claim.toLowerCase();
  
  // Find matching mock verdict
  for (const [key, verdict] of Object.entries(MOCK_VERDICTS)) {
    if (claimLower.includes(key)) {
      return {
        status: verdict.status,
        explanation: verdict.explanation,
        correct_fact: '',
        source: verdict.source,
      };
    }
  }
  
  // Default: unverifiable
  return {
    status: 'Unverifiable',
    explanation: 'No mock verdict configured for this claim.',
    correct_fact: '',
    source: '',
  };
}

module.exports = mockVerifier;
