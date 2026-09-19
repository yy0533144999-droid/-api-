export interface MediaAttachment {
  id: string;
  type: 'audio' | 'video' | 'image';
  url: string;
  name: string;
  size?: string;
  duration?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  name: string;
  avatar: string;
  role: string;
  roleBadgeColor: string;
  reputation: number;
  postCount: number;
  joinDate: string;
  isOnline: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  banReason?: string;
}

export interface ForumTopic {
  id: string;
  forumId: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    reputation?: number;
  };
  repliesCount: number;
  viewsCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  tags: string[];
  lastReply: {
    userName: string;
    userAvatar: string;
    timestamp: string;
  };
  createdAt: string;
  snippet: string;
  attachments?: MediaAttachment[];
  likes?: number;
  dislikes?: number;
  reactions?: { [username: string]: 'like' | 'dislike' };
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  text: string;
  timeAgo: string;
  likes: number;
  dislikes?: number;
  reactions?: { [username: string]: 'like' | 'dislike' };
  attachments?: MediaAttachment[];
}

export interface ForumSubCategory {
  id: string;
  title: string;
  description: string;
  hasUnread: boolean;
  topicsCount: number;
  postsCount: number;
  tags: string[];
  lastPost?: {
    topicTitle: string;
    userName: string;
    userAvatar: string;
    userRole: string;
    timeAgo: string;
  };
}

export interface ForumCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  subCategories: ForumSubCategory[];
}

export interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  role: string;
  roleColor: string;
  action: string;
  reputation?: number;
  email?: string;
  emailVerified?: boolean;
  isAdmin?: boolean;
  isBanned?: boolean;
  banReason?: string;
  bannedAt?: string;
  isMuted?: boolean;
  warningsCount?: number;
}

export interface AdminLog {
  id: string;
  adminName: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
  type: 'ban' | 'unban' | 'delete_user' | 'reputation_down' | 'reputation_up' | 'lock_topic' | 'delete_topic' | 'pin_topic' | 'role_change' | 'announcement' | 'category_create' | 'category_update' | 'category_delete' | 'restore_topic' | 'merge_topics' | 'warning' | 'mute' | 'webhook' | 'automation';
}

export interface TrashItem {
  id: string;
  topic: ForumTopic;
  deletedAt: string;
  deletedBy: string;
  reason?: string;
}

export interface UserWarning {
  id: string;
  userId: string;
  userName: string;
  level: number;
  reason: string;
  issuedAt: string;
  issuedBy: string;
}

export interface BannedEntity {
  id: string;
  type: 'ip' | 'email' | 'username';
  value: string;
  reason: string;
  bannedAt: string;
}

export interface AutomationRule {
  id: string;
  title: string;
  description: string;
  trigger: 'post_count' | 'reputation_reach' | 'warning_count';
  conditionValue: number;
  action: 'promote_role' | 'grant_badge' | 'auto_temp_ban';
  targetRoleOrBadge?: string;
  isActive: boolean;
}

export interface WebhookConfig {
  id: string;
  name: string;
  targetPlatform: 'telegram' | 'discord' | 'custom';
  url: string;
  events: ('new_topic' | 'new_reply' | 'user_register')[];
  isActive: boolean;
  lastTriggered?: string;
}

export interface WordFilterConfig {
  blockedWords: string[];
  action: 'mask' | 'block';
  captchaEnabled: boolean;
}

export interface RolePermission {
  roleName: string;
  badgeColor: string;
  canView: boolean;
  canPostTopic: boolean;
  canReply: boolean;
  canUploadMedia: boolean;
  canModerate: boolean;
  canAccessAdmin: boolean;
}

export interface ThemeSettings {
  forumName: string;
  forumSubtitle: string;
  primaryColor: 'blue' | 'navy' | 'emerald' | 'rose' | 'amber';
  darkMode: boolean;
  welcomeTemplate: string;
}
