import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileOutput,
  FileText,
  Lightbulb,
  ListChecks,
  Loader2,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  WandSparkles,
  X,
} from 'lucide-react';
import { askFO5AI } from '../../services/aiService';
import { useCollection } from '../../lib/collections';

export type SmartDepartment = 'admin' | 'relations' | 'disaster' | 'volunteer';

type SmartTask = {
  id: string;
  title: string;
  owner: string;
  due: string;
  status: 'pending' | 'doing' | 'done';
  priority: 'สูง' | 'ปานกลาง' | 'ต่ำ';
};

type SmartOpsWorkspaceProps = {
  department: SmartDepartment;
  title: string;
  subtitle: string;
  accent: string;
};


const departmentLabels: Record<SmartDepartment, string> = {
  admin: 'งานอำนวยการ',
  relations: 'งานมวลชนสัมพันธ์และประชาสัมพันธ์',
  disaster: 'งานสาธารณภัย',
  volunteer: 'งานจิตอาสาพระราชทาน',
};


const statusMap: Record<SmartTask['status'], { label: string; className: string }> = {
  pending: { label: 'รอดำเนินการ', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  doing: { label: 'กำลังดำเนินการ', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  done: { label: 'เสร็จสิ้น', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

const priorityMap: Record<SmartTask['priority'], string> = {
  สูง: 'text-rose-600',
  ปานกลาง: 'text-amber-600',
  ต่ำ: 'text-slate-500',
};

function departmentQuickPrompts(department: SmartDepartment) {
  const common = [
    'สรุปงานสำคัญที่ควรติดตามวันนี้',
    'ช่วยจัดลำดับความเร่งด่วนของงาน',
    'ร่างสรุปรายงานสำหรับผู้บังคับบัญชา',
  ];
  const special: Record<SmartDepartment, string[]> = {
    admin: ['ช่วยร่างบันทึกข้อความจากรายละเอียดนี้', 'ช่วยตรวจหนังสือรับว่าขาดข้อมูลอะไรบ้าง'],
    relations: ['ร่างข่าวประชาสัมพันธ์จากข้อมูลกิจกรรมนี้', 'สรุปแนวโน้มข่าวและประเด็นที่ควรเฝ้าระวัง'],
    disaster: ['สรุปสถานการณ์ฉุกเฉินและสิ่งที่ควรทำต่อ', 'ร่างข้อความแจ้งเตือนประชาชนแบบกระชับ'],
    volunteer: ['จัดทีมสำหรับภารกิจวันนี้จากกำลังพลที่มี', 'ร่างรายงานผลการปฏิบัติงานจากข้อมูลภารกิจ'],
  };
  return [...special[department], ...common];
}

export const SmartOpsWorkspace: React.FC<SmartOpsWorkspaceProps> = ({ department, title, subtitle, accent }) => {
  const [activeView, setActiveView] = useState<'assistant' | 'tasks' | 'automation' | 'brief'>('assistant');
  const [tasks, setTasks] = useCollection<SmartTask>(`smart.${department}`);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [provider, setProvider] = useState<'gemini' | 'local' | null>(null);
  const [busy, setBusy] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', owner: '', due: 'วันนี้', priority: 'ปานกลาง' as SmartTask['priority'] });

  const label = departmentLabels[department];
  const metrics = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    doing: tasks.filter(t => t.status === 'doing').length,
    done: tasks.filter(t => t.status === 'done').length,
    urgent: tasks.filter(t => t.priority === 'สูง' && t.status !== 'done').length,
  }), [tasks]);

  const runAI = async (text = prompt) => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const result = await askFO5AI({
        department: label,
        prompt: text,
        context: { tasks, metrics },
      });
      setResponse(result.text);
      setProvider(result.provider);
    } finally {
      setBusy(false);
    }
  };

  const updateTaskStatus = (id: string, next: SmartTask['status']) => {
    const nextTasks = tasks.map(t => (t.id === id ? { ...t, status: next } : t));
    setTasks(nextTasks);
  };

  const createTask = () => {
    if (!newTask.title.trim()) return;
    const id = `${department.toUpperCase()}-${Date.now().toString().slice(-5)}`;
    const nextTasks = [
      { id, title: newTask.title.trim(), owner: newTask.owner.trim() || 'ยังไม่ได้มอบหมาย', due: newTask.due, status: 'pending' as const, priority: newTask.priority },
      ...tasks,
    ];
    setTasks(nextTasks);
    setNewTask({ title: '', owner: '', due: 'วันนี้', priority: 'ปานกลาง' });
    setNewTaskOpen(false);
  };

  const runAutomation = (kind: string) => {
    const automationTask: SmartTask = {
      id: `${department.toUpperCase()}-AUTO-${Date.now().toString().slice(-5)}`,
      title: kind,
      owner: 'ระบบอัตโนมัติ + เจ้าหน้าที่ตรวจสอบ',
      due: 'วันนี้',
      status: 'pending',
      priority: 'สูง',
    };
    const nextTasks = [automationTask, ...tasks];
    setTasks(nextTasks);
    setActiveView('tasks');
  };

  const exportTasks = () => {
    const payload = JSON.stringify({ department: label, exportedAt: new Date().toISOString(), tasks }, null, 2);
    const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FO5-${department}-tasks.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6" style={{ background: `linear-gradient(135deg, ${accent}16, rgba(255,255,255,1) 56%)` }}>
          <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: accent }}>FO5 SMART OPERATIONS</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{title}</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-3xl">{subtitle}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 min-w-0">
              {[
                ['งานทั้งหมด', metrics.total, 'text-slate-900'],
                ['รอดำเนินการ', metrics.pending, 'text-amber-700'],
                ['กำลังทำ', metrics.doing, 'text-blue-700'],
                ['เสร็จสิ้น', metrics.done, 'text-emerald-700'],
                ['ต้องติดตาม', metrics.urgent, 'text-rose-700'],
              ].map(([k, v, c]) => (
                <div key={String(k)} className="rounded-2xl border border-slate-200 bg-white/85 px-3 py-2.5 min-w-[94px]">
                  <div className="text-[10px] text-slate-400">{k}</div>
                  <div className={`text-xl font-black mt-0.5 ${c}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4">
            {[
              ['assistant', <Bot className="w-4 h-4" />, 'AI ผู้ช่วย'],
              ['tasks', <ListChecks className="w-4 h-4" />, 'งานและ Workflow'],
              ['automation', <WandSparkles className="w-4 h-4" />, 'Automation'],
              ['brief', <FileOutput className="w-4 h-4" />, 'Daily Brief'],
            ].map(([id, icon, text]) => (
              <button key={String(id)} type="button" onClick={() => setActiveView(id as typeof activeView)} className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${activeView === id ? 'text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} style={activeView === id ? { backgroundColor: accent } : undefined}>
                {icon}
                {text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeView === 'assistant' && (
        <div className="grid xl:grid-cols-[1.15fr_.85fr] gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-900 font-black"><Sparkles className="w-5 h-5" style={{ color: accent }} /> FO5 AI Assistant</div>
                <p className="text-xs text-slate-500 mt-1">ช่วยสรุป ร่างข้อความ จัดลำดับงาน และเสนอสิ่งที่ควรตรวจสอบ โดยให้เจ้าหน้าที่เป็นผู้ยืนยันก่อนนำไปใช้จริง</p>
              </div>
              {provider && <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${provider === 'gemini' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>{provider === 'gemini' ? 'GEMINI CONNECTED' : 'OFFLINE SAFE MODE'}</span>}
            </div>
            <div className="mt-4 grid gap-2">
              {departmentQuickPrompts(department).map(q => (
                <button key={q} type="button" onClick={() => { setPrompt(q); void runAI(q); }} className="text-left px-3.5 py-3 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition flex items-center justify-between gap-3">
                  <span>{q}</span><ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={4} className="w-full bg-transparent outline-none resize-none text-sm text-slate-800 placeholder:text-slate-400" placeholder="พิมพ์คำสั่งหรืออธิบายงานที่ต้องการให้ AI ช่วย..." />
              <div className="flex items-center justify-between gap-3 mt-2">
                <span className="text-[10px] text-slate-400">AI ไม่ควรเป็นผู้ตัดสินใจแทนเจ้าหน้าที่และผู้บังคับบัญชา</span>
                <button type="button" disabled={!prompt.trim() || busy} onClick={() => void runAI()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-40">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  ส่งให้ AI
                </button>
              </div>
            </div>
            {response && <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4"><div className="text-[10px] uppercase tracking-widest text-slate-400 font-black">AI RESPONSE</div><div className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">{response}</div></div>}
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 font-black text-slate-900"><Lightbulb className="w-5 h-5 text-amber-500" /> AI Quick Insight</div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl bg-rose-50 border border-rose-100 p-3"><div className="font-bold text-rose-800">ต้องติดตาม {metrics.urgent} รายการ</div><div className="text-xs text-rose-700/80 mt-1">ควรเปิดดูงานความสำคัญสูงก่อน</div></div>
                <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3"><div className="font-bold text-blue-800">กำลังดำเนินการ {metrics.doing} รายการ</div><div className="text-xs text-blue-700/80 mt-1">ตรวจว่าแต่ละงานมีผู้รับผิดชอบและกำหนดส่งแล้ว</div></div>
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3"><div className="font-bold text-emerald-800">เสร็จสิ้น {metrics.done} รายการ</div><div className="text-xs text-emerald-700/80 mt-1">แนะนำให้จัดเก็บหลักฐานผลการปฏิบัติงาน</div></div>
              </div>
            </div>
            <div className="rounded-3xl p-5 text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${accent}, #111827)` }}>
              <div className="text-xs font-bold text-white/70 uppercase tracking-widest">Human-in-the-loop</div>
              <div className="text-lg font-black mt-1">AI ช่วยงาน แต่เจ้าหน้าที่เป็นคนอนุมัติ</div>
              <p className="text-sm text-white/75 mt-2 leading-relaxed">ทุก Draft, การจัดลำดับความสำคัญ และการเปลี่ยนสถานะสำคัญควรมีการตรวจสอบก่อนนำไปใช้จริง</p>
            </div>
          </aside>
        </div>
      )}

      {activeView === 'tasks' && (
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><div className="font-black text-slate-900 flex items-center gap-2"><ListChecks className="w-5 h-5" style={{ color: accent }} /> Workflow งานของ {label}</div><div className="text-xs text-slate-500 mt-1">ข้อมูลบันทึกในเบราว์เซอร์เครื่องนี้เพื่อให้ทดลอง workflow ได้ทันที</div></div>
            <div className="flex gap-2"><button onClick={exportTasks} className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold hover:bg-slate-50 flex items-center gap-2"><FileOutput className="w-4 h-4" /> Export</button><button onClick={() => setNewTaskOpen(true)} className="px-3 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2" style={{ backgroundColor: accent }}><Plus className="w-4 h-4" /> เพิ่มงาน</button></div>
          </div>
          <div className="divide-y divide-slate-100">
            {tasks.map(task => {
              const status = statusMap[task.status];
              return <div key={task.id} className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-mono text-slate-400">{task.id}</span><span className={`text-[10px] font-bold ${priorityMap[task.priority]}`}>● {task.priority}</span></div><div className="font-bold text-slate-800 mt-1">{task.title}</div><div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1"><span>{task.owner}</span><span className="inline-flex items-center gap-1"><CalendarClock className="w-3.5 h-3.5" /> {task.due}</span></div></div>
                <div className="flex items-center gap-2"><span className={`px-2.5 py-1.5 rounded-full border text-[10px] font-bold ${status.className}`}>{status.label}</span>{task.status !== 'done' ? <button onClick={() => updateTaskStatus(task.id, task.status === 'pending' ? 'doing' : 'done')} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[10px] font-bold">{task.status === 'pending' ? 'เริ่มงาน' : 'ปิดงาน'}</button> : <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> ปิดแล้ว</span>}</div>
              </div>;
            })}
          </div>
          {newTaskOpen && <div className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-5"><div className="flex items-center justify-between"><div className="font-black">เพิ่มงานใหม่</div><button onClick={() => setNewTaskOpen(false)}><X className="w-5 h-5" /></button></div><div className="space-y-3 mt-4"><input value={newTask.title} onChange={e => setNewTask(s => ({ ...s, title: e.target.value }))} placeholder="ชื่องาน" className="w-full border rounded-xl px-3 py-2.5 text-sm" /><input value={newTask.owner} onChange={e => setNewTask(s => ({ ...s, owner: e.target.value }))} placeholder="ผู้รับผิดชอบ" className="w-full border rounded-xl px-3 py-2.5 text-sm" /><div className="grid grid-cols-2 gap-3"><input value={newTask.due} onChange={e => setNewTask(s => ({ ...s, due: e.target.value }))} className="w-full border rounded-xl px-3 py-2.5 text-sm" /><select value={newTask.priority} onChange={e => setNewTask(s => ({ ...s, priority: e.target.value as SmartTask['priority'] }))} className="w-full border rounded-xl px-3 py-2.5 text-sm"><option>สูง</option><option>ปานกลาง</option><option>ต่ำ</option></select></div></div><button onClick={createTask} disabled={!newTask.title.trim()} className="w-full mt-4 px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold disabled:opacity-40">บันทึกงาน</button></div></div>}
        </section>
      )}

      {activeView === 'automation' && (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { icon: FileText, title: 'สร้าง Task จากเอกสาร', desc: 'เมื่อได้รับหนังสือ/รายงาน ให้เตรียมรายการงานและผู้รับผิดชอบ', action: 'สร้างคิวตรวจเอกสาร' },
            { icon: AlertTriangle, title: 'เตือนงานเสี่ยงล่าช้า', desc: 'สร้างงานเฝ้าระวังสำหรับรายการความสำคัญสูง', action: 'เปิด Watchlist' },
            { icon: ClipboardCheck, title: 'สร้าง Checklist', desc: 'สร้างรายการตรวจสอบมาตรฐานสำหรับงานซ้ำ ๆ', action: 'สร้าง Checklist' },
            { icon: RefreshCw, title: 'สร้าง Daily Review', desc: 'ตั้งชุดงานสำหรับตรวจตอนเช้าและปิดงานตอนเย็น', action: 'สร้าง Daily Review' },
          ].map(item => { const Icon = item.icon; return <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col"><div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center"><Icon className="w-5 h-5" style={{ color: accent }} /></div><div className="font-black mt-4">{item.title}</div><div className="text-xs text-slate-500 mt-1 flex-1">{item.desc}</div><button onClick={() => runAutomation(item.action)} className="mt-5 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-white" style={{ backgroundColor: accent }}>ทดลอง Automation</button></div>; })}
        </div>
      )}

      {activeView === 'brief' && (
        <div className="grid xl:grid-cols-[1fr_.7fr] gap-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"><div className="text-[10px] uppercase tracking-widest font-black" style={{ color: accent }}>DAILY EXECUTIVE BRIEF</div><h3 className="text-2xl font-black mt-1">{label} — วันนี้</h3><div className="grid sm:grid-cols-3 gap-3 mt-5"><div className="rounded-2xl bg-rose-50 border border-rose-100 p-4"><div className="text-xs text-rose-600">ต้องติดตาม</div><div className="text-3xl font-black text-rose-700 mt-1">{metrics.urgent}</div></div><div className="rounded-2xl bg-amber-50 border border-amber-100 p-4"><div className="text-xs text-amber-600">รอดำเนินการ</div><div className="text-3xl font-black text-amber-700 mt-1">{metrics.pending}</div></div><div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4"><div className="text-xs text-emerald-600">ปิดงานแล้ว</div><div className="text-3xl font-black text-emerald-700 mt-1">{metrics.done}</div></div></div><div className="mt-5 space-y-3">{tasks.filter(t => t.status !== 'done').slice(0, 5).map(task => <div key={task.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50"><Target className="w-4 h-4 mt-0.5" style={{ color: accent }} /><div><div className="text-sm font-bold text-slate-800">{task.title}</div><div className="text-[11px] text-slate-500 mt-1">{task.owner} • {task.due}</div></div></div>)}</div></section><aside className="rounded-3xl p-6 text-white" style={{ background: `linear-gradient(145deg, ${accent}, #0f172a)` }}><div className="text-xs font-bold text-white/70">NEXT BEST ACTION</div><div className="text-2xl font-black mt-1">เริ่มจากงานความสำคัญสูง</div><p className="text-sm text-white/75 mt-2 leading-relaxed">เปิดรายการที่มีความเสี่ยงสูง ตรวจผู้รับผิดชอบและกำหนดเวลา จากนั้นให้ AI ช่วยร่างสรุปผลเพื่อให้เจ้าหน้าที่ตรวจ</p><button onClick={() => setActiveView('tasks')} className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold">เปิดรายการงาน <ArrowRight className="w-4 h-4" /></button></aside></div>
      )}
    </div>
  );
};
