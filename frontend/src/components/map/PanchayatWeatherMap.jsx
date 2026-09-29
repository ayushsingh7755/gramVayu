import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  GeoJSON,
  useMap,
} from 'react-leaflet';
import { Link } from 'react-router-dom';
import sampleBlockBoundaries from '../../assets/sampleBlockBoundaries.json';
import { getRiskMarkerColor } from '../../utils/formatters';
import { RiskBadge } from '../common/RiskBadge';

const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 11, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const PanchayatWeatherMap = ({
  panchayats = [],
  selectedPanchayatId = null,
  onSelectPanchayat = null,
  height = '460px',
  showBlockBoundaries = true,
}) => {
  const tileUrl =
    import.meta.env.VITE_MAP_TILE_URL ||
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const activePanchayat =
    panchayats.find((p) => p._id === selectedPanchayatId) || panchayats[0];

  const center = activePanchayat
    ? [activePanchayat.latitude, activePanchayat.longitude]
    : [28.6092, 76.9798];

  const geoJsonStyle = (feature) => ({
    color: feature.properties?.color || '#2563eb',
    weight: 2,
    opacity: 0.65,
    dashArray: '6 4',
    fillColor: feature.properties?.color || '#3b82f6',
    fillOpacity: 0.06,
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Interactive Panchayat Spatial Weather & Risk Map
          </h3>
          <p className="text-xs text-slate-500">
            Click any Panchayat marker to inspect simulated high-resolution forecast & risk status
          </p>
        </div>

        {/* Risk Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-600 inline-block" />
            Normal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block" />
            Moderate Risk
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-orange-600 inline-block" />
            High Risk
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-600 inline-block" />
            Severe Risk
          </span>
        </div>
      </div>

      <div style={{ height }} className="w-full overflow-hidden rounded-xl border border-slate-200">
        <MapContainer
          center={center}
          zoom={11}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url={tileUrl}
          />

          <MapRecenter
            center={center}
            zoom={selectedPanchayatId ? 12 : 11}
          />

          {showBlockBoundaries && (
            <GeoJSON data={sampleBlockBoundaries} style={geoJsonStyle} />
          )}

          {panchayats.map((p) => {
            const w = p.latestWeather || p.currentWeather || {};
            const riskLevel = p.risk?.riskLevel || w.risk?.riskLevel || 'low';
            const fillColor = getRiskMarkerColor(riskLevel);
            const isSelected = p._id === selectedPanchayatId;

            return (
              <CircleMarker
                key={p._id}
                center={[p.latitude, p.longitude]}
                radius={isSelected ? 12 : 9}
                pathOptions={{
                  color: isSelected ? '#0f172a' : '#ffffff',
                  weight: isSelected ? 3 : 2,
                  fillColor,
                  fillOpacity: 0.9,
                }}
                eventHandlers={{
                  click: () => {
                    if (onSelectPanchayat) onSelectPanchayat(p._id);
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[220px] space-y-2 text-xs text-slate-800">
                    <div className="border-b border-slate-200 pb-1.5">
                      <p className="font-bold text-sm text-slate-900">
                        {p.name}
                      </p>
                      <p className="text-slate-500">
                        Block: {p.block?.name || '—'} | District:{' '}
                        {p.district?.name || '—'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Risk Status:</span>
                      <RiskBadge level={riskLevel} />
                    </div>

                    {w.temperature !== undefined ? (
                      <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-slate-500 block">Temperature</span>
                          <span className="font-bold text-slate-900">
                            {w.temperature}°C
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Rainfall</span>
                          <span className="font-bold text-blue-700">
                            {w.rainfall} mm
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Humidity</span>
                          <span className="font-semibold">{w.humidity}%</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Wind Speed</span>
                          <span className="font-semibold">{w.windSpeed} km/h</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Rain Prob.</span>
                          <span className="font-semibold">
                            {w.probabilityOfRain ?? 20}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Forecast Date</span>
                          <span className="font-semibold">{w.date}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-500 italic">
                        No simulated forecast generated yet
                      </p>
                    )}

                    <div className="pt-1 flex justify-between items-center">
                      <span className="text-[10px] text-amber-700 font-medium">
                        Simulated Downscaled
                      </span>
                      <Link
                        to={`/panchayats/${p._id}`}
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        Full Details →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
