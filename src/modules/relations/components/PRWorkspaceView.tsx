import React, { useMemo } from 'react';
import {
  FileText,
  Sparkles,
  TrendingUp,
  Camera,
  CheckCircle2,
  Clock3,
  ImageIcon,
  BarChart3,
  FileSearch2,
  FileBarChart2,
  UsersRound,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { PRViewId } from './PRMonitoringSidebar';
import { LineReportsView } from '../../../components/line/LineReportsView';
import { NewsItem, MediaItem, RelationsStats } from '../types';
import { SmartOpsWorkspace } from '../../../components/smart/SmartOpsWorkspace';
import { usePRIntel } from '../context/PRIntelContext';

// Intel Views
import { PRDashboardView } from './intel/PRDashboardView';
import { PRLatestPostsView } from './intel/PRLatestPostsView';
import { PRPagesView } from './intel/PRPagesView';
import { PRKeywordsView } from './intel/PRKeywordsView';
import { PRAlertsView } from './intel/PRAlertsView';
import { PRPhotoMissionsView } from './intel/PRPhotoMissionsView';
import { PRPersonnelView } from './intel/PRPersonnelView';
import { PRLocationsMapView } from './intel/PRLocationsMapView';
import { PRDocumentScannerView } from './intel/PRDocumentScannerView';
import { PRDocumentsListView } from './intel/PRDocumentsListView';

// Modals
import { PRPostDetailModal } from './modals/PRPostDetailModal';
import { PRMissionDetailModal } from './modals/PRMissionDetailModal';
import { PRDocumentDetailModal } from './modals/PRDocumentDetailModal';
import { PRAddMissionModal } from './modals/PRAddMissionModal';
import { PRAddKeywordModal } from './modals/PRAddKeywordModal';
import { PRAddPageModal } from './modals/PRAddPageModal';
import { FacebookConnectCard } from './intel/FacebookConnectCard';
import { PRPageMonitorView } from './intel/PRPageMonitorView';

interface Props {
  view: PRViewId;
  newsList: NewsItem[];
  mediaList: MediaItem[];
  stats: RelationsStats;
  onSelectNews: (news: NewsItem) => void;
}

export const PRWorkspaceView: React.FC<Props> = ({
  view,
  newsList,
  mediaList,
  stats,
  onSelectNews,
}) => {
  const { posts, pages, missions, documents, setActivePRView } = usePRIntel();

  const publishedNews = useMemo(
    () => newsList.filter((n) => n.status === 'Published'),
    [newsList]
  );

  return (
    <div className="space-y-6">
      {/* 1. Main View Routing */}
      {view === 'dashboard' && <PRDashboardView />}

      {view === 'line-reports' && <LineReportsView dept="relations" />}

      {view === 'facebook' && (
        <div className="space-y-5">
          <FacebookConnectCard />
          <PRLatestPostsView />
        </div>
      )}
      {view === 'latest' && <PRLatestPostsView />}
      {view === 'page-monitor' && <PRPageMonitorView />}

      {view === 'pages' && <PRPagesView />}

      {view === 'keywords' && <PRKeywordsView />}

      {view === 'alerts' && <PRAlertsView />}

      {view === 'photo-missions' && <PRPhotoMissionsView />}

      {view === 'calendar' && <PRPhotoMissionsView defaultTab="calendar" />}

      {view === 'staff' && <PRPersonnelView />}

      {view === 'locations' && <PRLocationsMapView />}

      {view === 'completed' && <PRPhotoMissionsView defaultStatusFilter="completed" />}

      {view === 'scanner' && <PRDocumentScannerView />}

      {view === 'ocr-results' && (
        <PRDocumentsListView
          title="ผลการตรวจสอบความสอดคล้องและคะแนน OCR (AI Quality Score)"
          description="ผลการตรวจจับตัวอักษรไทย (OCR) และคะแนนตาม 12 กฎระเบียบสำนักนายกรัฐมนตรีฯ"
          statusFilterDefault="all"
        />
      )}

      {view === 'pending-docs' && (
        <PRDocumentsListView
          title="เอกสารรอตรวจสอบและต้องตรวจทาน (Pending & Review Required)"
          description="เอกสารราชการที่ระบบ AI ตรวจพบข้อสังเกต หรืออยู่ระหว่างรอบุคลากรสารบรรณอนุมัติ"
          statusFilterDefault="review_required"
        />
      )}

      {view === 'doc-history' && (
        <PRDocumentsListView
          title="ทะเบียนเอกสารสารบรรณดิจิทัลทั้งหมด (Document Registry)"
          description="คลังเอกสารราชการ คำสั่ง บันทึกข้อความ ข่าวแจก และแผนปฏิบัติการ"
          statusFilterDefault="all"
        />
      )}

      {view === 'smart-ops' && (
        <SmartOpsWorkspace
          department="relations"
          title="AI & Workflow Center"
          subtitle="ผู้ช่วยงานประชาสัมพันธ์ ตั้งแต่ Monitoring ข่าว ร่างข่าว จัดคิวสื่อ ติดตามภารกิจ และสรุปผล"
          accent="#193779"
        />
      )}

      {/* Pages Comparison View */}
      {view === 'compare' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <h1 className="text-xl font-black text-[#1E1B4B]">
              เปรียบเทียบการเข้าถึงและ Sentiment ของเพจ (Page Comparison)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              วิเคราะห์การเติบโตและการมีส่วนร่วมของสื่อสังคมออนไลน์ในสังกัดและเครือข่าย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pages.map((p, i) => (
              <div
                key={p.id}
                className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    อันดับ {i + 1}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 font-bold">
                    {p.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{p.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{p.handle}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="text-2xl font-black text-[#1E1B4B] font-mono">
                    {p.followers.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase">ผู้ติดตาม (Followers)</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">ส่วนแบ่งการเข้าถึง</span>
                    <span className="font-bold text-slate-700 font-mono">
                      {Math.max(25, 95 - i * 18)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#27265B] rounded-full"
                      style={{ width: `${Math.max(25, 95 - i * 18)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI News Analytics View */}
      {view === 'ai-news' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <h1 className="text-xl font-black text-[#1E1B4B]">
              ระบบประมวลผลและวิเคราะห์ข่าวกรองสื่อด้วย AI (AI News Intelligence)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              คัดกรองสัญญาณข่าว วิเคราะห์อารมณ์สังคม (Sentiment) และสร้างข้อเสนอแนะเชิงยุทธศาสตร์
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <Sparkles className="w-4 h-4 text-pink-600" />
                <span>คิวบทสรุปประเด็นข่าวล่าสุด (AI Automated Digest)</span>
              </div>

              <div className="space-y-3">
                {posts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{p.pageName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          p.sentiment === 'positive'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.sentiment === 'negative'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        Sentiment: {p.sentiment === 'positive' ? 'บวก (+)' : p.sentiment === 'negative' ? 'ลบ (-)' : 'เป็นกลาง'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{p.content}</p>
                    <div className="text-[11px] text-pink-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>ข้อสังเกต AI: ข่าวมีแนวโน้มการตอบรับที่ดีจากประชาชนในพื้นที่</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-gradient-to-br from-[#27265B] to-[#1E1B4B] text-white p-6 rounded-2xl shadow-xs space-y-3">
                <span className="text-[10px] uppercase tracking-wider text-pink-300 font-bold">
                  AI Strategic Advisory
                </span>
                <h3 className="text-base font-black">ข้อเสนอแนะเชิงรุก ฝอ.5</h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  สถิติแสดงให้เห็นว่า โพสต์ข่าวเกี่ยวกับความช่วยเหลือผู้ประสบภัยและกิจกรรมโรงเรียน ตชด.
                  มีอัตรา Engagement สูงกว่าข่าวพิธีการถึง 3.4 เท่า ควรเร่งส่งมอบภาพภารกิจภาคสนามและตัดคลิป Reels/Shorts ภายใน 2 ชั่วโมงหลังเกิดเหตุ
                </p>
                <button
                  onClick={() => setActivePRView('photo-missions')}
                  className="w-full py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  จัดคิวภารกิจภาพถ่ายภาคสนาม
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reports */}
      {view === 'news-report' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <h1 className="text-xl font-black text-[#1E1B4B]">รายงานสรุปข่าวสารและการเผยแพร่ (News Report)</h1>
            <p className="text-xs text-slate-500 mt-0.5">สถิติการผลิตข่าว ยอดผู้เข้าชม และแนวโน้มความสนใจ</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ข่าวที่เผยแพร่แล้ว</span>
              <p className="text-2xl font-black text-[#1E1B4B] mt-1">{stats.publishedCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ฉบับร่างรอตรวจ</span>
              <p className="text-2xl font-black text-amber-700 mt-1">{stats.draftCount}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ยอดผู้ชมรวม</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">สื่อดิจิทัลในคลัง</span>
              <p className="text-2xl font-black text-pink-700 mt-1">{stats.totalMedia}</p>
            </div>
          </div>
        </div>
      )}

      {view === 'photo-report' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <h1 className="text-xl font-black text-[#1E1B4B]">รายงานผลการปฏิบัติงานภาพถ่าย (Photo Operations Report)</h1>
            <p className="text-xs text-slate-500 mt-0.5">สถิติภารกิจและการส่งมอบภาพถ่ายของกำลังพล ตชด.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ภารกิจทั้งหมด</span>
              <p className="text-2xl font-black text-[#1E1B4B] mt-1">{missions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">เสร็จสิ้นสมบูรณ์</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {missions.filter((m) => m.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ภาพที่ส่งมอบแล้ว</span>
              <p className="text-2xl font-black text-pink-700 mt-1">
                {missions.reduce((acc, m) => acc + m.deliverablesDelivered, 0)} ภาพ
              </p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ความเร็วการส่งมอบเฉลี่ย</span>
              <p className="text-2xl font-black text-blue-700 mt-1">2.4 ชั่วโมง</p>
            </div>
          </div>
        </div>
      )}

      {view === 'doc-report' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <h1 className="text-xl font-black text-[#1E1B4B]">รายงานการตรวจสอบเอกสารสารบรรณ (Compliance Report)</h1>
            <p className="text-xs text-slate-500 mt-0.5">การตรวจสอบความถูกต้อง 12 กฎระเบียบสารบรรณ พ.ศ. 2526</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">เอกสารในระบบ</span>
              <p className="text-2xl font-black text-[#1E1B4B] mt-1">{documents.length} ฉบับ</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">อัตราผ่านเกณฑ์</span>
              <p className="text-2xl font-black text-emerald-700 mt-1">94.2%</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">คะแนนเฉลี่ย AI</span>
              <p className="text-2xl font-black text-pink-700 mt-1">91.8 / 100</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">ข้อสังเกตที่พบบ่อย</span>
              <p className="text-sm font-bold text-slate-800 mt-2">ระยะย่อหน้าและคำลงท้าย</p>
            </div>
          </div>
        </div>
      )}

      {view === 'analytics' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs">
            <h1 className="text-xl font-black text-[#1E1B4B]">ภาพรวมประสิทธิภาพงานประชาสัมพันธ์ (PR Analytics)</h1>
            <p className="text-xs text-slate-500 mt-0.5">ตัวชี้วัดความสำเร็จ ฝอ.5 บช.ตชด.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">ยอดผู้ชมข่าวยอดนิยม</h3>
              <div className="space-y-3">
                {publishedNews.slice(0, 5).map((n) => (
                  <div key={n.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-800 font-semibold truncate max-w-[70%]">
                        {n.title}
                      </span>
                      <span className="font-mono font-bold text-[#27265B]">
                        {n.views.toLocaleString()} ครั้ง
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-600 rounded-full"
                        style={{ width: `${Math.max(15, Math.min(100, n.views / 40))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">บทวิเคราะห์ผู้บริหาร (Executive Insights)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  งานประชาสัมพันธ์ของ บช.ตชด. มีแนวโน้มเชิงบวกอย่างต่อเนื่อง การบูรณาการระบบมอนิเตอร์ข่าว (Social Listening)
                  ร่วมกับการส่งชุดปฏิบัติการภาพถ่ายภาคสนามทันที และการใช้ระบบตรวจสอบเอกสาร AI ช่วยลดเวลาการทำงานลงได้มากกว่า 40%
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">สถานะระบบ:</span>
                <span className="text-emerald-700 font-bold">ทำงานเต็มประสิทธิภาพ 100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Global Modals */}
      <PRPostDetailModal />
      <PRMissionDetailModal />
      <PRDocumentDetailModal />
      <PRAddMissionModal />
      <PRAddKeywordModal />
      <PRAddPageModal />
    </div>
  );
};
