import { Command } from "commander";
import { insertWikiData } from "./insertWikiData.js";
import { searchEmbedding } from "./searchWiki.js";
import { createEmbedding } from "./ollamaEmbedding.js";

const program = new Command();
program.name("embeddings-node").description("Sample creation and search using embeddings");
program.option("-i, --index <n>", "run indexing of random wikipedia content", parseInt);
program.option("-s, --search <content>", "semantic search for content");
program.parse(process.argv);
const options = program.opts();

if (options.index) {
  console.log("Indexing random wikipedia content");
  insertWikiData(options.index);
} else if (options.search) {
  console.log("Searching for content:", options.search);
  const embedding = await createEmbedding(options.search);
  searchEmbedding(embedding);
} else {
  program.outputHelp();
}
