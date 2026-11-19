import React, { useState, useMemo } from 'react';
import { HEAVY_RAIN_ZONES, HeavyRainZone } from '../../../data/heavyRainData';
import { ThailandMap } from '../../../components/maps/ThailandMap';
import {
  CloudRain,
  AlertTriangle,
  ShieldAlert,
  Search,
  MapPin,
  Compass,
  Phone,
  Radio,
  Layers,
  ChevronRight,
  TrendingUp,
  Activity,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface HeavyRainRadarMapProps {
  onNavigateToUnitReport?: (unitId: string) => void;
}

export const HeavyRainRadarMap: React.FC<HeavyRainRadarMapProps> = ({
  onNavigateToUnitReport,
}) => {
  const [selectedZone, setSelectedZone] = useState<HeavyRainZone | null>(HEAVY_RAIN_ZONES[0]);
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRadarAnimationActive, setIsRadarAnimationActive] = useState(true);

  // Filtered zones
  const filteredZones = useMemo(() => {
    return HEAVY_RAIN_ZONES.filter(zone => {
      if (regionFilter !== 'all' && zone.region !== regionFilter) return false;
      if (severityFilter !== 'all' && zone.severity !== severityFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inProvince = zone.province.toLowerCase().includes(query);
        const inDistricts = zone.affectedDistricts.some(d => d.toLowerCase().includes(query));
        const inUnit = zone.bppUnitId.toLowerCase().includes(query) || zone.bppUnitName.toLowerCase().includes(query);
        if (!inProvince && !inDistricts && !inUnit) return false;
      }
      return true;
    });
  }, [regionFilter, severityFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = HEAVY_RAIN_ZONES.length;
    const extreme = HEAVY_RAIN_ZONES.filter(z => z.severity === 'extreme').length;
    const heavy = HEAVY_RAIN_ZONES.filter(z => z.severity === 'heavy').length;
    const moderate = HEAVY_RAIN_ZONES.filter(z => z.severity === 'moderate').length;
    const maxRain = Math.max(...HEAVY_RAIN_ZONES.map(z => z.rainfall24h));
    const maxProvince = HEAVY_RAIN_ZONES.find(z => z.rainfall24h === maxRain)?.province || '';
    return { total, extreme, heavy, moderate, maxRain, maxProvince };
  }, []);

  // Map coordinates projection helper (Converts Lat/Lng in Thailand bounding box to SVG 0-100%)
  // Thailand bounds: Lat ~ 5.5 to 20.5, Lng ~ 97.0 to 106.0
  const getMapCoordinates = (lat: number, lng: number) => {
    const minLat = 5.5;
    const maxLat = 20.5;
    const minLng = 97.0;
    const maxLng = 106.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getSeverityBadge = (severity: HeavyRainZone['severity']) => {
    switch (severity) {
      case 'extreme':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500 ring-rose-300',
          label: 'ฝนตกหนักมาก (>90 มม.) วิกฤต',
          color: '#E11D48',
        };
      case 'heavy':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500 ring-amber-300',
          label: 'ฝนตกหนัก (35-90 มม.) เตือนภัย',
          color: '#D97706',
        };
      case 'moderate':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500 ring-sky-300',
          label: 'ฝนปานกลาง (10-35 มม.) เฝ้าระวัง',
          color: '#0284C7',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Telemetry Header */}
      <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/50 dark:from-slate-900 dark:via-[#1E293B] dark:to-[#0F172A] rounded-2xl p-5 sm:p-6 text-slate-900 dark:text-white border border-blue-200/70 dark:border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-400/30">
              <CloudRain className="w-3.5 h-3.5" />
              <span>ระบบตรวจเช็คแผนที่ฝนตกหนัก & เรดาร์ตรวจจับสภาพอากาศ (Rain Radar GIS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              แผนที่ตรวจเช็คพื้นที่ฝนตกหนักรายจังหวัดทั่วประเทศ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
              ติดตามกลุ่มฝนฟ้าคะนอง ปริมาณฝนสะสม 24 ชั่วโมง และอำเภอที่เสี่ยงภัยดินโคลนถล่ม/น้ำป่าไหลหลาก
              พร้อมเชื่อมโยงกำลังพลและ กก.ตชด. 11-14, 21-24, 31-34, 41-44 เข้าช่วยเหลือประชาชนทันท่วงที
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRadarAnimationActive(!isRadarAnimationActive)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
                isRadarAnimationActive
                  ? 'bg-blue-600/10 dark:bg-blue-600/30 border-blue-400 text-blue-700 dark:text-blue-200'
                  : 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/15'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>เรดาร์: {isRadarAnimationActive ? 'เปิดสแกน' : 'หยุด'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์รายงาน</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <div className="bg-white/80 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">จังหวัดที่มีฝนตกสะสม</span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {stats.total} จังหวัด
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
              สูงสุดที่ จ.{stats.maxProvince} ({stats.maxRain} มม.)
            </span>
          </div>

          <div className="bg-rose-50/80 dark:bg-rose-950/40 rounded-xl p-3 border border-rose-200 dark:border-rose-900/50 shadow-2xs">
            <span className="text-[11px] text-rose-700 dark:text-rose-300 block mb-0.5">ฝนตกหนักมาก (วิกฤตสีแดง)</span>
            <span className="text-lg sm:text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {stats.extreme} จังหวัด
            </span>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-300/80 block mt-0.5">
              เสี่ยงดินโคลนถล่ม & น้ำท่วมฉับพลัน
            </span>
          </div>

          <div className="bg-amber-50/80 dark:bg-amber-950/40 rounded-xl p-3 border border-amber-200 dark:border-amber-900/50 shadow-2xs">
            <span className="text-[11px] text-amber-700 dark:text-amber-300 block mb-0.5">ฝนตกหนัก (เตือนภัยสีส้ม)</span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats.heavy} จังหวัด
            </span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-300/80 block mt-0.5">
              35 - 90 มม./24ชม.
            </span>
          </div>

          <div className="bg-sky-50/80 dark:bg-sky-950/40 rounded-xl p-3 border border-sky-200 dark:border-sky-900/50 shadow-2xs">
            <span className="text-[11px] text-sky-700 dark:text-sky-300 block mb-0.5">ฝนปานกลาง (เฝ้าระวังสีฟ้า)</span>
            <span className="text-lg sm:text-xl font-extrabold text-sky-600 dark:text-sky-400">
              {stats.moderate} จังหวัด
            </span>
            <span className="text-[10px] text-sky-600/80 dark:text-sky-300/80 block mt-0.5">
              10 - 35 มม./24ชม.
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-[#151821] rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold">
            {[
              { id: 'all', label: 'ทุกภาค' },
              { id: 'เหนือ', label: 'ภาคเหนือ' },
              { id: 'ตะวันออกเฉียงเหนือ', label: 'ภาคอีสาน' },
              { id: 'กลาง', label: 'ภาคกลาง' },
              { id: 'ตะวันออก', label: 'ภาคตะวันออก' },
              { id: 'ใต้', label: 'ภาคใต้' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegionFilter(r.id)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  regionFilter === r.id
                    ? 'bg-white dark:bg-[#1A1F29] text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Severity Selector */}
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-[#1A1F29] border border-slate-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-hidden cursor-pointer"
          >
            <option value="all">ระดับความรุนแรงทั้งหมด</option>
            <option value="extreme">เฉพาะฝนตกหนักมาก (สีแดง &gt; 90 มม.)</option>
            <option value="heavy">เฉพาะฝนตกหนัก (สีส้ม 35-90 มม.)</option>
            <option value="moderate">เฉพาะฝนปานกลาง (สีฟ้า 10-35 มม.)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px] max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อจังหวัด, อำเภอ, กก.ตชด..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>
      </div>

      {/* Main Dual View: Left = Interactive Radar Map (7 Cols) / Right = Province List & Detail (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Radar Map Canvas Card */}
        <div className="lg:col-span-7 bg-white dark:bg-[#151821] rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4 text-slate-900 dark:text-white">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>แผนผังเรดาร์พิกัดกลุ่มฝนและจุดเสี่ยงภัย</span>
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> &gt;90 มม.
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 35-90 มม.
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-sky-400" /> 10-35 มม.
              </span>
            </div>
          </div>

          {/* แผนที่จริง (OpenStreetMap) พร้อมวงพื้นที่ฝนตกหนัก */}
          <div className="relative w-full h-[420px] sm:h-[520px] rounded-xl overflow-hidden border border-slate-800">
            <ThailandMap
              markers={filteredZones.map(zone => ({
                id: zone.id,
                lat: zone.lat,
                lng: zone.lng,
                radiusKm: zone.severity === 'extreme' ? 40 : zone.severity === 'heavy' ? 28 : 18,
                color: getSeverityBadge(zone.severity).color,
                selected: selectedZone?.id === zone.id,
                label: `${zone.province} · ฝน 24 ชม. ${zone.rainfall24h} มม.`,
              }))}
              onSelect={id => setSelectedZone(filteredZones.find(z => z.id === id) || null)}
            />
            {filteredZones.length === 0 && (
              <div className="absolute left-3 right-14 top-3 z-20 rounded-xl bg-white/95 px-3 py-2 text-xs text-slate-600 shadow">
                ยังไม่มีข้อมูลพื้นที่ฝนตกหนัก (ยังไม่ได้เชื่อมต่อแหล่งข้อมูลฝน)
              </div>
            )}
          </div>

          {/* Selected Zone Quick Bar */}
          {selectedZone && (
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">
                  จุดที่เลือก: จ.{selectedZone.province} ({selectedZone.region})
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300">
                  ปริมาณฝนสะสม: {selectedZone.rainfall24h} มม. (อัตรา {selectedZone.rainfall1h} มม./ชม.)
                </span>
              </div>
              <span className="text-slate-400 text-[11px]">
                อัปเดต: {selectedZone.lastUpdated}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT: Detailed Zone Info & Province Registry List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected Zone Detail Card */}
          {selectedZone ? (
            <div className="bg-white dark:bg-[#151821] rounded-2xl p-5 border-2 border-blue-500/50 shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
                      ภาค{selectedZone.region}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        getSeverityBadge(selectedZone.severity).bg
                      }`}
                    >
                      {getSeverityBadge(selectedZone.severity).label}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    จังหวัด{selectedZone.province}
                  </h3>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>แจ้งเตือน: {selectedZone.alertType}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block leading-none">
                    {selectedZone.rainfall24h}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">มม./24 ชม.</span>
                </div>
              </div>

              {/* Affected Districts */}
              <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-200 block">
                  อำเภอในจังหวัดที่ฝนตกหนักและเสี่ยงภัย:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.affectedDistricts.map((d, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold rounded-md text-[11px] border border-rose-200 dark:border-rose-800/40"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsible BPP Unit Info */}
              <div className="p-3.5 bg-slate-900 dark:bg-[#1A1F29] text-white rounded-xl space-y-2 text-xs border border-slate-800 dark:border-white/10">
                <div className="flex items-center justify-between border-b border-slate-700 dark:border-slate-800 pb-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>หน่วย ตชด. รับผิดชอบพื้นที่:</span>
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-semibold rounded text-[10px] border border-emerald-500/30">
                    {selectedZone.bppStatus}
                  </span>
                </div>

                <div className="font-bold text-white text-sm">
                  {selectedZone.bppUnitId} ({selectedZone.bppUnitName})
                </div>
                <div className="text-slate-300 text-[11px]">
                  ที่ตั้ง/กองร้อย: {selectedZone.bppCamp}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">นายตำรวจผู้รับผิดชอบ:</span>
                    <span className="font-semibold text-white">{selectedZone.officerInCharge}</span>
                  </div>
                  <a
                    href={`tel:${selectedZone.officerPhone}`}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] inline-flex items-center gap-1 transition shadow-xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{selectedZone.officerPhone}</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {onNavigateToUnitReport && (
                  <button
                    type="button"
                    onClick={() => onNavigateToUnitReport(selectedZone.bppUnitId)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>ตรวจเช็ครายงาน {selectedZone.bppUnitId}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white dark:bg-[#151821] rounded-2xl border border-slate-200 dark:border-white/10 text-slate-400">
              คลิกที่หมุดบนแผนที่เรดาร์เพื่อดูรายละเอียดจังหวัดและหน่วย ตชด.
            </div>
          )}

          {/* Province Registry List */}
          <div className="bg-white dark:bg-[#151821] rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                รายชื่อจังหวัดที่มีฝนตกสะสม ({filteredZones.length})
              </h4>
              <span className="text-[10px] text-slate-400">
                เรียงตามปริมาณน้ำฝนสะสม
              </span>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredZones
                .sort((a, b) => b.rainfall24h - a.rainfall24h)
                .map(zone => {
                  const isSelected = selectedZone?.id === zone.id;
                  const badge = getSeverityBadge(zone.severity);

                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-500'
                          : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: badge.color }}
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            จ.{zone.province} ({zone.region})
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">
                            {zone.bppUnitId} • {zone.alertType}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-slate-900 dark:text-white block">
                          {zone.rainfall24h} มม.
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {zone.rainfall1h} มม./ชม.
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
