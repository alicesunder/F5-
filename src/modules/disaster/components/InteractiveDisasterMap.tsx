import React, { useState, useMemo } from 'react';
import { MapPoint, MapLayerType, IncidentSeverity, IncidentType, DisasterIncident, HydrologicalStation } from '../types';
import { PROVINCE_COORDS } from '../data/riverChainData';
import { ThailandMap } from '../../../components/maps/ThailandMap';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  ShieldAlert,
  AlertTriangle,
  Home,
  CheckCircle2,
  ChevronDown,
  Info,
  Calendar,
  Waves,
} from 'lucide-react';

interface InteractiveDisasterMapProps {
  points: MapPoint[];
  incidents: DisasterIncident[];
  onSelectIncidentById?: (id: string) => void;
  stations?: HydrologicalStation[];
  onSelectStationById?: (id: string) => void;
}

type CombinedPoint = MapPoint & { stationId?: string };

const STATUS_TO_SEVERITY: Record<HydrologicalStation['status'], IncidentSeverity> = {
  normal: 'ปกติ',
  warning: 'เฝ้าระวัง',
  critical: 'วิกฤต',
};

export const InteractiveDisasterMap: React.FC<InteractiveDisasterMapProps> = ({
  points,
  incidents,
  onSelectIncidentById,
  stations = [],
  onSelectStationById,
}) => {
  const primaryColor = '#8191BA';

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<MapLayerType | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<IncidentSeverity | 'all'>('all');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | '3days' | '7days' | 'all'>('all');

  // Layer Toggles
  const [visibleLayers, setVisibleLayers] = useState<Record<MapLayerType, boolean>>({
    floods: true,
    watchpoints: true,
    incidents: true,
    shelters: true,
    routes: true,
    risk_zones: true,
    stations: true,
  });

  // Derive map markers for hydrological telemetry stations from live station data,
  // reusing each station's province coordinates (approximate, see riverChainData.ts).
  const stationPoints = useMemo<CombinedPoint[]>(() => {
    return stations
      .map(s => {
        const coords = PROVINCE_COORDS[s.province];
        if (!coords) return null;
        const point: CombinedPoint = {
          id: `station-${s.id}`,
          name: s.name,
          category: 'stations',
          lat: coords.lat,
          lng: coords.lng,
          province: s.province,
          district: s.riverName,
          severity: STATUS_TO_SEVERITY[s.status],
          statusText: `${s.currentWaterLevel.toFixed(2)} ม. (${s.capacityPercent}% ของตลิ่ง)`,
          details: `รหัสสถานี ${s.code} • แม่น้ำ${s.riverName} • แนวโน้ม${s.trend === 'rising' ? 'เพิ่มขึ้น' : s.trend === 'falling' ? 'ลดลง' : 'ทรงตัว'}`,
          stationId: s.id,
        };
        return point;
      })
      .filter((p): p is CombinedPoint => p !== null);
  }, [stations]);

  // Selected Pin Popup
  const [activePoint, setActivePoint] = useState<CombinedPoint | null>(null);

  // Zoom and Pan state for custom SVG GIS map
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const provinces = useMemo(() => {
    const set = new Set<string>();
    points.forEach(p => set.add(p.province));
    incidents.forEach(i => set.add(i.province));
    return Array.from(set);
  }, [points, incidents]);

  const toggleLayer = (layer: MapLayerType) => {
    setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Filtered Points
  const filteredPoints = useMemo(() => {
    return ([...points, ...stationPoints] as CombinedPoint[]).filter(p => {
      // Layer Visibility check
      if (!visibleLayers[p.category]) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Severity filter
      if (selectedSeverity !== 'all' && p.severity !== selectedSeverity) return false;

      // Province filter
      if (selectedProvince !== 'all' && p.province !== selectedProvince) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.details.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [points, stationPoints, visibleLayers, selectedCategory, selectedSeverity, selectedProvince, searchQuery]);

  // Convert GPS Coordinates (Lat 5.5 to 20.5, Lng 97.0 to 106.0) to SVG ViewBox (800 x 950)
  // Thailand bounding box:
  // Lat: 5.61 (South) -> 20.46 (North)
  // Lng: 97.34 (West) -> 105.63 (East)
  const projectCoordinates = (lat: number, lng: number) => {
    const minLat = 5.6;
    const maxLat = 20.5;
    const minLng = 97.3;
    const maxLng = 105.8;

    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 880 + 35;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActivePoint(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Top Filter & Control Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-base font-bold text-slate-900">
                แผนที่สถานการณ์สาธารณภัยแบบเรียลไทม์ (Interactive GIS)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-semibold">
                LIVE GIS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              แสดงพิกัดจุดน้ำท่วม จุดเฝ้าระวัง จุดช่วยเหลือ เส้นทางสำคัญ และพื้นที่เสี่ยงภัยทั่วประเทศ
            </p>
          </div>

          {/* Quick Search on Map */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ค้นหาพิกัด จุดน้ำท่วม หรืออำเภอ..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
        </div>

        {/* Multi-Criteria Filters Row */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {/* 1. ประเภทเหตุการณ์ */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">ประเภทเหตุการณ์</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as any)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">ทุกประเภท</option>
              <option value="floods">จุดน้ำท่วม</option>
              <option value="watchpoints">จุดเฝ้าระวัง</option>
              <option value="incidents">จุดรายงานเหตุ</option>
              <option value="shelters">จุดช่วยเหลือ/พักพิง</option>
              <option value="routes">เส้นทางสำคัญ</option>
              <option value="risk_zones">พื้นที่เสี่ยงภัย</option>
              <option value="stations">สถานีโทรมาตรน้ำ</option>
            </select>
          </div>

          {/* 2. ระดับความรุนแรง */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">ระดับความรุนแรง</label>
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value as any)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">ทุกระดับ</option>
              <option value="วิกฤต">วิกฤต (แดง)</option>
              <option value="เฝ้าระวังสูง">เฝ้าระวังสูง (ส้ม)</option>
              <option value="เฝ้าระวัง">เฝ้าระวัง (เหลือง)</option>
              <option value="ปกติ">ปกติ (เขียว)</option>
            </select>
          </div>

          {/* 3. จังหวัด */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">จังหวัด</label>
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">ทุกจังหวัด</option>
              {provinces.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* 4. วันที่ */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">ช่วงเวลา</label>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value as any)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">ข้อมูลทั้งหมด</option>
              <option value="today">วันนี้ (24 ชม.)</option>
              <option value="3days">ย้อนหลัง 3 วัน</option>
              <option value="7days">ย้อนหลัง 7 วัน</option>
            </select>
          </div>

          {/* 5. สถานะ */}
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">สถานะดำเนินการ</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs focus:outline-none"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
              <option value="ควบคุมสถานการณ์">ควบคุมสถานการณ์</option>
              <option value="เสร็จสิ้น">เสร็จสิ้น</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSeverity('all');
                setSelectedProvince('all');
                setSelectedStatus('all');
                setSearchQuery('');
                setDateFilter('all');
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium flex items-center justify-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างตัวกรอง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Canvas + Layer Overlay Area */}
      <div className="relative w-full h-[600px] sm:h-[680px] bg-[#EAF0F6] overflow-hidden select-none">
        {/* Layer Toggles Floating Card */}
        <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 border border-slate-200 shadow-md text-xs space-y-2 max-w-[200px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 pb-1.5 border-b border-slate-100">
            <Layers className="w-4 h-4 text-slate-500" />
            <span>ชั้นข้อมูลแผนที่ (Layers)</span>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.floods}
                onChange={() => toggleLayer('floods')}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
              <span>จุดน้ำท่วม</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.watchpoints}
                onChange={() => toggleLayer('watchpoints')}
                className="rounded text-amber-600 focus:ring-0"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>จุดเฝ้าระวัง</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.incidents}
                onChange={() => toggleLayer('incidents')}
                className="rounded text-rose-600 focus:ring-0"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>จุดรายงานเหตุ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.shelters}
                onChange={() => toggleLayer('shelters')}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>จุดช่วยเหลือ/พักพิง</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.routes}
                onChange={() => toggleLayer('routes')}
                className="rounded text-indigo-600 focus:ring-0"
              />
              <span className="w-3 h-1 bg-indigo-500 inline-block rounded-xs" />
              <span>เส้นทางสำคัญ</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.risk_zones}
                onChange={() => toggleLayer('risk_zones')}
                className="rounded text-purple-600 focus:ring-0"
              />
              <span className="w-2.5 h-2.5 rounded-xs bg-purple-500/50 border border-purple-600 inline-block" />
              <span>พื้นที่เสี่ยงภัย</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
              <input
                type="checkbox"
                checked={visibleLayers.stations}
                onChange={() => toggleLayer('stations')}
                className="rounded text-sky-600 focus:ring-0"
              />
              <span className="w-2.5 h-2.5 bg-sky-500 inline-block" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
              <span>สถานีโทรมาตรน้ำ</span>
            </label>
          </div>
        </div>

        {/* Status Indicator Legend at bottom right */}
        <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-md text-[11px] font-mono text-slate-600 space-y-1">
          <div className="font-bold text-slate-800 font-sans pb-1 border-b border-slate-100">
            พิกัดที่กำลังแสดง: {filteredPoints.length} จุด
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>วิกฤต (แดง)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>เฝ้าระวังสูง (ส้ม)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>เฝ้าระวัง (เหลือง)</span>
          </div>
        </div>

        {/* แผนที่จริง (OpenStreetMap) */}
        <ThailandMap
          markers={filteredPoints.map(point => ({
            id: point.id,
            lat: point.lat,
            lng: point.lng,
            label: `${point.name} · ${point.province}`,
            shape: point.category === 'stations' ? 'diamond' : 'circle',
            pulse: point.severity === 'วิกฤต' || point.severity === 'เฝ้าระวังสูง',
            selected: activePoint?.id === point.id,
            color:
              point.severity === 'วิกฤต'
                ? '#E11D48'
                : point.severity === 'เฝ้าระวังสูง'
                ? '#EA580C'
                : point.severity === 'เฝ้าระวัง'
                ? '#CA8A04'
                : point.severity === 'ปกติ'
                ? '#10B981'
                : '#3B82F6',
          }))}
          onSelect={id => setActivePoint(filteredPoints.find(p => p.id === id) || null)}
        />

        {/* Selected Point Inspection Popover Overlay */}
        {activePoint && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-6 z-30 w-[92%] sm:w-96 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xl text-left animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      activePoint.severity === 'วิกฤต'
                        ? '#E11D48'
                        : activePoint.severity === 'เฝ้าระวังสูง'
                        ? '#EA580C'
                        : '#3B82F6',
                  }}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {activePoint.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {activePoint.district}, จ.{activePoint.province} (พิกัด: {activePoint.lat.toFixed(4)}, {activePoint.lng.toFixed(4)})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePoint(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">ระดับความรุนแรง:</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: activePoint.severity === 'วิกฤต' ? '#FFE4E6' : '#FEF3C7',
                    color: activePoint.severity === 'วิกฤต' ? '#BE123C' : '#B45309',
                  }}
                >
                  {activePoint.severity}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">สถานะข้อมูล:</span>
                <span className="font-semibold text-slate-800">{activePoint.statusText}</span>
              </div>

              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] leading-relaxed">
                {activePoint.details}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              {activePoint.incidentId && onSelectIncidentById && (
                <button
                  type="button"
                  onClick={() => onSelectIncidentById(activePoint.incidentId!)}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  เปิดแฟ้มเหตุการณ์ฉุกเฉินนี้
                </button>
              )}
              {activePoint.stationId && onSelectStationById && (
                <button
                  type="button"
                  onClick={() => onSelectStationById(activePoint.stationId!)}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  ดูรายละเอียดสถานีนี้ (กราฟ/เกจ/River Chain)
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
