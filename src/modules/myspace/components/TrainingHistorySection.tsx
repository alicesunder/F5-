import React from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Building,
  FileBadge,
  TrendingUp,
  Target,
} from 'lucide-react';
import { TRAINING_COURSES } from '../../../data/personalData';

export const TrainingHistorySection: React.FC = () => {
  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              การพัฒนาศักยภาพข้าราชการตำรวจ
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            การฝึกอบรมและผลงานของฉัน (Training & Performance)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ประวัติการฝึกอบรม วุฒิบัตรทางวิชาชีพ และสถิติการปฏิบัติงานประจำปี
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-xs font-bold text-purple-700 dark:text-purple-300">
            ผ่านการอบรม 3 จาก 4 หลักสูตร
          </span>
        </div>
      </div>

      {/* KPI Performance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mission Completion */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>ภารกิจสำเร็จลุล่วง</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            100%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            18 ภารกิจตลอดปีงบประมาณ
          </div>
        </div>

        {/* Timeliness */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>ส่งรายงานตรงเวลา</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            96.5%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            รายงานข่าวและประชาสัมพันธ์
          </div>
        </div>

        {/* Training Hours */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>ชั่วโมงการฝึกอบรม</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            68 ชม.
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            เกณฑ์ขั้นต่ำ ก.ตร. 50 ชม./ปี
          </div>
        </div>

        {/* Evaluation Tier */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>ระดับการประเมินรอบล่าสุด</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            ดีเด่น
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            รอบ เม.ย. 2569 (เลื่อน 0.5 ขั้น)
          </div>
        </div>
      </div>

      {/* Training Courses List */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
          รายการหลักสูตรการฝึกอบรม
        </div>

        <div className="space-y-3">
          {TRAINING_COURSES.map(course => {
            const isCompleted = course.status === 'สำเร็จ';

            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#1A1F29]/60 border border-slate-200/80 dark:border-white/10 hover:border-purple-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {course.status}
                    </span>
                    {course.certificateNumber && (
                      <span className="text-[11px] font-mono text-slate-400">
                        เลขที่: {course.certificateNumber}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {course.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      {course.organizer}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {course.startDate} - {course.endDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {course.location}
                    </span>
                  </div>
                </div>

                <div className="self-end sm:self-center">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <FileBadge className="w-4 h-4" />
                      วุฒิบัตรรับรอง
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                      <Clock className="w-4 h-4" />
                      กำลังดำเนินการ
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
