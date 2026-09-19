import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  UserX, 
  VolumeX, 
  Volume2, 
  AlertTriangle, 
  Award, 
  Lock, 
  CheckCircle2, 
  Sliders, 
  Edit3, 
  Ban, 
  Trash2, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Mail, 
  Check, 
  X,
  Globe
} from 'lucide-react';
import { BannedEntity, OnlineUser, RolePermission, UserProfile, UserWarning } from '../../types';
import { formatReputation } from '../../utils/format';

interface AdminUsersTabProps {
  users: OnlineUser[];
  onUpdateUser: (userId: string, updated: Partial<OnlineUser>) => void;
  onBanUser: (userId: string, duration: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onDeleteAndBanUser: (userId: string, reason: string, purgeTopics?: boolean) => void;
  onChangeReputation: (userId: string, delta: number, reason: string) => void;
  onChangeUserRole: (userId: string, newRole: string) => void;
  onToggleMuteUser: (userId: string) => void;
  onVerifyEmail: (userId: string) => void;
  
  // Warnings
  warnings: UserWarning[];
  onIssueWarning: (userId: string, reason: string) => void;
  
  // Permissions Matrix
  permissions: RolePermission[];
  onUpdatePermission: (roleName: string, field: keyof RolePermission, value: boolean) => void;
  
  // Banned Entities (IP, Email, Username)
  bannedEntities: BannedEntity[];
  onAddBannedEntity: (type: 'ip' | 'email' | 'username', value: string, reason: string) => void;
  onRemoveBannedEntity: (id: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateUser,
  onBanUser,
  onUnbanUser,
  onDeleteAndBanUser,
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
}) => {
  const [subTab, setSubTab] = useState<'explorer' | 'roles' | 'matrix' | 'moderation'>('explorer');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'banned' | 'muted'>('all');

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<OnlineUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editReputation, setEditReputation] = useState(0);
  const [editEmail, setEditEmail] = useState('');

  // Warning Modal
  const [warningTarget, setWarningTarget] = useState<OnlineUser | null>(null);
  const [warningReason, setWarningReason] = useState('שימוש בשפה לא הולמת והפרת כללי הדיון');

  // Ban Modal
  const [banTarget, setBanTarget] = useState<OnlineUser | null>(null);
  const [banDuration, setBanDuration] = useState('7 ימים');
  const [banReason, setBanReason] = useState('הפרת תקנון וספאם חוזר');

  // Delete User Permanently Modal
  const [userToDelete, setUserToDelete] = useState<OnlineUser | null>(null);
  const [deleteReason, setDeleteReason] = useState('מחיקת משתמש ממאגר המערכת');
  const [purgeTopics, setPurgeTopics] = useState(false);

  // New Banned Entity Form
  const [newBanType, setNewBanType] = useState<'ip' | 'email' | 'username'>('ip');
  const [newBanValue, setNewBanValue] = useState('');
  const [newBanReason, setNewBanReason] = useState('סריקת בוטים זדונית');

  const filteredUsers = users.filter((u) => {
    if (!u) return false;
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (statusFilter === 'banned') return u.isBanned;
    if (statusFilter === 'muted') return u.isMuted;
    if (statusFilter === 'active') return !u.isBanned && !u.isMuted;
    return true;
  });

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    const isNowAdmin = editRole.includes('מנהל');
    onUpdateUser(editingUser.id, {
      name: editName.trim(),
      role: editRole,
      roleColor: isNowAdmin ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-blue-100 text-blue-800 border-blue-200',
      reputation: editReputation,
      email: editEmail.trim(),
    });
    if (onChangeUserRole) {
      onChangeUserRole(editingUser.id, editRole);
    }
    setEditingUser(null);
  };

  const handleConfirmBan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!banTarget) return;
    onBanUser(banTarget.id, banDuration, banReason);
    setBanTarget(null);
  };

  const handleConfirmWarning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!warningTarget) return;
    onIssueWarning(warningTarget.id, warningReason);
    setWarningTarget(null);
  };

  const handleAddBanEntitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanValue.trim()) return;
    onAddBannedEntity(newBanType, newBanValue.trim(), newBanReason.trim());
    setNewBanValue('');
  };

  return (
    <div className="space-y-4">
      {/* Sub-Tabs Nav */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('explorer')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'explorer'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>סייר משתמשים ועריכה ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('matrix')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'matrix'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>מטריצת הרשאות מתקדמת</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('moderation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'moderation'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Ban className="w-3.5 h-3.5" />
          <span>אכיפה, אזהרות וחסימות IP ({bannedEntities.length})</span>
        </button>
      </div>

      {/* 1. USER EXPLORER */}
      {subTab === 'explorer' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="חיפוש משתמש לפי שם, אימייל או דרגה..."
                className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold ml-1">סינון:</span>
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  statusFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                הכל
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('active')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  statusFilter === 'active' ? 'bg-emerald-700 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                פעילים
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('muted')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  statusFilter === 'muted' ? 'bg-amber-700 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                מושתקים (Mute)
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('banned')}
                className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                  statusFilter === 'banned' ? 'bg-rose-700 text-white' : 'bg-white border text-slate-700'
                }`}
              >
                חסומים
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">משתמש</th>
                    <th className="p-3">דרגה ותפקיד</th>
                    <th className="p-3">מוניטין</th>
                    <th className="p-3">אימות דוא"ל</th>
                    <th className="p-3">סטטוס מודרציה</th>
                    <th className="p-3 text-left">פעולות ניהול</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{user.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {user.email || `@${user.name}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="space-y-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border block w-fit ${user.roleColor || (user.role?.includes('מנהל') ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-blue-100 text-blue-800 border-blue-200')}`}>
                            {user.role}
                          </span>
                          {user.role?.includes('מנהל') ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                              <ShieldCheck className="w-3 h-3 text-rose-600" />
                              הרשאת מנהל (Admin)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">
                              <Users className="w-3 h-3 text-slate-400" />
                              משתמש רגיל
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <span className="font-bold font-mono text-blue-700">
                          +{formatReputation(user.reputation ?? 25)}
                        </span>
                      </td>

                      <td className="p-3">
                        {user.emailVerified ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            מאומת
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onVerifyEmail(user.id)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                            title="לחץ לאימות ידני מיידי של החשבון"
                          >
                            <Mail className="w-3 h-3" />
                            אמת ידנית
                          </button>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {user.isBanned && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              חסום
                            </span>
                          )}
                          {user.isMuted && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <VolumeX className="w-2.5 h-2.5" />
                              קריאה בלבד
                            </span>
                          )}
                          {(user.warningsCount || 0) > 0 && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {user.warningsCount} אזהרות
                            </span>
                          )}
                          {!user.isBanned && !user.isMuted && (!user.warningsCount || user.warningsCount === 0) && (
                            <span className="text-emerald-700 text-[11px]">תקין</span>
                          )}
                        </div>
                      </td>

                      <td className="p-3 text-left">
                        <div className="flex items-center gap-1.5 justify-end flex-wrap">
                          {/* Quick Admin/Regular Permission Toggle Button */}
                          {user.role?.includes('מנהל') ? (
                            <button
                              type="button"
                              onClick={() => onChangeUserRole(user.id, 'חבר קהילה פעיל')}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="הורד להרשאת משתמש רגיל"
                            >
                              <ShieldAlert className="w-3 h-3 text-amber-600" />
                              <span>הפוך לרגיל</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onChangeUserRole(user.id, 'מנהל ראשי & מפקח קהילה')}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              title="שדרג להרשאת מנהל מערכת מלאה"
                            >
                              <ShieldCheck className="w-3 h-3 text-rose-600" />
                              <span>הפוך למנהל</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(user);
                              setEditName(user.name);
                              setEditRole(user.role);
                              setEditReputation(user.reputation ?? 25);
                              setEditEmail(user.email || '');
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                            title="ערוך פרטי והרשאות משתמש"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleMuteUser(user.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              user.isMuted
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={user.isMuted ? 'בטל השתקה (Mute)' : 'השתק לקריאה בלבד (Mute)'}
                          >
                            {user.isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setWarningTarget(user);
                            }}
                            className="p-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                            title="שלח אזהרה למשתמש"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>

                          {user.isBanned ? (
                            <button
                              type="button"
                              onClick={() => onUnbanUser(user.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="בטל הרחקה"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setBanTarget(user)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                              title="הרחק משתמש מהפורום"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteReason('מחיקת משתמש ממאגר המערכת');
                              setPurgeTopics(false);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
                            title="מחק משתמש לצמיתות מהרשימה"
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

      {/* 2. PERMISSION MATRIX */}
      {subTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-rose-600" />
              מטריצת הרשאות לפי דרגות ותפקידים
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              הגדרת הרשאות פעולה לכל דרגת משתמש (צפייה, פרסום נושא, תגובות, העלאת שמע ומדיה, מודרציה וניהול).
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">דרגת משתמש</th>
                    <th className="p-3 text-center">צפייה בפורום</th>
                    <th className="p-3 text-center">פתיחת נושא</th>
                    <th className="p-3 text-center">כתיבת תגובה</th>
                    <th className="p-3 text-center">העלאת שמע/מדיה</th>
                    <th className="p-3 text-center">נעילה/עריכה</th>
                    <th className="p-3 text-center">פאנל ניהול</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissions.map((perm) => (
                    <tr key={perm.roleName} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${perm.badgeColor}`}>
                          {perm.roleName}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.canView}
                          onChange={(e) => onUpdatePermission(perm.roleName, 'canView', e.target.checked)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.canPostTopic}
                          onChange={(e) => onUpdatePermission(perm.roleName, 'canPostTopic', e.target.checked)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.canReply}
                          onChange={(e) => onUpdatePermission(perm.roleName, 'canReply', e.target.checked)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.canUploadMedia}
                          onChange={(e) => onUpdatePermission(perm.roleName, 'canUploadMedia', e.target.checked)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.canModerate}
                          onChange={(e) => onUpdatePermission(perm.roleName, 'canModerate', e.target.checked)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={perm.canAccessAdmin}
                          onChange={(e) => onUpdatePermission(perm.roleName, 'canAccessAdmin', e.target.checked)}
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODERATION & BANNED ENTITIES */}
      {subTab === 'moderation' && (
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5">
              <Ban className="w-4 h-4 text-rose-600" />
              רשימת כתובות IP ואימיילים חסומים
            </h3>
            <p className="text-xs text-rose-800 mt-0.5">
              חסימה ברמת רשת מונעת הרשמה והצפת תוכן זדוני ממשתמשים או שרתי פרוקסי.
            </p>
          </div>

          {/* Add Banned Entity Form */}
          <form
            onSubmit={handleAddBanEntitySubmit}
            className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-2xs flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-bold text-slate-700">הוסף חסימה חדשה:</span>
            <select
              value={newBanType}
              onChange={(e) => setNewBanType(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold"
            >
              <option value="ip">כתובת IP</option>
              <option value="email">דומיין / כתובת דוא"ל</option>
              <option value="username">שם משתמש</option>
            </select>

            <input
              type="text"
              required
              value={newBanValue}
              onChange={(e) => setNewBanValue(e.target.value)}
              placeholder={newBanType === 'ip' ? 'למשל: 192.168.1.1' : newBanType === 'email' ? 'למשל: *@spammer.com' : 'שם משתמש...'}
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs flex-1 min-w-[160px] font-mono"
            />

            <input
              type="text"
              value={newBanReason}
              onChange={(e) => setNewBanReason(e.target.value)}
              placeholder="סיבת החסימה..."
              className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs flex-1 min-w-[160px]"
            />

            <button
              type="submit"
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer shadow-xs"
            >
              + הוסף לרשימת החסומים
            </button>
          </form>

          {/* Banned Entities List */}
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
            {bannedEntities.map((entity) => (
              <div key={entity.id} className="p-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    {entity.type === 'ip' ? <Globe className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-slate-800 font-mono">{entity.value}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {entity.reason} • הוסף ב-{entity.bannedAt}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveBannedEntity(entity.id)}
                  className="text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  הסר חסימה
                </button>
              </div>
            ))}
          </div>

          {/* User Warnings Log */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              יומן אזהרות אחרונות שנשלחו למשתמשים:
            </h4>
            {warnings.length === 0 ? (
              <p className="text-xs text-slate-400">לא נרשמו אזהרות פעילות כרגע.</p>
            ) : (
              <div className="space-y-1.5">
                {warnings.map((w) => (
                  <div key={w.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <strong>{w.userName}</strong> קיבל אזהרה דרגה {w.level}/3
                      <span className="text-slate-500 block mt-0.5">סיבה: {w.reason} ({w.issuedAt})</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                      הוצא ע"י {w.issuedBy}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Edit User Details */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              עריכת פרטי משתמש ומוניטין: {editingUser?.name || 'משתמש'}
            </h3>

            <form onSubmit={handleSaveUserEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  שם תצוגה:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  אימייל / מזהה:
                </label>
                <input
                  type="text"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              {/* System Permission Selector (Admin vs Regular) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  הרשאת מערכת מרכזית:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditRole('מנהל ראשי & מפקח קהילה')}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      editRole.includes('מנהל')
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>מנהל (Admin)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditRole('חבר קהילה פעיל')}
                    className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      !editRole.includes('מנהל')
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>משתמש רגיל</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {editRole.includes('מנהל')
                    ? 'משתמש זה יקבל גישה מלאה לפאנל הניהול, עריכת קטגוריות, מחיקת תגובות, והרחקת משתמשים.'
                    : 'משתמש רגיל בקהילה בעל הרשאות פרסום ותגובה סטנדרטיות בלבד.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    דרגה ותפקיד מדויק:
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-medium"
                  >
                    <option value="חבר קהילה">חבר קהילה (רגיל)</option>
                    <option value="חבר קהילה פעיל">חבר קהילה פעיל (רגיל)</option>
                    <option value="תומך טופ">תומך טופ (רגיל)</option>
                    <option value="מפתח בכיר & תומך טופ">מפתח בכיר & תומך טופ (רגיל)</option>
                    <option value="מנהל תוכן">מנהל תוכן (מנהל)</option>
                    <option value="מנהל ראשי & מפקח קהילה">מנהל ראשי & מפקח קהילה (מנהל)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    מוניטין אמיתי:
                  </label>
                  <input
                    type="number"
                    value={editReputation}
                    onChange={(e) => setEditReputation(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const target = editingUser;
                    setEditingUser(null);
                    setUserToDelete(target);
                    setDeleteReason('מחיקת משתמש ממאגר המערכת');
                    setPurgeTopics(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="מחק משתמש זה לצמיתות"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>מחק משתמש מהרשימה</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    שמור שינויים
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Issue Warning */}
      {warningTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              שליחת אזהרה רשמית ל-{warningTarget?.name || 'משתמש'}
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              אזהרה זו תתועד בפרופיל המשתמש. בהצטברות 3 אזהרות המשתמש יושעה אוטומטית.
            </p>

            <form onSubmit={handleConfirmWarning} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  סיבת האזהרה:
                </label>
                <textarea
                  rows={3}
                  required
                  value={warningReason}
                  onChange={(e) => setWarningReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setWarningTarget(null)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  הוצא אזהרה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Ban User */}
      {banTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <UserX className="w-5 h-5 text-rose-600" />
              הרחקת משתמש: {banTarget?.name || 'משתמש'}
            </h3>

            <form onSubmit={handleConfirmBan} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  משך ההרחקה:
                </label>
                <select
                  value={banDuration}
                  onChange={(e) => setBanDuration(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="24 שעות">24 שעות</option>
                  <option value="3 ימים">3 ימים</option>
                  <option value="7 ימים">7 ימים</option>
                  <option value="30 ימים">30 ימים</option>
                  <option value="לצמיתות">הרחקה לצמיתות</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  סיבת ההרחקה:
                </label>
                <textarea
                  rows={2}
                  required
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setBanTarget(null)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  אשר הרחקה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Delete User Permanently */}
      {userToDelete && (
        <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-right shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 text-center mb-1">
              מחיקת משתמש לצמיתות
            </h3>
            <p className="text-xs text-slate-500 text-center mb-4">
              האם אתה בטוח שברצונך למחוק את המשתמש{' '}
              <span className="font-bold text-slate-800">{userToDelete.name}</span> מהמערכת?
            </p>

            <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={userToDelete.avatar}
                  alt={userToDelete.name}
                  className="w-8 h-8 rounded-full border border-rose-300 object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{userToDelete.name}</div>
                  <div className="text-[11px] text-slate-500">{userToDelete.role} • מוניטין: {userToDelete.reputation || 0}</div>
                </div>
              </div>
              <p className="text-[11px] text-rose-800 font-medium">
                ⚠️ פעולה זו תסיר את המשתמש לחלוטין ממאגר המשתמשים, רשימות המשתמשים וההרשאות.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onDeleteAndBanUser(userToDelete.id, deleteReason, purgeTopics);
                setUserToDelete(null);
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  סיבת המחיקה (לתיעוד ביומן הניהול):
                </label>
                <input
                  type="text"
                  required
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                <input
                  type="checkbox"
                  id="purgeTopicsCheckbox"
                  checked={purgeTopics}
                  onChange={(e) => setPurgeTopics(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="purgeTopicsCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                  מחק גם את כל הנושאים והפוסטים שפורסמו על ידי משתמש זה
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>מחק משתמש לצמיתות</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
