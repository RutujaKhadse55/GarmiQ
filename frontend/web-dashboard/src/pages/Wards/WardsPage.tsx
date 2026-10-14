import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  ChevronRight,
  ArrowUpDown,
  Building2,
  TreePine,
  Thermometer,
  ShieldAlert,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { RiskBadge } from '../../components/common/RiskBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { useWards } from '../../hooks/useQueries';

export const WardsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState(searchParams.get('risk') || 'ALL');
  const [sortField, setSortField] = useState<'hvi' | 'heat_index' | 'tree_canopy' | 'population'>('hvi');
  const [sortAsc, setSortAsc] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const { data: wards = [], isLoading, isError, refetch } = useWards();

  // Filter & Sort
  const filteredWards = useMemo(() => {
    let result = [...wards];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(q) ||
          w.code.toLowerCase().includes(q) ||
          w.id.toLowerCase().includes(q)
      );
    }

    if (selectedRisk !== 'ALL') {
      result = result.filter((w) => w.risk_level === selectedRisk);
    }

    result.sort((a, b) => {
      let valA = 0;
      let valB = 0;
      if (sortField === 'hvi') {
        valA = a.hvi || a.vulnerability_score;
        valB = b.hvi || b.vulnerability_score;
      } else if (sortField === 'heat_index') {
        valA = a.current_heat_index;
        valB = b.current_heat_index;
      } else if (sortField === 'tree_canopy') {
        valA = a.tree_canopy_pct || 0;
        valB = b.tree_canopy_pct || 0;
      } else if (sortField === 'population') {
        valA = a.total_population || 0;
        valB = b.total_population || 0;
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [wards, search, selectedRisk, sortField, sortAsc]);

  // Derived summaries from current filtered list
  const totalCount = filteredWards.length;
  const highRiskCount = filteredWards.filter((w) => w.risk_level === 'HIGH' || w.risk_level === 'VERY_HIGH').length;
  const modRiskCount = filteredWards.filter((w) => w.risk_level === 'MODERATE').length;
  const lowRiskCount = filteredWards.filter((w) => w.risk_level === 'LOW').length;

  // Pagination
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const paginatedWards = filteredWards.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedRisk('ALL');
    setSearchParams({});
    setCurrentPage(1);
  };

  const handleSortToggle = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      <PageHeader
        title="Ward Explorer"
        subtitle="Explore heat vulnerability and environmental indicators across city wards"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Ward Explorer' }]}
        actions={
          <button
            onClick={() => navigate('/map')}
            className="px-3.5 py-1.5 rounded-xl bg-[#0866D9] text-white text-xs font-bold hover:bg-[#0756B8] transition-colors shadow-sm"
          >
            Explore on Map →
          </button>
        }
      />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-card border border-[#DFEAF7] shadow-soft text-xs">
        <div>
          <span className="text-[#7186A3] text-[11px] block">Matching Wards</span>
          <span className="text-xl font-black text-[#102442]">{totalCount}</span>
        </div>
        <div>
          <span className="text-red-600 text-[11px] font-semibold block">High & Extreme Risk</span>
          <span className="text-xl font-black text-red-600">{highRiskCount}</span>
        </div>
        <div>
          <span className="text-amber-600 text-[11px] font-semibold block">Moderate Risk</span>
          <span className="text-xl font-black text-amber-600">{modRiskCount}</span>
        </div>
        <div>
          <span className="text-emerald-600 text-[11px] font-semibold block">Low Risk Wards</span>
          <span className="text-xl font-black text-emerald-600">{lowRiskCount}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-4 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-2.5 w-full">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7186A3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by ward name or code..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0866D9]"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <span className="text-[#7186A3] whitespace-nowrap">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => {
                setSelectedRisk(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs font-semibold text-[#102442] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="VERY_HIGH">Very High / Extreme</option>
              <option value="HIGH">High Risk</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>

          {(search || selectedRisk !== 'ALL') && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs text-[#7186A3] self-end md:self-auto">
          <span>Sort by:</span>
          <button
            onClick={() => handleSortToggle('hvi')}
            className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 ${
              sortField === 'hvi' ? 'bg-blue-50 text-[#0866D9]' : 'hover:bg-slate-50'
            }`}
          >
            HVI Score
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleSortToggle('heat_index')}
            className={`px-2 py-1 rounded-lg font-semibold flex items-center gap-1 ${
              sortField === 'heat_index' ? 'bg-blue-50 text-[#0866D9]' : 'hover:bg-slate-50'
            }`}
          >
            Heat Index
            <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <LoadingSkeleton variant="table" rows={6} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : paginatedWards.length === 0 ? (
        <EmptyState
          title="No wards matched your filters"
          description="Try adjusting your search criteria or resetting filters to view all monitored Pune wards."
          action={
            <button
              onClick={handleClearFilters}
              className="px-3.5 py-1.5 rounded-lg bg-[#0866D9] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-card border border-[#DFEAF7] shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-[#DFEAF7] text-[#7186A3] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ward Code</th>
                  <th className="py-3 px-4">Ward Name</th>
                  <th className="py-3 px-4">Heat-Risk Level</th>
                  <th className="py-3 px-4">HVI Score</th>
                  <th className="py-3 px-4">Heat Index</th>
                  <th className="py-3 px-4">Built-Up</th>
                  <th className="py-3 px-4">Tree Canopy</th>
                  <th className="py-3 px-4">Cooling Centres</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedWards.map((w) => (
                  <tr
                    key={w.id}
                    onClick={() => navigate(`/wards/${w.id}`)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0866D9]">
                      {w.code}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#102442]">{w.name}</div>
                      <div className="text-[10px] text-[#7186A3]">Pop: {(w.total_population || 120000).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={w.risk_level} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#102442]">{w.hvi || w.vulnerability_score}</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (w.hvi || w.vulnerability_score) >= 80
                                ? 'bg-red-500'
                                : (w.hvi || w.vulnerability_score) >= 60
                                ? 'bg-orange-500'
                                : (w.hvi || w.vulnerability_score) >= 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${w.hvi || w.vulnerability_score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-red-600">
                      {w.current_heat_index}°C
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {w.built_up_pct || 72}%
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">
                      {w.tree_canopy_pct || 14}%
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {w.cooling_points_count || 5} centres
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[#0866D9] font-bold text-xs hover:underline flex items-center justify-end gap-1">
                        Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-3.5 border-t border-[#DFEAF7] bg-slate-50 flex items-center justify-between text-xs text-[#7186A3]">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount} wards
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-[#DFEAF7] bg-white text-xs disabled:opacity-40 hover:bg-slate-50"
              >
                Previous
              </button>
              <span className="px-2 font-bold text-[#102442]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-[#DFEAF7] bg-white text-xs disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
