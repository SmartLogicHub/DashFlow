interface PendingConfirmation {
  key: string;
  expiresAt: number;
}

export class TimedConfirmation {
  private pending: PendingConfirmation | null = null;

  constructor(private readonly windowMs = 5_000) {}

  request(key: string, now = Date.now()): boolean {
    const confirmed = this.pending?.key === key && now <= this.pending.expiresAt;
    if (confirmed) {
      this.pending = null;
      return true;
    }
    this.pending = { key, expiresAt: now + this.windowMs };
    return false;
  }

  isArmed(key: string, now = Date.now()): boolean {
    if (!this.pending || now > this.pending.expiresAt) {
      this.pending = null;
      return false;
    }
    return this.pending.key === key;
  }
}
