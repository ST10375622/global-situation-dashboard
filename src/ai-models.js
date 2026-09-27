const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL_NAME = "llama3.1";

/**
 * Model A — Deterministic.
 */
async function runDeterministicModel(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0,
        seed: 42,
        top_p: 1,
        top_k: 1,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

/**
 * Model B — Probabilistic.
 */
async function runProbabilisticModel(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.9,
        top_p: 0.95,
        top_k: 40,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.response;
}

async function analyzeEventWithBothModels(eventSummary) {
  const prompt = `Summarize the risk level of this global event in one sentence: ${eventSummary}`;

  const [deterministicResult, probabilisticResult] = await Promise.all([
    runDeterministicModel(prompt),
    runProbabilisticModel(prompt),
  ]);

  return { deterministicResult, probabilisticResult };
}

export {
  runDeterministicModel,
  runProbabilisticModel,
  analyzeEventWithBothModels,
};
