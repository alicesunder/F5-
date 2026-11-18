import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import {
  FileText,
  Newspaper,
  Calendar as CalendarIcon,
  ArrowRight,
  Download,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../../types';

export const CentralTriPanelGrid: React.FC = () => {
  const { navigateModule, archivalDocs } = useAdmin();

  // 1. Recent Documents (From archivalDocs or realistic fallback)
  const recentDocs = [
    {
      id: 'doc-1',
      title: 'แผนปฏิบัติการป้องกันและบรรเทาสาธารณภัย ประจำปี 2569.pdf',
      type: 'PDF',
      size: '2.4 MB',
      date: '10 ก.ย. 2569',
      color: '#EF4444',
      dept: 'ฝ่ายสาธารณภัย',
    },
    {
      id: 'doc-2',
      title: 'ระเบียบการเบิกจ่ายงบประมาณและสิทธิประโยชน์กำลังพล.docx',
      type: 'DOCX',
      size: '850 KB',
      date: '09 ก.ย. 2569',
      color: '#3B82F6',
      dept: 'ฝ่ายอำนวยการ',
    },
    {
      id: 'doc-3',
      title: 'รายงานการประเมินภาพลักษณ์และการประชาสัมพันธ์ ไตรมาส 3.pdf',
      type: 'PDF',
      size: '4.1 MB',
      date: '08 ก.ย. 2569',
      color: '#EF4444',
      dept: 'ฝ่ายมวลชนฯ',
    },
    {
      id: 'doc-4',
      title: 'สรุปการสำรวจพื้นที่จิตอาสาและเครือข่ายบำเพ็ญประโยชน์.xlsx',
      type: 'XLSX',
      size: '1.2 MB',
      date: '05 ก.ย. 2569',
      color: '#10B981',
      dept: 'ฝ่ายจิตอาสา',
    },
  ];

  // 2. News & Announcements
  const newsList = [
    {
      id: 'news-1',
      title: 'ฝอ.5 แถลงความพร้อมการบูรณาการระบบฐานข้อมูลกลาง รองรับสถานการณ์ฉุกเฉิน',
      date: '10 ก.ย. 2569',
      category: 'ข่าวประชาสัมพันธ์',
      dept: 'ฝ่ายมวลชนสัมพันธ์',
      deptColor: DEPARTMENT_COLORS.relations, // #EE7E9E
      image: '/assets/ref-homepage.jpg',
    },
    {
      id: 'news-2',
      title: 'แจ้งเตือนเฝ้าระวังระดับน้ำลุ่มน้ำเจ้าพระยาและลุ่มน้ำยม เพิ่มการระบายน้ำต่อเนื่อง',
      date: '09 ก.ย. 2569',
      category: 'สาธารณภัย',
      dept: 'ฝ่ายสาธารณภัย',
      deptColor: DEPARTMENT_COLORS.disaster, // #8191BA
      image: '/assets/ref-dashboard.jpg',
    },
    {
      id: 'news-3',
      title: 'เปิดรับสมัครกำลังพลจิตอาสาพระราชทาน ร่วมกิจกรรมพัฒนาพื้นที่ชุมชนคลองเปรมฯ',
      date: '07 ก.ย. 2569',
      category: 'จิตอาสา',
      dept: 'ฝ่ายจิตอาสา',
      deptColor: DEPARTMENT_COLORS.volunteer, // #EFBB4B
      image: '/assets/fo5-logo.svg',
    },
  ];

  // 3. Calendar Events
  const calendarEvents = [
    {
      id: 'cal-1',
      day: '10',
      month: 'ก.ย.',
      title: 'ประชุมฝ่ายอำนวยการ ประจำสัปดาห์',
      time: '09:30 - 12:00 น.',
      location: 'ห้องประชุม บก.ฝอ.5',
      dept: 'ฝ่ายอำนวยการ',
      deptColor: DEPARTMENT_COLORS.admin, // #7F9B83
    },
    {
      id: 'cal-2',
      day: '12',
      month: 'ก.ย.',
      title: 'แถลงข่าวกิจกรรมและผลการดำเนินงาน ฝอ.5',
      time: '13:30 - 15:00 น.',
      location: 'ห้องแถลงข่าวกลาง',
      dept: 'ฝ่ายมวลชนสัมพันธ์',
      deptColor: DEPARTMENT_COLORS.relations, // #EE7E9E
    },
    {
      id: 'cal-3',
      day: '15',
      month: 'ก.ย.',
      title: 'ซ้อมแผนเผชิญเหตุและเฝ้าระวังอุทกภัยฉับพลัน',
      time: '08:30 - 16:30 น.',
      location: 'ศูนย์ปฏิบัติการฉุกเฉิน',
      dept: 'ฝ่ายสาธารณภัย',
      deptColor: DEPARTMENT_COLORS.disaster, // #8191BA
    },
    {
      id: 'cal-4',
      day: '18',
      month: 'ก.ย.',
      title: 'กิจกรรมจิตอาสาบำเพ็ญสาธารณประโยชน์พื้นที่ชุมชน',
      time: '09:00 - 12:00 น.',
      location: 'พื้นที่ชุมชนเป้าหมาย',
      dept: 'ฝ่ายจิตอาสา',
      deptColor: DEPARTMENT_COLORS.volunteer, // #EFBB4B
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel 1: Recent Documents (เอกสารล่าสุด) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  เอกสารล่าสุด
                </h3>
                <p className="text-[11px] text-slate-500">
                  หนังสือราชการ แผนปฏิบัติการ และรายงาน
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateModule('admin', 'archive')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>ทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {recentDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => navigateModule('admin', 'archive')}
                className="py-3 px-2 rounded-xl hover:bg-slate-50 transition flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: doc.color }}
                  >
                    {doc.type}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition truncate">
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{doc.dept}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition flex-shrink-0">
                  <Download className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={() => navigateModule('admin', 'archive')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>เปิดคลังเอกสารราชการ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel 2: News & Announcements (ข่าวสาร / ประกาศ) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-[#EE7E9E] flex items-center justify-center">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  ข่าวสาร / ประกาศ
                </h3>
                <p className="text-[11px] text-slate-500">
                  ข่าวประชาสัมพันธ์และประกาศทางการ
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateModule('relations')}
              className="text-xs text-[#EE7E9E] hover:text-pink-700 font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>ทั้งหมด</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {newsList.map(news => (
              <div
                key={news.id}
                onClick={() => navigateModule('relations')}
                className="py-3 px-2 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/80">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: `${news.deptColor}20`,
                        color: news.deptColor,
                      }}
                    >
                      {news.dept}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {news.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-[#EE7E9E] transition line-clamp-2 leading-snug">
                    {news.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-2">
          <button
            type="button"
            onClick={() => navigateModule('relations')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#EE7E9E] hover:bg-pink-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>เข้าสู่ศูนย์ข่าวสาร ฝ่ายมวลชนสัมพันธ์</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Panel 3: Calendar & Activities (ปฏิทินกิจกรรม) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#51439A] flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  ตารางภารกิจและเวร ฝอ.5
                </h3>
                <p className="text-[11px] text-slate-500">
                  ภารกิจประจำเดือน และตารางสิบเวร ผนวก ข
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigateModule('duty-roster')}
                className="text-[11px] bg-purple-50 text-[#51439A] hover:bg-purple-100 font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>ตารางเวร</span>
              </button>
              <button
                type="button"
                onClick={() => navigateModule('calendar')}
                className="text-xs text-[#51439A] hover:text-purple-800 font-semibold flex items-center gap-0.5 cursor-pointer"
              >
                <span>ภารกิจ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {calendarEvents.map(event => (
              <div
                key={event.id}
                onClick={() => navigateModule('calendar')}
                className="py-2.5 px-2 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 cursor-pointer group"
              >
                {/* Calendar Date Box */}
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 text-center shadow-2xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                    {event.month}
                  </span>
                  <span className="text-sm font-black text-slate-800 leading-tight">
                    {event.day}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.2 rounded"
                      style={{
                        backgroundColor: `${event.deptColor}20`,
                        color: event.deptColor,
                      }}
                    >
                      {event.dept}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {event.time}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-[#51439A] transition line-clamp-1 leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    สถานที่: {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => navigateModule('calendar')}
            className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#51439A] hover:bg-purple-50 transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
          >
            <span>ดูตารางภารกิจ ฝอ.5</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => navigateModule('duty-roster')}
            className="flex-1 py-2 rounded-xl text-xs font-semibold bg-[#51439A] text-white hover:bg-[#433580] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>ตารางเวร (สิบเวร)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CentralTriPanelGrid;
