import React from 'react';
import { 
  ChevronRight, 
  Folder, 
  Image as ImageIcon, 
  Calendar, 
  User, 
  ArrowLeft, 
  RefreshCw 
} from 'lucide-react';

const Dashboard = ({ 
  view = 'users', 
  data = [], 
  path = { user: null, date: null }, 
  loading = false, 
  onNavigate = () => {}, 
  onBack = () => {}, 
  onSelectImage = () => {},
  onRefresh = () => {} 
}) => {
  
  const renderBreadcrumbs = () => {
    return (
      <div className="flex items-center gap-1 text-xs md:text-sm text-slate-400 mt-1">
        <span 
          className="hover:text-blue-400 cursor-pointer transition-colors"
          onClick={() => onNavigate('users')}
        >
          Root
        </span>
        {path.user && (
          <>
            <ChevronRight size={14} className="text-slate-600" />
            <span 
              className="hover:text-blue-400 cursor-pointer transition-colors max-w-[100px] truncate"
              onClick={() => onNavigate('dates', path.user)}
            >
              {path.user}
            </span>
          </>
        )}
        {path.date && (
          <>
            <ChevronRight size={14} className="text-slate-600" />
            <span 
              className="hover:text-blue-400 cursor-pointer transition-colors"
              onClick={() => onNavigate('images', path.user, path.date)}
            >
              {path.date}
            </span>
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-[400px] gap-4">
          <RefreshCw className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-400 animate-pulse text-sm">Loading archive...</p>
        </div>
      );
    }

    // Common list container for users and dates
    const ListContainer = ({ children }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-500">
        {children}
      </div>
    );

    if (view === 'users') {
      return (
        <ListContainer>
          {data.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500">
              No users found in /tmp/ScreenShort/
            </div>
          ) : (
            data.map((user) => (
              <div 
                key={user} 
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group"
                onClick={() => onNavigate('dates', user)}
              >
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{user}</div>
                  <div className="text-xs text-slate-500">Device Directory</div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
            ))
          )}
        </ListContainer>
      );
    }

    if (view === 'dates') {
      return (
        <ListContainer>
          {data.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500">
              No dates found for this user
            </div>
          ) : (
            data.map((date) => (
              <div 
                key={date} 
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group"
                onClick={() => onNavigate('images', path.user, date)}
              >
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Calendar size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{date}</div>
                  <div className="text-xs text-slate-500">Screenshot Date</div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
              </div>
            ))
          )}
        </ListContainer>
      );
    }

    if (view === 'images') {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-in fade-in duration-500">
          {data.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500">
              No images found for this date
            </div>
          ) : (
            data.map((img) => (
              <div 
                key={img} 
                className="group relative flex flex-col rounded-xl overflow-hidden bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer"
                onClick={() => onSelectImage(`${path.user}/${path.date}/${img}`)}
              >
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  <ImageIcon size={40} className="text-slate-700 group-hover:text-blue-500/30 transition-colors" />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                </div>
                <div className="p-3 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700/50">
                  <h3 className="text-xs font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                    {img}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navbar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {view !== 'users' && (
              <button 
                onClick={onBack} 
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all shadow-lg"
                title="Go Back"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Screenshot Archive
              </h2>
              {renderBreadcrumbs()}
            </div>
          </div>
          
          <button 
            onClick={onRefresh} 
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </header>

        {/* Content Panel */}
        <main className="relative min-h-[500px] p-6 rounded-3xl bg-slate-900/30 border border-slate-800/50 backdrop-blur-sm">
          {/* Subtle background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />
          
          <div className="relative z-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;