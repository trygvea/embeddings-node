// We use Ollama's API to get embeddings.
const embeddingUrl = "http://localhost:11434/api/embeddings";

// The `nomic-embed-text` model is considered a high-performing open embedding
// model with a large token context window (8196 tokens or 10-20 pages of text).
// See https://ollama.com/library/nomic-embed-text
const model = "nomic-embed-text";

export const createEmbedding = async (prompt: string): Promise<number[]> => {
  return fetch(embeddingUrl, {
    method: "POST",
    body: JSON.stringify({ model, prompt }),
  })
    .then((response) => response.json())
    .then((data) => data.embedding);
};
