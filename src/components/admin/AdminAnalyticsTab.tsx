import React, { useState } from 'react';
import { 
  BarChart3, 
  Palette, 
  Sliders, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Eye, 
  Clock, 
  Check, 
  Sun, 
  Moon, 
  Type, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { ForumCategory, ForumTopic, OnlineUser, ThemeSettings } from '../../types';

interface AdminAnalyticsTabProps {
  topics: ForumTopic[];
  users: OnlineUser[];
  categories: ForumCategory[];
  themeSettings: ThemeSettings;
  onUpdateThemeSettings: (updated: Partial<ThemeSettings>) => void;
}

export const AdminAnalyticsTab: React.FC<AdminAnalyticsTabProps> = ({
  topics,
  users,
  categories,
  themeSettings,
  onUpdateThemeSettings,
}) => {
  const [subTab, setSubTab] = useState<'stats' | 'appearance'>('stats');

  // Theme Form State
  const [forumTitle, setForumTitle] = useState(themeSettings.forumName);
  const [forumSubtitle, setForumSubtitle] = useState(themeSettings.forumSubtitle);
  const [welcomeText, setWelcomeText] = useState(themeSettings.welcomeTemplate);
  const [selectedColor, setSelectedColor] = useState(themeSettings.primaryColor);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compute live statistics
  const totalTopics = topics.length;
  const totalReplies = topics.reduce((acc, t) => acc + (t.repliesCount || 0), 0);
  const totalViews = topics.reduce((acc, t) => acc + (t.viewsCount || 0), 0);
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.isBanned).length;

  // Mock weekly trends data
  const activityDays = [
    { day: 'ראשון', posts: 42, views: 320, height: '65%' },
    { day: 'שני', posts: 68, views: 540, height: '85%' },
    { day: 'שלישי', posts: 55, views: 480, height: '70%' },
    { day: 'רביעי', posts: 92, views: 760, height: '100%' },
    { day: 'חמישי', posts: 74, views: 610, height: '80%' },
    { day: 'שישי', posts: 31, views: 240, height: '40%' },
    { day: 'מוצ"ש', posts: 49, views: 390, height: '55%' },
  ];

  const peakHours = [
    { hour: '08:00 - 11:00', percent: 65, label: 'בוקר פעיל' },
    { hour: '11:00 - 15:00', percent: 85, label: 'שעות שיא (הפסקות צהריים)' },
    { hour: '15:00 - 19:00', percent: 70, label: 'שעות אחה"צ' },
    { hour: '19:00 - 23:30', percent: 95, label: 'שיא תנועה (ערב ופיתוח IVR)' },
  ];

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateThemeSettings({
      forumName: forumTitle.trim(),
      forumSubtitle: forumSubtitle.trim(),
      welcomeTemplate: welcomeText.trim(),
      primaryColor: selectedColor,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* SubTab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('stats')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'stats'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>דשבורד סטטיסטיקות וגרפים</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('appearance')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'appearance'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>התאמת עיצוב ומיתוג הפורום</span>
        </button>
      </div>

      {/* 1. STATS DASHBOARD */}
      {subTab === 'stats' && (
        <div className="space-y-4">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">נושאים בפורום</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-mono text-slate-900">{totalTopics}</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">סך תגובות</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-mono text-slate-900">{totalReplies}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">צפיות מצטברות</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-mono text-slate-900">{totalViews}</span>
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 block mb-1">משתמשים רשומים</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold font-mono text-slate-900">{totalUsers}</span>
                <Users className="w-4 h-4 text-rose-600" />
              </div>
            </div>
          </div>

          {/* Activity Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  פעילות שבועית: פוסטים ותגובות לפי ימים
                </h4>
                <p className="text-[11px] text-slate-500">מעקב מעורבות משתמשים בזמן אמת</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded">
                השבוע הנוכחי
              </span>
            </div>

            {/* Custom Bar Visualization */}
            <div className="pt-6 pb-2 grid grid-cols-7 gap-2 items-end h-40 border-b border-slate-100">
              {activityDays.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-500">{item.posts}</span>
                  <div
                    style={{ height: item.height }}
                    className="w-full max-w-[34px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-md transition-all hover:brightness-110"
                    title={`${item.day}: ${item.posts} הודעות, ${item.views} צפיות`}
                  />
                  <span className="text-[11px] font-medium text-slate-700">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours & Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Peak Hours */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600" />
                שעות עומס ותנועה בפורום
              </h4>
              <p className="text-[11px] text-slate-500">פילוח זמני תגובה ושאלות</p>

              <div className="space-y-2 pt-2">
                {peakHours.map((h, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700">{h.hour}</span>
                      <span className="text-slate-500 text-[11px]">{h.label} ({h.percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full"
                        style={{ width: `${h.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics Distribution by Category */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                התפלגות נושאים לפי קטגוריות
              </h4>
              <p className="text-[11px] text-slate-500">תחומי עניין עיקריים של חברי הקהילה</p>

              <div className="space-y-2 pt-2">
                {categories.map((c) => {
                  const catTopicCount = c.subCategories.reduce((acc, sub) => acc + sub.topicsCount, 0);
                  const percent = totalTopics > 0 ? Math.round((catTopicCount / totalTopics) * 100) : 0;
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700 truncate">{c.title}</span>
                        <span className="text-slate-500 text-[11px] font-mono">
                          {catTopicCount} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. THEME & BRANDING */}
      {subTab === 'appearance' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-rose-600" />
              התאמת עיצוב ומיתוג אישי לפורום
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              הגדר את שמות המותג, הכותרות והגוונים הראשיים של הפורום.
            </p>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              הגדרות המיתוג והעיצוב עודכנו בהצלחה!
            </div>
          )}

          <form onSubmit={handleSaveTheme} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                שם הפורום הראשי (Site Title):
              </label>
              <input
                type="text"
                required
                value={forumTitle}
                onChange={(e) => setForumTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                כותרת משנה / סלוגן:
              </label>
              <input
                type="text"
                value={forumSubtitle}
                onChange={(e) => setForumSubtitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                הודעת פתיחה וכללי הפורום (Welcome Template):
              </label>
              <textarea
                rows={3}
                value={welcomeText}
                onChange={(e) => setWelcomeText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                גוון מותג מוביל (Primary Accent):
              </label>
              <div className="flex items-center gap-3">
                {[
                  { key: 'navy', label: 'כחול נייבי (קלאסי)', class: 'bg-slate-900' },
                  { key: 'blue', label: 'כחול רויאל', class: 'bg-blue-600' },
                  { key: 'emerald', label: 'ירוק אמרלד', class: 'bg-emerald-600' },
                  { key: 'rose', label: 'אדום רוז', class: 'bg-rose-600' },
                  { key: 'amber', label: 'ענבר חמים', class: 'bg-amber-600' },
                ].map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => setSelectedColor(color.key as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer ${
                      selectedColor === color.key
                        ? 'border-blue-600 ring-2 ring-blue-500/30'
                        : 'border-slate-200'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${color.class}`} />
                    <span>{color.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                שמור הגדרות מיתוג
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
