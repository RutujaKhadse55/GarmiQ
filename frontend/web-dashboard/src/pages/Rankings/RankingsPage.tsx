import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Filter,
  Search,
  ChevronRight,
  TrendingUp,
  Cpu,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RiskBadge } from '../../components/common/RiskBadge';
import { RankingsBarChart } from '../../components/charts/RankingsBarChart';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { useRiskRankings } from '../../hooks/useQueries';
import { useToast } from '../../components/common/ToastProvider';

export const RankingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'hvi' | 'heat_index' | 'canopy'>('hvi');

  const { data: rankings = [], isLoading, isError, refetch } = useRiskRankings();

  // Filtered and sorted rankings
  const filteredRankings = useMemo(() => {
    let result = [...rankings];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.ward_name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.key_risk_driver.toLowerCase().includes(q)
      );
    }

    if (riskFilter !== 'ALL') {
      result = result.filter((r) => r.risk_level === riskFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'heat_index') return b.heat_index - a.heat_index;
      if (sortBy === 'canopy') return a.tree_canopy_pct - b.tree_canopy_pct;
      return b.vulnerability_score - a.vulnerability_score;
    });

    return result;
  }, [rankings, search, riskFilter, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Rank',
      'Ward Code',
      'Ward Name',
      'Risk Level',
      'HVI Vulnerability Score',
      'Heat Index (C)',
      'Tree Canopy (%)',
      'Population',
      'Key Risk Driver',
      'Recommended Intervention',
      'Estimated Benefit'
    ];

    const rows = filteredRankings.map((r) => [
      r.rank,
      r.code,
      `"${r.ward_name}"`,
      r.risk_level,
      r.vulnerability_score,
      r.heat_index,
      r.tree_canopy_pct,
      r.population,
      `"${r.key_risk_driver.replace(/"/g, '""')}"`,
      `"${r.recommended_intervention.replace(/"/g, '""')}"`,
      `"${r.estimated_benefit.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PMC_Heat_Risk_Rankings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Rankings CSV exported successfully.', 'success');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="chart" />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title="Risk & Intervention Rankings"
        subtitle="Identify priority municipal wards and compare targeted mitigation opportunities"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Risk Rankings' }]}
        actions={
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] hover:bg-slate-50 transition-colors shadow-soft flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#0866D9]" />
            Export Filtered CSV
          </button>
        }
      />

      {/* Top 8 Vulnerable Wards Comparison Chart */}
      <RankingsBarChart
        rankings={rankings}
        onSelectWard={(wardId) => navigate(`/wards/${wardId}`)}
      />

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#7186A3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by ward name or driver..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs focus:bg-white focus:outline-none focus:border-[#0866D9]"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-semibold text-[#102442] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="VERY_HIGH">Very High Only</option>
            <option value="HIGH">High Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#7186A3] self-end sm:self-auto">
          <span>Rank order:</span>
          <button
            onClick={() => setSortBy('hvi')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${
              sortBy === 'hvi' ? 'bg-blue-50 text-[#0866D9]' : 'hover:bg-slate-50'
            }`}
          >
            Vulnerability Score
          </button>
          <button
            onClick={() => setSortBy('heat_index')}
            className={`px-2.5 py-1 rounded-lg font-semibold ${
              sortBy === 'heat_index' ? 'bg-blue-50 text-[#0866D9]' : 'hover:bg-slate-50'
            }`}
          >
            Peak Heat Index
          </button>
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-card border border-[#DFEAF7] shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-[#DFEAF7] text-[#7186A3] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Ward</th>
                <th className="py-3 px-4">HVI Score</th>
                <th className="py-3 px-4">Heat Index</th>
                <th className="py-3 px-4">Primary Risk Driver</th>
                <th className="py-3 px-4">Recommended Intervention</th>
                <th className="py-3 px-4">Projected Benefit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRankings.map((item, idx) => (
                <tr key={item.ward_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-sm text-[#102442]">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#102442] hover:text-[#0866D9] cursor-pointer" onClick={() => navigate(`/wards/${item.ward_id}`)}>
                      {item.ward_name}
                    </div>
                    <div className="text-[10px] text-[#7186A3] font-mono">{item.code}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[#102442] text-sm">
                        {item.vulnerability_score}
                      </span>
                      <RiskBadge level={item.risk_level} size="sm" showDot={false} />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-black text-red-600">
                    {item.heat_index}°C
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 max-w-[200px] leading-snug">
                    {item.key_risk_driver}
                  </td>
                  <td className="py-3.5 px-4 text-[#0866D9] font-medium max-w-[200px] leading-snug">
                    {item.recommended_intervention}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold text-[11px] max-w-[180px]">
                    {item.estimated_benefit}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/simulator?ward=${item.ward_id}`)}
                        className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#0866D9] font-bold text-[11px] transition-colors"
                        title="Open Simulator with this ward"
                      >
                        Simulate
                      </button>
                      <button
                        onClick={() => navigate(`/wards/${item.ward_id}`)}
                        className="p-1 rounded text-[#7186A3] hover:text-[#102442]"
                      >
                        <ChevronRight className="w-4 h-4" />
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
  );
};
