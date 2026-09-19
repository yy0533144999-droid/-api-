import React, { useState, useRef, useEffect } from 'react';
import { 
  Pin, 
  MessageSquare, 
  Eye, 
  Clock, 
  ArrowRight, 
  PenSquare, 
  Lock, 
  Unlock, 
  Tag, 
  Send, 
  ThumbsUp, 
  ThumbsDown,
  Share2, 
  User, 
  CheckCircle2, 
  Code,
  ShieldAlert,
  Trash2,
  TrendingDown,
  UserX,
  ShieldCheck,
  FileAudio,
  Film,
  Award,
  Sparkles,
  AtSign,
  UserCheck,
  UserPlus,
  LogIn,
  Edit3,
  Mail
} from 'lucide-react';
import { ForumCategory, ForumSubCategory, ForumTopic, UserProfile, MediaAttachment, ForumReply, OnlineUser } from '../types';
import { formatReputation } from '../utils/format';
import { MediaAttachmentViewer } from './MediaAttachmentViewer';
import { MediaUploader } from './MediaUploader';

interface ForumTopicsViewProps {
  category: ForumCategory;
  forum: ForumSubCategory;
  topics: ForumTopic[];
  onBackToCategories: () => void;
  onOpenNewTopic: () => void;
  currentUser: UserProfile | null;
  onAddReply: (topicId: string, replyText: string, attachments?: MediaAttachment[]) => void;
  onToggleLockTopic?: (topicId: string) => void;
  onTogglePinTopic?: (topicId: string) => void;
  onDeleteTopic?: (topicId: string) => void;
  onDeleteReply?: (topicId: string, replyId: string) => void;
  onBanUser?: (userId: string, duration: string, reason: string) => void;
  onQuickLogin?: (username: string, pass: string) => void;
  users?: OnlineUser[];
  onChangeUserReputationByName?: (userName: string, delta: number, reason: string) => void;
  onVoteTopic?: (topicId: string, voteType: 'like' | 'dislike') => void;
  onVoteReply?: (topicId: string, replyId: string, voteType: 'like' | 'dislike') => void;
  repliesList?: { [topicId: string]: ForumReply[] };
  onUpdateSubCategory?: (catId: string, subCatId: string, updated: Partial<ForumSubCategory>) => void;
  onOpenRegister?: () => void;
  onOpenLogin?: () => void;
}

// Helper to render text with @mentions highlighted in blue
export const renderContentWithMentions = (text: string) => {
  if (!text) return '';
  // Split on @mentions containing Hebrew letters, English letters, digits, and underscores
  const parts = text.split(/(@[\u0590-\u05FFa-zA-Z0-9_-]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith('@')) {
      const mentionName = part.slice(1);
      return (
        <span
          key={index}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded-md bg-blue-100 text-blue-700 font-bold border border-blue-200 text-xs dir-ltr hover:bg-blue-200 hover:text-blue-900 transition-colors cursor-pointer shadow-2xs"
          title={`משתמש מתויג: ${mentionName}`}
        >
          <span className="text-blue-500 font-black">@</span>
          <span>{mentionName}</span>
        </span>
      );
    }
    return part;
  });
};

export const ForumTopicsView: React.FC<ForumTopicsViewProps> = ({
  category,
  forum,
  topics,
  onBackToCategories,
  onOpenNewTopic,
  currentUser,
  onAddReply,
  onToggleLockTopic,
  onTogglePinTopic,
  onDeleteTopic,
  onDeleteReply,
  onBanUser,
  onQuickLogin,
  users,
  onChangeUserReputationByName,
  onVoteTopic,
  onVoteReply,
  repliesList: externalRepliesList,
  onUpdateSubCategory,
  onOpenRegister,
  onOpenLogin,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyAttachments, setReplyAttachments] = useState<MediaAttachment[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'popular'>('all');
  
  // Sub-forum editing state
  const [isEditingForum, setIsEditingForum] = useState(false);
  const [editForumTitle, setEditForumTitle] = useState(forum.title || '');
  const [editForumDesc, setEditForumDesc] = useState(forum.description || '');
  const [editForumTags, setEditForumTags] = useState((forum.tags || []).join(', '));

  useEffect(() => {
    setEditForumTitle(forum.title || '');
    setEditForumDesc(forum.description || '');
    setEditForumTags((forum.tags || []).join(', '));
  }, [forum]);

  // Mentions (@) state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionCursorPos, setMentionCursorPos] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Quick Login / Register state for unauthenticated visitors
  const [quickName, setQuickName] = useState('');
  const [quickPass, setQuickPass] = useState('');

  // Collect all available usernames for @mention autocomplete
  const defaultUserNames = ['שמואל', 'ישראל_מפתח', 'YY0533144999', 'יוסי_מפתח', 'אבי_תקשורת', 'דוד_קול'];
  const allUserNames = Array.from(
    new Set([
      ...(users ? users.map((u) => u.name) : []),
      ...defaultUserNames,
      ...(currentUser ? [currentUser.username] : []),
    ])
  );

  const matchingMentionUsers = mentionQuery !== null
    ? allUserNames.filter((name) => name.toLowerCase().includes(mentionQuery.toLowerCase()))
    : allUserNames;

  const insertMention = (targetName: string) => {
    if (mentionQuery !== null && mentionCursorPos > 0) {
      const textBefore = replyContent.slice(0, mentionCursorPos);
      const lastAt = textBefore.lastIndexOf('@');
      if (lastAt !== -1) {
        const prefix = replyContent.slice(0, lastAt);
        const suffix = replyContent.slice(mentionCursorPos);
        const updated = `${prefix}@${targetName} ${suffix}`;
        setReplyContent(updated);
        setShowMentionDropdown(false);
        setMentionQuery(null);
        setTimeout(() => textareaRef.current?.focus(), 50);
        return;
      }
    }
    // Fallback if triggered directly from quick-tag button
    setReplyContent((prev) => (prev ? `${prev} @${targetName} ` : `@${targetName} `));
    setShowMentionDropdown(false);
    setMentionQuery(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setReplyContent(val);
    const cursor = e.target.selectionStart || 0;
    setMentionCursorPos(cursor);

    const textBefore = val.slice(0, cursor);
    const lastAt = textBefore.lastIndexOf('@');
    if (lastAt !== -1) {
      const candidate = textBefore.slice(lastAt + 1);
      if (!candidate.includes(' ') && !candidate.includes('\n')) {
        setMentionQuery(candidate);
        setShowMentionDropdown(true);
        return;
      }
    }
    setShowMentionDropdown(false);
    setMentionQuery(null);
  };

  // Check if current user is banned
  const isCurrentUserBanned = Boolean(
    currentUser?.isBanned ||
    (users && currentUser && users.find((u) => u.name.toLowerCase() === currentUser.username.toLowerCase())?.isBanned)
  );

  // Helper to determine if an author is a forum administrator
  const isAuthorAdmin = (name?: string, role?: string): boolean => {
    if (!name && !role) return false;
    if (role && (role.includes('מנהל') || role.toLowerCase().includes('admin'))) return true;
    if (name && (name === 'שמואל' || name.toLowerCase().includes('admin'))) return true;
    if (name && currentUser && currentUser.username.toLowerCase() === name.toLowerCase() && currentUser.isAdmin) return true;
    if (name && users) {
      const found = users.find((u) => (u?.name || '').toLowerCase() === name.toLowerCase());
      if (found && (found.role?.includes('מנהל') || found.isAdmin)) return true;
    }
    return false;
  };
  
  // Local fallback if external not passed
  const [internalReplies, setInternalReplies] = useState<{ [topicId: string]: ForumReply[] }>({
    'topic-1': [
      {
        id: 'r-1',
        authorName: 'ישראל_מפתח',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        authorRole: 'תומך טופ',
        text: 'להלן מבנה ה-Payload המומלץ לקבלת מספר מחייג (CallerID):\n```json\n{\n  "caller": "0501234567",\n  "extension": "100",\n  "digits": "1234"\n}\n```\nשימו לב לבדוק את ה-Header של ה-Token שנשלח במערכת.',
        timeAgo: 'לפני יומיים',
        likes: 14,
        dislikes: 0,
      },
      {
        id: 'r-2',
        authorName: 'YY0533144999',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        authorRole: 'מפתח בכיר & תומך טופ',
        text: 'מעולה! הוספתי סקריפט ב-Node.js עם Express שבודק אוטומטית את שלמות הבקשה ומחזיר פקודת go_to_folder אם הסיסמה נכונה.',
        timeAgo: 'לפני 4 דקות',
        likes: 9,
        dislikes: 0,
      },
    ],
  });

  const repliesList = externalRepliesList || internalReplies;

  const forumTopics = topics.filter((t) => t.forumId === forum.id);

  const filteredTopics = forumTopics.filter((t) => {
    if (activeFilter === 'pinned') return t.isPinned;
    if (activeFilter === 'popular') return t.repliesCount > 10;
    return true;
  });

  const handlePostReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !replyContent.trim()) return;

    onAddReply(
      selectedTopic.id, 
      replyContent.trim(), 
      replyAttachments.length > 0 ? replyAttachments : undefined
    );

    // Also update internal state if external wasn't passed
    if (!externalRepliesList) {
      const newReply: ForumReply = {
        id: `r-${Date.now()}`,
        authorName: currentUser ? (currentUser.name || currentUser.username) : 'משתמש',
        authorAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        authorRole: currentUser?.role || 'חבר קהילה',
        text: replyContent.trim(),
        timeAgo: 'ממש עכשיו',
        likes: 0,
        dislikes: 0,
        attachments: replyAttachments.length > 0 ? replyAttachments : undefined,
      };

      setInternalReplies((prev) => ({
        ...prev,
        [selectedTopic.id]: [...(prev[selectedTopic.id] || []), newReply],
      }));
    }

    setReplyContent('');
    setReplyAttachments([]);
  };

  // If viewing a specific topic thread
  const activeTopic = selectedTopic ? (topics.find((t) => t.id === selectedTopic.id) || selectedTopic) : null;

  if (activeTopic) {
    const currentTopicReplies = repliesList[activeTopic.id] || [];

    return (
      <div className="space-y-5">
        {/* Back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTopic(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לרשימת הנושאים ב{forum.title}</span>
          </button>
          
          <button
            onClick={onOpenNewTopic}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow"
          >
            <PenSquare className="w-3.5 h-3.5" />
            נושא חדש
          </button>
        </div>

        {/* Locked Alert Banner for all visitors */}
        {activeTopic.isLocked && (
          <div className="bg-red-600 text-white px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-red-900/20 border-2 border-red-700 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base flex items-center gap-2">
                  <span>דיון זה ננעל לתגובות על ידי הנהלת הפורום!</span>
                  <span className="bg-white text-red-700 text-[10px] font-black px-2 py-0.5 rounded-full">נעול</span>
                </h4>
                <p className="text-xs text-red-100 mt-0.5">
                  משתמשים רגילים אינם מורשים להגיב בדיון זה. רק מנהלי הפורום רשאים להגיב או לפתוח את הנושא מחדש.
                </p>
              </div>
            </div>
            {currentUser?.isAdmin && onToggleLockTopic && (
              <button
                onClick={() => onToggleLockTopic(activeTopic.id)}
                className="bg-white hover:bg-red-50 text-red-700 text-xs font-black px-3.5 py-1.5 rounded-xl shadow transition-colors cursor-pointer shrink-0"
              >
                בטל נעילה ופתח לכולם
              </button>
            )}
          </div>
        )}

        {/* Topic Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Admin Moderation Toolbar inside Topic View */}
          {currentUser?.isAdmin && (
            <div className="bg-rose-950 text-rose-100 px-5 py-3 border-b border-rose-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-bold">סרגל כלי מנהל (שמואל):</span>
                <span>פעולות ניהול ישירות על דיון זה</span>
              </div>
              <div className="flex items-center gap-2">
                {onToggleLockTopic && (
                  <button
                    onClick={() => onToggleLockTopic(activeTopic.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      activeTopic.isLocked 
                        ? 'bg-red-600 text-white hover:bg-red-500' 
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {activeTopic.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{activeTopic.isLocked ? 'בטל נעילת דיון' : 'נעל דיון'}</span>
                  </button>
                )}

                {onTogglePinTopic && (
                  <button
                    onClick={() => onTogglePinTopic(activeTopic.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                      activeTopic.isPinned 
                        ? 'bg-sky-600 text-white hover:bg-sky-500' 
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span>{activeTopic.isPinned ? 'בטל נעיצה' : 'נעץ בראש'}</span>
                  </button>
                )}

                {onChangeUserReputationByName && (
                  <button
                    onClick={() => onChangeUserReputationByName(activeTopic.author?.name || '', -20, 'עבירה על כללי הפורום בדיון')}
                    className="bg-amber-700 hover:bg-amber-600 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="הורד 20 מוניטין לכותב הדיון"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>הורד מוניטין לכותב (-20)</span>
                  </button>
                )}

                {onDeleteTopic && (
                  <button
                    onClick={() => {
                      onDeleteTopic(activeTopic.id);
                      setSelectedTopic(null);
                    }}
                    className="bg-rose-700 hover:bg-rose-600 text-white px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>מחק נושא</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Topic Title Bar */}
          <div className="bg-[#0f2b48] text-white p-5 border-b border-[#1f4269]">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {activeTopic.isPinned && (
                <span className="bg-amber-500/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  נושא נעוץ
                </span>
              )}
              {activeTopic.isLocked && (
                <span className="bg-red-600 text-white border border-red-400 text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                  <Lock className="w-3.5 h-3.5" />
                  נעול לתגובות
                </span>
              )}
              {activeTopic.tags.map((t) => (
                <span key={t} className="bg-white/10 text-sky-200 text-[11px] px-2 py-0.5 rounded font-mono">
                  #{t}
                </span>
              ))}
            </div>
            <h1 className="text-lg sm:text-xl font-bold">{activeTopic.title}</h1>
            <div className="flex items-center gap-4 text-xs text-slate-300 mt-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                פורסם: {activeTopic.createdAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {activeTopic.viewsCount} צפיות
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                {activeTopic.repliesCount + currentTopicReplies.length} תגובות
              </span>
            </div>
          </div>

          {/* Original Post */}
          <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-start gap-3.5">
              <img
                src={activeTopic.author?.avatar}
                alt={activeTopic.author?.name || 'מחבר'}
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    {activeTopic.author?.name || 'משתמש'}
                  </span>
                  <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
                    {activeTopic.author?.role || 'חבר קהילה'}
                  </span>
                  {activeTopic.author?.reputation !== undefined && (
                    <span 
                      title={`מוניטין: ${activeTopic.author.reputation}`}
                      className="text-[10px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-300 px-1.5 py-0.2 rounded"
                    >
                      +{formatReputation(activeTopic.author.reputation)} מוניטין
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-2">
                  {renderContentWithMentions(activeTopic.snippet)}
                  <p className="mt-3 text-slate-600">
                    למידע נוסף ניתן לעיין בקובץ התיעוד הרשמי של מודול Webhooks או לבדוק את הדוגמאות בערוץ הפיתוח.
                  </p>

                  {/* Admin Signature Note */}
                  {isAuthorAdmin(activeTopic.author?.name, activeTopic.author?.role) && (
                    <div className="mt-4 pt-2.5 border-t border-slate-200/70 text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 font-medium">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>לפניות בנוגע לפורום:</span>
                      <a
                        href="mailto:ivr3293@gmail.com"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-mono font-bold tracking-tight"
                        dir="ltr"
                      >
                        ivr3293@gmail.com
                      </a>
                    </div>
                  )}
                </div>

                {/* Topic Media Attachments (Audio / Video / Image) */}
                {activeTopic.attachments && activeTopic.attachments.length > 0 && (
                  <div className="pt-3">
                    <MediaAttachmentViewer attachments={activeTopic.attachments} />
                  </div>
                )}

                {/* Real Likes & Dislikes on Topic */}
                <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => onVoteTopic?.(activeTopic.id, 'like')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                      activeTopic.reactions?.[currentUser?.username || ''] === 'like'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                    }`}
                    title="לייק מוסיף +1 למוניטין של כותב הפוסט"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>אהבתי ({activeTopic.likes || 0})</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-mono px-1 rounded ml-0.5">
                      +1 מוניטין
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onVoteTopic?.(activeTopic.id, 'dislike')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                      activeTopic.reactions?.[currentUser?.username || ''] === 'dislike'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                    }`}
                    title="דיסלייק מוריד -1 ממוניטין של כותב הפוסט"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>לא אהבתי ({activeTopic.dislikes || 0})</span>
                    <span className="text-[10px] bg-rose-100 text-rose-900 font-mono px-1 rounded ml-0.5">
                      -1 מוניטין
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-500 mr-auto flex items-center gap-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    מערכת מוניטין אמיתית פעילה: לייק +1, דיסלייק -1
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Replies Thread */}
          <div className="divide-y divide-slate-100 p-5 sm:p-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              תגובות בשרשור ({currentTopicReplies.length})
            </h3>

            {currentTopicReplies.map((reply) => (
              <div key={reply.id} className="pt-4 flex items-start gap-3.5">
                <img
                  src={reply.authorAvatar}
                  alt={reply.authorName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {reply.authorName}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {reply.authorRole}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {reply.timeAgo}
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                    {renderContentWithMentions(reply.text)}

                    {/* Admin Signature Note */}
                    {isAuthorAdmin(reply.authorName, reply.authorRole) && (
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5 font-medium">
                        <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>לפניות בנוגע לפורום:</span>
                        <a
                          href="mailto:ivr3293@gmail.com"
                          className="text-blue-600 hover:text-blue-800 hover:underline font-mono font-bold tracking-tight"
                          dir="ltr"
                        >
                          ivr3293@gmail.com
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Reply Media Attachments */}
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="pt-2">
                      <MediaAttachmentViewer attachments={reply.attachments} />
                    </div>
                  )}

                  {/* Reply Actions: Likes, Dislikes & Admin Functions */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onVoteReply?.(activeTopic.id, reply.id, 'like')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border shadow-2xs ${
                          reply.reactions?.[currentUser?.username || ''] === 'like'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                        title="אהבתי (+1 למוניטין)"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>אהבתי ({reply.likes || 0})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onVoteReply?.(activeTopic.id, reply.id, 'dislike')}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border shadow-2xs ${
                          reply.reactions?.[currentUser?.username || ''] === 'dislike'
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                        title="לא אהבתי (-1 ממוניטין)"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                        <span>לא אהבתי ({reply.dislikes || 0})</span>
                      </button>
                    </div>

                    {/* Admin Moderation Controls on each Reply */}
                    {currentUser?.isAdmin && (
                      <div className="flex items-center gap-1.5 bg-slate-100/90 px-2 py-1 rounded-lg border border-slate-200 text-[11px]">
                        <span className="font-bold text-slate-500 ml-1">ניהול:</span>
                        {onChangeUserReputationByName && (
                          <>
                            <button
                              type="button"
                              onClick={() => onChangeUserReputationByName(reply.authorName, 1, 'חיזוק מנהל לתגובה עניינית')}
                              className="text-emerald-700 hover:bg-emerald-100 font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                              title="הוסף +1 מוניטין לכותב התגובה"
                            >
                              +1 מוניטין
                            </button>
                            <button
                              type="button"
                              onClick={() => onChangeUserReputationByName(reply.authorName, -1, 'הורדת מנהל בגין תוכן לא הולם')}
                              className="text-rose-700 hover:bg-rose-100 font-bold px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                              title="הורד -1 מוניטין מכותב התגובה"
                            >
                              -1 מוניטין
                            </button>
                          </>
                        )}
                        {onDeleteReply && (
                          <button
                            type="button"
                            onClick={() => onDeleteReply(activeTopic.id, reply.id)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer font-semibold"
                            title="מחק תגובה זו"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>מחק תגובה</span>
                          </button>
                        )}
                        {onBanUser && (
                          <button
                            type="button"
                            onClick={() => onBanUser(reply.authorName, '3days', 'הפרת כללי הפורום והתנהגות בלתי הולמת')}
                            className="text-red-700 hover:bg-red-100 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer font-bold"
                            title="חסום משתמש זה מהפורום"
                          >
                            <UserX className="w-3 h-3" />
                            <span>חסום</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Reply Form / Restrictions Section */}
          <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200">
            {/* Condition 1: Banned user cannot reply and sees prominent alert */}
            {isCurrentUserBanned ? (
              <div className="bg-red-50 border-2 border-red-600 rounded-2xl p-6 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-red-700">חשבונך חסום במערכת הפורום</h3>
                  <p className="text-xs text-red-600 mt-1 max-w-lg mx-auto font-medium leading-relaxed">
                    המשתמש שלך ({currentUser?.username}) נחסם על ידי הנהלת הפורום. אינך מורשה להגיב בדיונים, לפתוח נושאים חדשים או להשתתף בפורום.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
                  <UserX className="w-3.5 h-3.5" />
                  <span>גישת קריאה בלבד</span>
                </div>
              </div>
            ) : !currentUser ? (
              /* Condition 2: Mandatory registration/login to reply */
              <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-6 text-center space-y-4 shadow-xs">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <UserCheck className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-amber-900">חובה להירשם או להתחבר כדי להגיב בפורום</h3>
                  <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto leading-relaxed font-medium">
                    לפי מדיניות הפורום, כתיבת תגובות ושיתוף תוכן פתוחים אך ורק לחברים רשומים. ניתן להירשם בחינם תוך שניות בודדות!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="bg-gradient-to-r from-blue-700 to-sky-600 hover:from-blue-800 hover:to-sky-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>הרשמה מהירה לפורום (פתיחת חשבון)</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-amber-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4 text-slate-600" />
                    <span>התחברות לחשבון קיים</span>
                  </button>
                </div>

                {/* Quick login inline */}
                <div className="pt-2 border-t border-amber-200/60 max-w-md mx-auto">
                  <span className="text-[11px] text-amber-900 font-medium block mb-2">או כניסה מהירה ישירה:</span>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (quickName.trim() && onQuickLogin) {
                        onQuickLogin(quickName.trim(), quickPass || '123456');
                      }
                    }}
                    className="flex flex-col sm:flex-row items-center gap-2"
                  >
                    <input
                      type="text"
                      required
                      placeholder="שם משתמש"
                      value={quickName}
                      onChange={(e) => setQuickName(e.target.value)}
                      className="w-full sm:flex-1 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="password"
                      placeholder="סיסמה"
                      value={quickPass}
                      onChange={(e) => setQuickPass(e.target.value)}
                      className="w-full sm:w-28 bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#0f2b48] hover:bg-blue-900 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      כניסה
                    </button>
                  </form>
                </div>
              </div>
            ) : activeTopic.isLocked && !currentUser?.isAdmin ? (
              /* Condition 3: Locked Topic for non-admin */
              <div className="bg-red-50 border-2 border-red-600 rounded-2xl p-6 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-red-700">הנושא נעול - אין אפשרות תגובה</h3>
                  <p className="text-xs text-red-600 mt-1 max-w-lg mx-auto font-medium leading-relaxed">
                    דיון זה ננעל לתגובות נוספות על ידי הנהלת הפורום (שמואל). משתמשים רגילים אינם מורשים להגיב בדיון זה. רק מנהלי הפורום רשאים להגיב או לפתוח את הדיון מחדש.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>תגובות מוגבלות למנהלי הפורום בלבד</span>
                </div>
              </div>
            ) : (
              /* Condition 4: Reply Form with @mention autocomplete */
              <div>
                {activeTopic.isLocked && currentUser?.isAdmin && (
                  <div className="mb-4 bg-red-50 border-2 border-red-600 rounded-xl p-3.5 text-xs text-red-900 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                      <div>
                        <strong className="block text-red-800 text-sm">הנושא נעול לתגובות משתמשים - הרשאת מנהל מיוחדת פעילה:</strong>
                        <span className="text-red-700">כיוון שאתה מחובר כמנהל ראשי (שמואל), באפשרותך לפרסם תגובת הנהלה רשמית.</span>
                      </div>
                    </div>
                    <span className="bg-red-600 text-white font-black px-2.5 py-1 rounded-lg text-[11px] shrink-0 shadow-xs">
                      תגובת מנהל בלבד
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <PenSquare className="w-3.5 h-3.5 text-blue-600" />
                    {activeTopic.isLocked ? 'פרסום תגובת הנהלה רשמית בדיון נעול:' : 'הוספת תגובה לדיון (הקלד @ כדי לתייג משתמש):'}
                  </h4>

                  <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                    <AtSign className="w-3 h-3 text-blue-600" />
                    <span>תיוג בכחול זמין בהקלדת @</span>
                  </span>
                </div>

                <form onSubmit={handlePostReply} className="space-y-3 relative">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      rows={3}
                      required
                      value={replyContent}
                      onChange={handleReplyChange}
                      placeholder={
                        activeTopic.isLocked
                          ? 'כתוב תגובת הנהלה רשמית / הנחיה לחברי הפורום...'
                          : 'כתוב תגובה עניינית, הוסף קוד או מענה... (הקלד @ לתיוג משתמש שיופיע בכחול)'
                      }
                      className={`w-full p-3 bg-white border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 ${
                        activeTopic.isLocked ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-blue-500'
                      }`}
                    />

                    {/* Mentions Autocomplete Dropdown */}
                    {showMentionDropdown && matchingMentionUsers.length > 0 && (
                      <div className="absolute z-20 top-full mt-1 right-0 w-64 max-h-48 overflow-y-auto bg-white border-2 border-blue-400 rounded-xl shadow-xl p-1.5 space-y-1">
                        <div className="text-[11px] font-bold text-blue-900 px-2 py-1 bg-blue-50 rounded-lg flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <AtSign className="w-3 h-3 text-blue-600" />
                            בחר משתמש לתיוג:
                          </span>
                          <span className="text-[10px] text-blue-600 font-mono">
                            {matchingMentionUsers.length} נמצאו
                          </span>
                        </div>
                        {matchingMentionUsers.map((name) => (
                          <button
                            key={name}
                            type="button"
                            onClick={() => insertMention(name)}
                            className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-blue-100 flex items-center justify-between gap-2 text-xs font-bold text-slate-800 hover:text-blue-900 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-mono">
                                @
                              </span>
                              <span>{name}</span>
                            </span>
                            <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded font-mono">
                              בכחול
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick-Tag Chips Row */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs pt-0.5">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                      <AtSign className="w-3 h-3 text-blue-600" />
                      תיוג מהיר:
                    </span>
                    {allUserNames.slice(0, 7).map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => insertMention(name)}
                        className="text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        title={`תייג את ${name} בתגובה`}
                      >
                        <span>@{name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Media Uploader in Reply (audio, video, image) */}
                  <MediaUploader
                    attachments={replyAttachments}
                    onChange={setReplyAttachments}
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">
                      מגיב בתור: <strong className="text-slate-800">{currentUser?.name || currentUser?.username || 'משתמש רשום'}</strong>
                      {currentUser?.isAdmin && (
                        <span className="text-red-700 font-bold mr-1">(מנהל ראשי)</span>
                      )}
                    </span>
                    <button
                      type="submit"
                      className={`text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer ${
                        activeTopic.isLocked
                          ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {activeTopic.isLocked ? <ShieldCheck className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
                      {activeTopic.isLocked ? 'פרסם תגובת הנהלה רשמית' : 'פרסם תגובה'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Forum Topics List View
  return (
    <div className="space-y-5">
      {/* Forum Header Banner */}
      <div className="bg-[#0f2b48] text-white p-5 rounded-2xl shadow-xs border border-[#1d416b]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 text-sky-300 text-xs">
              <span>{category.title}</span>
              <span>›</span>
              <span className="font-semibold text-white">{forum.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {forum.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
              {forum.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentUser?.isAdmin && onUpdateSubCategory && (
              <button
                type="button"
                onClick={() => {
                  setEditForumTitle(forum.title || '');
                  setEditForumDesc(forum.description || '');
                  setEditForumTags((forum.tags || []).join(', '));
                  setIsEditingForum(true);
                }}
                className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-2 rounded-xl border border-amber-600 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="ערוך הגדרות תת-פורום זה"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ערוך תת-פורום</span>
              </button>
            )}
            <button
              onClick={onBackToCategories}
              className="text-xs bg-[#193d64] hover:bg-[#224e7e] text-slate-200 px-3 py-2 rounded-xl border border-[#2b5a8d] transition-colors cursor-pointer"
            >
              כל הקטגוריות
            </button>
            <button
              onClick={onOpenNewTopic}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <PenSquare className="w-3.5 h-3.5" />
              נושא חדש
            </button>
          </div>
        </div>

        {/* Forum Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
          {(forum.tags || []).map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-sky-500/20 text-sky-200 px-2 py-0.5 rounded font-mono border border-sky-400/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Filter Tabs & Counter */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#0f2b48] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            כל הדיונים ({forumTopics.length})
          </button>
          <button
            onClick={() => setActiveFilter('pinned')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'pinned'
                ? 'bg-amber-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            נעוצים
          </button>
          <button
            onClick={() => setActiveFilter('popular')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeFilter === 'popular'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            פופולריים
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          סדר תצוגה: הודעות עדכניות ביותר ראשונות
        </span>
      </div>

      {/* Topics List Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filteredTopics.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            לא נמצאו נושאים בקטגוריה זו. לחץ "צור נושא חדש" כדי לפתוח את הדיון הראשון!
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              className="p-4 sm:p-5 hover:bg-slate-50/90 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Right side in RTL: Title, author, tags, snippet */}
              <div className="flex items-start gap-3.5 flex-1">
                <img
                  src={topic.author?.avatar}
                  alt={topic.author?.name || 'מחבר'}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 mt-1"
                />

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {topic.isPinned && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                        <Pin className="w-3 h-3" />
                        נעוץ
                      </span>
                    )}
                    {topic.isLocked && (
                      <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                        <Lock className="w-3 h-3 text-white" />
                        נעול לתגובות
                      </span>
                    )}
                    {topic.attachments?.some((a) => a.type === 'audio') && (
                      <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-sky-200">
                        <FileAudio className="w-3 h-3 text-sky-600" />
                        קובץ שמע
                      </span>
                    )}
                    {topic.attachments?.some((a) => a.type === 'video') && (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-200">
                        <Film className="w-3 h-3 text-rose-600" />
                        סרטון
                      </span>
                    )}
                    {(topic.likes || 0) > 0 && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                        <ThumbsUp className="w-2.5 h-2.5 text-emerald-600" />
                        +{topic.likes}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                      {topic.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-1">
                    {topic.snippet}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="font-medium text-slate-600">
                      מאת: {topic.author?.name || 'משתמש'}
                    </span>
                    <span>•</span>
                    <span>{topic.createdAt}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {topic.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Left side in RTL: Stats and Last Reply */}
              <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-center w-14">
                  <span className="block text-sm font-bold text-slate-800 font-mono">
                    {topic.repliesCount}
                  </span>
                  <span className="text-[11px] text-slate-400">תגובות</span>
                </div>

                <div className="text-center w-14">
                  <span className="block text-sm font-bold text-slate-800 font-mono">
                    {topic.viewsCount}
                  </span>
                  <span className="text-[11px] text-slate-400">צפיות</span>
                </div>

                {/* Last reply block */}
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 w-44 shrink-0 text-right">
                  {topic.lastReply ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={topic.lastReply.userAvatar || topic.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={topic.lastReply.userName || ''}
                        className="w-6 h-6 rounded-full object-cover border border-slate-300"
                      />
                      <div className="overflow-hidden">
                        <p className="text-[11px] font-semibold text-slate-700 truncate">
                          {topic.lastReply.userName}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {topic.lastReply.timestamp}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-400 text-center py-1 font-medium">
                      אין תגובות
                    </div>
                  )}
                </div>

                {/* Inline Admin Quick Moderation Buttons */}
                {currentUser?.isAdmin && (
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {onToggleLockTopic && (
                      <button
                        onClick={() => onToggleLockTopic(topic.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          topic.isLocked 
                            ? 'bg-amber-500 text-white border-amber-600' 
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50 border-slate-200'
                        }`}
                        title={topic.isLocked ? "בטל נעילת נושא" : "נעל נושא לתגובות"}
                      >
                        {topic.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                    )}

                    {onTogglePinTopic && (
                      <button
                        onClick={() => onTogglePinTopic(topic.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          topic.isPinned 
                            ? 'bg-sky-600 text-white border-sky-700' 
                            : 'bg-slate-100 text-slate-600 hover:bg-sky-50 border-slate-200'
                        }`}
                        title={topic.isPinned ? "בטל נעיצה" : "נעץ בראש הפורום"}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onDeleteTopic && (
                      <button
                        onClick={() => onDeleteTopic(topic.id)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700 border border-slate-200 transition-colors cursor-pointer"
                        title="מחק נושא"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Edit Sub-forum Modal */}
      {isEditingForum && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              עריכת תת-פורום: {forum.title}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editForumTitle.trim()) return;
                const parsedTags = editForumTags
                  .split(',')
                  .map((t) => t.trim().replace(/^#/, ''))
                  .filter((t) => t.length > 0);
                if (onUpdateSubCategory) {
                  onUpdateSubCategory(category.id, forum.id, {
                    title: editForumTitle.trim(),
                    description: editForumDesc.trim(),
                    tags: parsedTags.length > 0 ? parsedTags : ['כללי'],
                  });
                }
                setIsEditingForum(false);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  שם תת-הפורום:
                </label>
                <input
                  type="text"
                  required
                  value={editForumTitle}
                  onChange={(e) => setEditForumTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תיאור תת-הפורום:
                </label>
                <textarea
                  rows={2}
                  value={editForumDesc}
                  onChange={(e) => setEditForumDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  תגיות מומלצות (מופרדות בפסיקים):
                </label>
                <input
                  type="text"
                  value={editForumTags}
                  onChange={(e) => setEditForumTags(e.target.value)}
                  placeholder="IVR, הגדרות, תמיכה"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingForum(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  שמור שינויים
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
