import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { MOCK_WARDS, subscribeAlerts } from '@garmiq/api-client';
import {
  Sun,
  Shield,
  MapPin,
  Bell,
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Phone
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    setOnboardingCompleted,
    setSelectedWardId,
    selectedWardId,
    setUserLocation,
    setHasLocationPermission,
    setSubscriber
  } = useUserStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [consent, setConsent] = useState(true);
  const [isLocating, setIsLocating] = useState(false);

  const handleUseLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setHasLocationPermission(true);
          setUserLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            address: 'Detected Live Location'
          });
          setStep(3);
        },
        () => {
          setIsLocating(false);
          setHasLocationPermission(false);
          // Keep on step 2 so user can select ward
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleFinish = async () => {
    if (phone.trim() && consent) {
      await subscribeAlerts({
        phone: phone.trim(),
        channel,
        ward_id: selectedWardId,
        consent
      });
      setSubscriber({
        phone: phone.trim(),
        channel,
        active: true
      });
    }

    setOnboardingCompleted(true);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex flex-col justify-between p-4 max-w-md mx-auto animate-fade-in">
      {/* Top Bar with Logo */}
      <div className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#0866D9] text-white flex items-center justify-center shadow-soft">
            <Sun className="w-6 h-6 text-amber-300 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#102A4C] tracking-tight leading-none">
              GarmiQ
            </h1>
            <span className="text-[10px] font-semibold text-[#0866D9] tracking-wider uppercase">
              {t('tagline', 'Beat the Heat')}
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#E2EDF9] shadow-2xs">
          <span className="text-xs font-bold text-[#0866D9]">{step}</span>
          <span className="text-xs text-[#5B708B]">/</span>
          <span className="text-xs font-semibold text-[#5B708B]">3</span>
        </div>
      </div>

      {/* Main Content Card based on Step */}
      <div className="my-auto py-6">
        {step === 1 && (
          <div className="space-y-6">
            {/* Visual Hero Illustration */}
            <div className="relative w-full h-48 rounded-3xl bg-linear-to-b from-[#EDF5FF] to-white border border-[#D6E8FF] flex flex-col items-center justify-center p-6 text-center overflow-hidden shadow-soft">
              <div className="absolute top-3 right-4 w-12 h-12 rounded-full bg-amber-400/20 blur-md" />
              <div className="w-16 h-16 rounded-full bg-white shadow-soft flex items-center justify-center text-[#0866D9] mb-3">
                <Sun className="w-9 h-9 text-[#F97316]" />
              </div>
              <h2 className="text-lg font-bold text-[#102A4C]">
                {t('onboarding.welcomeTitle', 'Your Personal Heat Risk Companion')}
              </h2>
              <p className="text-xs text-[#5B708B] mt-1 max-w-[280px]">
                {t('onboarding.welcomeSubtitle', 'Get real-time heat risk, hyper-local safety advisories, and nearby cooling shelters.')}
              </p>
            </div>

            {/* Language Step */}
            <div className="bg-white rounded-3xl p-5 border border-[#E2EDF9] shadow-soft">
              <h3 className="text-sm font-bold text-[#102A4C] mb-1">
                {t('onboarding.step1Title', 'Select Your Language')}
              </h3>
              <p className="text-xs text-[#5B708B] mb-4">
                {t('onboarding.step1Desc', 'Choose your preferred language for heat warnings and advisories.')}
              </p>
              <LanguageSwitcher variant="grid" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#E2EDF9] shadow-soft text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#EDF5FF] text-[#0866D9] flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-7 h-7 text-[#0866D9]" />
              </div>
              <h3 className="text-base font-bold text-[#102A4C] mb-1">
                {t('onboarding.step2Title', 'Enable Location')}
              </h3>
              <p className="text-xs text-[#5B708B] max-w-[280px] mx-auto mb-5 leading-relaxed">
                {t('onboarding.step2Desc', 'We use your location to calculate exact thermal stress and guide you to shaded spots.')}
              </p>

              <button
                type="button"
                onClick={handleUseLocation}
                disabled={isLocating}
                className="w-full py-3.5 px-4 bg-[#0866D9] hover:bg-[#054EB0] text-white text-sm font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all active:scale-[0.98] mb-3"
              >
                <MapPin className="w-4 h-4" />
                <span>{isLocating ? 'Detecting Location...' : t('onboarding.useLocation', 'Use My Location')}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2EDF9]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-[#5B708B]">Or select ward manually</span>
                </div>
              </div>

              {/* Ward dropdown */}
              <div className="text-left">
                <label className="text-xs font-semibold text-[#102A4C] block mb-1.5">
                  {t('onboarding.pickWardInstead', 'Select Ward Manually')}
                </label>
                <select
                  value={selectedWardId}
                  onChange={(e) => setSelectedWardId(e.target.value)}
                  className="w-full p-3 bg-[#F8FAFD] border border-[#D6E8FF] rounded-2xl text-xs font-semibold text-[#102A4C] focus:ring-2 focus:ring-[#0866D9] focus:outline-none"
                >
                  {MOCK_WARDS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-[#E2EDF9] shadow-soft">
              <div className="w-14 h-14 rounded-2xl bg-[#EDF5FF] text-[#0866D9] flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7 text-[#0866D9]" />
              </div>
              <h3 className="text-base font-bold text-[#102A4C] text-center mb-1">
                {t('onboarding.step3Title', 'Receive Heat Alerts')}
              </h3>
              <p className="text-xs text-[#5B708B] text-center max-w-[280px] mx-auto mb-5">
                {t('onboarding.step3Desc', 'Stay ahead of dangerous temperature spikes with instant WhatsApp or SMS alerts.')}
              </p>

              {/* Phone input */}
              <div className="mb-4">
                <label className="text-xs font-bold text-[#102A4C] block mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xs font-semibold text-[#5B708B]">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-3 bg-[#F8FAFD] border border-[#D6E8FF] rounded-2xl text-xs font-semibold text-[#102A4C] focus:ring-2 focus:ring-[#0866D9] focus:outline-none"
                  />
                </div>
              </div>

              {/* Channel Selector */}
              <div className="mb-4">
                <label className="text-xs font-bold text-[#102A4C] block mb-1.5">
                  {t('onboarding.channelLabel', 'Preferred Alert Channel')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      channel === 'whatsapp'
                        ? 'bg-[#EBF7EE] border-emerald-500 text-emerald-800'
                        : 'bg-[#F8FAFD] border-[#E2EDF9] text-[#5B708B]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${channel === 'whatsapp' ? 'text-emerald-600' : 'opacity-0'}`} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      channel === 'sms'
                        ? 'bg-[#EDF5FF] border-[#0866D9] text-[#0866D9]'
                        : 'bg-[#F8FAFD] border-[#E2EDF9] text-[#5B708B]'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${channel === 'sms' ? 'text-[#0866D9]' : 'opacity-0'}`} />
                    <span>SMS</span>
                  </button>
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer text-left">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#0866D9] focus:ring-[#0866D9]"
                />
                <span className="text-[11px] text-[#5B708B] leading-relaxed">
                  {t('onboarding.consentText', 'I agree to receive official heatwave safety alerts and climate warnings from municipal disaster management.')}
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="pt-4">
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => (s + 1) as 2 | 3)}
            className="w-full py-4 px-6 bg-[#0866D9] hover:bg-[#054EB0] text-white text-sm font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>{t('onboarding.getStarted', 'Continue')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-4 px-6 bg-[#0866D9] hover:bg-[#054EB0] text-white text-sm font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <span>{t('onboarding.finishOnboarding', 'Go to Dashboard')}</span>
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-2 text-xs font-semibold text-[#5B708B] hover:text-[#102A4C] text-center"
            >
              {t('onboarding.skipAlerts', 'Skip for now')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
