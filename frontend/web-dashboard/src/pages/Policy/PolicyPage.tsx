import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Bookmark,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { usePolicySearch } from '../../hooks/useQueries';
import { PolicySearchResponse } from '../../types';
import { MOCK_POLICY_DOCUMENTS } from '../../mocks/fixtures';

export const PolicyPage: React.FC = () => {
  const [query, setQuery] = useState('What actions are recommended for high-risk wards?');
  const [result, setResult] = useState<PolicySearchResponse>(MOCK_POLICY_DOCUMENTS[0]);
  const policySearchMutation = usePolicySearch();

  const handleSearch = async (q?: string) => {
    const searchQuery = q || query;
    if (!searchQuery.trim()) return;

    try {
      const data = await policySearchMutation.mutateAsync(searchQuery);
      setResult(data);
    } catch {
      // fallback
      setResult(MOCK_POLICY_DOCUMENTS[0]);
    }
  };

  const exampleQueries = [
    'What actions are recommended for high-risk wards?',
    'Which guidelines address heatwave preparedness?',
    'What measures are recommended for vulnerable communities?',
    'What are the mandatory operating hours for municipal cooling centres?',
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-16">
      <PageHeader
        title="Policy & Guidelines Knowledge Base"
        subtitle="Natural language retrieval across official PMC, NDMA, and IMD Heat Action Plan regulatory directives"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Policy & Guidelines' }]}
      />

      {/* Search Bar & Example Questions */}
      <div className="bg-white rounded-card border border-[#DFEAF7] p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#7186A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask a municipal policy or heatwave directive question..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-xs text-[#102442] focus:bg-white focus:outline-none focus:border-[#0866D9] focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={policySearchMutation.isPending}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0866D9] hover:bg-[#0756B8] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {policySearchMutation.isPending ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Search Guidance</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Example Query Buttons */}
        <div>
          <span className="text-[11px] font-bold text-[#7186A3] uppercase tracking-wider block mb-2">
            Suggested Municipal Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(ex);
                  handleSearch(ex);
                }}
                className="text-xs px-3 py-1.5 rounded-xl border border-[#DFEAF7] bg-slate-50 text-[#132D50] hover:bg-blue-50 hover:border-blue-200 hover:text-[#0866D9] transition-all text-left"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RAG Synthesis Result Card */}
      {result && (
        <div className="space-y-6">
          <div className="bg-white rounded-card border border-[#DFEAF7] p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFEAF7]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#102442]">Authoritative Policy Directives</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Confidence: {Math.round(result.confidence_score * 100)}% Match
              </span>
            </div>

            <div className="text-xs text-slate-800 leading-relaxed p-4 rounded-xl bg-slate-50 border border-slate-100 font-normal">
              {result.answer}
            </div>

            {/* Applicable Triggers */}
            {result.applicable_triggers && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#102442]">Operational Triggers:</span>
                <div className="flex flex-wrap gap-1.5">
                  {result.applicable_triggers.map((trig, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-red-50 text-red-700 font-mono text-[10px] font-bold border border-red-200"
                    >
                      {trig}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Citations & Source Excerpts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#102442] uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Bookmark className="w-3.5 h-3.5 text-[#0866D9]" />
              Official Citations & Regulatory References ({result.citations.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.citations.map((cite, i) => (
                <div
                  key={i}
                  className="bg-white rounded-card border border-[#DFEAF7] p-5 shadow-soft flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="font-bold text-xs text-[#102442] leading-snug">
                        {cite.document}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0866D9] font-mono text-[10px] font-bold shrink-0">
                        Page {cite.page}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-[#7186A3] mb-2.5">
                      {cite.section}
                    </div>

                    <p className="text-xs text-slate-700 italic leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-100">
                      &ldquo;{cite.excerpt}&rdquo;
                    </p>
                  </div>

                  {cite.url && (
                    <div className="mt-4 pt-2.5 border-t border-slate-100">
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#0866D9] hover:underline flex items-center gap-1"
                      >
                        <span>Access Document Gazette</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
