import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ScrollText,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  Share2,
  FileText,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { useHeatActionPlan, useDownloadPlanPdf } from '../../hooks/useQueries';
import { useToast } from '../../components/common/ToastProvider';

export const PlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: plan, isLoading, isError, refetch } = useHeatActionPlan(id);
  const downloadMutation = useDownloadPlanPdf();

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!plan) return;
    try {
      setIsGeneratingPdf(true);
      const res = await downloadMutation.mutateAsync(plan.id);
      showToast(res.message, 'success');
      // Trigger browser print dialog for native PDF export
      window.print();
    } catch {
      showToast('Failed to generate PDF document.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <ErrorState
        title="Heat Action Plan Not Found"
        message={`We could not locate municipal plan record with ID "${id}".`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-16">
      {/* Printable Plan Document Area */}
      <div className="no-print">
        <PageHeader
          title={plan.title}
          subtitle={`Official Municipal Directive • ${plan.city} • ${plan.planning_cycle}`}
          backUrl="/plans"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Heat Action Plans', href: '/plans' },
            { label: plan.title },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] hover:bg-slate-50 transition-colors shadow-soft flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#0866D9]" />
                Print / Save Document
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="px-3.5 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-60"
              >
                <Download className="w-3.5 h-3.5" />
                {isGeneratingPdf ? 'Generating PDF...' : 'Download Official PDF'}
              </button>
            </div>
          }
        />
      </div>

      {/* Official Municipal Heat Action Plan Document */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-8 md:p-10 shadow-soft max-w-4xl mx-auto space-y-8">
        {/* Document Header with Emblem */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b-2 border-[#102442] gap-4">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#0866D9]">
              Government of Maharashtra • Pune Municipal Corporation (PMC)
            </span>
            <h1 className="text-xl md:text-2xl font-black text-[#102442] mt-1 leading-snug">
              {plan.title}
            </h1>
            <p className="text-xs text-[#7186A3] mt-1">
              Document Reference: {plan.id.toUpperCase()} • Issued by {plan.author}
            </p>
          </div>
          <div className="text-right shrink-0">
            <StatusBadge status={plan.status} className="text-sm px-3 py-1" />
            <div className="text-xs font-bold text-emerald-700 mt-2">
              Budget: ₹{plan.budget_lakhs} Lakhs
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h2 className="text-sm font-bold text-[#102442] uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0866D9]" />
            1. Executive Overview & Climate Scope
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {plan.summary}
          </p>
        </div>

        {/* Priority Focus Wards */}
        <div>
          <h2 className="text-sm font-bold text-[#102442] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#0866D9]" />
            2. Priority Vulnerability Zones & Focus Wards
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {plan.target_wards.map((wardName, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-red-100 bg-red-50/40 text-[#102442] font-semibold flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                <span className="truncate">{wardName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Strategic Pillars */}
        <div>
          <h2 className="text-sm font-bold text-[#102442] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            3. Core Strategic Mitigation Pillars
          </h2>
          <div className="space-y-3">
            {plan.key_pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-start gap-3 text-xs"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0866D9] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#102442]">{pillar}</div>
                  <p className="text-[11px] text-[#7186A3] mt-0.5">
                    Municipal teams mandated to verify implementation weekly through GarmiQ IoT and field audits.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Municipal Sign-off Footer */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 text-xs text-[#7186A3]">
          <div>
            <div className="font-bold text-[#102442]">Prepared By:</div>
            <div>{plan.author}</div>
            <div>Disaster Management & Public Health Cell</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[#102442]">Authorized Signature:</div>
            <div className="font-serif italic text-sm text-[#102442] mt-1">Dr. Aarti Deshmukh</div>
            <div className="text-[10px]">Chief Municipal Health Officer, PMC</div>
          </div>
        </div>
      </div>
    </div>
  );
};
