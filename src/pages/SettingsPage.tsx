import React, { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Role } from '../types';
import {
  Settings,
  Shield,
  Server,
  UserCheck,
  CheckCircle2,
  Lock,
  Cpu,
  ShieldAlert,
  Terminal,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentRole, setRole, showToast } = useAdmin();


  const handleRoleChange = (role: Role) => {
    setRole(role);
    showToast(
      `เปลี่ยนบทบาทการทำงานเป็น: ${
        role === 'admin'
          ? 'ผู้ดูแลระบบ (Admin)'
          : role === 'officer'
          ? 'เจ้าหน้าที่ (Officer)'
          : 'ผู้บริหาร/ผู้ตรวจ (Viewer)'
      }`,
      'info'
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* 01 — HERO / OPENING (Editorial Intelligence Command) */}
      <section className="glass rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-mono tracking-widest text-[rgba(17,19,21,0.5)] mb-2 uppercase">
              <span className="text-[#234A78] font-bold">SYSTEM / 06</span>
              <span>—</span>
              <span>ADMINISTRATION & GOVERNANCE</span>
              <span>—</span>
              <span>AIR-GAPPED COMPLIANCE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111315] leading-tight">
              ตั้งค่าระบบและกำหนดสิทธิ์การปฏิบัติงาน
            </h2>
            <p className="text-xs sm:text-sm text-[rgba(17,19,21,0.62)] mt-2 font-normal leading-relaxed">
              ควบคุมสิทธิ์ผู้ใช้งาน (RBAC) สภาพแวดล้อมสถาปัตยกรรมความปลอดภัย และการจัดการสถานะข้อมูลฝ่ายอำนวยการ
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-[rgba(17,19,21,0.08)] shadow-2xs text-left shrink-0">
            <div className="text-[10px] font-mono tracking-wider text-[rgba(17,19,21,0.4)] uppercase">
              ENVIRONMENT SPECIFICATION
            </div>
            <div className="text-sm font-mono font-bold text-[#111315] mt-0.5">
              SAC v2.6.9 PRO
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#42695B] mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#42695B]" />
              <span>AIR-GAPPED COMPLIANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — ROLE MANAGEMENT SECTION */}
      <section className="glass rounded-[28px] p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
            <h3 className="text-base font-medium text-[#111315]">
              สิทธิ์การใช้งานและบทบาทผู้ปฏิบัติงาน (Role-Based Access Control)
            </h3>
          </div>
          <p className="text-xs text-[rgba(17,19,21,0.6)]">
            เลือกจำลองบทบาทผู้ใช้งานเพื่อทดสอบการเข้าถึงข้อมูลและสิทธิ์การดำเนินการในระบบ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Admin Role */}
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`p-5 rounded-[22px] text-left transition flex flex-col justify-between cursor-pointer ${
              currentRole === 'admin'
                ? 'bg-white border-2 border-[#234A78] shadow-[0_12px_36px_rgba(35,74,120,0.12)]'
                : 'bg-white/60 hover:bg-white/90 border border-[rgba(17,19,21,0.08)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#111315]">ผู้ดูแลระบบ (Admin)</span>
                {currentRole === 'admin' && <CheckCircle2 className="w-4 h-4 text-[#234A78] stroke-[2]" />}
              </div>
              <p className="text-xs text-[rgba(17,19,21,0.65)] mt-2 leading-relaxed">
                สิทธิ์สูงสุด สามารถสร้าง แก้ไข ลบ ทุกข้อมูล จัดการงบประมาณ ทะเบียนหนังสือ ทำเนียบบุคลากร และล้างระบบได้
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(17,19,21,0.08)] text-[10px] font-mono font-medium text-[#234A78]">
              สิทธิ์: เต็มรูปแบบ (FULL ACCESS)
            </div>
          </button>

          {/* Officer Role */}
          <button
            type="button"
            onClick={() => handleRoleChange('officer')}
            className={`p-5 rounded-[22px] text-left transition flex flex-col justify-between cursor-pointer ${
              currentRole === 'officer'
                ? 'bg-white border-2 border-[#234A78] shadow-[0_12px_36px_rgba(35,74,120,0.12)]'
                : 'bg-white/60 hover:bg-white/90 border border-[rgba(17,19,21,0.08)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#111315]">เจ้าหน้าที่ปฏิบัติการ (Officer)</span>
                {currentRole === 'officer' && <CheckCircle2 className="w-4 h-4 text-[#234A78] stroke-[2]" />}
              </div>
              <p className="text-xs text-[rgba(17,19,21,0.65)] mt-2 leading-relaxed">
                สำหรับเจ้าหน้าที่ฝ่ายอำนวยการ บันทึกรายการงบประมาณ ขออนุมัติไปราชการ ทะเบียนหนังสือรับ-ส่ง และส่งออกรายงาน
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(17,19,21,0.08)] text-[10px] font-mono font-medium text-[rgba(17,19,21,0.7)]">
              สิทธิ์: สร้าง/แก้ไข/ส่งออก (STANDARD)
            </div>
          </button>

          {/* Viewer Role */}
          <button
            type="button"
            onClick={() => handleRoleChange('viewer')}
            className={`p-5 rounded-[22px] text-left transition flex flex-col justify-between cursor-pointer ${
              currentRole === 'viewer'
                ? 'bg-white border-2 border-[#234A78] shadow-[0_12px_36px_rgba(35,74,120,0.12)]'
                : 'bg-white/60 hover:bg-white/90 border border-[rgba(17,19,21,0.08)]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-[#111315]">ผู้บริหาร / ผู้ตรวจการ (Viewer)</span>
                {currentRole === 'viewer' && <CheckCircle2 className="w-4 h-4 text-[#234A78] stroke-[2]" />}
              </div>
              <p className="text-xs text-[rgba(17,19,21,0.65)] mt-2 leading-relaxed">
                สำหรับผู้บังคับบัญชา ตรวจดูแดชบอร์ด ติดตามสถานะงาน ค้นหาเอกสารสำคัญ ดูรายงาน โดยไม่สามารถแก้ไขข้อมูลได้
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[rgba(17,19,21,0.08)] text-[10px] font-mono font-medium text-[rgba(17,19,21,0.5)]">
              สิทธิ์: อ่านอย่างเดียว (READ-ONLY)
            </div>
          </button>
        </div>
      </section>

      {/* 03 — SYSTEM ARCHITECTURE SPECIFICATIONS */}
      <section className="glass rounded-[28px] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-[#234A78] stroke-[1.5]" />
          <h3 className="text-base font-medium text-[#111315]">
            ข้อมูลจำเพาะระบบและสถาปัตยกรรม (Architecture & Environment Specs)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div className="p-4 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] shadow-2xs">
            <span className="text-[10px] font-mono text-[rgba(17,19,21,0.4)] uppercase block">
              01 // ARCHITECTURE
            </span>
            <span className="font-semibold text-[#111315] mt-1 block">Client-Side SPA</span>
            <span className="text-[10px] text-[#42695B] font-mono mt-1 block">High-Security Air-Gapped</span>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] shadow-2xs">
            <span className="text-[10px] font-mono text-[rgba(17,19,21,0.4)] uppercase block">
              02 // STACK
            </span>
            <span className="font-semibold text-[#111315] mt-1 block">React 18 + TS + Vite</span>
            <span className="text-[10px] text-[#234A78] font-mono mt-1 block">Enterprise Grade</span>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] shadow-2xs">
            <span className="text-[10px] font-mono text-[rgba(17,19,21,0.4)] uppercase block">
              03 // DESIGN SYSTEM
            </span>
            <span className="font-semibold text-[#111315] mt-1 block">Liquid Glass Editorial</span>
            <span className="text-[10px] text-[rgba(17,19,21,0.5)] font-mono mt-1 block">Asymmetric Precision</span>
          </div>

          <div className="p-4 bg-white/70 rounded-2xl border border-[rgba(17,19,21,0.08)] shadow-2xs">
            <span className="text-[10px] font-mono text-[rgba(17,19,21,0.4)] uppercase block">
              04 // DATA RESIDENCY
            </span>
            <span className="font-semibold text-[#111315] mt-1 block">Local Reactive Engine</span>
            <span className="text-[10px] text-[#42695B] font-mono mt-1 block">Zero External Leakage</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[rgba(35,74,120,0.04)] border border-[rgba(35,74,120,0.12)] text-xs text-[#111315] space-y-1.5">
          <div className="font-semibold flex items-center gap-1.5 text-[#234A78]">
            <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>นโยบายความมั่นคงปลอดภัยสารสนเทศภาครัฐ (Security & Compliance):</span>
          </div>
          <p className="text-[rgba(17,19,21,0.7)] text-xs leading-relaxed">
            ข้อมูลของระบบจัดเก็บในฐานข้อมูล Supabase (ภูมิภาคสิงคโปร์) เข้าถึงได้เฉพาะบัญชีที่ผู้ดูแลระบบเพิ่มเป็นบุคลากรเท่านั้น การเชื่อมต่อเข้ารหัส (HTTPS) และทุกการแก้ไขบันทึกผู้แก้ไขไว้
          </p>
        </div>
      </section>

    </div>
  );
};
