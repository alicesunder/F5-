import React, { useState, useMemo } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { IncomingDocument, DocumentUrgency, IncomingStatus } from '../types';
import { formatThaiDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import {
  Inbox,
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  FileText,
  AlertCircle,
  Clock,
  Paperclip,
  Calendar,
} from 'lucide-react';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';

const URGENCIES: DocumentUrgency[] = ['ปกติ', 'ด่วน', 'ด่วนมาก', 'ด่วนที่สุด'];
const STATUSES: IncomingStatus[] = ['รับแล้ว', 'รอดำเนินการ', 'กำลังดำเนินการ', 'เสร็จสิ้น', 'ส่งต่อ'];

export const IncomingDocsPage: React.FC = () => {
  const {
    incomingDocs,
    personnel,
    units,
    addIncomingDoc,
    updateIncomingDoc,
    deleteIncomingDoc,
    currentRole,
    showToast,
  } = useAdmin();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IncomingDocument | null>(null);
  const [viewingItem, setViewingItem] = useState<IncomingDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formBookNumber, setFormBookNumber] = useState('');
  const [formReceivedDate, setFormReceivedDate] = useState(new Date().toISOString().slice(0, 10));
  const [formSender, setFormSender] = useState('');
  const [formRecipient, setFormRecipient] = useState('ผู้อำนวยการฝ่ายอำนวยการ');
  const [formSubject, setFormSubject] = useState('');
  const [formActionTaken, setFormActionTaken] = useState('มอบหมายกลุ่มงานแผนงานและงบประมาณดำเนินการ');
  const [formResponsiblePerson, setFormResponsiblePerson] = useState(personnel[1]?.name || '');
  const [formResponsibleUnit, setFormResponsibleUnit] = useState(units[0]?.unit_name || '');
  const [formStatus, setFormStatus] = useState<IncomingStatus>('รอดำเนินการ');
  const [formUrgency, setFormUrgency] = useState<DocumentUrgency>('ปกติ');
  const [formAttachment, setFormAttachment] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Handle personnel select to auto set unit
  const handlePersonSelect = (name: string) => {
    setFormResponsiblePerson(name);
    const matched = personnel.find(p => p.name === name);
    if (matched) {
      setFormResponsibleUnit(matched.department);
    }
  };

  // Filtered list
  const filteredDocs = useMemo(() => {
    return incomingDocs.filter(d => {
      const matchSearch =
        !searchQuery ||
        d.book_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.responsible_person.toLowerCase().includes(searchQuery.toLowerCase());

      const matchUrgency = selectedUrgency === 'all' || d.urgency === selectedUrgency;
      const matchStatus = selectedStatus === 'all' || d.status === selectedStatus;
      const matchUnit = selectedUnit === 'all' || d.responsible_unit === selectedUnit;

      return matchSearch && matchUrgency && matchStatus && matchUnit;
    });
  }, [incomingDocs, searchQuery, selectedUrgency, selectedStatus, selectedUnit]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocs.slice(start, start + pageSize);
  }, [filteredDocs, currentPage, pageSize]);

  // Open Edit
  const handleOpenEdit = (item: IncomingDocument) => {
    setEditingItem(item);
    setFormBookNumber(item.book_number);
    setFormReceivedDate(item.received_date);
    setFormSender(item.sender);
    setFormRecipient(item.recipient);
    setFormSubject(item.subject);
    setFormActionTaken(item.action_taken);
    setFormResponsiblePerson(item.responsible_person);
    setFormResponsibleUnit(item.responsible_unit);
    setFormStatus(item.status);
    setFormUrgency(item.urgency);
    setFormAttachment(item.attachment || '');
    setFormDueDate(item.due_date || '');
    setFormNotes(item.notes || '');
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormBookNumber(`นร 0505/ว ${String(Math.floor(Math.random() * 800) + 100)}`);
    setFormReceivedDate(new Date().toISOString().slice(0, 10));
    setFormSender('สำนักเลขาธิการคณะรัฐมนตรี');
    setFormRecipient('ผู้อำนวยการฝ่ายอำนวยการ');
    setFormSubject('');
    setFormActionTaken('มอบหมายกลุ่มงานที่เกี่ยวข้องพิจารณาดำเนินการ');
    setFormResponsiblePerson(personnel[1]?.name || '');
    setFormResponsibleUnit(personnel[1]?.department || units[0]?.unit_name || '');
    setFormStatus('รอดำเนินการ');
    setFormUrgency('ด่วน');
    setFormAttachment('หนังสือราชการ_เอกสารแนบ.pdf');
    setFormDueDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBookNumber || !formSubject || !formSender) {
      showToast('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน', 'error');
      return;
    }

    if (editingItem) {
      updateIncomingDoc({
        ...editingItem,
        book_number: formBookNumber.trim(),
        received_date: formReceivedDate,
        sender: formSender.trim(),
        recipient: formRecipient.trim(),
        subject: formSubject.trim(),
        action_taken: formActionTaken.trim(),
        responsible_person: formResponsiblePerson,
        responsible_unit: formResponsibleUnit,
        status: formStatus,
        urgency: formUrgency,
        attachment: formAttachment.trim() || undefined,
        attachment_size: formAttachment ? '2.4 MB' : undefined,
        due_date: formDueDate || undefined,
        notes: formNotes.trim() || undefined,
      });
      setEditingItem(null);
    } else {
      addIncomingDoc({
        book_number: formBookNumber.trim(),
        received_date: formReceivedDate,
        sender: formSender.trim(),
        recipient: formRecipient.trim(),
        subject: formSubject.trim(),
        action_taken: formActionTaken.trim(),
        responsible_person: formResponsiblePerson,
        responsible_unit: formResponsibleUnit,
        status: formStatus,
        urgency: formUrgency,
        attachment: formAttachment.trim() || undefined,
        attachment_size: formAttachment ? '2.4 MB' : undefined,
        due_date: formDueDate || undefined,
        notes: formNotes.trim() || undefined,
      });
      setIsAddModalOpen(false);
    }
  };

  // Export CSV
  const handleExport = () => {
    const exportData = filteredDocs.map(d => ({
      รหัสหนังสือรับ: d.incoming_id,
      เลขที่หนังสือ: d.book_number,
      วันที่รับ: d.received_date,
      จาก: d.sender,
      ถึง: d.recipient,
      เรื่อง: d.subject,
      การปฏิบัติ: d.action_taken,
      ผู้รับผิดชอบ: d.responsible_person,
      กลุ่มงาน: d.responsible_unit,
      ความเร่งด่วน: d.urgency,
      สถานะ: d.status,
      กำหนดส่งงาน: d.due_date || '-',
      ไฟล์แนบ: d.attachment || '-',
    }));
    exportToCSV(exportData, `ทะเบียนคุมหนังสือรับฝ่ายอำนวยการ_${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">DOCS / 01</span>
              <span>—</span>
              <span>INCOMING DISPATCH REGISTRY</span>
              <span>—</span>
              <span>TASK ROUTING</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ทะเบียนหนังสือรับฝ่ายอำนวยการ
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed max-w-2xl">
              รับเรื่องหนังสือราชการภายนอกและภายใน มอบหมายเกษียณสั่งการ ควบคุมกำหนดส่งงาน (Due Date) และติดตามสถานะการปฏิบัติงานแบบเรียลไทม์
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
                <span>ลงทะเบียนหนังสือรับ</span>
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
              TOTAL INCOMING
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">หนังสือรับทั้งหมด</div>
            <div className="text-3xl font-light font-mono text-[#111315] mt-1">{incomingDocs.length}</div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ระบบสารบรรณฝ่ายอำนวยการ</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              PENDING ACTION
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">รอดำเนินการ / รับแล้ว</div>
            <div className="text-3xl font-light font-mono text-[#A84E4E] mt-1">
              {incomingDocs.filter(d => d.status === 'รอดำเนินการ' || d.status === 'รับแล้ว').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">รอเจ้าหน้าที่รับเรื่องและสรุป</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              URGENT DIRECTIVES
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ข้อสั่งการด่วน / ด่วนที่สุด</div>
            <div className="text-3xl font-light font-mono text-[#A77A35] mt-1">
              {incomingDocs.filter(d => d.urgency === 'ด่วนที่สุด' || d.urgency === 'ด่วนมาก').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">ต้องตอบกลับตามกรอบเวลา</div>
        </div>

        <div className="glass rounded-[22px] p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase mb-1">
              COMPLETED DISPATCH
            </div>
            <div className="text-[12px] text-[rgba(17,19,21,0.6)]">ดำเนินการเสร็จสิ้นแล้ว</div>
            <div className="text-3xl font-light font-mono text-[#42695B] mt-1">
              {incomingDocs.filter(d => d.status === 'เสร็จสิ้น').length}
            </div>
          </div>
          <div className="text-[10px] font-mono text-[rgba(17,19,21,0.45)] mt-3">จัดเก็บเข้าสารบบเรียบร้อย</div>
        </div>
      </section>

      {/* 03 — SEARCH & FILTERS */}
      <section className="glass rounded-[22px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[rgba(17,19,21,0.4)] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.5]" />
          <input
            type="text"
            placeholder="ค้นหาเลขที่หนังสือ, ชื่อเรื่อง, ต้นเรื่อง, หรือผู้รับผิดชอบ..."
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
            value={selectedUnit}
            onChange={e => {
              setSelectedUnit(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs rounded-xl border border-[rgba(17,19,21,0.08)] px-3 py-2 bg-white/80 text-[#111315] focus:outline-hidden cursor-pointer"
          >
            <option value="all">ทุกกลุ่มงานรับผิดชอบ</option>
            {units.map(u => (
              <option key={u.unit_id} value={u.unit_name}>
                {u.unit_name}
              </option>
            ))}
          </select>

          {(selectedUrgency !== 'all' || selectedStatus !== 'all' || selectedUnit !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedUrgency('all');
                setSelectedStatus('all');
                setSelectedUnit('all');
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
                <th className="py-3.5 px-4">เลขที่หนังสือ / วันที่รับ</th>
                <th className="py-3.5 px-3">จาก (ต้นเรื่อง)</th>
                <th className="py-3.5 px-3">ชื่อเรื่อง / รายละเอียด</th>
                <th className="py-3.5 px-3">ผู้รับผิดชอบ / สังกัด</th>
                <th className="py-3.5 px-3 text-center">ความเร่งด่วน</th>
                <th className="py-3.5 px-3 text-center">สถานะ</th>
                <th className="py-3.5 px-3">ครบกำหนด</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(17,19,21,0.06)]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[rgba(17,19,21,0.4)]">
                    <Inbox className="w-8 h-8 mx-auto text-[rgba(17,19,21,0.3)] mb-2 stroke-[1.5]" />
                    ไม่พบข้อมูลหนังสือรับตามเงื่อนไขที่ระบุ
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => (
                  <tr key={item.incoming_id} className="hover:bg-white/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#111315] font-mono">{item.book_number}</div>
                      <div className="text-[11px] text-[rgba(17,19,21,0.5)] flex items-center gap-1 mt-0.5 font-mono">
                        <Calendar className="w-3 h-3 text-[rgba(17,19,21,0.4)] stroke-[1.5]" />
                        <span>{formatThaiDate(item.received_date, true)}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#111315] text-xs truncate max-w-[170px]">
                        {item.sender}
                      </div>
                      <div className="text-[10px] text-[rgba(17,19,21,0.45)]">ถึง: {item.recipient}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-[#111315] text-xs max-w-sm line-clamp-1">
                        {item.subject}
                      </div>
                      <div className="text-[11px] text-[rgba(17,19,21,0.5)] line-clamp-1 mt-0.5">
                        <span className="font-semibold text-[#111315]">การสั่งการ: </span>
                        {item.action_taken}
                      </div>
                      {item.attachment && (
                        <div className="inline-flex items-center gap-1 text-[10px] text-[#234A78] mt-1 bg-[#234A78]/5 px-2 py-0.5 rounded-md font-mono">
                          <Paperclip className="w-3 h-3 stroke-[1.5]" />
                          <span className="truncate max-w-[160px]">{item.attachment}</span>
                        </div>
                      )}
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
                          item.status === 'เสร็จสิ้น'
                            ? 'bg-[#42695B]/10 text-[#42695B]'
                            : item.status === 'กำลังดำเนินการ'
                            ? 'bg-[#234A78]/10 text-[#234A78]'
                            : item.status === 'ส่งต่อ'
                            ? 'bg-[#6B5B95]/10 text-[#6B5B95]'
                            : item.status === 'รอดำเนินการ'
                            ? 'bg-[#A77A35]/10 text-[#A77A35]'
                            : 'bg-[rgba(17,19,21,0.06)] text-[rgba(17,19,21,0.6)]'
                        }`}
                      >
                        ● {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[rgba(17,19,21,0.6)] font-mono text-[11px]">
                      {item.due_date ? formatThaiDate(item.due_date, true) : '-'}
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
                              onClick={() => setDeletingId(item.incoming_id)}
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
                <Inbox className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                <h3 className="text-base font-medium text-[#111315]">
                  {editingItem ? `แก้ไขหนังสือรับ (${editingItem.book_number})` : 'ลงทะเบียนหนังสือรับเข้าใหม่'}
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
                    เลขที่หนังสือรับ <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น นร 0505/ว 142"
                    value={formBookNumber}
                    onChange={e => setFormBookNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">วันที่ลงรับในระบบ</label>
                  <input
                    type="date"
                    value={formReceivedDate}
                    onChange={e => setFormReceivedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">
                    จาก (หน่วยงานต้นเรื่อง) <span className="text-[#A84E4E]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น สำนักงบประมาณ, กระทรวงกลาโหม..."
                    value={formSender}
                    onChange={e => setFormSender(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ถึง (ผู้รับเรื่อง)</label>
                  <input
                    type="text"
                    value={formRecipient}
                    onChange={e => setFormRecipient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  เรื่อง <span className="text-[#A84E4E]">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="กรอกชื่อเรื่องตามที่ระบุในหนังสือราชการ..."
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">
                  การปฏิบัติ / เกษียณสั่งการ
                </label>
                <textarea
                  rows={2}
                  placeholder="เช่น มอบหมายกลุ่มงานแผนงานและงบประมาณดำเนินการรายงานผล..."
                  value={formActionTaken}
                  onChange={e => setFormActionTaken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden focus:border-[#234A78]/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ผู้รับผิดชอบ</label>
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
                  <label className="block font-medium text-[#111315] mb-1">กลุ่มงานรับผิดชอบ</label>
                  <input
                    type="text"
                    value={formResponsibleUnit}
                    onChange={e => setFormResponsibleUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-[rgba(17,19,21,0.03)] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#111315] mb-1">ความเร่งด่วน</label>
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
                  <label className="block font-medium text-[#111315] mb-1">สถานะ</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as IncomingStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white focus:outline-hidden"
                  >
                    {STATUSES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[#111315] mb-1">กำหนดส่งงาน (Due Date)</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={e => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[rgba(17,19,21,0.1)] bg-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#111315] mb-1">ชื่อไฟล์แนบ (PDF / DOCX)</label>
                <input
                  type="text"
                  placeholder="เช่น หนังสือคำสั่ง_2569.pdf"
                  value={formAttachment}
                  onChange={e => setFormAttachment(e.target.value)}
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
                  {editingItem ? 'บันทึกการแก้ไข' : 'บันทึกหนังสือรับ'}
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
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">จาก (ต้นเรื่อง):</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.sender}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">ถึง:</span>
                  <span className="font-semibold text-[#111315]">{viewingItem.recipient}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">วันที่รับ:</span>
                  <span className="font-mono text-[#111315]">{formatThaiDate(viewingItem.received_date)}</span>
                </div>
                <div>
                  <span className="text-[rgba(17,19,21,0.4)] block text-[11px]">สถานะ:</span>
                  <span className="font-mono text-[#234A78] font-medium">{viewingItem.status}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] space-y-1">
                <span className="font-semibold text-[#111315] block">การปฏิบัติ / เกษียณสั่งการ:</span>
                <p className="text-[rgba(17,19,21,0.8)] leading-relaxed">{viewingItem.action_taken}</p>
                <div className="pt-2 text-[rgba(17,19,21,0.5)] flex items-center justify-between border-t border-[rgba(17,19,21,0.06)] mt-2 font-mono text-[11px]">
                  <span>ผู้รับผิดชอบ: <strong className="text-[#111315] font-sans font-medium">{viewingItem.responsible_person}</strong></span>
                  <span>({viewingItem.responsible_unit})</span>
                </div>
              </div>

              {viewingItem.due_date && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#A77A35]/10 text-[#A77A35] border border-[#A77A35]/20 font-mono">
                  <span className="flex items-center gap-1.5 font-sans font-medium">
                    <Clock className="w-4 h-4 text-[#A77A35] stroke-[1.5]" /> วันครบกำหนดส่งงาน:
                  </span>
                  <span className="font-bold">{formatThaiDate(viewingItem.due_date)}</span>
                </div>
              )}

              {viewingItem.attachment && (
                <div className="p-3 rounded-2xl border border-[rgba(17,19,21,0.08)] flex items-center justify-between bg-white/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
                    <div>
                      <div className="font-medium text-[#111315]">{viewingItem.attachment}</div>
                      <div className="text-[10px] text-[rgba(17,19,21,0.4)] font-mono">{viewingItem.attachment_size || '2.5 MB'}</div>
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
        title="ยืนยันการลบหนังสือรับ"
        message="คุณต้องการลบหนังสือรับนี้ออกจากระบบหรือไม่?"
        onConfirm={() => {
          if (deletingId) deleteIncomingDoc(deletingId);
          setDeletingId(null);
        }}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
