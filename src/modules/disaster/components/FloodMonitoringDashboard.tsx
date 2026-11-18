import React, { useState } from 'react';
import {
  HydrologicalStation,
  RainfallTelemetry,
} from '../types';
import {
  rainfallChartData,
  waterLevelChartData,
  affectedAreaTrendData,
  incidentTrendData,
} from '../data/disasterMockData';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Waves,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  Compass,
  Gauge,
  Droplet,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Clock,
  Radio,
  Building,
} from 'lucide-react';

interface FloodMonitoringDashboardProps {
  stations: HydrologicalStation[];
  rainfallData: RainfallTelemetry[];
}

export const FloodMonitoringDashboard: React.FC<FloodMonitoringDashboardProps> = ({
  stations,
  rainfallData,
}) => {
  const primaryColor = '#8191BA';
  const [selectedStationBasin, setSelectedStationBasin] = useState<string>('all');
  const [lastRefreshed, setLastRefreshed] = useState<string>('11:45 น.');

  const basins = Array.from(new Set(stations.map(s => s.basin)));

  const filteredStations = selectedStationBasin === 'all'
    ? stations
    : stations.filter(s => s.basin === selectedStationBasin);

  const handleRefresh = () => {
    const now = new Date();
    setLastRefreshed(now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.');
  };

  return (
    <div className="space-y-6">
      {/* Flood Surveillance Intelligence Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  ศูนย์เฝ้าระวังและวิเคราะห์สถานการณ์น้ำ (Flood Hydro-Telemetry Hub)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  HYDRO 24/7
                </span>
              </div>
              <p className="text-xs text-slate-500">
                ติดตามระดับน้ำในลุ่มน้ำหลัก ปริมาณน้ำฝนสะสม อัตราการไหล และประเมินความเสี่ยงมวลน้ำหลาก
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              อัปเดตข้อมูลอัตโนมัติ: {lastRefreshed}
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="ดึงข้อมูลล่าสุด"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Hydro-Metric Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>สถานีวิกฤตล้นตลิ่ง</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-rose-600">1</span>
              <span className="text-xs text-slate-500">สถานี (MS.1 แม่สาย)</span>
            </div>
            <p className="text-[11px] text-rose-600/90 mt-1 font-mono">ระดับน้ำ 122% ความจุตลิ่ง</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>สถานีเตือนภัยใกล้ล้น</span>
              <Droplet className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-amber-600">2</span>
              <span className="text-xs text-slate-500">สถานี (Y.4 ยม, M.7 มูล)</span>
            </div>
            <p className="text-[11px] text-amber-600/90 mt-1 font-mono">ความจุเกิน 90% ของแม่น้ำ</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>ฝนสะสมสูงสุด 24 ชม.</span>
              <CloudRain className="w-4 h-4 text-sky-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1F2937]">168.5</span>
              <span className="text-xs text-slate-500">มม. (อ.แม่สาย)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">เกณฑ์ฝนตกหนักมาก</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>การระบายน้ำเขื่อนเจ้าพระยา</span>
              <Gauge className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#1F2937]">1,420</span>
              <span className="text-xs text-slate-500">ลบ.ม./วินาที</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-mono">อยู่ในเกณฑ์ควบคุมปกติ</p>
          </div>
        </div>
      </div>

      {/* 4 Specialized Disaster Graphs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Rainfall (24h Trend and Warning Threshold) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-sky-600" />
                <span>1. กราฟปริมาณฝนสะสมและแนวโน้มพยากรณ์ (Rainfall Trend)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                เปรียบเทียบปริมาณฝนจริง vs ค่าพยากรณ์ฝน 24 ชั่วโมง และเกณฑ์เฝ้าระวัง (มม.)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-50 text-sky-700 font-semibold">
              mm/hr
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rainfallChartData}>
                <defs>
                  <linearGradient id="rainActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rainForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit=" mm" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="ปริมาณฝนจริง (Actual mm)"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#rainActual)"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  name="พยากรณ์เรดาร์ (Radar Forecast)"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  fillOpacity={1}
                  fill="url(#rainForecast)"
                />
                <Line
                  type="monotone"
                  dataKey="warning"
                  name="เกณฑ์เตือนภัย (Warning Limit 15mm)"
                  stroke="#E11D48"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: Water Level (Basin gauges vs Warning and Bankfull levels) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-indigo-600" />
                <span>2. กราฟระดับน้ำเทียบขีดความจุตลิ่ง (Water Level vs Bankfull)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                เปรียบเทียบระดับน้ำปัจจุบันกับระดับเตือนภัยและตลิ่งวิกฤต (ม.รทก.)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-50 text-indigo-700 font-semibold">
              m MSL
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterLevelChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="basin" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar
                  dataKey="current"
                  name="ระดับน้ำปัจจุบัน"
                  fill="#8191BA"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="warning"
                  name="ระดับเตือนภัย"
                  fill="#F59E0B"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="bankfull"
                  name="ระดับล้นตลิ่งวิกฤต"
                  fill="#F43F5E"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Affected Area Trend (Flooded Land vs Agricultural Land) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>3. กราฟแนวโน้มพื้นที่ได้รับผลกระทบ 7 วัน (Affected Area Trend)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                สถิติพื้นที่น้ำท่วมขังและพื้นที่การเกษตรเสียหายสะสม (ไร่)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-700 font-semibold">
              ไร่ (Rai)
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={affectedAreaTrendData}>
                <defs>
                  <linearGradient id="areaFlooded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="floodedRai"
                  name="พื้นที่น้ำท่วมรวม (ไร่)"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaFlooded)"
                />
                <Line
                  type="monotone"
                  dataKey="agriculturalRai"
                  name="พื้นที่การเกษตร (ไร่)"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 4: Incident Trend by Type (Weekly frequency) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>4. กราฟแนวโน้มการเกิดเหตุการณ์จำแนกประเภท (Incident Trend)</span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                การกระจายของเหตุการณ์สาธารณภัยรายสัปดาห์ (น้ำท่วม, ดินสไลด์, พายุวาตภัย)
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-50 text-purple-700 font-semibold">
              ครั้ง/สัปดาห์
            </span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="flood" name="น้ำท่วม/น้ำหลาก" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="landslide" name="ดินถล่ม" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="storm" name="วาตภัย" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Telemetry River Gauge Stations Table */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              ตารางตรวจวัดระดับน้ำสถานีหลัก 6 ลุ่มน้ำ (Hydrological Telemetry Stations)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              เชื่อมโยงข้อมูลจากเซนเซอร์ตรวจวัดระดับน้ำอัตโนมัติกรมชลประทานและกรมทรัพยากรน้ำ
            </p>
          </div>

          {/* Basin Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">กรองลุ่มน้ำ:</span>
            <select
              value={selectedStationBasin}
              onChange={e => setSelectedStationBasin(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">ทุกลุ่มน้ำ</option>
              {basins.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">รหัสสถานี</th>
                <th className="pb-3 font-semibold">ชื่อสถานี / แม่น้ำ</th>
                <th className="pb-3 font-semibold">ลุ่มน้ำ / จังหวัด</th>
                <th className="pb-3 font-semibold text-right">ระดับน้ำ (ม.รทก.)</th>
                <th className="pb-3 font-semibold text-right">อัตราไหล (ลบ.ม./วิ)</th>
                <th className="pb-3 font-semibold text-center">% ความจุตลิ่ง</th>
                <th className="pb-3 font-semibold text-center">แนวโน้ม</th>
                <th className="pb-3 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[12px]">
              {filteredStations.map(station => {
                let statusBadge = (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-100 text-emerald-800">
                    ปกติ
                  </span>
                );
                if (station.status === 'warning') {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-amber-100 text-amber-800">
                      เฝ้าระวัง
                    </span>
                  );
                } else if (station.status === 'critical') {
                  statusBadge = (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-rose-100 text-rose-800 animate-pulse">
                      วิกฤตล้นตลิ่ง
                    </span>
                  );
                }

                return (
                  <tr key={station.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 font-bold text-slate-800">{station.code}</td>
                    <td className="py-3.5 font-sans">
                      <div className="font-semibold text-slate-800">{station.name}</div>
                      <div className="text-[11px] text-slate-400">{station.riverName}</div>
                    </td>
                    <td className="py-3.5 font-sans text-slate-600">
                      <div>{station.basin}</div>
                      <div className="text-[11px] text-slate-400">จ.{station.province}</div>
                    </td>
                    <td className="py-3.5 text-right font-bold text-slate-800">
                      {station.currentWaterLevel.toFixed(2)}
                      <span className="text-[10px] text-slate-400 font-normal ml-1">/ {station.bankfullLevel.toFixed(2)}</span>
                    </td>
                    <td className="py-3.5 text-right text-slate-700">
                      {station.flowRate.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              station.capacityPercent > 100
                                ? 'bg-rose-500'
                                : station.capacityPercent > 85
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(station.capacityPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {station.capacityPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-sans">
                      {station.trend === 'rising' && (
                        <span className="inline-flex items-center gap-1 text-rose-600 text-xs font-medium">
                          <ArrowUpRight className="w-3.5 h-3.5" /> เพิ่มขึ้น
                        </span>
                      )}
                      {station.trend === 'falling' && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                          <ArrowDownRight className="w-3.5 h-3.5" /> ลดลง
                        </span>
                      )}
                      {station.trend === 'steady' && (
                        <span className="inline-flex items-center gap-1 text-slate-500 text-xs font-medium">
                          <Minus className="w-3.5 h-3.5" /> ทรงตัว
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">{statusBadge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
