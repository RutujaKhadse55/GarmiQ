import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { PUNE_MUNICIPAL_GEOJSON } from '../../mocks/puneGeoJson';
import { MapLegend } from './MapLegend';
import { MapLayerSelector } from './MapLayerSelector';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RiskMapProps {
  height?: string;
  selectedWardId?: string | null;
  onSelectWard?: (wardId: string) => void;
  showControls?: boolean;
  className?: string;
}

export const RiskMap: React.FC<RiskMapProps> = ({
  height = '500px',
  selectedWardId,
  onSelectWard,
  showControls = true,
  className = '',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'risk' | 'hvi' | 'lst' | 'built_up'>('risk');
  const [opacity, setOpacity] = useState(0.85);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [hoveredWard, setHoveredWard] = useState<any | null>(null);
  const [selectedWard, setSelectedWard] = useState<any | null>(null);
  const navigate = useNavigate();

  // Test WebGL capability
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
      }
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  // Initialize MapLibre
  useEffect(() => {
    if (!webGlSupported || !mapContainer.current || mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'carto-light': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
              ],
              tileSize: 256,
              attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            },
          },
          layers: [
            {
              id: 'carto-light-layer',
              type: 'raster',
              source: 'carto-light',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [73.8567, 18.5204], // Pune City Center
        zoom: 11.5,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      map.on('load', () => {
        setIsMapLoaded(true);

        // Add Wards GeoJSON Source
        map.addSource('pune-wards', {
          type: 'geojson',
          data: PUNE_MUNICIPAL_GEOJSON as any,
        });

        // Wards Polygon Fill Layer
        map.addLayer({
          id: 'wards-fill',
          type: 'fill',
          source: 'pune-wards',
          paint: {
            'fill-color': [
              'match',
              ['get', 'risk_level'],
              'VERY_HIGH', '#EF4444',
              'HIGH', '#F97316',
              'MODERATE', '#F59E0B',
              'LOW', '#10B981',
              '#10B981',
            ],
            'fill-opacity': opacity,
          },
        });

        // Wards Boundary Stroke Layer
        map.addLayer({
          id: 'wards-borders',
          type: 'line',
          source: 'pune-wards',
          paint: {
            'line-color': '#102442',
            'line-width': 1.5,
            'line-opacity': 0.6,
          },
        });

        // Click interaction
        map.on('click', 'wards-fill', (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            setSelectedWard(props);
            if (onSelectWard && props.id) {
              onSelectWard(props.id);
            }
          }
        });

        // Hover effect
        map.on('mousemove', 'wards-fill', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (e.features && e.features[0]) {
            setHoveredWard(e.features[0].properties);
          }
        });

        map.on('mouseleave', 'wards-fill', () => {
          map.getCanvas().style.cursor = '';
          setHoveredWard(null);
        });
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('MapLibre GL error; falling back to SVG choropleth', err);
      setWebGlSupported(false);
    }
  }, [webGlSupported]);

  // Update layer fill color when activeLayer changes
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;
    const map = mapRef.current;

    if (!map.getLayer('wards-fill')) return;

    if (activeLayer === 'hvi') {
      map.setPaintProperty('wards-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'hvi'],
        30, '#10B981',
        60, '#F59E0B',
        80, '#F97316',
        95, '#EF4444',
      ]);
    } else if (activeLayer === 'lst') {
      map.setPaintProperty('wards-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'lst'],
        36, '#FBBF24',
        40, '#F97316',
        43, '#EF4444',
        46, '#991B1B',
      ]);
    } else if (activeLayer === 'built_up') {
      map.setPaintProperty('wards-fill', 'fill-color', [
        'interpolate',
        ['linear'],
        ['get', 'built_up'],
        40, '#34D399',
        65, '#FBBF24',
        85, '#475569',
        95, '#1E293B',
      ]);
    } else {
      map.setPaintProperty('wards-fill', 'fill-color', [
        'match',
        ['get', 'risk_level'],
        'VERY_HIGH', '#EF4444',
        'HIGH', '#F97316',
        'MODERATE', '#F59E0B',
        'LOW', '#10B981',
        '#10B981',
      ]);
    }

    map.setPaintProperty('wards-fill', 'fill-opacity', opacity);
  }, [activeLayer, opacity, isMapLoaded]);

  // Sync selected ward
  useEffect(() => {
    if (selectedWardId) {
      const feat = PUNE_MUNICIPAL_GEOJSON.features.find((f) => f.id === selectedWardId);
      if (feat) {
        setSelectedWard(feat.properties);
      }
    }
  }, [selectedWardId]);

  const handleResetZoom = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [73.8567, 18.5204], zoom: 11.5 });
    }
  };

  return (
    <div
      className={`relative w-full rounded-card overflow-hidden border border-[#DFEAF7] bg-slate-50 shadow-soft select-none ${className}`}
      style={{ height }}
    >
      {/* WebGL Map Container */}
      {webGlSupported ? (
        <div ref={mapContainer} className="w-full h-full" />
      ) : (
        /* Interactive SVG Choropleth Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 relative">
          <div className="text-center mb-4">
            <h4 className="text-sm font-bold text-[#102442]">Pune Municipal Wards Heat Choropleth</h4>
            <p className="text-xs text-[#7186A3]">Interactive civic risk projection</p>
          </div>
          <svg viewBox="0 0 800 500" className="w-full h-4/5 max-h-[400px]">
            {PUNE_MUNICIPAL_GEOJSON.features.map((feat) => {
              const p = feat.properties as any;
              const coords = (feat.geometry as any).coordinates[0];
              // Project lon/lat into SVG space
              const minLon = 73.75, maxLon = 73.96;
              const minLat = 18.45, maxLat = 18.59;
              const points = coords
                .map(([lon, lat]: [number, number]) => {
                  const x = ((lon - minLon) / (maxLon - minLon)) * 700 + 50;
                  const y = 450 - ((lat - minLat) / (maxLat - minLat)) * 400;
                  return `${x},${y}`;
                })
                .join(' ');

              const fillColor =
                activeLayer === 'risk'
                  ? p.risk_level === 'VERY_HIGH'
                    ? '#EF4444'
                    : p.risk_level === 'HIGH'
                    ? '#F97316'
                    : p.risk_level === 'MODERATE'
                    ? '#F59E0B'
                    : '#10B981'
                  : p.hvi > 75
                  ? '#EF4444'
                  : p.hvi > 50
                  ? '#F59E0B'
                  : '#10B981';

              return (
                <g key={feat.id}>
                  <polygon
                    points={points}
                    fill={fillColor}
                    fillOpacity={opacity}
                    stroke="#102442"
                    strokeWidth={selectedWard?.id === p.id ? 3 : 1}
                    className="cursor-pointer transition-all hover:opacity-100 hover:stroke-blue-600"
                    onClick={() => {
                      setSelectedWard(p);
                      if (onSelectWard) onSelectWard(p.id);
                    }}
                    onMouseEnter={() => setHoveredWard(p)}
                    onMouseLeave={() => setHoveredWard(null)}
                  />
                  <text
                    x={coords[0] ? ((coords[0][0] - minLon) / (maxLon - minLon)) * 700 + 40 : 0}
                    y={coords[0] ? 450 - ((coords[0][1] - minLat) / (maxLat - minLat)) * 400 : 0}
                    fontSize="9"
                    fontWeight="bold"
                    fill="#102442"
                    className="pointer-events-none drop-shadow-sm"
                  >
                    {p.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      {/* Layer Controls overlay */}
      {showControls && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 max-w-[210px]">
          <MapLayerSelector
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            opacity={opacity}
            onOpacityChange={setOpacity}
          />
        </div>
      )}

      {/* Legend overlay */}
      {showControls && (
        <div className="absolute bottom-3 left-3 z-10 max-w-[230px]">
          <MapLegend layer={activeLayer} />
        </div>
      )}

      {/* Reset Map Center Control */}
      {showControls && (
        <div className="absolute bottom-3 right-3 z-10 flex gap-1.5">
          <button
            onClick={handleResetZoom}
            className="p-2 rounded-xl bg-white/95 border border-[#DFEAF7] shadow-card text-[#102442] hover:bg-slate-50 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Reset to Pune city center"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0866D9]" />
            Reset Center
          </button>
        </div>
      )}

      {/* Ward Details Card Popup upon Selection */}
      {selectedWard && (
        <div className="absolute top-3 right-3 z-20 w-72 bg-white rounded-card border border-[#DFEAF7] shadow-modal p-4 animate-fadeIn">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#7186A3] uppercase">
                {selectedWard.code || selectedWard.id}
              </span>
              <h4 className="text-sm font-bold text-[#102442] leading-snug">{selectedWard.name}</h4>
            </div>
            <button
              onClick={() => setSelectedWard(null)}
              className="text-[#7186A3] hover:text-[#102442] text-xs font-bold p-1"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] text-[#7186A3]">Heat Index:</span>
              <div className="font-extrabold text-[#102442] text-sm">
                {selectedWard.heat_index || selectedWard.current_heat_index}°C
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#7186A3]">HVI Score:</span>
              <div className="font-extrabold text-[#102442] text-sm">
                {selectedWard.hvi || selectedWard.vulnerability_score}/100
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#7186A3]">LST Temp:</span>
              <div className="font-semibold text-slate-700">
                {selectedWard.lst || selectedWard.lst_celsius || '42.2'}°C
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#7186A3]">Cooling Points:</span>
              <div className="font-semibold text-slate-700">
                {selectedWard.cooling_points || selectedWard.cooling_points_count || 5} centres
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#DFEAF7] flex items-center justify-between">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedWard.risk_level === 'VERY_HIGH'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : selectedWard.risk_level === 'HIGH'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : selectedWard.risk_level === 'MODERATE'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {selectedWard.risk_level}
            </span>

            <button
              onClick={() => navigate(`/wards/${selectedWard.id}`)}
              className="text-xs font-bold text-[#0866D9] hover:text-[#0756B8] hover:underline flex items-center gap-1"
            >
              View Ward Details →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
