import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { MOCK_ALERTS, subscribeAlerts } from '@garmiq/api-client';
import {
  Bell,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { readAlertIds, markAlertRead, subscriber, setSubscriber, selectedWardId } = useUserStore();

  const [phoneInput, setPhoneInput] = useState(subscriber.phone || '');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>(subscriber.channel || 'whatsapp');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput.trim() || phoneInput.length < 10) return;

    setIsSubscribing(true);
    await subscribeAlerts({
      phone: phoneInput.trim(),
      channel,
      ward_id: selectedWardId,
      consent: true
    });
    setSubscriber({
      phone: phoneInput.trim(),
      channel,
      active: true
    });
    setIsSubscribing(false);
    setSubSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EDF9] px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-[#F5F9FF] border border-[#E2EDF9] flex items-center justify-center text-[#102A4C]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#102A4C]">
              {t('alerts.title', 'Heat Warnings & Alerts')}
            </h1>
            <p className="text-[11px] text-[#5B708B]">
              {t('alerts.subtitle', 'Official advisories issued by Municipal Disaster Management')}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* WhatsApp Alert Subscription Card */}
        <div className="bg-linear-to-br from-[#0866D9] to-[#043E8F] text-white rounded-3xl p-5 shadow-elevated">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
              Direct Heat Warning
            </span>
          </div>

          <h3 className="text-sm font-bold text-white mb-1">
            {t('alerts.subscribeCta', 'Get Instant WhatsApp / SMS Heat Alerts')}
          </h3>
          <p className="text-xs text-blue-100 mb-3 leading-relaxed">
            {t('alerts.subscribeDesc', 'Instant emergency alerts for your ward delivered to your phone.')}
          </p>

          {subSuccess ? (
            <div className="p-3 bg-emerald-500/20 border border-emerald-300 rounded-2xl flex items-center gap-2 text-xs font-semibold text-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Subscribed to {channel.toUpperCase()} warnings on {phoneInput}!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  className="flex-1 py-2 px-3 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={isSubscribing || phoneInput.length < 10}
                  className="px-4 py-2 bg-white text-[#0866D9] hover:bg-blue-50 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
                >
                  {isSubscribing ? 'Saving...' : 'Subscribe'}
                </button>
              </div>

              <div className="flex gap-3 text-[11px] text-blue-100">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === 'whatsapp'}
                    onChange={() => setChannel('whatsapp')}
                    className="accent-white"
                  />
                  <span>WhatsApp</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="channel"
                    checked={channel === 'sms'}
                    onChange={() => setChannel('sms')}
                    className="accent-white"
                  />
                  <span>SMS</span>
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Active Alerts List */}
        <div className="space-y-3">
          {MOCK_ALERTS.map((alert) => {
            const isRead = readAlertIds.includes(alert.id);
            const isCritical = alert.severity === 'HIGH' || alert.severity === 'CRITICAL';

            return (
              <div
                key={alert.id}
                onClick={() => markAlertRead(alert.id)}
                className={`bg-white rounded-3xl p-4.5 border transition-all shadow-soft cursor-pointer ${
                  isRead ? 'border-[#E2EDF9] opacity-85' : 'border-[#FED7AA] ring-1 ring-orange-300'
                }`}
              >
                {/* Alert Top Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {alert.severity} Alert
                    </span>
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    )}
                  </div>

                  <span className="text-[10px] text-[#5B708B] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.issued_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#102A4C] leading-snug mb-1">
                  {alert.title}
                </h3>
                <p className="text-xs text-[#5B708B] leading-relaxed mb-3">
                  {alert.description}
                </p>

                {/* Affected Wards */}
                <div className="mb-3">
                  <span className="text-[10px] uppercase font-bold text-[#5B708B] block mb-1">
                    Affected Wards
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.affected_wards.map((ward, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-[#F5F9FF] border border-[#D6E8FF] text-[10px] font-semibold text-[#0866D9]"
                      >
                        {ward}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#FFF8F5] border border-[#FED7AA] mb-3">
                  <span className="text-[10px] uppercase font-bold text-[#EA580C] block">
                    Action Plan
                  </span>
                  {alert.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-[#9A3412]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C] shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>

                {/* Map Link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/map');
                  }}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#0866D9] pt-2 border-t border-[#F0F4F8]"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>View Affected Zone on Map</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
