import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  Layers, 
  Users, 
  Cpu, 
  ShieldCheck, 
  BarChart3, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  AdminLog, 
  AutomationRule, 
  BannedEntity, 
  ForumCategory, 
  ForumSubCategory, 
  ForumTopic, 
  MediaAttachment, 
  OnlineUser, 
  RolePermission, 
  ThemeSettings, 
  TrashItem, 
  UserProfile, 
  UserWarning, 
  WebhookConfig, 
  WordFilterConfig 
} from '../types';
import { AdminContentTab } from './admin/AdminContentTab';
import { AdminUsersTab } from './admin/AdminUsersTab';
import { AdminAutomationTab } from './admin/AdminAutomationTab';
import { AdminSecurityTab } from './admin/AdminSecurityTab';
import { AdminAnalyticsTab } from './admin/AdminAnalyticsTab';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  
  // Categories & Content
  categories: ForumCategory[];
  onAddCategory: (cat: { title: string; description: string; iconName: string; badge?: string }) => void;
  onUpdateCategory: (catId: string, updated: Partial<ForumCategory>) => void;
  onDeleteCategory: (catId: string) => void;
  onAddSubCategory: (catId: string, subCat: { title: string; description: string; tags: string[] }) => void;
  onUpdateSubCategory: (catId: string, subCatId: string, updated: Partial<ForumSubCategory>) => void;
  onDeleteSubCategory: (catId: string, subCatId: string) => void;
  onReorderCategories: (newCategories: ForumCategory[]) => void;

  // Topics & Moderation
  topics: ForumTopic[];
  onToggleLockTopic: (topicId: string) => void;
  onTogglePinTopic: (topicId: string) => void;
  onDeleteTopic: (topicId: string, reason?: string) => void;
  onMoveTopic: (topicId: string, targetSubCategoryId: string) => void;
  onMergeTopics: (sourceTopicId: string, targetTopicId: string) => void;
  onCreateSystemTopic: (title: string, content: string, forumId: string, tags: string[]) => void;

  // Tags
  tags: string[];
  onAddTag: (tagName: string) => void;
  onRenameTag: (oldTag: string, newTag: string) => void;
  onMergeTags: (sourceTag: string, targetTag: string) => void;
  onDeleteTag: (tagName: string) => void;

  // Trash
  trashItems: TrashItem[];
  onRestoreTopic: (trashId: string) => void;
  onPermanentDeleteTopic: (trashId: string) => void;
  onEmptyTrash: () => void;

  // Users & Permissions
  users: OnlineUser[];
  onUpdateUser: (userId: string, updated: Partial<OnlineUser>) => void;
  onBanUser: (userId: string, duration: string, reason: string) => void;
  onDeleteAndBanUser: (userId: string, reason: string, purgeTopics?: boolean) => void;
  onUnbanUser: (userId: string) => void;
  onChangeReputation: (userId: string, delta: number, reason: string) => void;
  onChangeUserRole?: (userId: string, newRole: string) => void;
  onToggleMuteUser: (userId: string) => void;
  onVerifyEmail: (userId: string) => void;

  // Warnings & Permissions
  warnings: UserWarning[];
  onIssueWarning: (userId: string, reason: string) => void;
  permissions: RolePermission[];
  onUpdatePermission: (roleName: string, field: keyof RolePermission, value: boolean) => void;
  bannedEntities: BannedEntity[];
  onAddBannedEntity: (type: 'ip' | 'email' | 'username', value: string, reason: string) => void;
  onRemoveBannedEntity: (id: string) => void;

  // Automation & Broadcast
  announcement?: {
    text: string;
    type: 'urgent' | 'info';
    active: boolean;
  };
  onUpdateAnnouncement?: (text: string, type: 'urgent' | 'info', active: boolean) => void;
  onSendBroadcast: (subject: string, message: string, targetGroup: string) => void;
  webhooks: WebhookConfig[];
  onAddWebhook: (wh: Omit<WebhookConfig, 'id'>) => void;
  onToggleWebhook: (id: string) => void;
  onDeleteWebhook: (id: string) => void;
  onTestWebhook: (id: string) => void;
  automationRules: AutomationRule[];
  onToggleRule: (id: string) => void;
  onAddRule: (rule: Omit<AutomationRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;

  // Security, Logs & Media
  adminLogs: AdminLog[];
  onClearLogs?: () => void;
  wordFilter: WordFilterConfig;
  onUpdateWordFilter: (filter: WordFilterConfig) => void;
  allMedia: MediaAttachment[];
  onDeleteMediaItem?: (id: string) => void;

  // Analytics & Theme
  themeSettings: ThemeSettings;
  onUpdateThemeSettings: (updated: Partial<ThemeSettings>) => void;
  onResetAllDemoData?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
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
  users,
  onUpdateUser,
  onBanUser,
  onDeleteAndBanUser,
  onUnbanUser,
  onChangeReputation,
  onChangeUserRole,
  onToggleMuteUser,
  onVerifyEmail,
  warnings,
  onIssueWarning,
  permissions,
  onUpdatePermission,
  bannedEntities,
  onAddBannedEntity,
  onRemoveBannedEntity,
  announcement,
  onUpdateAnnouncement,
  onSendBroadcast,
  webhooks,
  onAddWebhook,
  onToggleWebhook,
  onDeleteWebhook,
  onTestWebhook,
  automationRules,
  onToggleRule,
  onAddRule,
  onDeleteRule,
  adminLogs,
  onClearLogs,
  wordFilter,
  onUpdateWordFilter,
  allMedia,
  onDeleteMediaItem,
  themeSettings,
  onUpdateThemeSettings,
  onResetAllDemoData,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'content' | 'users' | 'automation' | 'security' | 'analytics'>('content');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-slate-50 border border-slate-300 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-right">
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/90 border border-rose-400/40 flex items-center justify-center shadow-inner">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">מרכז ניהול ובקרה ראשי (Admin Dashboard)</h2>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  v3.2 NodeBB Pro
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                מחובר כמנהל מערכת ראשי: <span className="text-white font-semibold">{currentUser?.displayName || 'שמואל'}</span> • שליטה מלאה בתוכן, משתמשים, אבטחה ואוטומציות
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onResetAllDemoData && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('האם לאפס את כל הנתונים לברירת המחדל ההתחלתית?')) {
                    onResetAllDemoData();
                  }
                }}
                className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
                title="איפוס כל הנתונים המקומיים"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>איפוס נתוני הדגמה</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="סגור חלון ניהול"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary 5-Pillar Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0 shadow-xs">
          {/* 1. Content */}
          <button
            type="button"
            onClick={() => setActiveMainTab('content')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeMainTab === 'content'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>1. ניהול תוכן ושרשורים</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeMainTab === 'content' ? 'bg-rose-900 text-rose-100' : 'bg-slate-100 text-slate-600'}`}>
              {categories.length}
            </span>
          </button>

          {/* 2. Users */}
          <button
            type="button"
            onClick={() => setActiveMainTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeMainTab === 'users'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. משתמשים והרשאות</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeMainTab === 'users' ? 'bg-rose-900 text-rose-100' : 'bg-slate-100 text-slate-600'}`}>
              {users.length}
            </span>
          </button>

          {/* 3. Automation */}
          <button
            type="button"
            onClick={() => setActiveMainTab('automation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeMainTab === 'automation'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. אוטומציות ואינטגרציות</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeMainTab === 'automation' ? 'bg-rose-900 text-rose-100' : 'bg-slate-100 text-slate-600'}`}>
              {webhooks.length + automationRules.length}
            </span>
          </button>

          {/* 4. Security */}
          <button
            type="button"
            onClick={() => setActiveMainTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeMainTab === 'security'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>4. אבטחה, סינון וספאם</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeMainTab === 'security' ? 'bg-rose-900 text-rose-100' : 'bg-slate-100 text-slate-600'}`}>
              {wordFilter.blockedWords.length}
            </span>
          </button>

          {/* 5. Analytics & Theme */}
          <button
            type="button"
            onClick={() => setActiveMainTab('analytics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeMainTab === 'analytics'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>5. עיצוב וסטטיסטיקה</span>
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeMainTab === 'content' && (
            <AdminContentTab
              categories={categories}
              onAddCategory={onAddCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
              onAddSubCategory={onAddSubCategory}
              onUpdateSubCategory={onUpdateSubCategory}
              onDeleteSubCategory={onDeleteSubCategory}
              onReorderCategories={onReorderCategories}
              topics={topics}
              onToggleLockTopic={onToggleLockTopic}
              onTogglePinTopic={onTogglePinTopic}
              onDeleteTopic={onDeleteTopic}
              onMoveTopic={onMoveTopic}
              onMergeTopics={onMergeTopics}
              onCreateSystemTopic={onCreateSystemTopic}
              tags={tags}
              onAddTag={onAddTag}
              onRenameTag={onRenameTag}
              onMergeTags={onMergeTags}
              onDeleteTag={onDeleteTag}
              trashItems={trashItems}
              onRestoreTopic={onRestoreTopic}
              onPermanentDeleteTopic={onPermanentDeleteTopic}
              onEmptyTrash={onEmptyTrash}
            />
          )}

          {activeMainTab === 'users' && (
            <AdminUsersTab
              users={users}
              onUpdateUser={onUpdateUser}
              onBanUser={onBanUser}
              onUnbanUser={onUnbanUser}
              onDeleteAndBanUser={onDeleteAndBanUser}
              onChangeReputation={onChangeReputation}
              onChangeUserRole={onChangeUserRole || (() => {})}
              onToggleMuteUser={onToggleMuteUser}
              onVerifyEmail={onVerifyEmail}
              warnings={warnings}
              onIssueWarning={onIssueWarning}
              permissions={permissions}
              onUpdatePermission={onUpdatePermission}
              bannedEntities={bannedEntities}
              onAddBannedEntity={onAddBannedEntity}
              onRemoveBannedEntity={onRemoveBannedEntity}
            />
          )}

          {activeMainTab === 'automation' && (
            <AdminAutomationTab
              announcement={announcement}
              onUpdateAnnouncement={onUpdateAnnouncement}
              onSendBroadcast={onSendBroadcast}
              webhooks={webhooks}
              onAddWebhook={onAddWebhook}
              onToggleWebhook={onToggleWebhook}
              onDeleteWebhook={onDeleteWebhook}
              onTestWebhook={onTestWebhook}
              automationRules={automationRules}
              onToggleRule={onToggleRule}
              onAddRule={onAddRule}
              onDeleteRule={onDeleteRule}
            />
          )}

          {activeMainTab === 'security' && (
            <AdminSecurityTab
              adminLogs={adminLogs}
              onClearLogs={onClearLogs}
              wordFilter={wordFilter}
              onUpdateWordFilter={onUpdateWordFilter}
              allMedia={allMedia}
              onDeleteMediaItem={onDeleteMediaItem}
            />
          )}

          {activeMainTab === 'analytics' && (
            <AdminAnalyticsTab
              topics={topics}
              users={users}
              categories={categories}
              themeSettings={themeSettings}
              onUpdateThemeSettings={onUpdateThemeSettings}
            />
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span>מערכת פורומים NodeBB IVR</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">שרת פעיל (0 שגיאות)</span>
            <span>•</span>
            <span>סנכרון נתונים מקומי אוטומטי (LocalStorage)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 cursor-pointer"
          >
            סגור לוח ניהול
          </button>
        </div>

      </div>
    </div>
  );
};
