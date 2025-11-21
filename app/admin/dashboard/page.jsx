"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStats } from "@/lib/hooks/useAdminStats";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const AdminDashboard = () => {
  const router = useRouter();
  const { 
    stats, 
    popularSearches, 
    performance, 
    visitors, 
    ads, 
    resetDailyStats,
    exportStats,
    clearStats,
    loading,
    error,
    refreshStats 
  } = useAdminStats();

  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Secure authentication check
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (api.isAdminAuthenticated()) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login");
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setLastRefresh(new Date());
      refreshStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, refreshStats]);

  const handleLogout = () => {
    api.adminLogout();
    router.push("/admin/login");
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num || 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const handleExport = async () => {
    try {
      await exportStats();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed: ' + error.message);
    }
  };

  const handleClearStats = async () => {
    if (window.confirm('Are you sure you want to clear all statistics? This action cannot be undone.')) {
      try {
        await clearStats();
        alert('Statistics cleared successfully');
      } catch (error) {
        console.error('Clear stats failed:', error);
        alert('Failed to clear statistics: ' + error.message);
      }
    }
  };

  const handleResetDaily = async () => {
    if (window.confirm('Reset daily statistics? This will reset today\'s counters.')) {
      try {
        await resetDailyStats();
        alert('Daily statistics reset successfully');
      } catch (error) {
        console.error('Reset daily failed:', error);
        alert('Failed to reset daily statistics: ' + error.message);
      }
    }
  };

  // StatCard component with safe color classes
  const StatCard = ({ title, value, subtitle, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-600 to-blue-800',
      green: 'from-green-600 to-green-800',
      purple: 'from-purple-600 to-purple-800',
      yellow: 'from-yellow-600 to-yellow-800',
      red: 'from-red-600 to-red-800'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-6 text-white shadow-lg`}
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm opacity-90">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
          </div>
          <div className="text-3xl opacity-80">
            {icon}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 shadow-lg">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-100">
                Bookwise Analytics & Statistics
                <span className="ml-4 text-sm">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              </p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleResetDaily}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-600"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Daily'}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto p-4">
          <div className="bg-red-900/30 text-red-300 p-4 rounded-lg border border-red-800/50">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-700 bg-gray-800 sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto">
            {['overview', 'visitors', 'searches', 'ads', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors whitespace-nowrap capitalize ${
                  activeTab === tab
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-gray-300">Loading statistics...</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="container mx-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Visitors"
                  value={formatNumber(visitors?.total)}
                  subtitle="All time"
                  icon="👥"
                  color="blue"
                />
                <StatCard
                  title="Today's Visitors"
                  value={formatNumber(visitors?.today)}
                  subtitle="Unique visits"
                  icon="📊"
                  color="green"
                />
                <StatCard
                  title="Total Searches"
                  value={formatNumber(stats.searches?.total)}
                  subtitle="All searches"
                  icon="🔍"
                  color="purple"
                />
                <StatCard
                  title="Ad Revenue"
                  value={formatCurrency(ads?.revenue)}
                  subtitle="Total earnings"
                  icon="💰"
                  color="yellow"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Searches */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Top Popular Searches</h3>
                  <div className="space-y-3">
                    {popularSearches && popularSearches.slice(0, 8).map((search, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
                        <div className="flex items-center space-x-4">
                          <span className="text-gray-500 w-6 text-center text-sm">{index + 1}</span>
                          <span className="text-gray-300 truncate flex-1">{search.query}</span>
                        </div>
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium min-w-12 text-center">
                          {search.count}
                        </span>
                      </div>
                    ))}
                    {(!popularSearches || popularSearches.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No search data available</p>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">System Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Success Rate</span>
                      <span className="text-green-400 font-medium text-lg">
                        {performance?.successRate?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Average Load Time</span>
                      <span className="text-blue-400 font-medium text-lg">
                        {performance?.averageLoadTime?.toFixed(0) || 0}ms
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">PDF Uploads</span>
                      <span className="text-purple-400 font-medium text-lg">
                        {performance?.pdfUploads || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Failed Searches</span>
                      <span className="text-red-400 font-medium text-lg">
                        {performance?.failedSearches || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Visitors Tab */}
          {activeTab === 'visitors' && visitors && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Unique Visitors"
                  value={formatNumber(visitors.unique)}
                  subtitle="All time"
                  icon="👤"
                  color="blue"
                />
                <StatCard
                  title="Today's Visits"
                  value={formatNumber(visitors.today)}
                  subtitle="Daily total"
                  icon="📈"
                  color="green"
                />
                <StatCard
                  title="Total Visits"
                  value={formatNumber(visitors.total)}
                  subtitle="All visits"
                  icon="🌐"
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Devices */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Visitor Devices</h3>
                  <div className="space-y-3">
                    {visitors.byDevice && Object.entries(visitors.byDevice).map(([device, count]) => (
                      <div key={device} className="flex justify-between items-center py-2">
                        <span className="text-gray-300 capitalize">{device}</span>
                        <span className="text-blue-400 font-medium">{count}</span>
                      </div>
                    ))}
                    {(!visitors.byDevice || Object.keys(visitors.byDevice).length === 0) && (
                      <p className="text-gray-500 text-center py-4">No device data available</p>
                    )}
                  </div>
                </div>

                {/* Browsers */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">Visitor Browsers</h3>
                  <div className="space-y-3">
                    {visitors.byBrowser && Object.entries(visitors.byBrowser).map(([browser, count]) => (
                      <div key={browser} className="flex justify-between items-center py-2">
                        <span className="text-gray-300">{browser}</span>
                        <span className="text-green-400 font-medium">{count}</span>
                      </div>
                    ))}
                    {(!visitors.byBrowser || Object.keys(visitors.byBrowser).length === 0) && (
                      <p className="text-gray-500 text-center py-4">No browser data available</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Searches Tab */}
          {activeTab === 'searches' && stats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Searches"
                  value={formatNumber(stats.searches?.total)}
                  subtitle="All time"
                  icon="🔍"
                  color="blue"
                />
                <StatCard
                  title="Today's Searches"
                  value={formatNumber(stats.searches?.today)}
                  subtitle="Daily searches"
                  icon="📊"
                  color="green"
                />
                <StatCard
                  title="Success Rate"
                  value={`${performance?.successRate?.toFixed(1) || 0}%`}
                  subtitle="Successful searches"
                  icon="✅"
                  color="purple"
                />
              </div>

              {/* Popular Searches */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">Top Popular Searches</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularSearches && popularSearches.map((search, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 text-sm">#{index + 1}</span>
                        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
                          {search.count}
                        </span>
                      </div>
                      <p className="text-white text-sm truncate" title={search.query}>
                        {search.query}
                      </p>
                    </div>
                  ))}
                  {(!popularSearches || popularSearches.length === 0) && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No search data available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Ads Tab */}
          {activeTab === 'ads' && ads && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Impressions"
                  value={formatNumber(ads.impressions)}
                  subtitle="Total views"
                  icon="👁️"
                  color="blue"
                />
                <StatCard
                  title="Clicks"
                  value={formatNumber(ads.clicks)}
                  subtitle="Total clicks"
                  icon="🖱️"
                  color="green"
                />
                <StatCard
                  title="CTR"
                  value={`${ads.ctr?.toFixed(2) || 0}%`}
                  subtitle="Click-through rate"
                  icon="📈"
                  color="purple"
                />
                <StatCard
                  title="Revenue"
                  value={formatCurrency(ads.revenue)}
                  subtitle="Total earnings"
                  icon="💰"
                  color="yellow"
                />
              </div>

              {/* Ad Positions */}
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">Performance by Ad Position</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.byPosition && Object.entries(ads.byPosition).map(([position, data]) => (
                    <div key={position} className="bg-gray-700 rounded-xl p-4 border border-gray-600">
                      <h4 className="text-white font-medium mb-3 capitalize text-center">{position}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Impressions:</span>
                          <span className="text-white">{data.impressions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Clicks:</span>
                          <span className="text-green-400">{data.clicks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">CTR:</span>
                          <span className="text-purple-400">
                            {data.impressions > 0 ? ((data.clicks / data.impressions) * 100).toFixed(2) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-yellow-400">{formatCurrency(data.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!ads.byPosition || Object.keys(ads.byPosition).length === 0) && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">No ad position data available</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && performance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Avg Load Time"
                  value={`${performance.averageLoadTime?.toFixed(0) || 0}ms`}
                  subtitle="API response"
                  icon="⚡"
                  color="blue"
                />
                <StatCard
                  title="Success Rate"
                  value={`${performance.successRate?.toFixed(1) || 0}%`}
                  subtitle="Search success"
                  icon="✅"
                  color="green"
                />
                <StatCard
                  title="PDF Uploads"
                  value={formatNumber(performance.pdfUploads)}
                  subtitle="Total uploads"
                  icon="📄"
                  color="purple"
                />
                <StatCard
                  title="Failed Searches"
                  value={formatNumber(performance.failedSearches)}
                  subtitle="Errors"
                  icon="❌"
                  color="red"
                />
              </div>

              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-6">Search Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-gray-300 mb-4 text-lg">Success vs Failure Rate</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-green-400">Successful Searches</span>
                        <span className="text-white font-medium">{performance.successfulSearches || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-red-400">Failed Searches</span>
                        <span className="text-white font-medium">{performance.failedSearches || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-300">Total Operations</span>
                        <span className="text-white font-medium">
                          {(performance.successfulSearches || 0) + (performance.failedSearches || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-gray-300 mb-4 text-lg">System Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-300">PDF Processing</span>
                        <span className="text-white font-medium">{performance.pdfUploads || 0}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-700">
                        <span className="text-gray-300">Response Time</span>
                        <span className="text-blue-400 font-medium">
                          {performance.averageLoadTime?.toFixed(0) || 0}ms
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-300">Uptime</span>
                        <span className="text-green-400 font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-700 p-6 bg-gray-800 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              Data updates automatically every 30 seconds • Bookwise Admin Panel v1.0
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                disabled={loading}
              >
                {loading ? 'Exporting...' : 'Export Data'}
              </Button>
              <Button
                onClick={handleClearStats}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                disabled={loading}
              >
                {loading ? 'Clearing...' : 'Clear Stats'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;