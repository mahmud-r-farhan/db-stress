import axios from "axios";
import { createQueue } from "../concurrency/queue.js";
import { Metrics } from "../metrics/metrics.js";
import { generateDummy } from "../utils/dataGenerator.js";
import { createLogger } from "../logger/logger.js";

export async function stressAPI(config) {
  const queue = createQueue(config.concurrency);
  const metrics = new Metrics();
  const logger = createLogger();

  for (let i = 0; i < config.amount; i++) {
    queue.add(async () => {
      const payload = generateDummy();
      const start = Date.now();

      try {
        await axios.post(config.apiUrl, payload);
        metrics.successEvent(Date.now() - start);
      } catch (e) {
        metrics.failEvent();
        logger.error("API request failed", {
          error: e.message,
          payload
        });
      }
    });
  }

  await queue.onIdle();

  console.log("\n📊 API Metrics:\n", metrics.report());
}