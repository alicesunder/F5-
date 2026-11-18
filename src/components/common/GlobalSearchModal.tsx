import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useAdmin } from '../../contexts/AdminContext';
import { modalVariants } from '../../utils/motion';
import {
  Search,
  X,
  FileText,
  DollarSign,
  Calendar,
  Building2,
  Users,
  Send,
  Inbox,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { formatThaiDate, formatCurrency } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen = true, onClose }) => {
  const {
    budgets,
    travelRecords,
    incomingDocs,
    outgoingDocs,
    archivalDocs,
    units,
    personnel,
    navigate,
  } = useAdmin();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedBudgets = budgets.filter(
      b =>
        b.project_name.toLowerCase().includes(q) ||
        b.budget_id.toLowerCase().includes(q) ||
        b.budget_category.toLowerCase().includes(q) ||
        b.responsible_unit.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedTravel = travelRecords.filter(
      t =>
        t.traveler_name.toLowerCase().includes(q) ||
        t.province.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.purpose.toLowerCase().includes(q) ||
        t.order_number.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedIncoming = incomingDocs.filter(
      d =>
        d.book_number.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.sender.toLowerCase().includes(q) ||
        d.responsible_person.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedOutgoing = outgoingDocs.filter(
      d =>
        d.book_number.toLowerCase().includes(q) ||
        d.subject.toLowerCase().includes(q) ||
        d.recipient.toLowerCase().includes(q) ||
        d.responsible_person.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedDocs = archivalDocs.filter(
      d =>
        (d.document_number || '').toLowerCase().includes(q) ||
        (d.document_name || d.title || '').toLowerCase().includes(q) ||
        (d.category || '').toLowerCase().includes(q) ||
        (d.tags || []).some(tag => tag.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedPersonnel = personnel.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.position.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.phone.includes(q)
    ).slice(0, 4);

    const matchedUnits = units.filter(
      u =>
        u.unit_name.toLowerCase().includes(q) ||
        u.unit_code.toLowerCase().includes(q) ||
        u.commander.toLowerCase().includes(q)
    ).slice(0, 4);

    const totalCount =
      matchedBudgets.length +
      matchedTravel.length +
      matchedIncoming.length +
      matchedOutgoing.length +
      matchedDocs.length +
      matchedPersonnel.length +
      matchedUnits.length;

    return {
      totalCount,
      budgets: matchedBudgets,
      travel: matchedTravel,
      incoming: matchedIncoming,
      outgoing: matchedOutgoing,
      docs: matchedDocs,
      personnel: matchedPersonnel,
      units: matchedUnits,
    };
  }, [query, budgets, travelRecords, incomingDocs, outgoingDocs, archivalDocs, personnel, units]);

  if (!isOpen) return null;

  return (
    <motion.div
      variants={modalVariants.backdrop}
      initial="initial"
      animate="animate"
      exit="exit"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-[14px] pt-14 sm:pt-20"
    >
      <motion.div
        variants={modalVariants.panel}
        initial="initial"
        animate="animate"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="liquid-glass-modal iridescent-edge rounded-[28px] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[82vh] text-[#2D2A32] dark:text-[#F5F7FA]"
      >
        {/* Command Search Bar */}
        <div className="p-4 sm:p-5 border-b border-[rgba(40,35,50,0.08)] dark:border-white/10 flex items-center gap-3.5 bg-white/50 dark:bg-white/5">
          <Search className="w-5 h-5 text-[#5B2A86] dark:text-[#B3A0E8] shrink-0 stroke-[1.8]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ค้นหาข้อมูลในระบบ: เลขหนังสือ, โครงการ, กำลังพล, จังหวัด, คำสั่ง..."
            className="w-full bg-transparent text-sm sm:text-base text-[#2D2A32] dark:text-[#F5F7FA] placeholder:text-[#8A8792] focus:outline-hidden font-normal"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-[#8A8792] hover:text-[#2D2A32] dark:hover:text-[#F5F7FA] hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[1.8]" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono tracking-wider px-2 py-1 rounded-lg bg-white/80 dark:bg-white/10 border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:bg-white dark:hover:bg-white/20 text-[#5A5764] dark:text-slate-300 font-semibold transition shrink-0 cursor-pointer shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {!query.trim() ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 text-[#5B2A86] dark:text-[#B3A0E8] flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-sm font-medium text-[#2D2A32] dark:text-[#F5F7FA]">พิมพ์คำค้นหาเพื่อค้นหาข้อมูลข้ามทุกระบบของฝ่ายอำนวยการ</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">// CROSS-MODULE UNIFIED QUERY</p>

              <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs font-mono">
                <span className="text-slate-400 dark:text-slate-500">คำค้นยอดนิยม:</span>
                {['เร่งรัดงบประมาณ', 'เชียงใหม่', 'คำสั่ง 102', 'พ.อ. วรพงษ์', 'สารบรรณ', 'ITA'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results?.totalCount === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold text-[#2D2A32] dark:text-[#F5F7FA]">ไม่พบข้อมูลที่ตรงกับ "{query}"</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">// ZERO MATCHES FOUND IN ARCHIVE</p>
            </div>
          ) : (
            <>
              {/* Incoming Docs */}
              {results && results.incoming.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Inbox className="w-3.5 h-3.5 text-[#2583D8] stroke-[1.5]" /> หนังสือรับ ({results.incoming.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.incoming.map(doc => (
                      <div
                        key={doc.incoming_id}
                        onClick={() => {
                          navigate('incoming');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:border-[#2583D8]/30 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between group transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-[#2583D8]">{doc.book_number}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">({doc.sender})</span>
                          </div>
                          <p className="text-xs font-medium text-[#2D2A32] dark:text-[#F5F7FA] line-clamp-1 mt-0.5">{doc.subject}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2583D8] group-hover:translate-x-0.5 transition shrink-0 ml-3 stroke-[1.5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outgoing Docs */}
              {results && results.outgoing.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-[#5B2A86] dark:text-[#B3A0E8] stroke-[1.5]" /> หนังสือส่ง ({results.outgoing.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.outgoing.map(doc => (
                      <div
                        key={doc.outgoing_id}
                        onClick={() => {
                          navigate('outgoing');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:border-[#5B2A86]/30 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between group transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-[#5B2A86] dark:text-[#B3A0E8]">{doc.book_number}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">ส่งถึง: {doc.recipient}</span>
                          </div>
                          <p className="text-xs font-medium text-[#2D2A32] dark:text-[#F5F7FA] line-clamp-1 mt-0.5">{doc.subject}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#5B2A86] dark:group-hover:text-[#B3A0E8] group-hover:translate-x-0.5 transition shrink-0 ml-3 stroke-[1.5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              {results && results.budgets.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#42A77A] stroke-[1.5]" /> งบประมาณ ({results.budgets.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.budgets.map(b => (
                      <div
                        key={b.budget_id}
                        onClick={() => {
                          navigate('budget');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:border-[#42A77A]/30 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between group transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold text-[#42A77A]">{b.budget_id}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">({b.responsible_unit})</span>
                          </div>
                          <p className="text-xs font-medium text-[#2D2A32] dark:text-[#F5F7FA] line-clamp-1 mt-0.5">{b.project_name}</p>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <div className="text-xs font-mono font-semibold text-[#2D2A32] dark:text-[#F5F7FA]">{formatCurrency(b.allocated_amount)}</div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">คงเหลือ: {formatCurrency(b.remaining_amount)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel */}
              {results && results.travel.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#E89B22] stroke-[1.5]" /> งานไปราชการ ({results.travel.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.travel.map(t => (
                      <div
                        key={t.travel_id}
                        onClick={() => {
                          navigate('travel');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:border-[#E89B22]/30 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between group transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#2D2A32] dark:text-[#F5F7FA]">{t.traveler_name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">จังหวัด{t.province}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">{t.purpose}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#E89B22] group-hover:translate-x-0.5 transition shrink-0 ml-3 stroke-[1.5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Archival Docs */}
              {results && results.docs.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#2583D8] stroke-[1.5]" /> คลังเอกสารกลาง ({results.docs.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.docs.map((doc, idx) => (
                      <div
                        key={doc.document_id || doc.doc_id || doc.document_number || `search-doc-${idx}`}
                        onClick={() => {
                          navigate('documents');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:border-[#2583D8]/30 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between group transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="font-semibold text-[#2583D8]">{doc.document_number}</span>
                            <span className="text-slate-500 dark:text-slate-400">{doc.category}</span>
                            <span className="text-slate-500 dark:text-slate-400">({(doc.file_type || 'PDF').toUpperCase()})</span>
                          </div>
                          <p className="text-xs font-medium text-[#2D2A32] dark:text-[#F5F7FA] line-clamp-1 mt-0.5">
                            {doc.document_name || doc.title || 'เอกสารราชการ'}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#2583D8] group-hover:translate-x-0.5 transition shrink-0 ml-3 stroke-[1.5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personnel */}
              {results && results.personnel.length > 0 && (
                <div>
                  <div className="text-[10px] font-mono tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#42A77A] stroke-[1.5]" /> บุคลากร ({results.personnel.length})
                  </div>
                  <div className="space-y-1.5">
                    {results.personnel.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          navigate('units');
                          onClose();
                        }}
                        className="p-3 rounded-2xl border border-[rgba(40,35,50,0.08)] dark:border-white/10 hover:border-[#42A77A]/30 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between group transition shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[#2D2A32] dark:text-[#F5F7FA]">{p.rank} {p.name}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">({p.position})</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">{p.department} • โทร: {p.phone}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#42A77A] group-hover:translate-x-0.5 transition shrink-0 ml-3 stroke-[1.5]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
