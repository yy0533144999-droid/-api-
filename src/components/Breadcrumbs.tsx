import React from 'react';
import { Home, ChevronLeft, Layers, CornerDownLeft } from 'lucide-react';

interface BreadcrumbsProps {
  currentCategoryName?: string;
  currentForumName?: string;
  currentTopicTitle?: string;
  onNavigateHome: () => void;
  onNavigateCategory?: () => void;
  onNavigateForum?: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentCategoryName = 'מערכות טלפוניה ו-IVR',
  currentForumName = 'פיתוח וסקריפטים',
  currentTopicTitle,
  onNavigateHome,
  onNavigateCategory,
  onNavigateForum,
}) => {
  return (
    <nav 
      aria-label="נתיב ניווט"
      className="bg-white rounded-xl shadow-xs border border-slate-200/80 px-4 py-2.5 flex items-center justify-between text-xs sm:text-sm text-slate-600 mb-5"
    >
      <div className="flex items-center flex-wrap gap-1.5 font-medium">
        {/* ראשי */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 transition-colors p-1 rounded hover:bg-slate-100"
        >
          <Home className="w-3.5 h-3.5 text-slate-500" />
          <span>ראשי</span>
        </button>

        <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />

        {/* קטגוריה: מערכות טלפוניה ו-IVR */}
        <button
          onClick={onNavigateCategory || onNavigateHome}
          className={`flex items-center gap-1 transition-colors p-1 rounded hover:bg-slate-100 ${
            !currentForumName && !currentTopicTitle
              ? 'text-blue-700 font-bold'
              : 'text-slate-600 hover:text-blue-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentCategoryName}</span>
        </button>

        {currentForumName && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {/* פיתוח וסקריפטים */}
            <button
              onClick={onNavigateForum}
              className={`transition-colors p-1 rounded hover:bg-slate-100 ${
                !currentTopicTitle
                  ? 'text-blue-700 font-bold bg-blue-50/60 px-2'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <span>{currentForumName}</span>
            </button>
          </>
        )}

        {currentTopicTitle && (
          <>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md bg-slate-100 px-2 py-0.5 rounded">
              {currentTopicTitle}
            </span>
          </>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>פורום חי ומתעדכן</span>
      </div>
    </nav>
  );
};
