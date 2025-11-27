import inquirer from "inquirer";
import chalk from "chalk";
import { Command } from "commander";
import { validateConfig } from "./validation/validation.js";

import { stressMongo } from "./db/mongo.js";
import { stressPostgres } from "./db/postgres.js";
import { stressMysql } from "./db/mysql.js";
import { stressAPI } from "./api/apiStress.js";

export async function runCLI() {
  const program = new Command();

  program
    .name("db-stress")
    .description("CLI tool for stress testing databases")
    .version("1.0.0")
    .option("--mode <type>", "Test mode (db or api)")
    .option("--db-type <type>", "Database type (mongo, postgres, mysql)")
    .option("--uri <string>", "Connection string")
    .option("--url <string>", "API URL")
    .option("--amount <number>", "Number of entries", parseInt)
    .option("--batch-size <number>", "Batch size", parseInt, 1000)
    .option("--concurrency <number>", "Concurrency", parseInt, 20)
    .option("--metrics", "Enable metrics");

  program.parse(process.argv);
  const options = program.opts();

  let config = {};

  // If no essential args provided, assume interactive
  if (!options.mode && !options.amount) {
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "mode",
        message: "Choose mode:",
        choices: ["db", "api"]
      },
      {
        type: "number",
        name: "amount",
        message: "Insert amount:",
        default: 1000
      },
      {
        type: "number",
        name: "concurrency",
        message: "Concurrency level:",
        default: 20
      },
      {
        type: "list",
        name: "dbType",
        message: "Database type:",
        choices: ["mongodb", "postgres", "mysql"],
        when: a => a.mode === "db"
      },
      {
        type: "input",
        name: "connectionString",
        message: "Connection string:",
        when: a => a.mode === "db"
      },
      {
        type: "input",
        name: "apiUrl",
        message: "Target API URL (POST):",
        when: a => a.mode === "api"
      }
    ]);
    config = validateConfig(answers);
  } else {
    // Map options to config format
    config = {
      mode: options.mode,
      amount: options.amount,
      concurrency: options.concurrency,
      dbType: options.dbType === "pg" ? "postgres" : options.dbType === "mongo" ? "mongodb" : options.dbType,
      connectionString: options.uri,
      apiUrl: options.url,
      batchSize: options.batchSize
    };
    // Basic validation for non-interactive
    if (!config.mode) {
      console.error(chalk.red("Error: --mode is required"));
      process.exit(1);
    }
  }

  console.log(chalk.cyan("\n🔥 Starting stress test...\n"));

  try {
    if (config.mode === "api") return await stressAPI(config);
    if (config.dbType === "mongodb") return await stressMongo(config);
    if (config.dbType === "postgres") return await stressPostgres(config);
    if (config.dbType === "mysql") return await stressMysql(config);

    console.error(chalk.red("Invalid configuration or database type."));
  } catch (err) {
    console.error(chalk.red("\n❌ Fatal Error:"), err.message);
    process.exit(1);
  }
}
