import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { ArchivalDocument, ArchivalCategory, SecurityLevel } from '../types';
import { formatThaiDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  FolderArchive,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  FileText,
  Lock,
  Calendar,
  FileSpreadsheet,
  File,
  ShieldAlert,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';

const DEFAULT_CATEGORIES: ArchivalCategory[] = [
  'ระเบียบและคำสั่ง',
  'คำสั่ง',
  'ประกาศ',
  'แผนงานและโครงการ',
  'โครงการ',
  'งบประมาณ',
  'รายงาน',
  'คู่มือการปฏิบัติงาน',
  'หนังสือรับ',
  'หนังสือส่ง',
  'บันทึกข้อความ',
  'เอกสารสำคัญทางประวัติศาสตร์',
];

const SECURITY_LEVELS: SecurityLevel[] = ['เปิดเผยทั่วไป', 'ปกปิด', 'ลับ', 'ลับมาก'];

export const ArchivalDocsPage: React.FC = () => {
  const {
    archivalDocs = [],
    personnel = [],
    addArchivalDoc,
    updateArchivalDoc,
    deleteArchivalDoc,
    currentRole,
    showToast,
  } = useAdmin();

  // Safe array guards to completely prevent 'length' of undefined
  const docsList = useMemo(() => (Array.isArray(archivalDocs) ? archivalDocs : []), [archivalDocs]);
  const safePersonnel = useMemo(() => (Array.isArray(personnel) ? personnel : []), [personnel]);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSecurity, setSelectedSecurity] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchivalDocument | null>(null);
  const [viewingItem, setViewingItem] = useState<ArchivalDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formDocNumber, setFormDocNumber] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ArchivalCategory>('ระเบียบและคำสั่ง');
  const [formYear, setFormYear] = useState(2569);
  const [formArchivedDate, setFormArchivedDate] = useState(new Date().toISOString().slice(0, 10));
  const [formSecurityLevel, setFormSecurityLevel] = useState<SecurityLevel>('เปิดเผยทั่วไป');
  const [formFileType, setFormFileType] = useState('PDF');
  const [formTags, setFormTags] = useState('ระเบียบ, ฝ่ายอำนวยการ');
  const [formStorageLocation, setFormStorageLocation] = useState('ตู้เอกสาร A-01 / เซิร์ฟเวอร์จัดเก็บถาวร');
  const [formArchivedBy, setFormArchivedBy] = useState(safePersonnel[0]?.name || 'เจ้าหน้าที่สารบรรณ');

  // Dynamic categories collected from all stored documents
  const dynamicCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    docsList.forEach(d => {
      if (d?.category) set.add(d.category);
    });
    return Array.from(set);
  }, [docsList]);

  // Available Years
  const availableYears = useMemo(() => {
    const set = new Set<number>([2569, 2568, 2567]);
    docsList.forEach(d => {
      if (d?.year) set.add(d.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [docsList]);

  // Filtered Docs with defensive checks
  const filteredDocs = useMemo(() => {
    return docsList.filter(d => {
      if (!d) return false;
      const docTitle = d.title || d.document_name || '';
      const docNum = d.document_number || '';
      const docTags = Array.isArray(d.tags) ? d.tags : [];
      const docSec = d.security_level || 'เปิดเผยทั่วไป';
      const docYear = (d.year || 2569).toString();

      const searchLower = searchQuery.toLowerCase().trim();
      const matchSearch =
        !searchLower ||
        docTitle.toLowerCase().includes(searchLower) ||
        docNum.toLowerCase().includes(searchLower) ||
        docTags.some(tag => typeof tag === 'string' && tag.toLowerCase().includes(searchLower));

      const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
      const matchSec = selectedSecurity === 'all' || docSec === selectedSecurity;
      const matchYr = selectedYear === 'all' || docYear === selectedYear;

      return matchSearch && matchCat && matchSec && matchYr;
    });
  }, [docsList, searchQuery, selectedCategory, selectedSecurity, selectedYear]);

  // Paginated
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocs.slice(start, start + pageSize);
  }, [filteredDocs, currentPage, pageSize]);

  // Open Edit
  const handleOpenEdit = (item: ArchivalDocument) => {
    setEditingItem(item);
    setFormDocNumber(item.document_number || '');
    setFormTitle(item.title || item.document_name || '');
    setFormCategory(item.category || 'ระเบียบและคำสั่ง');
    setFormYear(item.year || 2569);
    setFormArchivedDate(item.archived_date || item.upload_date || item.document_date || new Date().toISOString().slice(0, 10));
    setFormSecurityLevel(item.security_level || 'เปิดเผยทั่วไป');
    setFormFileType(item.file_type || 'PDF');
    setFormTags(Array.isArray(item.tags) ? item.tags.join(', ') : '');
    setFormStorageLocation(item.storage_location || 'ตู้เอกสาร A-01 / เซิร์ฟเวอร์จัดเก็บถาวร');
    setFormArchivedBy(item.archived_by || item.owner || safePersonnel[0]?.name || 'เจ้าหน้าที่ฝ่ายอำนวยการ');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormDocNumber(`ศอ.ระเบียบ 0${String((docsList.length || 0) + 1)}/2569`);
    setFormTitle('');
    setFormCategory('ระเบียบและคำสั่ง');
    setFormYear(2569);
    setFormArchivedDate(new Date().toISOString().slice(0, 10));
    setFormSecurityLevel('เปิดเผยทั่วไป');
    setFormFileType('PDF');
    setFormTags('ระเบียบ, ฝ่ายอำนวยการ');
    setFormStorageLocation('ตู้เอกสารคลัง A-02 / SAN Storage');
    setFormArchivedBy(safePersonnel[0]?.name || 'เจ้าหน้าที่สารบรรณ');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDocNumber.trim() || !formTitle.trim()) {
      showToast('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'error');
      return;
    }

    const tagArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingItem) {
      updateArchivalDoc({
        ...editingItem,
        document_number: formDocNumber.trim(),
        title: formTitle.trim(),
        document_name: formTitle.trim(),
        category: formCategory,
        year: Number(formYear),
        archived_date: formArchivedDate,
        security_level: formSecurityLevel,
        file_type: formFileType,
        tags: tagArray,
        storage_location: formStorageLocation.trim(),
        archived_by: formArchivedBy,
      });
      setEditingItem(null);
    } else {
      addArchivalDoc({
        document_number: formDocNumber.trim(),
        title: formTitle.trim(),
        document_name: formTitle.trim(),
        category: formCategory,
        year: Number(formYear),
        archived_date: formArchivedDate,
        security_level: formSecurityLevel,
        file_type: formFileType,
        file_size: '3.5 MB',
        tags: tagArray,
        storage_location: formStorageLocation.trim(),
        archived_by: formArchivedBy,
      });
      setIsAddModalOpen(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    const exportData = filteredDocs.map(d => ({
      รหัสเอกสาร: d.document_number,
      ชื่อเรื่อง: d.title || d.document_name || '-',
      หมวดหมู่: d.category,
      ปีพศ: d.year,
      วันที่จัดเก็บ: d.archived_date || d.upload_date || d.document_date || '-',
      ชั้นความลับ: d.security_level || 'เปิดเผยทั่วไป',
      ประเภทไฟล์: d.file_type || 'PDF',
      ขนาดไฟล์: d.file_size || '1.5 MB',
      สถานที่จัดเก็บ: d.storage_location || '-',
      ผู้จัดเก็บ: d.archived_by || d.owner || '-',
      คำค้นหา: Array.isArray(d.tags) ? d.tags.join('; ') : '',
    }));
    exportToCSV(exportData, `ทะเบียนคลังเอกสารฝ่ายอำนวยการ_${new Date().toISOString().slice(0, 10)}`);
  };

  const renderFileIcon = (type: string = '') => {
    const upper = type.toUpperCase();
    if (upper.includes('PDF')) {
      return <FileText className="w-4 h-4 text-[#A84E4E] shrink-0 stroke-[1.5]" />;
    }
    if (upper.includes('XLS') || upper.includes('SHEET')) {
      return <FileSpreadsheet className="w-4 h-4 text-[#42695B] shrink-0 stroke-[1.5]" />;
    }
    return <File className="w-4 h-4 text-[#234A78] shrink-0 stroke-[1.5]" />;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">DOCS / 03</span>
              <span>—</span>
              <span>ARCHIVAL REPOSITORY & SOP</span>
              <span>—</span>
              <span>SECURITY CLASSIFICATION</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              สารบบคลังจัดเก็บเอกสารสำคัญฝ่ายอำนวยการ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              คลังเอกสารระเบียบปฏิบัติ คำสั่ง นโยบาย ยุทธศาสตร์ คู่มือการปฏิบัติงาน (SOP) และเอกสารสำคัญทางราชการ จัดการชั้นความลับและการเข้าถึงตามพระราชบัญญัติข้อมูลข่าวสาร
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>ส่งออกทะเบียน CSV</span>
            </button>
            {currentRole !== 'viewer' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[1.5]" />
                <span>นำเข้าเอกสารสู่คลัง</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 02 — ASYMMETRIC METRICS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              TOTAL ARCHIVED
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">เอกสารในคลังทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{docsList.length}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">จัดเก็บถาวรและสืบค้นได้</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              REGULATIONS & ORDERS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ระเบียบและคำสั่ง</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">
              {docsList.filter(d => d.category === 'ระเบียบและคำสั่ง' || d.category === 'คำสั่ง' || d.category === 'ประกาศ').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">มีผลบังคับใช้ในปัจจุบัน</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              STANDARD MANUALS (SOP)
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">คู่มือ / รายงานผล</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">
              {docsList.filter(d => d.category === 'คู่มือการปฏิบัติงาน' || d.category === 'รายงาน' || d.category === 'โครงการ').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">มาตรฐานขั้นตอนการทำงาน</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              SECURITY CLASSIFIED
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">เอกสารชั้นความลับ (ลับ/ปกปิด)</div>
            <div className="text-3xl font-light font-mono text-[#A84E4E] mt-1">
              {docsList.filter(d => d.security_level === 'ลับ' || d.security_level === 'ลับมาก' || d.security_level === 'ปกปิด').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">จำกัดสิทธิ์การเข้าถึง</div>
        </div>
      </section>

      {/* 03 — SEARCH & FILTERS */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="สืบค้นชื่อเอกสารสำคัญ, เลขที่เอกสาร, หรือคำค้นหา (Tags)..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 border border-[rgba(17,19,21,0.08)] text-xs text-[#111315] placeholder:text-[rgba(17,19,21,0.4)] focus:outline-hidden focus:border-[#234A78]/50 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={e => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกหมวดหมู่เอกสาร</option>
            {dynamicCategories.map((c, i) => (
              <option key={`filter-cat-${i}-${c}`} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSecurity}
            onChange={e => {
              setSelectedSecurity(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกชั้นความลับ</option>
            {SECURITY_LEVELS.map(sec => (
              <option key={`filter-sec-${sec}`} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกปี พ.ศ.</option>
            {availableYears.map(yr => (
              <option key={`filter-yr-${yr}`} value={yr.toString()}>
                พ.ศ. {yr}
              </option>
            ))}
          </select>

          {(selectedCategory !== 'all' || selectedSecurity !== 'all' || selectedYear !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedSecurity('all');
                setSelectedYear('all');
                setCurrentPage(1);
              }}
              className="text-xs text-[#A84E4E] hover:underline px-2 py-1 flex items-center gap-1 font-mono cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> ล้างตัวกรอง
            </button>
          )}
        </div>
      </section>

      {/* 04 — EDITORIAL DATA TABLE */}
      <section className="glass rounded-[24px] overflow-hidden border border-[rgba(17,19,21,0.08)] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[rgba(17,19,21,0.03)] border-b border-[rgba(17,19,21,0.08)] text-[rgba(17,19,21,0.5)] font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">รหัส / รูปแบบไฟล์</th>
                <th className="py-3.5 px-3">ชื่อเอกสารสำคัญ</th>
                <th className="py-3.5 px-3">หมวดหมู่</th>
                <th className="py-3.5 px-3 text-center">ปี พ.ศ.</th>
                <th className="py-3.5 px-3 text-center">ชั้นความลับ</th>
                <th className="py-3.5 px-3">สถานที่จัดเก็บ / ผู้จัดเก็บ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[rgba(17,19,21,0.4)]">
                    <FolderArchive className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.3)] mb-2 stroke-[1.5]" />
                    ไม่พบเอกสารในคลังตามเงื่อนไขที่ระบุ
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => {
                  const uniqueRowKey = item.document_id
                    ? `${item.document_id}-${index}`
                    : `archival-row-${item.document_number || 'doc'}-${index}`;
                  const docTitle = item.title || item.document_name || 'เอกสารราชการสำคัญ';
                  const docSecurity = item.security_level || 'เปิดเผยทั่วไป';
                  const docTags = Array.isArray(item.tags) ? item.tags : [];
                  const docDate = item.archived_date || item.upload_date || item.document_date || '';
                  const docArchivedBy = item.archived_by || item.owner || 'เจ้าหน้าที่สารบรรณ';
                  const docLocation = item.storage_location || 'ศูนย์จัดเก็บเอกสารกลาง / Cloud Storage';

                  return (
                    <tr key={uniqueRowKey} className="hover:bg-white/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-white border border-[rgba(17,19,21,0.08)] shadow-2xs">
                            {renderFileIcon(item.file_type || 'PDF')}
                          </div>
                          <div>
                            <div className="font-semibold text-[#111315] font-mono text-[11px]">
                              {item.document_number}
                            </div>
                            <div className="text-[10px] text-[rgba(17,19,21,0.4)] font-mono uppercase mt-0.5">
                              {item.file_type || 'PDF'} • {item.file_size || '1.5 MB'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#111315] text-xs max-w-md line-clamp-1">
                          {docTitle}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {docTags.map((tag, tagIndex) => (
                            <span
                              key={`tag-${uniqueRowKey}-${tagIndex}-${tag}`}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[rgba(17,19,21,0.05)] text-[rgba(17,19,21,0.65)]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#234A78]/10 text-[#234A78]">
                          {item.category || 'ระเบียบและคำสั่ง'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium text-[#111315]">
                        {item.year || 2569}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap ${
                            docSecurity === 'ลับมาก'
                              ? 'bg-[#A84E4E]/10 text-[#A84E4E]'
                              : docSecurity === 'ลับ'
                              ? 'bg-[#A77A35]/15 text-[#A77A35]'
                              : docSecurity === 'ปกปิด'
                              ? 'bg-[#234A78]/10 text-[#234A78]'
                              : 'bg-[#42695B]/10 text-[#42695B]'
                          }`}
                        >
                          {docSecurity !== 'เปิดเผยทั่วไป' && <Lock className="w-2.5 h-2.5 stroke-[1.5]" />}
                          {docSecurity}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-[#111315] text-[11px] truncate max-w-[170px]">
                          {docLocation}
                        </div>
                        <div className="text-[10px] text-[rgba(17,19,21,0.45)] mt-0.5 font-mono">
                          โดย {docArchivedBy} {docDate ? `(${formatThaiDate(docDate, true)})` : ''}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingItem(item)}
                            className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast(`ดาวน์โหลด ${docTitle} จำลองสำเร็จ`, 'success')}
                            className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#42695B] transition"
                            title="ดาวน์โหลดไฟล์"
                          >
                            <Download className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>

                          {currentRole !== 'viewer' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#234A78] transition"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(item.document_id || item.doc_id || item.document_number)}
                                className="p-1.5 rounded-lg hover:bg-white text-[rgba(17,19,21,0.4)] hover:text-[#A84E4E] transition"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredDocs.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* 05 — ADD / EDIT MODAL */}
      {(isAddModalOpen || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-2xl w-full p-6 border border-[rgba(17,19,21,0.1)] max-h-[90vh] overflow-y-auto text-[#111315]">
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(17,19,21,0.08)]">
              <div className="flex items-center gap-2">
                <FolderArchive className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-base font-medium text-[#111315]">
                  {editingItem ? `แก้ไขข้อมูลเอกสารในคลัง (${editingItem.document_number})` : 'นำเข้าเอกสารสำคัญสู่คลัง'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingItem(null);
                }}
                className="p-1.5 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">
                    รหัส / เลขที่เอกสาร <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ศอ.ระเบียบ 01/2569"
                    value={formDocNumber}
                    onChange={e => setFormDocNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ปีที่จัดทำ (พ.ศ.)</label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={e => setFormYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  ชื่อเรื่อง / ชื่อเอกสารสำคัญ <span className="text-[#A84E4E]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="เช่น ระเบียบฝ่ายอำนวยการว่าด้วยการรักษาความปลอดภัยข้อมูลสารสนเทศ..."
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">หมวดหมู่เอกสาร</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as ArchivalCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {dynamicCategories.map((c, i) => (
                      <option key={`modal-cat-${i}-${c}`} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ชั้นความลับ</label>
                  <select
                    value={formSecurityLevel}
                    onChange={e => setFormSecurityLevel(e.target.value as SecurityLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {SECURITY_LEVELS.map(sec => (
                      <option key={`modal-sec-${sec}`} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ประเภทไฟล์</label>
                  <select
                    value={formFileType}
                    onChange={e => setFormFileType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    <option value="PDF">PDF (Portable Document Format)</option>
                    <option value="DOCX">DOCX (Microsoft Word)</option>
                    <option value="XLSX">XLSX (Microsoft Excel)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">วันที่นำเข้าคลัง</label>
                  <input
                    type="date"
                    value={formArchivedDate}
                    onChange={e => setFormArchivedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  คำค้นหา / แท็ก (คั่นด้วยจุลภาค ,)
                </label>
                <input
                  type="text"
                  placeholder="เช่น ระเบียบ, จัดซื้อ, นโยบายความมั่นคง"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">สถานที่จัดเก็บทางกายภาพ / ระบบ</label>
                  <input
                    type="text"
                    placeholder="เช่น ตู้ A-01 / Cloud Storage"
                    value={formStorageLocation}
                    onChange={e => setFormStorageLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">เจ้าหน้าที่ผู้จัดเก็บ</label>
                  <select
                    value={formArchivedBy}
                    onChange={e => setFormArchivedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {safePersonnel.map((p, i) => (
                      <option key={`pers-arch-${p.person_id || i}`} value={p.name}>
                        {p.rank} {p.name} ({p.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[rgba(17,19,21,0.08)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-[rgba(17,19,21,0.6)] hover:bg-[rgba(17,19,21,0.04)] transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white font-medium shadow-2xs transition cursor-pointer"
                >
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกเอกสาร'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 06 — VIEW MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111315]/40 backdrop-blur-[12px]">
          <div className="bg-white/95 backdrop-blur-[24px] rounded-[28px] shadow-[0_30px_80px_rgba(18,23,27,0.15)] max-w-xl w-full p-6 border border-[rgba(17,19,21,0.1)] text-[#111315]">
            <div className="flex items-start justify-between pb-3 border-b border-[rgba(17,19,21,0.08)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#234A78]">{viewingItem.document_number}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#234A78]/10 text-[#234A78]">
                    พ.ศ. {viewingItem.year || 2569}
                  </span>
                </div>
                <h3 className="text-base font-medium text-[#111315] mt-1">
                  {viewingItem.title || viewingItem.document_name || 'เอกสารราชการสำคัญ'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="p-1.5 rounded-lg text-[rgba(17,19,21,0.4)] hover:text-[#111315]"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 bg-[rgba(17,19,21,0.03)] rounded-2xl grid grid-cols-2 gap-2 border border-[rgba(17,19,21,0.06)]">
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">หมวดหมู่:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.category || 'ระเบียบและคำสั่ง'}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">ชั้นความลับ:</span>
                  <span className="font-mono text-[#A84E4E] font-medium">{viewingItem.security_level || 'เปิดเผยทั่วไป'}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">ประเภทและขนาด:</span>
                  <span className="font-mono text-[#111315]">
                    {viewingItem.file_type || 'PDF'} ({viewingItem.file_size || '1.5 MB'})
                  </span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">วันที่นำเข้า:</span>
                  <span className="font-mono text-[#111315]">
                    {formatThaiDate(viewingItem.archived_date || viewingItem.upload_date || viewingItem.document_date || '')}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)]">
                <span className="text-[#111315] font-semibold block mb-1">สถานที่จัดเก็บทางกายภาพ:</span>
                <p className="text-[rgba(17,19,21,0.8)] font-medium">
                  {viewingItem.storage_location || 'ศูนย์จัดเก็บเอกสารกลาง / Cloud Storage'}
                </p>
                <p className="text-[rgba(17,19,21,0.5)] text-[11px] mt-1 font-mono">
                  เจ้าหน้าที่ผู้จัดเก็บ: {viewingItem.archived_by || viewingItem.owner || 'เจ้าหน้าที่ฝ่ายอำนวยการ'}
                </p>
              </div>

              <div>
                <span className="text-[rgba(17,19,21,0.5)] block mb-1 font-mono text-[11px]">คำสำคัญสำหรับสืบค้น (Tags):</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(viewingItem.tags) ? viewingItem.tags : []).map((t, i) => (
                    <span key={`view-tag-${i}-${t}`} className="px-2.5 py-0.5 rounded-md bg-[rgba(17,19,21,0.05)] text-[#111315] font-mono text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  showToast(`กำลังดาวน์โหลดเอกสาร ${viewingItem.title || viewingItem.document_name || ''}`, 'success');
                }}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#17324F] text-white hover:bg-[#234A78] transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>ดาวน์โหลดเอกสาร</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[rgba(17,19,21,0.05)] text-[#111315] hover:bg-[rgba(17,19,21,0.1)] transition cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 07 — DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบเอกสารจากคลัง"
        message="คุณต้องการลบเอกสารนี้ออกจากสารบบคลังจัดเก็บหรือไม่?"
        onConfirm={() => {
          if (deletingId) deleteArchivalDoc(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
