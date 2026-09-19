import React, { useState } from 'react';
import { 
  Headphones, 
  Search, 
  Lock, 
  Mail, 
  Bell, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  Flame, 
  Tag, 
  Users, 
  Grid, 
  Sparkles,
  ShieldCheck,
  Camera,
  User,
  UserPlus
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatReputation } from '../utils/format';

interface HeaderProps {
  currentUser: UserProfile | null;
  onLogin: (username: string, pass: string) => void;
  onLogout: () => void;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenNewTopic: () => void;
  onOpenAdminPanel?: () => void;
  onOpenEditProfile?: () => void;
  forumTitle?: string;
  forumSubtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenLogin,
  activeNav,
  setActiveNav,
  searchQuery,
  setSearchQuery,
  onOpenNewTopic,
  onOpenAdminPanel,
  onOpenEditProfile,
  forumTitle,
  forumSubtitle,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleQuickLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    onLogin(usernameInput.trim(), passwordInput.trim());
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f2b48] text-white shadow-md border-b border-[#1b3d62]">
      {/* Top micro bar for system status and SSL assurance */}
      <div className="bg-[#091d32] px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              חיבור מאובטח ומאושר (SSL 256-bit)
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-block text-slate-300">
              ברוכים הבאים לפורום המפתחים ומערכות IVR
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-400">גרסת מערכת: v4.8.2-NodeBB</span>
            <span className="text-slate-500">|</span>
            <button 
              onClick={onOpenNewTopic}
              className="text-sky-300 hover:text-white transition-colors underline underline-offset-2"
            >
              פתיחת קריאה / נושא חדש
            </button>
          </div>
        </div>
      </div>

      {/* Main header navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Right side in RTL: Forum Logo & Title */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            <div 
              onClick={() => setActiveNav('categories')}
              className="flex items-center gap-3 cursor-pointer group select-none"
              title="חזרה לעמוד הראשי"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-900/40 text-white group-hover:scale-105 transition-transform duration-200">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors">
                    {forumTitle || 'פורום ימות המשיח'}
                  </span>
                  <span className="bg-sky-500/20 text-sky-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-sky-400/30">
                    תומכים טופ
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-normal">
                  {forumSubtitle || 'קהילת מפתחים, מערכות טלפוניה ו-IVR'}
                </p>
              </div>
            </div>

            {/* Mobile login trigger toggle if small screen */}
            <div className="lg:hidden flex items-center gap-1.5">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser?.name || currentUser?.username || 'פרופיל'} 
                    className="w-7 h-7 rounded-full object-cover border border-sky-400"
                  />
                  <button 
                    onClick={onLogout}
                    className="text-xs text-rose-300 hover:text-white p-1"
                    title="התנתק"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenRegister ? onOpenRegister() : setShowLoginDropdown(!showLoginDropdown)}
                    className="bg-gradient-to-r from-blue-600 to-sky-500 text-white text-xs px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>הרשמה</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenLogin ? onOpenLogin() : setShowLoginDropdown(!showLoginDropdown)}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1 cursor-pointer border border-white/20"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>התחברות</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Links & Quick Search */}
          <div className="flex flex-1 flex-wrap items-center justify-center lg:justify-start gap-1 sm:gap-2 w-full lg:w-auto">
            <nav className="flex items-center gap-1 bg-[#15385d] p-1 rounded-lg border border-[#234b75]">
              <button
                onClick={() => setActiveNav('categories')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeNav === 'categories'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Grid className="w-4 h-4" />
                קטגוריות
              </button>

              <button
                onClick={() => setActiveNav('recent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeNav === 'recent'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                נושאים אחרונים
              </button>

              <button
                onClick={() => setActiveNav('tags')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeNav === 'tags'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Tag className="w-4 h-4" />
                תגיות
              </button>

              <button
                onClick={() => setActiveNav('users')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeNav === 'users'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Users className="w-4 h-4" />
                משתמשים
              </button>

              {/* Admin Panel Nav Tab if logged in as Admin */}
              {currentUser?.isAdmin && (
                <button
                  onClick={onOpenAdminPanel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all border border-rose-400 animate-pulse"
                >
                  <ShieldCheck className="w-4 h-4" />
                  פאנל ניהול
                </button>
              )}
            </nav>

            {/* Quick Search Bar */}
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש מהיר בפורום ובנושאים..."
                className="w-full bg-[#0d2238] border border-[#234b75] rounded-lg py-1.5 pr-8 pl-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* User Area & Quick Login Form (Top End in RTL) */}
          <div className="w-full lg:w-auto flex items-center justify-end">
            {currentUser ? (
              /* Logged In State */
              <div className="flex items-center gap-3 bg-[#15385d] p-1.5 pr-3 pl-2 rounded-xl border border-[#275383] shadow-sm">
                <div 
                  className="relative group cursor-pointer"
                  onClick={onOpenEditProfile}
                  title="לחץ להחלפת תמונת פרופיל ופרטים אישיים"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name || currentUser?.username || 'פרופיל'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-sky-400 shadow group-hover:opacity-80 transition-opacity"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0f2b48] rounded-full"></span>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-wide">
                      {currentUser?.name || currentUser?.username}
                    </span>
                    {currentUser && (
                      <span 
                        title={`מוניטין: ${currentUser.reputation}`}
                        className="text-[10px] font-mono font-bold bg-blue-900/90 text-sky-200 border border-sky-400/40 px-1.5 py-0.5 rounded shadow-2xs"
                      >
                        +{formatReputation(currentUser.reputation)}
                      </span>
                    )}
                    {currentUser?.isAdmin ? (
                      <span className="text-[10px] bg-rose-600 text-white border border-rose-400 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        מנהל ראשי
                      </span>
                    ) : (
                      <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/30 px-1.5 py-0.2 rounded font-medium">
                        {currentUser?.role}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span>@{currentUser?.username}</span>
                    <button
                      onClick={onOpenEditProfile}
                      className="text-[10px] text-sky-300 hover:text-white underline mr-1 cursor-pointer"
                    >
                      שנה תמונה
                    </button>
                  </div>
                </div>

                {/* Open Admin Panel button if Admin */}
                {currentUser.isAdmin && (
                  <button
                    onClick={onOpenAdminPanel}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow border border-rose-400 flex items-center gap-1 transition-all cursor-pointer"
                    title="פתח לוח בקרת מנהלים"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>תפריט מנהל</span>
                  </button>
                )}

                {/* Notification bell */}
                <div className="relative mr-1">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 relative transition-colors"
                    title="התראות"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                  </button>
                  {notificationsOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-right">
                      <div className="px-3 py-1 border-b border-slate-100 font-bold text-xs text-slate-700">
                        התראות אחרונות (3)
                      </div>
                      <div className="px-3 py-2 text-xs hover:bg-slate-50 border-b border-slate-100 cursor-pointer">
                        <p className="font-semibold text-blue-900">ישראל_מפתח הגיב בנושא שלך</p>
                        <p className="text-slate-500 text-[11px]">לפני 4 דקות • פיתוח וסקריפטים</p>
                      </div>
                      <div className="px-3 py-2 text-xs hover:bg-slate-50 cursor-pointer">
                        <p className="font-semibold text-blue-900">זכית בתג: תומך טופ לחודש זה</p>
                        <p className="text-slate-500 text-[11px]">לפני שעתיים</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={onLogout}
                  className="text-xs text-slate-300 hover:text-rose-300 p-1.5 rounded-lg hover:bg-slate-700/60 transition-colors flex items-center gap-1"
                  title="התנתק מהחשבון"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">יציאה</span>
                </button>
              </div>
            ) : (
              /* Guest Auth Buttons & Quick Login */
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenRegister ? onOpenRegister() : setShowLoginDropdown(!showLoginDropdown)}
                  className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all border border-sky-400/40"
                  title="פתיחת חשבון חדש בפורום"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>הרשמה לפורום</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenLogin ? onOpenLogin() : setShowLoginDropdown(!showLoginDropdown)}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 cursor-pointer transition-all"
                  title="התחברות למשתמש קיים"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>התחברות</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
