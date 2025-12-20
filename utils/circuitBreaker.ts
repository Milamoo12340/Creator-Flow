// utils/circuitBreaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  constructor(private config: { failureThreshold: number; resetTimeMs: number }) {}
  canRequest(): boolean {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      const elapsed = Date.now() - (this.lastFailureTime || 0);
      if (elapsed > this.config.resetTimeMs) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true;
  }
  recordSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
    }
  }
  getState() {
    return this.state;
  }
}
