import React, { useState } from 'react';
import { 
  PenSquare, 
  X, 
  Tag, 
  Folder, 
  Send, 
  Paperclip, 
  Code, 
  Bold, 
  Italic, 
  List, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ForumCategory, MediaAttachment, UserProfile } from '../types';
import { MediaUploader } from './MediaUploader';

interface NewTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ForumCategory[];
  defaultForumId?: string;
  currentUser: UserProfile | null;
  onSubmitTopic: (data: {
    forumId: string;
    title: string;
    content: string;
    tags: string[];
    attachments?: MediaAttachment[];
  }) => void;
}

export const NewTopicModal: React.FC<NewTopicModalProps> = ({
  isOpen,
  onClose,
  categories,
  defaultForumId = 'dev-and-scripts',
  currentUser,
  onSubmitTopic,
}) => {
  const [selectedForumId, setSelectedForumId] = useState(defaultForumId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Webhook', 'Node.js']);
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^#/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSubmitTopic({
      forumId: selectedForumId,
      title: title.trim(),
      content: content.trim(),
      tags,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    setTitle('');
    setContent('');
    setAttachments([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-right">
        
        {/* Header */}
        <div className="bg-[#0f2b48] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600">
              <PenSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">יצירת נושא חדש לדיון</h2>
              <p className="text-xs text-slate-300">
                פרסום שאלה, שיתוף מדריך או פיתוח חדש בקהילה
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Forum Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-blue-600" />
              בחר פורום יעד:
            </label>
            <select
              value={selectedForumId}
              onChange={(e) => setSelectedForumId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.title}>
                  {cat.subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              כותרת הנושא:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="כותרת תמציתית וברורה, למשל: כיצד להגדיר שליחת נתוני שיחה ל-Webhook?"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              תגיות (לחץ Enter להוספה):
            </label>
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-2 min-h-[42px]">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-mono"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-600 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "הקלד תגית ולחץ Enter..." : "הוסף עוד תגית..."}
                className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none flex-1 min-w-[120px]"
              />
            </div>
          </div>

          {/* Message Toolbar & Content */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              תוכן ההודעה / השאלה:
            </label>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500">
              {/* Toolbar */}
              <div className="bg-slate-100/90 px-3 py-1.5 border-b border-slate-200 flex items-center gap-2 text-slate-600 text-xs">
                <button
                  type="button"
                  onClick={() => setContent((prev) => prev + '**טקסט מודגש**')}
                  className="p-1 rounded hover:bg-slate-200"
                  title="הדגשה"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setContent((prev) => prev + '*טקסט נטוי*')}
                  className="p-1 rounded hover:bg-slate-200"
                  title="נטוי"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setContent((prev) => prev + '\n```javascript\n// קוד כאן\n```\n')}
                  className="p-1 rounded hover:bg-slate-200"
                  title="בלוק קוד"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setContent((prev) => prev + '\n- סעיף 1\n- סעיף 2\n')}
                  className="p-1 rounded hover:bg-slate-200"
                  title="רשימה"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-[11px] text-slate-400">
                  תמיכה מלאה בעיצוב Markdown וקטעי קוד
                </span>
              </div>

              <textarea
                required
                rows={7}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="פרט את השאלה או המדריך שלך. רצוי להוסיף דוגמאות קוד, פורמט שלוחות והגדרות רלוונטיות..."
                className="w-full p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-y leading-relaxed font-sans"
              />
            </div>
          </div>

          {/* Media & Audio / Video attachments */}
          <MediaUploader
            attachments={attachments}
            onChange={setAttachments}
          />

          {/* User info note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs text-blue-900">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-blue-600" />
              מפרסם כעת בתור: <strong className="font-bold">{currentUser ? (currentUser.name || currentUser.username) : 'משתמש רשום'}</strong>
            </span>
            <span className="text-blue-700 font-bold">
              {currentUser?.role || 'חבר קהילה'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>פרסם נושא בפורום</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
