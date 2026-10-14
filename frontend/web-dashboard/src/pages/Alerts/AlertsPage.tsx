import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Send,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  useMunicipalAlerts,
  useApproveAlert,
  useRejectAlert,
} from '../../hooks/useQueries';
import { MunicipalAlert } from '../../types';
import { useToast } from '../../components/common/ToastProvider';

export const AlertsPage: React.FC = () => {
  const { showToast } = useToast();
  const { data: alertsData, isLoading, refetch } = useMunicipalAlerts();
  const approveMutation = useApproveAlert();
  const rejectMutation = useRejectAlert();

  const [selectedAlert, setSelectedAlert] = useState<MunicipalAlert | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Confirmation state
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');

  const alerts = alertsData?.alerts || [];
  const summary = alertsData?.summary || { total: 0, pending: 0, approved: 0, rejected: 0 };

  const filteredAlerts = alerts.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  const handleOpenAction = (alert: MunicipalAlert, action: 'approve' | 'reject') => {
    setSelectedAlert(alert);
    setConfirmAction(action);
  };

  const handleConfirmAction = async () => {
    if (!selectedAlert || !confirmAction) return;

    try {
      if (confirmAction === 'approve') {
        await approveMutation.mutateAsync({
          id: selectedAlert.id,
          notes: officerNotes || 'Approved for citywide dissemination.',
        });
        showToast(`Alert "${selectedAlert.title}" approved and queued for broadcast.`, 'success');
      } else {
        await rejectMutation.mutateAsync({
          id: selectedAlert.id,
          notes: officerNotes || 'Rejected following municipal officer review.',
        });
        showToast(`Alert "${selectedAlert.title}" rejected.`, 'info');
      }
      setSelectedAlert(null);
      setConfirmAction(null);
      setOfficerNotes('');
    } catch {
      showToast('Action failed. Please retry.', 'error');
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title="Heat Alert Approval Queue"
        subtitle="Review, authorize, and broadcast color-coded municipal heatwave warnings"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Alerts' }]}
      />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setFilterStatus('ALL')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'ALL' ? 'border-[#0866D9] ring-2 ring-blue-100' : 'border-[#DFEAF7]'
          }`}
        >
          <span className="text-[#7186A3] text-[11px] block">Total Queue Alerts</span>
          <div className="text-2xl font-black text-[#102442] mt-1">{summary.total}</div>
          <span className="text-[10px] text-[#7186A3] block mt-0.5">Current summer cycle</span>
        </div>

        <div
          onClick={() => setFilterStatus('PENDING_APPROVAL')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'PENDING_APPROVAL' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-[#DFEAF7]'
          }`}
        >
          <span className="text-amber-700 text-[11px] font-semibold block">Pending Approvals</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{summary.pending}</div>
          <span className="text-[10px] text-amber-700 block mt-0.5">Requires officer sign-off</span>
        </div>

        <div
          onClick={() => setFilterStatus('APPROVED')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'APPROVED' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-[#DFEAF7]'
          }`}
        >
          <span className="text-emerald-700 text-[11px] font-semibold block">Approved & Active</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{summary.approved}</div>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Disseminated to citizens</span>
        </div>

        <div
          onClick={() => setFilterStatus('REJECTED')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'REJECTED' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-[#DFEAF7]'
          }`}
        >
          <span className="text-rose-700 text-[11px] font-semibold block">Rejected Alerts</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{summary.rejected}</div>
          <span className="text-[10px] text-rose-700 block mt-0.5">Threshold not satisfied</span>
        </div>
      </div>

      {/* Main Alerts Table & Review Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedAlert ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          {isLoading ? (
            <LoadingSkeleton variant="table" rows={4} />
          ) : filteredAlerts.length === 0 ? (
            <EmptyState
              title="No alerts in this category"
              description="Switch filters to inspect pending, approved, or historic alerts."
            />
          ) : (
            <div className="bg-white rounded-card border border-[#DFEAF7] shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-[#DFEAF7] text-[#7186A3] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Alert Title</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Affected Wards</th>
                      <th className="py-3 px-4">Forecast Heat</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        onClick={() => setSelectedAlert(alert)}
                        className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                          selectedAlert?.id === alert.id ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#102442]">{alert.title}</div>
                          <div className="text-[10px] text-[#7186A3] mt-0.5 truncate max-w-[240px]">
                            {alert.source}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              alert.severity === 'CRITICAL'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : alert.severity === 'HIGH'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {alert.severity}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="truncate max-w-[180px]">
                            {alert.affected_ward_names?.join(', ') || 'Pune Urban Area'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-red-600">
                          {alert.heat_index_forecast}°C
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={alert.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {alert.status === 'PENDING_APPROVAL' ? (
                            <span className="text-[#0866D9] font-bold text-xs hover:underline">
                              Authorize →
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs">View</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Alert Inspection Drawer */}
        {selectedAlert && (
          <div className="lg:col-span-5 bg-white rounded-card border border-[#DFEAF7] p-5 shadow-elevated space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-[#DFEAF7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0866D9]">
                  {selectedAlert.id}
                </span>
                <h3 className="text-base font-bold text-[#102442] leading-tight">
                  {selectedAlert.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-[#7186A3] hover:text-[#102442] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Severity and Timing */}
            <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] text-[#7186A3] block">Status:</span>
                <StatusBadge status={selectedAlert.status} />
              </div>
              <div>
                <span className="text-[10px] text-[#7186A3] block">Forecast Peak:</span>
                <span className="text-base font-black text-red-600">
                  {selectedAlert.heat_index_forecast}°C
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/60 text-[11px] text-[#7186A3]">
                Valid: {selectedAlert.issued_at.slice(0, 10)} to {selectedAlert.valid_until.slice(0, 10)}
              </div>
            </div>

            {/* Description Narrative */}
            <div>
              <span className="text-xs font-bold text-[#102442] block mb-1">
                Meteorological Risk Rationale:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                {selectedAlert.description}
              </p>
            </div>

            {/* Source */}
            <div className="text-[11px] text-[#7186A3]">
              <span className="font-bold text-[#102442]">Intelligence Feed: </span>
              {selectedAlert.source}
            </div>

            {/* Proposed Safety Directives */}
            <div>
              <span className="text-xs font-bold text-[#102442] block mb-1.5">
                Public Safety Recommendations:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedAlert.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Approval / Rejection Actions */}
            {selectedAlert.status === 'PENDING_APPROVAL' ? (
              <div className="pt-3 border-t border-[#DFEAF7] space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenAction(selectedAlert, 'approve')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Broadcast Alert
                  </button>
                  <button
                    onClick={() => handleOpenAction(selectedAlert, 'reject')}
                    className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#DFEAF7] text-xs text-[#7186A3]">
                <div className="font-semibold text-[#102442]">Review Audit Log:</div>
                <div>Reviewed by {selectedAlert.reviewed_by || 'Municipal Health Officer'}</div>
                <div className="text-[10px] italic mt-0.5">&ldquo;{selectedAlert.review_notes || 'Action logged'}&rdquo;</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmAction !== null}
        title={
          confirmAction === 'approve'
            ? 'Authorize Citywide Heat Alert Broadcast?'
            : 'Reject Proposed Heat Alert?'
        }
        message={
          confirmAction === 'approve'
            ? `Authorizing "${selectedAlert?.title}" will immediately dispatch citizen advisories across ${selectedAlert?.affected_ward_names?.join(', ') || 'affected wards'} and activate hospital heat protocols.`
            : `Rejecting this alert will archive the warning without citizen broadcast.`
        }
        confirmLabel={confirmAction === 'approve' ? 'Authorize Alert' : 'Reject Alert'}
        isDestructive={confirmAction === 'reject'}
        isLoading={approveMutation.isPending || rejectMutation.isPending}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
};
