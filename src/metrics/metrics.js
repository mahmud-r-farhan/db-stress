export class Metrics {
  constructor() {
    this.start = Date.now();
    this.success = 0;
    this.failed = 0;
    this.latencies = [];
  }

  successEvent(ms) {
    this.success++;
    this.latencies.push(ms);
  }

  failEvent() {
    this.failed++;
  }

  report() {
    const time = (Date.now() - this.start) / 1000;
    const avg = this.latencies.length
      ? (this.latencies.reduce((a, b) => a + b) / this.latencies.length).toFixed(2)
      : 0;

    return {
      durationSec: time.toFixed(2),
      total: this.success + this.failed,
      success: this.success,
      failed: this.failed,
      avgLatencyMs: avg,
      p95LatencyMs: this.latencies.length ? this.getPercentile(95) : 0,
      p99LatencyMs: this.latencies.length ? this.getPercentile(99) : 0,
      ratePerSec: (this.success / time).toFixed(2)
    };
  }

  getPercentile(p) {
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }
}