import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../stores/useUserStore';
import { getActiveAlerts, subscribeAlerts } from '@garmiq/api-client';
import {
  Bell,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Smartphone,
  Check,
  Flame,
  Radio
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { readAlertIds, markAlertRead, subscriber, setSubscriber, selectedWardId } = useUserStore();

  // Filter: 'all' | 'high' | 'moderate'
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'moderate'>('all');

  // WhatsApp/SMS Subscription state
  const [phoneInput, setPhoneInput] = useState(subscriber.phone || '');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>(subscriber.channel || 'whatsapp');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showSubEditor, setShowSubEditor] = useState(!subscriber.active);
  const [subFeedback, setSubFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    subscriber.active
      ? {
          type: 'success',
          message: `Active alerts sent to +91 ${subscriber.phone} via ${subscriber.channel.toUpperCase()}`
        }
      : null
  );

  // Expanded state for long action plans & ward chips
  const [expandedAlertIds, setExpandedAlertIds] = useState<string[]>([]);
  const [expandedWardAlertIds, setExpandedWardAlertIds] = useState<string[]>([]);

  // Query active alerts
  const {
    data: alerts = [],
    isLoading,
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['active-alerts'],
    queryFn: getActiveAlerts
  });

  const toggleExpandActionPlan = (alertId: string) => {
    setExpandedAlertIds((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );
  };

  const toggleExpandWards = (alertId: string) => {
    setExpandedWardAlertIds((prev) =>
      prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]
    );
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phoneInput.replace(/\D/g, '');

    // Validate 10-digit Indian mobile number
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setSubFeedback({
        type: 'error',
        message: 'Enter a valid 10-digit Indian mobile number starting with 6-9.'
      });
      return;
    }

    setIsSubscribing(true);
    setSubFeedback(null);

    try {
      const res = await subscribeAlerts({
        phone: cleanPhone,
        channel,
        ward_id: selectedWardId,
        consent: true
      });

      setSubscriber({
        phone: cleanPhone,
        channel,
        active: true
      });

      setShowSubEditor(false);
      setSubFeedback({
        type: 'success',
        message: res.message || `Subscribed! Alerts will be sent via ${channel.toUpperCase()} to +91 ${cleanPhone}.`
      });
    } catch {
      setSubFeedback({
        type: 'error',
        message: 'Could not connect to subscription service. Please retry.'
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const getSeverityMeta = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return {
          cardBorder: 'border-l-[#E5484D]',
          badge: 'bg-[#FEF3ED] text-[#E5484D] border-[#FADCD5]',
          dot: 'bg-[#E5484D]',
          icon: AlertTriangle,
          label: 'High Heatwave Alert'
        };
      case 'MEDIUM':
      case 'MODERATE':
        return {
          cardBorder: 'border-l-[#F3B43F]',
          badge: 'bg-[#FEF9EE] text-[#B87000] border-[#FEEAC2]',
          dot: 'bg-[#F3B43F]',
          icon: AlertCircle,
          label: 'Moderate Advisory'
        };
      case 'LOW':
      default:
        return {
          cardBorder: 'border-l-[#36B878]',
          badge: 'bg-[#EBFBF3] text-[#1E7E4D] border-[#B7EDCE]',
          dot: 'bg-[#36B878]',
          icon: ShieldCheck,
          label: 'Low Risk Watch'
        };
    }
  };

  const filteredAlerts = useMemo(() => {
    if (filterSeverity === 'all') return alerts;
    if (filterSeverity === 'high') {
      return alerts.filter((a) => ['HIGH', 'CRITICAL'].includes(a.severity.toUpperCase()));
    }
    if (filterSeverity === 'moderate') {
      return alerts.filter((a) => ['MEDIUM', 'MODERATE', 'LOW'].includes(a.severity.toUpperCase()));
    }
    return alerts;
  }, [alerts, filterSeverity]);

  const highCount = alerts.filter((a) => ['HIGH', 'CRITICAL'].includes(a.severity.toUpperCase())).length;
  const modCount = alerts.filter((a) => ['MEDIUM', 'MODERATE', 'LOW'].includes(a.severity.toUpperCase())).length;

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24">
      {/* 1. Clean App Header (No back button on primary bottom tab) */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E2EAF4] px-4 py-3.5 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#173153] tracking-tight">
                Heat Warnings & Alerts
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EBFBF3] text-[#1E7E4D] border border-[#B7EDCE]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36B878] animate-pulse" />
                Live PMC
              </span>
            </div>
            <p className="text-[11px] text-[#71829A] mt-0.5">
              Official advisories issued by Municipal Disaster Management
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="w-8 h-8 rounded-xl bg-[#F5F8FC] border border-[#E2EAF4] flex items-center justify-center text-[#556987] hover:text-[#1769E0] hover:bg-[#EEF5FE] transition-colors active:scale-95 disabled:opacity-50"
            title="Refresh alerts"
            aria-label="Refresh alerts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#1769E0]' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* 2. Redesigned Clean WhatsApp & SMS Subscription Card */}
        <section className="bg-white rounded-2xl p-4 border border-[#E2EAF4] shadow-[0_2px_8px_rgba(23,49,83,0.04)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EEF5FE] text-[#1769E0] flex items-center justify-center shrink-0 border border-[#D7E7FD]">
                <Bell className="w-4 h-4 text-[#1769E0]" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#173153]">
                  Get WhatsApp Heat Alerts
                </h2>
                <p className="text-[11px] text-[#71829A]">
                  Receive heat warnings for your selected ward.
                </p>
              </div>
            </div>

            {subscriber.active && !showSubEditor && (
              <button
                onClick={() => setShowSubEditor(true)}
                className="text-[11px] font-bold text-[#1769E0] hover:underline"
              >
                Change
              </button>
            )}
          </div>

          {/* Active Subscription Status Banner */}
          {subscriber.active && !showSubEditor ? (
            <div className="mt-2.5 p-2.5 bg-[#EBFBF3] border border-[#B7EDCE] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#1E7E4D] font-semibold text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-[#36B878] shrink-0" />
                <span>Subscribed on +91 {subscriber.phone} ({subscriber.channel.toUpperCase()})</span>
              </div>
              <span className="text-[10px] text-[#1E7E4D] bg-white px-2 py-0.5 rounded-md font-bold border border-[#B7EDCE]">
                Active
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-3 space-y-2.5">
              {/* Delivery channel toggle pills (No ugly native radio buttons) */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#71829A] uppercase tracking-wider">
                  Delivery Channel:
                </span>
                <div className="inline-flex p-0.5 bg-[#F5F8FC] border border-[#E2EAF4] rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all text-[11px] font-bold ${
                      channel === 'whatsapp'
                        ? 'bg-[#1769E0] text-white shadow-xs'
                        : 'text-[#556987] hover:text-[#173153]'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all text-[11px] font-bold ${
                      channel === 'sms'
                        ? 'bg-[#1769E0] text-white shadow-xs'
                        : 'text-[#556987] hover:text-[#173153]'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>SMS</span>
                  </button>
                </div>
              </div>

              {/* Single Unified Input Group with +91 and Subscribe Button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-[#173153] select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number"
                    className="w-full pl-11 pr-3 py-2 bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl text-xs font-bold text-[#173153] placeholder:text-[#94A3B8] placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#1769E0] focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubscribing || phoneInput.length < 10}
                  className="px-4 py-2 bg-[#1769E0] hover:bg-[#0E52BE] disabled:bg-[#B6D6FC] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {/* Feedback banner */}
              {subFeedback && (
                <div
                  className={`p-2.5 rounded-xl flex items-start gap-2 text-xs font-medium ${
                    subFeedback.type === 'success'
                      ? 'bg-[#EBFBF3] text-[#1E7E4D] border border-[#B7EDCE]'
                      : 'bg-[#FDF0F1] text-[#A81F26] border border-[#F9C3C6]'
                  }`}
                >
                  {subFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#36B878] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-[#E5484D] shrink-0 mt-0.5" />
                  )}
                  <span className="text-[11px] leading-snug">{subFeedback.message}</span>
                </div>
              )}
            </form>
          )}
        </section>

        {/* 3. Section Title & Filter Tabs */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#173153] uppercase tracking-wider flex items-center gap-1.5">
              <span>Active Heat Warnings</span>
              <span className="text-[11px] font-bold text-white bg-[#173153] px-1.5 py-0.2 rounded-full">
                {alerts.length}
              </span>
            </span>
            <span className="text-[11px] text-[#71829A] font-medium">
              Pune Municipal Corporation
            </span>
          </div>

          {/* Clean Segmented Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === 'all'
                  ? 'bg-[#173153] text-white shadow-xs'
                  : 'bg-white text-[#556987] border border-[#E2EAF4] hover:bg-[#F5F8FC]'
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilterSeverity('high')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === 'high'
                  ? 'bg-[#E5484D] text-white shadow-xs'
                  : 'bg-white text-[#E5484D] border border-[#FADCD5] hover:bg-[#FEF3ED]'
              }`}
            >
              High ({highCount})
            </button>
            <button
              onClick={() => setFilterSeverity('moderate')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                filterSeverity === 'moderate'
                  ? 'bg-[#B87000] text-white shadow-xs'
                  : 'bg-white text-[#B87000] border border-[#FEEAC2] hover:bg-[#FEF9EE]'
              }`}
            >
              Moderate ({modCount})
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4.5 border border-[#E2EAF4] animate-pulse space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-[#E2EAF4] rounded-md w-28" />
                  <div className="h-3 bg-[#E2EAF4] rounded-md w-16" />
                </div>
                <div className="h-5 bg-[#E2EAF4] rounded-md w-3/4" />
                <div className="h-10 bg-[#F5F8FC] rounded-xl w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-white rounded-2xl p-5 border border-rose-200 text-center space-y-2.5">
            <AlertCircle className="w-8 h-8 text-[#E5484D] mx-auto" />
            <h3 className="text-xs font-bold text-[#173153]">Unable to load active warnings</h3>
            <p className="text-[11px] text-[#71829A]">
              Could not connect to the municipal disaster management feed.
            </p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1769E0] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty filtered state */}
        {!isLoading && !isError && filteredAlerts.length === 0 && (
          <div className="bg-white rounded-2xl p-7 border border-[#E2EAF4] text-center space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EBFBF3] text-[#36B878] flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h3 className="text-xs font-bold text-[#173153]">
              No Active Warnings in This Category
            </h3>
            <p className="text-[11px] text-[#71829A] max-w-xs mx-auto leading-relaxed">
              {filterSeverity === 'all'
                ? 'Temperatures in Pune are currently within normal baseline thresholds.'
                : 'No alerts match the selected priority filter.'}
            </p>
          </div>
        )}

        {/* 4. Active Alert Cards List */}
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isRead = readAlertIds.includes(alert.id);
            const severityMeta = getSeverityMeta(alert.severity);
            const isActionPlanExpanded = expandedAlertIds.includes(alert.id);
            const isWardsExpanded = expandedWardAlertIds.includes(alert.id);

            const displayedWards = isWardsExpanded
              ? alert.affected_wards
              : alert.affected_wards.slice(0, 3);
            const remainingWardsCount = alert.affected_wards.length - 3;

            const displayedRecs = isActionPlanExpanded
              ? alert.recommendations
              : alert.recommendations.slice(0, 2);

            return (
              <article
                key={alert.id}
                onClick={() => markAlertRead(alert.id)}
                className={`bg-white rounded-2xl p-4 border border-[#E2EAF4] border-l-4 ${severityMeta.cardBorder} shadow-[0_2px_10px_rgba(23,49,83,0.04)] transition-all space-y-3 hover:border-slate-300`}
              >
                {/* Top Row: Severity Badge, Status Dot & Timestamp */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${severityMeta.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${severityMeta.dot} animate-pulse`} />
                      <span>{severityMeta.label}</span>
                    </span>
                    {!isRead && (
                      <span className="text-[10px] font-bold text-[#1769E0] bg-[#EEF5FE] px-2 py-0.5 rounded-full border border-[#D7E7FD]">
                        New
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-[#71829A] flex items-center gap-1 shrink-0 font-medium">
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    <span>
                      {new Date(alert.issued_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}{' '}
                      IST
                    </span>
                  </span>
                </div>

                {/* Alert Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-[#173153] leading-snug">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-[#486581] leading-relaxed mt-1">
                    {alert.description}
                  </p>
                </div>

                {/* Affected Wards as Compact Chips */}
                {alert.affected_wards && alert.affected_wards.length > 0 && (
                  <div className="pt-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#71829A] uppercase tracking-wider mb-1.5">
                      <MapPin className="w-3 h-3 text-[#94A3B8]" />
                      <span>Affected Wards</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {displayedWards.map((wardName, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-[#F0F4F8] border border-[#D9E2EC] text-[11px] font-semibold text-[#173153]"
                        >
                          {wardName}
                        </span>
                      ))}

                      {remainingWardsCount > 0 && !isWardsExpanded && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandWards(alert.id);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-[#EEF5FE] text-[#1769E0] text-[10px] font-bold hover:bg-[#D7E7FD] transition-colors"
                        >
                          +{remainingWardsCount} more
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Action-Plan Section (Subtly Tinted Inset Panel) */}
                {alert.recommendations && alert.recommendations.length > 0 && (
                  <div className="p-3 bg-[#F8FAFC] border border-[#E2EAF4] rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#173153] tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#1769E0]" />
                        <span>Official Action Plan</span>
                      </div>
                      {alert.recommendations.length > 2 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandActionPlan(alert.id);
                          }}
                          className="text-[10px] font-bold text-[#1769E0] flex items-center gap-0.5 hover:underline"
                        >
                          <span>{isActionPlanExpanded ? 'Show Less' : `View All (${alert.recommendations.length})`}</span>
                          {isActionPlanExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      {displayedRecs.map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#243B53] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0] shrink-0 mt-1.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer: View Affected Zone on Map Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/map?ward=${encodeURIComponent(alert.affected_wards[0] || '')}`);
                  }}
                  className="w-full py-2 px-3 bg-[#F5F8FC] hover:bg-[#EEF5FE] text-[#1769E0] rounded-xl flex items-center justify-between text-xs font-bold transition-colors active:scale-[0.99]"
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1769E0]" />
                    <span>View Affected Zone on City Map</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#1769E0]" />
                </button>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
};
