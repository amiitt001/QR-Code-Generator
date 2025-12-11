/**
 * QR Code Analytics Tracking
 * Tracks usage statistics and generation metrics
 */

export interface QRAnalytics {
  totalGenerated: number;
  totalDownloads: number;
  totalShares: number;
  totalScans: number;
  byType: Record<string, number>;
  byFormat: Record<string, number>;
  sessionDuration: number;
  lastUsed: number;
}

const ANALYTICS_STORAGE_KEY = 'qr_analytics';

export const analyticsService = {
  /**
   * Initialize analytics if not present
   */
  initAnalytics(): QRAnalytics {
    const existing = this.getAnalytics();
    if (existing) return existing;

    const initial: QRAnalytics = {
      totalGenerated: 0,
      totalDownloads: 0,
      totalShares: 0,
      totalScans: 0,
      byType: {},
      byFormat: {},
      sessionDuration: 0,
      lastUsed: Date.now(),
    };

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  },

  /**
   * Get current analytics
   */
  getAnalytics(): QRAnalytics | null {
    try {
      const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading analytics:', error);
      return null;
    }
  },

  /**
   * Track QR code generation
   */
  trackGeneration(type: string, format: string): void {
    const analytics = this.initAnalytics();
    analytics.totalGenerated++;
    analytics.byType[type] = (analytics.byType[type] || 0) + 1;
    analytics.byFormat[format] = (analytics.byFormat[format] || 0) + 1;
    analytics.lastUsed = Date.now();
    this.saveAnalytics(analytics);
  },

  /**
   * Track download
   */
  trackDownload(format: string): void {
    const analytics = this.initAnalytics();
    analytics.totalDownloads++;
    analytics.lastUsed = Date.now();
    this.saveAnalytics(analytics);
  },

  /**
   * Track share
   */
  trackShare(platform: string): void {
    const analytics = this.initAnalytics();
    analytics.totalShares++;
    analytics.lastUsed = Date.now();
    this.saveAnalytics(analytics);
  },

  /**
   * Track scan
   */
  trackScan(): void {
    const analytics = this.initAnalytics();
    analytics.totalScans++;
    analytics.lastUsed = Date.now();
    this.saveAnalytics(analytics);
  },

  /**
   * Update session duration
   */
  updateSessionDuration(milliseconds: number): void {
    const analytics = this.initAnalytics();
    analytics.sessionDuration += milliseconds;
    this.saveAnalytics(analytics);
  },

  /**
   * Save analytics
   */
  saveAnalytics(analytics: QRAnalytics): void {
    try {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
    } catch (error) {
      console.error('Error saving analytics:', error);
    }
  },

  /**
   * Reset analytics
   */
  resetAnalytics(): void {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  },

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalQRCodes: number;
    generatedToday: number;
    mostUsedType: string | null;
    mostUsedFormat: string | null;
  } {
    const analytics = this.getAnalytics();
    if (!analytics) {
      return {
        totalQRCodes: 0,
        generatedToday: 0,
        mostUsedType: null,
        mostUsedFormat: null,
      };
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const generatedToday =
      now - analytics.lastUsed < oneDayMs ? analytics.totalGenerated : 0;

    const mostUsedType = Object.entries(analytics.byType).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0]?.[0] || null;

    const mostUsedFormat = Object.entries(analytics.byFormat).sort(
      ([, a], [, b]) => (b as number) - (a as number)
    )[0]?.[0] || null;

    return {
      totalQRCodes: analytics.totalGenerated,
      generatedToday,
      mostUsedType,
      mostUsedFormat,
    };
  },
};
