import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import maplibregl from 'maplibre-gl';
import { useUserStore } from '../stores/useUserStore';
import { calculateSafeRoute, MOCK_COOLING_POINTS, MOCK_WARDS } from '@garmiq/api-client';
import { SafeRouteResponse, CoolingPoint } from '@garmiq/types';
import { ShadeScoreBar } from '../components/ShadeScoreBar';
import {
  Navigation,
  MapPin,
  Footprints,
  Bike,
  ArrowUpDown,
  ChevronLeft,
  Trees,
  Droplet,
  Building2,
  ExternalLink,
  ShieldCheck,
  Compass,
  AlertCircle
} from 'lucide-react';

interface RoutePreset {
  name: string;
  lat: number;
  lon: number;
}

const PUNE_PRESETS: RoutePreset[] = [
  { name: 'Shivajinagar Station', lat: 18.5314, lon: 73.8446 },
  { name: 'Sambhaji Garden (JM Rd)', lat: 18.5255, lon: 73.8475 },
  { name: 'Sassoon Hospital', lat: 18.5276, lon: 73.8735 },
  { name: 'Swargate Chowk', lat: 18.5012, lon: 73.8590 },
  { name: 'Saras Baug', lat: 18.5005, lon: 73.8530 }
];

export const RoutePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userLocation } = useUserStore();

  const destNameParam = searchParams.get('destName') || 'Sambhaji Garden Shaded Canopy';
  const destLatParam = parseFloat(searchParams.get('destLat') || '18.5255');
  const destLonParam = parseFloat(searchParams.get('destLon') || '73.8475');

  const isDelhi = userLocation.address?.toLowerCase().includes('delhi');
  const [origin, setOrigin] = useState<RoutePreset>({
    name: isDelhi || !userLocation.address ? 'Shivajinagar Station, Pune' : userLocation.address,
    lat: isDelhi || !userLocation.lat ? 18.5314 : userLocation.lat,
    lon: isDelhi || !userLocation.lon ? 73.8446 : userLocation.lon
  });

  const [destination, setDestination] = useState<RoutePreset>({
    name: destNameParam,
    lat: destLatParam,
    lon: destLonParam
  });

  const [mode, setMode] = useState<'walk' | 'bike'>('walk');
  const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState<SafeRouteResponse[]>([]);

  // MapLibre references
  const routeMapContainer = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Swap Origin and Destination
  const handleSwap = () => {
    const temp = { ...origin };
    setOrigin(destination);
    setDestination(temp);
  };

  // Use GPS location
  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigin({
            name: 'My GPS Location',
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        () => {
          setOrigin({
            name: 'Shivajinagar (Pune Center)',
            lat: 18.5314,
            lon: 73.8446
          });
        }
      );
    }
  };

  // Calculate Routes (Shaded vs Direct)
  useEffect(() => {
    let isCancelled = false;

    const fetchRoutes = async () => {
      setIsLoading(true);
      try {
        // Primary Shaded Route
        const shadedResult = await calculateSafeRoute({
          origin: { lat: origin.lat, lon: origin.lon, name: origin.name },
          destination: { lat: destination.lat, lon: destination.lon, name: destination.name },
          mode
        });

        // Direct Alternative Route (Faster, but less shade)
        const directResult: SafeRouteResponse = {
          route_id: `direct-${Date.now()}`,
          mode,
          distance_km: Math.max(0.8, +(shadedResult.distance_km * 0.85).toFixed(1)),
          duration_mins: Math.max(5, Math.round(shadedResult.duration_mins * 0.75)),
          shade_score: 34,
          risk_level: 'HIGH',
          summary: 'Direct Arterial Route via Main Avenue',
          advisory: 'Slightly shorter by 4-6 minutes, but traverses unshaded asphalt with high solar reflection.',
          waypoints: [
            [origin.lon, origin.lat],
            [(origin.lon + destination.lon) / 2, (origin.lat + destination.lat) / 2],
            [destination.lon, destination.lat]
          ]
        };

        if (!isCancelled) {
          setRoutes([shadedResult, directResult]);
        }
      } catch (err) {
        console.error('Route calculation error:', err);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    fetchRoutes();

    return () => {
      isCancelled = true;
    };
  }, [origin, destination, mode]);

  // 1. Initialize MapLibre Map
  useEffect(() => {
    if (!routeMapContainer.current || mapInstanceRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: routeMapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
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
        center: [(origin.lon + destination.lon) / 2, (origin.lat + destination.lat) / 2],
        zoom: 13,
        attributionControl: false
      });

      map.on('load', () => {
        // Add empty route source & line layer
        map.addSource('route-path', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: [
                [origin.lon, origin.lat],
                [destination.lon, destination.lat]
              ]
            }
          }
        });

        // Halo / shade buffer layer
        map.addLayer({
          id: 'route-halo',
          type: 'line',
          source: 'route-path',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#36B878',
            'line-width': 10,
            'line-opacity': 0.35
          }
        });

        // Main polyline layer
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-path',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#1769E0',
            'line-width': 4.5
          }
        });
      });

      mapInstanceRef.current = map;
    } catch (err) {
      console.warn('MapLibre init error in RoutePage:', err);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Update Map Markers & Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Origin Pin
    const originEl = document.createElement('div');
    originEl.innerHTML = `
      <div style="width: 26px; height: 26px; border-radius: 9999px; background: #1769E0; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 8px rgba(23,49,83,0.3); display: flex; align-items: center; justify-content: center; color: white;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
      </div>
    `;
    const originMarker = new maplibregl.Marker({ element: originEl })
      .setLngLat([origin.lon, origin.lat])
      .addTo(map);

    // Destination Pin
    const destEl = document.createElement('div');
    destEl.innerHTML = `
      <div style="width: 28px; height: 28px; border-radius: 9999px; background: #E5484D; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 8px rgba(23,49,83,0.3); display: flex; align-items: center; justify-content: center; color: white;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
    `;
    const destMarker = new maplibregl.Marker({ element: destEl })
      .setLngLat([destination.lon, destination.lat])
      .addTo(map);

    markersRef.current = [originMarker, destMarker];

    // Add nearby relief markers along corridor
    MOCK_COOLING_POINTS.slice(0, 3).forEach((cp) => {
      const poiEl = document.createElement('div');
      const isWater = cp.type === 'water_point';
      poiEl.innerHTML = `
        <div style="width: 22px; height: 22px; border-radius: 9999px; background: ${isWater ? '#0284C7' : '#36B878'}; border: 2px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white;">
          ${isWater 
            ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>'
            : '<svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/></svg>'
          }
        </div>
      `;
      const poiMarker = new maplibregl.Marker({ element: poiEl })
        .setLngLat([cp.lon, cp.lat])
        .addTo(map);
      markersRef.current.push(poiMarker);
    });

    // Update GeoJSON route polyline
    const activeRoute = routes[selectedRouteIndex];
    if (activeRoute && activeRoute.waypoints.length > 0 && map.getSource('route-path')) {
      const source = map.getSource('route-path') as maplibregl.GeoJSONSource;
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: activeRoute.waypoints
        }
      });

      // Fit bounds to route
      const bounds = new maplibregl.LngLatBounds();
      activeRoute.waypoints.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 40, maxZoom: 14.5 });
    }
  }, [routes, selectedRouteIndex, origin, destination]);

  const activeRoute = routes[selectedRouteIndex] || routes[0];

  // External Google Maps directions
  const handleOpenGoogleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lon}&destination=${destination.lat},${destination.lon}&travelmode=${mode === 'bike' ? 'bicycling' : 'walking'}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2EAF4] px-4 py-3 shadow-soft">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-2xl bg-[#F5F8FC] border border-[#E2EAF4] flex items-center justify-center text-[#173153] hover:bg-[#EEF5FE] transition-colors"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-[#173153]">
              Safe Shaded Route Finder
            </h1>
            <p className="text-[11px] text-[#71829A]">
              Find cooler walking and cycling routes in Pune
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-3.5 space-y-4">
        {/* Origin & Destination Form (Elevated White Card) */}
        <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft space-y-3">
          {/* Origin field */}
          <div className="flex items-center gap-2.5 p-2.5 bg-[#F5F8FC] rounded-2xl border border-[#E2EAF4]">
            <div className="w-7 h-7 rounded-xl bg-[#EEF5FE] text-[#1769E0] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#1769E0]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#71829A] font-bold uppercase tracking-wider block">
                Start Origin
              </span>
              <input
                type="text"
                value={origin.name}
                onChange={(e) => setOrigin((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-none text-xs font-bold text-[#173153] p-0 focus:outline-none truncate"
              />
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="text-[10px] font-bold text-[#1769E0] bg-[#EEF5FE] hover:bg-[#D7E7FD] px-2 py-1 rounded-lg shrink-0"
            >
              GPS
            </button>
          </div>

          {/* Swap Button Divider */}
          <div className="flex items-center justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-white border border-[#E2EAF4] shadow-soft flex items-center justify-center text-[#71829A] hover:text-[#1769E0] transition-colors active:scale-95 z-10"
              title="Swap Origin and Destination"
              aria-label="Swap"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination field */}
          <div className="flex items-center gap-2.5 p-2.5 bg-[#F5F8FC] rounded-2xl border border-[#E2EAF4]">
            <div className="w-7 h-7 rounded-xl bg-[#FEF3ED] text-[#F47738] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#F47738]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-[#71829A] font-bold uppercase tracking-wider block">
                Destination
              </span>
              <input
                type="text"
                value={destination.name}
                onChange={(e) => setDestination((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-transparent border-none text-xs font-bold text-[#173153] p-0 focus:outline-none truncate"
              />
            </div>
          </div>

          {/* Pune Quick Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            <span className="text-[10px] font-bold text-[#71829A] uppercase shrink-0">
              Presets:
            </span>
            {PUNE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDestination(preset)}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F5F8FC] border border-[#E2EAF4] text-[#173153] hover:bg-[#EEF5FE] whitespace-nowrap shrink-0 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Travel Mode Selector: Segmented Control */}
          <div className="flex items-center gap-2 pt-1 border-t border-[#F5F8FC]">
            <button
              type="button"
              onClick={() => setMode('walk')}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'walk'
                  ? 'bg-[#1769E0] text-white shadow-soft'
                  : 'bg-[#F5F8FC] border border-[#E2EAF4] text-[#71829A] hover:bg-[#EEF5FE]'
              }`}
            >
              <Footprints className="w-4 h-4" />
              <span>Walking</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('bike')}
              className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                mode === 'bike'
                  ? 'bg-[#1769E0] text-white shadow-soft'
                  : 'bg-[#F5F8FC] border border-[#E2EAF4] text-[#71829A] hover:bg-[#EEF5FE]'
              }`}
            >
              <Bike className="w-4 h-4" />
              <span>Cycling</span>
            </button>
          </div>
        </div>

        {/* Real Geographic Route Map (MapLibre Basemap) */}
        <div className="relative w-full h-60 rounded-3xl bg-[#F5F8FC] overflow-hidden border border-[#E2EAF4] shadow-soft select-none">
          <div ref={routeMapContainer} className="absolute inset-0 w-full h-full" />

          {/* Route Map Overlay Badge */}
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#E2EAF4] text-[10px] font-bold text-[#1E7E4D] flex items-center gap-1.5 shadow-soft z-20">
            <Trees className="w-3.5 h-3.5 text-[#36B878]" />
            <span>Pune Tree-Canopy Corridor</span>
          </div>

          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-[#E2EAF4] text-[9px] font-semibold text-[#71829A] shadow-2xs z-20">
            Live Basemap
          </div>
        </div>

        {/* Route Alternatives Selection */}
        {routes.length > 1 && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block">
              Route Options
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Option 1: Shaded Route */}
              <button
                type="button"
                onClick={() => setSelectedRouteIndex(0)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedRouteIndex === 0
                    ? 'bg-[#EBFBF3] border-[#36B878] ring-2 ring-[#36B878] shadow-soft'
                    : 'bg-white border-[#E2EAF4] hover:bg-[#F5F8FC]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E7E4D] mb-1">
                  <Trees className="w-3.5 h-3.5 text-[#36B878]" />
                  <span>Shaded Corridor</span>
                </div>
                <div className="text-sm font-black text-[#173153]">
                  {routes[0].duration_mins} mins
                </div>
                <div className="text-[10px] text-[#71829A] mt-0.5">
                  {routes[0].distance_km} km • {routes[0].shade_score}% tree canopy
                </div>
              </button>

              {/* Option 2: Direct Route */}
              <button
                type="button"
                onClick={() => setSelectedRouteIndex(1)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedRouteIndex === 1
                    ? 'bg-[#FEF3ED] border-[#F47738] ring-2 ring-[#F47738] shadow-soft'
                    : 'bg-white border-[#E2EAF4] hover:bg-[#F5F8FC]'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#9E4010] mb-1">
                  <Compass className="w-3.5 h-3.5 text-[#F47738]" />
                  <span>Direct Arterial</span>
                </div>
                <div className="text-sm font-black text-[#173153]">
                  {routes[1].duration_mins} mins
                </div>
                <div className="text-[10px] text-[#71829A] mt-0.5">
                  {routes[1].distance_km} km • High solar exposure
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Results: Shade Score Bar & Analysis */}
        {isLoading ? (
          <div className="p-6 bg-white rounded-3xl border border-[#E2EAF4] text-center text-xs text-[#71829A] animate-pulse">
            Analyzing street canopy & thermal shelter access in Pune...
          </div>
        ) : activeRoute ? (
          <div className="space-y-3.5">
            <ShadeScoreBar
              score={activeRoute.shade_score}
              distanceKm={activeRoute.distance_km}
              durationMins={activeRoute.duration_mins}
              mode={mode}
              routeName={activeRoute.summary}
            />

            {/* Advisory Details */}
            <div className="bg-white rounded-3xl p-4 border border-[#E2EAF4] shadow-soft space-y-2">
              <h3 className="text-xs font-bold text-[#173153]">
                {activeRoute.summary}
              </h3>
              <p className="text-xs text-[#71829A] leading-relaxed">
                {activeRoute.advisory}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs text-[#1E7E4D] font-bold border-t border-[#F5F8FC]">
                <span className="flex items-center gap-1">
                  <Trees className="w-3.5 h-3.5 text-[#36B878]" />
                  {activeRoute.shade_score}% Tree Canopy
                </span>
                <span className="flex items-center gap-1 text-[#1769E0]">
                  <Droplet className="w-3.5 h-3.5" />
                  2 Hydration Kiosks
                </span>
              </div>
            </div>

            {/* Nearby Amenities Along Route */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#173153] uppercase tracking-wider block">
                Relief Points Along This Corridor
              </span>
              <div className="space-y-2">
                {MOCK_COOLING_POINTS.slice(0, 2).map((pt) => (
                  <div
                    key={pt.id}
                    className="p-3 bg-white rounded-2xl border border-[#E2EAF4] shadow-soft flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#EEF5FE] text-[#1769E0] flex items-center justify-center shrink-0">
                        {pt.type === 'water_point' ? (
                          <Droplet className="w-4 h-4 text-[#0284C7]" />
                        ) : (
                          <Building2 className="w-4 h-4 text-[#1769E0]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#173153] truncate">
                          {pt.name}
                        </h4>
                        <p className="text-[10px] text-[#71829A] truncate">
                          {pt.address} • {pt.operating_hours}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/map?point=${pt.id}`)}
                      className="text-[11px] font-bold text-[#1769E0] hover:underline shrink-0"
                    >
                      View on Map
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button: External Directions */}
            <button
              type="button"
              onClick={handleOpenGoogleDirections}
              className="w-full py-3.5 px-4 bg-[#1769E0] hover:bg-[#0E52BE] text-white text-xs font-bold rounded-2xl shadow-soft flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4 fill-current" />
              <span>View Route Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : null}
      </main>
    </div>
  );
};
