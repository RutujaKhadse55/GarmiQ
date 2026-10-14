import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  MapPin,
  ExternalLink,
  Camera,
  Send,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useMunicipalReports, useUpdateReportStatus, useWards } from '../../hooks/useQueries';
import { MunicipalReport, MunicipalReportStatus } from '../../types';
import { useToast } from '../../components/common/ToastProvider';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<MunicipalReport | null>(null);

  // Status Change Dialog State
  const [newStatus, setNewStatus] = useState<MunicipalReportStatus | null>(null);
  const [officerNote, setOfficerNote] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data: reportsData, isLoading, refetch } = useMunicipalReports({
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
    ward_id: selectedWard !== 'ALL' ? selectedWard : undefined,
  });
  const { data: wards = [] } = useWards();
  const updateStatusMutation = useUpdateReportStatus();

  const reports = reportsData?.reports || [];
  const total = reportsData?.total || 0;

  const pendingCount = reports.filter((r) => r.status === 'submitted').length;
  const underReviewCount = reports.filter((r) => r.status === 'under_review' || r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const filteredReports = reports.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.location_name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.reference_no.toLowerCase().includes(q)
    );
  });

  const handleOpenStatusConfirm = (status: MunicipalReportStatus) => {
    setNewStatus(status);
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedReport || !newStatus) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedReport.id,
        status: newStatus,
        notes: officerNote || undefined,
      });

      setSelectedReport((prev) => (prev ? { ...prev, status: newStatus, officer_notes: officerNote || prev.officer_notes } : null));
      setIsConfirmOpen(false);
      setOfficerNote('');
      showToast(`Report ${selectedReport.reference_no} updated to ${newStatus.replace('_', ' ')}.`, 'success');
    } catch {
      showToast('Failed to update report status.', 'error');
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title="Citizen Thermal Reports"
        subtitle="Review, triage, and dispatch municipal interventions for crowdsourced heat distress reports"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Citizen Reports' }]}
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-card border border-[#DFEAF7] shadow-soft">
          <span className="text-[#7186A3] text-[11px] block">Total Inbound Reports</span>
          <div className="text-2xl font-black text-[#102442] mt-1">{total}</div>
          <span className="text-[10px] text-[#7186A3] block mt-0.5">Pune municipal area</span>
        </div>

        <div className="bg-white p-4 rounded-card border border-amber-200 bg-amber-50/20 shadow-soft">
          <span className="text-amber-700 text-[11px] font-semibold block">Pending Initial Triage</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          <span className="text-[10px] text-amber-700 block mt-0.5">Awaiting assignment</span>
        </div>

        <div className="bg-white p-4 rounded-card border border-blue-200 bg-blue-50/20 shadow-soft">
          <span className="text-blue-700 text-[11px] font-semibold block">Under Review / Active</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{underReviewCount}</div>
          <span className="text-[10px] text-blue-700 block mt-0.5">Field teams dispatched</span>
        </div>

        <div className="bg-white p-4 rounded-card border border-emerald-200 bg-emerald-50/20 shadow-soft">
          <span className="text-emerald-700 text-[11px] font-semibold block">Resolved Issues</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Water / shade provided</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 flex-wrap items-center gap-2.5 w-full">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#7186A3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference or description..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-[#0866D9]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-semibold text-[#102442] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="submitted">Pending Review (Submitted)</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Ward Filter */}
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-semibold text-[#102442] focus:outline-none cursor-pointer max-w-[200px]"
          >
            <option value="ALL">All Wards</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports Table & Drawer layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedReport ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          {isLoading ? (
            <LoadingSkeleton variant="table" rows={6} />
          ) : filteredReports.length === 0 ? (
            <EmptyState
              title="No reports match your filters"
              description="Adjust the status or ward filters to inspect inbound citizen reports."
            />
          ) : (
            <div className="bg-white rounded-card border border-[#DFEAF7] shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-[#DFEAF7] text-[#7186A3] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Ref ID / Time</th>
                      <th className="py-3 px-4">Location & Ward</th>
                      <th className="py-3 px-4">Issue Type</th>
                      <th className="py-3 px-4">Felt Heat</th>
                      <th className="py-3 px-4">Severity</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredReports.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => setSelectedReport(report)}
                        className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                          selectedReport?.id === report.id ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#102442]">
                          <div>{report.reference_no}</div>
                          <div className="text-[10px] text-[#7186A3] font-normal">{report.created_at.slice(11, 16)} hrs</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#102442] truncate max-w-[170px]">{report.location_name}</div>
                          <div className="text-[10px] text-[#7186A3]">{report.ward_name}</div>
                        </td>
                        <td className="py-3 px-4 capitalize text-slate-700">
                          {report.issue_type.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 font-black text-red-600">
                          {report.felt_heat}/5
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              report.severity === 'CRITICAL'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : report.severity === 'HIGH'
                                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {report.severity}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={report.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[#0866D9] font-bold hover:underline">
                            Triage →
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Report Inspection & Action Drawer */}
        {selectedReport && (
          <div className="lg:col-span-5 bg-white rounded-card border border-[#DFEAF7] p-5 shadow-elevated space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-[#DFEAF7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0866D9]">
                  {selectedReport.reference_no}
                </span>
                <h3 className="text-base font-bold text-[#102442] leading-tight">
                  {selectedReport.location_name}
                </h3>
                <span className="text-xs text-[#7186A3]">{selectedReport.ward_name}</span>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-[#7186A3] hover:text-[#102442] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description & Citizen felt heat */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#102442] uppercase text-[10px] tracking-wider">
                  Citizen Observation
                </span>
                <span className="text-red-600 font-extrabold">
                  Thermal Distress: {selectedReport.felt_heat}/5
                </span>
              </div>
              <p className="text-slate-800 leading-relaxed italic">
                &ldquo;{selectedReport.description}&rdquo;
              </p>
            </div>

            {/* Attached Photo Preview if available */}
            {selectedReport.photo_url && (
              <div>
                <span className="text-[11px] font-bold text-[#102442] block mb-1 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-[#0866D9]" />
                  Attached Evidence Photo
                </span>
                <img
                  src={selectedReport.photo_url}
                  alt="Evidence"
                  className="w-full h-40 object-cover rounded-xl border border-[#DFEAF7]"
                />
              </div>
            )}

            {/* Existing Officer Notes */}
            {selectedReport.officer_notes && (
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950">
                <span className="font-bold block mb-0.5">Municipal Officer Log:</span>
                <p className="text-[11px] text-slate-700">{selectedReport.officer_notes}</p>
              </div>
            )}

            {/* Triage Actions */}
            <div className="pt-2 border-t border-[#DFEAF7] space-y-2">
              <span className="text-xs font-bold text-[#102442] block">
                Update Report Triage Status:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleOpenStatusConfirm('under_review')}
                  disabled={selectedReport.status === 'under_review'}
                  className="py-2 px-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors disabled:opacity-40"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleOpenStatusConfirm('in_progress')}
                  disabled={selectedReport.status === 'in_progress'}
                  className="py-2 px-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#0866D9] text-xs font-bold transition-colors disabled:opacity-40"
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleOpenStatusConfirm('resolved')}
                  disabled={selectedReport.status === 'resolved'}
                  className="py-2 px-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors disabled:opacity-40"
                >
                  Mark Resolved
                </button>
              </div>

              <button
                onClick={() => navigate(`/map?ward=${selectedReport.ward_id}`)}
                className="w-full mt-2 py-2 rounded-xl border border-[#DFEAF7] bg-white hover:bg-slate-50 text-xs font-bold text-[#102442] transition-colors flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0866D9]" />
                Inspect Location on City Map
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Status Change */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={`Change Status to "${newStatus?.replace('_', ' ').toUpperCase()}"?`}
        message={`Are you sure you want to update citizen report ${selectedReport?.reference_no}? This will notify field emergency teams and update ward dashboards.`}
        confirmLabel="Confirm Status Change"
        isLoading={updateStatusMutation.isPending}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};
