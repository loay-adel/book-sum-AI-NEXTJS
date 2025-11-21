
import { useState } from 'react';
import { useUserData } from '@/lib/hooks/useUserData';
import { useLanguage } from '@/lib/context/LanguageContext';

export const UserProfile = () => {
  const { lang } = useLanguage();
  const { 
    userData, 
    searchHistory, 
    savedSummaries, 
    deleteSummary, 
    clearData,
    exportData,
    loading 
  } = useUserData();

  const [activeTab, setActiveTab] = useState('summaries');

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">
            {userData?.activityStats?.totalSearches || 0}
          </div>
          <div className="text-gray-400 text-sm">
            {lang === 'en' ? 'Searches' : 'عمليات البحث'}
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {userData?.activityStats?.totalSummaries || 0}
          </div>
          <div className="text-gray-400 text-sm">
            {lang === 'en' ? 'Saved Summaries' : 'الملخصات المحفوظة'}
          </div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-sm text-gray-400">
            {lang === 'en' ? 'Last Active' : 'آخر نشاط'}
          </div>
          <div className="text-gray-300 text-sm">
            {userData?.activityStats?.lastActive ? 
              new Date(userData.activityStats.lastActive).toLocaleDateString() : 
              'N/A'
            }
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'summaries' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('summaries')}
        >
          {lang === 'en' ? 'Saved Summaries' : 'الملخصات المحفوظة'}
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'history' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('history')}
        >
          {lang === 'en' ? 'Search History' : 'سجل البحث'}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'summaries' && (
        <div className="space-y-4">
          {savedSummaries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {lang === 'en' ? 'No saved summaries yet' : 'لا توجد ملخصات محفوظة بعد'}
            </div>
          ) : (
            savedSummaries.map((summary, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-white">{summary.book.title}</h4>
                    {summary.book.author && (
                      <p className="text-gray-400 text-sm">
                        {lang === 'en' ? 'by' : 'بواسطة'} {summary.book.author}
                      </p>
                    )}
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {summary.summary}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSummary(summary.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {searchHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {lang === 'en' ? 'No search history yet' : 'لا يوجد سجل بحث بعد'}
            </div>
          ) : (
            searchHistory.map((search, index) => (
              <div key={index} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-white">{search.query}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(search.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  search.success ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                }`}>
                  {search.success ? 'Success' : 'Failed'}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={exportData}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
        >
          {lang === 'en' ? 'Export Data' : 'تصدير البيانات'}
        </button>
        <button
          onClick={clearData}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
        >
          {lang === 'en' ? 'Clear Data' : 'مسح البيانات'}
        </button>
      </div>
    </div>
  );
};