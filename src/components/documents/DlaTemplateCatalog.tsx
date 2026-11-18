import React, { useState, useMemo } from 'react';
import { DlaTemplate, DLA_TEMPLATES, DLA_OFFICIAL_URL } from '../../data/dlaTemplatesData';
import {
  Search,
  ExternalLink,
  Sparkles,
  FileText,
  Filter,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Download,
} from 'lucide-react';

interface DlaTemplateCatalogProps {
  onSelectTemplateForDraft: (template: DlaTemplate) => void;
}

export const DlaTemplateCatalog: React.FC<DlaTemplateCatalogProps> = ({
  onSelectTemplateForDraft,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplateDetail, setSelectedTemplateDetail] = useState<DlaTemplate | null>(null);

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'งานสารบรรณ', label: 'งานสารบรรณ (แบบที่ ๑-๑๑)' },
    { id: 'จัดซื้อจัดจ้างและพัสดุ', label: 'จัดซื้อจัดจ้างและพัสดุ' },
    { id: 'การเงินและงบประมาณ', label: 'การเงินและงบประมาณ' },
    { id: 'บริหารงานบุคคล', label: 'บริหารงานบุคคลและเวรยาม' },
    { id: 'ขอความอนุเคราะห์และประสานงาน', label: 'ขอความอนุเคราะห์และประสานงาน' },
  ];

  const filteredTemplates = useMemo(() => {
    return DLA_TEMPLATES.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Official Source Banner */}
      <div className="bg-gradient-to-r from-[#27265B]/10 via-[#51439A]/10 to-indigo-50/50 border border-[#51439A]/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#51439A] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                คลังแบบฟอร์มเอกสารราชการ กรมส่งเสริมการปกครองท้องถิ่น (สถ.)
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#51439A]/15 text-[#51439A] font-semibold">
                DLA Official Forms
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              รวบรวมแบบฟอร์มมาตรฐานตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ และแบบฟอร์มงานบริหารทั่วไป งานพัสดุ และการเงิน จากระบบบริการข้อมูล กรมส่งเสริมการปกครองท้องถิ่น กระทรวงมหาดไทย พร้อมระบบ AI ช่วยนำแบบฟอร์มไปร่างข้อความได้ทันที
            </p>
          </div>
        </div>

        <a
          href={DLA_OFFICIAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-[#51439A] hover:bg-[#51439A]/5 border border-[#51439A]/30 transition shadow-2xs shrink-0 self-start md:self-auto cursor-pointer"
        >
          <span>เปิดเว็บไซต์ สถ. (dla.go.th)</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาแบบฟอร์ม เช่น บันทึกข้อความ, ขอความอนุเคราะห์, ซื้อจ้าง, สิบเวร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#51439A]/30 focus:border-[#51439A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#51439A] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-[#51439A]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {template.code}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                  {template.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#51439A] transition-colors line-clamp-2 leading-snug">
                {template.name}
              </h3>

              <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {template.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedTemplateDetail(template)}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer transition"
              >
                <span>ดูโครงสร้าง</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTemplateForDraft(template)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#51439A] hover:bg-[#433580] text-white flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>ร่างด้วย AI ทันที</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">ไม่พบแบบฟอร์มที่ตรงกับคำค้นหา</p>
          <p className="text-xs text-slate-400 mt-1">ลองพิมพ์คำค้นหาใหม่ หรือเลือกหมวดหมู่ "ทั้งหมด"</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedTemplateDetail && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTemplateDetail(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-semibold text-[#51439A]">
                  {selectedTemplateDetail.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedTemplateDetail.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  อ้างอิง: {selectedTemplateDetail.officialRef}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTemplateDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">คำอธิบายการใช้งาน:</span>
                <p className="mt-1 leading-relaxed">{selectedTemplateDetail.description}</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800">ตัวอย่างหัวเรื่องและผู้รับ:</span>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                  เรื่อง: {selectedTemplateDetail.sampleSubject}
                </p>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  เรียน: {selectedTemplateDetail.sampleRecipient}
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-800">ตัวอย่างเนื้อหา ๓ ภาค:</span>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <p className="leading-relaxed">
                    <span className="font-semibold text-slate-900">[ภาคเหตุ]</span> {selectedTemplateDetail.sampleBody.intro}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-slate-900">[ภาคความประสงค์]</span> {selectedTemplateDetail.sampleBody.detail}
                  </p>
                  <p className="leading-relaxed">
                    <span className="font-semibold text-slate-900">[ภาคสรุป]</span> {selectedTemplateDetail.sampleBody.conclusion}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <a
                href={selectedTemplateDetail.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-[#51439A] flex items-center gap-1"
              >
                <span>ดาวน์โหลดต้นฉบับ DLA</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTemplateDetail(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const t = selectedTemplateDetail;
                    setSelectedTemplateDetail(null);
                    onSelectTemplateForDraft(t);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#51439A] hover:bg-[#433580] text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>นำไปร่างด้วย AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
