import { SentimentType, CategoryType, AlertSeverity } from '../types/bppTypes';

export const formatRelativeTime = (minutesAgo: number): string => {
  if (minutesAgo < 1) return 'เมื่อสักครู่';
  if (minutesAgo < 60) return `${Math.floor(minutesAgo)} นาทีที่แล้ว`;
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'เมื่อวานนี้';
  return `${days} วันที่แล้ว`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString('th-TH');
};

export const getSentimentBadge = (sentiment: SentimentType) => {
  switch (sentiment) {
    case 'positive':
      return {
        label: 'Positive',
        thaiLabel: 'เชิงบวก',
        bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        text: 'text-emerald-700',
        dotColor: 'bg-emerald-500',
      };
    case 'neutral':
      return {
        label: 'Neutral',
        thaiLabel: 'เป็นกลาง',
        bgColor: 'bg-slate-100 border-slate-200 text-slate-700',
        bg: 'bg-slate-100 border-slate-200',
        text: 'text-slate-700',
        dotColor: 'bg-slate-400',
      };
    case 'negative':
      return {
        label: 'Negative',
        thaiLabel: 'เชิงลบ',
        bgColor: 'bg-rose-50 border-rose-200 text-rose-700',
        bg: 'bg-rose-50 border-rose-200',
        text: 'text-rose-700',
        dotColor: 'bg-rose-500',
      };
    default:
      return {
        label: 'Neutral',
        thaiLabel: 'เป็นกลาง',
        bgColor: 'bg-slate-100 border-slate-200 text-slate-700',
        bg: 'bg-slate-100 border-slate-200',
        text: 'text-slate-700',
        dotColor: 'bg-slate-400',
      };
  }
};

export const getCategoryBadge = (category: CategoryType | string) => {
  switch (category) {
    case 'ความมั่นคงชายแดน':
      return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'ยาเสพติด':
      return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    case 'จิตอาสา/ช่วยเหลือ':
      return 'bg-teal-50 border-teal-200 text-teal-700';
    case 'การศึกษา/ครู ตชด.':
      return 'bg-indigo-50 border-indigo-200 text-indigo-700';
    case 'ภัยพิบัติ':
      return 'bg-amber-50 border-amber-200 text-amber-800';
    case 'กิจกรรมองค์กร':
      return 'bg-sky-50 border-sky-200 text-sky-700';
    case 'ทั่วไป':
    default:
      return 'bg-slate-100 border-slate-200 text-slate-700';
  }
};

export const getSeverityBadge = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical':
      return {
        label: 'CRITICAL',
        thaiLabel: 'วิกฤต',
        color: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500 animate-ping',
      };
    case 'high':
      return {
        label: 'HIGH',
        thaiLabel: 'สูง',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'medium':
      return {
        label: 'MEDIUM',
        thaiLabel: 'ปานกลาง',
        color: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'info':
    default:
      return {
        label: 'MONITOR',
        thaiLabel: 'ติดตาม',
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
      };
  }
};
