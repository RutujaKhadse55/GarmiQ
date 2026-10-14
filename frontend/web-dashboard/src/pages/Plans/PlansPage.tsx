import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScrollText,
  Plus,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  FileCheck,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useHeatActionPlans, useCreateHeatActionPlan, useWards } from '../../hooks/useQueries';
import { useToast } from '../../components/common/ToastProvider';

export const PlansPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { data: plans = [], isLoading } = useHeatActionPlans();
  const { data: wards = [] } = useWards();
  const createPlanMutation = useCreateHeatActionPlan();

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(2026);
  const [planningCycle, setPlanningCycle] = useState('Annual Summer Preparedness (2026-2027)');
  const [targetWards, setTargetWards] = useState<string[]>(['Kasba Peth', 'Swargate']);
  const [budgetLakhs, setBudgetLakhs] = useState(250);
  const [summary, setSummary] = useState('');

  const handleOpenCreateModal = () => {
    setTitle('PMC Pune Heat Action Plan 2026: Climate Resilience Framework');
    setSummary('Comprehensive municipal heatwave preparedness integrating cool roofs, shaded public transit, emergency water distribution, and hospital surge protocols.');
    setIsModalOpen(true);
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const created = await createPlanMutation.mutateAsync({
        title,
        year,
        planning_cycle: planningCycle,
        city: 'Pune',
        target_wards: targetWards,
        budget_lakhs: budgetLakhs,
        summary,
        status: 'DRAFT',
      });
      setIsModalOpen(false);
      showToast('Heat Action Plan created successfully.', 'success');
      navigate(`/plans/${created.id}`);
    } catch {
      showToast('Failed to create action plan.', 'error');
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title="Municipal Heat Action Plans (HAP)"
        subtitle="Formulate, track, and operationalize long-term climate adaptation and civic heat action plans"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Heat Action Plans' }]}
        actions={
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Create Action Plan
          </button>
        }
      />

      {/* Plans Listing */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoadingSkeleton variant="card" />
          <LoadingSkeleton variant="card" />
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          title="No Heat Action Plans on Record"
          description="Click 'Create Action Plan' to initiate Pune's official civic heat mitigation plan."
          action={
            <button
              onClick={handleOpenCreateModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#0866D9] text-white text-xs font-semibold"
            >
              Create Action Plan
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => navigate(`/plans/${plan.id}`)}
              className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#0866D9] uppercase">
                    {plan.id}
                  </span>
                  <StatusBadge status={plan.status} />
                </div>

                <h3 className="text-base font-bold text-[#102442] leading-snug line-clamp-2">
                  {plan.title}
                </h3>
                <p className="text-xs text-[#7186A3] mt-1.5 line-clamp-2 leading-relaxed">
                  {plan.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-[#DFEAF7] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#7186A3]">
                    <span>Cycle:</span>
                    <span className="font-semibold text-[#102442]">{plan.planning_cycle}</span>
                  </div>
                  <div className="flex justify-between text-[#7186A3]">
                    <span>Budget Allocated:</span>
                    <span className="font-bold text-emerald-700">₹{plan.budget_lakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between text-[#7186A3]">
                    <span>Focus Wards:</span>
                    <span className="font-semibold text-[#102442] truncate max-w-[150px]">
                      {plan.target_wards.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#DFEAF7] flex items-center justify-between">
                <span className="text-[10px] text-[#7186A3]">
                  Updated {plan.updated_at.slice(0, 10)}
                </span>
                <span className="text-xs font-bold text-[#0866D9] flex items-center gap-1 hover:underline">
                  Inspect Plan
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-dark/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-card border border-[#DFEAF7] shadow-modal w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#7186A3] hover:text-[#102442] p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0866D9] flex items-center justify-center">
                <ScrollText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#102442]">Initiate Heat Action Plan</h3>
                <p className="text-xs text-[#7186A3]">Define scope, target wards, and budget allocation</p>
              </div>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#102442] mb-1">Plan Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-[#0866D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#102442] mb-1">Target Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#102442] mb-1">Est. Budget (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={budgetLakhs}
                    onChange={(e) => setBudgetLakhs(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#102442] mb-1">Planning Cycle</label>
                <input
                  type="text"
                  value={planningCycle}
                  onChange={(e) => setPlanningCycle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#102442] mb-1">Executive Summary</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs leading-relaxed focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-[#DFEAF7] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPlanMutation.isPending}
                  className="px-4 py-2 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm"
                >
                  {createPlanMutation.isPending ? 'Creating Plan...' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
