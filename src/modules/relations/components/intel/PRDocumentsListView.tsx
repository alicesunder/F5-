import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Eye,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import { GovDocument, DocType, DocStatus } from '../../types/bppTypes';

interface PRDocumentsListViewProps {
  statusFilterDefault?: DocStatus | 'all';
  title?: string;
  description?: string;
}

export const PRDocumentsListView: React.FC<PRDocumentsListViewProps> = ({
  statusFilterDefault = 'all',
  title = 'ทะเบียนเอกสารสารบรรณดิจิทัล (Document Registry)',
  description = 'คลังเอกสารราชการที่ผ่านการสแกน ตรวจสอบระเบียบ และวิเคราะห์ข้อมูลด้วย AI',
}) => {
  const { documents, setSelectedDocument, setActivePRView } = usePRIntel();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(statusFilterDefault);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);

  const docTypes: DocType[] = [
    'หนังสือภายนอก',
    'หนังสือภายใน',
    'คำสั่ง',
    'บันทึกข้อความ',
    'ประกาศ',
    'ข่าวแจกสื่อมวลชน',
    'แผนปฏิบัติการ',
  ];

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
      if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
      if (doc.aiScore < minScore) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          doc.docNumber.toLowerCase().includes(q) ||
          doc.title.toLowerCase().includes(q) ||
          doc.sender.toLowerCase().includes(q) ||
          doc.signatory.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [documents, statusFilter, typeFilter, minScore, searchQuery]);

  // Stats
  const totalCount = documents.length;
  const passedCount = documents.filter((d) => d.status === 'passed').length;
  const reviewCount = documents.filter((d) => d.status === 'review_required').length;
  const pendingCount = documents.filter((d) => d.status === 'pending').length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-50 text-pink-700 border border-pink-200">
                <FileText className="w-5 h-5 text-[#27265B]" />
              </span>
              <div>
                <h1 className="text-xl font-black text-[#1E1B4B] tracking-tight">{title}</h1>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePRView('scanner')}
              className="px-3.5 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>สแกนเอกสารใหม่</span>
            </button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">เอกสารทั้งหมด</span>
            <div className="text-xl font-black text-[#1E1B4B]">{totalCount} ฉบับ</div>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] text-emerald-700 font-medium">ผ่านเกณฑ์สมบูรณ์</span>
            <div className="text-xl font-black text-emerald-700">{passedCount} ฉบับ</div>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
            <span className="text-[11px] text-amber-700 font-medium">ต้องตรวจทาน (Warning)</span>
            <div className="text-xl font-black text-amber-800">{reviewCount} ฉบับ</div>
          </div>
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] text-blue-700 font-medium">รอการตรวจสอบ</span>
            <div className="text-xl font-black text-blue-800">{pendingCount} ฉบับ</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเลขที่หนังสือ, ชื่อเรื่อง, หน่วยงานเจ้าของเรื่อง, หรือผู้ลงนาม..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2"
          >
            <option value="all">ทุกสถานะ ({documents.length})</option>
            <option value="passed">ผ่านเกณฑ์ ({passedCount})</option>
            <option value="review_required">ต้องตรวจทาน ({reviewCount})</option>
            <option value="pending">รอการตรวจ ({pendingCount})</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2"
          >
            <option value="all">ทุกประเภทเอกสาร</option>
            {docTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2"
          >
            <option value={0}>ทุกระดับคะแนน AI</option>
            <option value={90}>คะแนน 90+ ขึ้นไป</option>
            <option value={80}>คะแนน 80+ ขึ้นไป</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-semibold">
            <tr>
              <th className="p-3.5">เลขที่หนังสือ</th>
              <th className="p-3.5">ประเภท</th>
              <th className="p-3.5">เรื่อง</th>
              <th className="p-3.5">ส่วนราชการเจ้าของเรื่อง</th>
              <th className="p-3.5">ผู้ลงนาม</th>
              <th className="p-3.5">วันที่</th>
              <th className="p-3.5 text-center">คะแนน AI</th>
              <th className="p-3.5 text-right">สถานะ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => {
              const isPassed = doc.status === 'passed';
              const isReview = doc.status === 'review_required';
              const scoreColor =
                doc.aiScore >= 90
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : doc.aiScore >= 80
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-rose-100 text-rose-800 border-rose-200';

              return (
                <tr
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className="hover:bg-slate-50/80 cursor-pointer transition group"
                >
                  <td className="p-3.5 font-mono font-bold text-[#27265B] whitespace-nowrap">
                    {doc.docNumber}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {doc.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 max-w-sm truncate group-hover:text-pink-700 transition">
                    {doc.title}
                  </td>
                  <td className="p-3.5 text-slate-600 truncate max-w-[160px]">
                    {doc.sender}
                  </td>
                  <td className="p-3.5 text-slate-600 truncate max-w-[130px]">
                    {doc.signatory}
                  </td>
                  <td className="p-3.5 text-slate-500 font-mono whitespace-nowrap">
                    {doc.displayDate}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded-full border ${scoreColor}`}
                    >
                      {doc.aiScore}/100
                    </span>
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isReview
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {isPassed ? 'ผ่านเกณฑ์' : isReview ? 'ต้องตรวจทาน' : 'รอตรวจสอบ'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
