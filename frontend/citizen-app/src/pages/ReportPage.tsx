import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { submitReport, saveLocalQueuedReport, MOCK_WARDS } from '@garmiq/api-client';
import { ReportType, ReportSubmission } from '@garmiq/types';
import { HeatSlider } from '../components/HeatSlider';
import { PhotoPicker } from '../components/PhotoPicker';
import {
  Flame,
  Umbrella,
  Droplet,
  HeartHandshake,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const ReportPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isOnline, selectedWardId, userLocation } = useUserStore();

  const currentWard = MOCK_WARDS.find((w) => w.id === selectedWardId) || MOCK_WARDS[0];

  const [issueType, setIssueType] = useState<ReportType>('hot_spot');
  const [lat, setLat] = useState(userLocation.lat || currentWard.lat);
  const [lon, setLon] = useState(userLocation.lon || currentWard.lon);
  const [locationName, setLocationName] = useState(currentWard.name);
  const [feltHeat, setFeltHeat] = useState<number>(3);
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<ReportSubmission | null>(null);

  const reportTypes = [
    {
      id: 'hot_spot' as ReportType,
      title: t('report.hotspot', 'Heat Hotspot'),
      desc: 'Severe radiating asphalt or trapped hot air corridor',
      icon: Flame,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      id: 'no_shade' as ReportType,
      title: t('report.noShade', 'No Shade / Exposed Stop'),
      desc: 'Uncovered bus stop, market queue, or bare public area',
      icon: Umbrella,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      id: 'no_water' as ReportType,
      title: t('report.noWater', 'No Drinking Water'),
      desc: 'Broken civic cooler, dried water post, or public tap fault',
      icon: Droplet,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
    },
    {
      id: 'vulnerable_person' as ReportType,
      title: t('report.vulnerablePerson', 'Vulnerable Person Assistance'),
      desc: 'Elderly citizen or laborer showing signs of heat distress',
      icon: HeartHandshake,
      color: 'bg-rose-50 text-rose-600 border-rose-200'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const reportData: ReportSubmission = {
      id: `rep-${Date.now()}`,
      issue_type: issueType,
      lat,
      lon,
      location_name: locationName,
      felt_heat: feltHeat,
      description,
      photo_url: photoPreview || undefined,
      status: isOnline ? 'submitted' : 'pending_sync',
      created_at: new Date().toISOString()
    };

    if (isOnline) {
      try {
        const formData = new FormData();
        formData.append('issue_type', issueType);
        formData.append('lat', String(lat));
        formData.append('lon', String(lon));
        formData.append('location_name', locationName);
        formData.append('felt_heat', String(feltHeat));
        formData.append('description', description);
        if (photoFile) {
          formData.append('photo', photoFile);
        }

        const res = await submitReport(formData);
        reportData.reference_number = res.reference_id;
        reportData.status = 'submitted';
      } catch {
        // Fallback to local queue if request dropped
        reportData.status = 'pending_sync';
        saveLocalQueuedReport(reportData);
      }
    } else {
      // Offline queue
      saveLocalQueuedReport(reportData);
      reportData.reference_number = `OFFLINE-${Math.floor(10000 + Math.random() * 90000)}`;
    }

    setIsSubmitting(false);
    setSubmittedReport(reportData);
  };

  const handleReset = () => {
    setSubmittedReport(null);
    setDescription('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setFeltHeat(3);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EDF9] px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto">
          <h1 className="text-base font-bold text-[#102A4C]">
            {t('report.title', 'Report a Heat Issue')}
          </h1>
          <p className="text-[11px] text-[#5B708B]">
            {t('report.subtitle', 'Crowdsource thermal stress points to trigger civic cooling response')}
          </p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4">
        {submittedReport ? (
          /* Confirmation Success Screen */
          <div className="bg-white rounded-3xl p-6 border border-[#B5D6FF] shadow-elevated text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-soft">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-lg font-black text-[#102A4C]">
                {submittedReport.status === 'submitted'
                  ? t('report.successTitle', 'Report Submitted Successfully!')
                  : 'Report Queued Offline (Pending Sync)'}
              </h2>
              <p className="text-xs text-[#5B708B] mt-1 leading-relaxed">
                {submittedReport.status === 'submitted'
                  ? t('report.successDesc', 'Your submission has been registered with the local municipal disaster control cell.')
                  : t('report.pendingSyncDesc', 'Stored locally. Will automatically sync to server when connection is restored.')}
              </p>
            </div>

            {submittedReport.reference_number && (
              <div className="p-3 bg-[#EDF5FF] rounded-2xl border border-[#D6E8FF]">
                <span className="text-[10px] uppercase font-bold text-[#5B708B] block">
                  {t('report.referenceCode', 'Reference ID')}
                </span>
                <span className="text-base font-mono font-bold text-[#0866D9]">
                  {submittedReport.reference_number}
                </span>
              </div>
            )}

            <div className="text-left text-xs bg-[#F8FAFD] p-3.5 rounded-2xl border border-[#E2EDF9] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#5B708B]">Location:</span>
                <span className="font-semibold text-[#102A4C]">{submittedReport.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B708B]">Felt Heat:</span>
                <span className="font-semibold text-[#EA580C]">{submittedReport.felt_heat} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5B708B]">Timestamp:</span>
                <span className="font-semibold text-[#102A4C]">
                  {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-[#EDF5FF] hover:bg-[#D6E8FF] text-[#0866D9] text-xs font-bold rounded-2xl transition-all"
              >
                Submit Another
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 bg-[#0866D9] hover:bg-[#054EB0] text-white text-xs font-bold rounded-2xl transition-all shadow-sm"
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : (
          /* Report Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Report Type */}
            <div>
              <span className="text-xs font-bold text-[#102A4C] block mb-2">
                1. {t('report.step1', 'Issue Category')}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {reportTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = issueType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setIssueType(type.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-[#EDF5FF] border-[#0866D9] ring-1 ring-[#0866D9] shadow-soft'
                          : 'bg-white border-[#E2EDF9] hover:bg-[#F8FAFD]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${type.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#102A4C]">
                          {type.title}
                        </div>
                        <div className="text-[11px] text-[#5B708B] truncate">
                          {type.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location Picker */}
            <div className="bg-white rounded-3xl p-4 border border-[#E2EDF9] shadow-soft space-y-2.5">
              <span className="text-xs font-bold text-[#102A4C] block">
                2. {t('report.step2', 'Incident Location')}
              </span>

              <div className="flex items-center gap-2 p-2.5 bg-[#F8FAFD] rounded-xl border border-[#D6E8FF]">
                <MapPin className="w-4 h-4 text-[#0866D9] shrink-0" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Street or Landmark..."
                  className="bg-transparent border-none text-xs font-semibold text-[#102A4C] w-full focus:outline-none p-0"
                />
              </div>

              {/* Mini Map pin visual */}
              <div className="relative w-full h-24 rounded-2xl bg-[#EBF3FE] overflow-hidden border border-[#D6E8FF] flex items-center justify-center">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0866D9_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="flex flex-col items-center z-10">
                  <MapPin className="w-7 h-7 text-[#EF4444] animate-bounce drop-shadow-md" />
                  <span className="text-[10px] font-bold text-[#102A4C] bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                    Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Rate Felt Heat */}
            <div>
              <span className="text-xs font-bold text-[#102A4C] block mb-2">
                3. {t('report.step3', 'Rate Felt Heat')}
              </span>
              <HeatSlider value={feltHeat} onChange={setFeltHeat} />
            </div>

            {/* Step 4: Add Details & Photo */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#102A4C] block">
                4. {t('report.step4', 'Details & Photo')}
              </span>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('report.descriptionPlaceholder', 'Describe the issue (e.g. Broken water cooler near market gate, elderly worker dizzy)...')}
                className="w-full p-3.5 bg-white border border-[#E2EDF9] rounded-2xl text-xs text-[#102A4C] focus:ring-2 focus:ring-[#0866D9] focus:outline-none resize-none shadow-soft placeholder:text-[#94A3B8]"
              />

              <PhotoPicker
                onPhotoSelected={(file, preview) => {
                  setPhotoFile(file);
                  setPhotoPreview(preview);
                }}
              />
            </div>

            {/* Step 5: Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#0866D9] hover:bg-[#054EB0] disabled:bg-[#B5D6FF] text-white text-sm font-bold rounded-2xl shadow-elevated flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>{t('report.submittingBtn', 'Uploading & Verifying...')}</span>
                ) : (
                  <>
                    <span>{t('report.submitBtn', 'Submit Report')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
