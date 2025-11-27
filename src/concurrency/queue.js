import PQueue from "p-queue";

export function createQueue(limit) {
  return new PQueue({ concurrency: limit });
}