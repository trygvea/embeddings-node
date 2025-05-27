import { QdrantClient } from '@qdrant/js-client-rest';
import * as dotenv from "dotenv";

dotenv.config(); // Read connection info from .env file

const COLLECTION_NAME = 'embedded_data';

// Read Qdrant connection details from environment variables
const host = process.env.QDRANT_HOST || 'localhost';
const port = parseInt(process.env.QDRANT_PORT || '6333');

console.log(`Connecting to Qdrant at ${host}:${port}`);

// Create a new Qdrant client
export const qdrantClient = new QdrantClient({ host, port });

// Initialize the collection if it doesn't exist
export const initializeCollection = async () => {
  try {
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!collectionExists) {
      console.log(`Creating collection ${COLLECTION_NAME}`);
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 768, // nomic-embed-text uses 768 dimensions
          distance: 'Cosine' // Use cosine similarity
        },
      });
      
      // Create payload indexes for faster retrieval
      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'caption',
        field_schema: 'keyword'
      });
      
      await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
        field_name: 'resource_link',
        field_schema: 'keyword'
      });
    } else {
      console.log(`Collection ${COLLECTION_NAME} already exists`);
    }
  } catch (error) {
    console.error('Error initializing Qdrant collection:', error);
    throw error;
  }
};

// Function to insert an embedding into Qdrant
export const insertEmbedding = async (
  id: number, 
  { title, fullurl, extract }: { title: string, fullurl: string, extract: string }, 
  embedding: number[]
) => {
  try {
    await qdrantClient.upsert(COLLECTION_NAME, {
      points: [
        {
          id: id,
          vector: embedding,
          payload: {
            caption: title,
            resource_link: fullurl,
            content: extract
          }
        }
      ]
    });
  } catch (error) {
    console.error('Error inserting embedding:', error);
    throw error;
  }
};

// Function to search for similar embeddings in Qdrant
export const searchEmbedding = async (embedding: number[], limit = 10) => {
  try {
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector: embedding,
      limit: limit,
      with_payload: true
    });
    
    const results = searchResult.map(hit => ({
      resource_link: hit.payload?.resource_link as string,
      caption: hit.payload?.caption as string,
      cosine_distance: hit.score
    }));
    
    console.log('Search Results:', results);
    return results;
  } catch (error) {
    console.error('Error searching embeddings:', error);
    throw error;
  }
};

// Function to get the next available ID for inserting
export const getNextId = async (): Promise<number> => {
  try {
    const countResponse = await qdrantClient.count(COLLECTION_NAME);
    return countResponse.count + 1;
  } catch (error) {
    console.error('Error getting next ID:', error);
    return 1; // Default to 1 if there's an error
  }
};