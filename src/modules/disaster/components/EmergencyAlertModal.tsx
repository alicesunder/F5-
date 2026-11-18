import React, { useState } from 'react';
import {
  X,
  Radio,
  Send,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendAlert: (alertData: any) => void;
}

export const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({
  isOpen,
  onClose,
  onSendAlert,
}) => {
  const primaryColor = '#8191BA';

  const [level, setLevel] = useState<'เตือนภัยสีแดง' | 'เตือนภัยสีส้ม' | 'เฝ้าระวังสีเหลือง'>('เตือนภัยสีแดง');
  const [targetProvinces, setTargetProvinces] = useState('เชียงราย, น่าน, สุโขทัย');
  const [headline, setHeadline] = useState('แจ้งเตือนภัยน้ำป่าไหลหลากและน้ำล้นตลิ่งฉับพลัน');
  const [message, setMessage] = useState(
    'ขอให้ประชาชนริมแม่น้ำสาย อ.แม่สาย ยกของขึ้นที่สูงทันที และเตรียมพร้อมอพยพตามแผนเผชิญเหตุ ติดต่อสายด่วน 1784 ตลอด 24 ชม.'
  );
  const [channels, setChannels] = useState({
    smsCellBroadcast: true,
    sirenTower: true,
    radioBroadcast: true,
    lineOfficial: true,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendAlert({
      level,
      targetProvinces,
      headline,
      message,
      channels,
      timestamp: new Date().toLocaleTimeString('th-TH'),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-[#1F2937]">
        {/* Header */}
        <div className="px-6 py-4.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-900">
                ระบบกระจายสัญญาณแจ้งเตือนภัยฉุกเฉิน (Emergency Alert Broadcast)
              </h3>
              <p className="text-[11px] text-rose-600 font-mono">CELL BROADCAST & EARLY WARNING SYSTEM</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ระดับการแจ้งเตือน</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value as any)}
              className="w-full p-2 rounded-xl border border-slate-200 bg-white font-semibold"
            >
              <option value="เตือนภัยสีแดง">ระดับ 3: เตือนภัยวิกฤตสีแดง (อพยพทันที)</option>
              <option value="เตือนภัยสีส้ม">ระดับ 2: เตือนภัยสูงสีส้ม (เตรียมความพร้อม)</option>
              <option value="เฝ้าระวังสีเหลือง">ระดับ 1: เฝ้าระวังสีเหลือง (ติดตามข่าวสาร)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">พื้นที่เป้าหมาย (จังหวัด/อำเภอ)</label>
            <input
              type="text"
              required
              value={targetProvinces}
              onChange={e => setTargetProvinces(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">หัวข้อประกาศแจ้งเตือน</label>
            <input
              type="text"
              required
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              className="w-full p-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">ข้อความแจ้งเตือน (SMS/เสียงเตือน)</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-semibold text-slate-800 block">ช่องทางการส่งกระจายสัญญาณ:</span>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={channels.smsCellBroadcast}
                  onChange={e => setChannels({ ...channels, smsCellBroadcast: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-0"
                />
                <span>Cell Broadcast (มือถือ)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={channels.sirenTower}
                  onChange={e => setChannels({ ...channels, sirenTower: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-0"
                />
                <span>หอเตือนภัยประจำตำบล</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={channels.radioBroadcast}
                  onChange={e => setChannels({ ...channels, radioBroadcast: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-0"
                />
                <span>วิทยุกระจายเสียง ปภ.</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={channels.lineOfficial}
                  onChange={e => setChannels({ ...channels, lineOfficial: e.target.checked })}
                  className="rounded text-rose-600 focus:ring-0"
                />
                <span>LINE Alert ศูนย์เตือนภัย</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ส่งกระจายสัญญาณเตือนภัย</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
