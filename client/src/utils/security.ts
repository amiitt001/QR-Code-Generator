// Configuration
const MAX_REQUESTS_PER_MINUTE = 5;
const BLOCK_DURATION_MS = 60 * 1000; // 1 minute
const STORAGE_KEY = 'gemini_qr_security_context';

interface SecurityContext {
  requests: number[]; // Array of timestamps
  blockedUntil: number | null;
}

export const SecurityService = {
  /**
   * Checks if the current user (browser session) is allowed to make a request.
   * Implements a sliding window rate limiter.
   */
  checkRateLimit: (): { allowed: boolean; error?: string } => {
    const now = Date.now();
    const raw = localStorage.getItem(STORAGE_KEY);
    let context: SecurityContext = raw ? JSON.parse(raw) : { requests: [], blockedUntil: null };

    // 1. Check if currently blocked
    if (context.blockedUntil && now < context.blockedUntil) {
      const remaining = Math.ceil((context.blockedUntil - now) / 1000);
      return { 
        allowed: false, 
        error: `Too many requests. Please try again in ${remaining} seconds.` 
      };
    }

    // 2. Clear block if expired
    if (context.blockedUntil && now >= context.blockedUntil) {
      context.blockedUntil = null;
    }

    // 3. Sliding Window: Remove requests older than 1 minute
    context.requests = context.requests.filter(timestamp => now - timestamp < 60000);

    // 4. Check limit
    if (context.requests.length >= MAX_REQUESTS_PER_MINUTE) {
      context.blockedUntil = now + BLOCK_DURATION_MS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
      SecurityService.logAttempt('BLOCKED_RATE_LIMIT');
      return { 
        allowed: false, 
        error: `Rate limit exceeded. Pausing for 1 minute.` 
      };
    }

    // 5. Allow request (but don't record it yet, record only on success)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    return { allowed: true };
  },

  /**
   * Records a successful request timestamp.
   */
  recordRequest: () => {
    const now = Date.now();
    const raw = localStorage.getItem(STORAGE_KEY);
    let context: SecurityContext = raw ? JSON.parse(raw) : { requests: [], blockedUntil: null };
    
    context.requests.push(now);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(context));
    SecurityService.logAttempt('REQUEST_RECORDED');
  },

  /**
   * Generates a simple math challenge.
   */
  generateChallenge: () => {
    const operators = ['+', '-'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    
    let answer = 0;
    let question = '';

    if (operator === '+') {
      answer = a + b;
      question = `${a} + ${b}`;
    } else {
      // Ensure positive result for subtraction
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      answer = max - min;
      question = `${max} - ${min}`;
    }

    return { question, answer };
  },

  /**
   * Logs security events (Simulation of server-side logging)
   */
  logAttempt: (status: string, details?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      status,
      details
    };
    
    // In a real app, this would be: await fetch('/api/log', { method: 'POST', body: JSON.stringify(logEntry) });
    console.info('[Security Log]:', logEntry);
  }
};