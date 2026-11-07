// No AI provider is configured by default. Never put API keys in client environment variables.
export const aiConfig={provider:process.env.AI_PROVIDER||'deterministic-fallback',apiKey:process.env.AI_API_KEY||null};
