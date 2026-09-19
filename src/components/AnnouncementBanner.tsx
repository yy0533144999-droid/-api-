import React from 'react';
import { Volume2, AlertTriangle, Mail } from 'lucide-react';

interface AnnouncementBannerProps {
  text?: string;
  type?: 'urgent' | 'info';
  active?: boolean;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  text = 'ברוכים הבאים לפורום המפתחים וה-IVR של ימות המשיח ותומכים טופ! הפורום מרכז תמיכה טכנית, שיתוף קוד, סקריפטים ופתרונות ניתוב מתקדמים.',
  type = 'info',
  active = true,
}) => {
  if (!active) return null;

  const isUrgent = type === 'urgent';

  return (
    <div 
      id="forum-announcement-banner" 
      className={`text-white rounded-2xl p-4 mb-6 shadow-md border relative overflow-hidden transition-all ${
        isUrgent
          ? 'bg-gradient-to-r from-red-900 via-rose-950 to-red-900 border-red-500/60 shadow-red-950/30'
          : 'bg-gradient-to-r from-blue-900 via-[#0f2b48] to-slate-900 border-blue-700/40 shadow-blue-950/20'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
            isUrgent
              ? 'bg-red-500/30 text-red-200 border-red-400/50'
              : 'bg-blue-500/20 text-sky-300 border-sky-400/30'
          }`}>
            {isUrgent ? (
              <AlertTriangle className="w-5 h-5 text-red-300 animate-bounce" />
            ) : (
              <Volume2 className="w-5 h-5 animate-pulse" />
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full font-mono ${
                isUrgent ? 'bg-red-500 text-white shadow-xs' : 'bg-amber-400 text-slate-950'
              }`}>
                {isUrgent ? 'הכרזת מנהל דחופה' : 'הודעת הנהלה קבועה'}
              </span>
              <h4 className="text-sm font-bold text-white">
                {isUrgent ? 'הודעה רשמית מהנהלת הפורום' : 'פורום המפתחים וה-IVR של ימות המשיח ותומכים טופ'}
              </h4>
            </div>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed max-w-4xl font-medium">
              {text}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-sky-200/90 pt-1.5">
              <Mail className="w-3 h-3 text-sky-300 shrink-0" />
              <span>לפניות בנוגע לפורום:</span>
              <a
                href="mailto:ivr3293@gmail.com"
                className="text-sky-300 hover:text-white underline font-mono font-semibold"
                dir="ltr"
              >
                ivr3293@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="text-[11px] font-bold text-sky-300 bg-sky-950/60 px-2.5 py-1 rounded-lg border border-sky-500/30">
            הודעה נעוצה בראש הפורום
          </span>
        </div>

      </div>

      {/* Decorative background glow */}
      <div className={`absolute -left-10 -bottom-10 w-40 h-40 rounded-full blur-2xl pointer-events-none ${
        isUrgent ? 'bg-red-500/20' : 'bg-sky-500/10'
      }`}></div>
    </div>
  );
};
