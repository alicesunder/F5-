import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Shield,
  Phone,
  Search,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  Filter,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { VolunteerPersonnelItem } from '../../types/volunteerTypes';

export const VolunteerPersonnelSection: React.FC = () => {
  const { personnel, units } = useVolunteer();
  const [selectedUnitFilter, setSelectedUnitFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPersonnel = personnel.filter(p => {
    const matchUnit = selectedUnitFilter === 'ALL' || p.unitId === selectedUnitFilter;
    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.unitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.volunteerId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchUnit && matchSearch;
  });

  const bppRegions = [
    {
      id: 'unit-bok-ok',
      code: 'บก.อก.บช.ตชด.',
      name: 'กองบังคับการอำนวยการ กองบัญชาการตำรวจตระเวนชายแดน',
      personnelTotal: 120,
      activeMissionCount: 3,
      commander: 'พ.ต.อ. ธนกฤต ชัยศิริ',
      phone: '02-279-9111 ต่อ 5104',
      badge: 'ส่วนกลาง',
    },
    {
      id: 'unit-bok-1',
      code: 'บก.ตชด.ภาค 1',
      name: 'กองบังคับการตำรวจตระเวนชายแดนภาค 1 (ภาคกลาง/ตะวันตก)',
      personnelTotal: 340,
      activeMissionCount: 2,
      commander: 'พล.ต.ต. ณรงค์ฤทธิ์ สุริยะ',
      phone: '035-241-555',
      badge: 'ภาคกลาง',
    },
    {
      id: 'unit-bok-2',
      code: 'บก.ตชด.ภาค 2',
      name: 'กองบังคับการตำรวจตระเวนชายแดนภาค 2 (ภาคตะวันออกเฉียงเหนือ)',
      personnelTotal: 420,
      activeMissionCount: 2,
      commander: 'พล.ต.ต. กิตติศักดิ์ ศรีประเสริฐ',
      phone: '043-241-112',
      badge: 'ภาคอีสาน',
    },
    {
      id: 'unit-bok-3',
      code: 'บก.ตชด.ภาค 3',
      name: 'กองบังคับการตำรวจตระเวนชายแดนภาค 3 (ภาคเหนือ)',
      personnelTotal: 380,
      activeMissionCount: 3,
      commander: 'พล.ต.ต. วรพงษ์ ทองไพศาล',
      phone: '053-211-445',
      badge: 'ภาคเหนือ',
    },
    {
      id: 'unit-bok-4',
      code: 'บก.ตชด.ภาค 4',
      name: 'กองบังคับการตำรวจตระเวนชายแดนภาค 4 (ภาคใต้)',
      personnelTotal: 460,
      activeMissionCount: 4,
      commander: 'พล.ต.ต. สุรเชษฐ์ สุวรรณนพคุณ',
      phone: '074-311-201',
      badge: 'ภาคใต้',
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[rgba(66,167,122,0.25)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#25202B]">
              ระบบบริหารกำลังพลและหน่วยปฏิบัติการจิตอาสา (Personnel & Unit Readiness)
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7F0] text-[#2F8A63] text-xs font-bold font-mono">
              ตชด. ๔ ภาค + บก.อก.
            </span>
          </div>
          <p className="text-xs text-[#6B6973] mt-0.5">
            ทะเบียนกำลังพลจิตอาสาพระราชทาน ชั่วโมงสะสม และการจัดสรรกำลังพลสนับสนุนภารกิจ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#6B6973]">กำลังพลขึ้นทะเบียนรวม:</span>
          <span className="font-mono font-bold text-lg text-[#2F8A63]">1,720 นาย</span>
        </div>
      </div>

      {/* 5 Key Unit Commands Cards */}
      <div>
        <h3 className="text-xs font-bold text-[#25202B] uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#42A77A]" />
          หน่วยบัญชาการและกองบังคับการ ตชด. ที่รับผิดชอบ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {bppRegions.map(region => (
            <div
              key={region.id}
              onClick={() => setSelectedUnitFilter(region.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
                selectedUnitFilter === region.id
                  ? 'bg-[#EAF7F0]/80 border-[#42A77A] ring-1 ring-[#42A77A]'
                  : 'bg-white/90 border-[rgba(66,167,122,0.2)] hover:border-[#42A77A]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-white border border-[rgba(66,167,122,0.3)] text-[#2F8A63] text-xs font-bold font-mono">
                  {region.code}
                </span>
                <span className="text-[11px] font-semibold text-[#6B6973] bg-gray-100 px-2 py-0.5 rounded-full">
                  {region.badge}
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#25202B] line-clamp-1">{region.name}</h4>

              <div className="mt-3 pt-2.5 border-t border-[rgba(66,167,122,0.15)] grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#6B6973]">กำลังพลจิตอาสา</span>
                  <p className="font-bold font-mono text-[#25202B]">{region.personnelTotal} นาย</p>
                </div>
                <div>
                  <span className="text-[10px] text-[#6B6973]">ภารกิจที่กำลังทำ</span>
                  <p className="font-bold font-mono text-[#2F8A63]">{region.activeMissionCount} แผนงาน</p>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#6B6973] pt-2 border-t border-gray-100">
                <span className="truncate">{region.commander}</span>
                <a
                  href={`tel:${region.phone}`}
                  onClick={e => e.stopPropagation()}
                  className="text-[#42A77A] hover:underline flex items-center gap-1 font-mono font-medium flex-shrink-0"
                >
                  <Phone className="w-3 h-3" />
                  <span>{region.phone.split(' ต่อ')[0]}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personnel Roster */}
      <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[rgba(66,167,122,0.25)] shadow-xs space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#42A77A]" />
            <h3 className="font-bold text-[#25202B]">ทำเนียบกำลังพลจิตอาสาและผู้ประสานงานหลัก</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="ค้นหารายชื่อ, ยศ, รหัสจิตอาสา..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
              />
            </div>

            <select
              value={selectedUnitFilter}
              onChange={e => setSelectedUnitFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-[#25202B] text-xs focus:outline-none focus:ring-2 focus:ring-[#42A77A]/30"
            >
              <option value="ALL">ทุกหน่วยสังกัด</option>
              <option value="unit-bok-ok">บก.อก.บช.ตชด.</option>
              <option value="unit-bok-1">บก.ตชด.ภาค 1</option>
              <option value="unit-bok-2">บก.ตชด.ภาค 2</option>
              <option value="unit-bok-3">บก.ตชด.ภาค 3</option>
              <option value="unit-bok-4">บก.ตชด.ภาค 4</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[#25202B]">
                <th className="py-2.5 px-3 font-bold">รหัสจิตอาสา</th>
                <th className="py-2.5 px-3 font-bold">ยศ - ชื่อ - สกุล</th>
                <th className="py-2.5 px-3 font-bold">ตำแหน่ง & หน่วยสังกัด</th>
                <th className="py-2.5 px-3 font-bold text-center">ชั่วโมงสะสม</th>
                <th className="py-2.5 px-3 font-bold text-center">ภารกิจร่วม</th>
                <th className="py-2.5 px-3 font-bold text-center">ระดับเข็มพระราชทาน</th>
                <th className="py-2.5 px-3 font-bold text-right">เบอร์ติดต่อ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPersonnel.map(p => (
                <tr key={p.id} className="hover:bg-[#F5FBF7] transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#2F8A63] whitespace-nowrap">
                    {p.volunteerId}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-bold text-[#25202B]">{p.rank} {p.name}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="text-[#25202B]">{p.position}</p>
                    <p className="text-[11px] text-[#6B6973]">{p.unitName}</p>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-[#2F8A63] whitespace-nowrap">
                    {p.hoursAccumulated} ชม.
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#25202B] whitespace-nowrap">
                    {p.missionsParticipated} ภารกิจ
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-[11px]">
                      <Award className="w-3 h-3 text-amber-600" />
                      {p.badgeLevel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono text-[#6B6973]">
                    <a href={`tel:${p.phone}`} className="hover:text-[#42A77A] hover:underline">
                      {p.phone}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
