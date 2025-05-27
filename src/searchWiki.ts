import { searchEmbedding as qdrantSearchEmbedding } from "./qdrantClient.js";

export const searchEmbedding = async (embedding: number[]) => {
  try {
    await qdrantSearchEmbedding(embedding, 10);
  } catch (err) {
    console.error("Error searching for embeddings:", err);
  }
};
