-- Up Migration

CREATE TABLE embedded_data (
    id SERIAL PRIMARY KEY,
    caption varchar,          -- nyttig å vise frem sammen med et søkeresultat
    resource_link varchar,    -- link til kilden
    embedding vector(768),    -- nomic-embed-text bruker 768 dimensjoner, OpenAI embeddings bruker 1536 dimensjoner
    content text             -- nyttig for raskere fremhenting i forb. med RAG
    -- rettigheter mmm
    );

CREATE INDEX ON embedded_data USING hnsw (
    embedding vector_cosine_ops
    );

-- Down Migration
DROP TABLE embedded_data;
