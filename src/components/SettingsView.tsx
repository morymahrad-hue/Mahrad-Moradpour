import React, { useState } from 'react';
import {
  Shield,
  Key,
  Lock,
  CreditCard,
  Calendar,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Zap,
  Globe,
  Bell,
  X,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Eye,
  EyeOff,
  PowerOff,
} from 'lucide-react';
import { useServer } from '../context/ServerContext';
import { FirewallRule } from '../types';

export const SettingsView: React.FC = () => {
  const {
    vpsStatus,
    isConnectingVPS,
    connectVPS,
    disconnectVPS,
    sshSettings,
    updateSSHPort,
    togglePasswordAuth,
    toggle2FA,
    addSSHKey,
    deleteSSHKey,
    subscription,
    toggleAutoRenew,
    extendSubscription,
    firewallRules,
    addFirewallRule,
    deleteFirewallRule,
    addToast,
  } = useServer();

  // Tab within settings
  const [settingsTab, setSettingsTab] = useState<'ssh' | 'subscription' | 'firewall' | 'alerts' | 'deploy'>('ssh');

  // VPS Connection Form State
  const [vpsHost, setVpsHost] = useState(vpsStatus.host || '');
  const [vpsPort, setVpsPort] = useState(vpsStatus.port || 22);
  const [vpsUser, setVpsUser] = useState(vpsStatus.username || 'root');
  const [vpsAuthMode, setVpsAuthMode] = useState<'password' | 'privateKey'>('password');
  const [vpsPassword, setVpsPassword] = useState('');
  const [vpsPrivateKey, setVpsPrivateKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Modals
  const [showAddKeyModal, setShowAddKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyContent, setNewKeyContent] = useState('');
  const [newKeyType, setNewKeyType] = useState('ed25519');

  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRulePort, setNewRulePort] = useState('');
  const [newRuleProto, setNewRuleProto] = useState<'tcp' | 'udp' | 'both'>('tcp');
  const [newRuleAction, setNewRuleAction] = useState<'ALLOW' | 'DENY'>('ALLOW');
  const [newRuleFrom, setNewRuleFrom] = useState('هر نقطه‌ای (Anywhere)');
  const [newRuleComment, setNewRuleComment] = useState('');

  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(30);

  const [sshPortInput, setSshPortInput] = useState(sshSettings.port);

  const bashScript = `curl -fsSL ${window.location.origin}/api/vps/install-script | bash`;

  const handleConnectVPS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vpsHost.trim()) {
      addToast('لطفاً آدرس IP سرور را وارد کنید.', 'error');
      return;
    }
    if (vpsAuthMode === 'password' && !vpsPassword) {
      addToast('لطفاً رمز عبور SSH را وارد کنید.', 'error');
      return;
    }
    if (vpsAuthMode === 'privateKey' && !vpsPrivateKey.trim()) {
      addToast('لطفاً کلید خصوصی SSH را وارد کنید.', 'error');
      return;
    }

    await connectVPS({
      host: vpsHost.trim(),
      port: Number(vpsPort) || 22,
      username: vpsUser.trim() || 'root',
      password: vpsAuthMode === 'password' ? vpsPassword : undefined,
      privateKey: vpsAuthMode === 'privateKey' ? vpsPrivateKey : undefined,
    });
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(bashScript);
    setCopiedScript(true);
    addToast('اسکریپت در کلیپ‌بورد کپی شد.', 'info');
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleSavePort = (e: React.FormEvent) => {
    e.preventDefault();
    updateSSHPort(Number(sshPortInput));
  };

  const handleAddKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    addSSHKey(newKeyName.trim(), newKeyType);
    setNewKeyName('');
    setNewKeyContent('');
    setShowAddKeyModal(false);
  };

  const handleAddRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRulePort.trim()) return;
    addFirewallRule({
      port: newRulePort.trim(),
      protocol: newRuleProto,
      action: newRuleAction,
      from: newRuleFrom.trim() || 'Anywhere',
      comment: newRuleComment.trim() || 'قانون سفارشی',
    });
    setNewRulePort('');
    setNewRuleComment('');
    setShowAddRuleModal(false);
  };

  const handleExtendSubmit = () => {
    extendSubscription(extendDays);
    setShowExtendModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setSettingsTab('ssh')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            settingsTab === 'ssh'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5" />
          <span>اتصال سرور اوبونتو و SSH</span>
        </button>

        <button
          onClick={() => setSettingsTab('subscription')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            settingsTab === 'subscription'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>اطلاعات سرور و تاریخ انقضا</span>
        </button>

        <button
          onClick={() => setSettingsTab('firewall')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            settingsTab === 'firewall'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>دیواره آتش (UFW Firewall)</span>
        </button>

        <button
          onClick={() => setSettingsTab('alerts')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            settingsTab === 'alerts'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>اعلان‌ها و هشدارها</span>
        </button>

        <button
          onClick={() => setSettingsTab('deploy')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
            settingsTab === 'deploy'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-amber-300">دپلوی خودکار (GitHub + Railway)</span>
        </button>
      </div>

      {/* TAB 1: Real SSH VPS Connection & Security */}
      {settingsTab === 'ssh' && (
        <div className="space-y-5">
          {/* Section 1: Real VPS Connection Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl border ${
                    vpsStatus.isConnected
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                  }`}
                >
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>اتصال مستقیم به سرور مجازی اوبونتو (Cloud VPS)</span>
                    {vpsStatus.isConnected ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        متصل
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                        قطع اتصال
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    اتصال از طریق درگاه امن SSH و کتابخانه بومی لینوکس برای اجرای مستقل و ۲۴ ساعته برنامه‌ها روی سرور ابری.
                  </p>
                </div>
              </div>

              {vpsStatus.isConnected && (
                <button
                  onClick={disconnectVPS}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
                >
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>قطع اتصال سرور</span>
                </button>
              )}
            </div>

            {/* If Connected: Display Live Host Info Box */}
            {vpsStatus.isConnected ? (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3 mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-0.5">آدرس IP میزبان (Host):</span>
                    <span className="font-mono text-cyan-300 font-bold text-sm">{vpsStatus.host}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-0.5">پورت و نام کاربری:</span>
                    <span className="font-mono text-white font-bold text-sm">
                      {vpsStatus.username} (پورت {vpsStatus.port})
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-0.5">سیستم‌عامل و هسته:</span>
                    <span className="font-mono text-slate-200 text-xs truncate block">{vpsStatus.osInfo || 'Ubuntu 22.04.5 LTS'}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block mb-0.5">آپ‌تایم سرور:</span>
                    <span className="font-mono text-emerald-400 font-bold text-sm">{vpsStatus.uptime || '۲۴ روز و ۷ ساعت'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-emerald-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      سرور اوبونتو متصل و در وضعیت پایدار قرار دارد. فرامین خط فرمان ترمینال و سرویس ربات بله مستقیماً بر روی این ماشین ابری اجرا می‌شوند.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 shrink-0">
                    Engine: Live Ubuntu Daemon
                  </span>
                </div>
              </div>
            ) : (
              /* If Disconnected: Quick connect card + SSH Connection Form */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>اتصال فوری به سرور اختصاصی ابری اوبونتو ۲۲.۰۴ (آماده به کار)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                      سرور واقعی اوبونتو با دسترسی کامل خط فرمان، پایتون ۳، نود‌جی‌اس و پشتیبانی از Systemd جهت اجرای مستقل ۲۴ ساعته.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => connectVPS({ useDefaultCloud: true })}
                    disabled={isConnectingVPS}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اتصال فوری سرور اوبونتو</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 my-2">
                  <div className="h-px bg-slate-800 flex-1" />
                  <span className="text-[11px] text-slate-500 font-medium">یا اتصال به سرور مجازی شخصی دیگر (SSH)</span>
                  <div className="h-px bg-slate-800 flex-1" />
                </div>

                <form onSubmit={handleConnectVPS} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      آدرس IP یا دامنه سرور اوبونتو (VPS Host):
                    </label>
                    <input
                      type="text"
                      value={vpsHost}
                      onChange={(e) => setVpsHost(e.target.value)}
                      placeholder="مثال: 185.190.142.88 یا vps.mycompany.ir"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      پورت SSH (پیش‌فرض ۲۲):
                    </label>
                    <input
                      type="number"
                      value={vpsPort}
                      onChange={(e) => setVpsPort(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-hidden focus:border-cyan-500"
                      min={1}
                      max={65535}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      نام کاربری لینوکس (Username):
                    </label>
                    <input
                      type="text"
                      value={vpsUser}
                      onChange={(e) => setVpsUser(e.target.value)}
                      placeholder="root یا ubuntu"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      روش احراز هویت (Authentication):
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setVpsAuthMode('password')}
                        className={`py-2 px-3 rounded-lg border font-medium transition-colors cursor-pointer ${
                          vpsAuthMode === 'password'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        رمز عبور (Password)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVpsAuthMode('privateKey')}
                        className={`py-2 px-3 rounded-lg border font-medium transition-colors cursor-pointer ${
                          vpsAuthMode === 'privateKey'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-950 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        کلید خصوصی (SSH Key)
                      </button>
                    </div>
                  </div>
                </div>

                {vpsAuthMode === 'password' ? (
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      رمز عبور کاربر سرور (SSH Password):
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={vpsPassword}
                        onChange={(e) => setVpsPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">
                      محتوای کلید خصوصی OpenSSH (-----BEGIN OPENSSH PRIVATE KEY-----):
                    </label>
                    <textarea
                      value={vpsPrivateKey}
                      onChange={(e) => setVpsPrivateKey(e.target.value)}
                      rows={4}
                      placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;MIIEowIBAAKCAQEA...&#10;-----END RSA PRIVATE KEY-----"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-white font-mono focus:outline-hidden focus:border-cyan-500"
                      required
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      امنیت تضمین شده: مشخصات اتصال صرفاً در حافظه رم سرور Express نگهداری شده و هرگز در فرانت‌اند یا لاگ‌های مرورگر افشا نمی‌شود.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isConnectingVPS}
                    className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {isConnectingVPS ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>در حال برقراری اتصال SSH...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>برقراری اتصال امن SSH به سرور اوبونتو</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

            {/* Quick Setup script */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-200 block">اسکریپت خودکار راه‌اندازی سرور اوبونتو:</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {bashScript}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyScript}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium cursor-pointer shrink-0"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>کپی تک‌خط نصب</span>
              </button>
            </div>
          </div>

          {/* Section 2: Port & Security Switches */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold text-white mb-3">پیکربندی پیشرفته سرویس OpenSSH سرور</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Change Port */}
              <form onSubmit={handleSavePort} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <label className="block text-xs text-slate-300 font-medium">پورت اختصاصی SSH سرور:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={sshPortInput}
                    onChange={(e) => setSshPortInput(Number(e.target.value))}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-hidden focus:border-cyan-500"
                    min={1}
                    max={65535}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
                  >
                    ذخیره پورت
                  </button>
                </div>
              </form>

              {/* Security Switches */}
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">ورود با رمز عبور (Password Auth)</span>
                    <span className="text-[11px] text-slate-400">غیرفعال‌سازی جهت اجبار به استفاده از کلید SSH</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sshSettings.passwordAuthEnabled}
                      onChange={togglePasswordAuth}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600" />
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-white block">احراز هویت ۲ مرحله‌ای (2FA)</span>
                    <span className="text-[11px] text-slate-400">پشتیبانی از Google Authenticator OTP</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sshSettings.twoFactorEnabled}
                      onChange={toggle2FA}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                  </label>
                </div>
              </div>
            </div>

            {/* Public Keys Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">کلیدهای عمومی مجاز (Authorized Keys)</span>
                <button
                  onClick={() => setShowAddKeyModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن کلید SSH</span>
                </button>
              </div>

              <div className="space-y-2">
                {sshSettings.activeKeys.map((k) => (
                  <div
                    key={k.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{k.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Fingerprint: {k.fingerprint} ({k.type}) · افزوده شده: {k.createdAt}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteSSHKey(k.id)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="حذف کلید"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Server Subscription */}
      {settingsTab === 'subscription' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">{subscription.planName}</h3>
                </div>
                <p className="text-xs text-slate-400">
                  اطلاعات صورتحساب، تاریخ انقضای سرویس و سهمیه پهنای باند سرور مجازی.
                </p>
              </div>

              <button
                onClick={() => setShowExtendModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>تمدید اشتراک سرور</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">تاریخ انقضا (تقویم شمسی):</span>
                <span className="text-sm font-bold text-white font-mono">{subscription.expiresAtShamsi}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">تاریخ انقضا (میلادی):</span>
                <span className="text-sm font-bold text-white font-mono">{subscription.expiresAtGregorian}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">روزهای باقی‌مانده:</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {subscription.daysRemaining} روز
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">هزینه تمدید ماهانه:</span>
                <span className="text-sm font-bold text-white">
                  {subscription.costMonthlyToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">موقعیت دیتاسنتر:</span>
                <span className="text-sm font-bold text-white">
                  {subscription.datacenterFlag} {subscription.datacenter}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">آدرس‌های IP:</span>
                <span className="text-xs font-bold text-cyan-300 font-mono block">
                  {vpsStatus.isConnected ? vpsStatus.host : subscription.ipAddress}
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate block">{subscription.ipv6Address}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 mb-5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">سهمیه ترافیک ماهانه سرور:</span>
                <span className="font-mono text-cyan-300">
                  {subscription.bandwidthUsedGB} گیگابایت مصرفی از {subscription.bandwidthTotalGB} گیگابایت (
                  {Math.round((subscription.bandwidthUsedGB / subscription.bandwidthTotalGB) * 100)}%)
                </span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{
                    width: `${(subscription.bandwidthUsedGB / subscription.bandwidthTotalGB) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">تمدید خودکار سرویس (Auto-Renew)</span>
                <span className="text-[11px] text-slate-400">
                  در صورت فعال بودن، ۳ روز قبل از انقضا فاکتور به شکل خودکار تسویه می‌شود.
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscription.autoRenew}
                  onChange={toggleAutoRenew}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Firewall UFW */}
      {settingsTab === 'firewall' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">قوانین دیواره آتش (UFW Firewall)</h3>
                <p className="text-xs text-slate-400">
                  فیلتر ترافیک ورودی و پورت‌های مجاز (Allow / Deny) بر روی سرور.
                </p>
              </div>

              <button
                onClick={() => setShowAddRuleModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>افزودن قانون فایروال</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">شماره پورت</th>
                    <th className="py-2.5 px-3">پروتکل</th>
                    <th className="py-2.5 px-3">وضعیت (Action)</th>
                    <th className="py-2.5 px-3">مبدأ ترافیک (From)</th>
                    <th className="py-2.5 px-3">توضیحات</th>
                    <th className="py-2.5 px-3 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {firewallRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">{rule.port}</td>
                      <td className="py-2.5 px-3 text-slate-400 uppercase">{rule.protocol}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rule.action === 'ALLOW'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {rule.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{rule.from}</td>
                      <td className="py-2.5 px-3 text-slate-400 font-sans">{rule.comment}</td>
                      <td className="py-2.5 px-3 text-left">
                        <button
                          onClick={() => deleteFirewallRule(rule.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                          title="حذف قانون"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Alerts */}
      {settingsTab === 'alerts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white mb-1">کانال‌های اطلاع‌رسانی و هشدارهای سرور</h3>
          <p className="text-xs text-slate-400 mb-4">
            تنظیم وب‌هوک و دریافت هشدارهای قطعی یا مصرف بحرانی منابع سرور.
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">ربات هشدار تلگرام و بله (Alert Bot)</span>
                <span className="text-[11px] text-slate-400">ارسال فوری نوتیفیکیشن در صورت آفلاین شدن یا پر شدن دیسک</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                فعال
              </span>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">پیامک بحرانی (SMS Gateway)</span>
                <span className="text-[11px] text-slate-400">ارسال پیامک در صورتی که مصرف CPU بیش از ۹۰ درصد بماند</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                فعال
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Automated GitHub & Railway CI/CD Deployment */}
      {settingsTab === 'deploy' && (
        <div className="space-y-5">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-base font-black text-amber-200">
                اتصال و دپلوی خودکار با GitHub Actions و Railway
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
              پایپ‌لاین اختصاصی CI/CD برای پروژه شما در مسیر <code className="text-amber-300 font-mono">.github/workflows/deploy.yml</code> و فایل <code className="text-amber-300 font-mono">Dockerfile</code> آماده شده است. با اتصال به گیت‌هاب، هر بار که دستور git push را اجرا کنید، پروژه به صورت اتوماتیک تست، کامپایل و دپلوی می‌شود.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono block">۱. مخزن گیت‌هاب</span>
                <span className="text-xs font-bold text-white">اتصال به GitHub</span>
                <p className="text-[11px] text-zinc-400">فایل‌های کد را در ریپازیتوری شخصی خود Push کنید.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono block">۲. پلتفرم ابری Railway</span>
                <span className="text-xs font-bold text-white">اتصال New Project</span>
                <p className="text-[11px] text-zinc-400">در Railway ریپازیتوری را متصل کرده و دامنه رایگان بگیرید.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono block">۳. دپلوی خودکار (CD)</span>
                <span className="text-xs font-bold text-white">Zero Downtime</span>
                <p className="text-[11px] text-zinc-400">با هر Commit جدید، برنامه ظرف چند ثانیه آنلاین آپدیت می‌شود.</p>
              </div>
            </div>

            {/* Quick Git Commands Box */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-zinc-400 text-[11px] pb-1 border-b border-zinc-800">
                <span>دستورات سریع ترمینال جهت ارسال به گیت‌هاب:</span>
                <span className="text-amber-400">Git Terminal</span>
              </div>
              <div className="text-emerald-400">
                git init<br />
                git add .<br />
                git commit -m "feat: MAHI JOOVOON VPN Platform"<br />
                git branch -M main<br />
                git remote add origin https://github.com/YOUR_USERNAME/mahi-joovoon.git<br />
                git push -u origin main
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Add SSH Key Modal */}
      {showAddKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddKeySubmit}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl text-right animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-white mb-3">افزودن کلید عمومی SSH</h3>
            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block text-slate-300 mb-1">عنوان کلید:</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="MacBook Pro Developer"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">نوع کلید:</label>
                <select
                  value={newKeyType}
                  onChange={(e) => setNewKeyType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                >
                  <option value="ed25519">Ed25519 (پیشنهادی و امن)</option>
                  <option value="rsa-4096">RSA 4096-bit</option>
                  <option value="ecdsa">ECDSA 521</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">محتوای کلید عمومی (ssh-ed25519 AAAAC3NzaC...):</label>
                <textarea
                  value={newKeyContent}
                  onChange={(e) => setNewKeyContent(e.target.value)}
                  rows={3}
                  placeholder="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-[11px] focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddKeyModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white cursor-pointer"
              >
                افزودن کلید
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Firewall Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <form
            onSubmit={handleAddRuleSubmit}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl text-right animate-in fade-in"
          >
            <h3 className="text-sm font-bold text-white mb-3">افزودن قانون فایروال (UFW)</h3>
            <div className="space-y-3 text-xs mb-4">
              <div>
                <label className="block text-slate-300 mb-1">شماره پورت:</label>
                <input
                  type="text"
                  value={newRulePort}
                  onChange={(e) => setNewRulePort(e.target.value)}
                  placeholder="مثال: 8443 یا 8080"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-hidden focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">پروتکل:</label>
                  <select
                    value={newRuleProto}
                    onChange={(e) => setNewRuleProto(e.target.value as 'tcp' | 'udp' | 'both')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="tcp">TCP</option>
                    <option value="udp">UDP</option>
                    <option value="both">Both (هر دو)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">عملیات (Action):</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value as 'ALLOW' | 'DENY')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                  >
                    <option value="ALLOW">ALLOW (مجاز)</option>
                    <option value="DENY">DENY (مسدود)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">توضیح کوتاه:</label>
                <input
                  type="text"
                  value={newRuleComment}
                  onChange={(e) => setNewRuleComment(e.target.value)}
                  placeholder="مثال: پورت وب‌هوک بله"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddRuleModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white cursor-pointer"
              >
                ثبت قانون فایروال
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Extend Subscription Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 max-w-sm w-full shadow-2xl text-right animate-in fade-in">
            <h3 className="text-sm font-bold text-white mb-2">تمدید اعتبار سرور مجازی</h3>
            <p className="text-xs text-slate-400 mb-4">
              مدت زمان مورد نظر را برای تمدید انتخاب کنید:
            </p>

            <div className="space-y-2 mb-5">
              {[
                { days: 30, title: '۱ ماهه (۳۰ روز)', price: '۴۵۰,۰۰۰ تومان' },
                { days: 90, title: '۳ ماهه (۹۰ روز)', price: '۱,۲۱۵,۰۰۰ تومان (۱۰٪ تخفیف)' },
                { days: 365, title: '۱ ساله (۳۶۵ روز)', price: '۴,۳۲۰,۰۰۰ تومان (۲۰٪ تخفیف)' },
              ].map((item) => (
                <div
                  key={item.days}
                  onClick={() => setExtendDays(item.days)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                    extendDays === item.days
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-bold">{item.title}</span>
                  <span className="text-[11px] text-slate-400">{item.price}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowExtendModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 cursor-pointer"
              >
                انصراف
              </button>
              <button
                onClick={handleExtendSubmit}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
              >
                پرداخت و تمدید فوری
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
