import { Pool } from "pg";
import { createQueue } from "../concurrency/queue.js";
import { Metrics } from "../metrics/metrics.js";
import { generateBatch } from "../utils/dataGenerator.js";
import { createLogger } from "../logger/logger.js";

export async function stressPostgres(config) {
  const pool = new Pool({
    connectionString: config.connectionString,
    max: 20
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT,
      name TEXT,
      address TEXT,
      email TEXT,
      phone TEXT,
      created_at TIMESTAMP
    )
  `);

  const logger = createLogger();
  const metrics = new Metrics();
  const queue = createQueue(config.concurrency);

  for (let i = 0; i < config.amount; i += 100) {
    const batch = generateBatch(100);

    queue.add(async () => {
      const start = Date.now();
      try {
        const values = batch
          .map(u => `('${u.username}', '${u.name.replace(/'/g, "''")}', '${u.address.replace(/'/g, "''")}', '${u.email}', '${u.phone}', '${u.createdAt}')`)
          .join(",");

        await pool.query(`
          INSERT INTO users (username, name, address, email, phone, created_at)
          VALUES ${values}
        `);

        metrics.successEvent(Date.now() - start);
      } catch (e) {
        metrics.failEvent();
        logger.error("Postgres insert failed", { error: e.message });
      }
    });
  }

  await queue.onIdle();
  await pool.end();

  console.log("\n📊 Metrics:\n", metrics.report());
}
