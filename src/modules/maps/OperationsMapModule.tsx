import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Flame,
  Waves,
  Shield,
  Truck,
  Phone,
  Layers,
  Filter,
  Eye,
  Crosshair,
  Building,
} from 'lucide-react';

interface MapIncident {
  id: string;
  title: string;
  category: 'flood' | 'fire' | 'storm' | 'shelter' | 'supply' | 'patrol';
  categoryLabel: string;
  position: { lat: number; lng: number };
  severity: 'high' | 'medium' | 'low';
  description: string;
  address: string;
  officerInCharge: string;
  phone: string;
  timestamp: string;
  status: 'กำลังปฏิบัติการ' | 'ควบคุมสถานการณ์ได้แล้ว' | 'รอการสนับสนุน';
}

const SAMPLE_LOCATIONS: MapIncident[] = [];;

export const OperationsMapModule: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<MapIncident | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 13.7563,
    lng: 100.5018,
  });
  const [mapZoom, setMapZoom] = useState<number>(11);

  // Google Maps Platform API Key:
  // Use VITE_GOOGLE_MAPS_API_KEY if configured or fallback to Google Maps Demo Key for interactive exploration
  const apiKey =
    ((import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GOOGLE_MAPS_API_KEY) ||
    ''; // When empty, Google Maps Platform codeassist allows demo sandbox or prompting

  const filteredLocations =
    activeCategory === 'all'
      ? SAMPLE_LOCATIONS
      : SAMPLE_LOCATIONS.filter((loc) => loc.category === activeCategory);

  const getPinColors = (category: string, severity: string) => {
    switch (category) {
      case 'fire':
        return { background: '#E11D48', glyphColor: '#FFFFFF', borderColor: '#9F1239' };
      case 'flood':
        return { background: '#0284C7', glyphColor: '#FFFFFF', borderColor: '#0369A1' };
      case 'shelter':
        return { background: '#234A78', glyphColor: '#FFFFFF', borderColor: '#1B3A5F' };
      case 'supply':
        return { background: '#10B981', glyphColor: '#FFFFFF', borderColor: '#047857' };
      case 'patrol':
        return { background: '#8B5CF6', glyphColor: '#FFFFFF', borderColor: '#6D28D9' };
      default:
        return { background: '#64748B', glyphColor: '#FFFFFF', borderColor: '#475569' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fire':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'flood':
        return <Waves className="w-4 h-4 text-sky-600" />;
      case 'shelter':
        return <Building className="w-4 h-4 text-[#234A78]" />;
      case 'supply':
        return <Shield className="w-4 h-4 text-emerald-600" />;
      case 'patrol':
        return <Truck className="w-4 h-4 text-purple-600" />;
      default:
        return <MapPin className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen iridescent-ambient p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Studio Hero Card */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #082F49 0%, #0369A1 48%, #0284C7 80%, #0EA5E9 100%)',
        }}
      >
        {/* 4-Color Spectrum Top Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2583D8] via-[#42A77A] via-[#E89B22] to-[#8B46C8]" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shrink-0 shadow-lg">
            <MapPin className="w-6 h-6 text-sky-200" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ศูนย์แผนที่ปฏิบัติการและเหตุการณ์เชิงพื้นที่ (GIS Studio)
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE SATELLITE & VECTOR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sky-100/85 mt-1">
              ติดตามพิกัดเหตุการณ์ฉุกเฉิน จุดอพยพ หน่วยเคลื่อนที่เร็ว และคลังสิ่งของบรรเทาทุกข์บนแผนที่ Google Maps Platform
            </p>
          </div>
        </div>

        {/* Quick Stats Overlay */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-center">
            <p className="text-[10px] text-sky-200 uppercase font-semibold">จุดปฏิบัติการ</p>
            <p className="text-base font-black font-mono tabular-nums text-white">{SAMPLE_LOCATIONS.length} จุด</p>
          </div>
          <div className="bg-rose-500/25 backdrop-blur-md border border-rose-300/30 rounded-2xl px-4 py-2.5 text-center">
            <p className="text-[10px] text-rose-200 uppercase font-semibold">เหตุด่วน</p>
            <p className="text-base font-black font-mono tabular-nums text-white">2 เหตุการณ์</p>
          </div>
          <div className="bg-emerald-500/25 backdrop-blur-md border border-emerald-300/30 rounded-2xl px-4 py-2.5 text-center">
            <p className="text-[10px] text-emerald-200 uppercase font-semibold">ศูนย์สนับสนุน</p>
            <p className="text-base font-black font-mono tabular-nums text-white">3 แห่ง</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 liquid-glass-card iridescent-edge p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 mr-2">
          <Filter className="w-3.5 h-3.5 text-[#2583D8]" />
          <span>ประเภทพิกัด:</span>
        </div>

        {[
          { id: 'all', label: 'ทั้งหมด', count: SAMPLE_LOCATIONS.length },
          { id: 'flood', label: 'อุทกภัย / น้ำท่วม', count: 1 },
          { id: 'fire', label: 'อัคคีภัย', count: 1 },
          { id: 'shelter', label: 'ศูนย์บัญชาการ / อพยพ', count: 2 },
          { id: 'supply', label: 'คลังสิ่งของบรรเทาทุกข์', count: 1 },
          { id: 'patrol', label: 'ชุดสายตรวจเคลื่อนที่เร็ว', count: 1 },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === tab.id
                ? 'bg-gradient-to-r from-[#0369A1] to-[#2583D8] text-white shadow-sm'
                : 'bg-white/70 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map Canvas */}
        <div className="lg:col-span-8 liquid-glass-card iridescent-edge rounded-3xl overflow-hidden h-[620px] relative">
          <APIProvider
            apiKey={apiKey}
            libraries={['places', 'marker']}
            solutionChannel="GMP_aistudio_v1"
          >
            <Map
              defaultCenter={mapCenter}
              defaultZoom={mapZoom}
              mapId="DEMO_MAP_ID"
              gestureHandling="greedy"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              {filteredLocations.map((loc) => {
                const pinColors = getPinColors(loc.category, loc.severity);
                return (
                  <AdvancedMarker
                    key={loc.id}
                    position={loc.position}
                    onClick={() => setSelectedIncident(loc)}
                    title={loc.title}
                  >
                    <Pin
                      background={pinColors.background}
                      glyphColor={pinColors.glyphColor}
                      borderColor={pinColors.borderColor}
                      scale={1.1}
                    />
                  </AdvancedMarker>
                );
              })}

              {selectedIncident && (
                <InfoWindow
                  position={selectedIncident.position}
                  onCloseClick={() => setSelectedIncident(null)}
                >
                  <div className="p-2 max-w-xs text-slate-800">
                    <div className="flex items-center gap-2 mb-1.5">
                      {getCategoryIcon(selectedIncident.category)}
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {selectedIncident.categoryLabel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                      {selectedIncident.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                      {selectedIncident.description}
                    </p>
                    <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1 text-slate-500">
                      <p>📍 {selectedIncident.address}</p>
                      <p>👮 {selectedIncident.officerInCharge}</p>
                      <p>📞 {selectedIncident.phone}</p>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Quick Floating Map Controls */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-md text-xs font-medium text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Maps Platform: แสดงผลพิกัดดาวเทียม & เวกเตอร์</span>
          </div>
        </div>

        {/* Right Details / Point of Interest List */}
        <div className="lg:col-span-4 flex flex-col h-[620px] bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              รายการพิกัดในพื้นที่ ({filteredLocations.length})
            </h3>
          </div>

          <div className="overflow-y-auto flex-1 p-3 space-y-2.5">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedIncident(loc);
                  setMapCenter(loc.position);
                  setMapZoom(13);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedIncident?.id === loc.id
                    ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                    : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(loc.category)}
                    <span className="text-[11px] font-semibold text-slate-700">
                      {loc.categoryLabel}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      loc.severity === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : loc.severity === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {loc.status}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1 line-clamp-1">{loc.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2.5">
                  {loc.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                  <span className="truncate max-w-[150px]">{loc.address}</span>
                  <button
                    type="button"
                    className="text-[#234A78] font-medium hover:underline flex items-center gap-1 shrink-0"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>ซูมพิกัด</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Item Quick Action Footer */}
          {selectedIncident && (
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                    {selectedIncident.title}
                  </p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    <span>{selectedIncident.phone} ({selectedIncident.officerInCharge})</span>
                  </p>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedIncident.position.lat},${selectedIncident.position.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#234A78] hover:bg-[#1b3a5f] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>เปิด Google Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
