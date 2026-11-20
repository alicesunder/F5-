import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useCollection } from '../../lib/collections';

/** หนึ่งคนในผังโครงสร้าง ฝอ.5 (app_records collection 'org.staff') */
export interface OrgPerson {
  id: string;
  rank: string;
  name: string;
  position: string;
  /** เช่น "ช่วยราชการ ฝอ.5ฯ" / "ปฏิบัติหน้าที่ ฝอ.5ฯ" — ว่าง = สังกัด ฝอ.5 */
  note: string;
  section: OrgSection;
  /** id ของผู้บังคับบัญชาโดยตรง (null = หัวหน้าสูงสุด) */
  parent: string | null;
  phone: string;
  /** path ใน bucket staff-photos (ว่าง = ไม่มีรูป) */
  photo: string;
  order: number;
}

export type OrgSection = 'command' | 'admin' | 'relations' | 'disaster' | 'volunteer';

export const ORG_COLLECTION = 'org.staff';
export const PHOTO_BUCKET = 'staff-photos';

export const SECTION_META: Record<OrgSection, { label: string; short: string; color: string; soft: string }> = {
  command: { label: 'ผู้บังคับบัญชา', short: 'ผู้บังคับบัญชา', color: '#4C1D95', soft: '#F1EAFE' },
  admin: { label: 'งานอำนวยการ', short: 'อำนวยการ', color: '#6D28D9', soft: '#F3EEFF' },
  relations: { label: 'งานมวลชนสัมพันธ์และประชาสัมพันธ์', short: 'มวลชนฯ/ประชาสัมพันธ์', color: '#2563EB', soft: '#EAF2FF' },
  disaster: { label: 'งานพัฒนาและช่วยเหลือประชาชน', short: 'พัฒนาและช่วยเหลือฯ', color: '#EA580C', soft: '#FFF1E6' },
  volunteer: { label: 'งานจิตอาสาพระราชทานตามแนวพระราชดำริ', short: 'จิตอาสาพระราชทาน', color: '#059669', soft: '#E8F8F1' },
};

export const WORK_SECTIONS: OrgSection[] = ['admin', 'relations', 'disaster', 'volunteer'];

export const EDITOR_ROLES = ['SUPER_ADMIN', 'ADMIN', 'ADMIN_DEPARTMENT'];

export const useOrgStaff = () => useCollection<OrgPerson>(ORG_COLLECTION, 'id');

export const byOrder = (a: OrgPerson, b: OrgPerson) => a.order - b.order || a.name.localeCompare(b.name, 'th');

export const fullName = (p: Pick<OrgPerson, 'rank' | 'name'>) => [p.rank, p.name].filter(Boolean).join(' ');

/** ช่วยราชการ/ปฏิบัติหน้าที่ = มาจากหน่วยอื่น */
export const isAttached = (p: OrgPerson) => p.note.trim() !== '';

// ---------- รูป (signed URL จาก bucket private) ----------
const urlCache = new Map<string, { url: string; exp: number }>();
const TTL = 3600;

/** คืน map path -> signed URL; ขอทีเดียวทั้งชุด และเก็บแคชไว้จนใกล้หมดอายุ */
export function usePhotoUrls(paths: string[]) {
  const key = [...new Set(paths.filter(Boolean))].sort().join('|');
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    const list = key ? key.split('|') : [];
    const now = Date.now();
    const fresh: Record<string, string> = {};
    const need: string[] = [];
    for (const p of list) {
      const c = urlCache.get(p);
      if (c && c.exp > now + 60_000) fresh[p] = c.url;
      else need.push(p);
    }
    setUrls(fresh);
    if (!need.length) return;
    void supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrls(need, TTL)
      .then(({ data }) => {
        if (!alive || !data) return;
        const add: Record<string, string> = {};
        for (const d of data) {
          if (d.signedUrl && d.path) {
            urlCache.set(d.path, { url: d.signedUrl, exp: Date.now() + TTL * 1000 });
            add[d.path] = d.signedUrl;
          }
        }
        setUrls(u => ({ ...u, ...add }));
      });
    return () => {
      alive = false;
    };
  }, [key]);
  return urls;
}

/** ย่อรูปเป็น JPEG ด้านยาวไม่เกิน 640px ก่อนอัปโหลด (ไฟล์เล็ก โหลดเร็วบนมือถือ) */
export async function shrinkImage(file: File, max = 640): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  const g = c.getContext('2d')!;
  g.fillStyle = '#fff';
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(bmp, 0, 0, c.width, c.height);
  bmp.close();
  return new Promise((res, rej) => c.toBlob(b => (b ? res(b) : rej(new Error('แปลงรูปไม่สำเร็จ'))), 'image/jpeg', 0.86));
}

export async function uploadPhoto(personId: string, file: File): Promise<string> {
  const blob = await shrinkImage(file);
  const path = `${personId}-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' });
  if (error) throw error;
  return path;
}

export async function removePhoto(path: string) {
  if (path) await supabase.storage.from(PHOTO_BUCKET).remove([path]);
}
