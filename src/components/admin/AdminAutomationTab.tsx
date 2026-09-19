import React, { useState } from 'react';
import { 
  Cpu, 
  Send, 
  Webhook, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Volume2, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  MessageSquare,
  Bot
} from 'lucide-react';
import { AutomationRule, WebhookConfig } from '../../types';

interface AdminAutomationTabProps {
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
}

export const AdminAutomationTab: React.FC<AdminAutomationTabProps> = ({
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
}) => {
  const [subTab, setSubTab] = useState<'broadcast' | 'webhooks' | 'rules'>('broadcast');

  // Announcement State
  const [annText, setAnnText] = useState(announcement?.text || '');
  const [annType, setAnnType] = useState<'urgent' | 'info'>(announcement?.type || 'info');
  const [annActive, setAnnActive] = useState(announcement?.active ?? true);

  // Broadcast Message State
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastGroup, setBroadcastGroup] = useState('כלל המשתמשים בפורום');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // New Webhook State
  const [isNewWebhookOpen, setIsNewWebhookOpen] = useState(false);
  const [whName, setWhName] = useState('');
  const [whPlatform, setWhPlatform] = useState<'telegram' | 'discord' | 'custom'>('telegram');
  const [whUrl, setWhUrl] = useState('');
  const [whEvents, setWhEvents] = useState<('new_topic' | 'new_reply' | 'user_register')[]>(['new_topic']);

  // New Rule State
  const [isNewRuleOpen, setIsNewRuleOpen] = useState(false);
  const [ruleTitle, setRuleTitle] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [ruleTrigger, setRuleTrigger] = useState<'post_count' | 'reputation_reach' | 'warning_count'>('post_count');
  const [ruleValue, setRuleValue] = useState(10);
  const [ruleAction, setRuleAction] = useState<'promote_role' | 'grant_badge' | 'auto_temp_ban'>('promote_role');
  const [ruleTarget, setRuleTarget] = useState('חבר קהילה פעיל');

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncement?.(annText, annType, annActive);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMsg.trim()) return;
    onSendBroadcast(broadcastSubject.trim(), broadcastMsg.trim(), broadcastGroup);
    setBroadcastSubject('');
    setBroadcastMsg('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 4000);
  };

  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whName.trim() || !whUrl.trim()) return;
    onAddWebhook({
      name: whName.trim(),
      targetPlatform: whPlatform,
      url: whUrl.trim(),
      events: whEvents,
      isActive: true,
    });
    setWhName('');
    setWhUrl('');
    setIsNewWebhookOpen(false);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleTitle.trim()) return;
    onAddRule({
      title: ruleTitle.trim(),
      description: ruleDesc.trim() || `אוטומציה לפי ${ruleTrigger} מול ערך ${ruleValue}`,
      trigger: ruleTrigger,
      conditionValue: ruleValue,
      action: ruleAction,
      targetRoleOrBadge: ruleTarget,
      isActive: true,
    });
    setRuleTitle('');
    setRuleDesc('');
    setIsNewRuleOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* SubTab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('broadcast')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'broadcast'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>הודעות מערכת, באנר ותפוצה</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('webhooks')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'webhooks'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Webhook className="w-3.5 h-3.5" />
          <span>אינטגרציות API & Webhooks ({webhooks.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('rules')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            subTab === 'rules'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>כללי אוטומציה ושדרוג דרגות ({automationRules.length})</span>
        </button>
      </div>

      {/* 1. BROADCAST & ANNOUNCEMENTS */}
      {subTab === 'broadcast' && (
        <div className="space-y-5">
          {/* Top Banner Announcement Config */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-blue-600" />
                באנר הכרזה עליון בדף הבית
              </h4>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <span>סטטוס באנר פעיל:</span>
                <input
                  type="checkbox"
                  checked={annActive}
                  onChange={(e) => setAnnActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
              </label>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  נוסח ההודעה המוצגת בראש הפורום:
                </label>
                <textarea
                  rows={2}
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-600">סגנון הבאנר:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="annType"
                      checked={annType === 'info'}
                      onChange={() => setAnnType('info')}
                      className="text-blue-600"
                    />
                    <span>כחול מידע (Info)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="annType"
                      checked={annType === 'urgent'}
                      onChange={() => setAnnType('urgent')}
                      className="text-rose-600"
                    />
                    <span>אדום דחוף (Urgent)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  עדכן באנר הכרזה
                </button>
              </div>
            </form>
          </div>

          {/* Broadcast Newsletter / Direct Message to Users */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600" />
              שליחת הודעת תפוצה קבוצתית (Newsletter / Broadcast)
            </h4>
            <p className="text-xs text-slate-500">
              שידור הודעה רשמית הנשלחת למרכז ההתראות ולתיבת הדוא"ל של המשתמשים הנבחרים.
            </p>

            {broadcastSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                הודעת התפוצה שודרה בהצלחה לכלל הנמענים!
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    קהל היעד:
                  </label>
                  <select
                    value={broadcastGroup}
                    onChange={(e) => setBroadcastGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="כלל המשתמשים בפורום">כלל המשתמשים בפורום</option>
                    <option value="תומכים טופ ומפתחים">תומכים טופ ומפתחים בלבד</option>
                    <option value="מנהלים ומפקחים">מנהלים ומפקחים בלבד</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    נושא ההודעה:
                  </label>
                  <input
                    type="text"
                    required
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder="למשל: עדכון אבטחה חשוב והשקת מודול API חדש"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  תוכן ההודעה:
                </label>
                <textarea
                  rows={3}
                  required
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  placeholder="כתוב כאן את גוף ההודעה הנשלחת..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>שגר הודעת תפוצה</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. WEBHOOKS & API INTEGRATIONS */}
      {subTab === 'webhooks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Webhook className="w-4 h-4 text-rose-600" />
                אינטגרציות API ו-Webhooks בזמן אמת
              </h3>
              <p className="text-xs text-slate-500">
                שליחת התראות אוטומטיות ל-Telegram, Discord, או שרת חיצוני בעת פרסום נושא או תגובה
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewWebhookOpen(true)}
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ הגדרת Webhook חדש</span>
            </button>
          </div>

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{wh.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono uppercase">
                      {wh.targetPlatform}
                    </span>
                    {wh.isActive ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        פעיל
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        מושבת
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-500 truncate max-w-md">
                    URL: {wh.url}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>אירועים: {wh.events.join(', ')}</span>
                    {wh.lastTriggered && <span>• הופעל לאחרונה: {wh.lastTriggered}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onTestWebhook(wh.id)}
                    className="text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    בדוק פינג
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWebhook(wh.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                      wh.isActive
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {wh.isActive ? 'השבת' : 'הפעל'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteWebhook(wh.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="מחק Webhook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AUTOMATION RULES ENGINE */}
      {subTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-600" />
                מנוע כללי אוטומציה מבוסס תנאים
              </h3>
              <p className="text-xs text-slate-500">
                קידום משתמשים לפי כמות תגובות, הענקת תגים לפי מוניטין, והשעיה אוטומטית על אזהרות
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsNewRuleOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ הוספת כלל אוטומטי חדש</span>
            </button>
          </div>

          <div className="space-y-3">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rule.title}</span>
                    {rule.isActive ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        מופעל
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        כבוי
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{rule.description}</p>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    טריגר: {rule.trigger} ≥ {rule.conditionValue} ➔ פעולה: {rule.action} (
                    {rule.targetRoleOrBadge || 'ברירת מחדל'})
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onToggleRule(rule.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer ${
                      rule.isActive
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {rule.isActive ? 'כבה כלל' : 'הפעל כלל'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: New Webhook */}
      {isNewWebhookOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Webhook className="w-5 h-5 text-rose-600" />
              הגדרת Webhook חדש
            </h3>

            <form onSubmit={handleCreateWebhook} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  שם הזיהוי:
                </label>
                <input
                  type="text"
                  required
                  value={whName}
                  onChange={(e) => setWhName(e.target.value)}
                  placeholder="למשל: בוט טלגרם ערוץ עדכונים"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  פלטפורמת יעד:
                </label>
                <select
                  value={whPlatform}
                  onChange={(e) => setWhPlatform(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="telegram">Telegram Bot</option>
                  <option value="discord">Discord Channel</option>
                  <option value="custom">שרת עצמאי (Custom HTTP Endpoint)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  כתובת Webhook URL:
                </label>
                <input
                  type="url"
                  required
                  value={whUrl}
                  onChange={(e) => setWhUrl(e.target.value)}
                  placeholder="https://api.telegram.org/... או https://discord.com/api/webhooks/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-left"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewWebhookOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  שמור Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: New Rule */}
      {isNewRuleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 text-right shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              הוספת כלל אוטומטי חדש
            </h3>

            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  כותרת הכלל:
                </label>
                <input
                  type="text"
                  required
                  value={ruleTitle}
                  onChange={(e) => setRuleTitle(e.target.value)}
                  placeholder="למשל: שדרוג למשתמש VIP"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    טריגר מפעיל:
                  </label>
                  <select
                    value={ruleTrigger}
                    onChange={(e) => setRuleTrigger(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="post_count">כמות פוסטים/תגובות</option>
                    <option value="reputation_reach">נקודות מוניטין</option>
                    <option value="warning_count">כמות אזהרות</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ערך סף:
                  </label>
                  <input
                    type="number"
                    required
                    value={ruleValue}
                    onChange={(e) => setRuleValue(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  פעולה לביצוע:
                </label>
                <select
                  value={ruleAction}
                  onChange={(e) => setRuleAction(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                >
                  <option value="promote_role">שדרוג דרגת משתמש</option>
                  <option value="grant_badge">הענקת תג / Badge</option>
                  <option value="auto_temp_ban">חסימה זמנית</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  שם הדרגה / התג החדש:
                </label>
                <input
                  type="text"
                  value={ruleTarget}
                  onChange={(e) => setRuleTarget(e.target.value)}
                  placeholder="למשל: תומך טופ"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewRuleOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  שמור כלל
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
