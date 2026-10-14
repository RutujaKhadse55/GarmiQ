import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import maplibregl from 'maplibre-gl';
import { Ward, CoolingPoint, HeatRiskLevel } from '@garmiq/types';
import { PUNE_WARDS_GEOJSON } from '@garmiq/api-client';
import { MapLegend } from './MapLegend';
import {
  Layers,
  Plus,
  Minus,
  LocateFixed,
  Building2,
  Droplet,
  Trees,
  Stethoscope,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

interface MapViewProps {
  wards: Ward[];
  coolingPoints: CoolingPoint[];
  selectedWard: Ward | null;
  selectedCoolingPoint?: CoolingPoint | null;
  onSelectWard: (ward: Ward) => void;
  onSelectCoolingPoint: (point: CoolingPoint) => void;
  activeFilter: string;
}

export const MapView: React.FC<MapViewProps> = ({
  wards,
  coolingPoints,
  selectedWard,
  selectedCoolingPoint,
  onSelectWard,
  onSelectCoolingPoint,
  activeFilter
}) => {
  const { t } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker[]>([]);

  // Layer Visibility States
  const [showLayersSheet, setShowLayersSheet] = useState(false);
  const [layersConfig, setLayersConfig] = useState({
    heatRiskOverlay: true,
    wardBoundaries: true,
    coolingCentres: true,
    waterStations: true,
    medicalAssistance: true
  });

  const [mapError, setMapError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Filter cooling points based on active filter chip and layer settings
  const filteredPoints = coolingPoints.filter((pt) => {
    // Check layer visibility toggle first
    if (pt.type === 'shelter' && !layersConfig.coolingCentres) return false;
    if (pt.type === 'water_point' && !layersConfig.waterStations) return false;
    if (pt.type === 'clinic' && !layersConfig.medicalAssistance) return false;

    // Check header segmented filter
    if (activeFilter === 'all') return true;
    return pt.type === activeFilter;
  });

  // 1. Initialize MapLibre GL Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [73.8567, 18.5204], // Pune Center (Shivajinagar/Kasba Peth)
        zoom: 12.3,
        attributionControl: false
      });

      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

      map.on('load', () => {
        // Add Pune Wards GeoJSON Source
        map.addSource('pune-wards', {
          type: 'geojson',
          data: PUNE_WARDS_GEOJSON
        });

        // Add Ward Fill Layer (semi-transparent heat risk choropleth)
        map.addLayer({
          id: 'pune-wards-fill',
          type: 'fill',
          source: 'pune-wards',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.24
          }
        });

        // Add Ward Boundary Stroke Layer
        map.addLayer({
          id: 'pune-wards-stroke',
          type: 'line',
          source: 'pune-wards',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': 2,
            'line-opacity': 0.85
          }
        });

        // Interactive ward tap handling
        map.on('click', 'pune-wards-fill', (e) => {
          if (e.features && e.features[0]) {
            const wardId = e.features[0].properties?.id;
            const clickedWard = wards.find((w) => w.id === wardId);
            if (clickedWard) {
              onSelectWard(clickedWard);
            }
          }
        });

        map.on('mouseenter', 'pune-wards-fill', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'pune-wards-fill', () => {
          map.getCanvas().style.cursor = '';
        });

        // Add citizen location marker in Pune (Shivajinagar)
        const userEl = document.createElement('div');
        userEl.className = 'garmiq-user-location-marker';
        userEl.innerHTML = `
          <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 22px; height: 22px; border-radius: 9999px; background: rgba(23, 105, 224, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 12px; height: 12px; border-radius: 9999px; background: #1769E0; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(23, 49, 83, 0.3);"></div>
          </div>
        `;
        const userMarker = new maplibregl.Marker({ element: userEl })
          .setLngLat([73.8446, 18.5314])
          .addTo(map);
        userMarkerRef.current = [userMarker];
      });

      map.on('error', (e) => {
        console.warn('MapLibre error:', e);
      });

      mapInstanceRef.current = map;
    } catch (err: any) {
      console.error('Failed to initialize MapLibre map:', err);
      setMapError('Unable to load interactive map tiles. Please check your internet connection.');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Sync Layer Visibility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('pune-wards-fill')) {
      map.setLayoutProperty(
        'pune-wards-fill',
        'visibility',
        layersConfig.heatRiskOverlay ? 'visible' : 'none'
      );
    }
    if (map.getLayer('pune-wards-stroke')) {
      map.setLayoutProperty(
        'pune-wards-stroke',
        'visibility',
        layersConfig.wardBoundaries ? 'visible' : 'none'
      );
    }
  }, [layersConfig.heatRiskOverlay, layersConfig.wardBoundaries]);

  // 3. Render Geographically Anchored Resource Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Category styling & SVG icons
    const markerStyles = {
      shelter: {
        bg: '#1769E0',
        svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg>`
      },
      water_point: {
        bg: '#0284C7',
        svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>`
      },
      park: {
        bg: '#36B878',
        svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-3.5-4.5a1 1 0 0 0-1.6 0L8.4 7.3a1 1 0 0 0 .8 1.7H10"/></svg>`
      },
      clinic: {
        bg: '#E5484D',
        svg: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m11 2-2.5 5h5L11 2"/><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`
      }
    };

    filteredPoints.forEach((pt) => {
      const style = markerStyles[pt.type as keyof typeof markerStyles] || markerStyles.shelter;
      const isSelected = selectedCoolingPoint?.id === pt.id;

      const markerEl = document.createElement('div');
      markerEl.className = 'garmiq-poi-marker';
      markerEl.style.cursor = 'pointer';
      markerEl.innerHTML = `
        <div style="
          width: ${isSelected ? '36px' : '30px'};
          height: ${isSelected ? '36px' : '30px'};
          border-radius: 9999px;
          background-color: ${style.bg};
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(23, 49, 83, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
          ${isSelected ? 'transform: scale(1.15); ring: 3px solid #1769E0;' : ''}
        ">
          ${style.svg}
        </div>
      `;

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectCoolingPoint(pt);
        if (map) {
          map.flyTo({ center: [pt.lon, pt.lat], zoom: 14.2, speed: 0.8 });
        }
      });

      const marker = new maplibregl.Marker({ element: markerEl })
        .setLngLat([pt.lon, pt.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [filteredPoints, selectedCoolingPoint, onSelectCoolingPoint]);

  // Map Controls Callbacks
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleLocateMe = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const { latitude, longitude } = pos.coords;
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 14.5,
              speed: 1.2
            });
            // Update user marker position
            userMarkerRef.current.forEach((m) => m.setLngLat([longitude, latitude]));
          }
        },
        () => {
          setIsLocating(false);
          // Graceful fallback to Pune Shivajinagar
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo({
              center: [73.8446, 18.5314],
              zoom: 13.5,
              speed: 1.2
            });
          }
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setIsLocating(false);
      mapInstanceRef.current?.flyTo({ center: [73.8446, 18.5314], zoom: 13.5 });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-168px)] min-h-[460px] bg-[#F5F8FC] overflow-hidden rounded-3xl border border-[#E2EAF4] shadow-soft select-none">
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Fallback state if tiles/WebGL fail */}
      {mapError && (
        <div className="absolute inset-x-4 top-4 z-40 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rose-200 shadow-soft flex items-center gap-2.5 text-xs text-[#E5484D]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{mapError}</span>
        </div>
      )}

      {/* Map Controls: Consistent Vertical Stack (Top Right) */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-2.5">
        {/* Layers Button */}
        <button
          onClick={() => setShowLayersSheet(!showLayersSheet)}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-soft transition-all active:scale-95 ${
            showLayersSheet
              ? 'bg-[#1769E0] text-white border-[#1769E0]'
              : 'bg-white text-[#173153] border-[#E2EAF4] hover:bg-[#F5F8FC]'
          }`}
          title="Map Layers"
          aria-label="Map Layers"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-2xl bg-white text-[#173153] border border-[#E2EAF4] flex items-center justify-center shadow-soft hover:bg-[#F5F8FC] active:scale-95 transition-all"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-2xl bg-white text-[#173153] border border-[#E2EAF4] flex items-center justify-center shadow-soft hover:bg-[#F5F8FC] active:scale-95 transition-all"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>

        {/* Locate Me */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`w-10 h-10 rounded-2xl bg-white border border-[#E2EAF4] flex items-center justify-center shadow-soft hover:bg-[#EEF5FE] active:scale-95 transition-all ${
            isLocating ? 'text-[#71829A] animate-pulse' : 'text-[#1769E0]'
          }`}
          title="Locate Me"
          aria-label="Locate Me"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Risk Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-30">
        <MapLegend />
      </div>

      {/* Layers Bottom Sheet / Modal */}
      {showLayersSheet && (
        <div className="absolute inset-x-3 bottom-4 z-40 bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-floating animate-slide-up">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F5F8FC] mb-2.5">
            <div>
              <h4 className="text-xs font-bold text-[#173153] uppercase tracking-wider">
                Map Layers
              </h4>
              <p className="text-[10px] text-[#71829A]">Toggle heat and safety features</p>
            </div>
            <button
              onClick={() => setShowLayersSheet(false)}
              className="w-7 h-7 rounded-full bg-[#F5F8FC] flex items-center justify-center text-[#71829A] hover:bg-[#EEF5FE]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Heat Risk Overlay */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F8FC] cursor-pointer">
              <span className="font-semibold text-[#173153]">Heat-Risk Overlay</span>
              <input
                type="checkbox"
                checked={layersConfig.heatRiskOverlay}
                onChange={(e) =>
                  setLayersConfig((prev) => ({ ...prev, heatRiskOverlay: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0]"
              />
            </label>

            {/* Ward Boundaries */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F8FC] cursor-pointer">
              <span className="font-semibold text-[#173153]">PMC Ward Boundaries</span>
              <input
                type="checkbox"
                checked={layersConfig.wardBoundaries}
                onChange={(e) =>
                  setLayersConfig((prev) => ({ ...prev, wardBoundaries: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0]"
              />
            </label>

            {/* Cooling Shelters */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F8FC] cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1769E0]" />
                <span className="font-semibold text-[#173153]">Cooling Centres</span>
              </div>
              <input
                type="checkbox"
                checked={layersConfig.coolingCentres}
                onChange={(e) =>
                  setLayersConfig((prev) => ({ ...prev, coolingCentres: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0]"
              />
            </label>

            {/* Water Stations */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F8FC] cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                <span className="font-semibold text-[#173153]">Water Stations</span>
              </div>
              <input
                type="checkbox"
                checked={layersConfig.waterStations}
                onChange={(e) =>
                  setLayersConfig((prev) => ({ ...prev, waterStations: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0]"
              />
            </label>

            {/* Medical Units */}
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F8FC] cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5484D]" />
                <span className="font-semibold text-[#173153]">Heat Clinics & Emergency</span>
              </div>
              <input
                type="checkbox"
                checked={layersConfig.medicalAssistance}
                onChange={(e) =>
                  setLayersConfig((prev) => ({ ...prev, medicalAssistance: e.target.checked }))
                }
                className="w-4 h-4 rounded text-[#1769E0] focus:ring-[#1769E0]"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
