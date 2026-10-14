import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  BatteryCharging,
  Wifi,
  Clock,
  RefreshCw,
  Sliders,
  ChevronRight,
  X,
  Thermometer,
  Droplets,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { PageHeader } from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { useLiveTelemetry } from '../../hooks/useQueries';
import { useDashboardStore } from '../../store/useDashboardStore';
import { SensorDevice } from '../../types';

export const SensorsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLivePollingActive,
    toggleLivePolling,
    telemetryPollingIntervalSec,
    setTelemetryPollingInterval,
    lastTelemetryRefresh,
  } = useDashboardStore();

  const [selectedSensor, setSelectedSensor] = useState<SensorDevice | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'online' | 'warning' | 'offline'>('ALL');

  const { data: telemetryData, isLoading, isError, refetch } = useLiveTelemetry();

  const sensors = telemetryData?.sensors || [];
  const summary = telemetryData?.summary || { total: 0, online: 0, warning: 0, offline: 0 };

  const filteredSensors = sensors.filter(
    (s) => filterStatus === 'ALL' || s.status === filterStatus
  );

  return (
    <div className="space-y-6 select-none animate-fadeIn pb-12">
      <PageHeader
        title="Live Sensor Telemetry"
        subtitle="Real-time ESP32 IoT microclimate stations deployed across Pune urban hotspots"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Live Sensors' }]}
        actions={
          <div className="flex items-center gap-2">
            {/* Live Polling Interval Selector */}
            <select
              value={telemetryPollingIntervalSec}
              onChange={(e) => setTelemetryPollingInterval(parseInt(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-[#DFEAF7] bg-white text-xs font-semibold text-[#102442] focus:outline-none"
            >
              <option value={15}>Poll: Every 15s</option>
              <option value={30}>Poll: Every 30s</option>
              <option value={60}>Poll: Every 60s</option>
            </select>

            {/* Toggle Polling Button */}
            <button
              onClick={toggleLivePolling}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isLivePollingActive
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {isLivePollingActive ? 'Streaming Active' : 'Polling Paused'}
            </button>

            <button
              onClick={() => refetch()}
              className="p-1.5 rounded-xl border border-[#DFEAF7] bg-white hover:bg-slate-50 text-[#7186A3] hover:text-[#102442]"
              title="Refresh now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div
          onClick={() => setFilterStatus('ALL')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'ALL' ? 'border-[#0866D9] ring-2 ring-blue-100' : 'border-[#DFEAF7]'
          }`}
        >
          <div className="flex items-center justify-between text-[#7186A3]">
            <span>Total Sensors</span>
            <Radio className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-[#102442] mt-1">{summary.total}</div>
          <span className="text-[10px] text-[#7186A3] block mt-0.5">ESP32-S3 IoT nodes</span>
        </div>

        <div
          onClick={() => setFilterStatus('online')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'online' ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-[#DFEAF7]'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span>Online & Healthy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{summary.online}</div>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Reporting &lt; 60s ago</span>
        </div>

        <div
          onClick={() => setFilterStatus('warning')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'warning' ? 'border-amber-500 ring-2 ring-amber-100' : 'border-[#DFEAF7]'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700">
            <span>Thermal Warning</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{summary.warning}</div>
          <span className="text-[10px] text-amber-700 block mt-0.5">&gt; 44°C or low battery</span>
        </div>

        <div
          onClick={() => setFilterStatus('offline')}
          className={`bg-white p-4 rounded-card border cursor-pointer transition-all ${
            filterStatus === 'offline' ? 'border-rose-500 ring-2 ring-rose-100' : 'border-[#DFEAF7]'
          }`}
        >
          <div className="flex items-center justify-between text-rose-700">
            <span>Offline</span>
            <WifiOff className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-1">{summary.offline}</div>
          <span className="text-[10px] text-rose-700 block mt-0.5">Silent &gt; 60 mins</span>
        </div>
      </div>

      {/* Main Sensors Table & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedSensor ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          {isLoading ? (
            <LoadingSkeleton variant="table" rows={6} />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : (
            <div className="bg-white rounded-card border border-[#DFEAF7] shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-[#DFEAF7] text-[#7186A3] font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Sensor Node</th>
                      <th className="py-3 px-4">Location / Ward</th>
                      <th className="py-3 px-4">Temp</th>
                      <th className="py-3 px-4">Humidity</th>
                      <th className="py-3 px-4">Heat Index</th>
                      <th className="py-3 px-4">Battery</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSensors.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSensor(s)}
                        className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                          selectedSensor?.id === s.id ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#102442]">
                          <div>{s.hardware_id}</div>
                          <div className="text-[10px] text-[#7186A3] font-normal">{s.hardware_model}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#102442] truncate max-w-[160px]">{s.location_name}</div>
                          <div className="text-[10px] text-[#7186A3]">{s.ward_name}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          {s.status === 'offline' ? '--' : `${s.temperature_celsius}°C`}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {s.status === 'offline' ? '--' : `${s.humidity_pct}%`}
                        </td>
                        <td className="py-3 px-4 font-black text-red-600">
                          {s.status === 'offline' ? '--' : `${s.heat_index_celsius}°C`}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-semibold ${s.battery_pct < 20 ? 'text-red-600' : 'text-slate-700'}`}>
                            {s.battery_pct}%
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={s.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-[#0866D9] font-bold hover:underline flex items-center justify-end gap-1">
                            Telemetrics →
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Sensor Detail Drawer */}
        {selectedSensor && (
          <div className="lg:col-span-5 bg-white rounded-card border border-[#DFEAF7] p-5 shadow-elevated space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-[#DFEAF7]">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0866D9]">
                  {selectedSensor.hardware_id}
                </span>
                <h3 className="text-base font-bold text-[#102442] leading-tight">
                  {selectedSensor.location_name}
                </h3>
                <span className="text-xs text-[#7186A3]">{selectedSensor.ward_name}</span>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-[#7186A3] hover:text-[#102442] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning callout if flagged */}
            {selectedSensor.warning_reason && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{selectedSensor.warning_reason}</span>
              </div>
            )}

            {/* Current Measurements Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-center">
              <div>
                <span className="text-[10px] text-[#7186A3] block">Heat Index</span>
                <span className="text-lg font-black text-red-600">
                  {selectedSensor.status === 'offline' ? '--' : `${selectedSensor.heat_index_celsius}°C`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7186A3] block">Air Temp</span>
                <span className="text-lg font-black text-[#102442]">
                  {selectedSensor.status === 'offline' ? '--' : `${selectedSensor.temperature_celsius}°C`}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#7186A3] block">Relative Humidity</span>
                <span className="text-lg font-black text-blue-600">
                  {selectedSensor.status === 'offline' ? '--' : `${selectedSensor.humidity_pct}%`}
                </span>
              </div>
            </div>

            {/* Connectivity & Device Health */}
            <div className="space-y-2 text-xs border-y border-[#DFEAF7] py-3">
              <div className="flex justify-between text-[#7186A3]">
                <span>Status:</span>
                <StatusBadge status={selectedSensor.status} />
              </div>
              <div className="flex justify-between text-[#7186A3]">
                <span>Battery Level:</span>
                <span className="font-semibold text-[#102442] flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedSensor.battery_pct}%
                </span>
              </div>
              <div className="flex justify-between text-[#7186A3]">
                <span>Signal Strength:</span>
                <span className="font-semibold text-[#102442] flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5 text-[#0866D9]" />
                  {selectedSensor.rssi_dbm} dBm
                </span>
              </div>
              <div className="flex justify-between text-[#7186A3]">
                <span>Last Telemetry Packet:</span>
                <span className="font-mono text-[#102442]">{selectedSensor.last_reading_at}</span>
              </div>
            </div>

            {/* Diurnal History Line Chart */}
            <div>
              <h4 className="text-xs font-bold text-[#102442] mb-2">Today&apos;s Telemetry Diurnal Trend</h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedSensor.history} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="timestamp" tick={{ fill: '#7186A3', fontSize: 10 }} />
                    <YAxis domain={[20, 50]} tick={{ fill: '#7186A3', fontSize: 10 }} unit="°C" />
                    <Tooltip />
                    <Line type="monotone" dataKey="heat_index_celsius" name="Heat Index (°C)" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="temp_celsius" name="Air Temp (°C)" stroke="#0866D9" strokeWidth={1.5} dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <button
              onClick={() => navigate(`/wards/${selectedSensor.ward_id}`)}
              className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102442] text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span>Inspect {selectedSensor.ward_name} Details</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
