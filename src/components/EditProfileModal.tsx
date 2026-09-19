import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Camera, 
  Upload, 
  Check, 
  X, 
  Sparkles, 
  Award, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { formatReputation } from '../utils/format';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
];

const AVATAR_COLORS = [
  { name: 'כחול שמיים', bg: '#0284c7', text: '#ffffff' },
  { name: 'אינדיגו יוקרתי', bg: '#4f46e5', text: '#ffffff' },
  { name: 'ירוק אמרלד', bg: '#059669', text: '#ffffff' },
  { name: 'ענבר מוזהב', bg: '#d97706', text: '#ffffff' },
  { name: 'אדום רוז', bg: '#e11d48', text: '#ffffff' },
  { name: 'סגול רויאל', bg: '#9333ea', text: '#ffffff' },
  { name: 'טורקיז עמוק', bg: '#0d9488', text: '#ffffff' },
  { name: 'כחול נייבי', bg: '#0f2b48', text: '#38bdf8' },
  { name: 'ורוד פוקסיה', bg: '#db2777', text: '#ffffff' },
  { name: 'גרפיט כהה', bg: '#1e293b', text: '#f8fafc' },
];

export const generateColorAvatar = (bgColor: string, textColor: string, displayName: string) => {
  const initial = (displayName.trim()[0] || 'מ').toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
    <rect width="150" height="150" fill="${bgColor}" rx="75"/>
    <text x="50%" y="54%" font-size="68" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" font-family="Rubik, Assistant, Arial, sans-serif">${initial}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile,
}) => {
  const [name, setName] = useState(currentUser?.name || currentUser?.username || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || currentUser.username || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        setAvatar(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    onSaveProfile({
      name: name.trim() || currentUser.username || currentUser.name || 'משתמש',
      avatar: avatar || currentUser.avatar,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-right">
        
        {/* Header */}
        <div className="bg-[#0f2b48] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">עריכת תמונת פרופיל ופרטים אישיים</h2>
              <p className="text-xs text-slate-300">
                עדכון תמונת הפרופיל שתוצג בפוסטים, בתגובות ובמוניטין שלך
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center justify-center gap-3 py-2 border-b border-slate-100">
            <div className="relative group">
              <img
                src={avatar}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border-4 border-sky-500 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span>החלף תמונה</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl border border-blue-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>העלה תמונה מהמכשיר / מחשב</span>
            </button>
            <p className="text-[11px] text-slate-500">
              תומך בקבצי JPG, PNG, WEBP (התמונה נשמרת אוטומטית בפרופיל)
            </p>
          </div>

          {/* Option 2: Choose vibrant Avatar Color */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                🎨 או בחר צבע רקע לאווטאר עם אות השם שלך:
              </label>
              <span className="text-[10px] text-slate-500 font-medium">10 גוונים נקיים</span>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {AVATAR_COLORS.map((col, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(generateColorAvatar(col.bg, col.text, name || currentUser.username))}
                  className="group flex flex-col items-center gap-1 cursor-pointer"
                  title={col.name}
                >
                  <div 
                    style={{ backgroundColor: col.bg, color: col.text }}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shadow-xs border-2 border-white group-hover:scale-110 group-active:scale-95 transition-transform"
                  >
                    {(name.trim()[0] || currentUser.username[0] || 'מ').toUpperCase()}
                  </div>
                  <span className="text-[9px] text-slate-500 truncate max-w-[40px] text-center">
                    {col.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick preset avatars */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              או בחר תמונה מגלריית הדמויות:
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {PRESET_AVATARS.map((presetUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setAvatar(presetUrl)}
                  className={`p-1 rounded-xl border-2 transition-all cursor-pointer ${
                    avatar === presetUrl
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-105'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={presetUrl}
                    alt={`Avatar ${idx + 1}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Username & Name */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                שם משתמש במערכת (קבוע):
              </label>
              <input
                type="text"
                disabled
                value={currentUser.username}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                שם תצוגה / כינוי:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הזן שם מלא או כינוי לתצוגה"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* User Real Stats Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">מוניטין אמיתי</span>
              <strong className="text-sm font-bold text-blue-700">
                +{formatReputation(currentUser.reputation)}
              </strong>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">סך פוסטים</span>
              <strong className="text-sm font-bold text-slate-800">
                {currentUser.postCount}
              </strong>
            </div>
            <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-2xs">
              <span className="text-[11px] text-slate-500 block">דרגת קהילה</span>
              <strong className="text-xs font-bold text-emerald-700 block truncate">
                {currentUser.role}
              </strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>שמור שינויים</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
