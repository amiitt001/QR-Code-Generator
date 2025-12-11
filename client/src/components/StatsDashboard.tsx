import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Share2, Eye, TrendingUp } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export const StatsDashboard: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(analyticsService.getAnalyticsSummary());

  useEffect(() => {
    if (isOpen) {
      setStats(analyticsService.getAnalyticsSummary());
    }
  }, [isOpen]);

  const analytics = analyticsService.getAnalytics();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all statistics?')) {
      analyticsService.resetAnalytics();
      setStats(analyticsService.getAnalyticsSummary());
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="text-blue-600" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Statistics</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {analytics?.totalGenerated || 0}
                </div>
                <p className="text-sm text-blue-900 font-medium">Total Generated</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 text-green-600 mb-1">
                  <Download size={20} />
                  <span className="text-2xl font-bold">{analytics?.totalDownloads || 0}</span>
                </div>
                <p className="text-sm text-green-900 font-medium">Downloads</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 text-purple-600 mb-1">
                  <Share2 size={20} />
                  <span className="text-2xl font-bold">{analytics?.totalShares || 0}</span>
                </div>
                <p className="text-sm text-purple-900 font-medium">Shares</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 text-orange-600 mb-1">
                  <Eye size={20} />
                  <span className="text-2xl font-bold">{analytics?.totalScans || 0}</span>
                </div>
                <p className="text-sm text-orange-900 font-medium">Scans</p>
              </div>
            </div>

            {/* Detailed Stats */}
            {analytics && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-blue-600" />
                  Detailed Breakdown
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* By Type */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">By Type</h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.byType).length > 0 ? (
                        Object.entries(analytics.byType)
                          .sort(([, a], [, b]) => b - a)
                          .map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 capitalize">{type}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 transition-all"
                                    style={{
                                      width: `${(count / (analytics.totalGenerated || 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 min-w-10 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-gray-500">No data yet</p>
                      )}
                    </div>
                  </div>

                  {/* By Format */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">By Format</h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.byFormat).length > 0 ? (
                        Object.entries(analytics.byFormat)
                          .sort(([, a], [, b]) => b - a)
                          .map(([format, count]) => (
                            <div key={format} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 uppercase">{format}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{
                                      width: `${(count / (analytics.totalGenerated || 1)) * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-gray-900 min-w-10 text-right">
                                  {count}
                                </span>
                              </div>
                            </div>
                          ))
                      ) : (
                        <p className="text-sm text-gray-500">No data yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Session Info */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Session Duration:</span>{' '}
                    {Math.round(analytics.sessionDuration / 1000 / 60)} minutes
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Last Used:</span>{' '}
                    {new Date(analytics.lastUsed).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
              >
                Reset Stats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
