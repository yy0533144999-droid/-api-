import React, { useState } from 'react';
import { 
  Mail, 
  PhoneCall, 
  Server, 
  FolderGit2, 
  Clock, 
  CheckCheck,
  Layers,
  Edit3,
  Trash2,
  Plus,
  FolderPlus,
  FolderEdit,
  Code,
  HelpCircle,
  Megaphone
} from 'lucide-react';
import { ForumCategory, ForumSubCategory, UserProfile } from '../types';

interface CategoriesListProps {
  categories: ForumCategory[];
  onSelectForum: (category: ForumCategory, subCategory: ForumSubCategory) => void;
  onMarkAllAsRead: () => void;
  filterUnreadOnly: boolean;
  setFilterUnreadOnly: (val: boolean) => void;
  currentUser?: UserProfile | null;
  onAddCategory?: (cat: { title: string; description: string; iconName: string; badge?: string }) => void;
  onUpdateCategory?: (catId: string, updated: Partial<ForumCategory>) => void;
  onDeleteCategory?: (catId: string) => void;
  onAddSubCategory?: (catId: string, subCat: { title: string; description: string; tags: string[] }) => void;
  onUpdateSubCategory?: (catId: string, subCatId: string, updated: Partial<ForumSubCategory>) => void;
  onDeleteSubCategory?: (catId: string, subCatId: string) => void;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
  categories,
  onSelectForum,
  onMarkAllAsRead,
  filterUnreadOnly,
  setFilterUnreadOnly,
  currentUser,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubCategory,
  onUpdateSubCategory,
  onDeleteSubCategory,
}) => {
  const isAdmin = Boolean(currentUser?.isAdmin);

  // Category Edit / Add modal state
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ForumCategory | null>(null);
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('PhoneCall');
  const [catBadge, setCatBadge] = useState('');

  // SubCategory Edit / Add modal state
  const [targetCatForNewSub, setTargetCatForNewSub] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{ catId: string; sub: ForumSubCategory } | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<{ catId: string; sub: ForumSubCategory } | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subTags, setSubTags] = useState('IVR, הגדרות');

  // Open Edit Category Modal
  const handleStartEditCategory = (cat: ForumCategory) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatDesc(cat.description);
    setCatIcon(cat.iconName || 'PhoneCall');
    setCatBadge(cat.badge || '');
  };

  // Open Add Category Modal
  const handleStartAddCategory = () => {
    setIsAddingCategory(true);
    setCatTitle('');
    setCatDesc('');
    setCatIcon('PhoneCall');
    setCatBadge('');
  };

  // Save Category (Add or Edit)
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    if (editingCategory && onUpdateCategory) {
      onUpdateCategory(editingCategory.id, {
        title: catTitle.trim(),
        description: catDesc.trim(),
        iconName: catIcon,
        badge: catBadge.trim() || undefined,
      });
      setEditingCategory(null);
    } else if (isAddingCategory && onAddCategory) {
      onAddCategory({
        title: catTitle.trim(),
        description: catDesc.trim(),
        iconName: catIcon,
        badge: catBadge.trim() || undefined,
      });
      setIsAddingCategory(false);
    }
    setCatTitle('');
    setCatDesc('');
    setCatBadge('');
  };

  // Open Edit SubCategory Modal
  const handleStartEditSubCategory = (catId: string, sub: ForumSubCategory) => {
    setTargetCatForNewSub(null);
    setEditingSubCategory({ catId, sub });
    setSubTitle(sub.title || '');
    setSubDesc(sub.description || '');
    setSubTags((sub.tags || []).join(', '));
  };

  // Open Add SubCategory Modal
  const handleStartAddSubCategory = (catId: string) => {
    setEditingSubCategory(null);
    setTargetCatForNewSub(catId);
    setSubTitle('');
    setSubDesc('');
    setSubTags('IVR, תמיכה, הגדרות');
  };

  // Save SubCategory (Add or Edit)
  const handleSaveSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle.trim()) return;

    const parsedTags = subTags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    if (editingSubCategory && onUpdateSubCategory) {
      onUpdateSubCategory(editingSubCategory.catId, editingSubCategory.sub.id, {
        title: subTitle.trim(),
        description: subDesc.trim(),
        tags: parsedTags.length > 0 ? parsedTags : ['כללי'],
      });
      setEditingSubCategory(null);
    } else if (targetCatForNewSub && onAddSubCategory) {
      onAddSubCategory(targetCatForNewSub, {
        title: subTitle.trim(),
        description: subDesc.trim(),
        tags: parsedTags.length > 0 ? parsedTags : ['חדש'],
      });
      setTargetCatForNewSub(null);
    }
    setSubTitle('');
    setSubDesc('');
    setSubTags('');
  };

  // Helper to render Category icon
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-sky-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-5 h-5 text-amber-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-indigo-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-rose-400" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-amber-400" />;
      default:
        return <Layers className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-700">סינון תצוגה:</span>
          <button
            onClick={() => setFilterUnreadOnly(false)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              !filterUnreadOnly
                ? 'bg-[#0f2b48] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            כל הפורומים
          </button>
          <button
            onClick={() => setFilterUnreadOnly(true)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterUnreadOnly
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            רק הודעות שלא נקראו
          </button>

          {/* Admin Add Category Quick Button */}
          {isAdmin && onAddCategory && (
            <button
              onClick={handleStartAddCategory}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              title="הוספת קטגוריה ראשית חדשה למערכת"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>הוסף קטגוריה חדשה</span>
            </button>
          )}
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-slate-500 hover:text-blue-700 flex items-center gap-1.5 font-medium transition-colors p-1.5 rounded hover:bg-slate-50 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4 text-slate-400" />
          <span>סמן את כל הפורומים כנקראו</span>
        </button>
      </div>

      {/* Categories Cards List */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Layers className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">אין קטגוריות להצגה</h3>
          <p className="text-xs text-slate-500 mb-4">לא נמצאו קטגוריות התואמות לחיפוש או שטרם נוצרו קטגוריות.</p>
          {isAdmin && onAddCategory && (
            <button
              onClick={handleStartAddCategory}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>צור קטגוריה ראשונה עכשיו</span>
            </button>
          )}
        </div>
      ) : (
        categories.map((category) => {
          const displayedSubs = filterUnreadOnly
            ? category.subCategories.filter((sub) => sub.hasUnread)
            : category.subCategories;

          if (filterUnreadOnly && displayedSubs.length === 0) {
            return null;
          }

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Category Header Bar with Classic NodeBB / Dark Navy styling */}
              <div className="bg-[#0f2b48] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#1c3f66] flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#183d63] border border-[#2a5989] shadow-inner shrink-0">
                    {getCategoryIcon(category.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                        {category.title}
                      </h2>
                      {category.badge && (
                        <span className="text-[11px] font-semibold bg-sky-500/30 text-sky-200 px-2 py-0.5 rounded-full border border-sky-400/40">
                          {category.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 font-normal">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Admin Action Buttons or Column Headers */}
                <div className="flex items-center gap-3">
                  {/* Admin Fast Actions directly on category header */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 bg-[#143960] px-2.5 py-1 rounded-xl border border-[#265384]">
                      {onAddSubCategory && (
                        <button
                          type="button"
                          onClick={() => handleStartAddSubCategory(category.id)}
                          className="text-[11px] font-bold text-emerald-300 hover:text-white hover:bg-emerald-600/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="הוסף תת-פורום לקטגוריה זו"
                        >
                          <Plus className="w-3 h-3" />
                          <span>תת-פורום</span>
                        </button>
                      )}
                      {onUpdateCategory && (
                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(category)}
                          className="text-[11px] font-bold text-sky-200 hover:text-white hover:bg-sky-600/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="ערוך שם, תיאור ואייקון של קטגוריה זו"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>ערוך</span>
                        </button>
                      )}
                      {onDeleteCategory && (
                        <button
                          type="button"
                          onClick={() => setCategoryToDelete(category)}
                          className="text-[11px] font-bold text-rose-300 hover:text-white hover:bg-rose-600/40 px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="מחק קטגוריה זו"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>מחק</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Responsive columns indicator on large screens */}
                  <div className="hidden lg:grid grid-cols-3 gap-6 text-xs text-slate-300 font-medium pl-4 text-center">
                    <span className="w-16">נושאים</span>
                    <span className="w-16">תגובות</span>
                    <span className="w-48 text-right">הודעה אחרונה</span>
                  </div>
                </div>
              </div>

              {/* Forums in Category */}
              {displayedSubs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50/50">
                  <p className="font-medium text-slate-600">אין עדיין תתי-פורומים בקטגוריה זו.</p>
                  {isAdmin && onAddSubCategory && (
                    <button
                      type="button"
                      onClick={() => handleStartAddSubCategory(category.id)}
                      className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1.5 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>הוסף תת-פורום ראשון עכשיו</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {displayedSubs.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => onSelectForum(category, sub)}
                      className="p-4 sm:p-5 hover:bg-slate-50/90 transition-colors cursor-pointer group flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Right side (RTL): Status Icon + Title + Description */}
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* Status Icon: Red for Unread / New, Gray for Read */}
                        <div className="mt-1 shrink-0">
                          {sub.hasUnread ? (
                            <div 
                              className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center relative shadow-xs group-hover:scale-105 transition-transform"
                              title="ישנן הודעות חדשות שלא נקראו בפורום זה"
                            >
                              <Mail className="w-5 h-5" />
                              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-white rounded-full"></span>
                            </div>
                          ) : (
                            <div 
                              className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center group-hover:bg-slate-200 transition-colors"
                              title="כל ההודעות נקראו"
                            >
                              <Mail className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                              {sub.title}
                            </h3>
                            {sub.hasUnread && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                                חדש
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl">
                            {sub.description}
                          </p>

                          {/* Sub-forum tags and Admin buttons */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex flex-wrap gap-1.5">
                              {(sub.tags || []).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Admin row controls */}
                            {isAdmin && (
                              <div 
                                className="flex items-center gap-1.5"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {onUpdateSubCategory && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleStartEditSubCategory(category.id, sub);
                                    }}
                                    className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                                    title="ערוך תת-פורום זה"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>ערוך</span>
                                  </button>
                                )}
                                {onDeleteSubCategory && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setSubCategoryToDelete({ catId: category.id, sub });
                                    }}
                                    className="text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
                                    title="מחק תת-פורום זה"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>מחק</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Left side (RTL): Topics count + Posts count + Last Post */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                        
                        {/* Topics count */}
                        <div className="text-center w-16 shrink-0">
                          <span className="block text-sm sm:text-base font-bold text-slate-800 font-mono">
                            {sub.topicsCount.toLocaleString('he-IL')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            נושאים
                          </span>
                        </div>

                        {/* Replies count */}
                        <div className="text-center w-16 shrink-0">
                          <span className="block text-sm sm:text-base font-bold text-slate-800 font-mono">
                            {sub.postsCount.toLocaleString('he-IL')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            תגובות
                          </span>
                        </div>

                        {/* Last Post Box */}
                        <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/80 w-56 sm:w-64 shrink-0 hover:bg-white transition-colors">
                          {sub.lastPost ? (
                            <div className="flex items-center gap-2.5">
                              <img
                                src={sub.lastPost.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                                alt={sub.lastPost.userName || ''}
                                className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0"
                              />
                              <div className="overflow-hidden flex-1 text-right">
                                <p 
                                  className="text-xs font-semibold text-slate-800 truncate hover:text-blue-700 transition-colors"
                                  title={sub.lastPost.topicTitle}
                                >
                                  {sub.lastPost.topicTitle}
                                </p>
                                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                                  <span className="font-medium text-slate-700 truncate max-w-[100px]">
                                    {sub.lastPost.userName}
                                  </span>
                                  <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px] shrink-0">
                                    <Clock className="w-3 h-3" />
                                    {sub.lastPost.timeAgo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center py-2 text-slate-400 text-xs font-medium">
                              <span>אין הודעות עדיין</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* ===================== MODALS ===================== */}

      {/* 1. Modal: Delete Category Confirmation */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">אישור מחיקת קטגוריה</h3>
                <p className="text-xs text-slate-500">פעולה זו תסיר את הקטגוריה מכל חלקי המערכת</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-5 bg-rose-50/70 border border-rose-100 p-3.5 rounded-xl">
              האם אתה בטוח שברצונך למחוק לצמיתות את הקטגוריה <strong>"{categoryToDelete.title}"</strong> ואת כל {categoryToDelete.subCategories.length} תתי-הפורומים שבה?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteCategory) {
                    onDeleteCategory(categoryToDelete.id);
                  }
                  setCategoryToDelete(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>כן, מחק קטגוריה לצמיתות</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Delete SubCategory Confirmation */}
      {subCategoryToDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">אישור מחיקת תת-פורום</h3>
                <p className="text-xs text-slate-500">הסרת תת-פורום מהקטגוריה</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-5 bg-rose-50/70 border border-rose-100 p-3.5 rounded-xl">
              האם אתה בטוח שברצונך למחוק לצמיתות את תת-הפורום <strong>"{subCategoryToDelete.sub.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubCategoryToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteSubCategory) {
                    onDeleteSubCategory(subCategoryToDelete.catId, subCategoryToDelete.sub.id);
                  }
                  setSubCategoryToDelete(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>כן, מחק תת-פורום</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Add / Edit Category */}
      {(isAddingCategory || editingCategory) && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FolderEdit className="w-5 h-5 text-blue-600" />
              {editingCategory ? 'עריכת קטגוריה ראשית' : 'יצירת קטגוריה ראשית חדשה'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  שם הקטגוריה:
                </label>
                <input
                  type="text"
                  required
                  value={catTitle}
                  onChange={(e) => setCatTitle(e.target.value)}
                  placeholder="למשל: ערוץ פיתוח ו-API"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תיאור קצר:
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="תיאור הנושאים שייכללו בקטגוריה..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    אייקון:
                  </label>
                  <select
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs cursor-pointer"
                  >
                    <option value="PhoneCall">טלפוניה (PhoneCall)</option>
                    <option value="Server">שרתים (Server)</option>
                    <option value="FolderGit2">מאגרים (FolderGit2)</option>
                    <option value="Code">קוד ו-API (Code)</option>
                    <option value="HelpCircle">תמיכה (HelpCircle)</option>
                    <option value="Megaphone">הכרזות (Megaphone)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    תגית בולטת (Badge):
                  </label>
                  <input
                    type="text"
                    value={catBadge}
                    onChange={(e) => setCatBadge(e.target.value)}
                    placeholder="למשל: פעיל מאוד"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setEditingCategory(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingCategory ? 'עדכן קטגוריה' : 'צור קטגוריה'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Add / Edit SubCategory */}
      {(targetCatForNewSub || editingSubCategory) && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-emerald-600" />
              {editingSubCategory ? 'עריכת תת-פורום' : 'הוספת תת-פורום חדש'}
            </h3>
            <form onSubmit={handleSaveSubCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  שם תת-הפורום:
                </label>
                <input
                  type="text"
                  required
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="למשל: שלוחות הקלטות ומודולים"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תיאור תת-הפורום:
                </label>
                <textarea
                  rows={2}
                  value={subDesc}
                  onChange={(e) => setSubDesc(e.target.value)}
                  placeholder="תיאור הנושאים שיידונו בתת-פורום זה..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תגיות מומלצות (מופרדות בפסיקים):
                </label>
                <input
                  type="text"
                  value={subTags}
                  onChange={(e) => setSubTags(e.target.value)}
                  placeholder="IVR, שלוחות, הקלטות"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setTargetCatForNewSub(null);
                    setEditingSubCategory(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingSubCategory ? 'עדכן תת-פורום' : 'צור תת-פורום'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
