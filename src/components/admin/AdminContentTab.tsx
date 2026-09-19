import React, { useState } from 'react';
import { 
  FolderPlus, 
  FolderEdit, 
  Trash2, 
  Pin, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Edit3, 
  Layers, 
  Merge, 
  Tag, 
  RotateCcw, 
  Check, 
  X, 
  AlertTriangle, 
  Search,
  MoveRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Code,
  HelpCircle,
  Megaphone
} from 'lucide-react';
import { ForumCategory, ForumSubCategory, ForumTopic, TrashItem } from '../../types';

interface AdminContentTabProps {
  categories: ForumCategory[];
  onAddCategory: (cat: { title: string; description: string; iconName: string; badge?: string }) => void;
  onUpdateCategory: (catId: string, updated: Partial<ForumCategory>) => void;
  onDeleteCategory: (catId: string) => void;
  onAddSubCategory: (catId: string, subCat: { title: string; description: string; tags: string[] }) => void;
  onUpdateSubCategory: (catId: string, subCatId: string, updated: Partial<ForumSubCategory>) => void;
  onDeleteSubCategory: (catId: string, subCatId: string) => void;
  onReorderCategories: (newCategories: ForumCategory[]) => void;
  
  topics: ForumTopic[];
  onToggleLockTopic: (topicId: string) => void;
  onTogglePinTopic: (topicId: string) => void;
  onDeleteTopic: (topicId: string, reason?: string) => void;
  onMoveTopic: (topicId: string, targetSubCategoryId: string) => void;
  onMergeTopics: (sourceTopicId: string, targetTopicId: string) => void;
  onCreateSystemTopic: (title: string, content: string, forumId: string, tags: string[]) => void;
  
  tags: string[];
  onAddTag: (tagName: string) => void;
  onRenameTag: (oldTag: string, newTag: string) => void;
  onMergeTags: (sourceTag: string, targetTag: string) => void;
  onDeleteTag: (tagName: string) => void;

  trashItems: TrashItem[];
  onRestoreTopic: (trashId: string) => void;
  onPermanentDeleteTopic: (trashId: string) => void;
  onEmptyTrash: () => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddSubCategory,
  onUpdateSubCategory,
  onDeleteSubCategory,
  onReorderCategories,
  topics,
  onToggleLockTopic,
  onTogglePinTopic,
  onDeleteTopic,
  onMoveTopic,
  onMergeTopics,
  onCreateSystemTopic,
  tags,
  onAddTag,
  onRenameTag,
  onMergeTags,
  onDeleteTag,
  trashItems,
  onRestoreTopic,
  onPermanentDeleteTopic,
  onEmptyTrash,
}) => {
  const [subSection, setSubSection] = useState<'categories' | 'topics' | 'tags' | 'trash'>('categories');
  const [topicSearch, setTopicSearch] = useState('');

  // Category modal states
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<ForumCategory | null>(null);
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [catTitle, setCatTitle] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('PhoneCall');
  const [catBadge, setCatBadge] = useState('');

  // SubCategory modal states
  const [targetCatForSub, setTargetCatForSub] = useState<string | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{ catId: string; sub: ForumSubCategory } | null>(null);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<{ catId: string; sub: ForumSubCategory } | null>(null);
  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subTags, setSubTags] = useState('IVR, הגדרות');

  // Topic actions states
  const [movingTopic, setMovingTopic] = useState<ForumTopic | null>(null);
  const [targetMoveForumId, setTargetMoveForumId] = useState('');
  
  const [mergingTopic, setMergingTopic] = useState<ForumTopic | null>(null);
  const [targetMergeTopicId, setTargetMergeTopicId] = useState('');

  const [isNewSystemTopicOpen, setIsNewSystemTopicOpen] = useState(false);
  const [sysTitle, setSysTitle] = useState('');
  const [sysContent, setSysContent] = useState('');
  const [sysForumId, setSysForumId] = useState(categories[0]?.subCategories[0]?.id || 'dev-and-scripts');
  const [sysTags, setSysTags] = useState('הודעת_הנהלה, רשמי');

  // Tag states
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [renamedTagVal, setRenamedTagVal] = useState('');
  const [mergingSourceTag, setMergingSourceTag] = useState<string | null>(null);
  const [mergingTargetTag, setMergingTargetTag] = useState('');

  // Flattened sub-categories for quick lookups
  const allSubCategories = categories.flatMap((c) =>
    c.subCategories.map((s) => ({ ...s, parentCategoryTitle: c.title }))
  );

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(topicSearch.toLowerCase()) ||
      (t.author?.name || '').toLowerCase().includes(topicSearch.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(topicSearch.toLowerCase()))
  );

  // Category handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim()) return;

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, {
        title: catTitle.trim(),
        description: catDesc.trim(),
        iconName: catIcon,
        badge: catBadge.trim() || undefined,
      });
      setEditingCategory(null);
    } else {
      onAddCategory({
        title: catTitle.trim(),
        description: catDesc.trim(),
        iconName: catIcon,
        badge: catBadge.trim() || undefined,
      });
      setIsNewCategoryOpen(false);
    }
    setCatTitle('');
    setCatDesc('');
    setCatBadge('');
  };

  const handleStartEditCategory = (cat: ForumCategory) => {
    setEditingCategory(cat);
    setCatTitle(cat.title);
    setCatDesc(cat.description);
    setCatIcon(cat.iconName || 'PhoneCall');
    setCatBadge(cat.badge || '');
  };

  const handleStartEditSubCategory = (catId: string, sub: ForumSubCategory) => {
    setTargetCatForSub(null);
    setEditingSubCategory({ catId, sub });
    setSubTitle(sub.title || '');
    setSubDesc(sub.description || '');
    setSubTags((sub.tags || []).join(', '));
  };

  const handleMoveCategoryOrder = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;
    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    onReorderCategories(copy);
  };

  // SubCategory handlers
  const handleSaveSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle.trim()) return;

    const parsedTags = subTags.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingSubCategory) {
      onUpdateSubCategory(editingSubCategory.catId, editingSubCategory.sub.id, {
        title: subTitle.trim(),
        description: subDesc.trim(),
        tags: parsedTags,
      });
      setEditingSubCategory(null);
    } else if (targetCatForSub) {
      onAddSubCategory(targetCatForSub, {
        title: subTitle.trim(),
        description: subDesc.trim(),
        tags: parsedTags,
      });
      setTargetCatForSub(null);
    }
    setSubTitle('');
    setSubDesc('');
    setSubTags('IVR, הגדרות');
  };

  const handleCreateSysTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sysTitle.trim() || !sysContent.trim()) return;
    const parsedTags = sysTags.split(',').map((t) => t.trim()).filter(Boolean);
    onCreateSystemTopic(sysTitle.trim(), sysContent.trim(), sysForumId, parsedTags);
    setIsNewSystemTopicOpen(false);
    setSysTitle('');
    setSysContent('');
  };

  const handleConfirmMoveTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingTopic || !targetMoveForumId) return;
    onMoveTopic(movingTopic.id, targetMoveForumId);
    setMovingTopic(null);
  };

  const handleConfirmMergeTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mergingTopic || !targetMergeTopicId || mergingTopic.id === targetMergeTopicId) return;
    onMergeTopics(mergingTopic.id, targetMergeTopicId);
    setMergingTopic(null);
  };

  return (
    <div className="space-y-4">
      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setSubSection('categories')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subSection === 'categories'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FolderEdit className="w-3.5 h-3.5" />
          <span>ניהול קטגוריות ותתי-פורומים ({categories.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('topics')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subSection === 'topics'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ניהול נושאים והודעות ({topics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('tags')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subSection === 'tags'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>ניהול תגיות ({tags.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubSection('trash')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer mr-auto ${
            subSection === 'trash'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>סל מחזור ושחזור ({trashItems.length})</span>
        </button>
      </div>

      {/* 1. CATEGORIES & SUB-CATEGORIES SECTION */}
      {subSection === 'categories' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FolderEdit className="w-4 h-4 text-blue-600" />
                ניהול ועריכת קטגוריות ותתי-פורומים ללא הגבלה
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                באפשרותך להוסיף קטגוריות ותתי-פורומים חדשים, לערוך כותרות ותיאורים, ולמחוק ללא כל מגבלה.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCatTitle('');
                  setCatDesc('');
                  setCatBadge('');
                  setCatIcon('PhoneCall');
                  setIsNewCategoryOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ קטגוריה ראשית חדשה</span>
              </button>
            </div>
          </div>

          {/* List of Categories */}
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs transition-all hover:border-slate-300"
              >
                {/* Category Header */}
                <div className="bg-slate-100/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold font-mono">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{category.title}</h4>
                        {category.badge && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {category.badge}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          ({category.subCategories.length} תתי-פורומים)
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                    </div>
                  </div>

                  {/* Actions for Category */}
                  <div className="flex items-center gap-1.5 justify-end flex-wrap">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveCategoryOrder(index, 'up')}
                      className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                      title="הזז קטגוריה למעלה בסדר התצוגה"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === categories.length - 1}
                      onClick={() => handleMoveCategoryOrder(index, 'down')}
                      className="p-1.5 text-slate-500 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-500 cursor-pointer"
                      title="הזז קטגוריה למטה בסדר התצוגה"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Add SubCategory */}
                    <button
                      type="button"
                      onClick={() => {
                        setTargetCatForSub(category.id);
                        setEditingSubCategory(null);
                        setSubTitle('');
                        setSubDesc('');
                        setSubTags('IVR, הגדרות');
                      }}
                      className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="הוסף תת-פורום לקטגוריה זו"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ תת-פורום</span>
                    </button>

                    {/* Edit Category */}
                    <button
                      type="button"
                      onClick={() => handleStartEditCategory(category)}
                      className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="ערוך קטגוריה ראשית"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>ערוך</span>
                    </button>

                    {/* Delete Category */}
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(category)}
                      className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      title="מחק קטגוריה ראשית זו"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>מחק</span>
                    </button>
                  </div>
                </div>

                {/* Subcategories list */}
                <div className="p-3 divide-y divide-slate-100">
                  {category.subCategories.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400">
                      אין עדיין תתי-פורומים בקטגוריה זו. לחץ על "+ תת-פורום" למעלה כדי להוסיף.
                    </div>
                  ) : (
                    category.subCategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="py-2.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/70 rounded-lg transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800">{sub.title}</span>
                            <span className="text-[11px] font-mono text-slate-400">
                              (מזהה: {sub.id})
                            </span>
                            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                              {sub.topicsCount} נושאים • {sub.postsCount} הודעות
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{sub.description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {sub.tags.map((t, tidx) => (
                              <span
                                key={tidx}
                                className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-100"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 justify-end">
                          {/* Edit SubCategory */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleStartEditSubCategory(category.id, sub);
                            }}
                            className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1 cursor-pointer transition-colors"
                            title="ערוך תת-פורום זה"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>ערוך</span>
                          </button>

                          {/* Delete SubCategory */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSubCategoryToDelete({ catId: category.id, sub });
                            }}
                            className="text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 flex items-center gap-1 cursor-pointer transition-colors"
                            title="מחק תת-פורום זה"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>מחק</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TOPICS & POSTS MODERATION SECTION */}
      {subSection === 'topics' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                placeholder="חיפוש נושא לפי כותרת, מחבר או תגית..."
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setIsNewSystemTopicOpen(true)}
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Megaphone className="w-4 h-4" />
              <span>+ יצירת נושא רשמי מטעם המערכת</span>
            </button>
          </div>

          {/* Topics Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">נושא / כותרת</th>
                    <th className="p-3">מחבר</th>
                    <th className="p-3">פורום</th>
                    <th className="p-3">סטטוס</th>
                    <th className="p-3">תגובות / צפיות</th>
                    <th className="p-3 text-left">פעולות מנהל</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-semibold text-slate-900 max-w-xs">
                        <div className="truncate">{topic.title}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {topic.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] text-slate-400">#{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800">{topic.author?.name || 'משתמש'}</span>
                        <span className="text-[10px] text-slate-500 block">{topic.author?.role || ''}</span>
                      </td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        {topic.forumId}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {topic.isPinned && (
                            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              נעוץ
                            </span>
                          )}
                          {topic.isLocked && (
                            <span className="bg-rose-100 text-rose-900 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              נעול
                            </span>
                          )}
                          {!topic.isPinned && !topic.isLocked && (
                            <span className="text-emerald-700 text-[11px]">פעיל</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 font-mono">
                        {topic.repliesCount} תג' • {topic.viewsCount} צפיות
                      </td>
                      <td className="p-3 text-left">
                        <div className="flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => onToggleLockTopic(topic.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              topic.isLocked
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={topic.isLocked ? 'שחרר נעילה' : 'נעל דיון'}
                          >
                            {topic.isLocked ? <Lock className="w-3.5 h-3.5 text-rose-600" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => onTogglePinTopic(topic.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              topic.isPinned
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={topic.isPinned ? 'בטל נעיצה' : 'הצמד לראש הפורום'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMovingTopic(topic);
                              setTargetMoveForumId(topic.forumId);
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="העבר שרשור לפורום אחר"
                          >
                            <MoveRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMergingTopic(topic);
                              setTargetMergeTopicId('');
                            }}
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                            title="מזג דיון כפול"
                          >
                            <Merge className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteTopic(topic.id, 'העברה לסל המחזור ע"י מנהל')}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="מחק לסל המחזור"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAGS MANAGEMENT SECTION */}
      {subSection === 'tags' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-purple-600" />
                ניהול תגיות ונושאי חיפוש
              </h3>
              <p className="text-xs text-slate-500">
                יצירת תגיות חדשות, שינוי שמות, איחוד תגיות כפולות לצורך סינון קל ומהיר
              </p>
            </div>

            {/* Quick Add Tag Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTagName.trim()) return;
                onAddTag(newTagName.trim());
                setNewTagName('');
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="שם תגית חדשה..."
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer shadow-2xs"
              >
                + הוסף תגית
              </button>
            </form>
          </div>

          {/* Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-2xs hover:border-slate-300"
              >
                {editingTag === tag ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={renamedTagVal}
                      onChange={(e) => setRenamedTagVal(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (renamedTagVal.trim() && renamedTagVal !== tag) {
                          onRenameTag(tag, renamedTagVal.trim());
                        }
                        setEditingTag(null);
                      }}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingTag(null)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center text-xs font-bold">
                        #
                      </span>
                      <div>
                        <span className="font-bold text-xs text-slate-800">{tag}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {topics.filter((t) => t.tags.includes(tag)).length} נושאים משוייכים
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTag(tag);
                          setRenamedTagVal(tag);
                        }}
                        className="p-1 text-slate-500 hover:text-blue-600 rounded"
                        title="שנה שם תגית"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMergingSourceTag(tag);
                          setMergingTargetTag('');
                        }}
                        className="p-1 text-slate-500 hover:text-purple-600 rounded"
                        title="מזג תגית זו לתגית אחרת"
                      >
                        <Merge className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTag(tag)}
                        className="p-1 text-slate-500 hover:text-rose-600 rounded"
                        title="מחק תגית"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RECYCLE BIN & RESTORE SECTION */}
      {subSection === 'trash' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                סל מחזור ושיחזור נושאים שנמחקו
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                הודעות ונושאים שנמחקו נשמרים כאן. ניתן לשחזרם בכל עת בלחיצת כפתור אחת או למחוק לצמיתות.
              </p>
            </div>

            {trashItems.length > 0 && (
              <button
                type="button"
                onClick={() => onEmptyTrash()}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>רוקן סל מחזור לצמיתות</span>
              </button>
            )}
          </div>

          {trashItems.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs">
              סל המחזור ריק. אין פוסטים או נושאים שנמחקו.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {trashItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.topic.title}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        מחבר: {item.topic?.author?.name || 'משתמש'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {item.topic.snippet}
                    </p>
                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>נמחק ע"י: {item.deletedBy}</span>
                      <span>•</span>
                      <span>תאריך מחיקה: {item.deletedAt}</span>
                      {item.reason && (
                        <>
                          <span>•</span>
                          <span className="text-rose-600">סיבה: {item.reason}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onRestoreTopic(item.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>שחזר לפורום</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onPermanentDeleteTopic(item.id)}
                      className="bg-white text-rose-700 hover:bg-rose-50 border border-rose-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>מחק לצמיתות</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: Delete Category Confirmation */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">אישור מחיקת קטגוריה</h3>
                <p className="text-xs text-slate-500">פעולה זו תמחק את הקטגוריה לחלוטין</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-rose-50/70 border border-rose-100 p-3 rounded-xl">
              האם אתה בטוח שברצונך למחוק לצמיתות את הקטגוריה <strong>"{categoryToDelete.title}"</strong> ואת כל {categoryToDelete.subCategories.length} תתי-הפורומים שבה?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>כן, מחק קטגוריה</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Delete SubCategory Confirmation */}
      {subCategoryToDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">אישור מחיקת תת-פורום</h3>
                <p className="text-xs text-slate-500">פעולה זו תסיר את תת-הפורום מהקטגוריה</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4 bg-rose-50/70 border border-rose-100 p-3 rounded-xl">
              האם אתה בטוח שברצונך למחוק לצמיתות את תת-הפורום <strong>"{subCategoryToDelete.sub.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubCategoryToDelete(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteSubCategory(subCategoryToDelete.catId, subCategoryToDelete.sub.id);
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

      {/* MODAL: New / Edit Category */}
      {(isNewCategoryOpen || editingCategory) && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FolderEdit className="w-5 h-5 text-blue-600" />
              {editingCategory ? 'עריכת קטגוריה ראשית' : 'יצירת קטגוריה ראשית חדשה'}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-3">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                  placeholder="תיאור התוכן שיוצג בראש הקטגוריה..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="PhoneCall">טלפוניה (PhoneCall)</option>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewCategoryOpen(false);
                    setEditingCategory(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  שמור קטגוריה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: New / Edit SubCategory */}
      {(targetCatForSub || editingSubCategory) && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-emerald-600" />
              {editingSubCategory ? 'עריכת תת-פורום' : 'הוספת תת-פורום חדש'}
            </h3>
            <form onSubmit={handleSaveSubCategory} className="space-y-3">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setTargetCatForSub(null);
                    setEditingSubCategory(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  שמור תת-פורום
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Move Topic to another Forum */}
      {movingTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <MoveRight className="w-5 h-5 text-blue-600" />
              העברת שרשור לפורום אחר
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              בחר את פורום היעד עבור: <strong>"{movingTopic.title}"</strong>
            </p>

            <form onSubmit={handleConfirmMoveTopic} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  פורום יעד:
                </label>
                <select
                  value={targetMoveForumId}
                  onChange={(e) => setTargetMoveForumId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                >
                  {allSubCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.parentCategoryTitle} › {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMovingTopic(null)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  העבר שרשור
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Merge Topics */}
      {mergingTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Merge className="w-5 h-5 text-purple-600" />
              מיזוג דיונים כפולים
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              כל התגובות מהדיון <strong>"{mergingTopic.title}"</strong> ימוזגו לתוך דיון היעד.
            </p>

            <form onSubmit={handleConfirmMergeTopic} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  בחר את דיון היעד למיזוג:
                </label>
                <select
                  required
                  value={targetMergeTopicId}
                  onChange={(e) => setTargetMergeTopicId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                >
                  <option value="">-- בחר דיון יעד --</option>
                  {topics
                    .filter((t) => t.id !== mergingTopic.id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} (מאת {t.author?.name || 'משתמש'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMergingTopic(null)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  disabled={!targetMergeTopicId}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  אשר מיזוג
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Official System Topic */}
      {isNewSystemTopicOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-rose-600" />
              יצירת נושא חדש מטעם המערכת
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              הנושא יפורסם רשמית תחת שם ההנהלה הראשית (שמואל), יינעץ אוטומטית בראש הפורום הנבחר.
            </p>

            <form onSubmit={handleCreateSysTopicSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  פורום יעד:
                </label>
                <select
                  value={sysForumId}
                  onChange={(e) => setSysForumId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  {allSubCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.parentCategoryTitle} › {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  כותרת ההודעה הרשמית:
                </label>
                <input
                  type="text"
                  required
                  value={sysTitle}
                  onChange={(e) => setSysTitle(e.target.value)}
                  placeholder="למשל: עדכון שרתים חגיגי וגרסה חדשה למרכזיות"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תוכן ההודעה:
                </label>
                <textarea
                  rows={4}
                  required
                  value={sysContent}
                  onChange={(e) => setSysContent(e.target.value)}
                  placeholder="כתוב כאן את תוכן ההכרזה הרשמית..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תגיות (מופרדות בפסיק):
                </label>
                <input
                  type="text"
                  value={sysTags}
                  onChange={(e) => setSysTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewSystemTopicOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
                >
                  פרסם הכרזת הנהלה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Merge Tag */}
      {mergingSourceTag && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Merge className="w-4 h-4 text-purple-600" />
              איחוד תגית #{mergingSourceTag}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              כל הנושאים בעלי התגית #{mergingSourceTag} יקבלו את תגית היעד במקומה.
            </p>

            <select
              value={mergingTargetTag}
              onChange={(e) => setMergingTargetTag(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs mb-3"
            >
              <option value="">-- בחר תגית יעד --</option>
              {tags.filter((t) => t !== mergingSourceTag).map((t) => (
                <option key={t} value={t}>#{t}</option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMergingSourceTag(null)}
                className="px-3 py-1 text-xs text-slate-500"
              >
                ביטול
              </button>
              <button
                type="button"
                disabled={!mergingTargetTag}
                onClick={() => {
                  onMergeTags(mergingSourceTag, mergingTargetTag);
                  setMergingSourceTag(null);
                }}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl"
              >
                מזג תגית
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
