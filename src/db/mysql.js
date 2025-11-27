import mysql from "mysql2/promise";
import { createQueue } from "../concurrency/queue.js";
import { Metrics } from "../metrics/metrics.js";
import { generateBatch } from "../utils/dataGenerator.js";
import { createLogger } from "../logger/logger.js";

export async function stressMysql(config) {
    const connection = await mysql.createConnection(config.connectionString);

    await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255),
      name VARCHAR(255),
      address TEXT,
      email VARCHAR(255),
      phone VARCHAR(50),
      created_at DATETIME
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
                const values = batch.map(u => [u.username, u.name, u.address, u.email, u.phone, u.createdAt]);

                await connection.query(
                    "INSERT INTO users (username, name, address, email, phone, created_at) VALUES ?",
                    [values]
                );

                metrics.successEvent(Date.now() - start);
            } catch (e) {
                metrics.failEvent();
                logger.error("MySQL insert failed", { error: e.message });
            }
        });
    }

    await queue.onIdle();
    await connection.end();

    console.log("\n📊 Metrics:\n", metrics.report());
}
