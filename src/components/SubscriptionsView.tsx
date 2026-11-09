import React, { useState } from 'react';
import {
  Repeat,
  Copy,
  Check,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Shield,
  Layers,
  RefreshCw,
  Clock,
  Sparkles,
  Server,
  Zap,
} from 'lucide-react';
import QRCode from 'qrcode';
import { useServer } from '../context/ServerContext';
import { VPNUser } from '../types';

export const SubscriptionsView: React.FC = () => {
  const { vpnUsers, vpnConfigs, addToast, language, setActiveTab } = useServer();
  const isFa = language === 'fa';

  const [selectedUserId, setSelectedUserId] = useState<string>(vpnUsers[0]?.id || '');
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const selectedUser = vpnUsers.find((u) => u.id === selectedUserId) || vpnUsers[0];
  const userConfigs = vpnConfigs.filter((c) => c.userId === selectedUser?.id || c.username === selectedUser?.username);

  const subscriptionFullUrl = selectedUser
    ? `${window.location.origin}${selectedUser.subscriptionUrl}`
    : '';

  // Generate QR for Subscription
  React.useEffect(() => {
    if (!subscriptionFullUrl) return;
    QRCode.toDataURL(subscriptionFullUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then(setQrCodeUrl)
      .catch(console.warn);
  }, [subscriptionFullUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(subscriptionFullUrl);
    setCopiedLink(true);
    addToast(isFa ? 'لینک اشتراک هوشمند کپی شد!' : 'Subscription URL copied!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const percent = selectedUser
    ? Math.min(100, Math.round((selectedUser.dataUsedGB / selectedUser.dataLimitGB) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 font-bold text-xs border border-amber-400/30 font-mono">
              UNIVERSAL SUBSCRIPTION FEED
            </span>
          </div>
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
            {isFa ? 'سیستم اشتراک هوشمند و لینک یکپارچه (Subscription)' : 'Smart Subscription Feed Engine'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {isFa
              ? 'تولید لینک یکپارچه رمزنگاری شده Base64 برای هر کاربر. با یکبار وارد کردن لینک در کلاینت‌های V2rayNG, Sing-box, Clash یا v2rayN، تمامی کانفیگ‌ها به صورت خودکار دانلود، همگام‌سازی و با تعویض سرور بدون نیاز به مداخله کاربر به‌روزرسانی می‌شوند.'
              : 'End-to-end encrypted Base64 dynamic subscription feed for automatic server switching and real-time quota synchronization.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('vpn-generator')}
          className="px-4 py-2 rounded-xl gold-gradient text-black font-bold text-xs flex items-center gap-2 shrink-0 shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>{isFa ? 'تولید کانفیگ برای کاربر' : 'Generate Config'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Picker & Subscription Detail (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-950 border border-amber-500/20 rounded-2xl p-5 shadow-xl space-y-5">
          {/* User selector */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1.5">
              {isFa ? 'انتخاب کاربر جهت مشاهده و صدور لینک سابسکریپشن:' : 'Select Customer:'}
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-hidden focus:border-amber-400 font-medium"
            >
              {vpnUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} (@{u.username}) · سقف حجم: {u.dataLimitGB}GB · وضعیت: {u.status}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <>
              {/* User Subscription Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-950 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full gold-gradient text-black font-bold flex items-center justify-center text-xs">
                      {selectedUser.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedUser.fullName}</h4>
                      <span className="text-[11px] text-amber-300 font-mono">@{selectedUser.username}</span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    {selectedUser.status === 'active' ? 'اشتراک فعال' : 'اشتراک غیرفعال'}
                  </span>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400 font-mono">
                    <span>مصرف کل ترافیک:</span>
                    <span className="text-white font-bold">
                      {selectedUser.dataUsedGB} / {selectedUser.dataLimitGB} GB ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percent > 85 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-400 to-yellow-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 text-zinc-400">
                  <div>انقضا: <span className="text-zinc-200">{selectedUser.expiresAt}</span></div>
                  <div>دستگاه‌ها: <span className="text-zinc-200">{selectedUser.connectedDevices}/{selectedUser.maxDevices} مجاز</span></div>
                </div>
              </div>

              {/* Subscription Link Direct Box */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  {isFa ? 'لینک اشتراک امن اختصاصی کاربر (Sub URL):' : 'Encrypted Subscription Feed Link:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={subscriptionFullUrl}
                    className="w-full pl-24 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-amber-500/30 text-xs text-amber-300 font-mono"
                  />
                  <button
                    onClick={handleCopy}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg gold-gradient text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? (isFa ? 'کپی شد' : 'Copied') : (isFa ? 'کپی لینک' : 'Copy')}</span>
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">
                  * کلاینت به صورت اتوماتیک متادیتای حجم باقیمانده و تاریخ انقضا را در هدرهای Subscription دریافت می‌نماید.
                </p>
              </div>

              {/* Subscribed Configs List */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300">کانفیگ‌های فعال درون این اشتراک:</span>
                  <span className="text-amber-400 font-mono">{userConfigs.length} کانفیگ متصل</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {userConfigs.map((c) => (
                    <div
                      key={c.id}
                      className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 uppercase">
                          {c.protocol}
                        </span>
                        <span className="font-medium text-white truncate max-w-[200px]">{c.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">{c.serverName}</span>
                    </div>
                  ))}

                  {userConfigs.length === 0 && (
                    <p className="text-xs text-zinc-500 p-3 text-center bg-zinc-900/40 rounded-xl">
                      کانفیگ اختصاصی ساخته نشده؛ اشتراک از گره‌های هوشمند پیش‌فرض آلمان و فنلاند استفاده خواهد کرد.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* QR Code and Client Import Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-5 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{isFa ? 'اسکن بارکد QR سابسکریپشن' : 'Scan Subscription QR'}</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Auto-Update</span>
            </div>

            {qrCodeUrl && (
              <div className="p-3 bg-white rounded-xl inline-block mx-auto shadow-inner">
                <img src={qrCodeUrl} alt="Subscription QR" className="w-48 h-48 object-contain" />
              </div>
            )}

            <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-right text-xs space-y-2">
              <span className="font-bold text-amber-300 block">نحوه اتصال در برنامه‌ها:</span>
              <ul className="text-[11px] text-zinc-400 space-y-1 list-disc list-inside leading-relaxed">
                <li><strong className="text-zinc-200">اندروید (V2rayNG):</strong> کلیک بر روی + و انتخاب «افزودن اشتراک جدید» و چسباندن لینک.</li>
                <li><strong className="text-zinc-200">آیفون (Streisand / FoXray):</strong> رفتن به تب Subscription و افزودن لینک ساب.</li>
                <li><strong className="text-zinc-200">ویندوز (v2rayN):</strong> انتخاب منوی Subscription Groups و فشردن Update.</li>
              </ul>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl gold-gradient text-black font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>کپی لینک اشتراک</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
