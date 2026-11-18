import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, ChevronDown, TrendingUp } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../../types';

interface MonthlyStatsChartProps {
  className?: string;
}

// 12 Months Thai Abbreviations matching reference
const MONTH_NAMES = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

// Realistic department activity & document metrics data for 12 months
const MONTHLY_DATA_2569 = [
  { month: 'ม.ค.', admin: 28, relations: 14, disaster: 10, volunteer: 6 },
  { month: 'ก.พ.', admin: 32, relations: 16, disaster: 8, volunteer: 8 },
  { month: 'มี.ค.', admin: 40, relations: 19, disaster: 12, volunteer: 10 },
  { month: 'เม.ย.', admin: 25, relations: 24, disaster: 18, volunteer: 14 },
  { month: 'พ.ค.', admin: 38, relations: 18, disaster: 22, volunteer: 12 },
  { month: 'มิ.ย.', admin: 45, relations: 20, disaster: 19, volunteer: 9 },
  { month: 'ก.ค.', admin: 42, relations: 22, disaster: 25, volunteer: 15 },
  { month: 'ส.ค.', admin: 48, relations: 26, disaster: 28, volunteer: 18 },
  { month: 'ก.ย.', admin: 52, relations: 30, disaster: 31, volunteer: 22 },
  { month: 'ต.ค.', admin: 35, relations: 18, disaster: 15, volunteer: 11 },
  { month: 'พ.ย.', admin: 30, relations: 15, disaster: 12, volunteer: 8 },
  { month: 'ธ.ค.', admin: 28, relations: 20, disaster: 10, volunteer: 12 },
];

const MONTHLY_DATA_2568 = [
  { month: 'ม.ค.', admin: 22, relations: 12, disaster: 9, volunteer: 5 },
  { month: 'ก.พ.', admin: 26, relations: 14, disaster: 7, volunteer: 6 },
  { month: 'มี.ค.', admin: 34, relations: 16, disaster: 11, volunteer: 8 },
  { month: 'เม.ย.', admin: 21, relations: 20, disaster: 15, volunteer: 10 },
  { month: 'พ.ค.', admin: 30, relations: 15, disaster: 18, volunteer: 9 },
  { month: 'มิ.ย.', admin: 38, relations: 18, disaster: 16, volunteer: 8 },
  { month: 'ก.ค.', admin: 36, relations: 19, disaster: 20, volunteer: 12 },
  { month: 'ส.ค.', admin: 41, relations: 22, disaster: 24, volunteer: 14 },
  { month: 'ก.ย.', admin: 44, relations: 25, disaster: 26, volunteer: 17 },
  { month: 'ต.ค.', admin: 29, relations: 16, disaster: 14, volunteer: 9 },
  { month: 'พ.ย.', admin: 25, relations: 13, disaster: 10, volunteer: 7 },
  { month: 'ธ.ค.', admin: 24, relations: 18, disaster: 8, volunteer: 10 },
];

export const MonthlyStatsChart: React.FC<MonthlyStatsChartProps> = ({ className = '' }) => {
  const [fiscalYear, setFiscalYear] = useState<'2569' | '2568'>('2569');

  const chartData = fiscalYear === '2569' ? MONTHLY_DATA_2569 : MONTHLY_DATA_2568;

  // Department colors from User Specification
  const colors = {
    admin: DEPARTMENT_COLORS.admin, // #7F9B83
    relations: DEPARTMENT_COLORS.relations, // #EE7E9E
    disaster: DEPARTMENT_COLORS.disaster, // #8191BA
    volunteer: DEPARTMENT_COLORS.volunteer, // #EFBB4B
  };

  return (
    <div className={`liquid-glass-card liquid-glass-sheen bpp-card-interactive iridescent-edge rounded-3xl p-5 sm:p-6 flex flex-col justify-between ${className}`}>
      {/* Header Row: Title & Fiscal Year Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#27265B]/5 text-[#27265B] flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>สถิติการปฏิบัติงานรายเดือน</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-[#51439A] border border-purple-100">
                12 เดือน
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              ปริมาณเอกสาร ภารกิจ ข่าวสาร และเหตุการณ์ของ 4 ฝ่าย
            </p>
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="fiscal-year-select" className="text-xs text-slate-500 font-medium">
            ปีงบประมาณ:
          </label>
          <div className="relative inline-block">
            <select
              id="fiscal-year-select"
              value={fiscalYear}
              onChange={e => setFiscalYear(e.target.value as '2569' | '2568')}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold py-1.5 pl-3 pr-8 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#51439A]/20 cursor-pointer transition"
            >
              <option value="2569">ปีงบประมาณ 2569</option>
              <option value="2568">ปีงบประมาณ 2568</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Chart Legend Pills */}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-medium">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.admin }} />
          <span className="text-slate-700">ฝ่ายอำนวยการ</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.relations }} />
          <span className="text-slate-700">ฝ่ายมวลชนสัมพันธ์</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.disaster }} />
          <span className="text-slate-700">ฝ่ายสาธารณภัย</span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.volunteer }} />
          <span className="text-slate-700">ฝ่ายจิตอาสา</span>
        </div>
      </div>

      {/* Recharts 4-Bar Grouped Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={2}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              domain={[0, 60]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 text-xs space-y-1.5">
                    <p className="font-bold text-slate-800 border-b border-slate-100 pb-1">
                      เดือน {label} {fiscalYear}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.admin }} />
                          ฝ่ายอำนวยการ:
                        </span>
                        <span className="font-bold text-slate-900">{payload[0]?.value} รายการ</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.relations }} />
                          ฝ่ายมวลชนสัมพันธ์:
                        </span>
                        <span className="font-bold text-slate-900">{payload[1]?.value} รายการ</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.disaster }} />
                          ฝ่ายสาธารณภัย:
                        </span>
                        <span className="font-bold text-slate-900">{payload[2]?.value} รายการ</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.volunteer }} />
                          ฝ่ายจิตอาสา:
                        </span>
                        <span className="font-bold text-slate-900">{payload[3]?.value} รายการ</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="admin"
              name="ฝ่ายอำนวยการ"
              fill={colors.admin}
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="relations"
              name="ฝ่ายมวลชนสัมพันธ์"
              fill={colors.relations}
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={60}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="disaster"
              name="ฝ่ายสาธารณภัย"
              fill={colors.disaster}
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={120}
              animationDuration={800}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="volunteer"
              name="ฝ่ายจิตอาสา"
              fill={colors.volunteer}
              radius={[4, 4, 0, 0]}
              isAnimationActive={true}
              animationBegin={180}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyStatsChart;
