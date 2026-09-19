import { 
  AutomationRule, 
  BannedEntity, 
  RolePermission, 
  ThemeSettings, 
  WebhookConfig, 
  WordFilterConfig 
} from '../types';

export const defaultPermissions: RolePermission[] = [
  {
    roleName: 'אורח',
    badgeColor: 'bg-slate-200 text-slate-700',
    canView: true,
    canPostTopic: false,
    canReply: false,
    canUploadMedia: false,
    canModerate: false,
    canAccessAdmin: false,
  },
  {
    roleName: 'משתמש רשום',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    canView: true,
    canPostTopic: true,
    canReply: true,
    canUploadMedia: true,
    canModerate: false,
    canAccessAdmin: false,
  },
  {
    roleName: 'תומך טופ',
    badgeColor: 'bg-blue-800 text-blue-100 border-blue-600',
    canView: true,
    canPostTopic: true,
    canReply: true,
    canUploadMedia: true,
    canModerate: false,
    canAccessAdmin: false,
  },
  {
    roleName: 'מנהל תוכן (מודרטור)',
    badgeColor: 'bg-emerald-800 text-emerald-100 border-emerald-600',
    canView: true,
    canPostTopic: true,
    canReply: true,
    canUploadMedia: true,
    canModerate: true,
    canAccessAdmin: false,
  },
  {
    roleName: 'מנהל מערכת ראשי',
    badgeColor: 'bg-rose-900 text-rose-100 border-rose-600',
    canView: true,
    canPostTopic: true,
    canReply: true,
    canUploadMedia: true,
    canModerate: true,
    canAccessAdmin: true,
  },
];

export const defaultAutomationRules: AutomationRule[] = [
  {
    id: 'rule-1',
    title: 'קידום אוטומטי למשתמש פעיל',
    description: 'משתמש שהגיע ל-10 הודעות ותגובות מקודם אוטומטית לדרגת משתמש פעיל',
    trigger: 'post_count',
    conditionValue: 10,
    action: 'promote_role',
    targetRoleOrBadge: 'חבר קהילה פעיל',
    isActive: true,
  },
  {
    id: 'rule-2',
    title: 'הענקת תג "תומך טופ"',
    description: 'משתמש שצבר מעל 500 נקודות מוניטין זכאי לתג תומך טופ',
    trigger: 'reputation_reach',
    conditionValue: 500,
    action: 'grant_badge',
    targetRoleOrBadge: 'תומך טופ מוסמך',
    isActive: true,
  },
  {
    id: 'rule-3',
    title: 'חסימה זמנית על הצטברות 3 אזהרות',
    description: 'משתמש שקיבל 3 אזהרות מושעה אוטומטית ל-7 ימים',
    trigger: 'warning_count',
    conditionValue: 3,
    action: 'auto_temp_ban',
    isActive: true,
  },
];

export const defaultWebhooks: WebhookConfig[] = [
  {
    id: 'wh-1',
    name: 'בוט טלגרם - ערוץ התראות נושאים חדשים',
    targetPlatform: 'telegram',
    url: 'https://api.telegram.org/bot123456:ABC-DEF/sendMessage?chat_id=@yemot_updates',
    events: ['new_topic'],
    isActive: true,
    lastTriggered: 'היום ב-09:42',
  },
  {
    id: 'wh-2',
    name: 'שרת דיסקורד - חדר מפתחים ו-Webhooks',
    targetPlatform: 'discord',
    url: 'https://discord.com/api/webhooks/9988776655/tokenXYZ123',
    events: ['new_topic', 'new_reply'],
    isActive: false,
    lastTriggered: 'לפני יומיים',
  },
];

export const defaultWordFilter: WordFilterConfig = {
  blockedWords: ['ספאם', 'הונאה', 'קזינו', 'hack', 'warez', 'קראק'],
  action: 'mask',
  captchaEnabled: true,
};

export const defaultBannedEntities: BannedEntity[] = [
  {
    id: 'ban-ip-1',
    type: 'ip',
    value: '185.220.101.5',
    reason: 'רשת בוטים וסריקת פורטים זדונית',
    bannedAt: '01/09/2026',
  },
  {
    id: 'ban-mail-1',
    type: 'email',
    value: '*@temp-mail.org',
    reason: 'דומיין אימיילים זמניים אסור ברישום',
    bannedAt: '25/08/2026',
  },
];

export const defaultThemeSettings: ThemeSettings = {
  forumName: 'פורום דיונים - מערכות טלפוניה ו-IVR',
  forumSubtitle: 'ממשק פורום דיוני אונליין מודרני בהשראת NodeBB, תומכים טופ וימות המשיח',
  primaryColor: 'navy',
  darkMode: false,
  welcomeTemplate: 'ברוכים הבאים לפורום ימות המשיח ותומכים טופ! אנא שמרו על שפה נאותה ושתפו קוד בצורה קריאה.',
};
