# About
A simple example of implementing semantic search using wikipedia as a test corpus. 

It uses a Qdrant vector database for storing and searching embeddings, with vectors created using the [`nomic-embed-text`](https://ollama.com/library/nomic-embed-text) model via [ollama](https://ollama.com/).

See [corresponding blog post](https://www.kodemaker.no/blogg/2025-02-12-text-embeddings/) (in norwegian).

# Installation
Run `npm install`

## .env
Run `npm run dotenv-init` 

Or just copy the content of the `.env.example` file to the `.env` file. 

## Docker
Make sure you have docker and docker-compose installed.

## Ollama
According to Ollama's documentation, the Ollama docker container on Mac doesn't support GPU acceleration, so we will proceed by installing Ollama locally.  

Install Ollama: `brew install ollama`

And start the Ollama server: `ollama serve`

Then you should download the embedding model we will use: `ollama pull nomic-embed-text`

## Database setup

### Start the Qdrant vector database
`docker-compose up -d`

Qdrant will automatically create the necessary collections when you run the application.

If something goes wrong, you can always stop the database with `docker-compose down` and remove it completely with `rm -rf db/qdrant-data`, and then start over. 

# Running the app

## Indexing 
Create embeddings for 100 random wikipedia articles and store them in the local Qdrant database.

`npm run index 100`

## Searching
Check if there are any rock artists among our indexed data:

`npm run search "Rock artist"`

Sample output from indexed articles:
```
> embeddings-node@0.0.1 search
> tsx src/index.ts -s Rock artist

Connecting to Qdrant at localhost:6333
Searching for content: Rock artist
Search Results: [
  {
    resource_link: 'https://en.wikipedia.org/wiki/Dark_Horse_%E2%80%93_A_Live_Collection',
    caption: 'Dark Horse – A Live Collection',
    cosine_distance: 0.8029609909628218
  },
  {
    resource_link: 'https://en.wikipedia.org/wiki/Phil_Stack',
    caption: 'Phil Stack',
    cosine_distance: 0.7963667336889049
  },
  {
    resource_link: 'https://en.wikipedia.org/wiki/Russell_B_Jackson',
    caption: 'Russell B Jackson',
    cosine_distance: 0.7729703552650587
  },
```

