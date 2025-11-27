import fs from "fs";

export function createLogger() {
  const stream = fs.createWriteStream("stress-errors.log", { flags: "a" });

  return {
    error(msg, meta = {}) {
      stream.write(JSON.stringify({
        time: new Date().toISOString(),
        message: msg,
        meta
      }) + "\n");
    }
  };
}