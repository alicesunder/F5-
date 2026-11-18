import React, { useState, useEffect } from 'react';
import {
  Shield,
  Clock,
  Radio,
  Camera,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  Users,
  Eye,
} from 'lucide-react';
import { usePRIntel } from '../../context/PRIntelContext';
import {
  formatRelativeTime,
  formatNumber,
  getSentimentBadge,
  getCategoryBadge,
} from '../../utils/formatters';

export const PRDashboardView: React.FC = () => {
  const {
    posts,
    pages,
    keywords,
    alerts,
    missions,
    documents,
    setSelectedPost,
    setSelectedMission,
    setSelectedDocument,
    setActivePRView,
    setIsAddMissionOpen,
  } = usePRIntel();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayIso = new Date().toISOString().slice(0, 10);
  const todayThai = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  const activeMissionCount = missions.filter(m => m.status !== 'completed').length;
  const doneMissionCount = missions.filter(m => m.status === 'completed').length;
  const pendingDocCount = documents.filter(d => d.status === 'pending' || d.status === 'review_required').length;
  const openAlertCount = alerts.filter(a => !a.acknowledged).length;

  const todayMissions = missions
    .filter((m) => m.date === todayIso || m.status === 'in_progress')
    .slice(0, 5);

  const pendingDocs = documents
    .filter((d) => d.status === 'pending' || d.status === 'review_required')
    .slice(0, 5);

  const recentScans = documents.slice(0, 4);

  const topPages = [...pages]
    .sort((a, b) => b.bppPostsToday - a.bppPostsToday)
    .slice(0, 5);

  const topKeywords = [...keywords]
    .sort((a, b) => b.mentionCount - a.mentionCount)
    .slice(0, 5);

  const recentPosts = [...posts].slice(0, 6);
  const recentAlerts = alerts.slice(0, 4);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Header & Command Center Bar */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-50 border border-blue-200/80">
              <Shield className="w-5 h-5 text-blue-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#1E1B4B] tracking-tight">ภาพรวมศูนย์ปฏิบัติการ PR</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">ข่าวที่ติดตาม ภารกิจภาพถ่าย และเอกสารรอตรวจ</p>
            </div>
          </div>
        </div>

        {/* Date, Live Clock & Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-slate-50 border border-slate-200/80 px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs">
            <CalendarIcon className="w-4 h-4 text-[#27265B]" />
            <span className="text-xs font-semibold text-slate-700">{todayThai}</span>
            <span className="text-slate-300">|</span>
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono font-bold text-[#1E1B4B]">
              {currentTime} น.
            </span>
          </div>
          <button
            onClick={() => setIsAddMissionOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#27265B] hover:bg-[#1E1B4B] text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <Camera className="w-3.5 h-3.5 text-pink-300" />
            <span>+ มอบหมายงานภาพถ่าย</span>
          </button>
          <button
            onClick={() => setActivePRView('scanner')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 rounded-xl text-xs font-semibold transition"
          >
            <FileText className="w-3.5 h-3.5 text-pink-700" />
            <span>สแกนเอกสาร AI</span>
          </button>
        </div>
      </div>

      {/* 2. KPI จากข้อมูลจริงเท่านั้น */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => setActivePRView('latest')}
          className="text-left bg-white border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-xs cursor-pointer transition"
        >
          <div className="text-[12px] font-semibold text-slate-500">โพสต์ที่ติดตาม</div>
          <div className="text-2xl font-black tracking-tight mt-1 text-[#1E1B4B]">{formatNumber(posts.length)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">จากเพจที่ติดตาม {pages.length} เพจ</div>
        </button>
        <button
          type="button"
          onClick={() => setActivePRView('photo-missions')}
          className="text-left bg-white border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-xs cursor-pointer transition"
        >
          <div className="text-[12px] font-semibold text-slate-500">ภารกิจภาพถ่าย</div>
          <div className="text-2xl font-black tracking-tight mt-1 text-pink-700">{formatNumber(activeMissionCount)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">กำลังดำเนินการ</div>
        </button>
        <button
          type="button"
          onClick={() => setActivePRView('completed')}
          className="text-left bg-white border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-xs cursor-pointer transition"
        >
          <div className="text-[12px] font-semibold text-slate-500">ส่งมอบแล้ว</div>
          <div className="text-2xl font-black tracking-tight mt-1 text-emerald-600">{formatNumber(doneMissionCount)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">ภารกิจที่เสร็จสิ้น</div>
        </button>
        <button
          type="button"
          onClick={() => setActivePRView('pending-docs')}
          className="text-left bg-white border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-xs cursor-pointer transition"
        >
          <div className="text-[12px] font-semibold text-slate-500">เอกสารรอตรวจ</div>
          <div className="text-2xl font-black tracking-tight mt-1 text-amber-600">{formatNumber(pendingDocCount)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">รอพิจารณา</div>
        </button>
        <button
          type="button"
          onClick={() => setActivePRView('keywords')}
          className="text-left bg-white border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-xs cursor-pointer transition"
        >
          <div className="text-[12px] font-semibold text-slate-500">คำสำคัญที่ติดตาม</div>
          <div className="text-2xl font-black tracking-tight mt-1 text-[#27265B]">{formatNumber(keywords.length)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Keyword ที่ตั้งไว้</div>
        </button>
        <button
          type="button"
          onClick={() => setActivePRView('alerts')}
          className="text-left bg-white border border-slate-200/80 p-3.5 rounded-2xl hover:border-blue-400 hover:shadow-xs cursor-pointer transition"
        >
          <div className="text-[12px] font-semibold text-slate-500">แจ้งเตือนค้าง</div>
          <div className="text-2xl font-black tracking-tight mt-1 text-rose-600">{formatNumber(openAlertCount)}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">ยังไม่รับทราบ</div>
        </button>
      </div>

      {/* 3. Command Center Multi-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Media Monitoring (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Widget 1: LIVE MEDIA MONITOR */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Live Media Monitor
                </span>
                <span className="text-[10px] text-slate-500">(กระแสสื่อและข่าวล่าสุด)</span>
              </div>
              <button
                onClick={() => setActivePRView('latest')}
                className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold flex items-center gap-1"
              >
                <span>ดูทั้งหมด ({posts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {recentPosts.map((post) => {
                const sentiment = getSentimentBadge(post.sentiment);
                const categoryClass = getCategoryBadge(post.category);
                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="p-4 hover:bg-slate-50/80 cursor-pointer transition flex flex-col gap-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={post.pageAvatar}
                          alt={post.pageName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {post.pageName}
                        </span>
                        {post.isVerified && (
                          <span className="text-[10px] text-blue-500">✓</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {formatRelativeTime(post.minutesAgo)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed group-hover:text-pink-900 transition">
                      {post.content}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${sentiment.bg} ${sentiment.text}`}>
                          {sentiment.label}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${categoryClass}`}>
                          {post.category}
                        </span>
                        {post.bppRelated && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-50 text-pink-800 border border-pink-200 font-semibold">
                            ตชด.เกี่ยวข้อง
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ถูกใจ {formatNumber(post.engagement.likes)} • แชร์ {formatNumber(post.engagement.shares)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 2: TOP MONITORED PAGES */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#27265B]" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Top Monitored Pages
                </span>
                <span className="text-[10px] text-slate-500">(เพจที่มีเนื้อหาเกี่ยวกับ ตชด. สูงสุด)</span>
              </div>
              <button
                onClick={() => setActivePRView('pages')}
                className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold flex items-center gap-1"
              >
                <span>ดูทั้งหมด ({pages.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {topPages.map((page, index) => (
                <div
                  key={page.id}
                  onClick={() => setActivePRView('pages')}
                  className="p-3.5 hover:bg-slate-50/80 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-center text-xs font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                    <img
                      src={page.avatar}
                      alt={page.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{page.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        ผู้ติดตาม {formatNumber(page.followers)} • หมวด {page.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-50 text-pink-800 text-xs font-bold border border-pink-200">
                      {page.bppPostsToday} โพสต์ ตชด.
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 3: KEYWORD TREND */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pink-600" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Keyword Trends
                </span>
                <span className="text-[10px] text-slate-500">(คำค้นยอดนิยม)</span>
              </div>
              <button
                onClick={() => setActivePRView('keywords')}
                className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold"
              >
                ดูทั้งหมด ({keywords.length})
              </button>
            </div>
            <div className="space-y-3">
              {topKeywords.map((kw) => (
                <div key={kw.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">#{kw.keyword}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        +{kw.trendPercentage}%
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {kw.mentionCount} ครั้ง
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (kw.mentionCount / 350) * 100)}%`,
                        backgroundColor: kw.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PR Operations & Document Intelligence (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Widget 4: TODAY'S PHOTO MISSIONS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#27265B]" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Today's Photo Missions
                </span>
                <span className="text-[10px] text-slate-500">(ภารกิจบันทึกภาพประจำวัน)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddMissionOpen(true)}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-[#27265B] text-white font-semibold hover:bg-[#1E1B4B] transition"
                >
                  + เพิ่มงาน
                </button>
                <button
                  onClick={() => setActivePRView('photo-missions')}
                  className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold flex items-center gap-1"
                >
                  <span>ทั้งหมด ({missions.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {todayMissions.map((mission) => {
                const isComp = mission.status === 'completed';
                const isProg = mission.status === 'in_progress';
                const progress =
                  mission.deliverablesRequired > 0
                    ? Math.round(
                        (mission.deliverablesDelivered / mission.deliverablesRequired) * 100
                      )
                    : 0;
                return (
                  <div
                    key={mission.id}
                    onClick={() => {
                      setSelectedMission(mission);
                      setActivePRView('photo-missions');
                    }}
                    className="p-4 hover:bg-slate-50/80 cursor-pointer transition space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-[#27265B] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {mission.id}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate group-hover:text-pink-700">
                          {mission.title}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                          isComp
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : isProg
                            ? 'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {isComp ? 'เสร็จสิ้น' : isProg ? 'กำลังดำเนินการ' : 'รอดำเนินการ'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
                      <span>
                        เวลา {mission.startTime} - {mission.endTime} • {mission.location} ({mission.province})
                      </span>
                      <span className="font-medium text-slate-700">
                        ผู้ควบคุม: {mission.personnelRank} {mission.personnelName}
                      </span>
                    </div>
                    {/* Deliverables Progress */}
                    <div className="flex items-center gap-2 pt-0.5">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isComp ? 'bg-emerald-500' : 'bg-pink-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {mission.deliverablesDelivered}/{mission.deliverablesRequired} ภาพ ({progress}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 5: DOCUMENTS WAITING FOR REVIEW */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Documents Waiting For Review
                </span>
                <span className="text-[10px] text-slate-500">(เอกสารสารบรรณรอตรวจ)</span>
              </div>
              <button
                onClick={() => setActivePRView('pending-docs')}
                className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold flex items-center gap-1"
              >
                <span>ดูทั้งหมด ({documents.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocument(doc);
                    setActivePRView('ocr-results');
                  }}
                  className="p-3.5 hover:bg-slate-50/80 cursor-pointer transition flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[11px] font-bold text-slate-700">
                        {doc.docNumber}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {doc.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold truncate group-hover:text-pink-700">
                      {doc.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      จาก: {doc.sender} • {doc.displayDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        doc.status === 'review_required'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {doc.status === 'review_required' ? 'ต้องตรวจทาน' : 'รอตรวจสอบ'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      คะแนน AI: {doc.aiScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 6: RECENT DOCUMENT SCANS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  Recent AI Document Scans
                </span>
                <span className="text-[10px] text-slate-400">(ผลตรวจความสมบูรณ์ล่าสุด)</span>
              </div>
              <button
                onClick={() => setActivePRView('scanner')}
                className="text-[11px] text-pink-700 hover:text-pink-800 font-semibold"
              >
                เปิด AI Scanner
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recentScans.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDocument(doc);
                    setActivePRView('ocr-results');
                  }}
                  className="p-3 border border-slate-200/80 rounded-xl hover:border-pink-400 cursor-pointer transition bg-slate-50/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#27265B] truncate">
                      {doc.docNumber}
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                      {doc.aiScore}/100
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">
                    {doc.title}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                    ลงชื่อ: {doc.signatory}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 7: AI CRITICAL ALERTS */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-[#1E1B4B] uppercase tracking-wider">
                  AI Critical Alerts
                </span>
              </div>
              <button
                onClick={() => setActivePRView('alerts')}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
              >
                ศูนย์เตือนภัย ({alerts.length})
              </button>
            </div>
            <div className="space-y-2">
              {recentAlerts.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => setActivePRView('alerts')}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition flex items-start gap-2.5"
                >
                  <span className="mt-1 w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse"></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">{alt.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatRelativeTime(alt.minutesAgo)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">{alt.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
