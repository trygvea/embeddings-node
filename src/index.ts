import { Command } from "commander";

const program = new Command();
program.name("embeddings-node").description("Sample creation and search using embeddings");
program.option("-i, --index <count>", "run indexing of random wikipedia content");
program.option("-s, --search <content>", "semantic search for content");
program.parse(process.argv);
const options = program.opts();

console.log("Under development. options:", options);
