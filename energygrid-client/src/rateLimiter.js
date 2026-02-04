class RateLimiter {
  constructor(intervalMs) {
    this.intervalMs = intervalMs;
    this.lastRun = 0;
  }

  async wait() {
    const now = Date.now();
    const elapsed = now - this.lastRun;

    if (elapsed < this.intervalMs) {
      await new Promise(res =>
        setTimeout(res, this.intervalMs - elapsed)
      );
    }
    this.lastRun = Date.now();
  }
}

module.exports = RateLimiter;
