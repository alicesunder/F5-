export type SlideLayout =
  | 'title'         // หน้าปก (Cover Title)
  | 'split-image'   // 2 คอลัมน์ (ข้อความ + รูปภาพ)
  | 'cards'         // การ์ดหัวข้อ 3-4 คอลัมน์
  | 'bullets'       // รายการประเด็นสำคัญพร้อมไอคอน
  | 'stats'         // ไฮไลต์สถิติและตัวเลขสำคัญ
  | 'timeline'      // ลำดับขั้นตอน / แผนการดำเนินงาน
  | 'conclusion';   // สรุปผล / ถาม-ตอบ / ข้อมูลติดต่อ

export type SlideThemeId =
  | 'navy'          // สีกรมท่า-ทอง (Royal Navy & Gold)
  | 'emerald'       // เขียวพราง ตชด. (BPP Forest Emerald)
  | 'indigo'        // โมเดิร์นคราม (Modern Indigo)
  | 'crimson'       // แดงกุหลาบ-คอรัล (PR Crimson & Coral)
  | 'slate';        // มินิมอลเรียบหรู (Executive Slate)

export interface SlideBullet {
  title: string;
  description: string;
  icon?: string;
}

export interface SlideStat {
  value: string;
  label: string;
  change?: string;
}

export interface SlideItem {
  id: string;
  layout: SlideLayout;
  title: string;
  subtitle?: string;
  badge?: string;
  bullets?: SlideBullet[];
  stats?: SlideStat[];
  highlightText?: string;
  imageIndex?: number | null; // index into uploaded images array
  customImageUrl?: string;
  speakerNotes?: string;
}

export interface UploadedImage {
  id: string;
  file?: File;
  dataUrl: string;
  name: string;
  caption?: string;
  size: number;
}

export interface SlideThemeConfig {
  id: SlideThemeId;
  name: string;
  enName: string;
  primary: string;
  secondary: string;
  accent: string;
  coverBg: string;
  contentBg: string;
  cardBg: string;
  textColor: string;
  subtitleColor: string;
  accentText: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  pptxColors: {
    primary: string;     // Hex without #
    secondary: string;
    accent: string;
    textDark: string;
    textLight: string;
    cardBg: string;
    slideBg: string;
  };
}

export interface SlideDeck {
  id: string;
  deckTitle: string;
  deckSubtitle: string;
  presenter: string;
  department: string;
  date: string;
  theme: SlideThemeId;
  aspectRatio: '16:9' | '4:3';
  slides: SlideItem[];
  images: UploadedImage[];
  createdAt: string;
  updatedAt: string;
}

export interface SlideGenerationConfig {
  topic: string;
  details: string;
  slideCount: number;
  tone: 'official' | 'executive' | 'operations' | 'public_relations';
  theme: SlideThemeId;
  department: string;
  presenter: string;
}
