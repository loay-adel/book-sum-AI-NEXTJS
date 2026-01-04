"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStats } from "@/lib/hooks/useAdminStats";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Users, 
  Search, 
  BarChart3, 
  Shield, 
  Settings,
  FileText,
  Eye,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Download,
  Trash2,
  User,
  Globe,
  Smartphone,
  CheckCircle,
  XCircle,
  Upload,
  BookOpen,
  Edit,
  ThumbsUp,
  Tag,
  Calendar,
  UserCheck,
  Zap,
  BarChart,
  Layers,
  Database,
  Activity,
  ChevronRight,
  Sparkles,
  Target,
  Cpu,
  Server,
  ShieldCheck,
  Rocket,
  Zap as ZapIcon,
  Crown,
  Star
} from "lucide-react";
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
    refreshStats,
    checkAuth
  } = useAdminStats();

  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Enhanced authentication check with session validation
  useEffect(() => {
   
    
    const validateSession = async () => {
      try {
        setIsLoading(true);
        
        const isLocallyAuthenticated = api.isAdminAuthenticated();

        
        if (!isLocallyAuthenticated) {
          router.push("/admin/login");
          return;
        }
        
        // Verify with server
        const isValid = await checkAuth();
        
        if (!isValid) {
          router.push("/admin/login");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('🔴 Session validation error:', error);
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [router, checkAuth]);

  // Auto-refresh every 30 seconds with loading indicator
  useEffect(() => {
    if (!isAuthenticated || loading) return;


    const interval = setInterval(() => {
      setLastRefresh(new Date());
      refreshStats();
    }, 300000);

    return () => {

      clearInterval(interval);
    };
  }, [isAuthenticated, loading, refreshStats]);

  const handleLogout = async () => {
    try {
      await api.adminLogout();
      router.push("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      router.push("/admin/login");
    }
  };

  const handleRefresh = async () => {
    setLastRefresh(new Date());
    await refreshStats();
  };

  // Formatting helpers
  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (ms) => {
    if (ms === null || ms === undefined || isNaN(ms)) return '0ms';
    return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
  };

  // StatCard Component - Enhanced with glass morphism
  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend = null, sparkle = false }) => {
    const colorClasses = {
      blue: 'from-blue-500/20 via-blue-600/10 to-blue-700/5 border-blue-500/30',
      green: 'from-green-500/20 via-green-600/10 to-green-700/5 border-green-500/30',
      purple: 'from-purple-500/20 via-purple-600/10 to-purple-700/5 border-purple-500/30',
      yellow: 'from-yellow-500/20 via-yellow-600/10 to-yellow-700/5 border-yellow-500/30',
      red: 'from-red-500/20 via-red-600/10 to-red-700/5 border-red-500/30',
      indigo: 'from-indigo-500/20 via-indigo-600/10 to-indigo-700/5 border-indigo-500/30',
      pink: 'from-pink-500/20 via-pink-600/10 to-pink-700/5 border-pink-500/30',
      cyan: 'from-cyan-500/20 via-cyan-600/10 to-cyan-700/5 border-cyan-500/30',
      teal: 'from-teal-500/20 via-teal-600/10 to-teal-700/5 border-teal-500/30',
      orange: 'from-orange-500/20 via-orange-600/10 to-orange-700/5 border-orange-500/30'
    };

    const iconColors = {
      blue: 'text-blue-400',
      green: 'text-green-400',
      purple: 'text-purple-400',
      yellow: 'text-yellow-400',
      red: 'text-red-400',
      indigo: 'text-indigo-400',
      pink: 'text-pink-400',
      cyan: 'text-cyan-400',
      teal: 'text-teal-400',
      orange: 'text-orange-400'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -2 }}
        className={`relative bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden group`}
      >
        {/* Glow effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${colorClasses[color]} opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500`}></div>
        
        {/* Sparkle effect */}
        {sparkle && (
          <div className="absolute top-2 right-2">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" />
          </div>
        )}

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl bg-white/5 ${iconColors[color]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-white/90">{title}</h3>
            </div>
            {trend !== null && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                trend > 0 ? 'bg-green-900/30 text-green-300 border border-green-700/50' : 
                trend < 0 ? 'bg-red-900/30 text-red-300 border border-red-700/50' : 
                'bg-gray-800 text-gray-300 border border-gray-700'
              }`}>
                {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          
          <div className="mt-4">
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-white/60">{subtitle}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state - Enhanced with particle animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
            <div className="relative">
              <Shield className="h-20 w-20 text-blue-400 mx-auto mb-4" />
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Admin Access</h2>
            <p className="text-gray-400">Checking session security...</p>
          </div>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-2 w-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Calculate derived statistics
  const totalSearches = (performance?.successfulSearches || 0) + (performance?.failedSearches || 0);
  const successRate = performance?.successRate || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header with animated gradient */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/10 to-cyan-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 bg-blue-400 rounded-full"
              animate={{
                y: [0, 100, 0],
                x: [0, Math.sin(i) * 50, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + i,
                delay: i * 0.5
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: '10%'
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-50"></div>
                <div className="relative p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
              </motion.div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Secure Admin Dashboard
                  </h1>
                  <div className="px-2 py-1 bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-full border border-blue-500/30">
                    <span className="text-xs text-blue-300 font-medium">PRO</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-1 flex items-center space-x-2">
                  <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                  {loading && (
                    <>
                      <span>•</span>
                      <span className="text-yellow-300 animate-pulse flex items-center">
                        <span className="h-2 w-2 bg-yellow-300 rounded-full mr-1"></span>
                        Updating...
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl flex items-center space-x-2 disabled:opacity-50 border border-gray-700 shadow-lg"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="font-medium">Refresh</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl flex items-center space-x-2 border border-red-700 shadow-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Navigation Tabs */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-3 mb-8">
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="flex space-x-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-1 border border-gray-700 shadow-xl">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
              { id: 'visitors', label: 'Visitors', icon: Users, color: 'from-green-500 to-emerald-500' },
              { id: 'searches', label: 'Searches', icon: Search, color: 'from-purple-500 to-pink-500' },
              { id: 'performance', label: 'Performance', icon: Activity, color: 'from-orange-500 to-yellow-500' },
              { id: 'ads', label: 'Ads Revenue', icon: DollarSign, color: 'from-yellow-500 to-amber-500' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all rounded-xl relative ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl shadow-lg`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`h-5 w-5 relative z-10 ${isActive ? 'text-white' : ''}`} />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Error Display - Enhanced */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-6"
            >
              <div className="bg-gradient-to-r from-red-900/30 to-red-800/20 border border-red-700/50 rounded-2xl p-5 flex items-center space-x-4 backdrop-blur-xl shadow-lg">
                <div className="p-3 bg-red-500/20 rounded-xl">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-300 font-semibold">Error Loading Statistics</p>
                  <p className="text-red-400/80 text-sm mt-1">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Visitors"
                    value={formatNumber(visitors?.total || 0)}
                    subtitle="All time unique visitors"
                    icon={Users}
                    color="blue"
                    trend={12.5}
                    sparkle={true}
                  />
                  <StatCard
                    title="Today's Visits"
                    value={formatNumber(visitors?.today || 0)}
                    subtitle="Active today"
                    icon={Eye}
                    color="green"
                    trend={5.3}
                  />
                  <StatCard
                    title="Total Searches"
                    value={formatNumber(totalSearches)}
                    subtitle={`${successRate.toFixed(1)}% success rate`}
                    icon={Search}
                    color="purple"
                    trend={8.7}
                  />
                  <StatCard
                    title="Success Rate"
                    value={formatPercentage(successRate)}
                    subtitle="Search success percentage"
                    icon={Target}
                    color="teal"
                    trend={2.1}
                  />
                  <StatCard
                    title="PDF Uploads"
                    value={formatNumber(performance?.pdfUploads || 0)}
                    subtitle="Total documents processed"
                    icon={Upload}
                    color="cyan"
                  />
                  <StatCard
                    title="Avg Load Time"
                    value={formatTime(performance?.averageLoadTime || 0)}
                    subtitle="Average response time"
                    icon={ZapIcon}
                    color="orange"
                    trend={-1.2}
                  />
                </div>

                {/* Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Popular Searches - Enhanced */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-3xl p-7 border border-gray-700/50 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-full -translate-y-16 translate-x-16"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Top Searches</h3>
                            <p className="text-sm text-gray-400">Most popular queries</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">
                          <span className="text-xs text-gray-300 font-medium">Last 24 hours</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {popularSearches?.slice(0, 5).map((search, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800/30 to-transparent rounded-xl border border-gray-700/30 hover:border-purple-500/30 transition-all group"
                          >
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                              <div className="relative">
                                <div className="h-8 w-8 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                                  <span className="text-sm font-bold text-white">{index + 1}</span>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-200 font-medium truncate" title={search.query}>
                                  {search.query}
                                </p>
                                <p className="text-xs text-gray-500">Total searches</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className="text-lg font-bold text-white">{search.count}</span>
                              <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                            </div>
                          </motion.div>
                        ))}
                        
                        {(!popularSearches || popularSearches.length === 0) && (
                          <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl mb-4">
                              <Search className="h-12 w-12 text-gray-600" />
                            </div>
                            <p className="text-gray-500 font-medium">No search data available</p>
                            <p className="text-gray-600 text-sm mt-1">Search data will appear here once users start searching</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Performance Metrics - Enhanced */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-3xl p-7 border border-gray-700/50 backdrop-blur-xl shadow-2xl overflow-hidden"
                  >
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-full translate-y-16 -translate-x-16"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl">
                            <Cpu className="h-6 w-6 text-cyan-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">System Health</h3>
                            <p className="text-sm text-gray-400">Performance metrics</p>
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
                          <span className="text-xs text-green-300 font-medium flex items-center">
                            <div className="h-1.5 w-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></div>
                            Healthy
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { 
                            label: 'Success Rate', 
                            value: formatPercentage(successRate), 
                            icon: CheckCircle, 
                            color: 'from-green-500 to-emerald-500',
                            progress: successRate / 100
                          },
                          { 
                            label: 'Avg Load Time', 
                            value: formatTime(performance?.averageLoadTime || 0), 
                            icon: Clock, 
                            color: 'from-blue-500 to-cyan-500',
                            progress: Math.min((performance?.averageLoadTime || 0) / 5000, 1)
                          },
                          { 
                            label: 'PDF Uploads', 
                            value: formatNumber(performance?.pdfUploads || 0), 
                            icon: FileText, 
                            color: 'from-purple-500 to-pink-500',
                            progress: Math.min((performance?.pdfUploads || 0) / 100, 1)
                          },
                          { 
                            label: 'Failures', 
                            value: formatNumber(performance?.failedSearches || 0), 
                            icon: XCircle, 
                            color: 'from-red-500 to-orange-500',
                            progress: Math.min((performance?.failedSearches || 0) / 50, 1)
                          }
                        ].map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-5 border border-gray-700/30 hover:border-gray-600/50 transition-all group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className={`p-2 bg-gradient-to-r ${metric.color} bg-opacity-20 rounded-lg`}>
                                <metric.icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="text-xs text-gray-500">Score</span>
                            </div>
                            
                            <div className="mb-2">
                              <p className="text-2xl font-bold text-white">{metric.value}</p>
                              <p className="text-xs text-gray-400">{metric.label}</p>
                            </div>
                            
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.progress * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full bg-gradient-to-r ${metric.color} rounded-full`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}

            {/* Other tabs with enhanced styling */}
            {['visitors', 'searches', 'performance', 'ads'].map((tab) => (
              activeTab === tab && (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-3xl p-8 border border-gray-700/50 backdrop-blur-xl shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -translate-y-20 translate-x-20"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full translate-y-20 -translate-x-20"></div>
                  
                  <div className="relative z-10">
                    {tab === 'visitors' && (
                      <VisitorAnalytics visitors={visitors} formatNumber={formatNumber} />
                    )}
                    
                    {tab === 'searches' && (
                      <SearchAnalytics 
                        totalSearches={totalSearches}
                        performance={performance}
                        formatNumber={formatNumber}
                        formatPercentage={formatPercentage}
                      />
                    )}
                    
                    {tab === 'performance' && (
                      <PerformanceAnalytics 
                        performance={performance}
                        formatTime={formatTime}
                        formatNumber={formatNumber}
                      />
                    )}
                    
                    {tab === 'ads' && (
                      <AdAnalytics 
                        ads={ads}
                        formatCurrency={formatCurrency}
                        formatNumber={formatNumber}
                        formatPercentage={formatPercentage}
                      />
                    )}
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Footer */}
      <footer className="border-t border-gray-800/50 bg-gradient-to-t from-gray-900 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">System Status:</span>
                <span className="text-sm text-green-400 font-medium">Operational</span>
              </div>
              <span className="text-gray-600">•</span>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Session:</span>
                <span className="text-sm text-blue-400 font-medium">Secure</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">
                Auto-refresh: 300s • Session expires in 8h
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Visitor Analytics Component
const VisitorAnalytics = ({ visitors, formatNumber }) => (
  <>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl">
          <Users className="h-6 w-6 text-green-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Visitor Analytics</h3>
          <p className="text-sm text-gray-400">User engagement statistics</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
        <span className="text-sm text-gray-300">Real-time Data</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'Total Visitors', value: formatNumber(visitors?.total || 0), color: 'from-blue-500 to-cyan-500', icon: Globe },
        { title: "Today's Visitors", value: formatNumber(visitors?.today || 0), color: 'from-green-500 to-emerald-500', icon: Eye },
        { title: 'Unique Visitors', value: formatNumber(visitors?.unique || 0), color: 'from-purple-500 to-pink-500', icon: User }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${stat.color} bg-opacity-20 rounded-xl`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">All Time</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-sm text-gray-400">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  </>
);

// Search Analytics Component
const SearchAnalytics = ({ totalSearches, performance, formatNumber, formatPercentage }) => (
  <>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
          <Search className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Search Analytics</h3>
          <p className="text-sm text-gray-400">Search performance and metrics</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-700/50">
        <span className="text-sm text-purple-300 font-medium">High Performance</span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-6">
        {[
          { title: 'Total Searches', value: formatNumber(totalSearches), color: 'from-blue-500 to-cyan-500', icon: BarChart },
          { title: 'Successful Searches', value: formatNumber(performance?.successfulSearches || 0), color: 'from-green-500 to-emerald-500', icon: CheckCircle }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} bg-opacity-20 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="space-y-6">
        {[
          { title: 'Failed Searches', value: formatNumber(performance?.failedSearches || 0), color: 'from-red-500 to-orange-500', icon: XCircle },
          { title: 'Success Rate', value: formatPercentage(performance?.successRate || 0), color: 'from-teal-500 to-cyan-500', icon: Target }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} bg-opacity-20 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </>
);

// Performance Analytics Component
const PerformanceAnalytics = ({ performance, formatTime, formatNumber }) => (
  <>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl">
          <Activity className="h-6 w-6 text-orange-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">System Performance</h3>
          <p className="text-sm text-gray-400">Performance metrics and benchmarks</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl border border-yellow-700/50">
        <span className="text-sm text-yellow-300 font-medium flex items-center">
          <Rocket className="h-3 w-3 mr-1.5" />
          Optimized
        </span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { title: 'Average Load Time', value: formatTime(performance?.averageLoadTime || 0), color: 'from-blue-500 to-cyan-500', icon: Clock, unit: 'ms' },
        { title: 'PDF Uploads', value: formatNumber(performance?.pdfUploads || 0), color: 'from-purple-500 to-pink-500', icon: Upload, unit: 'files' },
        { title: 'Avg Response Time', value: formatTime(performance?.averageLoadTime || 0), color: 'from-teal-500 to-emerald-500', icon: ZapIcon, unit: 'ms' }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30 text-center"
        >
          <div className="inline-flex p-4 mb-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700">
            <stat.icon className="h-8 w-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-sm text-gray-400 mb-2">{stat.title}</p>
          <div className="inline-flex px-3 py-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full border border-gray-700">
            <span className="text-xs text-gray-400">{stat.unit}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </>
);

// Ad Analytics Component
const AdAnalytics = ({ ads, formatCurrency, formatNumber, formatPercentage }) => (
  <>
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-xl">
          <DollarSign className="h-6 w-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">Advertising Revenue</h3>
          <p className="text-sm text-gray-400">Monetization and ad performance</p>
        </div>
      </div>
      <div className="px-4 py-2 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 rounded-xl border border-yellow-700/50">
        <span className="text-sm text-yellow-300 font-medium flex items-center">
          <Crown className="h-3 w-3 mr-1.5" />
          Premium
        </span>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { title: 'Total Revenue', value: formatCurrency(ads?.revenue || 0), color: 'from-yellow-500 to-amber-500', icon: DollarSign },
        { title: 'Impressions', value: formatNumber(ads?.impressions || 0), color: 'from-indigo-500 to-purple-500', icon: Eye },
        { title: 'Clicks', value: formatNumber(ads?.clicks || 0), color: 'from-green-500 to-emerald-500', icon: Target },
        { title: 'CTR', value: formatPercentage(ads?.ctr || 0), color: 'from-pink-500 to-rose-500', icon: TrendingUp }
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-6 border border-gray-700/30 text-center"
        >
          <div className="inline-flex p-3 mb-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-sm text-gray-400">{stat.title}</p>
        </motion.div>
      ))}
    </div>
  </>
);

export default AdminDashboard;