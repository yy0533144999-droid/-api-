import React, { useState, useEffect, useMemo } from 'react';
import { 
  initialUser, 
  initialCategories, 
  sampleTopics, 
  onlineUsersList, 
  popularTags, 
  forumStats, 
  shmuelAdminUser, 
  initialAdminLogs 
} from './data/forumData';
import { 
  AdminLog, 
  ForumCategory, 
  ForumSubCategory, 
  ForumTopic, 
  OnlineUser, 
  UserProfile, 
  ForumReply, 
  MediaAttachment,
  TrashItem,
  UserWarning,
  BannedEntity,
  AutomationRule,
  WebhookConfig,
  WordFilterConfig,
  RolePermission,
  ThemeSettings,
} from './types';
import {
  defaultPermissions,
  defaultAutomationRules,
  defaultWebhooks,
  defaultWordFilter,
  defaultBannedEntities,
  defaultThemeSettings,
} from './data/adminDefaults';
import { Header } from './components/Header';
import { Breadcrumbs } from './components/Breadcrumbs';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { CategoriesList } from './components/CategoriesList';
import { ForumTopicsView } from './components/ForumTopicsView';
import { Sidebar } from './components/Sidebar';
import { NewTopicModal } from './components/NewTopicModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AuthModal, RegisterData } from './components/AuthModal';
import { Footer } from './components/Footer';
import { 
  Users, 
  Tag, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  Search, 
  MessageSquare, 
  UserX, 
  TrendingDown, 
  Lock, 
  CheckCircle2,
  Trash2
} from 'lucide-react';

const defaultRepliesMap: { [topicId: string]: ForumReply[] } = {
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
      reactions: {},
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
      reactions: {},
    },
  ],
  'topic-ivr-media': [
    {
      id: 'r-media-1',
      authorName: 'משה_התקנות',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      authorRole: 'מתקין מוסמך',
      text: 'תודה על הסרטון וההדגמה! איכות השמע בקובץ ה-WAV המצורף צלולה מאוד במערכת.',
      timeAgo: 'לפני שעה',
      likes: 5,
      dislikes: 0,
      reactions: {},
    }
  ]
};

export default function App() {
  // Real persistent data loaded from localStorage with initial defaults (Guest null by default)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && (parsed.username || parsed.name)) {
          // If previously saved user was old default or 0533144999, clean it out
          if (
            parsed.email?.toLowerCase().includes('0533144999') ||
            parsed.username?.toLowerCase().includes('0533144999') ||
            parsed.name?.toLowerCase().includes('0533144999')
          ) {
            localStorage.removeItem('yemot_forum_current_user');
            return null;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading currentUser from localStorage', e);
    }
    return null; // Guest by default! Visitors must register or login
  });

  const [categories, setCategories] = useState<ForumCategory[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_categories');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading categories from localStorage', e);
    }
    return initialCategories;
  });

  const [topics, setTopics] = useState<ForumTopic[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t): t is ForumTopic => Boolean(t && typeof t === 'object' && t.id && t.title));
        }
      }
    } catch (e) {
      console.warn('Error reading topics from localStorage', e);
    }
    return sampleTopics;
  });

  const [users, setUsers] = useState<OnlineUser[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((u): u is OnlineUser => Boolean(u && typeof u === 'object' && (u.name || (u as any).username)));
        }
      }
    } catch (e) {
      console.warn('Error reading users from localStorage', e);
    }
    return onlineUsersList;
  });

  const [repliesList, setRepliesList] = useState<{ [topicId: string]: ForumReply[] }>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_replies');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading replies from localStorage', e);
    }
    return defaultRepliesMap;
  });

  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_admin_logs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading adminLogs from localStorage', e);
    }
    return initialAdminLogs;
  });

  // Additional Admin States with LocalStorage Persistence
  const [trashItems, setTrashItems] = useState<TrashItem[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_trash');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading trashItems from localStorage', e);
    }
    return [];
  });

  const [tags, setTags] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_tags');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading tags from localStorage', e);
    }
    return popularTags;
  });

  const [warnings, setWarnings] = useState<UserWarning[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_warnings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading warnings from localStorage', e);
    }
    return [];
  });

  const [permissions, setPermissions] = useState<RolePermission[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_permissions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading permissions from localStorage', e);
    }
    return defaultPermissions;
  });

  const [bannedEntities, setBannedEntities] = useState<BannedEntity[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_banned');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading bannedEntities from localStorage', e);
    }
    return defaultBannedEntities;
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_automation');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading automationRules from localStorage', e);
    }
    return defaultAutomationRules;
  });

  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_webhooks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading webhooks from localStorage', e);
    }
    return defaultWebhooks;
  });

  const [wordFilter, setWordFilter] = useState<WordFilterConfig>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_wordfilter');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading wordFilter from localStorage', e);
    }
    return defaultWordFilter;
  });

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('yemot_forum_theme');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading themeSettings from localStorage', e);
    }
    return defaultThemeSettings;
  });

  // State for deleting user directly from Users Directory view
  const [userToDeleteInDirectory, setUserToDeleteInDirectory] = useState<OnlineUser | null>(null);
  const [purgeTopicsInDirectory, setPurgeTopicsInDirectory] = useState(false);

  // Calculate all uploaded media across all topics and replies
  const allMedia = useMemo<MediaAttachment[]>(() => {
    const mediaMap = new Map<string, MediaAttachment>();
    topics.forEach((t) => {
      t.attachments?.forEach((a) => {
        if (!mediaMap.has(a.id)) mediaMap.set(a.id, a);
      });
    });
    (Object.values(repliesList) as ForumReply[][]).forEach((replies) => {
      replies.forEach((r) => {
        r.attachments?.forEach((a) => {
          if (!mediaMap.has(a.id)) mediaMap.set(a.id, a);
        });
      });
    });
    return Array.from(mediaMap.values());
  }, [topics, repliesList]);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_categories', JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed saving categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_trash', JSON.stringify(trashItems));
    } catch (e) {
      console.warn('Failed saving trashItems to localStorage', e);
    }
  }, [trashItems]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_tags', JSON.stringify(tags));
    } catch (e) {
      console.warn('Failed saving tags to localStorage', e);
    }
  }, [tags]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_warnings', JSON.stringify(warnings));
    } catch (e) {
      console.warn('Failed saving warnings to localStorage', e);
    }
  }, [warnings]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_permissions', JSON.stringify(permissions));
    } catch (e) {
      console.warn('Failed saving permissions to localStorage', e);
    }
  }, [permissions]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_banned', JSON.stringify(bannedEntities));
    } catch (e) {
      console.warn('Failed saving bannedEntities to localStorage', e);
    }
  }, [bannedEntities]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_automation', JSON.stringify(automationRules));
    } catch (e) {
      console.warn('Failed saving automationRules to localStorage', e);
    }
  }, [automationRules]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_webhooks', JSON.stringify(webhooks));
    } catch (e) {
      console.warn('Failed saving webhooks to localStorage', e);
    }
  }, [webhooks]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_wordfilter', JSON.stringify(wordFilter));
    } catch (e) {
      console.warn('Failed saving wordFilter to localStorage', e);
    }
  }, [wordFilter]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_theme', JSON.stringify(themeSettings));
    } catch (e) {
      console.warn('Failed saving themeSettings to localStorage', e);
    }
    if (themeSettings.forumName) {
      document.title = themeSettings.forumName;
    }
  }, [themeSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_admin_logs', JSON.stringify(adminLogs));
    } catch (e) {
      console.warn('Failed saving adminLogs to localStorage', e);
    }
  }, [adminLogs]);
  
  // Navigation & View state
  const [activeNav, setActiveNav] = useState<string>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | null>(initialCategories[0]);
  const [selectedForum, setSelectedForum] = useState<ForumSubCategory | null>(null);
  
  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterUnreadOnly, setFilterUnreadOnly] = useState<boolean>(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Modals
  const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('register');
  const [authModalDetails, setAuthModalDetails] = useState<{ title?: string; subtitle?: string }>({});

  const handleOpenRegisterModal = (title?: string, subtitle?: string) => {
    setAuthModalMode('register');
    setAuthModalDetails({ title, subtitle });
    setIsAuthModalOpen(true);
  };

  const handleOpenLoginModal = (title?: string, subtitle?: string) => {
    setAuthModalMode('login');
    setAuthModalDetails({ title, subtitle });
    setIsAuthModalOpen(true);
  };

  const handleOpenNewTopicModal = () => {
    if (!currentUser) {
      handleOpenRegisterModal(
        'הרשמה לפתיחת נושא חדש',
        'כדי לפרסם נושא חדש בפורום, יש להירשם לחשבון בחינם או להתחבר לחשבונך.'
      );
      return;
    }
    setIsNewTopicModalOpen(true);
  };

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    text: string;
    type: 'success' | 'danger' | 'info';
  } | null>(null);

  // System Announcement
  const [announcement, setAnnouncement] = useState<{
    text: string;
    type: 'urgent' | 'info';
    active: boolean;
  }>({
    text: 'ברוכים הבאים לפורום המפתחים וה-IVR של ימות המשיח ותומכים טופ! הפורום מרכז תמיכה טכנית, שיתוף קוד, סקריפטים ופתרונות ניתוב מתקדמים.',
    type: 'info',
    active: true,
  });

  // Sync to localStorage for true persistence
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('yemot_forum_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('yemot_forum_current_user');
      }
    } catch (e) {
      console.warn('Failed saving currentUser to localStorage', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_topics', JSON.stringify(topics));
    } catch (e) {
      console.warn('Failed saving topics to localStorage', e);
    }
  }, [topics]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed saving users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('yemot_forum_replies', JSON.stringify(repliesList));
    } catch (e) {
      console.warn('Failed saving replies to localStorage', e);
    }
  }, [repliesList]);

  const showToast = (title: string, text: string, type: 'success' | 'danger' | 'info' = 'success') => {
    setToastMessage({ title, text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Login with Username (No email required! Any username is valid)
  const handleLogin = (usernameInput: string, pass: string) => {
    const rawUser = (usernameInput || '').trim();
    if (!rawUser) return;
    const cleanUser = rawUser.split('@')[0]; // in case someone still typed @

    if (
      cleanUser.toLowerCase() === 'yy0533144999' ||
      cleanUser.toLowerCase() === 'yy0533144999@gmail.com' ||
      rawUser.toLowerCase() === 'yy0533144999@gmail.com' ||
      rawUser.includes('0533144999')
    ) {
      setCurrentUser(initialUser);
      setIsAdminPanelOpen(true);
      showToast(
        'התחברת בהצלחה!',
        'שלום yy0533144999@gmail.com! התחברת בהצלחה עם הרשאות מנהל ראשי מלאות.',
        'success'
      );
      return;
    }

    if (
      (cleanUser.toLowerCase() === 'שמואל' || 
       cleanUser.toLowerCase() === 'shmuel' || 
       cleanUser.includes('שמואל') || 
       cleanUser.includes('shmuel')) &&
      pass.trim() === '123456'
    ) {
      setCurrentUser(shmuelAdminUser);
      setIsAdminPanelOpen(true);
      showToast(
        'התחברת בהצלחה כמנהל ראשי!',
        'שלום שמואל! כל הרשאות הניהול, ההרחקה והורדת מוניטין זמינות כעת.',
        'success'
      );
      return;
    }

    // Check if user already exists in users list
    const existing = users.find((u) => (u?.name || '').toLowerCase() === cleanUser.toLowerCase());
    const initialRep = existing ? (existing.reputation ?? 25) : 25;
    const initialRole = existing ? existing.role : 'חבר קהילה פעיל';
    const isExistingAdmin = Boolean(existing && (existing.role?.includes('מנהל') || (existing as any).isAdmin));
    const initialAvatar = existing ? existing.avatar : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUser)}`;

    const userLoggedIn: UserProfile = {
      id: `user-${cleanUser}`,
      username: cleanUser,
      name: cleanUser,
      avatar: initialAvatar,
      role: initialRole,
      roleBadgeColor: isExistingAdmin ? 'bg-rose-600 text-white border-rose-400' : 'bg-blue-600 text-white border-blue-400',
      reputation: initialRep,
      postCount: 1,
      joinDate: 'היום',
      isOnline: true,
      isAdmin: isExistingAdmin,
    };

    setCurrentUser(userLoggedIn);

    // Ensure user is present in users directory
    setUsers((prev) => {
      if (prev.some((u) => (u?.name || '').toLowerCase() === cleanUser.toLowerCase())) {
        return prev;
      }
      return [
        {
          id: `u-${Date.now()}`,
          name: cleanUser,
          avatar: initialAvatar,
          role: initialRole,
          reputation: initialRep,
          status: 'online',
          unreadNotifications: 0,
        },
        ...prev,
      ];
    });

    showToast('התחברת בהצלחה עם שם', `ברוך הבא לפורום ימות המשיח, ${cleanUser}!`, 'info');
  };

  const handleRegister = (data: RegisterData) => {
    const cleanUser = data.username.trim();
    if (!cleanUser) return;

    // Check if user already exists
    const existing = users.find((u) => (u?.name || '').toLowerCase() === cleanUser.toLowerCase());
    if (existing) {
      showToast('שם משתמש תפוס', 'שם המשתמש כבר קיים במערכת, אנא בחר שם אחר או התחבר.', 'danger');
      return;
    }

    const newUserProfile: UserProfile = {
      id: `user-${Date.now()}`,
      username: cleanUser,
      name: data.name || cleanUser,
      email: data.email,
      avatar: data.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUser)}`,
      role: 'חבר קהילה חדש',
      roleBadgeColor: 'bg-emerald-600 text-white border-emerald-400',
      reputation: 10,
      postCount: 0,
      joinDate: 'היום',
      isOnline: true,
      isAdmin: false,
    };

    setCurrentUser(newUserProfile);

    // Add to users list
    setUsers((prev) => [
      {
        id: newUserProfile.id,
        name: newUserProfile.name,
        avatar: newUserProfile.avatar,
        role: newUserProfile.role,
        roleColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        reputation: newUserProfile.reputation,
        status: 'online',
        unreadNotifications: 0,
        isBanned: false,
        email: data.email,
        action: 'נרשם כעת לפורום',
      },
      ...prev,
    ]);

    setIsAuthModalOpen(false);

    showToast(
      'נרשמת בהצלחה לפורום!',
      `ברוך הבא ${newUserProfile.name}! החשבון נוצר בהצלחה וכעת תוכל לפרסם ולהגיב.`,
      'success'
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminPanelOpen(false);
    try {
      localStorage.removeItem('yemot_forum_current_user');
    } catch (e) {}
    showToast('התנתקת מהמערכת', 'יצאת מחשבונך בהצלחה. הינך גולש כעת כאורח.', 'info');
  };

  // Real Save Profile (Avatar, display name)
  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const oldName = currentUser?.username || currentUser?.name || '';
    const newName = updated.name || updated.username || oldName;
    const newAvatar = updated.avatar || currentUser?.avatar || '';

    const updatedUser: UserProfile = {
      ...currentUser,
      ...updated,
      username: newName,
      name: newName,
      avatar: newAvatar,
    };
    setCurrentUser(updatedUser);

    // Update in users list
    setUsers((prev) =>
      prev.map((u) => {
        if (u?.name === oldName || u?.id === currentUser.id) {
          return {
            ...u,
            name: newName,
            avatar: newAvatar,
          };
        }
        return u;
      })
    );

    // Update in topics authored by this user
    setTopics((prev) =>
      prev.map((t) => {
        if (t.author?.name === oldName) {
          return {
            ...t,
            author: {
              ...t.author,
              name: newName,
              avatar: newAvatar,
            },
          };
        }
        return t;
      })
    );

    // Update in replies
    setRepliesList((prev) => {
      const copy = { ...prev };
      for (const topicId in copy) {
        copy[topicId] = copy[topicId].map((r) =>
          r.authorName === oldName
            ? { ...r, authorName: newName, authorAvatar: newAvatar }
            : r
        );
      }
      return copy;
    });

    showToast('הפרופיל עודכן בהצלחה', 'תמונת הפרופיל והפרטים החדשים נשמרו ומעודכנים בפורום.', 'success');
  };

  // Real Voting on Topic (+1 Like = +1 Reputation, -1 Dislike = -1 Reputation)
  const handleVoteTopic = (topicId: string, type: 'like' | 'dislike') => {
    if (!currentUser) {
      showToast('נדרשת התחברות', 'עליך להתחבר עם שם כדי לדרג נושאים ולהעניק מוניטין.', 'danger');
      return;
    }

    const voterKey = currentUser?.username || currentUser?.name || 'anonymous';
    const targetTopic = topics.find((t) => t.id === topicId);
    if (!targetTopic) return;

    const currentVote = targetTopic.reactions?.[voterKey];
    let repDelta = 0;
    let newLikes = targetTopic.likes || 0;
    let newDislikes = targetTopic.dislikes || 0;
    const newReactions = { ...(targetTopic.reactions || {}) };

    if (currentVote === type) {
      // Cancel vote
      delete newReactions[voterKey];
      if (type === 'like') {
        newLikes = Math.max(0, newLikes - 1);
        repDelta = -1;
      } else {
        newDislikes = Math.max(0, newDislikes - 1);
        repDelta = +1;
      }
    } else if (currentVote) {
      // Change vote from like to dislike or vice versa
      newReactions[voterKey] = type;
      if (type === 'like') {
        newLikes += 1;
        newDislikes = Math.max(0, newDislikes - 1);
        repDelta = +2;
      } else {
        newDislikes += 1;
        newLikes = Math.max(0, newLikes - 1);
        repDelta = -2;
      }
    } else {
      // New vote
      newReactions[voterKey] = type;
      if (type === 'like') {
        newLikes += 1;
        repDelta = +1;
      } else {
        newDislikes += 1;
        repDelta = -1;
      }
    }

    // Update topics state
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId
          ? { ...t, likes: newLikes, dislikes: newDislikes, reactions: newReactions }
          : t
      )
    );

    // Update author's real reputation
    const authorName = targetTopic.author?.name || '';
    if (authorName) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u?.name === authorName) {
            return {
              ...u,
              reputation: Math.max(0, (u.reputation || 0) + repDelta),
            };
          }
          return u;
        })
      );

      // If author is currently logged-in user
      if (currentUser && (currentUser.username === authorName || currentUser.name === authorName)) {
        setCurrentUser((prev) =>
          prev ? { ...prev, reputation: Math.max(0, prev.reputation + repDelta) } : null
        );
      }

      // Update topic author reputation badge
      setTopics((prev) =>
        prev.map((t) => {
          if (t.author?.name === authorName) {
            return {
              ...t,
              author: {
                ...t.author,
                reputation: Math.max(0, (t.author.reputation || 0) + repDelta),
              },
            };
          }
          return t;
        })
      );
    }

    if (repDelta > 0) {
      showToast('אהבתי (+1 מוניטין)', `הענקת +${repDelta} מוניטין לכותב הנושא: ${authorName}!`, 'success');
    } else if (repDelta < 0) {
      showToast('לא אהבתי (-1 מוניטין)', `הורדת ${Math.abs(repDelta)} מוניטין מכותב הנושא: ${authorName}.`, 'danger');
    } else {
      showToast('הצבעה בוטלה', 'הסרת את הדירוג שלך והמוניטין חזר לקדמותו.', 'info');
    }
  };

  // Real Voting on Reply (+1 Like = +1 Reputation, -1 Dislike = -1 Reputation)
  const handleVoteReply = (topicId: string, replyId: string, type: 'like' | 'dislike') => {
    if (!currentUser) {
      showToast('נדרשת התחברות', 'עליך להתחבר עם שם כדי לדרג תגובות ולהעניק מוניטין.', 'danger');
      return;
    }

    const voterKey = currentUser?.username || currentUser?.name || 'anonymous';
    const currentReplies = repliesList[topicId] || [];
    const targetReply = currentReplies.find((r) => r.id === replyId);
    if (!targetReply) return;

    const currentVote = targetReply.reactions?.[voterKey];
    let repDelta = 0;
    let newLikes = targetReply.likes || 0;
    let newDislikes = targetReply.dislikes || 0;
    const newReactions = { ...(targetReply.reactions || {}) };

    if (currentVote === type) {
      delete newReactions[voterKey];
      if (type === 'like') {
        newLikes = Math.max(0, newLikes - 1);
        repDelta = -1;
      } else {
        newDislikes = Math.max(0, newDislikes - 1);
        repDelta = +1;
      }
    } else if (currentVote) {
      newReactions[voterKey] = type;
      if (type === 'like') {
        newLikes += 1;
        newDislikes = Math.max(0, newDislikes - 1);
        repDelta = +2;
      } else {
        newDislikes += 1;
        newLikes = Math.max(0, newLikes - 1);
        repDelta = -2;
      }
    } else {
      newReactions[voterKey] = type;
      if (type === 'like') {
        newLikes += 1;
        repDelta = +1;
      } else {
        newDislikes += 1;
        repDelta = -1;
      }
    }

    // Update replies state
    setRepliesList((prev) => ({
      ...prev,
      [topicId]: (prev[topicId] || []).map((r) =>
        r.id === replyId
          ? { ...r, likes: newLikes, dislikes: newDislikes, reactions: newReactions }
          : r
      ),
    }));

    // Update author's reputation
    const authorName = targetReply.authorName;
    if (authorName) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u?.name === authorName) {
            return {
              ...u,
              reputation: Math.max(0, (u.reputation || 0) + repDelta),
            };
          }
          return u;
        })
      );

      if (currentUser && (currentUser.username === authorName || currentUser.name === authorName)) {
        setCurrentUser((prev) =>
          prev ? { ...prev, reputation: Math.max(0, prev.reputation + repDelta) } : null
        );
      }
    }

    if (repDelta > 0) {
      showToast('אהבת תגובה (+1 מוניטין)', `הענקת +${repDelta} מוניטין ל-${authorName}!`, 'success');
    } else if (repDelta < 0) {
      showToast('לא אהבת תגובה (-1 מוניטין)', `הורדת ${Math.abs(repDelta)} מוניטין מ-${authorName}.`, 'danger');
    } else {
      showToast('הצבעה בוטלה', 'הסרת את הדירוג שלך.', 'info');
    }
  };

  // Admin Action: Ban User
  const handleBanUser = (userId: string, duration: string, reason: string) => {
    const target = users.find((u) => u.id === userId);
    const targetName = target ? target.name : 'משתמש';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isBanned: true,
            banReason: `${reason} (${duration})`,
            bannedAt: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return u;
      })
    );

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: `הרחקת משתמש (${duration})`,
      target: targetName,
      details: reason,
      timestamp: 'עכשיו',
      type: 'ban',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      'משתמש הורחק מהפורום בהצלחה',
      `המשתמש ${targetName} הורחק לתקופה של ${duration}. סיבה: ${reason}`,
      'danger'
    );
  };

  // Admin Action: Unban User
  const handleUnbanUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    const targetName = target ? target.name : 'משתמש';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isBanned: false,
            banReason: undefined,
            bannedAt: undefined,
          };
        }
        return u;
      })
    );

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'ביטול הרחקה מהפורום',
      target: targetName,
      details: 'הוחזרו הרשאות כתיבה מלאות',
      timestamp: 'עכשיו',
      type: 'unban',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast('הרחקה בוטלה', `ההרחקה של ${targetName} בוטלה בהצלחה.`, 'success');
  };

  // Admin Action: Delete & Ban User Permanently
  const handleDeleteAndBanUser = (userId: string, reason: string, purgeTopics: boolean = true) => {
    const target = users.find((u) => u.id === userId);
    const targetName = target ? target.name : 'משתמש';

    // Remove user permanently from users list
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    // If current logged-in user is this user, log out
    if (currentUser && currentUser.username === targetName) {
      setCurrentUser(null);
    }

    // If purgeTopics is true, delete all their topics
    if (purgeTopics) {
      setTopics((prev) => prev.filter((t) => t.author?.name !== targetName));
    }

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'הרחקה ומחיקת משתמש לצמיתות',
      target: targetName,
      details: `${reason}${purgeTopics ? ' (ונמחקו כל נושאיו)' : ''}`,
      timestamp: 'עכשיו',
      type: 'delete_user',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      'משתמש נמחק והורחק לצמיתות',
      `המשתמש ${targetName} הוסר לחלוטין ממאגר הפורום.`,
      'danger'
    );
  };

  // Admin Action: Change User Role
  const handleChangeUserRole = (userId: string, newRole: string) => {
    const target = users.find((u) => u.id === userId);
    const targetName = target ? target.name : 'משתמש';
    const isNowAdmin = newRole.includes('מנהל');

    let roleColor = 'bg-slate-100 text-slate-700 border-slate-200';
    if (isNowAdmin) {
      roleColor = 'bg-rose-100 text-rose-800 border-rose-300';
    } else if (newRole === 'תומך טופ') {
      roleColor = 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (newRole === 'מפתח בכיר') {
      roleColor = 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (newRole === 'חבר פעיל' || newRole === 'חבר קהילה פעיל') {
      roleColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            role: newRole,
            roleColor,
          };
        }
        return u;
      })
    );

    if (currentUser && (currentUser.name === targetName || currentUser.username === targetName || currentUser.id === userId)) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              role: newRole,
              isAdmin: isNowAdmin,
              roleBadgeColor: isNowAdmin
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-blue-600 text-white border-blue-400',
            }
          : null
      );
    }

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: isNowAdmin ? `הענקת הרשאות מנהל (${newRole})` : `הגדרת משתמש רגיל (${newRole})`,
      target: targetName,
      details: `עודכנו הרשאות ${isNowAdmin ? 'מנהל מערכת מלאות' : 'משתמש רגיל'} וצבע תגית ל-${newRole}`,
      timestamp: 'עכשיו',
      type: 'role_change',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      'הרשאות משתמש עודכנו',
      `ההרשאות של ${targetName} הוגדרו כעת כ-${newRole} (${isNowAdmin ? 'מנהל מערכת' : 'משתמש רגיל'})`,
      'success'
    );
  };

  // Admin Action: Reset User Reputation
  const handleResetReputation = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    const targetName = target ? target.name : 'משתמש';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            reputation: 0,
          };
        }
        return u;
      })
    );

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'איפוס מוניטין ל-0',
      target: targetName,
      details: 'איפוס נקודות מוניטין לבסיס',
      timestamp: 'עכשיו',
      type: 'reputation_down',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast('מוניטין אופס', `נקודות המוניטין של ${targetName} אופסו ל-0`, 'info');
  };

  // Admin Action: Update Site Announcement
  const handleUpdateAnnouncement = (text: string, type: 'urgent' | 'info', active: boolean) => {
    setAnnouncement({ text, type, active });
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: active ? `עדכון הכרזת פורום (${type === 'urgent' ? 'דחופה באדום' : 'מידע בכחול'})` : 'הסרת הכרזת פורום',
      target: 'הכרזה כללית',
      details: text,
      timestamp: 'עכשיו',
      type: 'announcement',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('הכרזת מערכת עודכנה', 'ההכרזה שונתה ומוצגת כעת לכל המשתמשים בראש האתר.', 'success');
  };

  // Admin Action: Reset Demo Data
  const handleResetAllDemoData = () => {
    setUsers(onlineUsersList);
    setTopics(sampleTopics);
    showToast('נתונים שוחזרו', 'כל המשתמשים, הנושאים וההרשאות שוחזרו לברירת המחדל', 'success');
  };

  // Admin Action: Change User Reputation
  const handleChangeReputation = (userId: string, delta: number, reason: string) => {
    const target = users.find((u) => u.id === userId);
    const targetName = target ? target.name : 'משתמש';

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            reputation: (u.reputation || 0) + delta,
          };
        }
        return u;
      })
    );

    const actionText = delta < 0 ? `הורדת מוניטין (${delta})` : `העלאת מוניטין (+${delta})`;
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: actionText,
      target: targetName,
      details: reason,
      timestamp: 'עכשיו',
      type: delta < 0 ? 'reputation_down' : 'reputation_up',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      'מוניטין עודכן בהצלחה',
      `נקודות מוניטין עבור ${targetName} עודכנו ב-${delta > 0 ? `+${delta}` : delta}. נימוק: ${reason}`,
      delta < 0 ? 'danger' : 'success'
    );
  };

  // Admin Action: Change User Reputation by username
  const handleChangeUserReputationByName = (userName: string, delta: number, reason: string) => {
    const target = users.find((u) => u?.name === userName);
    if (target) {
      handleChangeReputation(target.id, delta, reason);
    } else {
      // Still log the change
      const actionText = delta < 0 ? `הורדת מוניטין (${delta})` : `העלאת מוניטין (+${delta})`;
      const newLog: AdminLog = {
        id: `log-${Date.now()}`,
        adminName: currentUser?.username || 'שמואל',
        action: actionText,
        target: userName,
        details: reason,
        timestamp: 'עכשיו',
        type: delta < 0 ? 'reputation_down' : 'reputation_up',
      };
      setAdminLogs((prev) => [newLog, ...prev]);
      showToast(
        'מוניטין כותב עודכן',
        `הופחתו ${Math.abs(delta)} נקודות מוניטין מ-${userName}`,
        'danger'
      );
    }
  };

  // Admin Action: Toggle Lock Topic
  const handleToggleLockTopic = (topicId: string) => {
    let isNowLocked = false;
    let topicTitle = '';

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          isNowLocked = !t.isLocked;
          topicTitle = t.title;
          return {
            ...t,
            isLocked: isNowLocked,
          };
        }
        return t;
      })
    );

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: isNowLocked ? 'נעילת נושא' : 'ביטול נעילת נושא',
      target: topicTitle || topicId,
      details: isNowLocked ? 'נעילת הדיון מתגובות חדשות' : 'פתיחה מחודשת לתגובות',
      timestamp: 'עכשיו',
      type: 'lock_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      isNowLocked ? 'הנושא ננעל בהצלחה' : 'נעילת הנושא בוטלה',
      isNowLocked ? 'משתמשים רגילים לא יוכלו להגיב בדיון זה.' : 'הדיון פתוח שוב לתגובות.',
      'info'
    );
  };

  // Admin Action: Toggle Pin Topic
  const handleTogglePinTopic = (topicId: string) => {
    let isNowPinned = false;
    let topicTitle = '';

    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          isNowPinned = !t.isPinned;
          topicTitle = t.title;
          return {
            ...t,
            isPinned: isNowPinned,
          };
        }
        return t;
      })
    );

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: isNowPinned ? 'נעיצת נושא בראש הפורום' : 'ביטול נעיצת נושא',
      target: topicTitle || topicId,
      details: isNowPinned ? 'מוצג בראש רשימת הנושאים' : 'הוחזר לתצוגה רגילה',
      timestamp: 'עכשיו',
      type: 'pin_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast(
      isNowPinned ? 'הנושא ננעץ בראש' : 'נעיצת הנושא בוטלה',
      topicTitle,
      'info'
    );
  };

  // Admin Action: Delete Topic (Moves to Trash)
  const handleDeleteTopic = (topicId: string, reason: string = 'מחיקה ע"י מנהל') => {
    const targetTopic = topics.find((t) => t.id === topicId);
    if (!targetTopic) return;
    const title = targetTopic.title;

    // Move to Trash
    const newTrash: TrashItem = {
      id: `trash-${Date.now()}`,
      topic: targetTopic,
      deletedAt: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('he-IL'),
      deletedBy: currentUser?.username || 'שמואל',
      reason,
    };
    setTrashItems((prev) => [newTrash, ...prev]);
    setTopics((prev) => prev.filter((t) => t.id !== topicId));

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'העברת נושא לסל המחזור',
      target: title,
      details: reason,
      timestamp: 'עכשיו',
      type: 'delete_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);

    showToast('הנושא הועבר לסל המחזור', `הנושא "${title}" הועבר לסל המחזור וניתן לשחזרו בכל עת.`, 'danger');
  };

  // Trash handlers
  const handleRestoreTopic = (trashId: string) => {
    const item = trashItems.find((i) => i.id === trashId);
    if (!item) return;

    setTopics((prev) => [item.topic, ...prev]);
    setTrashItems((prev) => prev.filter((i) => i.id !== trashId));

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'שחזור נושא מסל המחזור',
      target: item.topic.title,
      timestamp: 'עכשיו',
      type: 'restore_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('הנושא שוחזר בהצלחה', `הנושא "${item.topic.title}" שוחזר לרשימת הדיונים הפעילים.`, 'success');
  };

  const handlePermanentDeleteTopic = (trashId: string) => {
    const item = trashItems.find((i) => i.id === trashId);
    setTrashItems((prev) => prev.filter((i) => i.id !== trashId));

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'מחיקה לצמיתות מסל המחזור',
      target: item?.topic.title || trashId,
      timestamp: 'עכשיו',
      type: 'delete_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('נמחק לצמיתות', 'הפריט נמחק לחלוטין ממאגר הנתונים.', 'danger');
  };

  const handleEmptyTrash = () => {
    const count = trashItems.length;
    setTrashItems([]);
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'ריקון סל המחזור',
      target: `${count} נושאים`,
      timestamp: 'עכשיו',
      type: 'delete_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('סל המחזור רוקן', `${count} פריטים נמחקו לצמיתות.`, 'danger');
  };

  // Category & SubCategory Handlers
  const handleAddCategory = (cat: { title: string; description: string; iconName: string; badge?: string }) => {
    const newCat: ForumCategory = {
      id: `cat-${Date.now()}`,
      title: cat.title,
      description: cat.description,
      iconName: cat.iconName,
      badge: cat.badge,
      subCategories: [],
    };
    setCategories((prev) => [...prev, newCat]);
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'יצירת קטגוריה ראשית חדשה',
      target: cat.title,
      timestamp: 'עכשיו',
      type: 'category_create',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('קטגוריה נוצרה', `הקטגוריה "${cat.title}" נוספה בהצלחה!`, 'success');
  };

  const handleUpdateCategory = (catId: string, updated: Partial<ForumCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, ...updated } : c))
    );
    if (selectedCategory && selectedCategory.id === catId) {
      setSelectedCategory((prev) => (prev ? { ...prev, ...updated } : null));
    }
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'עדכון קטגוריה ראשית',
      target: updated.title || catId,
      timestamp: 'עכשיו',
      type: 'category_update',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('קטגוריה עודכנה', 'פרטי הקטגוריה עודכנו בהצלחה', 'success');
  };

  const handleDeleteCategory = (catId: string) => {
    const target = categories.find((c) => c.id === catId);
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    if (selectedCategory && selectedCategory.id === catId) {
      setSelectedCategory(null);
      setSelectedForum(null);
    }
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'מחיקת קטגוריה ראשית',
      target: target?.title || catId,
      timestamp: 'עכשיו',
      type: 'category_delete',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('קטגוריה נמחקה', `הקטגוריה "${target?.title || catId}" הוסרה בהצלחה`, 'info');
  };

  const handleAddSubCategory = (catId: string, subCat: { title: string; description: string; tags: string[] }) => {
    const newSub: ForumSubCategory = {
      id: `sub-${Date.now()}`,
      title: subCat.title,
      description: subCat.description,
      topicsCount: 0,
      postsCount: 0,
      tags: subCat.tags,
      hasUnread: false,
    };
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, subCategories: [...c.subCategories, newSub] } : c
      )
    );
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'הוספת תת-פורום חדש',
      target: subCat.title,
      timestamp: 'עכשיו',
      type: 'category_create',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('תת-פורום נוסף', `תת-הפורום "${subCat.title}" נוצר בהצלחה`, 'success');
  };

  const handleUpdateSubCategory = (catId: string, subCatId: string, updated: Partial<ForumSubCategory>) => {
    setCategories((prev) =>
      prev.map((c) => {
        const matchesCat = c.id === catId || c.subCategories.some((s) => s.id === subCatId);
        if (!matchesCat) return c;
        return {
          ...c,
          subCategories: c.subCategories.map((s) =>
            s.id === subCatId ? { ...s, ...updated } : s
          ),
        };
      })
    );
    if (selectedForum && selectedForum.id === subCatId) {
      setSelectedForum((prev) => (prev ? { ...prev, ...updated } : null));
    }
    if (selectedCategory) {
      setSelectedCategory((prev) => {
        if (!prev) return null;
        const matchesCat = prev.id === catId || prev.subCategories.some((s) => s.id === subCatId);
        if (!matchesCat) return prev;
        return {
          ...prev,
          subCategories: prev.subCategories.map((s) =>
            s.id === subCatId ? { ...s, ...updated } : s
          ),
        };
      });
    }
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'עדכון תת-פורום',
      target: updated.title || subCatId,
      timestamp: 'עכשיו',
      type: 'category_update',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('תת-פורום עודכן', 'פרטי תת-הפורום עודכנו בהצלחה', 'success');
  };

  const handleDeleteSubCategory = (catId: string, subCatId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        const matchesCat = c.id === catId || c.subCategories.some((s) => s.id === subCatId);
        if (!matchesCat) return c;
        return {
          ...c,
          subCategories: c.subCategories.filter((s) => s.id !== subCatId),
        };
      })
    );
    if (selectedForum && selectedForum.id === subCatId) {
      setSelectedForum(null);
    }
    if (selectedCategory) {
      setSelectedCategory((prev) => {
        if (!prev) return null;
        const matchesCat = prev.id === catId || prev.subCategories.some((s) => s.id === subCatId);
        if (!matchesCat) return prev;
        return {
          ...prev,
          subCategories: prev.subCategories.filter((s) => s.id !== subCatId),
        };
      });
    }
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'מחיקת תת-פורום',
      target: subCatId,
      timestamp: 'עכשיו',
      type: 'category_delete',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('תת-פורום נמחק', 'תת-הפורום הוסר בהצלחה', 'info');
  };

  const handleReorderCategories = (newCategories: ForumCategory[]) => {
    setCategories(newCategories);
    showToast('סדר עודכן', 'סדר תצוגת הקטגוריות עודכן בהצלחה', 'info');
  };

  // Move & Merge Topics
  const handleMoveTopic = (topicId: string, targetSubCategoryId: string) => {
    const targetTopic = topics.find((t) => t.id === topicId);
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, forumId: targetSubCategoryId } : t))
    );
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'העברת שרשור לפורום אחר',
      target: targetTopic?.title || topicId,
      details: `הועבר לתת-פורום: ${targetSubCategoryId}`,
      timestamp: 'עכשיו',
      type: 'lock_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('השרשור הועבר', `הנושא הועבר בהצלחה לתת-הפורום "${targetSubCategoryId}"`, 'success');
  };

  const handleMergeTopics = (sourceTopicId: string, targetTopicId: string) => {
    const sourceTopic = topics.find((t) => t.id === sourceTopicId);
    const targetTopic = topics.find((t) => t.id === targetTopicId);
    if (!sourceTopic || !targetTopic) return;

    const sourceReplies = repliesList[sourceTopicId] || [];
    const targetReplies = repliesList[targetTopicId] || [];
    const mergedReplies = [...targetReplies, ...sourceReplies];

    setRepliesList((prev) => {
      const copy = { ...prev };
      copy[targetTopicId] = mergedReplies;
      delete copy[sourceTopicId];
      return copy;
    });

    setTopics((prev) =>
      prev
        .filter((t) => t.id !== sourceTopicId)
        .map((t) => (t.id === targetTopicId ? { ...t, repliesCount: mergedReplies.length } : t))
    );

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'מיזוג דיונים כפולים',
      target: `${sourceTopic.title} ➔ ${targetTopic.title}`,
      details: `מוזגו ${sourceReplies.length} תגובות לשרשור היעד`,
      timestamp: 'עכשיו',
      type: 'merge_topics',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('הדיונים מוזגו', `הנושא "${sourceTopic.title}" מוזג לתוך "${targetTopic.title}" בהצלחה.`, 'success');
  };

  const handleCreateSystemTopic = (title: string, content: string, forumId: string, topicTags: string[]) => {
    const newSystemTopic: ForumTopic = {
      id: `topic-sys-${Date.now()}`,
      forumId,
      title,
      author: {
        name: 'שמואל_מנהל',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        role: 'מנהל ראשי & מפקח קהילה',
        reputation: 5000,
      },
      repliesCount: 0,
      viewsCount: 1,
      likes: 5,
      dislikes: 0,
      isPinned: true,
      tags: topicTags,
      lastReply: {
        userName: 'שמואל_מנהל',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        timestamp: 'עכשיו',
      },
      createdAt: 'עכשיו',
      snippet: content.slice(0, 140) + '...',
    };

    setTopics((prev) => [newSystemTopic, ...prev]);

    setRepliesList((prev) => ({
      ...prev,
      [newSystemTopic.id]: [
        {
          id: `r-sys-${Date.now()}`,
          authorName: 'שמואל_מנהל',
          authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
          authorRole: 'מנהל ראשי & מפקח קהילה',
          text: content,
          timeAgo: 'עכשיו',
          likes: 5,
          dislikes: 0,
          reactions: {},
        },
      ],
    }));

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: 'שמואל',
      action: 'פרסום נושא רשמי מטעם המערכת',
      target: title,
      timestamp: 'עכשיו',
      type: 'announcement',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('נושא רשמי פורסם', `ההכרזה הרשמית "${title}" פורסמה וננעצה בראש הפורום!`, 'success');
  };

  // Tag Handlers
  const handleAddTag = (tagName: string) => {
    const clean = tagName.trim().replace(/^#/, '');
    if (!clean || tags.includes(clean)) return;
    setTags((prev) => [...prev, clean]);
    showToast('תגית נוספה', `התגית #${clean} נוספה למערכת`, 'success');
  };

  const handleRenameTag = (oldTag: string, newTag: string) => {
    const cleanNew = newTag.trim().replace(/^#/, '');
    if (!cleanNew) return;
    setTags((prev) => prev.map((t) => (t === oldTag ? cleanNew : t)));
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        tags: t.tags.map((tag) => (tag === oldTag ? cleanNew : tag)),
      }))
    );
    showToast('תגית עודכנה', `התגית #${oldTag} שונתה ל-#${cleanNew}`, 'info');
  };

  const handleMergeTags = (sourceTag: string, targetTag: string) => {
    setTags((prev) => prev.filter((t) => t !== sourceTag));
    setTopics((prev) =>
      prev.map((t) => {
        if (!t.tags.includes(sourceTag)) return t;
        const filtered = t.tags.filter((tag) => tag !== sourceTag);
        return {
          ...t,
          tags: Array.from(new Set([...filtered, targetTag])),
        };
      })
    );
    showToast('תגיות מוזגו', `התגית #${sourceTag} מוזגה ל-#${targetTag}`, 'info');
  };

  const handleDeleteTag = (tagName: string) => {
    setTags((prev) => prev.filter((t) => t !== tagName));
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        tags: t.tags.filter((tag) => tag !== tagName),
      }))
    );
    showToast('תגית נמחקה', `התגית #${tagName} הוסרה מהמערכת`, 'danger');
  };

  // User Moderation & Permissions Handlers
  const handleToggleMuteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    let isNowMuted = false;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          isNowMuted = !u.isMuted;
          return { ...u, isMuted: isNowMuted };
        }
        return u;
      })
    );
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: isNowMuted ? 'הגבלת משתמש לקריאה בלבד (Mute)' : 'ביטול השתקת משתמש',
      target: target?.name || userId,
      timestamp: 'עכשיו',
      type: 'mute',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast(
      isNowMuted ? 'המשתמש הושתק' : 'השתקת המשתמש בוטלה',
      isNowMuted ? `${target?.name} מוגבל כעת לקריאה בלבד (לא יוכל להגיב).` : `${target?.name} יכול לכתוב כעת שוב.`,
      isNowMuted ? 'danger' : 'success'
    );
  };

  const handleVerifyEmail = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, emailVerified: true } : u))
    );
    showToast('חשבון אומת ידנית', `האימייל של ${target?.name || ''} סומן כמאומת בהצלחה!`, 'success');
  };

  const handleIssueWarning = (userId: string, reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const newWarningsCount = (target.warningsCount || 0) + 1;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, warningsCount: newWarningsCount } : u))
    );

    const newWarning: UserWarning = {
      id: `warn-${Date.now()}`,
      userId,
      userName: target.name,
      level: newWarningsCount,
      reason,
      issuedAt: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('he-IL'),
      issuedBy: currentUser?.username || 'שמואל',
    };
    setWarnings((prev) => [newWarning, ...prev]);

    // Check automation rules for warning_count
    const rule = automationRules.find((r) => r.isActive && r.trigger === 'warning_count' && newWarningsCount >= r.conditionValue);
    if (rule && rule.action === 'auto_temp_ban') {
      handleBanUser(userId, '7 ימים', `חסימה אוטומטית עקב צבירת ${newWarningsCount} אזהרות (כלל: ${rule.title})`);
    }

    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: `מתן אזהרה רשמית (דרגה ${newWarningsCount})`,
      target: target.name,
      details: reason,
      timestamp: 'עכשיו',
      type: 'warning',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('אזהרה נשלחה', `נשלחה אזהרה רשמית ל-${target.name} (סה"כ ${newWarningsCount} אזהרות)`, 'danger');
  };

  const handleUpdateUser = (userId: string, updated: Partial<OnlineUser>) => {
    const oldUser = users.find((u) => u.id === userId);
    const targetName = updated.name || oldUser?.name || 'משתמש';
    const isNowAdmin = updated.role ? updated.role.includes('מנהל') : undefined;

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const merged = { ...u, ...updated };
          if (isNowAdmin !== undefined) {
            merged.roleColor = isNowAdmin
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-blue-100 text-blue-800 border-blue-200';
          }
          return merged;
        }
        return u;
      })
    );

    if (
      currentUser &&
      (currentUser.name === oldUser?.name ||
        currentUser.username === oldUser?.name ||
        currentUser.id === userId)
    ) {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              name: updated.name || prev.name,
              username: updated.name || prev.username,
              role: updated.role || prev.role,
              reputation: updated.reputation !== undefined ? updated.reputation : prev.reputation,
              isAdmin: isNowAdmin !== undefined ? isNowAdmin : prev.isAdmin,
              roleBadgeColor:
                isNowAdmin !== undefined
                  ? isNowAdmin
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-blue-600 text-white border-blue-400'
                  : prev.roleBadgeColor,
            }
          : null
      );
    }

    if (updated.name && oldUser && updated.name !== oldUser.name) {
      setTopics((prev) =>
        prev.map((t) =>
          t.author?.name === oldUser.name
            ? { ...t, author: { ...t.author, name: updated.name! } }
            : t
        )
      );
    }
    showToast('פרטי והרשאות משתמש עודכנו', `הפרטים של ${targetName} עודכנו בהצלחה`, 'success');
  };

  const handleUpdatePermission = (roleName: string, field: keyof RolePermission, value: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => (p.roleName === roleName ? { ...p, [field]: value } : p))
    );
    showToast('הרשאות עודכנו', `עודכנה הרשאת ${field} עבור קבוצת ${roleName}`, 'info');
  };

  const handleAddBannedEntity = (type: 'ip' | 'email' | 'username', value: string, reason: string) => {
    const newBan: BannedEntity = {
      id: `ban-${Date.now()}`,
      type,
      value,
      reason,
      bannedAt: new Date().toLocaleDateString('he-IL'),
    };
    setBannedEntities((prev) => [newBan, ...prev]);
    showToast('נוספה חסימה', `החסימה עבור ${value} נכנסה לתוקף מיידי`, 'danger');
  };

  const handleRemoveBannedEntity = (id: string) => {
    setBannedEntities((prev) => prev.filter((b) => b.id !== id));
    showToast('חסימה הוסרה', 'החסימה הוסרה בהצלחה', 'info');
  };

  // Automation & Webhooks Handlers
  const handleSendBroadcast = (subject: string, message: string, targetGroup: string) => {
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: `שידור הודעת תפוצה קבוצתית: ${subject}`,
      target: targetGroup,
      details: message.slice(0, 100) + '...',
      timestamp: 'עכשיו',
      type: 'announcement',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('הודעת תפוצה שודרה', `ההודעה שוגרה בהצלחה אל ${targetGroup}!`, 'success');
  };

  const handleAddWebhook = (wh: Omit<WebhookConfig, 'id'>) => {
    const newWh: WebhookConfig = {
      ...wh,
      id: `wh-${Date.now()}`,
    };
    setWebhooks((prev) => [newWh, ...prev]);
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'הגדרת Webhook חדש',
      target: wh.name,
      timestamp: 'עכשיו',
      type: 'webhook',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('Webhook נוסף', `אינטגרציית ${wh.name} הוגדרה בהצלחה`, 'success');
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    showToast('Webhook נמחק', 'ה-Webhook הוסר מהמערכת', 'info');
  };

  const handleTestWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, lastTriggered: 'עכשיו (בדיקה מוצלחת 200 OK)' } : w
      )
    );
    showToast('פינג הצליח (200 OK)', 'האינטגרציה הגיבה בהצלחה עם סטטוס 200 OK!', 'success');
  };

  const handleAddRule = (rule: Omit<AutomationRule, 'id'>) => {
    const newRule: AutomationRule = {
      ...rule,
      id: `rule-${Date.now()}`,
    };
    setAutomationRules((prev) => [newRule, ...prev]);
    showToast('כלל אוטומציה נוסף', `הכלל "${rule.title}" הופעל בהצלחה`, 'success');
  };

  const handleToggleRule = (id: string) => {
    setAutomationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setAutomationRules((prev) => prev.filter((r) => r.id !== id));
    showToast('כלל נמחק', 'כלל האוטומציה הוסר', 'info');
  };

  // Security, Media & Theme Handlers
  const handleUpdateWordFilter = (filter: WordFilterConfig) => {
    setWordFilter(filter);
    showToast('מסנן מילים עודכן', 'הגדרות הסינון ו-reCAPTCHA נשמרו בהצלחה', 'success');
  };

  const handleDeleteMediaItem = (mediaId: string) => {
    setTopics((prev) =>
      prev.map((t) => ({
        ...t,
        attachments: t.attachments?.filter((a) => a.id !== mediaId),
      }))
    );
    setRepliesList((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((tid) => {
        copy[tid] = copy[tid].map((r) => ({
          ...r,
          attachments: r.attachments?.filter((a) => a.id !== mediaId),
        }));
      });
      return copy;
    });
    showToast('קובץ נמחק', 'קובץ המדיה הוסר מהשרת בהצלחה', 'info');
  };

  const handleUpdateThemeSettings = (updated: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => ({ ...prev, ...updated }));
    showToast('עיצוב עודכן', 'הגדרות העיצוב והמיתוג הוחלו בהצלחה', 'success');
  };

  // Mark all forums as read
  const handleMarkAllAsRead = () => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub) => ({
          ...sub,
          hasUnread: false,
        })),
      }))
    );
  };

  // Select a subforum (e.g. "פיתוח וסקריפטים")
  const handleSelectForum = (category: ForumCategory, sub: ForumSubCategory) => {
    setSelectedCategory(category);
    setSelectedForum(sub);
    setActiveNav('categories');
    // Scroll smoothly to top of main area
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Navigate back to main forum list
  const handleNavigateHome = () => {
    setSelectedCategory(null);
    setSelectedForum(null);
    setActiveNav('categories');
    setSelectedTagFilter(null);
  };

  // Create new topic
  const handleCreateTopic = (data: {
    forumId: string;
    title: string;
    content: string;
    tags: string[];
    attachments?: MediaAttachment[];
  }) => {
    if (!currentUser) {
      handleOpenRegisterModal(
        'הרשמה לפתיחת נושא חדש',
        'כדי לפתוח נושא חדש בפורום, עליך להירשם או להתחבר לחשבונך.'
      );
      return;
    }

    const authorName = currentUser.username || currentUser.name || 'משתמש רשום';
    const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const authorRole = currentUser?.role || 'חבר קהילה';
    const authorReputation = currentUser?.reputation ?? 25;

    // Check Mute
    const userRecord = users.find((u) => u?.id === currentUser?.id || u?.name === authorName);
    if (userRecord?.isMuted) {
      showToast('החשבון מושתק', 'אינך יכול לפרסם נושאים חדשים כיוון שחשבונך הוגבל לקריאה בלבד (Mute).', 'danger');
      return;
    }

    // Check Ban
    if (userRecord?.isBanned || bannedEntities.some((b) => b.type === 'username' && b.value.toLowerCase() === authorName.toLowerCase())) {
      showToast('חשבון חסום', 'אינך מורשה לפרסם בפורום.', 'danger');
      return;
    }

    // Word Filter & Spam Protection
    let filteredTitle = data.title;
    let filteredContent = data.content;

    const hitBlockedWord = wordFilter.blockedWords.find((w) =>
      w.trim() &&
      (filteredTitle.toLowerCase().includes(w.toLowerCase()) ||
        filteredContent.toLowerCase().includes(w.toLowerCase()))
    );

    if (hitBlockedWord) {
      if (wordFilter.action === 'block') {
        showToast('הפרסום נחסם', `הנושא מכיל מילים אסורות לפרסום לפי מדיניות הפורום ("${hitBlockedWord}").`, 'danger');
        return;
      } else {
        wordFilter.blockedWords.forEach((w) => {
          if (!w.trim()) return;
          const reg = new RegExp(w, 'gi');
          filteredTitle = filteredTitle.replace(reg, '***');
          filteredContent = filteredContent.replace(reg, '***');
        });
      }
    }

    // Register any new tags
    data.tags.forEach((tag) => {
      const clean = tag.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags((prev) => [...prev, clean]);
      }
    });

    const newTopic: ForumTopic = {
      id: `topic-${Date.now()}`,
      forumId: data.forumId,
      title: filteredTitle,
      author: {
        name: authorName,
        avatar: authorAvatar,
        role: authorRole,
        reputation: authorReputation,
      },
      repliesCount: 0,
      viewsCount: 1,
      likes: 0,
      dislikes: 0,
      isPinned: false,
      tags: data.tags,
      attachments: data.attachments,
      reactions: {},
      lastReply: {
        userName: authorName,
        userAvatar: authorAvatar,
        timestamp: 'לפני רגע',
      },
      createdAt: 'היום ב-' + new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      snippet: filteredContent,
    };

    setTopics([newTopic, ...topics]);

    // Increase user's post count
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, postCount: (prev.postCount || 0) + 1 } : null);
    }

    // Also update the subCategory topic counter & last post
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.map((sub) => {
          if (sub.id === data.forumId) {
            return {
              ...sub,
              topicsCount: sub.topicsCount + 1,
              hasUnread: true,
              lastPost: {
                topicTitle: filteredTitle,
                userName: authorName,
                userAvatar: authorAvatar,
                userRole: authorRole,
                timeAgo: 'לפני רגע',
              },
            };
          }
          return sub;
        }),
      }))
    );

    showToast('הנושא פורסם בהצלחה!', 'הנושא שלך עלה לפורום וזמין לצפייה ותגובות של חברי הקהילה.', 'success');

    // If target subCategory matches, open it
    for (const c of categories) {
      const match = c.subCategories.find((s) => s.id === data.forumId);
      if (match) {
        setSelectedCategory(c);
        setSelectedForum(match);
        break;
      }
    }
  };

  // Add reply to existing topic
  const handleAddReply = (topicId: string, replyText: string, attachments?: MediaAttachment[]) => {
    // Enforce mandatory registration/login
    if (!currentUser) {
      showToast('חובה להירשם או להתחבר', 'אינך יכול להגיב ללא שם משתמש.', 'danger');
      return;
    }

    const authorName = currentUser.name || currentUser.username || 'משתמש רשום';
    const authorAvatar = currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const authorRole = currentUser.role || 'חבר קהילה';

    // Check Mute
    const userRecord = users.find((u) => u?.id === currentUser?.id || u?.name === authorName);
    if (userRecord?.isMuted) {
      showToast('החשבון מושתק', 'אינך יכול להגיב כיוון שחשבונך הוגבל לקריאה בלבד (Mute).', 'danger');
      return;
    }

    // Check Ban
    if (userRecord?.isBanned || bannedEntities.some((b) => b.type === 'username' && b.value.toLowerCase() === authorName.toLowerCase())) {
      showToast('חשבון חסום', 'אינך מורשה להגיב בפורום.', 'danger');
      return;
    }

    // Word Filter
    let cleanReply = replyText;
    const hitBlockedWord = wordFilter.blockedWords.find((w) =>
      w.trim() && cleanReply.toLowerCase().includes(w.toLowerCase())
    );

    if (hitBlockedWord) {
      if (wordFilter.action === 'block') {
        showToast('התגובה נחסמה', `התגובה מכילה ביטויים אסורים לפי מדיניות הפורום ("${hitBlockedWord}").`, 'danger');
        return;
      } else {
        wordFilter.blockedWords.forEach((w) => {
          if (!w.trim()) return;
          const reg = new RegExp(w, 'gi');
          cleanReply = cleanReply.replace(reg, '***');
        });
      }
    }

    const newReply: ForumReply = {
      id: `r-${Date.now()}`,
      authorName,
      authorAvatar,
      authorRole,
      text: cleanReply,
      timeAgo: 'ממש עכשיו',
      likes: 0,
      dislikes: 0,
      attachments,
      reactions: {},
    };

    // Save reply into replies map
    setRepliesList((prev) => ({
      ...prev,
      [topicId]: [...(prev[topicId] || []), newReply],
    }));

    // Update topic replies count & last reply
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === topicId) {
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            lastReply: {
              userName: authorName,
              userAvatar: authorAvatar,
              timestamp: 'ממש עכשיו',
            },
          };
        }
        return t;
      })
    );

    // Increase current user's post count
    if (currentUser) {
      setCurrentUser((prev) => prev ? { ...prev, postCount: (prev.postCount || 0) + 1 } : null);
    }

    showToast('התגובה פורסמה בהצלחה!', 'תגובתך נוספה לשרשור.', 'success');
  };

  // Delete a reply from a topic
  const handleDeleteReply = (topicId: string, replyId: string) => {
    setRepliesList((prev) => ({
      ...prev,
      [topicId]: (prev[topicId] || []).filter((r) => r.id !== replyId),
    }));
    setTopics((prev) =>
      prev.map((t) =>
        t.id === topicId ? { ...t, repliesCount: Math.max(0, t.repliesCount - 1) } : t
      )
    );
    const newLog: AdminLog = {
      id: `log-${Date.now()}`,
      adminName: currentUser?.username || 'שמואל',
      action: 'מחיקת תגובה מדיון',
      target: topicId,
      details: 'תגובה נמחקה ע"י הנהלת הפורום',
      timestamp: 'עכשיו',
      type: 'delete_topic',
    };
    setAdminLogs((prev) => [newLog, ...prev]);
    showToast('תגובה נמחקה', 'התגובה הוסרה בהצלחה מהשרשור ע"י ההנהלה.', 'info');
  };

  // Quick Ban user by name directly from forum / replies
  const handleQuickBanUser = (targetUsername: string, duration: string, reason: string) => {
    const target = users.find((u) => u.name === targetUsername);
    if (target) {
      handleBanUser(target.id, duration, reason);
    } else {
      setBannedEntities((prev) => [
        ...prev,
        {
          id: `ban-${Date.now()}`,
          type: 'username',
          value: targetUsername,
          reason,
          createdAt: new Date().toLocaleDateString('he-IL'),
        },
      ]);
      const newLog: AdminLog = {
        id: `log-${Date.now()}`,
        adminName: currentUser?.username || 'שמואל',
        action: `חסימת משתמש מהפורום (${duration})`,
        target: targetUsername,
        details: reason,
        timestamp: 'עכשיו',
        type: 'ban',
      };
      setAdminLogs((prev) => [newLog, ...prev]);
      showToast('משתמש נחסם מהפורום', `המשתמש ${targetUsername} הוגבל לתקופה של ${duration}. סיבה: ${reason}`, 'danger');
    }
  };

  // Filtered categories based on search
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    subCategories: cat.subCategories.filter((sub) => {
      const matchSearch =
        !searchQuery ||
        sub.title.includes(searchQuery) ||
        sub.description.includes(searchQuery) ||
        sub.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchTag = !selectedTagFilter || sub.tags.includes(selectedTagFilter);
      return matchSearch && matchTag;
    }),
  })).filter((cat) => {
    if (searchQuery.trim() || selectedTagFilter) {
      return cat.subCategories.length > 0;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-slate-800 font-sans">
      
      {/* 1. Header Navigation with Logo, Menu, Search, and Quick Login */}
      <Header
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        activeNav={activeNav}
        setActiveNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'categories') {
            setSelectedForum(null);
          }
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNewTopic={handleOpenNewTopicModal}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenRegister={() => handleOpenRegisterModal()}
        onOpenLogin={() => handleOpenLoginModal()}
        forumTitle={themeSettings.forumName}
        forumSubtitle={themeSettings.forumSubtitle}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-start gap-3 ${
              toastMessage.type === 'danger'
                ? 'bg-rose-950 text-white border-rose-700'
                : toastMessage.type === 'info'
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-emerald-950 text-white border-emerald-700'
            }`}
          >
            {toastMessage.type === 'danger' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : toastMessage.type === 'info' ? (
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <h5 className="font-bold text-sm mb-0.5">{toastMessage.title}</h5>
              <p className="opacity-90 leading-relaxed">{toastMessage.text}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Container Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs
          currentCategoryName={selectedCategory?.title || 'מערכות טלפוניה ו-IVR'}
          currentForumName={selectedForum?.title || (selectedCategory ? 'פיתוח וסקריפטים' : undefined)}
          onNavigateHome={handleNavigateHome}
          onNavigateCategory={() => {
            setSelectedForum(null);
            setActiveNav('categories');
          }}
          onNavigateForum={() => {
            if (selectedCategory && !selectedForum) {
              setSelectedForum(selectedCategory.subCategories[0]);
            }
          }}
        />

        {/* System Announcement Banner */}
        <AnnouncementBanner
          text={announcement.text}
          type={announcement.type}
          active={announcement.active}
        />

        {/* Prominent Banned User Notification Banner */}
        {currentUser && (
          Boolean(users.find((u) => u.name === currentUser.username)?.isBanned) ||
          bannedEntities.some((b) => b.type === 'username' && b.value.toLowerCase() === currentUser.username.toLowerCase())
        ) && (
          <div className="mb-4 bg-red-600 text-white px-5 py-3 rounded-2xl flex items-center justify-between shadow-md text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-200 shrink-0" />
              <div>
                <strong className="block font-bold text-sm">התראת חסימה פעילה:</strong>
                <span>המשתמש שלך ({currentUser.username}) חסום במערכת הפורום. הינך נמצא במצב קריאה בלבד ואינך יכול לפרסם נושאים או להגיב.</span>
              </div>
            </div>
            <span className="bg-red-800 text-white text-[11px] font-bold px-3 py-1 rounded-xl shrink-0">
              חסום לתגובות
            </span>
          </div>
        )}

        {/* Active Tag Filter indicator if active */}
        {selectedTagFilter && (
          <div className="mb-4 bg-sky-50 border border-sky-200 text-sky-900 px-4 py-2 rounded-xl flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-sky-600" />
              מסנן לפי תגית: <strong>#{selectedTagFilter}</strong>
            </span>
            <button
              onClick={() => setSelectedTagFilter(null)}
              className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
            >
              הסר סינון
            </button>
          </div>
        )}

        {/* Search query notice if active */}
        {searchQuery && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-xl flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              תוצאות חיפוש עבור: <strong>"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
            >
              נקה חיפוש
            </button>
          </div>
        )}

        {/* 2 & 3: Main Layout Grid (Content Area + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Forum Content (Span 8 columns on large screens) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* View Switching depending on activeNav and forum selection */}
            {selectedForum ? (
              <ForumTopicsView
                category={selectedCategory || categories[0]}
                forum={selectedForum}
                topics={topics}
                onBackToCategories={() => setSelectedForum(null)}
                onOpenNewTopic={handleOpenNewTopicModal}
                currentUser={currentUser}
                onAddReply={handleAddReply}
                onToggleLockTopic={handleToggleLockTopic}
                onTogglePinTopic={handleTogglePinTopic}
                onDeleteTopic={handleDeleteTopic}
                onChangeUserReputationByName={handleChangeUserReputationByName}
                repliesList={repliesList}
                onVoteTopic={handleVoteTopic}
                onVoteReply={handleVoteReply}
                onBanUser={handleQuickBanUser}
                onDeleteReply={handleDeleteReply}
                onQuickLogin={handleLogin}
                onUpdateSubCategory={handleUpdateSubCategory}
                onOpenRegister={() => handleOpenRegisterModal()}
                onOpenLogin={() => handleOpenLoginModal()}
              />
            ) : activeNav === 'categories' ? (
              <CategoriesList
                categories={filteredCategories}
                onSelectForum={handleSelectForum}
                onMarkAllAsRead={handleMarkAllAsRead}
                filterUnreadOnly={filterUnreadOnly}
                setFilterUnreadOnly={setFilterUnreadOnly}
                currentUser={currentUser}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddSubCategory={handleAddSubCategory}
                onUpdateSubCategory={handleUpdateSubCategory}
                onDeleteSubCategory={handleDeleteSubCategory}
              />
            ) : activeNav === 'recent' ? (
              /* Recent Topics View */
              <div className="space-y-4">
                <div className="bg-[#0f2b48] text-white p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <h2 className="text-base font-bold">נושאים אחרונים בפורום</h2>
                  </div>
                  <span className="text-xs text-slate-300">מתעדכן בזמן אמת</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  {topics.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => {
                        const parentCat = categories.find((c) =>
                          c.subCategories.some((s) => s.id === topic.forumId)
                        );
                        const parentSub = parentCat?.subCategories.find(
                          (s) => s.id === topic.forumId
                        );
                        if (parentCat && parentSub) {
                          handleSelectForum(parentCat, parentSub);
                        }
                      }}
                      className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={topic.author?.avatar}
                          alt={topic.author?.name || 'מחבר'}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 hover:text-blue-700">
                            {topic.title}
                          </h4>
                          <span className="text-xs text-slate-400">
                            מאת {topic.author?.name || 'משתמש'} • {topic.createdAt}
                          </span>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          {topic.repliesCount} תגובות
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeNav === 'tags' ? (
              /* Tags View */
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    תגיות ונושאי שיחה בפורום
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {popularTags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => {
                        setSelectedTagFilter(tag);
                        setActiveNav('categories');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer text-right group"
                    >
                      <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 font-mono">
                        #{tag}
                      </div>
                      <span className="text-xs text-slate-400 mt-1 block">
                        הצג נושאים מתוייגים
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Users Directory View */
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900">
                    חברי הקהילה המובילים ומפתחים פעילים
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(users || []).filter((u): u is OnlineUser => Boolean(u && typeof u === 'object')).map((user) => (
                    <div
                      key={user.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        user.isBanned ? 'bg-rose-50/40 border-rose-200' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.avatar}
                            alt={user.name || user.username || 'משתמש'}
                            className={`w-10 h-10 rounded-xl object-cover border ${
                              user.isBanned ? 'border-rose-400 opacity-60' : 'border-slate-200'
                            }`}
                          />
                          {user.isBanned && (
                            <div className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5" title="מורחק">
                              <UserX className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900">
                              {user.name || user.username || 'משתמש'}
                            </h4>
                            {user.isBanned && (
                              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-bold">
                                מורחק
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>{user.isBanned ? `סיבת הרחקה: ${user.banReason || 'עבירה על הכללים'}` : user.action}</span>
                            <span>•</span>
                            <span className="text-blue-700 font-bold font-mono">
                              ⭐ {user.reputation || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${user.roleColor}`}>
                          {user.role}
                        </span>

                        {currentUser?.isAdmin && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <button
                              type="button"
                              onClick={() => setIsAdminPanelOpen(true)}
                              className="text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer"
                              title="פתח פאנל ניהול"
                            >
                              נהל
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setUserToDeleteInDirectory(user);
                                setPurgeTopicsInDirectory(false);
                              }}
                              className="text-[10px] text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="מחק משתמש זה מהרשימה"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>מחק</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Sidebar (Span 4 columns on large screens) */}
          <div className="lg:col-span-4">
            <Sidebar
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              onOpenNewTopic={handleOpenNewTopicModal}
              onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
              onOpenRegister={() => handleOpenRegisterModal()}
              onOpenLogin={() => handleOpenLoginModal()}
              usersList={users}
              onSelectTag={(tag) => {
                setSelectedTagFilter(tag);
                setSelectedForum(null);
                setActiveNav('categories');
              }}
            />
          </div>

        </div>
      </main>

      {/* 4. Footer & Bottom bar */}
      <Footer />

      {/* Modal: New Topic */}
      <NewTopicModal
        isOpen={isNewTopicModalOpen}
        onClose={() => setIsNewTopicModalOpen(false)}
        categories={categories}
        defaultForumId={selectedForum?.id || 'dev-and-scripts'}
        currentUser={currentUser}
        onSubmitTopic={handleCreateTopic}
      />

      {/* Modal: Admin Panel (Shmuel) */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={currentUser}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
        onAddSubCategory={handleAddSubCategory}
        onUpdateSubCategory={handleUpdateSubCategory}
        onDeleteSubCategory={handleDeleteSubCategory}
        onReorderCategories={handleReorderCategories}
        topics={topics}
        onToggleLockTopic={handleToggleLockTopic}
        onTogglePinTopic={handleTogglePinTopic}
        onDeleteTopic={handleDeleteTopic}
        onMoveTopic={handleMoveTopic}
        onMergeTopics={handleMergeTopics}
        onCreateSystemTopic={handleCreateSystemTopic}
        tags={tags}
        onAddTag={handleAddTag}
        onRenameTag={handleRenameTag}
        onMergeTags={handleMergeTags}
        onDeleteTag={handleDeleteTag}
        trashItems={trashItems}
        onRestoreTopic={handleRestoreTopic}
        onPermanentDeleteTopic={handlePermanentDeleteTopic}
        onEmptyTrash={handleEmptyTrash}
        users={users}
        onUpdateUser={handleUpdateUser}
        onBanUser={handleBanUser}
        onDeleteAndBanUser={handleDeleteAndBanUser}
        onUnbanUser={handleUnbanUser}
        onChangeReputation={handleChangeReputation}
        onChangeUserRole={handleChangeUserRole}
        onToggleMuteUser={handleToggleMuteUser}
        onVerifyEmail={handleVerifyEmail}
        warnings={warnings}
        onIssueWarning={handleIssueWarning}
        permissions={permissions}
        onUpdatePermission={handleUpdatePermission}
        bannedEntities={bannedEntities}
        onAddBannedEntity={handleAddBannedEntity}
        onRemoveBannedEntity={handleRemoveBannedEntity}
        announcement={announcement}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        onSendBroadcast={handleSendBroadcast}
        webhooks={webhooks}
        onAddWebhook={handleAddWebhook}
        onToggleWebhook={handleToggleWebhook}
        onDeleteWebhook={handleDeleteWebhook}
        onTestWebhook={handleTestWebhook}
        automationRules={automationRules}
        onToggleRule={handleToggleRule}
        onAddRule={handleAddRule}
        onDeleteRule={handleDeleteRule}
        adminLogs={adminLogs}
        onClearLogs={() => setAdminLogs([])}
        wordFilter={wordFilter}
        onUpdateWordFilter={handleUpdateWordFilter}
        allMedia={allMedia}
        onDeleteMediaItem={handleDeleteMediaItem}
        themeSettings={themeSettings}
        onUpdateThemeSettings={handleUpdateThemeSettings}
        onResetAllDemoData={handleResetAllDemoData}
      />

      {/* Modal: Edit Profile Picture & Display Name */}
      {currentUser && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentUser={currentUser}
          onSaveProfile={handleSaveProfile}
        />
      )}

      {/* Modal: Delete User Directly from Directory */}
      {userToDeleteInDirectory && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center mb-1">
              מחיקת משתמש מהרשימה
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              האם אתה בטוח שברצונך למחוק את המשתמש{' '}
              <span className="font-bold text-slate-800">{userToDeleteInDirectory.name}</span> מהרשימה?
            </p>

            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={userToDeleteInDirectory.avatar}
                  alt={userToDeleteInDirectory.name}
                  className="w-8 h-8 rounded-full border border-rose-300 object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{userToDeleteInDirectory.name}</div>
                  <div className="text-[11px] text-slate-500">{userToDeleteInDirectory.role} • מוניטין: {userToDeleteInDirectory.reputation || 0}</div>
                </div>
              </div>
              <p className="text-[11px] text-rose-800 font-medium">
                ⚠️ פעולה זו תסיר את המשתמש לצמיתות ממאגר המשתמשים ומרשימות הפורום.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                  type="checkbox"
                  id="purgeTopicsInDirectoryCheckbox"
                  checked={purgeTopicsInDirectory}
                  onChange={(e) => setPurgeTopicsInDirectory(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="purgeTopicsInDirectoryCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                  מחק גם את כל הנושאים שפורסמו על ידי משתמש זה
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserToDeleteInDirectory(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteAndBanUser(
                      userToDeleteInDirectory.id,
                      'מחיקת משתמש מרשימת המשתמשים',
                      purgeTopicsInDirectory
                    );
                    setUserToDeleteInDirectory(null);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>מחק משתמש לצמיתות</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Authentication (Register & Login) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onLogin={handleLogin}
        onRegister={handleRegister}
        customTitle={authModalDetails.title}
        customSubtitle={authModalDetails.subtitle}
      />

    </div>
  );
}
