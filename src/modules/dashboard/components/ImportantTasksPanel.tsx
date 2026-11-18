import React from 'react';
import { useAdmin } from '../../../contexts/AdminContext';
import { AlertCircle, Clock, CheckCircle2, ArrowRight, Flag } from 'lucide-react';
import { DEPARTMENT_COLORS } from '../../../types';

interface TaskItem {
  id: string;
  title: string;
  department: string;
  departmentColor: string;
  status: 'กำลังดำเนินการ' | 'รอรายงาน' | 'เสร็จสิ้น' | 'เร่งด่วน';
  targetModule: 'admin' | 'relations' | 'disaster' | 'volunteer';
  dueDate: string;
}

export const ImportantTasksPanel: React.FC = () => {
  const { navigateModule } = useAdmin();

  // Tasks matching Reference Image 2 & government workflows
  const tasks: TaskItem[] = [
    {
      id: 'task-1',
      title: 'เตรียมเอกสารงบประมาณรายจ่าย ประจำปี 2570',
      department: 'ฝ่ายอำนวยการ',
      departmentColor: DEPARTMENT_COLORS.admin, // #7F9B83
      status: 'เร่งด่วน',
      targetModule: 'admin',
      dueDate: 'ภายในวันนี้ 16:30 น.',
    },
    {
      id: 'task-2',
      title: 'แถลงข่าวกิจกรรมจิตอาสาพระราชทาน ภาคสนาม',
      department: 'ฝ่ายมวลชนสัมพันธ์',
      departmentColor: DEPARTMENT_COLORS.relations, // #EE7E9E
      status: 'รอรายงาน',
      targetModule: 'relations',
      dueDate: '12 ก.ย. 2569',
    },
    {
      id: 'task-3',
      title: 'รายงานสถานการณ์น้ำท่วมฉับพลัน ลุ่มน้ำยม-น่าน',
      department: 'ฝ่ายสาธารณภัย',
      departmentColor: DEPARTMENT_COLORS.disaster, // #8191BA
      status: 'กำลังดำเนินการ',
      targetModule: 'disaster',
      dueDate: 'เฝ้าระวัง 24 ชม.',
    },
    {
      id: 'task-4',
      title: 'สรุปผลการประชุมฝ่ายอำนวยการ ประจำเดือนกันยายน',
      department: 'ฝ่ายอำนวยการ',
      departmentColor: DEPARTMENT_COLORS.admin, // #7F9B83
      status: 'เสร็จสิ้น',
      targetModule: 'admin',
      dueDate: 'เสร็จสิ้นแล้ว',
    },
    {
      id: 'task-5',
      title: 'ประสานงานเครือข่ายจิตอาสาพัฒนาพื้นที่ชายฝั่ง',
      department: 'ฝ่ายจิตอาสา',
      departmentColor: DEPARTMENT_COLORS.volunteer, // #EFBB4B
      status: 'กำลังดำเนินการ',
      targetModule: 'volunteer',
      dueDate: '18 ก.ย. 2569',
    },
  ];

  const getStatusCapsule = (status: TaskItem['status']) => {
    switch (status) {
      case 'เร่งด่วน':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>เร่งด่วน</span>
          </span>
        );
      case 'รอรายงาน':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#51439A] border border-purple-200">
            <Clock className="w-2.5 h-2.5" />
            <span>รอรายงาน</span>
          </span>
        );
      case 'กำลังดำเนินการ':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-2.5 h-2.5 text-amber-600" />
            <span>กำลังดำเนินการ</span>
          </span>
        );
      case 'เสร็จสิ้น':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>เสร็จสิ้น</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                ภารกิจสำคัญ / งานเร่งด่วน
              </h3>
              <p className="text-[11px] text-slate-500">
                รายการติดตามความคืบหน้าระดับฝ่ายงาน
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {tasks.length} งาน
          </span>
        </div>

        {/* Task List */}
        <div className="divide-y divide-slate-100 mt-2">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => navigateModule(task.targetModule)}
              className="py-3 group flex items-start justify-between gap-3 cursor-pointer hover:bg-slate-50/70 p-2 rounded-xl transition"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${task.departmentColor}18`,
                      color: task.departmentColor,
                    }}
                  >
                    {task.department}
                  </span>
                  {getStatusCapsule(task.status)}
                </div>
                <h4 className="text-xs font-semibold text-slate-800 group-hover:text-[#27265B] transition line-clamp-1 leading-snug">
                  {task.title}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <span>กำหนด:</span>
                  <span className="font-medium text-slate-600">{task.dueDate}</span>
                </p>
              </div>

              <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-[#27265B] text-slate-400 group-hover:text-white flex items-center justify-center transition flex-shrink-0 mt-2">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer View All button */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={() => navigateModule('admin', 'missions')}
          className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#27265B] hover:bg-purple-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>ดูภารกิจและข้อสั่งการทั้งหมด</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ImportantTasksPanel;
