import React, { useState, useEffect } from 'react';
import {
  DisasterIncident,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  IncidentAttachment,
} from '../types';
import {
  X,
  Save,
  MapPin,
  FileText,
  Users,
  Paperclip,
  Image as ImageIcon,
  Phone,
  Shield,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: DisasterIncident | null;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const primaryColor = '#8191BA';

  const [title, setTitle] = useState('');
  const [type, setType] = useState<IncidentType>('น้ำป่าไหลหลาก/น้ำท่วมฉับพลัน');
  const [severity, setSeverity] = useState<IncidentSeverity>('เฝ้าระวังสูง');
  const [status, setStatus] = useState<IncidentStatus>('กำลังดำเนินการ');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [village, setVillage] = useState('');
  const [lat, setLat] = useState<number>(20.4336);
  const [lng, setLng] = useState<number>(99.8805);
  const [affectedHouseholds, setAffectedHouseholds] = useState<number>(120);
  const [affectedPeople, setAffectedPeople] = useState<number>(360);
  const [injured, setInjured] = useState<number>(0);
  const [deceased, setDeceased] = useState<number>(0);
  const [waterLevelCm, setWaterLevelCm] = useState<number>(80);
  const [rainfallMm, setRainfallMm] = useState<number>(110);
  const [assignedUnit, setAssignedUnit] = useState('');
  const [officerInCharge, setOfficerInCharge] = useState('');
  const [officerPhone, setOfficerPhone] = useState('');
  const [equipmentInput, setEquipmentInput] = useState('');
  const [shelterLocation, setShelterLocation] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<IncidentAttachment[]>([]);
  const [newImageCaption, setNewImageCaption] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setType(initialData.type);
      setSeverity(initialData.severity);
      setStatus(initialData.status);
      setProvince(initialData.province);
      setDistrict(initialData.district);
      setSubdistrict(initialData.subdistrict);
      setVillage(initialData.village || '');
      setLat(initialData.coordinates.lat);
      setLng(initialData.coordinates.lng);
      setAffectedHouseholds(initialData.affectedHouseholds);
      setAffectedPeople(initialData.affectedPeople);
      setInjured(initialData.casualties.injured);
      setDeceased(initialData.casualties.deceased);
      setWaterLevelCm(initialData.waterLevelCm || 0);
      setRainfallMm(initialData.rainfallMm || 0);
      setAssignedUnit(initialData.assignedUnit);
      setOfficerInCharge(initialData.officerInCharge);
      setOfficerPhone(initialData.officerPhone);
      setEquipmentInput(initialData.equipmentDeployed?.join(', ') || '');
      setShelterLocation(initialData.shelterLocation || '');
      setDescription(initialData.description);
      setAttachments(initialData.attachments || []);
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      setAttachments([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleMockUpload = (fileType: 'image' | 'pdf') => {
    const newAtt: IncidentAttachment = {
      id: `att-${Date.now()}`,
      name: fileType === 'image' ? `ภาพถ่ายสถานการณ์_${Date.now()}.jpg` : `บันทึกข้อความสั่งการ_${Date.now()}.pdf`,
      url: fileType === 'image' ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80' : '#',
      size: '2.1 MB',
      type: fileType,
      uploadedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
    };
    setAttachments(prev => [...prev, newAtt]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipmentArray = equipmentInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      type,
      severity,
      status,
      province,
      district,
      subdistrict,
      village,
      coordinates: { lat: Number(lat), lng: Number(lng) },
      affectedHouseholds: Number(affectedHouseholds),
      affectedPeople: Number(affectedPeople),
      casualties: {
        injured: Number(injured),
        deceased: Number(deceased),
        missing: 0,
      },
      waterLevelCm: Number(waterLevelCm),
      rainfallMm: Number(rainfallMm),
      assignedUnit,
      officerInCharge,
      officerPhone,
      equipmentDeployed: equipmentArray,
      shelterLocation,
      description,
      attachments,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden text-[#1F2937]">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialData ? 'แก้ไขข้อมูลเหตุการณ์สาธารณภัย' : 'เพิ่มบันทึกรายงานเหตุการณ์ใหม่'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                DISASTER INCIDENT RECORD & LOGISTICS REGISTRY
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              หัวข้อเหตุการณ์ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="ระบุหัวข้อเหตุการณ์ เช่น น้ำล้นตลิ่งท่วมขังตลาดสายลมจอย..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Type, Severity, Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">ประเภทภัย</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as IncidentType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="น้ำป่าไหลหลาก/น้ำท่วมฉับพลัน">น้ำป่าไหลหลาก/น้ำท่วมฉับพลัน</option>
                <option value="น้ำท่วมขัง/น้ำรอการระบาย">น้ำท่วมขัง/น้ำรอการระบาย</option>
                <option value="ตลิ่งทรุด/ดินโคลนถล่ม">ตลิ่งทรุด/ดินโคลนถล่ม</option>
                <option value="วาตภัย/ลมกรรโชกแรง">วาตภัย/ลมกรรโชกแรง</option>
                <option value="อัคคีภัย/หมอกควัน">อัคคีภัย/หมอกควัน</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">ระดับความรุนแรง</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="วิกฤต">วิกฤต (แดง)</option>
                <option value="เฝ้าระวังสูง">เฝ้าระวังสูง (ส้ม)</option>
                <option value="เฝ้าระวัง">เฝ้าระวัง (เหลือง)</option>
                <option value="ปกติ">ปกติ (เขียว)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">สถานะการปฏิบัติการ</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as IncidentStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
              >
                <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="ควบคุมสถานการณ์">ควบคุมสถานการณ์</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              </select>
            </div>
          </div>

          {/* Location & GPS Coordinates */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>พื้นที่เกิดเหตุและพิกัดภูมิศาสตร์ (Geospatial Coordinates)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">จังหวัด</label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">อำเภอ</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ตำบล</label>
                <input
                  type="text"
                  required
                  value={subdistrict}
                  onChange={e => setSubdistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">หมู่บ้าน/ชุมชน</label>
                <input
                  type="text"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/60">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ละติจูด (Latitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={lat}
                  onChange={e => setLat(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ลองจิจูด (Longitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={lng}
                  onChange={e => setLng(parseFloat(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ระดับน้ำท่วม (ซม.)</label>
                <input
                  type="number"
                  value={waterLevelCm}
                  onChange={e => setWaterLevelCm(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">ปริมาณฝนสะสม (มม.)</label>
                <input
                  type="number"
                  value={rainfallMm}
                  onChange={e => setRainfallMm(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Impact and Casualties */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ครัวเรือนกระทบ</label>
              <input
                type="number"
                value={affectedHouseholds}
                onChange={e => setAffectedHouseholds(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ผู้ประสบภัย (คน)</label>
              <input
                type="number"
                value={affectedPeople}
                onChange={e => setAffectedPeople(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ผู้บาดเจ็บ</label>
              <input
                type="number"
                value={injured}
                onChange={e => setInjured(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ศูนย์พักพิง</label>
              <input
                type="text"
                value={shelterLocation}
                onChange={e => setShelterLocation(e.target.value)}
                placeholder="ชื่อศูนย์อพยพ..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Assigned Unit & Responders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">หน่วยงานรับผิดชอบ</label>
              <input
                type="text"
                value={assignedUnit}
                onChange={e => setAssignedUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ผู้รับผิดชอบหลัก</label>
              <input
                type="text"
                value={officerInCharge}
                onChange={e => setOfficerInCharge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">เบอร์โทรติดต่อ</label>
              <input
                type="text"
                value={officerPhone}
                onChange={e => setOfficerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
          </div>

          {/* Equipment deployed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              เครื่องจักรกล/อุปกรณ์ที่สนับสนุน (คั่นด้วยเครื่องหมายจุลภาค)
            </label>
            <input
              type="text"
              value={equipmentInput}
              onChange={e => setEquipmentInput(e.target.value)}
              placeholder="เรือท้องแบน 4 ลำ, รถยกสูง 2 คัน, เครื่องสูบน้ำ 12 นิ้ว..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียดเหตุการณ์และแนวทางการเผชิญเหตุ
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="บรรยายลักษณะมวลน้ำ สภาพความเสียหาย การอพยพ และการประสานงานช่วยเหลือ..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {/* Attachments Section (Images & Docs) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-800">
                เอกสารและภาพถ่ายแนบ ({attachments.length} รายการ)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMockUpload('image')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                  <span>+ แนบภาพถ่าย</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMockUpload('pdf')}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5 text-rose-600" />
                  <span>+ แนบเอกสาร PDF</span>
                </button>
              </div>
            </div>

            {attachments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">
                ยังไม่มีการแนบไฟล์ สามารถกดปุ่มด้านบนเพื่อจำลองการอัปโหลดไฟล์ภาพหรือรายงาน
              </p>
            ) : (
              <div className="space-y-2">
                {attachments.map(att => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {att.type === 'image' ? (
                        <ImageIcon className="w-4 h-4 text-sky-600 flex-shrink-0" />
                      ) : (
                        <Paperclip className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <span className="truncate text-slate-700">{att.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({att.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 cursor-pointer flex items-center gap-1.5"
              style={{ backgroundColor: primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'บันทึกการแก้ไข' : 'บันทึกเหตุการณ์'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
