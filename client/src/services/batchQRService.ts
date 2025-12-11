/**
 * Batch QR Code Management
 * Handles multiple QR code generation, storage, and export
 */

export interface BatchQRItem {
  id: string;
  input: string;
  qrValue: string;
  type: 'text' | 'vcard' | 'wifi' | 'url';
  timestamp: number;
  format: 'png' | 'svg' | 'jpg';
}

export interface BatchQRSession {
  id: string;
  name: string;
  items: BatchQRItem[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'qr_batch_sessions';
const MAX_BATCH_SIZE = 50;
const SESSION_EXPIRY_DAYS = 30;

export const batchQRService = {
  /**
   * Create a new batch session
   */
  createSession(name: string): BatchQRSession {
    const session: BatchQRSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.saveSession(session);
    return session;
  },

  /**
   * Add item to session
   */
  addItemToSession(sessionId: string, item: Omit<BatchQRItem, 'id'>): BatchQRItem {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.items.length >= MAX_BATCH_SIZE) {
      throw new Error(`Maximum batch size (${MAX_BATCH_SIZE}) reached`);
    }

    const newItem: BatchQRItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };

    session.items.push(newItem);
    session.updatedAt = Date.now();
    this.saveSession(session);
    
    return newItem;
  },

  /**
   * Remove item from session
   */
  removeItemFromSession(sessionId: string, itemId: string): void {
    const sessions = this.getAllSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    session.items = session.items.filter(item => item.id !== itemId);
    session.updatedAt = Date.now();
    this.saveSession(session);
  },

  /**
   * Get all sessions
   */
  getAllSessions(): BatchQRSession[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored) as BatchQRSession[];
      
      // Remove expired sessions
      const now = Date.now();
      const expiryMs = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      
      return sessions.filter(session => 
        (now - session.updatedAt) < expiryMs
      );
    } catch (error) {
      console.error('Error reading batch sessions:', error);
      return [];
    }
  },

  /**
   * Get specific session
   */
  getSession(sessionId: string): BatchQRSession | null {
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  },

  /**
   * Save session to storage
   */
  saveSession(session: BatchQRSession): void {
    try {
      const sessions = this.getAllSessions();
      const index = sessions.findIndex(s => s.id === session.id);
      
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push(session);
      }

      // Keep only last 10 sessions
      const recentSessions = sessions.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSessions));
    } catch (error) {
      console.error('Error saving batch session:', error);
    }
  },

  /**
   * Delete session
   */
  deleteSession(sessionId: string): void {
    try {
      const sessions = this.getAllSessions();
      const filtered = sessions.filter(s => s.id !== sessionId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting batch session:', error);
    }
  },

  /**
   * Clear all expired sessions
   */
  clearExpiredSessions(): void {
    try {
      const sessions = this.getAllSessions();
      const now = Date.now();
      const expiryMs = SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      
      const filtered = sessions.filter(session => 
        (now - session.updatedAt) < expiryMs
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error clearing expired sessions:', error);
    }
  },

  /**
   * Export session as JSON
   */
  exportSessionAsJSON(sessionId: string): string {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return JSON.stringify(session, null, 2);
  },

  /**
   * Export session items as CSV
   */
  exportSessionAsCSV(sessionId: string): string {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const headers = ['Input', 'QR Value', 'Type', 'Created Date'];
    const rows = session.items.map(item => [
      `"${item.input.replace(/"/g, '""')}"`,
      `"${item.qrValue.replace(/"/g, '""')}"`,
      item.type,
      new Date(item.timestamp).toLocaleString(),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  },
};
