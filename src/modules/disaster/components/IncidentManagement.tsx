import React, { useState, useMemo } from 'react';
import {
  DisasterIncident,
  IncidentStatus,
  IncidentSeverity,
  IncidentType,
} from '../types';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  Table as TableIcon,
  Phone,
  Droplet,
} from 'lucide-react';

interface IncidentManagementProps {
  incidents: DisasterIncident[];
  onOpenNewModal: () => void;
  onSelectIncident: (incident: DisasterIncident) => void;
  onEditIncident: (incident: DisasterIncident) => void;
  onDeleteIncident: (id: string) => void;
  onStatusChange: (id: string, newStatus: IncidentStatus) => void;
}

export const IncidentManagement: React.FC<IncidentManagementProps> = ({
  incidents,
  onOpenNewModal,
  onSelectIncident,
  onEditIncident,
  onDeleteIncident,
  onStatusChange,
}) => {
  const primaryColor = '#8191BA';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const statuses: { id: string; label: string }[] = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'รอตรวจสอบ', label: 'รอตรวจสอบ' },
    { id: 'กำลังดำเนินการ', label: 'กำลังดำเนินการ' },
    { id: 'ควบคุมสถานการณ์', label: 'ควบคุมสถานการณ์' },
    { id: 'เสร็จสิ้น', label: 'เสร็จสิ้น' },
  ];

  const filteredIncidents = useMemo(() => {
    return incidents.filter(item => {
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
      if (selectedSeverity !== 'all' && item.severity !== selectedSeverity) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q) ||
          item.district.toLowerCase().includes(q) ||
          item.assignedUnit.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [incidents, selectedStatus, selectedSeverity, searchQuery]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Action Toolbar */}
      <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-base font-bold text-slate-900">
                ระบบจัดการและบัญชาการเหตุการณ์สาธารณภัย (Incident Control Registry)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              บันทึก ติดตาม ตรวจสอบสถานะการเผชิญเหตุ และจัดสรรทรัพยากรช่วยเหลือผู้ประสบภัย
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-slate-200/70 text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="มุมมองตาราง"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Add Incident Button */}
            <button
              type="button"
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition hover:opacity-90 active:scale-95 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>เพิ่มเหตุการณ์</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {statuses.map(s => {
              const isSelected = selectedStatus === s.id;
              const count =
                s.id === 'all'
                  ? incidents.length
                  : incidents.filter(i => i.status === s.id).length;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200'
                  }`}
                >
                  <span>{s.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Field & Severity dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSeverity}
              onChange={e => setSelectedSeverity(e.target.value)}
              className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none"
            >
              <option value="all">ทุกระดับความรุนแรง</option>
              <option value="วิกฤต">วิกฤต (แดง)</option>
              <option value="เฝ้าระวังสูง">เฝ้าระวังสูง (ส้ม)</option>
              <option value="เฝ้าระวัง">เฝ้าระวัง (เหลือง)</option>
              <option value="ปกติ">ปกติ (เขียว)</option>
            </select>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ค้นหารหัส หรือชื่อเหตุ..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main List Display: Table or Cards View */}
      {filteredIncidents.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          ไม่พบข้อมูลเหตุการณ์ที่ตรงกับเงื่อนไขการค้นหา
        </div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[11px] bg-slate-50/40">
                <th className="py-3 px-5 font-semibold">รหัส / เหตุการณ์</th>
                <th className="py-3 px-3 font-semibold">ประเภท / ความรุนแรง</th>
                <th className="py-3 px-3 font-semibold">พื้นที่เกิดเหตุ</th>
                <th className="py-3 px-3 font-semibold text-right">ครัวเรือน / น้ำท่วม</th>
                <th className="py-3 px-3 font-semibold">หน่วยรับผิดชอบ</th>
                <th className="py-3 px-3 font-semibold text-center">สถานะ</th>
                <th className="py-3 px-5 font-semibold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.map(incident => {
                let severityBadge = (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                    {incident.severity}
                  </span>
                );
                if (incident.severity === 'วิกฤต') {
                  severityBadge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 animate-pulse">
                      วิกฤต
                    </span>
                  );
                } else if (incident.severity === 'เฝ้าระวังสูง') {
                  severityBadge = (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                      เฝ้าระวังสูง
                    </span>
                  );
                }

                return (
                  <tr key={incident.id} className="hover:bg-slate-50/70 transition">
                    {/* ID & Title */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="font-mono font-bold text-slate-500 text-[11px]">
                            {incident.id}
                          </div>
                          <div
                            onClick={() => onSelectIncident(incident)}
                            className="font-semibold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-1 max-w-xs"
                          >
                            {incident.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            แจ้ง: {incident.reportedAt}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type & Severity */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="text-slate-700">{incident.type}</div>
                        <div>{severityBadge}</div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 text-slate-600">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{incident.district}, จ.{incident.province}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 ml-4.5">
                        ต.{incident.subdistrict} {incident.village}
                      </div>
                    </td>

                    {/* Impact & Water Level */}
                    <td className="py-3.5 px-3 text-right font-mono">
                      <div className="font-bold text-slate-800">
                        {incident.affectedHouseholds.toLocaleString()} ครัวเรือน
                      </div>
                      {incident.waterLevelCm ? (
                        <div className="text-[11px] text-sky-600 font-medium">
                          น้ำสูง {incident.waterLevelCm} ซม.
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400">-</div>
                      )}
                    </td>

                    {/* Unit & Contact */}
                    <td className="py-3.5 px-3 text-slate-600">
                      <div className="font-medium text-slate-800 truncate max-w-[160px]">
                        {incident.assignedUnit}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {incident.officerInCharge}
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3 text-center">
                      <select
                        value={incident.status}
                        onChange={e => onStatusChange(incident.id, e.target.value as IncidentStatus)}
                        className={`text-xs font-semibold py-1 px-2.5 rounded-lg border focus:outline-none cursor-pointer ${
                          incident.status === 'กำลังดำเนินการ'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : incident.status === 'ควบคุมสถานการณ์'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : incident.status === 'เสร็จสิ้น'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                        <option value="ควบคุมสถานการณ์">ควบคุมสถานการณ์</option>
                        <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                      </select>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectIncident(incident)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditIncident(incident)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title="แก้ไขเหตุการณ์"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('คุณต้องการลบเหตุการณ์นี้ใช่หรือไม่?')) {
                              onDeleteIncident(incident.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="ลบเหตุการณ์"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View Mode */
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIncidents.map(incident => (
            <div
              key={incident.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-slate-400">{incident.id}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      backgroundColor:
                        incident.severity === 'วิกฤต'
                          ? '#FFE4E6'
                          : incident.severity === 'เฝ้าระวังสูง'
                          ? '#FEF3C7'
                          : '#E0F2FE',
                      color:
                        incident.severity === 'วิกฤต'
                          ? '#BE123C'
                          : incident.severity === 'เฝ้าระวังสูง'
                          ? '#B45309'
                          : '#0369A1',
                    }}
                  >
                    {incident.severity}
                  </span>
                </div>

                <h4
                  onClick={() => onSelectIncident(incident)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-700 cursor-pointer line-clamp-2"
                >
                  {incident.title}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{incident.district}, จ.{incident.province}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{incident.affectedHouseholds.toLocaleString()} ครัวเรือน ({incident.affectedPeople} คน)</span>
                  </div>
                  {incident.waterLevelCm ? (
                    <div className="flex items-center gap-1.5 text-sky-600">
                      <Droplet className="w-3.5 h-3.5" />
                      <span>ระดับน้ำท่วม {incident.waterLevelCm} ซม.</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    incident.status === 'กำลังดำเนินการ'
                      ? 'bg-amber-100 text-amber-800'
                      : incident.status === 'ควบคุมสถานการณ์'
                      ? 'bg-blue-100 text-blue-800'
                      : incident.status === 'เสร็จสิ้น'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {incident.status}
                </span>

                <button
                  type="button"
                  onClick={() => onSelectIncident(incident)}
                  className="text-xs text-slate-700 hover:underline font-semibold"
                >
                  ดูแฟ้มเหตุการณ์ →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
