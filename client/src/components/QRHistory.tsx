import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Copy, Download } from 'lucide-react';

export interface QRHistoryItem {
  id: string;
  input: string;
  qrValue: string;
  timestamp: number;
  type: 'text' | 'url' | 'vcard' | 'wifi';
}

const HISTORY_STORAGE_KEY = 'qr_history';
const MAX_HISTORY_ITEMS = 20;

export const QRHistory: React.FC<{
  onSelectItem?: (item: QRHistoryItem) => void;
}> = ({ onSelectItem }) => {
  const [history, setHistory] = useState<QRHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as QRHistoryItem[];
        setHistory(items);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const addToHistory = (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
    try {
      const newItem: QRHistoryItem = {
        ...item,
        id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };

      const items = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
      setHistory(items);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const removeFromHistory = (id: string) => {
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    setHistory(filtered);
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:shadow-md transition-all"
      >
        <Clock size={18} className="text-gray-600" />
        <span className="text-sm font-medium">History</span>
        {history.length > 0 && (
          <span className="ml-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-semibold">
            {history.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent QR Codes</h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Clock size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No history yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {history.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.input.substring(0, 40)}
                          {item.input.length > 40 ? '...' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.qrValue);
                        }}
                        className="flex-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Copy size={12} />
                        Copy
                      </button>
                      <button
                        onClick={() => onSelectItem?.(item)}
                        className="flex-1 text-xs px-2 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Download size={12} />
                        Use
                      </button>
                      <button
                        onClick={() => removeFromHistory(item.id)}
                        className="flex-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const useQRHistory = () => {
  return {
    addToHistory: (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
      try {
        const newItem: QRHistoryItem = {
          ...item,
          id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        const items = stored ? JSON.parse(stored) : [];
        const updated = [newItem, ...items].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
        return newItem;
      } catch (error) {
        console.error('Error adding to history:', error);
        return null;
      }
    },
  };
};
