import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export const QuickStats: React.FC<{
  onOpenDashboard: () => void;
}> = ({ onOpenDashboard }) => {
  const [summary, setSummary] = useState(analyticsService.getAnalyticsSummary());

  // Update stats when component mounts or when generation happens
  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(analyticsService.getAnalyticsSummary());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGenerationUpdate = () => {
    setSummary(analyticsService.getAnalyticsSummary());
  };

  // Expose method to update stats (can be called from parent)
  useEffect(() => {
    (window as any).updateQuickStats = handleGenerationUpdate;
    return () => {
      delete (window as any).updateQuickStats;
    };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
      {/* Total Generated */}
      <button
        onClick={onOpenDashboard}
        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 bg-blue-100 rounded group-hover:bg-blue-200 transition-colors">
            <TrendingUp size={16} className="text-blue-600" />
          </div>
          <span className="text-xs font-semibold text-gray-500">TOTAL</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{summary.totalQRCodes}</p>
        <p className="text-xs text-gray-600 mt-1">Generated</p>
      </button>

      {/* Generated Today */}
      <button
        onClick={onOpenDashboard}
        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-green-300 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 bg-green-100 rounded group-hover:bg-green-200 transition-colors">
            <Clock size={16} className="text-green-600" />
          </div>
          <span className="text-xs font-semibold text-gray-500">TODAY</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{summary.generatedToday}</p>
        <p className="text-xs text-gray-600 mt-1">This Session</p>
      </button>

      {/* Most Used Type */}
      <button
        onClick={onOpenDashboard}
        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 bg-purple-100 rounded group-hover:bg-purple-200 transition-colors">
            <BarChart3 size={16} className="text-purple-600" />
          </div>
          <span className="text-xs font-semibold text-gray-500">TYPE</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 truncate">
          {summary.mostUsedType ? summary.mostUsedType.charAt(0).toUpperCase() + summary.mostUsedType.slice(1) : 'N/A'}
        </p>
        <p className="text-xs text-gray-600 mt-1">Most Used</p>
      </button>

      {/* Most Used Format */}
      <button
        onClick={onOpenDashboard}
        className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all text-left group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="p-1.5 bg-orange-100 rounded group-hover:bg-orange-200 transition-colors">
            <AlertCircle size={16} className="text-orange-600" />
          </div>
          <span className="text-xs font-semibold text-gray-500">FORMAT</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 uppercase">
          {summary.mostUsedFormat || 'N/A'}
        </p>
        <p className="text-xs text-gray-600 mt-1">Preferred</p>
      </button>
    </div>
  );
};
