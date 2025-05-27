import { createEmbedding } from "./ollamaEmbedding.js";
import { initializeCollection, insertEmbedding as qdrantInsertEmbedding, getNextId } from "./qdrantClient.js";

type WikiData = {
  title: string;
  fullurl: string;
  extract: string;
};

// This wiki api url will return one random wikipedia article
const wikiUrl =
  "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=random&grnnamespace=0&grnlimit=1&prop=info|extracts&inprop=url&explaintext=true";

// Initialize Qdrant collection when this module is imported
initializeCollection().catch(console.error);

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
        const id = await getNextId();
        insertEmbedding(id, wikiData, embedding);
      });
  }
};

const insertEmbedding = async (id: number, { title, fullurl, extract }: WikiData, embedding: number[]) => {
  try {
    await qdrantInsertEmbedding(id, { title, fullurl, extract }, embedding);
    console.log(`Successfully inserted embedding for "${title}" with ID ${id}`);
  } catch (err) {
    console.error("Error inserting embedding:", err);
  }
};
