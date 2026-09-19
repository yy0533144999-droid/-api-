import React, { useState } from 'react';
import { 
  PenSquare, 
  Users, 
  MessageSquare, 
  Award, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Settings, 
  Bookmark, 
  Tag, 
  Shield, 
  TrendingUp, 
  UserCheck, 
  Headphones,
  FileText,
  UserPlus
} from 'lucide-react';
import { OnlineUser, UserProfile } from '../types';
import { forumStats, popularTags, onlineUsersList as defaultUsersList } from '../data/forumData';
import { ShieldAlert, Crown, UserX, TrendingDown, Lock } from 'lucide-react';
import { formatReputation } from '../utils/format';

interface SidebarProps {
  currentUser: UserProfile | null;
  onLogin: (email: string, pass: string) => void;
  onLogout: () => void;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
  onOpenNewTopic: () => void;
  onSelectTag?: (tag: string) => void;
  onOpenAdminPanel?: () => void;
  usersList?: OnlineUser[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onOpenRegister,
  onOpenLogin,
  onOpenNewTopic,
  onSelectTag,
  onOpenAdminPanel,
  usersList = defaultUsersList,
}) => {
  const [sidebarEmail, setSidebarEmail] = useState('');
  const [sidebarPassword, setSidebarPassword] = useState('');
  const [showQuickForm, setShowQuickForm] = useState(false);

  const handleSidebarLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sidebarEmail.trim()) return;
    onLogin(sidebarEmail, sidebarPassword);
  };

  return (
    <aside className="space-y-5">
      {/* 1. Primary Action Button: "צור נושא חדש" במקום בולט בחלק העליון */}
      <button
        onClick={() => {
          if (currentUser) {
            onOpenNewTopic();
          } else if (onOpenRegister) {
            onOpenRegister();
          } else {
            onOpenNewTopic();
          }
        }}
        className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 hover:from-blue-800 hover:to-blue-700 active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer border border-blue-500/40"
      >
        <div className="p-1.5 rounded-lg bg-white/15 text-white shadow-inner group-hover:rotate-6 transition-transform">
          <PenSquare className="w-5 h-5" />
        </div>
        <span className="text-base tracking-wide">צור נושא חדש</span>
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">
          {currentUser ? '+ כתיבת פוסט' : 'דורש הרשמה'}
        </span>
      </button>

      {/* Admin Control Center Block when logged in as Shmuel / Admin */}
      {currentUser?.isAdmin && (
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-[#0f2b48] text-white rounded-2xl p-4.5 border-2 border-rose-500/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Crown className="w-4 h-4 text-amber-300" />
              </div>
              <h3 className="font-bold text-sm text-rose-100">תפריט מנהל ראשי</h3>
            </div>
            <span className="text-[10px] bg-rose-600/60 text-rose-200 px-2 py-0.5 rounded-full border border-rose-400/40 font-bold max-w-[120px] truncate">
              {currentUser?.name || 'מנהל ראשי'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            שלום {currentUser?.name || 'מנהל'}, יש לך הרשאות מלאות לניהול הפורום, הרחקת משתמשים בעייתיים, שליטה במוניטין ונעילת דיונים.
          </p>

          <button
            onClick={onOpenAdminPanel}
            className="w-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-400"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>פתח לוח בקרת מנהל מלא</span>
          </button>

          <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] text-center">
            <button
              onClick={onOpenAdminPanel}
              className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg flex flex-col items-center gap-1 transition-colors"
            >
              <UserX className="w-3.5 h-3.5 text-rose-400" />
              <span>הרחקה</span>
            </button>
            <button
              onClick={onOpenAdminPanel}
              className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg flex flex-col items-center gap-1 transition-colors"
            >
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              <span>מוניטין</span>
            </button>
            <button
              onClick={onOpenAdminPanel}
              className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg flex flex-col items-center gap-1 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-sky-400" />
              <span>נעילה</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. בלוק כניסה מהירה / פרופיל מחובר */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>{currentUser ? 'פרופיל מחובר' : 'כניסה מהירה לחשבון'}</span>
          </h3>
          {currentUser && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              פעיל כעת
            </span>
          )}
        </div>

        {currentUser ? (
          /* Profile Card when Logged In */
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name || currentUser?.username || 'פרופיל'}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-sm"
                />
                <span className="absolute -bottom-1 -left-1 bg-amber-500 text-white p-1 rounded-full shadow" title="תומך טופ">
                  <Award className="w-3 h-3" />
                </span>
              </div>

              <div className="overflow-hidden text-right">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {currentUser?.username}
                </h4>
                <div className="mt-1">
                  <span className="inline-block text-[11px] font-semibold bg-[#0f2b48] text-sky-200 px-2.5 py-0.5 rounded-md border border-[#234b75]">
                    {currentUser?.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            {/* User Stats Grid */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="block text-xs text-slate-400">מוניטין</span>
                <span className="text-sm font-bold text-blue-700 font-mono">
                  {currentUser.reputation > 0 ? `+${formatReputation(currentUser.reputation)}` : formatReputation(currentUser.reputation)}
                </span>
              </div>
              <div className="border-r border-slate-200">
                <span className="block text-xs text-slate-400">הודעות</span>
                <span className="text-sm font-bold text-slate-800 font-mono">
                  {currentUser.postCount.toLocaleString('he-IL')}
                </span>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button 
                onClick={onOpenNewTopic}
                className="flex-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-500" />
                <span>הנושאים שלי</span>
              </button>

              <button
                onClick={onLogout}
                className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium py-1.5 px-3 rounded-lg border border-rose-200 transition-colors flex items-center justify-center gap-1"
                title="התנתקות מהמערכת"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>יציאה</span>
              </button>
            </div>
          </div>
        ) : (
          /* Guest Welcome & Action Card */
          <div className="space-y-3.5 text-right">
            <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-3 text-right">
              <div className="flex items-center gap-1.5 text-sky-800 font-bold text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>שלום אורח! ברוך הבא לקהילה</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                לפרסום נושאים, כתיבת תגובות וקבלת מוניטין בפורום — יש להירשם או להתחבר.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenRegister}
                className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>הרשמה מהירה לפורום (חינם)</span>
              </button>

              <button
                type="button"
                onClick={onOpenLogin}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-2 px-3 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>התחברות לחשבון קיים</span>
              </button>
            </div>

            {/* Collapsible quick login option */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQuickForm(!showQuickForm)}
                className="text-[11px] text-slate-500 hover:text-blue-600 underline font-medium block mx-auto cursor-pointer"
              >
                {showQuickForm ? 'הסתר כניסה מהירה' : 'כניסה מהירה עם שם וסיסמה'}
              </button>

              {showQuickForm && (
                <form onSubmit={handleSidebarLogin} className="space-y-2.5 text-right mt-2 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      שם משתמש:
                    </label>
                    <input
                      type="text"
                      value={sidebarEmail}
                      onChange={(e) => setSidebarEmail(e.target.value)}
                      placeholder="הזן שם משתמש"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                      סיסמה:
                    </label>
                    <input
                      type="password"
                      value={sidebarPassword}
                      onChange={(e) => setSidebarPassword(e.target.value)}
                      placeholder="סיסמה"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>כניסה</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. סטטיסטיקת קהילה: סך הכל חברים, נושאים פעילים, ומי מחובר כעת */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>סטטיסטיקת קהילה</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">24/7 Live</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">סך חברים</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {forumStats.totalMembers.toLocaleString('he-IL')}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">נושאים</span>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {forumStats.activeTopics.toLocaleString('he-IL')}
            </span>
          </div>

          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="block text-[11px] text-slate-500">תגובות</span>
            <span className="text-sm font-bold text-blue-700 font-mono">
              {forumStats.totalPosts.toLocaleString('he-IL')}
            </span>
          </div>
        </div>

        {/* מי מחובר כעת (Online Users) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              מי מחובר כעת:
            </span>
            <span className="text-slate-500 text-[11px] font-normal font-mono">
              {forumStats.registeredOnline} רשומים, {forumStats.guestsOnline} אורחים
            </span>
          </div>

          {/* List of active online users */}
          <div className="space-y-2">
            {(usersList || []).filter((u): u is OnlineUser => Boolean(u && typeof u === 'object')).map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user?.name || 'משתמש'}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white ${
                      user.isBanned ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}></span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 text-xs block leading-tight">
                      {user?.name || 'משתמש'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {user.isBanned ? (
                        <span className="text-rose-600 font-bold">מורחק מהפורום</span>
                      ) : (
                        user.action
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {user.reputation !== undefined && (
                    <span className={`text-[10px] font-mono px-1 rounded font-bold ${
                      user.reputation < 0 ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {user.reputation > 0 ? `+${formatReputation(user.reputation)}` : formatReputation(user.reputation)}
                    </span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                    user.isBanned ? 'bg-rose-100 text-rose-800 border-rose-300' : user.roleColor
                  }`}>
                    {user.isBanned ? 'מורחק' : user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. תגיות פופולריות / נושאים חמים */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
        <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2 mb-3">
          <Tag className="w-3.5 h-3.5 text-sky-600" />
          <span>תגיות פופולריות בקהילה</span>
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag && onSelectTag(tag)}
              className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 px-2.5 py-1 rounded-lg font-mono border border-slate-200/60 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 5. מוקד סיוע ועדכוני מערכת */}
      <div className="bg-gradient-to-br from-[#0f2b48] to-[#153a61] text-white p-4 rounded-2xl shadow-xs border border-[#234d78]">
        <div className="flex items-center gap-2 mb-2">
          <Headphones className="w-4 h-4 text-sky-400" />
          <h4 className="font-bold text-xs text-white">מוקד תמיכה טלפוני ומענה קולי</h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          קווים פתוחים לתמיכה טכנית בשלוחות, קמפיינים וחשבונות עסקיים:
        </p>
        <div className="mt-2.5 bg-black/20 p-2 rounded-lg text-center font-mono text-xs text-sky-300 font-bold border border-white/10">
          077-3137770 • שלוחה 4 למפתחים
        </div>
      </div>
    </aside>
  );
};
