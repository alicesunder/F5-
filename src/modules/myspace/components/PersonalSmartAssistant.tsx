import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldCheck,
  HelpCircle,
  Clock,
  Wallet,
  Coins,
  Calendar,
  Building,
  ArrowUpRight,
} from 'lucide-react';
import {
  CHAIROT_POLICE_RECORD,
  GPF_TOTAL_ACCUMULATED,
  INITIAL_PERSONAL_ALLOWANCES,
  TODAY_SCHEDULE_ITEMS,
} from '../../../data/personalData';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'เดือนนี้ฉันได้เงินเท่าไร?',
  'ฉันมีภารกิจอะไรวันนี้?',
  'มีเบี้ยเลี้ยงรายการไหนรอจ่าย?',
  'ฉันมีรายงานอะไรที่ต้องส่ง?',
  'กบข. ของฉันล่าสุดเป็นอย่างไร?',
];

export const PersonalSmartAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `สวัสดีครับ ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์ ผมคือผู้ช่วยอัจฉริยะส่วนบุคคล (My Space Assistant) ยินดีอำนวยความสะดวกในการค้นหาและตรวจสอบข้อมูลเงินเดือน ภารกิจ เบี้ยเลี้ยง กบข. หรือสิทธิกำลังพลของท่านครับ`,
      timestamp: '08:30',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (queryText?: string) => {
    const query = (queryText || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('เงิน') || q.includes('เงินเดือน') || q.includes('สลิป') || q.includes('เท่าไร')) {
        reply = `สรุปยอดเงินเดือนประจำเดือนสิงหาคม 2569 (ป.1 ขั้น 12):
• เงินเดือนขั้นต้น: ฿13,310.00
• เงินเพิ่มการครองชีพชั่วคราว: ฿2,500.00
• รวมรายรับทั้งสิ้น: ฿15,810.00
• รายการหัก: กบข. 3% (฿399.30) + ฌาปนกิจ ตร. (฿300.00) = ฿699.30
• ยอดรับสุทธิเข้าบัญชีกรุงไทย: ฿15,110.70`;
      } else if (q.includes('เบี้ยเลี้ยง') || q.includes('ขั้นตอนไหน') || q.includes('เบิก') || q.includes('รอจ่าย')) {
        reply = `สถานะเบี้ยเลี้ยงปฏิบัติการสนามของท่าน:
1. ภารกิจจัดทำสื่อมัลติมีเดียครบรอบ บช.ตชด. (฿480.00) → [อนุมัติแล้ว - รอจ่ายในรอบโอนถัดไป]
2. ภารกิจช่วยเหลือผู้ประสบภัยดินโคลนถล่ม กก.ตชด.32 (฿1,080.00) → [กำลังตรวจสอบฎีกา]
3. ภารกิจนิทรรศการมวลชนสัมพันธ์และจิตอาสา (฿480.00) → [ส่งเรื่องแล้ว]
4. ภารกิจ กก.ตชด.31 พิษณุโลก (฿720.00) → [จ่ายเงินเรียบร้อยแล้ว]`;
      } else if (q.includes('ภารกิจ') || q.includes('ถัดไป') || q.includes('นัดหมาย') || q.includes('วันนี้')) {
        reply = `กำหนดการและภารกิจของท่านในวันนี้:
• 08:30 น.: เคารพธงชาติ ชี้แจงภารกิจประจำวัน ฝอ.๕ [เสร็จสิ้น]
• 10:00 น.: รวบรวมข้อมูลข่าวสารและภาพถ่าย กก.ตชด.11-44 [เสร็จสิ้น]
• 13:30 น. (กำหนดส่ง 14:00 น.): ส่งร่างข่าวสารและอินโฟกราฟิกสถานการณ์น้ำท่วม [อยู่ระหว่างดำเนินการ]
• 15:00 น.: ตรวจสอบเอกสารฎีกาและเบี้ยเลี้ยงประจำรอบเดือนกันยายน
• 16:30 น.: สรุปรายงานยอดภารกิจและส่งต่อเวรประจำวัน (ผนวก ข)`;
      } else if (q.includes('รายงาน') || q.includes('ส่ง')) {
        reply = `ท่านมีรายงานรอตรวจ/ส่งมอบ 1 รายการ:
• "ร่างข่าวสารและอินโฟกราฟิกสรุปสถานการณ์น้ำท่วม กก.ตชด.31"
• กำหนดส่ง: วันนี้ เวลาไม่เกิน 14:00 น.
• ผู้รับมอบหมาย: พ.ต.ท.หญิง นภัสวรรณ รักษ์ธรรม (หน.งานประชาสัมพันธ์ ฝอ.๕)`;
      } else if (q.includes('กบข') || q.includes('ก.บ.ข.') || q.includes('สะสม')) {
        reply = `ข้อมูลกองทุนบำเหน็จบำนาญข้าราชการ (กบข.) สมาชิกเลขที่ ${GPF_TOTAL_ACCUMULATED.memberNumber}:
• ยอดเงินรวมในบัญชีทั้งสิ้น: ฿${GPF_TOTAL_ACCUMULATED.grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
• เงินสะสมของสมาชิก (3%): ฿${GPF_TOTAL_ACCUMULATED.memberAccumulated.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
• เงินสมทบจากรัฐบาล (3%): ฿${GPF_TOTAL_ACCUMULATED.govContribution.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
• เงินชดเชยจากรัฐ: ฿${GPF_TOTAL_ACCUMULATED.govCompensation.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
• ผลประโยชน์ตอบแทน: ฿${GPF_TOTAL_ACCUMULATED.investmentReturn.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
• แผนการลงทุนปัจจุบัน: ${GPF_TOTAL_ACCUMULATED.planType}`;
      } else {
        reply = `ข้อมูลเกี่ยวกับ "${query}" ได้รับการบันทึกไว้ในฐานข้อมูลบุคคลส่วนบุคคลของ ส.ต.อ.ชัยโรจน์ สหัสภูริพัฒน์ ฝอ.๕ บช.ตชด. ท่านสามารถเลือกดูรายละเอียดฉบับสมบูรณ์ได้จากแถบเมนูด้านบนครับ`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 400);
  };

  return (
    <div className="rounded-3xl p-5 sm:p-7 bg-white/90 dark:bg-[#151A22]/90 border border-slate-200/80 dark:border-white/10 shadow-[0_10px_30px_rgba(30,25,50,0.06)] backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            {/* Subtle animated glow on icon */}
            <div className="relative">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#2583D8] to-[#5B2A86] text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-[#2583D8] dark:text-blue-400 uppercase tracking-wider">
              ระบบช่วยเหลือส่วนบุคคล
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            ผู้ช่วยของฉัน AI (Personal Assistant)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สืบค้นข้อมูลเงินเดือน เบี้ยเลี้ยง นัดหมาย ตารางภารกิจ และ กบข. โดยตรงจากฐานข้อมูลจริง
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>ฐานข้อมูลรับรอง POLIS</span>
          </span>
        </div>
      </div>

      {/* Suggested Questions (Section 20 & 21) */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          คำถามที่ถามบ่อยเกี่ยวกับตัวคุณ:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-500/15 text-slate-700 dark:text-slate-300 hover:text-[#2583D8] dark:hover:text-blue-400 text-xs font-medium border border-slate-200/80 dark:border-white/5 transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Panel */}
      <div className="h-72 overflow-y-auto p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-3">
        {messages.map(msg => {
          const isAi = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#2583D8] to-[#5B2A86] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                  isAi
                    ? 'bg-white dark:bg-[#1A1F29] border border-slate-200/70 dark:border-white/10 text-slate-800 dark:text-slate-200 shadow-2xs'
                    : 'bg-[#2583D8] text-white font-medium shadow-2xs'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    isAi ? 'text-slate-400' : 'text-blue-100'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-[#2583D8] animate-spin" />
            <span>กำลังตรวจสอบฐานข้อมูล...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="พิมพ์คำถามเกี่ยวกับเงินเดือน ภารกิจ หรือเบี้ยเลี้ยง..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1A1F29] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2583D8]/30 focus:border-[#2583D8]"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="px-4 py-2.5 rounded-2xl bg-[#2583D8] hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>ส่ง</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
