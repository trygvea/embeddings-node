# About
A simple example of indexing and searching a postgres database with embeddings created by ollama .

# Installation

# First time setup
`nmp install`

Make sure you have docker and docker-compose installed.

## Start the postgres database
`docker-compose up -d`

## Migrations
Initially you must run the migrations to create the tables in the database.

`npm run migrate:up`

If something goes wrong, you can rollback the latest migration with:

`npm run migrate:down`

If something goes even more wrong, you can always stop the database first with `docker-compose down` and remove it completely with `rm -rf db/.pgdata`, and then start over. 

# Running the app
`npm run dev`



