# About
A simple example of implementing semantic search using wikipedia as a test corpus. 

It uses a postgres database with the [pgvector](https://github.com/pgvector/pgvector) extension and create embeddings with the [`nomic-embed-text`](https://ollama.com/library/nomic-embed-text) model using [ollama](https://ollama.com/).

See [corresponding blog post](https://www.kodemaker.no/blogg/2025-02-12-text-embeddings/) (in norwegian).

# Installation
Run `nmp install`

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

### Start the postgres database
`docker-compose up -d`

### Migrations
Initially you must run the migrations to create the tables in the database.

`npm run migrate:up`

If something goes wrong, you can rollback the latest migration with: `npm run migrate:down`.

If something goes even more wrong, you can always stop the database first with `docker-compose down` and remove it completely with `rm -rf db/.pgdata`, and then start over. 

# Running the app

## Indexing 
Create embeddings for 100 random wikipedia articles and store them in the local postgres database.

`npm run index 100`

## Searching
Check if there are any rock artists among our indexed data:

`npm run search "Rock artist"`

Sample output from my 1000 random indexed articles:
```
> embeddings-node@0.0.1 search
> tsx src/index.ts -s Rock artist

Connecting to database postgres://dev:dev@localhost:5432/dev
Searching for content: Rock artist
Search Results: [
  {
    resource_link: 'https://en.wikipedia.org/wiki/Dark_Horse_%E2%80%93_A_Live_Collection',
    caption: 'Dark Horse – A Live Collection',
    cosine_distance: 0.39703900903717815
  },
  {
    resource_link: 'https://en.wikipedia.org/wiki/Phil_Stack',
    caption: 'Phil Stack',
    cosine_distance: 0.4036332663110951
  },
  {
    resource_link: 'https://en.wikipedia.org/wiki/Russell_B_Jackson',
    caption: 'Russell B Jackson',
    cosine_distance: 0.4270296447349413
  },
```

