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
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

export const TipsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { selectedWardId } = useUserStore();

  const currentWard = MOCK_WARDS.find((w) => w.id === selectedWardId) || MOCK_WARDS[0];

  const safetyTips = [
    {
      icon: Droplets,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: 'Stay Hydrated',
      desc: 'Drink at least 3 to 4 litres of clean water or oral rehydration salts (ORS) daily. Do not wait until you feel thirsty.',
      actionable: 'Carry a refillable water bottle when stepping outside in Pune.'
    },
    {
      icon: Clock,
      color: 'bg-[#FDF0F1] text-[#E5484D] border-[#F9C3C6]',
      title: 'Reduce Outdoor Activity During Peak Heat',
      desc: 'Reschedule heavy physical exertion, market visits, or outdoor transit between 11:30 AM and 04:30 PM.',
      actionable: 'Plan commuting during early morning or post-sunset hours.'
    },
    {
      icon: Shirt,
      color: 'bg-[#FEF9EE] text-[#F3B43F] border-[#FCE3AA]',
      title: 'Wear Light, Loose Clothing',
      desc: 'Wear loose-fitting, light-colored cotton clothes. Protect your head with a cloth cap, scarf, or umbrella.',
      actionable: 'Apply a damp cloth to your forehead and wrists if feeling flushed.'
    },
    {
      icon: Users,
      color: 'bg-[#EEF5FE] text-[#1769E0] border-[#D7E7FD]',
      title: 'Check on Vulnerable People',
      desc: 'Elderly citizens, pregnant women, infants, and chronic heart patients face the highest risk of thermal shock.',
      actionable: 'Never leave children or elderly persons in stationary locked cars.'
    },
    {
      icon: Activity,
      color: 'bg-[#FEF3ED] text-[#F47738] border-[#FCD2BE]',
      title: 'Recognise Signs of Heat Illness',
      desc: 'Watch for dizziness, extreme headache, vomiting, hot dry skin with cessation of sweating, and confusion.',
      actionable: 'Move the person to shade immediately and dial 108 emergency services.'
    },
    {
      icon: Building2,
      color: 'bg-[#EBFBF3] text-[#36B878] border-[#B7EDCE]',
      title: 'Find a Cooling Centre',
      desc: 'Pune Municipal Corporation operates public shaded shelters and air-conditioned civic halls across wards.',
      actionable: 'Rest in a cooling centre for 15-20 minutes to reset core temperature.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EAF4] px-4 py-3 shadow-soft">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-2xl bg-[#F5F8FC] border border-[#E2EAF4] flex items-center justify-center text-[#173153] hover:bg-[#EEF5FE]"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#173153]">
              Heat Safety Guidelines
            </h1>
            <p className="text-[11px] text-[#71829A]">
              Pune Heat Action Plan • Public Health Advisory
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-3.5">
        {/* Prominent Current-Risk Banner */}
        <div className="bg-white p-4.5 rounded-3xl border border-[#E2EAF4] shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#173153] tracking-wider">
              Current Ward Condition
            </span>
            <RiskBadge level={currentWard.risk_level} size="sm" />
          </div>
          <h2 className="text-base font-bold text-[#173153]">
            {currentWard.name} ({currentWard.current_heat_index}°C)
          </h2>
          <p className="text-xs text-[#71829A] mt-1">
            Extreme daytime solar radiation. Follow the six preventive guidelines below to avoid heat exhaustion.
          </p>
        </div>

        {/* Safety Guidelines List */}
        <div className="space-y-3">
          {safetyTips.map((tip, idx) => {
            const Icon = tip.icon;
            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-3xl border border-[#E2EAF4] shadow-soft space-y-2 hover:border-[#B6D6FC] transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-[#173153] leading-snug">
                      {tip.title}
                    </h3>
                    <p className="text-xs text-[#71829A] mt-1 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-[#F5F8FC] rounded-2xl border border-[#E2EAF4] text-[11px] font-semibold text-[#1769E0] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1769E0] shrink-0" />
                  <span>{tip.actionable}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Find Relief Action */}
        <button
          onClick={() => navigate('/map')}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft transition-all active:scale-[0.98]"
        >
          <Building2 className="w-4 h-4" />
          <span>Find Nearby Pune Cooling Centres on Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </main>
    </div>
  );
};
