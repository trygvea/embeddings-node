import * as dotenv from "dotenv";
import pg from "pg";
const { Pool } = pg;

dotenv.config(); // Read database connection info from .env file

console.log("Connecting to database", process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const searchEmbedding = async (embedding: number[]) => {
  const client = await pool.connect();
  const query = `
        SELECT 
            resource_link, 
            caption,
            embedding <=> $1 AS cosine_distance
        FROM embedded_data
        ORDER BY embedding <=> $1
        LIMIT 10
    `;
  try {
    const result = await client.query(query, [JSON.stringify(embedding)]);
    console.log("Search Results:", result.rows);
  } catch (err) {
    console.error("Error inserting row:", err);
  } finally {
    client.release();
  }
};
