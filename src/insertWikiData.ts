import pg from "pg";
import { createEmbedding } from "./ollamaEmbedding.js";
import * as dotenv from "dotenv";
const { Pool } = pg;

type WikiData = {
  title: string;
  fullurl: string;
  extract: string;
};

// This wiki api url will return one random wikipedia article
const wikiUrl =
  "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=random&grnnamespace=0&grnlimit=1&prop=info|extracts&inprop=url&explaintext=true";

dotenv.config(); // Read database connection info from .env file

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const insertWikiData = async (count: number) => {
  for (let i = 0; i < count; i++) {
    fetch(wikiUrl)
      .then((response) => response.json())
      .then(async (data) => {
        const pages = data.query.pages;
        const pageIds = Object.keys(pages);
        const wikiData = pages[pageIds[0]];
        const { title, extract } = wikiData;
        console.log("Indexing wiki article:", title);
        const embedding = await createEmbedding(extract);
        insertEmbedding(wikiData, embedding);
      });
  }
};

const insertEmbedding = async ({ title, fullurl, extract }: WikiData, embedding: number[]) => {
  const client = await pool.connect();
  const query = `
      INSERT INTO embedded_data (
          caption, 
          resource_link, 
          embedding,
          content
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  try {
    const values = [title, fullurl, JSON.stringify(embedding), extract];
    await client.query(query, values);
  } catch (err) {
    console.error("Error inserting row:", err);
  } finally {
    client.release();
  }
};
