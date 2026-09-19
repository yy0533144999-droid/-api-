import React, { useState } from 'react';
import { 
  ShieldAlert, 
  History, 
  Filter, 
  FileAudio, 
  Film, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  Download,
  Eye,
  Lock,
  RefreshCw
} from 'lucide-react';
import { AdminLog, MediaAttachment, WordFilterConfig } from '../../types';

interface AdminSecurityTabProps {
  adminLogs: AdminLog[];
  onClearLogs?: () => void;
  wordFilter: WordFilterConfig;
  onUpdateWordFilter: (filter: WordFilterConfig) => void;
  allMedia: MediaAttachment[];
  onDeleteMediaItem?: (id: string) => void;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({
  adminLogs,
  onClearLogs,
  wordFilter,
  onUpdateWordFilter,
  allMedia,
  onDeleteMediaItem,
}) => {
  const [subTab, setSubTab] = useState<'filter' | 'audit' | 'media'>('filter');

  // Word filter states
  const [newBlockedWord, setNewBlockedWord] = useState('');
  const [filterAction, setFilterAction] = useState<'mask' | 'block'>(wordFilter.action);
  const [captchaEnabled, setCaptchaEnabled] = useState(wordFilter.captchaEnabled);

  // Log filter
  const [logSearch, setLogSearch] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<string>('all');

  // Media filter
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'audio' | 'video' | 'image'>('all');

  const filteredLogs = adminLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.adminName.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(logSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (logTypeFilter !== 'all' && log.type !== logTypeFilter) return false;
    return true;
  });

  const filteredMedia = allMedia.filter((m) => {
    if (mediaTypeFilter === 'all') return true;
    return m.type === mediaTypeFilter;
  });

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedWord.trim()) return;
    if (wordFilter.blockedWords.includes(newBlockedWord.trim())) return;

    onUpdateWordFilter({
      ...wordFilter,
      blockedWords: [...wordFilter.blockedWords, newBlockedWord.trim()],
    });
    setNewBlockedWord('');
  };

  const handleRemoveWord = (word: string) => {
    onUpdateWordFilter({
      ...wordFilter,
      blockedWords: wordFilter.blockedWords.filter((w) => w !== word),
    });
  };

  const handleSaveFilterSettings = () => {
    onUpdateWordFilter({
      ...wordFilter,
      action: filterAction,
      captchaEnabled,
    });
  };

  return (
    <div className="space-y-4">
      {/* SubTab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('filter')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'filter'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>מסנן מילים וספאם ({wordFilter.blockedWords.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('audit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'audit'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>יומן פעילויות מנהלים ({adminLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('media')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'media'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>ניהול קבצים ומדיה ({allMedia.length})</span>
        </button>
      </div>

      {/* 1. WORD & SPAM FILTER */}
      {subTab === 'filter' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-rose-600" />
              סינון מילים אסורות ומניעת ספאם
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              מילים אלו יסוננו אוטומטית בעת שליחת נושא או תגובה בפורום.
            </p>
          </div>

          {/* Settings Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  פעולה בעת זיהוי מילה אסורה:
                </label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="mask">הסוואה אוטומטית בכוכביות (***)</option>
                  <option value="block">חסימת פרסום ההודעה והצגת שגיאה</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  מנגנון הגנה נגד בוטים (Anti-Bot):
                </label>
                <div className="flex items-center gap-2 mt-1.5">
                  <input
                    type="checkbox"
                    id="captchaToggle"
                    checked={captchaEnabled}
                    onChange={(e) => setCaptchaEnabled(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded cursor-pointer"
                  />
                  <label htmlFor="captchaToggle" className="text-xs text-slate-800 font-semibold cursor-pointer">
                    הפעל שאלת אימות / reCAPTCHA בהרשמה ובפרסום קישורים
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveFilterSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                שמור הגדרות מסנן
              </button>
            </div>
          </div>

          {/* Add Word Form */}
          <form
            onSubmit={handleAddWord}
            className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center gap-2"
          >
            <input
              type="text"
              required
              value={newBlockedWord}
              onChange={(e) => setNewBlockedWord(e.target.value)}
              placeholder="הקלד מילה להוספה לרשימה השחורה..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
            />
            <button
              type="submit"
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl shrink-0 cursor-pointer shadow-xs"
            >
              + הוסף מילה לרשימה
            </button>
          </form>

          {/* Blacklisted Words Badges */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
            <h4 className="text-xs font-bold text-slate-700 mb-2">
              מילים חסומות מוגדרות ({wordFilter.blockedWords.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {wordFilter.blockedWords.map((word) => (
                <span
                  key={word}
                  className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWord(word)}
                    className="hover:text-rose-950 font-bold p-0.5"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. AUDIT LOG */}
      {subTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="חיפוש ביומן לפי פעולה, מנהל או יעד..."
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logTypeFilter}
                onChange={(e) => setLogTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2 text-xs"
              >
                <option value="all">כל סוגי הפעולות</option>
                <option value="ban">חסימת משתמשים</option>
                <option value="unban">ביטול חסימה</option>
                <option value="reputation_down">הורדת מוניטין</option>
                <option value="lock_topic">נעילת נושאים</option>
                <option value="delete_topic">מחיקת נושאים</option>
              </select>

              {onClearLogs && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('האם לרוקן את יומן הפעולות?')) {
                      onClearLogs();
                    }
                  }}
                  className="text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl"
                >
                  רוקן יומן
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{log.action}</span>
                    <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-100">
                      יעד: {log.target}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-xs text-slate-600">{log.details}</p>
                  )}
                  <div className="text-[11px] text-slate-400">
                    בוצע ע"י: <strong>{log.adminName}</strong> • {log.timestamp}
                  </div>
                </div>

                <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded shrink-0">
                  {log.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FILE & MEDIA MANAGER */}
      {subTab === 'media' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-blue-600" />
                ניהול קובצי מדיה, שמע וסרטונים
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                מעקב אחר נפח האחסון בפורום, האזנה לשמע וצפייה בסרטונים שהועלו ע"י המשתמשים.
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setMediaTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg ${mediaTypeFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-white border'}`}
              >
                הכל ({allMedia.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaTypeFilter('audio')}
                className={`px-2.5 py-1 rounded-lg ${mediaTypeFilter === 'audio' ? 'bg-sky-700 text-white' : 'bg-white border'}`}
              >
                שמע ({allMedia.filter((m) => m.type === 'audio').length})
              </button>
              <button
                type="button"
                onClick={() => setMediaTypeFilter('video')}
                className={`px-2.5 py-1 rounded-lg ${mediaTypeFilter === 'video' ? 'bg-rose-700 text-white' : 'bg-white border'}`}
              >
                וידאו ({allMedia.filter((m) => m.type === 'video').length})
              </button>
              <button
                type="button"
                onClick={() => setMediaTypeFilter('image')}
                className={`px-2.5 py-1 rounded-lg ${mediaTypeFilter === 'image' ? 'bg-emerald-700 text-white' : 'bg-white border'}`}
              >
                תמונות ({allMedia.filter((m) => m.type === 'image').length})
              </button>
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMedia.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs space-y-2 hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    {m.type === 'audio' && <FileAudio className="w-4 h-4 text-sky-600 shrink-0" />}
                    {m.type === 'video' && <Film className="w-4 h-4 text-rose-600 shrink-0" />}
                    {m.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />}
                    <span className="font-bold text-xs text-slate-800 truncate">{m.name}</span>
                  </div>
                  {m.size && <span className="text-[10px] text-slate-400 font-mono">{m.size}</span>}
                </div>

                {/* Preview / Player */}
                {m.type === 'audio' && (
                  <audio controls src={m.url} className="w-full h-8" />
                )}

                {m.type === 'video' && (
                  <video controls src={m.url} className="w-full h-28 object-cover rounded-lg bg-black" />
                )}

                {m.type === 'image' && (
                  <img src={m.url} alt={m.name} className="w-full h-28 object-cover rounded-lg border" />
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <a
                    href={m.url}
                    download={m.name}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>הורדה</span>
                  </a>

                  {onDeleteMediaItem && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`האם למחוק את הקובץ "${m.name}"?`)) {
                          onDeleteMediaItem(m.id);
                        }
                      }}
                      className="text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
