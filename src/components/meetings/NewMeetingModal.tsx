import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { Meeting } from '../../types';
import { X, Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import { fiscalYearBE, toThaiDigits } from '../../lib/fiscalYear';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (meeting: Meeting) => void;
}

const MONTH_NAMES = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const NewMeetingModal: React.FC<NewMeetingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addMeeting, currentUser, personnel } = useAdmin();

  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [meetingNumber, setMeetingNumber] = useState(`${new Date().getMonth() + 1}/${new Date().getFullYear() + 543}`);
  const [title, setTitle] = useState(`การประชุมฝ่ายอำนวยการ ประจำเดือน ${MONTH_NAMES[new Date().getMonth()]} ${toThaiDigits(new Date().getFullYear() + 543)}`);
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 10));
  const [meetingTime, setMeetingTime] = useState('09:30');
  const [location, setLocation] = useState('');
  const [chairperson, setChairperson] = useState('');
  const [secretary, setSecretary] = useState(currentUser.name);
  const [totalAttendees, setTotalAttendees] = useState(18);

  if (!isOpen) return null;

  const handleMonthChange = (idx: number) => {
    setMonthIndex(idx);
    const mName = MONTH_NAMES[idx];
    setMeetingNumber(`${idx + 1}/${new Date().getFullYear() + 543}`);
    setTitle(`การประชุมฝ่ายอำนวยการ ประจำเดือน ${mName} ${toThaiDigits(new Date().getFullYear() + 543)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMeetingData = {
      meeting_number: meetingNumber,
      month_label: MONTH_NAMES[monthIndex],
      title: title.trim(),
      fiscal_year: fiscalYearBE(new Date(meetingDate || Date.now())),
      meeting_date: meetingDate,
      meeting_time: meetingTime,
      location,
      chairperson,
      secretary,
      total_attendees: Number(totalAttendees),
      status: 'นัดหมายแล้ว' as const,
      agendas: [
        {
          order: 1,
          title: 'วาระที่ ๑: เรื่องที่ประธานแจ้งให้ที่ประชุมทราบ',
          description: 'นโยบายและข้อสั่งการสำคัญจากหน่วยเหนือและการขับเคลื่อนภารกิจประจำเดือน',
          presenter: chairperson,
        },
        {
          order: 2,
          title: 'วาระที่ ๒: รับรองรายงานการประชุมครั้งที่ผ่านมา',
          description: 'การตรวจสอบและรับรองมติการประชุมครั้งก่อนหน้า',
          presenter: secretary,
        },
        {
          order: 3,
          title: 'วาระที่ ๓: เรื่องสืบเนื่องจากการประชุมครั้งก่อน',
          description: 'ติดตามความก้าวหน้าการดำเนินงานตามข้อสั่งการและมติที่ค้างดำเนินการ',
          presenter: 'หัวหน้ากลุ่มงาน',
        },
        {
          order: 4,
          title: 'วาระที่ ๔: เรื่องเพื่อพิจารณาและเสนอเพื่อทราบ',
          description: 'รายงานผลการเบิกจ่ายงบประมาณ แผนการปฏิบัติงาน และการบริหารกำลังพล',
          presenter: 'ฝ่ายอำนวยการ',
        },
        {
          order: 5,
          title: 'วาระที่ ๕: เรื่องอื่นๆ (ถ้ามี)',
          description: 'การซักถามและข้อเสนอแนะเพิ่มเติมจากผู้เข้าร่วมประชุม',
        },
      ],
      resolutions: [],
      attendees: personnel.slice(0, Math.min(totalAttendees, personnel.length)).map(p => ({
        person_id: p.person_id,
        name: p.name,
        position: p.position,
        unit: p.unit_name,
        attended: true,
      })),
      aiSummary: 'การประชุมประจำเดือนของฝ่ายอำนวยการเพื่อติดตามความพร้อมและความคืบหน้าของงานตามนโยบาย',
    };

    addMeeting(newMeetingData as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">บันทึกนัดหมายการประชุมใหม่</h3>
              <p className="text-xs text-slate-500">สร้างบันทึกการประชุมประจำเดือนพร้อม 5 ระเบียบวาระมาตรฐาน</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประจำเดือน <span className="text-rose-500">*</span>
              </label>
              <select
                value={monthIndex}
                onChange={e => handleMonthChange(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ครั้งที่ประชุม <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={meetingNumber}
                onChange={e => setMeetingNumber(e.target.value)}
                placeholder="เช่น 1/2569"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อการประชุม <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                วันที่ประชุม
              </label>
              <input
                type="date"
                required
                value={meetingDate}
                onChange={e => setMeetingDate(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เวลาประชุม
              </label>
              <input
                type="time"
                value={meetingTime}
                onChange={e => setMeetingTime(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                สถานที่ / ห้องประชุม
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                จำนวนผู้เข้าร่วม (นาย)
              </label>
              <input
                type="number"
                min={1}
                value={totalAttendees}
                onChange={e => setTotalAttendees(Number(e.target.value))}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ประธานในที่ประชุม
              </label>
              <input
                type="text"
                value={chairperson}
                onChange={e => setChairperson(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                เลขานุการการประชุม
              </label>
              <input
                type="text"
                value={secretary}
                onChange={e => setSecretary(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              สร้างการประชุม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
