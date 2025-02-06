# About
A simple example of implementing semantic search using wikipedia as a test corpus. 

It uses a postgres database with the [pgvector](https://github.com/pgvector/pgvector) extension and create embeddings with the [`nomic-embed-text`](https://ollama.com/library/nomic-embed-text) model using [ollama](https://ollama.com/).

# Installation
Run `nmp install`

## Docker
Make sure you have docker and docker-compose installed.

## Ollama
According to Ollama's documentation, the Ollama docker container on Mac doesn't support GPU acceleration, so we will proceed by installing Ollama locally.  

Install Ollama: `brew install ollama`

And start the Ollama server: `ollama serve`

Then you should download the embedding model we will use: `ollama pull nomic-embed-text`

## Database setup

### Start the postgres database
`docker-compose up -d`

### Migrations
Initially you must run the migrations to create the tables in the database.

`npm run migrate:up`

If something goes wrong, you can rollback the latest migration with: `npm run migrate:down`.

If something goes even more wrong, you can always stop the database first with `docker-compose down` and remove it completely with `rm -rf db/.pgdata`, and then start over. 

# Running the app

## Indexing 
`npm run dev`



