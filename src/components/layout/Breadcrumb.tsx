import React from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../../contexts/AdminContext';
import { AppModule } from '../../types';
import { ChevronRight, Home, Sparkles } from 'lucide-react';

interface BreadcrumbProps {
  customItems?: { label: string; onClick?: () => void }[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ customItems }) => {
  const { activeModule, navigateModule } = useAdmin();

  const departmentMeta: Record<
    AppModule,
    { name: string; color: string; defaultSub?: string }
  > = {
    'my-space': {
      name: 'ฉัน (ข้อมูลส่วนตัว)',
      color: '#2583D8',
      defaultSub: 'ข้อมูลส่วนตัว',
    },
    home: { name: 'หน้าหลัก', color: '#5B2A86' },
    login: { name: 'เข้าสู่ระบบ', color: '#64748B' },
    dashboard: { name: 'หน้าหลักภาพรวม', color: '#5B2A86' },
    admin: {
      name: 'งานอำนวยการ',
      color: '#5B2A86',
      defaultSub: 'ระบบบริหารงานอำนวยการ สารบรรณ และงบประมาณ',
    },
    relations: {
      name: 'งานประชาสัมพันธ์',
      color: '#2583D8',
      defaultSub: 'ระบบสื่อสารองค์กรและข่าวประชาสัมพันธ์',
    },
    disaster: {
      name: 'งานพัฒนาช่วยเหลือประชาชน',
      color: '#E89B22',
      defaultSub: 'เฝ้าระวังและบริหารสถานการณ์สาธารณภัย พัฒนาและช่วยเหลือประชาชน',
    },
    volunteer: {
      name: 'งานจิตอาสา',
      color: '#42A77A',
      defaultSub: 'ระบบบริหารกิจกรรมและงานจิตอาสาพระราชทาน',
    },
    reports: { name: 'รายงานสรุปภาพรวม', color: '#5B2A86', defaultSub: 'สถิติและรายงานผล' },
    calendar: { name: 'ตารางภารกิจ & ปฏิทิน', color: '#5B2A86', defaultSub: 'กำหนดการปฏิบัติงานและเวรประจำวัน' },
    'duty-roster': { name: 'ตารางเวร (สิบเวร)', color: '#5B2A86', defaultSub: 'ตารางการปฏิบัติหน้าที่สิบเวร สง.ฝอ.5' },
    documents: { name: 'คลังเอกสารราชการ', color: '#5B2A86', defaultSub: 'หนังสือรับ-ส่ง แบบฟอร์มมาตรฐาน และผู้ช่วยตรวจร่าง' },
    slides: { name: 'ระบบสไลด์นำเสนอ', color: '#5B2A86', defaultSub: 'สร้างและส่งออกสไลด์บรรยายสรุป' },
    news: { name: 'ข่าวสารและประกาศ', color: '#2583D8', defaultSub: 'สื่อประชาสัมพันธ์' },
    settings: { name: 'ตั้งค่าระบบ', color: '#5B2A86', defaultSub: 'การกำหนดค่าและสิทธิ์การใช้งาน' },
    workspace: { name: 'Google Workspace', color: '#4285F4', defaultSub: 'เชื่อมต่อเอกสารและตารางงาน' },
    maps: { name: 'แผนที่ปฏิบัติการ', color: '#0F9D58', defaultSub: 'พิกัดหน่วยและจุดเกิดเหตุ' },
    'bpp-tracker': { name: 'ติดตามรายงาน 16 กก.ตชด.', color: '#E11D48', defaultSub: 'สถานะการส่งรายงานประจำงวดของหน่วยในสังกัด' },
    'line-reports': { name: 'รายงานจาก LINE', color: '#06C755', defaultSub: 'ข้อความรายงานจากกลุ่ม LINE ที่บอทจัดแผนกให้อัตโนมัติ' },
    'task-center': { name: 'ศูนย์งานกลาง (งานด่วน)', color: '#5B2A86', defaultSub: 'ติดตามงานค้างและกำหนดส่งเร่งด่วน' },
    strategic: { name: 'สถิติ / ตัวชี้วัด KPI', color: '#5B2A86', defaultSub: 'ความก้าวหน้าตามแผนยุทธศาสตร์ 4 สายงาน' },
    'communication-groups': { name: 'กลุ่มการสื่อสาร', color: '#2583D8', defaultSub: 'ช่องทางประสานงาน 16 กก.ตชด.' },
    'executive-view': { name: 'สรุปสำหรับผู้บริหาร', color: '#5B2A86', defaultSub: 'รายงานสถานการณ์และประเด็นเพื่อสั่งการ' },
    'ai-intelligence': { name: 'วิเคราะห์ข้อมูล AI', color: '#5B2A86', defaultSub: 'ประเมินแนวโน้มและสรุปข้อมูลอัตโนมัติ' },
    'history-audit': { name: 'ประวัติการดำเนินงาน', color: '#5B2A86', defaultSub: 'บันทึกการส่งและตรวจรับรองรายงาน' },
    'knowledge-center': { name: 'คลังความรู้ ฝอ.5', color: '#42A77A', defaultSub: 'คู่มือ ระเบียบคำสั่ง และมาตรฐานการปฏิบัติงาน' },
    'smart-systems': { name: '10 ระบบปฏิบัติการอัจฉริยะ', color: '#5B2A86', defaultSub: 'คลังยุทโธปกรณ์ · รายงานสด · e-Signature · รร.ตชด. · เรดาร์เตือนภัย' },
  };

  const quickDepartments: { id: AppModule; label: string; color: string; gradient: string }[] = [
    { id: 'admin', label: 'งานอำนวยการ', color: '#5B2A86', gradient: 'linear-gradient(135deg, #5B2A86, #8B46C8)' },
    { id: 'relations', label: 'งานประชาสัมพันธ์', color: '#2583D8', gradient: 'linear-gradient(135deg, #1E6BB8, #38BDF8)' },
    { id: 'disaster', label: 'งานพัฒนาช่วยเหลือประชาชน', color: '#E89B22', gradient: 'linear-gradient(135deg, #D97706, #F59E0B)' },
    { id: 'volunteer', label: 'งานจิตอาสา', color: '#42A77A', gradient: 'linear-gradient(135deg, #059669, #34D399)' },
  ];

  const currentMeta = departmentMeta[activeModule] || departmentMeta.dashboard;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 py-2.5 px-4 sm:px-6 lg:px-8 border-b border-slate-200/70 dark:border-white/10 bg-white/75 dark:bg-[#141822]/75 backdrop-blur-md select-none"
    >
      {/* Left: Breadcrumb Trail */}
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          type="button"
          onClick={() => navigateModule('dashboard')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-50/80 dark:bg-white/5 hover:bg-[#5B2A86] hover:text-white text-[#5B2A86] dark:text-purple-300 transition font-bold cursor-pointer shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
          <span>หน้าหลัก</span>
        </button>

        {activeModule !== 'dashboard' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
            <button
              type="button"
              onClick={() => navigateModule(activeModule)}
              className="font-extrabold px-2.5 py-1 rounded-xl transition cursor-pointer shrink-0"
              style={{
                color: currentMeta.color,
                backgroundColor: `${currentMeta.color}14`,
              }}
            >
              {currentMeta.name}
            </button>
          </>
        )}

        {customItems && customItems.length > 0 ? (
          customItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              {item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-slate-900 transition font-medium cursor-pointer truncate"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate max-w-xs">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))
        ) : (
          activeModule !== 'dashboard' &&
          currentMeta.defaultSub && (
            <>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline px-1">·</span>
              <span className="text-slate-500 dark:text-slate-400 truncate max-w-sm hidden sm:inline font-medium">
                {currentMeta.defaultSub}
              </span>
            </>
          )
        )}
      </div>

      {/* Right: Colorful 1-Click Switcher for the 4 Core Departments */}
      <div className="hidden xl:flex items-center gap-1.5">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-[#5B2A86]" />
          <span>สลับสายงานด่วน:</span>
        </span>
        {quickDepartments.map(dept => {
          const isCurrent = activeModule === dept.id;
          return (
            <motion.button
              key={dept.id}
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigateModule(dept.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
                isCurrent
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white/90 dark:bg-white/5 hover:shadow-2xs border-slate-200/80 dark:border-white/10'
              }`}
              style={
                isCurrent
                  ? { background: dept.gradient }
                  : { color: dept.color, borderColor: `${dept.color}30` }
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: isCurrent ? '#FFFFFF' : dept.color }}
              />
              <span>{dept.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
