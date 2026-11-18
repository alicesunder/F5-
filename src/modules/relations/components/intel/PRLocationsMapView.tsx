import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Camera,
  User,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { MissionLocation } from '../../types/bppTypes';

export const PRLocationsMapView: React.FC = () => {
  const { locations, missions, setSelectedMission, setActivePRView } = usePRIntel();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [activeLocId, setActiveLocId] = useState<string>(locations[0]?.id || 'loc-1');

  const regions = ['all', 'กลาง', 'เหนือ', 'ตะวันออกเฉียงเหนือ', 'ใต้', 'ตะวันออก', 'ตะวันตก'];

  const filteredLocations = locations.filter((loc) => {
    if (selectedRegion !== 'all' && loc.region !== selectedRegion) return false;
    return true;
  });

  const activeLoc = locations.find((l) => l.id === activeLocId) || filteredLocations[0];
  const locMissions = activeLoc
    ? missions.filter((m) => m.province === activeLoc.province || m.location.includes(activeLoc.unit))
    : [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  แผนที่พื้นที่ปฏิบัติการภาพถ่าย (Operations Map)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  ติดตามจุดประจำการและภารกิจบันทึกภาพของ บช.ตชด. ทั่วประเทศ 6 ภูมิภาค ({locations.length} พิกัดหลัก)
                </p>
              </div>
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedRegion === reg
                    ? 'bg-[#27265B] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {reg === 'all' ? 'ทุกภูมิภาค' : `ภาค${reg}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map Graphic (7 cols) + Location Info (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Map Simulation */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Thailand PR Operations Grid
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Real-time Geolocation Tagging
              </span>
            </div>

            {/* Map Canvas Box */}
            <div className="relative w-full h-[400px] bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-2xl border border-slate-200/90 overflow-hidden flex items-center justify-center p-4">
              {/* Thailand Geographic Silhouette / Grid Lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#27265B_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Map Outline SVG Placeholder */}
              <div className="text-center opacity-20 pointer-events-none select-none">
                <Shield className="w-48 h-48 mx-auto text-[#27265B]" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#27265B]">
                  BPP OPERATIONS ZONE
                </span>
              </div>

              {/* Interactive Pins */}
              {locations.map((loc) => {
                const isActive = activeLoc?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveLocId(loc.id)}
                    style={{
                      left: `${loc.coordinates.x}%`,
                      top: `${loc.coordinates.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group z-10 ${
                      isActive ? 'scale-125 z-20' : 'hover:scale-110'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`p-1.5 rounded-full shadow-md transition ${
                          isActive
                            ? 'bg-rose-600 text-white ring-4 ring-rose-200'
                            : 'bg-[#27265B] text-white hover:bg-pink-700'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <span
                        className={`mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md whitespace-nowrap shadow-xs ${
                          isActive
                            ? 'bg-[#1E1B4B] text-white font-mono'
                            : 'bg-white/90 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {loc.province} ({loc.totalMissions})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>คลิกที่หมุดพิกัดเพื่อดูรายละเอียดกำลังพลและภารกิจประจำพื้นที่</span>
            <span className="font-mono text-[11px] text-pink-700 font-semibold">
              แสดง {filteredLocations.length} พิกัด
            </span>
          </div>
        </div>

        {/* Right Column: Active Location Details & Mission List */}
        <div className="lg:col-span-5 space-y-4">
          {activeLoc ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 font-bold border border-pink-200">
                    ภาค{activeLoc.region} • {activeLoc.unit}
                  </span>
                  <h2 className="text-base font-black text-[#1E1B4B] mt-1.5">
                    {activeLoc.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    พิกัด GPS: {activeLoc.gpsCoordinates}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-mono text-xs font-bold shrink-0">
                  {activeLoc.totalMissions} งาน
                </span>
              </div>

              {/* Responsible Officer */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-pink-600" />
                  <div>
                    <span className="text-[10px] text-slate-400">นายตำรวจผู้รับผิดชอบพื้นที่</span>
                    <p className="text-xs font-bold text-slate-800">{activeLoc.assignedOfficer}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActivePRView('staff')}
                  className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold"
                >
                  โปรไฟล์
                </button>
              </div>

              {/* Latest Missions in this location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                    ภารกิจในพื้นที่ ({locMissions.length})
                  </h3>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {locMissions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      ไม่มีภารกิจค้างในพื้นที่นี้
                    </p>
                  ) : (
                    locMissions.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMission(m);
                          setActivePRView('photo-missions');
                        }}
                        className="p-3 rounded-xl border border-slate-200/80 hover:border-pink-300 cursor-pointer transition bg-slate-50/50 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-[#27265B]">
                              {m.id}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 truncate">
                              {m.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{m.displayDate}</p>
                        </div>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold ml-2 shrink-0 ${
                            m.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {m.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังทำ'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Quick List of All Locations */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-[#1E1B4B] mb-2 uppercase tracking-wider">
              รายชื่อพิกัดปฏิบัติการ ({filteredLocations.length})
            </h3>
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 text-xs">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  onClick={() => setActiveLocId(loc.id)}
                  className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition ${
                    activeLoc?.id === loc.id
                      ? 'bg-pink-50 text-pink-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">{loc.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {loc.province}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
