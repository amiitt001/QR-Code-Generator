import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Share2, 
  Eye, 
  TrendingUp, 
  Clock,
  QrCode,
  Calendar,
  Activity,
  Zap,
  Layers,
  FileText,
  Trash2,
  RefreshCw,
  ArrowUpRight,
  Award,
  Target,
  Sparkles
} from 'lucide-react';
import { analyticsService, QRAnalytics } from '../services/analyticsService';
import { batchQRService, BatchQRSession } from '../services/batchQRService';

export const Dashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<QRAnalytics | null>(null);
  const [sessions, setSessions] = useState<BatchQRSession[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = () => {
    setAnalytics(analyticsService.getAnalytics());
    setSessions(batchQRService.getAllSessions());
  };

  const handleResetAnalytics = () => {
    if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      analyticsService.resetAnalytics();
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('Delete this session?')) {
      batchQRService.deleteSession(sessionId);
      setRefreshKey(prev => prev + 1);
    }
  };

  const summary = analyticsService.getAnalyticsSummary();

  // Calculate additional metrics
  const downloadRate = analytics ? 
    (analytics.totalDownloads / (analytics.totalGenerated || 1) * 100).toFixed(1) : '0';
  const shareRate = analytics ? 
    (analytics.totalShares / (analytics.totalGenerated || 1) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <BarChart3 className="text-white" size={28} />
            </div>
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Track your QR code generation and usage statistics
          </p>
        </div>
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all"
        >
          <RefreshCw size={18} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Generated */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <QrCode size={24} />
            </div>
            <ArrowUpRight size={20} className="opacity-70" />
          </div>
          <div className="text-4xl font-bold mb-1">
            {analytics?.totalGenerated || 0}
          </div>
          <p className="text-blue-100 text-sm font-medium">Total QR Codes</p>
        </div>

        {/* Downloads */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Download size={24} />
            </div>
            <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
              {downloadRate}%
            </span>
          </div>
          <div className="text-4xl font-bold mb-1">
            {analytics?.totalDownloads || 0}
          </div>
          <p className="text-green-100 text-sm font-medium">Downloads</p>
        </div>

        {/* Shares */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Share2 size={24} />
            </div>
            <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded">
              {shareRate}%
            </span>
          </div>
          <div className="text-4xl font-bold mb-1">
            {analytics?.totalShares || 0}
          </div>
          <p className="text-purple-100 text-sm font-medium">Shares</p>
        </div>

        {/* Scans */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Eye size={24} />
            </div>
            <Sparkles size={20} className="opacity-70" />
          </div>
          <div className="text-4xl font-bold mb-1">
            {analytics?.totalScans || 0}
          </div>
          <p className="text-orange-100 text-sm font-medium">Scans Tracked</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Types Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">QR Code Types</h3>
          </div>

          {analytics && Object.entries(analytics.byType).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(analytics.byType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => {
                  const percentage = (count / analytics.totalGenerated * 100).toFixed(1);
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {type}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Layers size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No data available yet</p>
            </div>
          )}
        </div>

        {/* Export Formats Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Export Formats</h3>
          </div>

          {analytics && Object.entries(analytics.byFormat).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(analytics.byFormat)
                .sort(([, a], [, b]) => b - a)
                .map(([format, count]) => {
                  const percentage = (count / analytics.totalGenerated * 100).toFixed(1);
                  return (
                    <div key={format}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 uppercase">
                          {format}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Session Duration */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={18} className="text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Session Time</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics ? Math.round(analytics.sessionDuration / 1000 / 60) : 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Minutes Active</p>
        </div>

        {/* Most Used Type */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target size={18} className="text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Favorite Type</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900 capitalize">
            {summary.mostUsedType || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">Most Generated</p>
        </div>

        {/* Last Used */}
        <div className="bg-white rounded-lg p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar size={18} className="text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Last Active</h4>
          </div>
          <p className="text-lg font-bold text-gray-900">
            {analytics ? new Date(analytics.lastUsed).toLocaleDateString() : 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {analytics ? new Date(analytics.lastUsed).toLocaleTimeString() : ''}
          </p>
        </div>
      </div>

      {/* Batch Sessions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Activity size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Batch Sessions</h3>
          </div>
          <span className="text-sm font-semibold text-gray-500">
            {sessions.length} Active
          </span>
        </div>

        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{session.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <QrCode size={14} />
                      {session.items.length} items
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Activity size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No batch sessions yet</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Reset Statistics</h3>
            <p className="text-sm text-gray-600">
              Clear all analytics data and start fresh. This action cannot be undone.
            </p>
          </div>
          <button
            onClick={handleResetAnalytics}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Trash2 size={18} />
            Reset All
          </button>
        </div>
      </div>

      {/* Achievement Badge (Fun Element) */}
      {analytics && analytics.totalGenerated > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-yellow-400 rounded-full">
              <Award size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {analytics.totalGenerated >= 100 ? '🏆 Power User!' : 
                 analytics.totalGenerated >= 50 ? '🌟 QR Master!' : 
                 analytics.totalGenerated >= 10 ? '⚡ Getting Started!' : 
                 '🎯 First Steps!'}
              </h3>
              <p className="text-sm text-gray-700 mt-1">
                You've generated <strong>{analytics.totalGenerated}</strong> QR codes. Keep it up!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
