import React, { useState, useMemo, useEffect } from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { BppReportTracker } from '../../../components/bpp/BppReportTracker';
import {
  FO5_DEPARTMENTS_META,
  DepartmentKey,
  CentralTaskItem,
} from '../../../data/commandCenterData';
import {
  CheckSquare,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight,
} from 'lucide-react';

interface UnifiedTaskCenterModuleProps {
  tasks: CentralTaskItem[];
  initialSubTab?: 'tasks' | 'bpp-units';
  onUpdateTaskStatus?: (taskId: string, newStatus: CentralTaskItem['status']) => void;
}

export const UnifiedTaskCenterModule: React.FC<UnifiedTaskCenterModuleProps> = ({
  tasks,
  initialSubTab = 'tasks',
}) => {
  const { navigateModule } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'bpp-units'>(initialSubTab);
  const [selectedDept, setSelectedDept] = useState<DepartmentKey | 'all'>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchDept = selectedDept === 'all' || task.departmentKey === selectedDept;
      const matchUrgency = selectedUrgency === 'all' || task.urgency === selectedUrgency;
      const matchStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.targetUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.responsibleOfficer.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDept && matchUrgency && matchStatus && matchSearch;
    });
  }, [tasks, selectedDept, selectedUrgency, selectedStatus, searchQuery]);

  // Deadline Radar grouping
  const overdueTasks = tasks.filter(t => t.urgency === 'เกินกำหนด');
  const urgentTasks = tasks.filter(t => t.urgency === 'เร่งด่วน');
  const upcomingTasks = tasks.filter(t => t.urgency === 'ภายใน 7 วัน');
  const normalTasks = tasks.filter(t => t.urgency === 'ปกติ');

  return (
    <div className="space-y-6">
      {/* Studio Hero Header */}
      <div
        className="rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-white/15 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E1035 0%, #4C1D95 45%, #6D28D9 80%, #2563EB 100%)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B46C8] via-[#2583D8] via-[#E89B22] to-[#42A77A]" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 text-purple-200">
                <CheckSquare className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                ศูนย์งานด่วน & ติดตามการส่งงาน หน่วย ตชด.
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-purple-100/85 mt-1">
              รวมศูนย์งานเร่งด่วน ข้อสั่งการ และสถานะการส่งรายงานประจำงวดของหน่วยในสังกัดไว้ในจุดเดียว
            </p>
          </div>

          {/* Segmented Sub-Tab Switcher (Consolidated Task Center + BPP Tracker) */}
          <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('tasks')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'tasks'
                  ? 'bg-white text-[#5B2A86] shadow-sm'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>รายการงานด่วน ({tasks.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('bpp-units')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
                activeSubTab === 'bpp-units'
                  ? 'bg-white text-[#5B2A86] shadow-sm'
                  : 'text-white/85 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>ติดตาม หน่วย ตชด.</span>
            </button>
          </div>
        </div>

        {/* Deadline Radar Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/15 relative z-10">
          <div className="p-3.5 rounded-2xl bg-rose-500/25 backdrop-blur-md border border-rose-300/35">
            <div className="text-[11px] font-bold text-rose-100 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-300" />
              <span>เกินกำหนด (Overdue)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 font-mono tabular-nums">{overdueTasks.length}</div>
            <div className="text-[10px] text-rose-200 mt-0.5">ต้องการการเร่งรัดด่วน</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/25 backdrop-blur-md border border-amber-300/35">
            <div className="text-[11px] font-bold text-amber-100 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>เร่งด่วน (Urgent)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 font-mono tabular-nums">{urgentTasks.length}</div>
            <div className="text-[10px] text-amber-200 mt-0.5">ครบกำหนดภายใน 24-48 ชม.</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-500/25 backdrop-blur-md border border-sky-300/35">
            <div className="text-[11px] font-bold text-sky-100 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-300" />
              <span>ภายใน 7 วัน (Upcoming)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 font-mono tabular-nums">{upcomingTasks.length}</div>
            <div className="text-[10px] text-sky-200 mt-0.5">เตรียมการล่วงหน้า</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/25 backdrop-blur-md border border-emerald-300/35">
            <div className="text-[11px] font-bold text-emerald-100 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>ตามแผนปกติ (On Schedule)</span>
            </div>
            <div className="text-2xl font-black text-white mt-1 font-mono tabular-nums">{normalTasks.length}</div>
            <div className="text-[10px] text-emerald-200 mt-0.5">ดำเนินงานตามรอบเวลา</div>
          </div>
        </div>
      </div>

      {activeSubTab === 'bpp-units' ? (
        <BppReportTracker defaultDepartment="all" />
      ) : (
        <>
          {/* Filter Toolbar */}
          <div className="liquid-glass-card iridescent-edge rounded-2xl p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#8A8792] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="ค้นหางาน, หน่วยรับผิดชอบ, หรือผู้รับมอบหมาย..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F7F9] rounded-xl border border-[rgba(37,32,43,0.08)] focus:bg-white focus:outline-none focus:border-[#5B2A86]"
                />
              </div>

              {/* Department Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] text-[#6B6973] font-medium mr-1">สายงาน:</span>
                <button
                  type="button"
                  onClick={() => setSelectedDept('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedDept === 'all'
                      ? 'bg-[#25202B] text-white'
                      : 'bg-[#F7F7F9] text-[#6B6973] hover:text-[#25202B]'
                  }`}
                >
                  ทั้งหมด
                </button>
                {(['admin', 'relations', 'disaster', 'volunteer'] as DepartmentKey[]).map(key => {
                  const dept = FO5_DEPARTMENTS_META[key];
                  const isSel = selectedDept === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDept(key)}
                      className="px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer"
                      style={{
                        backgroundColor: isSel ? dept.color : '#F7F7F9',
                        color: isSel ? '#FFFFFF' : '#45424C',
                      }}
                    >
                      {dept.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary filters: Urgency & Status */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[rgba(37,32,43,0.05)] text-xs">
              <span className="text-[11px] text-[#6B6973] font-medium mr-1">ความเร่งด่วน:</span>
              {['all', 'เกินกำหนด', 'เร่งด่วน', 'ภายใน 7 วัน', 'ปกติ'].map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setSelectedUrgency(u)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedUrgency === u
                      ? 'bg-[#5B2A86] text-white'
                      : 'bg-[#F7F7F9] text-[#6B6973] hover:text-[#25202B]'
                  }`}
                >
                  {u === 'all' ? 'ทุกระดับ' : u}
                </button>
              ))}

              <div className="h-3 w-px bg-[rgba(37,32,43,0.1)] mx-1" />

              <span className="text-[11px] text-[#6B6973] font-medium mr-1">สถานะ:</span>
              {['all', 'รอดำเนินการ', 'กำลังดำเนินการ', 'รอตรวจ', 'เสร็จสิ้น'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedStatus === st
                      ? 'bg-[#25202B] text-white'
                      : 'bg-[#F7F7F9] text-[#6B6973] hover:text-[#25202B]'
                  }`}
                >
                  {st === 'all' ? 'ทุกสถานะ' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Task List Table / Cards */}
          <div className="bg-white rounded-2xl border border-[rgba(37,32,43,0.07)] overflow-hidden shadow-2xs">
            <div className="divide-y divide-[rgba(37,32,43,0.06)]">
              {filteredTasks.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#6B6973]">
                  ไม่พบงานที่ตรงกับเงื่อนไขการค้นหา
                </div>
              ) : (
                filteredTasks.map(task => {
                  const dept = FO5_DEPARTMENTS_META[task.departmentKey];
                  const isOverdue = task.urgency === 'เกินกำหนด';
                  const isUrgent = task.urgency === 'เร่งด่วน';

                  return (
                    <div
                      key={task.id}
                      className="p-4 hover:bg-[#FBFAFD] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ backgroundColor: dept.color }}
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{
                                backgroundColor: dept.lightColor,
                                color: dept.color,
                              }}
                            >
                              {dept.name}
                            </span>
                            <span className="text-[10px] font-mono text-[#8A8792]">
                              ประเภท: {task.sourceModule}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                                isOverdue
                                  ? 'bg-red-100 text-red-800'
                                  : isUrgent
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {task.urgency}
                            </span>
                          </div>

                          <div className="text-xs sm:text-sm font-bold text-[#25202B]">
                            {task.title}
                          </div>

                          <div className="text-[11px] text-[#6B6973] flex flex-wrap items-center gap-3">
                            <span>หน่วยรับผิดชอบ: <strong className="text-[#25202B]">{task.targetUnit}</strong></span>
                            <span>ผู้กำกับดูแล: <strong>{task.responsibleOfficer}</strong></span>
                            <span className="flex items-center gap-1 text-[#5B2A86] font-medium">
                              <Clock className="w-3 h-3" />
                              <span>กำหนดส่ง: <strong>{task.deadlineDate}</strong></span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-mono font-medium text-[#6B6973] px-2 py-1 rounded bg-[#F7F7F9]">
                          {task.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => navigateModule(task.actionUrlModule as any)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#5B2A86] text-white hover:bg-[#4E2472] transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>ไปยังระบบงาน</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
