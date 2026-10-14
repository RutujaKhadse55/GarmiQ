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
  ArrowRight,
  ChevronLeft,
  AlertTriangle
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
      title: 'Heat Hotspot',
      desc: 'Severe radiating asphalt or trapped hot air corridor',
      icon: Flame,
      color: 'bg-[#FEF3ED] text-[#F47738] border-[#FCD2BE]'
    },
    {
      id: 'no_shade' as ReportType,
      title: 'No Shade / Exposed Stop',
      desc: 'Uncovered bus stop, market queue, or bare public area',
      icon: Umbrella,
      color: 'bg-[#FEF9EE] text-[#F3B43F] border-[#FCE3AA]'
    },
    {
      id: 'no_water' as ReportType,
      title: 'No Drinking Water',
      desc: 'Broken civic cooler, dried water post, or public tap fault',
      icon: Droplet,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      id: 'vulnerable_person' as ReportType,
      title: 'Vulnerable Person Assistance',
      desc: 'Elderly citizen or outdoor worker showing signs of heat distress',
      icon: HeartHandshake,
      color: 'bg-[#FDF0F1] text-[#E5484D] border-[#F9C3C6]'
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
              Report a Heat Hazard
            </h1>
            <p className="text-[11px] text-[#71829A]">
              Pune Municipal Corporation Civic Response
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-4">
        {submittedReport ? (
          /* Confirmation Success Screen */
          <div className="bg-white rounded-3xl p-6 border border-[#E2EAF4] shadow-soft text-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-[#EBFBF3] text-[#36B878] flex items-center justify-center mx-auto border-2 border-[#B7EDCE] shadow-soft">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#173153]">
                {submittedReport.status === 'submitted'
                  ? 'Report Submitted Successfully!'
                  : 'Report Queued Offline'}
              </h2>
              <p className="text-xs text-[#71829A] mt-1 leading-relaxed">
                {submittedReport.status === 'submitted'
                  ? 'Your submission has been registered with the PMC Disaster Response and Heat Mitigation cell.'
                  : 'Report stored locally on your device. Will automatically sync when data connectivity is restored.'}
              </p>
            </div>

            {submittedReport.reference_number && (
              <div className="p-3 bg-[#EEF5FE] rounded-2xl border border-[#D7E7FD]">
                <span className="text-[10px] uppercase font-bold text-[#71829A] block">
                  Reference Tracking Code
                </span>
                <span className="text-base font-mono font-bold text-[#1769E0]">
                  {submittedReport.reference_number}
                </span>
              </div>
            )}

            <div className="text-left text-xs bg-[#F5F8FC] p-3.5 rounded-2xl border border-[#E2EAF4] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#71829A]">Location:</span>
                <span className="font-bold text-[#173153]">{submittedReport.location_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71829A]">Severity:</span>
                <span className="font-bold text-[#F47738]">{submittedReport.felt_heat} / 5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#71829A]">Status:</span>
                <span className="font-bold text-[#36B878] uppercase text-[10px]">
                  {submittedReport.status}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 px-4 bg-[#EEF5FE] hover:bg-[#D7E7FD] text-[#1769E0] text-xs font-bold rounded-2xl transition-all"
              >
                Submit Another
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl transition-all shadow-soft"
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
              <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block mb-2">
                1. Select Hazard Category
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
                          ? 'bg-[#EEF5FE] border-[#1769E0] ring-1 ring-[#1769E0] shadow-soft'
                          : 'bg-white border-[#E2EAF4] hover:bg-[#F5F8FC]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${type.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#173153]">
                          {type.title}
                        </div>
                        <div className="text-[11px] text-[#71829A] truncate">
                          {type.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location Picker */}
            <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft space-y-2.5">
              <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block">
                2. Hazard Location
              </span>

              <div className="flex items-center gap-2 p-2.5 bg-[#F5F8FC] rounded-2xl border border-[#E2EAF4]">
                <MapPin className="w-4 h-4 text-[#1769E0] shrink-0" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Street or Landmark in Pune..."
                  className="bg-transparent border-none text-xs font-bold text-[#173153] w-full focus:outline-none p-0"
                />
              </div>

              {/* Coordinates summary */}
              <div className="flex items-center justify-between px-1 text-[11px] text-[#71829A]">
                <span>Coordinates:</span>
                <span className="font-mono text-[#173153]">
                  {lat.toFixed(4)}° N, {lon.toFixed(4)}° E
                </span>
              </div>
            </div>

            {/* Step 3: Rate Felt Heat */}
            <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft space-y-2.5">
              <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block">
                3. Rate Thermal Stress
              </span>
              <HeatSlider value={feltHeat} onChange={setFeltHeat} />
            </div>

            {/* Step 4: Description & Optional Photo */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block">
                4. Description & Photo
              </span>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details: broken water post near chowk, lack of shade canopy at bus stop..."
                className="w-full p-3.5 bg-white border border-[#E2EAF4] rounded-2xl text-xs text-[#173153] focus:ring-2 focus:ring-[#1769E0] focus:outline-none resize-none shadow-soft placeholder:text-[#71829A]"
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
                className="w-full py-3.5 px-6 bg-[#1769E0] hover:bg-[#0E52BE] disabled:bg-[#B6D6FC] text-white text-xs font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span>Registering Report with PMC...</span>
                ) : (
                  <>
                    <span>Submit Hazard Report</span>
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
