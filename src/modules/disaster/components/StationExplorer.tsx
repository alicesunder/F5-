import React, { useMemo, useState } from 'react';
import { HydrologicalStation } from '../types';
import {
  PROVINCE_COORDS,
  distanceKm,
  buildRiverChain,
  buildHistoricalSeries,
  ChainStage,
} from '../data/riverChainData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  Waves,
  MapPinned,
  Locate,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
  X,
  Navigation,
} from 'lucide-react';

interface StationExplorerProps {
  stations: HydrologicalStation[];
  focusId?: string | null;
}

const STATUS_COLOR: Record<HydrologicalStation['status'], string> = {
  normal: '#10B981',
  warning: '#F59E0B',
  critical: '#F43F5E',
};

const STATUS_LABEL: Record<HydrologicalStation['status'], string> = {
  normal: 'ปกติ',
  warning: 'เฝ้าระวัง',
  critical: 'วิกฤตล้นตลิ่ง',
};

/** Arc gauge: current level against the bankfull ceiling, colored by status. */
const LevelGauge: React.FC<{ station: HydrologicalStation }> = ({ station }) => {
  const ceiling = station.bankfullLevel * 1.15;
  const pct = Math.max(0, Math.min(1, station.currentWaterLevel / ceiling));
  const warningPct = Math.max(0, Math.min(1, station.warningLevel / ceiling));
  const bankfullPct = Math.max(0, Math.min(1, station.bankfullLevel / ceiling));

  const size = 168;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = Math.PI * r; // half circle
  const angleToOffset = (p: number) => circumference * (1 - p);
  const color = STATUS_COLOR[station.status];

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={angleToOffset(pct)}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Warning + bankfull tick marks */}
        {[warningPct, bankfullPct].map((p, i) => {
          const angle = Math.PI * (1 - p);
          const cx = size / 2 + r * Math.cos(angle);
          const cy = size / 2 - r * Math.sin(angle);
          return <circle key={i} cx={cx} cy={cy} r={3.5} fill="#475569" />;
        })}
      </svg>
      <div className="absolute top-[58px] flex flex-col items-center">
        <span className="text-2xl font-black text-slate-900">{station.currentWaterLevel.toFixed(2)}</span>
        <span className="text-[10px] text-slate-400 -mt-1">เมตร (ม.รทก.)</span>
      </div>
      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500 inline-block" />เฝ้าระวัง {station.warningLevel.toFixed(2)}</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />ตลิ่ง {station.bankfullLevel.toFixed(2)}</span>
      </div>
    </div>
  );
};

const TrendIcon: React.FC<{ trend: HydrologicalStation['trend'] }> = ({ trend }) => {
  if (trend === 'rising') return <ArrowUpRight className="w-3.5 h-3.5" />;
  if (trend === 'falling') return <ArrowDownRight className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
};

const STAGE_LABEL: Record<ChainStage, string> = {
  upstream: 'ต้นน้ำ',
  reference: 'สถานีตรวจวัด',
  downstream: 'ท้ายน้ำ',
};

const NearbyStationCard: React.FC<{ stations: HydrologicalStation[]; onSelect: (s: HydrologicalStation) => void }> = ({
  stations,
  onSelect,
}) => {
  const [status, setStatus] = useState<'idle' | 'locating' | 'done' | 'error'>('idle');
  const [nearest, setNearest] = useState<{ station: HydrologicalStation; km: number } | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('disaster.referenceStationId');
    if (saved) {
      const found = stations.find(s => s.id === saved);
      if (found) setStatus('done');
    }
  }, [stations]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        let best: { station: HydrologicalStation; km: number } | null = null;
        stations.forEach(s => {
          const coords = PROVINCE_COORDS[s.province];
          if (!coords) return;
          const km = distanceKm(here, coords);
          if (!best || km < best.km) best = { station: s, km };
        });
        if (best) {
          setNearest(best);
          localStorage.setItem('disaster.referenceStationId', best.station.id);
        }
        setStatus('done');
      },
      () => setStatus('error'),
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <MapPinned className="w-4 h-4 text-slate-500" />
        <h4 className="text-sm font-bold text-slate-900">สถานีอ้างอิงใกล้ฉัน</h4>
      </div>
      <p className="text-xs text-slate-500 mt-3">
        ใช้ตำแหน่งของอุปกรณ์นี้เพื่อบันทึกสถานีที่ใกล้ที่สุดไว้ดูก่อนเป็นอันดับแรก (บันทึกในเบราว์เซอร์นี้เท่านั้น ไม่ส่งขึ้นเซิร์ฟเวอร์)
      </p>

      {nearest && (
        <button
          type="button"
          onClick={() => onSelect(nearest.station)}
          className="mt-3 w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition"
        >
          <div className="text-xs font-bold text-slate-800">{nearest.station.name}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            ห่างจากตำแหน่งปัจจุบันประมาณ {nearest.km.toFixed(0)} กม. • {nearest.station.basin}
          </div>
        </button>
      )}

      <button
        type="button"
        onClick={handleLocate}
        disabled={status === 'locating'}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[#8191BA] text-white hover:opacity-90 transition disabled:opacity-60"
      >
        <Locate className="w-4 h-4" />
        {status === 'locating' ? 'กำลังค้นหาตำแหน่ง...' : 'ใช้ตำแหน่งของฉัน'}
      </button>
      {status === 'error' && (
        <p className="text-[11px] text-rose-600 mt-2">ไม่สามารถเข้าถึงตำแหน่งได้ กรุณาอนุญาตการเข้าถึงตำแหน่งของเบราว์เซอร์</p>
      )}
    </div>
  );
};

export const StationExplorer: React.FC<StationExplorerProps> = ({ stations, focusId }) => {
  const [selectedId, setSelectedId] = useState<string>(stations[0]?.id ?? '');
  const selected = stations.find(s => s.id === selectedId) ?? stations[0];

  React.useEffect(() => {
    if (focusId && stations.some(s => s.id === focusId)) {
      setSelectedId(focusId);
    }
  }, [focusId, stations]);

  const chain = useMemo(() => (selected ? buildRiverChain(selected) : []), [selected]);
  const history = useMemo(() => (selected ? buildHistoricalSeries(selected) : []), [selected]);

  if (!selected) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Station Directory */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center gap-2 px-1 pb-3 border-b border-slate-100">
            <Waves className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-900">รายชื่อสถานีโทรมาตร</h4>
          </div>
          <div className="mt-2 space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {stations.map(s => {
              const active = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between gap-2 ${
                    active ? 'bg-[#8191BA]/10 border-[#8191BA]/40' : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{s.code} · {s.basin}</div>
                    <div className="text-[11px] text-slate-500 truncate">{s.name}</div>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: STATUS_COLOR[s.status] }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Station Deep-dive */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-400 font-mono">{selected.code} · {selected.riverName}</div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selected.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{selected.basin} · จ.{selected.province} · อัปเดต {selected.updatedAt}</p>
              </div>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: STATUS_COLOR[selected.status] }}
              >
                {STATUS_LABEL[selected.status]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              {/* Gauge */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 py-5">
                <LevelGauge station={selected} />
                <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold" style={{ color: STATUS_COLOR[selected.status] }}>
                  <TrendIcon trend={selected.trend} />
                  <span>
                    {selected.trend === 'rising' ? 'ระดับน้ำมีแนวโน้มเพิ่มขึ้น' : selected.trend === 'falling' ? 'ระดับน้ำมีแนวโน้มลดลง' : 'ระดับน้ำทรงตัว'}
                  </span>
                </div>
              </div>

              {/* 7-day trend chart */}
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                <div className="text-xs font-bold text-slate-700 mb-2">แนวโน้มระดับน้ำย้อนหลัง 7 วัน</div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="stationLevelGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8191BA" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#8191BA" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} width={36} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderRadius: 12, border: 'none', fontSize: 11, color: '#fff' }} />
                      <ReferenceLine y={selected.warningLevel} stroke="#F59E0B" strokeDasharray="4 4" />
                      <ReferenceLine y={selected.bankfullLevel} stroke="#F43F5E" strokeDasharray="4 4" />
                      <Area type="monotone" dataKey="level" stroke="#8191BA" strokeWidth={2} fill="url(#stationLevelGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-amber-500 inline-block" />เฝ้าระวัง</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-rose-500 inline-block" />ตลิ่ง</span>
                </div>
              </div>
            </div>
          </div>

          {/* River Chain: upstream -> reference -> downstream */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <Navigation className="w-4 h-4 text-slate-500" />
              <h4 className="text-sm font-bold text-slate-900">ลำดับน้ำในลุ่มน้ำ (River Chain)</h4>
              <span className="text-[11px] text-slate-400">— ประมาณการจากสถานีอ้างอิงในลุ่มน้ำเดียวกัน</span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4">
              {chain.map((c, idx) => (
                <React.Fragment key={c.id}>
                  <div
                    className={`flex-1 rounded-2xl border p-4 ${
                      c.stage === 'reference' ? 'bg-[#8191BA]/10 border-[#8191BA]/40' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wide text-slate-400 font-mono">{STAGE_LABEL[c.stage]}</div>
                    <div className="text-xs font-bold text-slate-800 mt-1">{c.name}</div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-lg font-black text-slate-900">{c.currentWaterLevel.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-500">ม. ({c.capacityPercent}% ตลิ่ง)</span>
                    </div>
                    <span
                      className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: STATUS_COLOR[c.status] }}
                    >
                      {STATUS_LABEL[c.status]}
                    </span>
                  </div>
                  {idx < chain.length - 1 && (
                    <div className="hidden sm:flex items-center justify-center px-1 text-slate-300">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NearbyStationCard stations={stations} onSelect={s => setSelectedId(s.id)} />
    </div>
  );
};
