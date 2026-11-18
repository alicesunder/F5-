import React, { useState } from 'react';
import {
  MapPin,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Trash2,
  Printer,
  Calendar,
} from 'lucide-react';
import { BppMissionItem, BppMissionStatus } from '../types';

interface BppMissionTableViewProps {
  missions: BppMissionItem[];
  onSelectMission: (mission: BppMissionItem) => void;
  onUpdateStatus: (id: string, status: BppMissionStatus) => void;
  onDeleteMission: (id: string) => void;
}

export const BppMissionTableView: React.FC<BppMissionTableViewProps> = ({
  missions,
  onSelectMission,
  onUpdateStatus,
  onDeleteMission,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalPages = Math.ceil(missions.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMissions = missions.slice(startIndex, startIndex + itemsPerPage);

  // Status Badges (Item 17: Completion check pop animation)
  const getStatusBadge = (status: BppMissionStatus) => {
    switch (status) {
      case 'ดำเนินการแล้ว':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#059669] border border-emerald-200/70 bpp-status-completed shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
            <span>ดำเนินการแล้ว</span>
          </span>
        );
      case 'อยู่ระหว่างดำเนินการ':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-[#D97706] border border-amber-200/70 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            <span>อยู่ระหว่างดำเนินการ</span>
          </span>
        );
      case 'รอดำเนินการ':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B2A86]" />
            <span>รอดำเนินการ</span>
          </span>
        );
      case 'ยังไม่กำหนด':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-[#E11D48] border border-rose-200/70 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
            <span>ยังไม่กำหนด</span>
          </span>
        );
    }
  };

  // Department Color Indicators:
  // ฝอ.5 / อก.: #5B2A86
  // ปชส. / มชส.: #2583D8
  // สภ. / สาธารณภัย: #E89B22
  // จอส. / จิตอาสา: #42A77A
  const getResponsibleBadge = (resp: string) => {
    if (resp === 'จอส.' || resp.includes('จิตอาสา')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-[#ECFDF5] text-[#2E7D56] border border-[#42A77A]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#42A77A]" />
          จอส.
        </span>
      );
    }
    if (resp === 'อก.' || resp.includes('อำนวยการ')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-[#EDE4F7] text-[#5B2A86] border border-[#5B2A86]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B2A86]" />
          อก.
        </span>
      );
    }
    if (resp === 'มชส.' || resp.includes('ประชาสัมพันธ์')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-[#1D6CB4] border border-[#2583D8]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2583D8]" />
          มชส.
        </span>
      );
    }
    if (resp === 'สภ.' || resp.includes('สาธารณภัย')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-[#B77510] border border-[#E89B22]/25">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E89B22]" />
          สภ.
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-[#F7F7F9] text-[#4A4852] border border-[rgba(40,35,50,0.08)]">
        {resp || '-'}
      </span>
    );
  };

  const handlePrintSingle = (item: BppMissionItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>บันทึกภารกิจ ฝอ.5 - ${item.title}</title>
          <style>
            body { font-family: 'DM Sans', sans-serif; padding: 24px; color: #2D2A32; }
            h2 { color: #5B2A86; border-bottom: 2px solid #5B2A86; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 14px; }
            th { background-color: #F7F7F9; }
          </style>
        </head>
        <body>
          <h2>ฝ่ายอำนวยการ 5 กองบังคับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน</h2>
          <h3>บันทึกรายละเอียดภารกิจ</h3>
          <table>
            <tr><th>ภารกิจ</th><td>${item.title}</td></tr>
            <tr><th>วันที่</th><td>${item.date}</td></tr>
            <tr><th>เวลา</th><td>${item.time}</td></tr>
            <tr><th>สถานที่</th><td>${item.location}</td></tr>
            <tr><th>ผู้เข้าร่วม</th><td>${item.attendees}</td></tr>
            <tr><th>การแต่งกาย</th><td>${item.uniform}</td></tr>
            <tr><th>ผู้รับผิดชอบ</th><td>${item.responsible}</td></tr>
            <tr><th>สถานะ</th><td>${item.status}</td></tr>
            <tr><th>หมายเหตุ</th><td>${item.remarks}</td></tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-4">
      {/* Clean Flat Government Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[rgba(40,35,50,0.07)] bg-white shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            {/* Table Header: Clean Neutral Government Table Surface */}
            <tr className="bg-[#F7F7F9] border-b border-[rgba(40,35,50,0.08)] text-[#4A4852] font-bold tracking-tight">
              <th className="py-3 px-4 min-w-[105px]">วันที่</th>
              <th className="py-3 px-3 min-w-[85px]">เวลา</th>
              <th className="py-3 px-4 min-w-[220px]">รายละเอียดภารกิจ</th>
              <th className="py-3 px-3 min-w-[140px]">สถานที่</th>
              <th className="py-3 px-3 min-w-[150px]">ผู้เข้าร่วมภารกิจ</th>
              <th className="py-3 px-3 min-w-[140px]">การแต่งกาย</th>
              <th className="py-3 px-3 min-w-[95px]">ผู้รับผิดชอบ</th>
              <th className="py-3 px-3 min-w-[130px]">สถานะ</th>
              <th className="py-3 px-3 min-w-[90px]">หมายเหตุ</th>
              <th className="py-3 px-3 w-12 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(40,35,50,0.05)] text-[#2D2A32]">
            {currentMissions.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-[#8A8792]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-[#8A8792]/50" />
                    <p className="text-sm font-semibold text-[#2D2A32]">ไม่พบรายการภารกิจตามเงื่อนไขที่เลือก</p>
                    <p className="text-xs text-[#8A8792]">กรุณาลองปรับเปลี่ยนเงื่อนไขการค้นหาหรือกลุ่มสายงาน</p>
                  </div>
                </td>
              </tr>
            ) : (
              currentMissions.map((item) => {
                const deptColor =
                  item.responsible?.includes('จิตอาสา') || item.responsible === 'จอส.'
                    ? '#42A77A'
                    : item.responsible?.includes('ประชาสัมพันธ์') || item.responsible === 'มชส.'
                    ? '#2583D8'
                    : item.responsible?.includes('สาธารณภัย') || item.responsible === 'สภ.'
                    ? '#E89B22'
                    : '#5B2A86';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F7F4FA]/80 transition-colors duration-180 group cursor-pointer bg-white relative"
                    onClick={() => onSelectMission(item)}
                  >
                    {/* วันที่ (With Item 9 Left Department-Colored Indicator) */}
                    <td className="py-3 px-4 font-semibold text-[#2D2A32] whitespace-nowrap relative">
                      {/* Department Accent Left Indicator on Hover */}
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-[3.5px] rounded-r-md opacity-0 group-hover:opacity-100 transition-opacity duration-180"
                        style={{ backgroundColor: deptColor }}
                      />
                      <div className="flex items-center gap-1.5 group-hover:translate-x-[1px] transition-transform duration-180">
                        <Calendar className="w-3.5 h-3.5 text-[#8A8792] group-hover:text-[#5B2A86]" />
                        <span>{item.date}</span>
                      </div>
                    </td>

                    {/* เวลา */}
                    <td className="py-3 px-3 text-[#5A5764] font-medium whitespace-nowrap group-hover:translate-x-[1px] transition-transform duration-180">
                      {item.time}
                    </td>

                    {/* รายละเอียดภารกิจ */}
                    <td className="py-3 px-4 font-medium text-[#2D2A32] leading-snug">
                      <div className="line-clamp-2 group-hover:text-[#5B2A86] group-hover:translate-x-[1px] transition-all duration-180">
                        {item.title}
                      </div>
                    </td>

                  {/* สถานที่ */}
                  <td className="py-3 px-3 text-[#5A5764]">
                    <div className="flex items-start gap-1">
                      {item.location !== '-' && item.location !== 'ยังไม่กำหนด' && (
                        <MapPin className="w-3.5 h-3.5 text-[#8A8792] mt-0.5 flex-shrink-0" />
                      )}
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </td>

                  {/* ผู้เข้าร่วมภารกิจ */}
                  <td className="py-3 px-3 text-[#5A5764]">
                    <div className="line-clamp-2">{item.attendees}</div>
                  </td>

                  {/* การแต่งกาย */}
                  <td className="py-3 px-3 text-[#5A5764]">
                    <div className="line-clamp-2">{item.uniform}</div>
                  </td>

                  {/* ผู้รับผิดชอบ */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getResponsibleBadge(item.responsible)}
                  </td>

                  {/* สถานะ */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* หมายเหตุ */}
                  <td className="py-3 px-3 text-[#5A5764]">
                    <span className="line-clamp-1">{item.remarks}</span>
                  </td>

                  {/* จัดการ Action Dropdown */}
                  <td
                    className="py-3 px-3 text-center relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === item.id ? null : item.id)
                      }
                      className="p-1.5 rounded-lg text-[#8A8792] hover:text-[#2D2A32] hover:bg-[#F7F7F9] transition cursor-pointer"
                      title="ตัวเลือกเพิ่มเติม"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {activeMenuId === item.id && (
                      <>
                        <div
                          className="fixed inset-0 z-20"
                          onClick={() => setActiveMenuId(null)}
                        />
                        <div className="absolute right-2 top-9 z-30 w-48 bg-white rounded-xl border border-[rgba(40,35,50,0.08)] shadow-[0_4px_16px_rgba(40,35,50,0.1)] py-1.5 text-left divide-y divide-[rgba(40,35,50,0.06)]">
                          {/* 1. View & Edit */}
                          <div className="py-1">
                            <button
                              onClick={() => {
                                onSelectMission(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#2D2A32] hover:bg-[#F7F7F9] hover:text-[#5B2A86] flex items-center gap-2 font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#5B2A86]" />
                              <span>ดูรายละเอียดภารกิจ</span>
                            </button>
                            <button
                              onClick={() => {
                                onSelectMission(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#2D2A32] hover:bg-[#F7F7F9] flex items-center gap-2 font-medium"
                            >
                              <FileEdit className="w-3.5 h-3.5 text-[#8A8792]" />
                              <span>แก้ไขข้อมูลภารกิจ</span>
                            </button>
                          </div>

                          {/* 2. Quick Status Updates */}
                          <div className="py-1">
                            <div className="px-3 py-1 text-[10px] font-semibold text-[#8A8792] uppercase">
                              เปลี่ยนสถานะ
                            </div>
                            <button
                              onClick={() => {
                                onUpdateStatus(item.id, 'ดำเนินการแล้ว');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-medium"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                              <span>ดำเนินการแล้ว</span>
                            </button>
                            <button
                              onClick={() => {
                                onUpdateStatus(item.id, 'อยู่ระหว่างดำเนินการ');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-medium"
                            >
                              <span className="w-3.5 h-3.5 rounded-full border-2 border-amber-600 flex items-center justify-center text-[9px] font-bold text-amber-600">
                                !
                              </span>
                              <span>อยู่ระหว่างดำเนินการ</span>
                            </button>
                          </div>

                          {/* 3. Print & Delete */}
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handlePrintSingle(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-[#4A4852] hover:bg-[#F7F7F9] flex items-center gap-2 font-medium"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#8A8792]" />
                              <span>พิมพ์บันทึกนี้</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`คุณต้องการลบภารกิจ "${item.title}" ใช่หรือไม่?`)) {
                                  onDeleteMission(item.id);
                                }
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>ลบภารกิจ</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>

      {/* Table Footer & Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A8792] pt-1">
        <div>
          แสดง{' '}
          <strong className="text-[#2D2A32]">
            {missions.length > 0 ? startIndex + 1 : 0} -{' '}
            {Math.min(startIndex + itemsPerPage, missions.length)}
          </strong>{' '}
          จาก <strong className="text-[#2D2A32]">{missions.length}</strong> รายการ
        </div>

        {/* Clean Government Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1 select-none">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-[rgba(40,35,50,0.08)] bg-white text-[#4A4852] hover:bg-[#F7F7F9] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#5B2A86] text-white'
                    : 'bg-white text-[#4A4852] border border-[rgba(40,35,50,0.08)] hover:bg-[#F7F7F9]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-[rgba(40,35,50,0.08)] bg-white text-[#4A4852] hover:bg-[#F7F7F9] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BppMissionTableView;
