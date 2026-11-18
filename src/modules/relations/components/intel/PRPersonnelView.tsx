import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Camera,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';

export const PRPersonnelView: React.FC = () => {
  const { personnel, missions, setSelectedMission, setActivePRView } = usePRIntel();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string | null>(null);

  const filteredPersonnel = personnel.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.unit.toLowerCase().includes(q) ||
      p.specialty.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q)
    );
  });

  const selectedPerson = personnel.find((p) => p.id === selectedPersonnelId) || filteredPersonnel[0];
  const personMissions = selectedPerson
    ? missions.filter((m) => m.personnelId === selectedPerson.id)
    : [];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <Users className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">
                  ทำเนียบกำลังพลช่างภาพ & เจ้าหน้าที่สื่อสาร (PR Photographers)
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  รายชื่อเจ้าหน้าที่บันทึกภาพปฏิบัติการ ผู้ควบคุมโดรน และทีมตัดต่อสื่อดิจิทัล บช.ตชด.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left List (4 cols) & Right Profile Detail (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Personnel List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, สังกัด หรือความเชี่ยวชาญ..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredPersonnel.map((person) => {
              const isSelected = selectedPerson?.id === person.id;
              return (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonnelId(person.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-pink-50/70 border-pink-300 ring-1 ring-pink-400 shadow-2xs'
                      : 'bg-white border-slate-200/80 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {person.rank} {person.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{person.position}</p>
                      <p className="text-[10px] text-pink-700 font-semibold">{person.unit}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                      {person.totalMissions} งาน
                    </span>
                    <p className="text-[9px] text-emerald-600 font-semibold mt-0.5">
                      สำเร็จ {person.completedMissions}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail Card */}
        <div className="lg:col-span-7">
          {selectedPerson ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              {/* Profile Top */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                <img
                  src={selectedPerson.avatar}
                  alt={selectedPerson.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-pink-200 shadow-xs"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[#1E1B4B]">
                      {selectedPerson.rank} {selectedPerson.name}
                    </h2>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      พร้อมปฏิบัติภารกิจ
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">{selectedPerson.position}</p>
                  <p className="text-xs text-slate-500">สังกัด: {selectedPerson.unit}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedPerson.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedPerson.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialty */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                  ความเชี่ยวชาญเฉพาะทาง:
                </span>
                <p className="text-xs text-slate-600">{selectedPerson.specialty}</p>
              </div>

              {/* Stats 3 boxes */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-400">ภารกิจทั้งหมด</span>
                  <p className="text-lg font-black text-[#1E1B4B] font-mono">
                    {selectedPerson.totalMissions}
                  </p>
                </div>
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[11px] text-emerald-700">ส่งมอบสมบูรณ์</span>
                  <p className="text-lg font-black text-emerald-700 font-mono">
                    {selectedPerson.completedMissions}
                  </p>
                </div>
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <span className="text-[11px] text-amber-700">กำลังรับผิดชอบ</span>
                  <p className="text-lg font-black text-amber-800 font-mono">
                    {selectedPerson.activeMissions}
                  </p>
                </div>
              </div>

              {/* Assigned Missions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                    ภารกิจที่ได้รับมอบหมาย ({personMissions.length})
                  </h3>
                </div>

                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {personMissions.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">
                      ยังไม่มีประวัติภารกิจที่บันทึกไว้
                    </p>
                  ) : (
                    personMissions.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMission(m);
                          setActivePRView('photo-missions');
                        }}
                        className="p-3 rounded-xl border border-slate-200/80 hover:border-pink-300 cursor-pointer transition flex items-center justify-between bg-slate-50/50"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-[#27265B]">
                              {m.id}
                            </span>
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {m.title}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {m.displayDate} • {m.location} ({m.province})
                          </p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                              m.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {m.status === 'completed' ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
