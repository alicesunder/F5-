import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { OutgoingDocument, DocumentUrgency, OutgoingStatus } from '../types';
import { formatThaiDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  Send,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  FileText,
  Paperclip,
  Calendar,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';

const URGENCIES: DocumentUrgency[] = ['ปกติ', 'ด่วน', 'ด่วนมาก', 'ด่วนที่สุด'];
const STATUSES: OutgoingStatus[] = ['ร่าง', 'รอตรวจ', 'รอลงนาม', 'ส่งแล้ว', 'จัดเก็บแล้ว'];
const DOC_TYPES = ['หนังสือภายนอก', 'หนังสือภายใน', 'คำสั่ง', 'ประกาศ', 'รายงาน'];

export const OutgoingDocsPage: React.FC = () => {
  const {
    outgoingDocs,
    personnel,
    units,
    addOutgoingDoc,
    updateOutgoingDoc,
    deleteOutgoingDoc,
    currentRole,
    showToast,
  } = useAdmin();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OutgoingDocument | null>(null);
  const [viewingItem, setViewingItem] = useState<OutgoingDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formBookNumber, setFormBookNumber] = useState('');
  const [formSendDate, setFormSendDate] = useState(new Date().toISOString().slice(0, 10));
  const [formRecipient, setFormRecipient] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formDocType, setFormDocType] = useState('หนังสือภายนอก');
  const [formResponsiblePerson, setFormResponsiblePerson] = useState(personnel[2]?.name || '');
  const [formResponsibleUnit, setFormResponsibleUnit] = useState(units[1]?.unit_name || '');
  const [formStatus, setFormStatus] = useState<OutgoingStatus>('ร่าง');
  const [formUrgency, setFormUrgency] = useState<DocumentUrgency>('ปกติ');
  const [formAttachment, setFormAttachment] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Handle personnel select to auto set unit
  const handlePersonSelect = (name: string) => {
    setFormResponsiblePerson(name);
    const matched = personnel.find(p => p.name === name);
    if (matched) {
      setFormResponsibleUnit(matched.department);
    }
  };

  // Filtered List
  const filteredDocs = useMemo(() => {
    return outgoingDocs.filter(d => {
      const matchSearch =
        !searchQuery ||
        d.book_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.responsible_person.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = selectedStatus === 'all' || d.status === selectedStatus;
      const matchType = selectedType === 'all' || d.document_type === selectedType;
      const matchUrgency = selectedUrgency === 'all' || d.urgency === selectedUrgency;

      return matchSearch && matchStatus && matchType && matchUrgency;
    });
  }, [outgoingDocs, searchQuery, selectedStatus, selectedType, selectedUrgency]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocs.slice(start, start + pageSize);
  }, [filteredDocs, currentPage, pageSize]);

  // Open Edit
  const handleOpenEdit = (item: OutgoingDocument) => {
    setEditingItem(item);
    setFormBookNumber(item.book_number);
    setFormSendDate(item.send_date);
    setFormRecipient(item.recipient);
    setFormSubject(item.subject);
    setFormDocType(item.document_type);
    setFormResponsiblePerson(item.responsible_person);
    setFormResponsibleUnit(item.responsible_unit);
    setFormStatus(item.status);
    setFormUrgency(item.urgency);
    setFormAttachment(item.attachment || '');
    setFormNotes(item.notes || '');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormBookNumber(`ศอ 0101/${String(Math.floor(Math.random() * 50) + 1851)}`);
    setFormSendDate(new Date().toISOString().slice(0, 10));
    setFormRecipient('กระทรวงกลาโหม');
    setFormSubject('');
    setFormDocType('หนังสือภายนอก');
    setFormResponsiblePerson(personnel[2]?.name || '');
    setFormResponsibleUnit(personnel[2]?.department || units[1]?.unit_name || '');
    setFormStatus('ร่าง');
    setFormUrgency('ปกติ');
    setFormAttachment('หนังสือส่ง_ฉบับจริง.pdf');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBookNumber || !formSubject || !formRecipient) {
      showToast('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'error');
      return;
    }

    if (editingItem) {
      updateOutgoingDoc({
        ...editingItem,
        book_number: formBookNumber.trim(),
        send_date: formSendDate,
        recipient: formRecipient.trim(),
        subject: formSubject.trim(),
        document_type: formDocType,
        responsible_person: formResponsiblePerson,
        responsible_unit: formResponsibleUnit,
        status: formStatus,
        urgency: formUrgency,
        attachment: formAttachment.trim() || undefined,
        attachment_size: formAttachment ? '1.8 MB' : undefined,
        notes: formNotes.trim() || undefined,
      });
      setEditingItem(null);
    } else {
      addOutgoingDoc({
        book_number: formBookNumber.trim(),
        send_date: formSendDate,
        recipient: formRecipient.trim(),
        subject: formSubject.trim(),
        document_type: formDocType,
        responsible_person: formResponsiblePerson,
        responsible_unit: formResponsibleUnit,
        status: formStatus,
        urgency: formUrgency,
        attachment: formAttachment.trim() || undefined,
        attachment_size: formAttachment ? '1.8 MB' : undefined,
        notes: formNotes.trim() || undefined,
      });
      setIsAddModalOpen(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    const exportData = filteredDocs.map(d => ({
      รหัสหนังสือส่ง: d.outgoing_id,
      เลขที่หนังสือ: d.book_number,
      วันที่ส่ง: d.send_date,
      ถึง: d.recipient,
      เรื่อง: d.subject,
      ประเภท: d.document_type,
      ผู้ร่าง: d.responsible_person,
      กลุ่มงาน: d.responsible_unit,
      ความเร่งด่วน: d.urgency,
      สถานะ: d.status,
      ไฟล์แนบ: d.attachment || '-',
    }));
    exportToCSV(exportData, `ทะเบียนคุมหนังสือส่งฝ่ายอำนวยการ_${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">DOCS / 02</span>
              <span>—</span>
              <span>OUTGOING DISPATCH CONTROL</span>
              <span>—</span>
              <span>SIGNATURE ROUTING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ทะเบียนหนังสือส่งฝ่ายอำนวยการ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              ออกเลขหนังสือส่งภายนอกและภายใน เสนอตรวจร่างหนังสือ รอลงนาม และจัดเก็บหลักฐานการส่งมอบเอกสารราชการอย่างเป็นระบบ
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white border border-[rgba(17,19,21,0.12)] text-[#111315] text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#234A78] stroke-[1.5]" />
              <span>ส่งออก CSV</span>
            </button>
            {currentRole !== 'viewer' && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2.5 rounded-xl bg-[#17324F] hover:bg-[#234A78] text-white text-xs font-medium transition shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[1.5]" />
                <span>สร้างหนังสือส่ง</span>
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
              TOTAL OUTGOING
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">หนังสือส่งออกทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{outgoingDocs.length}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ปีงบประมาณ ๒๕๖๙</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              DELIVERED
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ส่งถึงปลายทางแล้ว</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">
              {outgoingDocs.filter(d => d.status === 'ส่งแล้ว' || d.status === 'จัดเก็บแล้ว').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ส่งมอบปลายทางเรียบร้อย</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              PENDING SIGNATURE
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">รอตรวจ / รอลงนาม</div>
            <div className="text-3xl font-light font-mono text-[#A77A35] mt-1">
              {outgoingDocs.filter(d => d.status === 'รอตรวจ' || d.status === 'รอลงนาม').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">เสนอแฟ้มผู้บริหารพิจารณา</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              DRAFTS IN PROGRESS
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ร่างหนังสือในระบบ</div>
            <div className="text-3xl font-light font-mono text-[#234A78] mt-1">
              {outgoingDocs.filter(d => d.status === 'ร่าง').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">อยู่ระหว่างเจ้าหน้าที่จัดทำ</div>
        </div>
      </section>

      {/* 03 — SEARCH & FILTERS */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่หนังสือ, ชื่อเรื่อง, ผู้รับ, หรือผู้ร่าง..."
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
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกสถานะ</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกประเภทหนังสือ</option>
            {DOC_TYPES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={e => {
              setSelectedUrgency(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกระดับความเร่งด่วน</option>
            {URGENCIES.map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {(selectedStatus !== 'all' || selectedType !== 'all' || selectedUrgency !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus('all');
                setSelectedType('all');
                setSelectedUrgency('all');
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
                <th className="py-3.5 px-4">เลขที่หนังสือ / วันที่ส่ง</th>
                <th className="py-3.5 px-3">ส่งถึง (ผู้รับ)</th>
                <th className="py-3.5 px-3">ชื่อเรื่อง</th>
                <th className="py-3.5 px-3">ประเภท</th>
                <th className="py-3.5 px-3">ผู้ร่าง / กลุ่มงาน</th>
                <th className="py-3.5 px-3 text-center">ความเร่งด่วน</th>
                <th className="py-3.5 px-3 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[rgba(17,19,21,0.4)]">
                    <Send className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.3)] mb-2 stroke-[1.5]" />
                    ไม่พบข้อมูลหนังสือส่งตามเงื่อนไขที่ระบุ
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => (
                  <tr key={item.outgoing_id} className="hover:bg-white/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111315] font-mono">{item.book_number}</div>
                      <div className="text-[11px] text-[rgba(17,19,21,0.5)] flex items-center gap-1 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                        <span>{formatThaiDate(item.send_date, true)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#111315] text-xs truncate max-w-[180px]">
                        {item.recipient}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#111315] text-xs max-w-sm line-clamp-1">
                        {item.subject}
                      </div>
                      {item.attachment && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#234A78] mt-1 bg-[#234A78]/5 px-2 py-0.5 rounded-md font-mono">
                          <Paperclip className="w-3 h-3 stroke-[1.5]" />
                          <span className="truncate max-w-[160px]">{item.attachment}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[rgba(17,19,21,0.05)] text-[#111315]">
                        {item.document_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#111315] text-xs">{item.responsible_person}</div>
                      <div className="text-[10px] text-[rgba(17,19,21,0.45)] mt-0.5 truncate max-w-[140px] font-mono">
                        {item.responsible_unit}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap ${
                          item.urgency === 'ด่วนที่สุด'
                            ? 'bg-[#A84E4E]/10 text-[#A84E4E]'
                            : item.urgency === 'ด่วนมาก'
                            ? 'bg-[#A77A35]/15 text-[#A77A35]'
                            : item.urgency === 'ด่วน'
                            ? 'bg-[#234A78]/10 text-[#234A78]'
                            : 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.6)]'
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono whitespace-nowrap ${
                          item.status === 'ส่งแล้ว'
                            ? 'bg-[#42695B]/10 text-[#42695B]'
                            : item.status === 'จัดเก็บแล้ว'
                            ? 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.6)]'
                            : item.status === 'รอลงนาม'
                            ? 'bg-[#234A78]/10 text-[#234A78]'
                            : item.status === 'รอตรวจ'
                            ? 'bg-[#A77A35]/15 text-[#A77A35]'
                            : 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.6)]'
                        }`}
                      >
                        ● {item.status}
                      </span>
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
                              onClick={() => setDeletingId(item.outgoing_id)}
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
                ))
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
                <Send className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-base font-medium text-[#111315]">
                  {editingItem ? `แก้ไขหนังสือส่ง (${editingItem.book_number})` : 'สร้างหนังสือส่งออกใหม่'}
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
                    เลขที่หนังสือส่ง <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ศอ 0101/1845"
                    value={formBookNumber}
                    onChange={e => setFormBookNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">วันที่ส่งออก</label>
                  <input
                    type="date"
                    value={formSendDate}
                    onChange={e => setFormSendDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">
                    ถึง (ผู้รับ / หน่วยงานปลายทาง) <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น สำนักงบประมาณ, ผู้ว่าราชการจังหวัด..."
                    value={formRecipient}
                    onChange={e => setFormRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ประเภทหนังสือ</label>
                  <select
                    value={formDocType}
                    onChange={e => setFormDocType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {DOC_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  เรื่อง <span className="text-[#A84E4E]">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="กรอกชื่อเรื่องของหนังสือส่งออก..."
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ผู้ร่าง / ผู้รับผิดชอบ</label>
                  <select
                    value={formResponsiblePerson}
                    onChange={e => handlePersonSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {personnel.map(p => (
                      <option key={p.person_id} value={p.name}>
                        {p.rank} {p.name} ({p.department})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">กลุ่มงานผู้ส่ง</label>
                  <input
                    type="text"
                    value={formResponsibleUnit}
                    onChange={e => setFormResponsibleUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-[rgba(17,19,21,0.03)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ระดับความเร่งด่วน</label>
                  <select
                    value={formUrgency}
                    onChange={e => setFormUrgency(e.target.value as DocumentUrgency)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {URGENCIES.map(u => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">สถานะหนังสือ</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as OutgoingStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">ชื่อไฟล์แนบ (PDF / DOCX)</label>
                <input
                  type="text"
                  placeholder="เช่น หนังสือราชการ_ส่งภายนอก.pdf"
                  value={formAttachment}
                  onChange={e => setFormAttachment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">หมายเหตุ / วิธีการจัดส่ง</label>
                <input
                  type="text"
                  placeholder="เช่น ส่งผ่านสารบรรณอิเล็กทรอนิกส์, ส่งไปรษณีย์ด่วนพิเศษ EMS..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                />
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
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกหนังสือส่ง'}
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
                  <span className="text-xs font-mono font-bold text-[#234A78]">{viewingItem.book_number}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      viewingItem.urgency === 'ด่วนที่สุด'
                        ? 'bg-[#A84E4E]/10 text-[#A84E4E]'
                        : viewingItem.urgency === 'ด่วนมาก'
                        ? 'bg-[#A77A35]/15 text-[#A77A35]'
                        : viewingItem.urgency === 'ด่วน'
                        ? 'bg-[#234A78]/10 text-[#234A78]'
                        : 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.6)]'
                    }`}
                  >
                    {viewingItem.urgency}
                  </span>
                </div>
                <h3 className="text-base font-medium text-[#111315] mt-1">{viewingItem.subject}</h3>
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
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">ผู้รับ:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.recipient}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">ประเภท:</span>
                  <span className="font-semibold font-mono text-[#111315]">{viewingItem.document_type}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">วันที่ส่ง:</span>
                  <span className="font-mono text-[#111315]">{formatThaiDate(viewingItem.send_date)}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">สถานะ:</span>
                  <span className="font-mono text-[#234A78] font-medium">{viewingItem.status}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)]">
                <span className="text-[#111315] font-semibold block mb-1">ผู้ร่างและกลุ่มงานผู้ส่ง:</span>
                <p className="text-[#111315] font-medium">{viewingItem.responsible_person}</p>
                <p className="text-[rgba(17,19,21,0.5)] text-[11px] font-mono">{viewingItem.responsible_unit}</p>
              </div>

              {viewingItem.notes && (
                <div className="p-3 bg-[rgba(17,19,21,0.03)] rounded-2xl text-[rgba(17,19,21,0.7)]">
                  <span className="font-semibold text-[#111315]">หมายเหตุ / วิธีจัดส่ง: </span>
                  {viewingItem.notes}
                </div>
              )}

              {viewingItem.attachment && (
                <div className="p-3 rounded-2xl border border-[rgba(17,19,21,0.08)] flex items-center justify-between bg-white/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                    <div>
                      <div className="font-medium text-[#111315]">{viewingItem.attachment}</div>
                      <div className="text-[10px] text-[rgba(17,19,21,0.4)] font-mono">{viewingItem.attachment_size || '1.8 MB'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast(`ดาวน์โหลด ${viewingItem.attachment} จำลองสำเร็จ`, 'success')}
                    className="px-3 py-1.5 rounded-xl bg-[#234A78]/10 text-[#234A78] hover:bg-[#234A78]/20 font-medium text-xs transition cursor-pointer"
                  >
                    ดาวน์โหลด
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-[rgba(17,19,21,0.08)] flex items-center justify-end">
              <button
                type="button"
                onClick={() => setViewingItem(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#17324F] text-white hover:bg-[#234A78] transition cursor-pointer"
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
        title="ยืนยันการลบหนังสือส่ง"
        message="คุณต้องการลบหนังสือส่งนี้ออกจากระบบหรือไม่?"
        onConfirm={() => {
          if (deletingId) deleteOutgoingDoc(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
