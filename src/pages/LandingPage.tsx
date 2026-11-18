import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { GlobalSearchModal } from '../components/common/GlobalSearchModal';
import { HeaderThemeSwitcher } from '../components/layout/HeaderThemeSwitcher';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  Lock,
  Search,
  Settings,
  Megaphone,
  Shield,
  Heart,
  ArrowRight,
  Home,
  Mail,
  PhoneCall,
  MapPin,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateModule, isAuthenticated, login } = useAdmin();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Login form state (inline on landing page)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToDepartment = (deptId: 'admin' | 'relations' | 'disaster' | 'volunteer') => {
    navigateModule(deptId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email.trim()) {
      setErrorMsg('กรุณากรอกอีเมลผู้ใช้งาน');
      return;
    }
    if (!password) {
      setErrorMsg('กรุณากรอกรหัสผ่าน');
      return;
    }
    if (!isSupabaseConfigured) {
      setErrorMsg('ระบบเข้าสู่ระบบยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ');
      return;
    }
    setIsLoading(true);
    login(email.trim(), password)
      .then(success => {
        if (!success) {
          setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
          setPassword('');
        }
      })
      .catch(() => setErrorMsg('เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่'))
      .finally(() => setIsLoading(false));
  };

  const departmentCards = [
    {
      id: 'admin' as const,
      title: 'งานอำนวยการ',
      description: 'บริหารจัดการงานธุรการ สารบรรณ งบประมาณ และสนับสนุนภารกิจ',
      bgColor: '#5B2A86',
      gradient: 'linear-gradient(135deg, #5B2A86 0%, #8B46C8 60%, #A855F7 100%)',
      badge: 'สารบรรณ & งบประมาณ',
      icon: Settings,
      watermarkIcon: Settings,
    },
    {
      id: 'relations' as const,
      title: 'งานประชาสัมพันธ์',
      description: 'สื่อสารองค์กร เผยแพร่ข่าวสาร และสร้างความเข้าใจเชื่อมโยงทุกภาคส่วน',
      bgColor: '#2583D8',
      gradient: 'linear-gradient(135deg, #1D68B0 0%, #2583D8 60%, #38BDF8 100%)',
      badge: 'สื่อสารองค์กร & ข่าวสาร',
      icon: Megaphone,
      watermarkIcon: Megaphone,
    },
    {
      id: 'disaster' as const,
      title: 'งานพัฒนาช่วยเหลือประชาชน',
      description: 'เฝ้าระวัง ป้องกัน บรรเทาสาธารณภัย และพัฒนาช่วยเหลือประชาชน',
      bgColor: '#E89B22',
      gradient: 'linear-gradient(135deg, #B45309 0%, #E89B22 60%, #FBBF24 100%)',
      badge: 'บรรเทาภัย & พัฒนาชุมชน',
      icon: Shield,
      watermarkIcon: Shield,
    },
    {
      id: 'volunteer' as const,
      title: 'งานจิตอาสา',
      description: 'บริหารกิจกรรมจิตอาสาพระราชทาน พัฒนาชุมชน และช่วยเหลือสังคมอย่างยั่งยืน',
      bgColor: '#42A77A',
      gradient: 'linear-gradient(135deg, #047857 0%, #42A77A 60%, #34D399 100%)',
      badge: 'จิตอาสาพระราชทาน 904',
      icon: Heart,
      watermarkIcon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7F9] dark:bg-[#0E1014] text-[#2D2A32] dark:text-[#F5F7FA] flex flex-col font-sans selection:bg-[#5B2A86] selection:text-white relative overflow-x-hidden">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#151821]/90 backdrop-blur-md border-b border-[rgba(40,35,50,0.08)] dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Left */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/fo5-logo.svg"
              alt="ฝอ 5 Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-lg font-extrabold text-[#5B2A86] dark:text-[#F5F7FA] tracking-tight">
              ฝอ 5
            </span>
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center transition cursor-pointer"
              title="ค้นหาข้อมูล (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>
            <HeaderThemeSwitcher />
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => navigateModule('dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B2A86] hover:bg-[#7B3FC6] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เข้าสู่ Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION — cinematic video background + login */}
      <section className="relative flex-1 w-full overflow-hidden min-h-[680px]">
        {/* Landing video background */}
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/assets/landing-hero.mp4" type="video/mp4" />
          <source src="/assets/fluent-hero-loop.mp4" type="video/mp4" />
        </video>

        {/* Premium dark/purple overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17143F]/95 via-[#27265B]/82 to-[#27265B]/55 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0D2B]/75 via-transparent to-[#17143F]/30 pointer-events-none" />

        {/* Decorative glow */}
        <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-purple-400/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 right-0 w-[520px] h-[520px] rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Brand Hero Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 text-white">
              {/* Welcome heading */}
              <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-2 text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-white/90 shadow-lg">
                WELCOME TO FO5
              </div>

              <div className="space-y-2">
                <p className="text-sm sm:text-base font-medium text-white/75">ยินดีต้อนรับสู่</p>
                <h1 className="text-5xl sm:text-7xl font-black tracking-tight drop-shadow-2xl text-white !text-white">ฝอ 5</h1>
              </div>

              {/* Logo */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/95 shadow-2xl p-2 flex items-center justify-center transition hover:scale-105 duration-300 ring-1 ring-white/30">
                <img
                  src="/assets/fo5-logo.svg"
                  alt="ฝอ 5 Emblem"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Main Statement */}
              <p className="text-sm sm:text-base font-medium text-white/90 max-w-md leading-relaxed">
                เทคโนโลยี ข้อมูล การสื่อสาร เพื่อการทำงานร่วมกันอย่างมีประสิทธิภาพ
              </p>

              {/* 4-color accent divider */}
              <div className="w-24 h-1.5 rounded-full bg-gradient-to-r from-[#7F9B83] via-[#EE7E9E] via-[#8191BA] to-[#EFBB4B] shadow-lg" />

              {/* Tagline */}
              <p className="text-sm font-semibold text-white/90 italic">
                " ร่วมคิด ร่วมทำ เพื่อความก้าวหน้า อย่างยั่งยืน "
              </p>
            </div>

            {/* Right: Compact Login Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                <div className="bg-white/95 dark:bg-[#151821]/95 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-xl p-6 sm:p-8">
                  {/* Card header: logo + ฝอ5 */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-white ring-1 ring-slate-200 shadow-md mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src="/assets/fo5-logo.svg"
                        alt="ฝอ 5"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h2 className="text-xl font-black text-[#5B2A86] dark:text-[#F5F7FA] tracking-tight">ฝอ 5</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">เข้าสู่ระบบเพื่อใช้งาน</p>
                    {/* 4-color underline */}
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#7F9B83] via-[#EE7E9E] via-[#8191BA] to-[#EFBB4B] mt-2" />
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {/* Email Input */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        อีเมลผู้ใช้งาน (Email)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@gov.th หรือ your-email@example.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/20 focus:border-[#5B2A86] transition bg-slate-50 dark:bg-white/5"
                          required
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        รหัสผ่าน (Password)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder="รหัสผ่าน"
                          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#5B2A86]/20 focus:border-[#5B2A86] transition bg-slate-50 dark:bg-white/5"
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(prev => !prev)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#5B2A86] hover:bg-[#7B3FC6] text-white text-sm font-semibold shadow-md shadow-purple-950/20 transition-all cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>เข้าสู่ระบบ</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Legal micro note */}
                  <p className="mt-4 text-[10px] text-slate-400 text-center leading-relaxed">
                    สงวนสิทธิ์เฉพาะการปฏิบัติราชการ ตาม พ.ร.บ. คอมพิวเตอร์ฯ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR DEPARTMENT CARDS */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {departmentCards.map(dept => {
            const Icon = dept.icon;
            const Watermark = dept.watermarkIcon;
            return (
              <div
                key={dept.id}
                onClick={() => handleGoToDepartment(dept.id)}
                className="dept-card group relative p-6 rounded-3xl text-white shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[185px] border border-white/20"
                style={{ background: dept.gradient }}
              >
                {/* Background Watermark */}
                <div className="absolute -bottom-5 -right-5 opacity-15 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 pointer-events-none">
                  <Watermark className="w-32 h-32 text-white" />
                </div>

                {/* Top: Round Icon + Badge */}
                <div className="flex items-center justify-between gap-2 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/95 text-slate-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" style={{ color: dept.bgColor }} />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-black/20 backdrop-blur-xs text-white/95 border border-white/15">
                    {dept.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-4 space-y-1.5 relative z-10">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    {dept.title}
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed line-clamp-2">
                    {dept.description}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between relative z-10">
                  <span className="text-xs font-extrabold text-white">เข้าสู่ระบบสายงาน</span>
                  <div className="w-7 h-7 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: dept.bgColor }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FOOTER (#24145C) */}
      <footer className="w-full bg-[#24145C] text-white pt-8 pb-5 relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/15">
            {/* Left Brand */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/fo5-logo.svg"
                alt="ฝอ 5"
                className="w-10 h-10 object-contain bg-white rounded-full p-1"
              />
              <div>
                <div className="text-base font-bold text-white leading-tight">ฝอ 5</div>
                <div className="text-[11px] text-slate-300 font-light mt-0.5">
                  เทคโนโลยี ข้อมูล การสื่อสาร เพื่อการทำงานร่วมกันอย่างมีประสิทธิภาพ
                </div>
              </div>
            </div>

            {/* Center Tagline */}
            <div className="text-center">
              <p className="text-xs font-medium text-purple-200">
                "ร่วมคิด ร่วมทำ เพื่อความก้าวหน้า อย่างยั่งยืน"
              </p>
              <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#7F9B83] via-[#EE7E9E] via-[#8191BA] to-[#EFBB4B] mx-auto mt-1.5" />
            </div>

            {/* Right: Quick links */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="หน้าแรก"
              >
                <Home className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigateModule('relations')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="ติดต่อเรา"
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigateModule('disaster')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="แจ้งปัญหา / สาธารณภัย"
              >
                <PhoneCall className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigateModule('maps')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                title="แผนที่"
              >
                <MapPin className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-300">
            <div>© 2569 ฝอ 5. All rights reserved.</div>
            <div className="flex items-center gap-4 text-purple-300">
              <button
                type="button"
                onClick={() => navigateModule('documents')}
                className="hover:text-white transition cursor-pointer"
              >
                นโยบายความเป็นส่วนตัว
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => navigateModule('dashboard')}
                className="hover:text-white transition cursor-pointer"
              >
                แผนผังเว็บไซต์
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
