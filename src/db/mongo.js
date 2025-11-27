import { MongoClient } from "mongodb";
import { createQueue } from "../concurrency/queue.js";
import { Metrics } from "../metrics/metrics.js";
import { generateBatch } from "../utils/dataGenerator.js";
import { createLogger } from "../logger/logger.js";

export async function stressMongo(config) {
  const logger = createLogger();
  const metrics = new Metrics();

  const client = new MongoClient(config.connectionString, {
    maxPoolSize: 20,
    minPoolSize: 5
  });

  await client.connect();
  const db = client.db("stressTest");
  const col = db.collection("dummy");

  const queue = createQueue(config.concurrency);

  for (let i = 0; i < config.amount; i += 100) {
    const batch = generateBatch(100);

    queue.add(async () => {
      const start = Date.now();
      try {
        await col.insertMany(batch);
        metrics.successEvent(Date.now() - start);
      } catch (e) {
        metrics.failEvent();
        logger.error("Mongo batch insert failed", { error: e.message });
      }
    });
  }

  await queue.onIdle();
  await client.close();

  console.log("\n📊 Metrics:\n", metrics.report());
}
