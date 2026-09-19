import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  HelpCircle, 
  Headphones, 
  Heart, 
  Code, 
  ExternalLink,
  ChevronUp
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-16 bg-[#0f2b48] text-slate-300 border-t border-[#1b3d62] text-xs">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: About Forum & Logo */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-wide">
                פורום ימות המשיח & תומכים טופ
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              הקהילה המקצועית המובילה בישראל לפיתוח מערכות IVR, ניתוב שיחות חכם, תקשורת SIP, ואינטגרציות Webhooks לטלפוניה מתקדמת.
            </p>
            
            {/* SSL Badge / Security Status Requirement */}
            <div className="inline-flex items-center gap-2 bg-[#091e33] text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>מצב חיבור מאובטח: SSL 256-bit מוצפן</span>
            </div>
          </div>

          {/* Col 2: Navigation & Sections */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3 border-b border-[#20436b] pb-1.5">
              ניווט בפורום
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#categories" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  • כל הקטגוריות והפורומים
                </a>
              </li>
              <li>
                <a href="#recent" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  • נושאים אחרונים ותגובות
                </a>
              </li>
              <li>
                <a href="#tags" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  • תגיות ומילות מפתח
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-sky-300 transition-colors flex items-center gap-1.5">
                  • מדריכי וידאו ותיעוד API
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Rules & Legal links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3 border-b border-[#20436b] pb-1.5">
              תקנון, נגישות ותנאי שימוש
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button 
                  onClick={() => setShowTermsModal(true)}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-right cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>תקנון הפורום וכללי הקהילה</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowAccessibilityModal(true)}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-right cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>הצהרת נגישות תקנית (רמת AA)</span>
                </button>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  מדיניות פרטיות ואבטחת מידע
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  סיוע ויצירת קשר עם ההנהלה
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform details */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-white mb-3 border-b border-[#20436b] pb-1.5">
              טכנולוגיה ומערכת
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              מערכת הפורום מופעלת על תשתית קוד פתוח מהירה מבוססת Node.js ו-NodeBB, עם תמיכה מלאה בהתראות WebSockets ועדכון בזמן אמת.
            </p>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 bg-[#173d63] hover:bg-[#1f4e7c] text-white px-3 py-1.5 rounded-lg border border-[#2a5d91] transition-colors cursor-pointer"
            >
              <ChevronUp className="w-4 h-4" />
              <span>חזרה לראש העמוד</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright and SSL */}
      <div className="bg-[#081827] border-t border-slate-800/80 px-4 py-4 text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
          <div>
            <p className="text-xs font-normal">
              כל הזכויות שמורות © {new Date().getFullYear()} קהילת פורום מערכות טלפוניה ו-IVR | תומכים טופ וימות המשיח.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              SSL Certified 256-bit
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500 font-mono">
              NodeBB Core Hebrew RTL v4.8
            </span>
          </div>
        </div>
      </div>

      {/* Accessibility Statement Modal */}
      {showAccessibilityModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                הצהרת נגישות
              </h3>
              <button 
                onClick={() => setShowAccessibilityModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2.5 text-slate-600 leading-relaxed max-h-80 overflow-y-auto pl-1">
              <p>
                פורום קהילת מערכות טלפוניה ו-IVR רואה חשיבות עליונה בהנגשת שירותי האתר לכלל הגולשים, לרבות אנשים עם מוגבלות.
              </p>
              <p>
                <strong>עמידה בתקנים:</strong> האתר נבנה בהתאם להנחיות הנגישות בתקן הישראלי (ת"י 5568) ולהנחיות WCAG 2.1 ברמת AA.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                <li>תמיכה מלאה בניווט מקלדת ומקשי Tab.</li>
                <li>ניגודיות צבעים תקנית לפי כללי הנגישות.</li>
                <li>תמיכה בקוראי מסך מודרניים.</li>
                <li>מבנה סמנטי מותאם כיוון עברית RTL.</li>
              </ul>
              <p>
                במידה ונתקלתם בקושי בנגישות, נשמח לקבל משוב בכתובת: accessibility@ivr-forum.local.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-left">
              <button
                onClick={() => setShowAccessibilityModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                סגור הצהרה
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                תקנון הפורום וכללי הקהילה
              </h3>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2.5 text-slate-600 leading-relaxed max-h-80 overflow-y-auto pl-1">
              <p>
                ברוכים הבאים לפורום. השימוש במערכת כפוף לכללים הבאים:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
                <li>שמירה על כבוד הדדי ושפה נקייה בין המשתתפים.</li>
                <li>פרסום קוד מקור וסקריפטים נעשה תחת אחריות המשתמש.</li>
                <li>אין לפרסם פרטי התחברות סודיים, מפתחות API פרטיים או סיסמאות שלוחות.</li>
                <li>יש לתייג כל נושא בהתאם לקטגוריה הנכונה ולהימנע מנושאים כפולים.</li>
              </ol>
            </div>
            <div className="pt-3 border-t border-slate-100 text-left">
              <button
                onClick={() => setShowTermsModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
              >
                הבנתי ואישרתי
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
