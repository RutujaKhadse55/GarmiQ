import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { MOCK_WARDS } from '@garmiq/api-client';
import { RiskBadge } from '../components/RiskBadge';
import {
  Droplets,
  Clock,
  Shirt,
  Users,
  Activity,
  Building2,
  ArrowRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const TipsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedWardId } = useUserStore();

  const currentWard = MOCK_WARDS.find((w) => w.id === selectedWardId) || MOCK_WARDS[0];

  const safetyTips = [
    {
      icon: Droplets,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      title: 'Stay Continuously Hydrated',
      desc: 'Drink at least 3 to 4 litres of clean water or oral rehydration solution (ORS). Do not wait until you feel thirsty.',
      actionable: 'Avoid caffeinated sodas and sugary drinks that hasten dehydration.'
    },
    {
      icon: Clock,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      title: 'Avoid Peak Sunlight Hours',
      desc: 'Reschedule all outdoor physical activity, construction, or travel away from 11:00 AM to 04:30 PM.',
      actionable: 'Seek shade immediately if you must commute during midday.'
    },
    {
      icon: Shirt,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      title: 'Wear Light Cotton Clothing',
      desc: 'Opt for loose, light-colored breathable fabrics. Protect your head with a damp scarf, hat, or umbrella.',
      actionable: 'Apply wet towels to the neck and wrists to cool down quickly.'
    },
    {
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      title: 'Protect Vulnerable Individuals',
      desc: 'Infants, pregnant women, outdoor laborers, and elders over 65 have higher risk of sudden thermal decompensation.',
      actionable: 'Never leave children or pets inside parked vehicles.'
    },
    {
      icon: Activity,
      color: 'bg-red-50 text-red-600 border-red-200',
      title: 'Recognise Heat Stroke Warning Signs',
      desc: 'Watch for dizziness, headache, vomiting, hot dry skin without sweat, rapid pulse, and disorientation.',
      actionable: 'If someone is confused or faints, move to shade and call 108 immediately.'
    },
    {
      icon: Building2,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      title: 'Utilise Municipal Cooling Centres',
      desc: 'Air-conditioned civic shelters and pyaao drinking points are operating freely across your ward.',
      actionable: 'Rest in a cooling shelter for 20 minutes to reset your body core temperature.'
    }
  ];

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
              {t('nav.tips', 'Heat Safety Tips')}
            </h1>
            <p className="text-[11px] text-[#5B708B]">
              {currentWard.name} • Certified Health Guidance
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Highlighted current risk banner */}
        <div className="bg-linear-to-br from-white to-[#FFF4ED] p-4.5 rounded-3xl border border-[#FED7AA] shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#EA580C] tracking-wider">
              Current Ward Risk
            </span>
            <RiskBadge level={currentWard.risk_level} size="sm" />
          </div>
          <h2 className="text-sm font-bold text-[#9A3412] leading-snug">
            Extreme Thermal Caution Active
          </h2>
          <p className="text-xs text-[#5B708B] mt-1 leading-relaxed">
            Follow the six life-saving heat safety protocols below during high ambient temperatures.
          </p>
        </div>

        {/* Actionable Tips Cards */}
        <div className="space-y-3">
          {safetyTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 border border-[#E2EDF9] shadow-soft space-y-2 hover:border-[#B5D6FF] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102A4C]">
                      {tip.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#5B708B] leading-relaxed">
                  {tip.desc}
                </p>

                <div className="bg-[#F8FAFD] p-2 rounded-xl text-[11px] text-[#0866D9] font-medium flex items-center gap-1.5 border border-[#E2EDF9]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0866D9] shrink-0" />
                  <span>{tip.actionable}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to view cooling centres */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/map')}
            className="w-full py-4 px-6 bg-[#0866D9] hover:bg-[#054EB0] text-white text-sm font-bold rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>View Nearby Cooling Centres on Map</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
