import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { BppMissionItem } from '../types';

interface BppMissionAnalyticsSectionProps {
  missions: BppMissionItem[];
  selectedMonth: string;
}

export const BppMissionAnalyticsSection: React.FC<BppMissionAnalyticsSectionProps> = ({
  missions,
  selectedMonth,
}) => {
  // 1. By Date / Daily Count
  const dailyData = useMemo(() => {
    const counts: Record<string, number> = {};
    missions.forEach((m) => {
      const shortDate = m.date.replace(' ก.ค. 69', ' ก.ค.').replace(' สิงหาคม 2569', ' ส.ค.');
      counts[shortDate] = (counts[shortDate] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({
      date,
      count,
    }));
  }, [missions]);

  // 2. By Category / 4 Main Works
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    missions.forEach((m) => {
      const cat = m.category || 'อื่นๆ';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [missions]);

  // 3. By Status
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      'ดำเนินการแล้ว': 0,
      'อยู่ระหว่างดำเนินการ': 0,
      'รอดำเนินการ': 0,
      'ยังไม่กำหนด': 0,
    };
    missions.forEach((m) => {
      if (counts[m.status] !== undefined) {
        counts[m.status]++;
      } else {
        counts[m.status] = 1;
      }
    });
    return Object.entries(counts).map(([status, value]) => ({
      status,
      value,
    }));
  }, [missions]);

  // 4. By Responsible
  const responsibleData = useMemo(() => {
    const counts: Record<string, number> = {};
    missions.forEach((m) => {
      const resp = m.responsible || 'ไม่ระบุ';
      counts[resp] = (counts[resp] || 0) + 1;
    });
    return Object.entries(counts).map(([resp, value]) => ({
      resp,
      value,
    }));
  }, [missions]);

  // 4 Official Department Colors:
  // ฝอ.5 / อำนวยการ: #5B2A86
  // ประชาสัมพันธ์: #2583D8
  // สาธารณภัย: #E89B22
  // จิตอาสา: #42A77A
  const CATEGORY_COLORS: Record<string, string> = {
    'จิตอาสา': '#42A77A',
    'อำนวยการ': '#5B2A86',
    'มวลชนสัมพันธ์': '#2583D8',
    'ประชาสัมพันธ์': '#2583D8',
    'ตรวจราชการ': '#5A5764',
    'พิธีการ': '#8A8792',
    'สาธารณภัย': '#E89B22',
  };

  const STATUS_COLORS: Record<string, string> = {
    'ดำเนินการแล้ว': '#059669',
    'อยู่ระหว่างดำเนินการ': '#D97706',
    'รอดำเนินการ': '#5B2A86',
    'ยังไม่กำหนด': '#E11D48',
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[rgba(40,35,50,0.07)] shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(40,35,50,0.07)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EDE4F7] text-[#5B2A86] flex items-center justify-center border border-[#5B2A86]/20">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#2D2A32] tracking-tight">
                ภาพรวมภารกิจและการดำเนินงาน
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#F7F7F9] text-[#4A4852] border border-[rgba(40,35,50,0.08)]">
                สถิติราชการ
              </span>
            </div>
            <p className="text-xs text-[#8A8792]">
              สรุปความคืบหน้าและการกระจายตัวของภารกิจ ฝอ.5 {selectedMonth !== 'ทุกช่วงเวลา' ? `ประจำเดือน${selectedMonth}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#4A4852] bg-[#F7F7F9] px-3 py-1.5 rounded-lg border border-[rgba(40,35,50,0.06)] self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
          <span>ข้อมูลพร้อมรายงานทางราชการ</span>
        </div>
      </div>

      {/* 4 Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Daily Mission Count Chart */}
        <div className="p-4 rounded-xl bg-[#FBFAFD] border border-[rgba(40,35,50,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#2D2A32] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#5B2A86]" />
                ความหนาแน่นรายวัน
              </span>
              <span className="text-[11px] text-[#8A8792]">{dailyData.length} วันทำการ</span>
            </div>
            <p className="text-[11px] text-[#8A8792] mb-3">จำนวนภารกิจตามลำดับวันที่</p>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData} margin={{ top: 10, right: 5, left: -25, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBED" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9, fill: '#8A8792' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#8A8792' }} />
                <Tooltip
                  formatter={(val: number | string | undefined) => [`${val} ภารกิจ`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: 'rgba(40,35,50,0.1)',
                    boxShadow: '0 2px 8px rgba(40,35,50,0.08)',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#5B2A86" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. By Category / 4 Works */}
        <div className="p-4 rounded-xl bg-[#FBFAFD] border border-[rgba(40,35,50,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#2D2A32] flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-[#2583D8]" />
                สัดส่วนตามกลุ่มงาน
              </span>
              <span className="text-[11px] text-[#8A8792]">{missions.length} รายการ</span>
            </div>
            <p className="text-[11px] text-[#8A8792] mb-2">จำแนกตาม 4 สายงานหลัก</p>
          </div>

          <div className="h-40 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val: number | string | undefined) => [`${val} ภารกิจ`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: 'rgba(40,35,50,0.1)',
                    boxShadow: '0 2px 8px rgba(40,35,50,0.08)',
                    fontSize: '11px',
                  }}
                />
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={52}
                  paddingAngle={3}
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={CATEGORY_COLORS[entry.name] || '#8A8792'}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center pt-1">
            {categoryData.map((c) => (
              <span
                key={c.name}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-[rgba(40,35,50,0.08)] text-[#4A4852] flex items-center gap-1"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[c.name] || '#8A8792' }}
                />
                {c.name} ({c.value})
              </span>
            ))}
          </div>
        </div>

        {/* 3. By Status */}
        <div className="p-4 rounded-xl bg-[#FBFAFD] border border-[rgba(40,35,50,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#2D2A32] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                สถานะการปฏิบัติการ
              </span>
              <span className="text-[11px] text-[#8A8792]">รวม 100%</span>
            </div>
            <p className="text-[11px] text-[#8A8792] mb-3">ความคืบหน้าของภารกิจ</p>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={statusData}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EBEBED" />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fill: '#8A8792' }} />
                <YAxis
                  type="category"
                  dataKey="status"
                  tick={{ fontSize: 9, fill: '#2D2A32' }}
                  width={90}
                />
                <Tooltip
                  formatter={(val: number | string | undefined) => [`${val} ภารกิจ`, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: 'rgba(40,35,50,0.1)',
                    boxShadow: '0 2px 8px rgba(40,35,50,0.08)',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="value" radius={[0, 3, 3, 0]}>
                  {statusData.map((entry) => (
                    <Cell
                      key={`cell-status-${entry.status}`}
                      fill={STATUS_COLORS[entry.status] || '#5B2A86'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. By Responsible */}
        <div className="p-4 rounded-xl bg-[#FBFAFD] border border-[rgba(40,35,50,0.06)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#2D2A32] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#4A4852]" />
                ผู้รับผิดชอบหลัก
              </span>
              <span className="text-[11px] text-[#8A8792]">{responsibleData.length} กลุ่ม</span>
            </div>
            <p className="text-[11px] text-[#8A8792] mb-3">การกระจายภารกิจตามฝ่าย</p>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={responsibleData} margin={{ top: 10, right: 5, left: -25, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEBED" />
                <XAxis dataKey="resp" tick={{ fontSize: 10, fill: '#2D2A32', fontWeight: 600 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#8A8792' }} />
                <Tooltip
                  formatter={(val: number | string | undefined) => [`${val} ภารกิจ`, 'ภาระงาน']}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: 'rgba(40,35,50,0.1)',
                    boxShadow: '0 2px 8px rgba(40,35,50,0.08)',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="value" fill="#4A4852" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BppMissionAnalyticsSection;
