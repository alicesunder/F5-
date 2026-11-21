import { useSyncExternalStore } from 'react';

/**
 * โหมดข้อมูลจำลอง (เปิด-ปิดโดยแอดมินในตั้งค่าระบบ)
 *  - เห็นเฉพาะในเครื่องที่เปิด (localStorage) คนอื่นไม่เห็น
 *  - ไม่เขียนลงฐานข้อมูลจริงเลย: ทุกการบันทึกขณะเปิดโหมดนี้อยู่ในหน่วยความจำของหน้าเว็บเท่านั้น
 *  - ปิดโหมด/รีเฟรช/ออกจากระบบ = ข้อมูลจำลองหายทั้งหมด และกลับเป็นข้อมูลจริง
 */
const KEY = 'fo5.demoMode';
const listeners = new Set<() => void>();

let current = false;
try {
  current = sessionStorage.getItem(KEY) === '1';
} catch {
  current = false;
}

export const isDemo = () => current;

export const setDemoMode = (on: boolean) => {
  if (on === current) return;
  current = on;
  try {
    if (on) sessionStorage.setItem(KEY, '1');
    else sessionStorage.removeItem(KEY);
  } catch {
    /* ใช้ค่าในหน่วยความจำต่อไป */
  }
  listeners.forEach(fn => fn());
};

export const onDemoChange = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

const subscribe = (fn: () => void) => onDemoChange(fn);
export const useDemoMode = () => useSyncExternalStore(subscribe, isDemo, () => false);
