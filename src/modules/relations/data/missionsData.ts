import { PhotoMission, Personnel, MissionLocation, MissionCategory, MissionPriority, MissionStatus } from '../types/bppTypes';

export const INITIAL_PERSONNEL: Personnel[] = [];

export const INITIAL_LOCATIONS: MissionLocation[] = [];

export const INITIAL_MISSIONS: PhotoMission[] = [];

export const generateMoreMissions = (): PhotoMission[] => {
  const missions = [...INITIAL_MISSIONS];
  const categories: MissionCategory[] = [
    'พิธีการและต้อนรับ',
    'ตรวจเยี่ยมหน่วย',
    'จิตอาสาพระราชทาน',
    'ช่วยเหลือผู้ประสบภัย',
    'กิจกรรมโรงเรียน ตชด.',
    'ลาดตระเวนชายแดน',
    'แถลงข่าวและประชาสัมพันธ์',
    'ฝึกอบรมและสัมมนา'
  ];
  const priorities: MissionPriority[] = ['urgent', 'high', 'medium', 'low'];
  const statuses: MissionStatus[] = ['completed', 'completed', 'in_progress', 'pending', 'postponed'];
  const titles = [
    'กิจกรรมครู ตชด. สอนเสริมทักษะภาษาอังกฤษ',
    'พิธีปิดการฝึกอบรมยุทธวิธีตำรวจตระเวนชายแดน',
    'สำรวจเส้นทางลาดตระเวนชายแดนธรรมชาติ',
    'แจกจ่ายพันธุ์พืชพระราชทานแก่ราษฎร',
    'แข่งขันกีฬาเชื่อมความสัมพันธ์ชุมชนชายแดน',
    'ประชุมสัมมนาเครือข่ายประชาสัมพันธ์ ฝอ.5',
    'หน่วยแพทย์เดินเท้าตรวจสุขภาพผู้สูงอายุ',
    'ช่วยเหลือซ่อมแซมบ้านเรือนผู้ประสบวาตภัย',
    'สาธิตการดับเพลิงและกู้ชีพในโรงเรียน ตชด.',
    'พิธีมอบประกาศนียบัตรนักเรียนดีเด่น'
  ];

  for (let i = 6; i <= 52; i++) {
    const id = `PH-${i < 10 ? '00' : i < 100 ? '0' : ''}${i}`;
    const pIndex = (i - 1) % INITIAL_PERSONNEL.length;
    const lIndex = (i - 1) % INITIAL_LOCATIONS.length;
    const pers = INITIAL_PERSONNEL[pIndex];
    const loc = INITIAL_LOCATIONS[lIndex];
    const cat = categories[i % categories.length];
    const pri = priorities[i % priorities.length];
    const stat = i <= 35 ? 'completed' : statuses[i % statuses.length];
    const day = (i % 25) + 1;
    const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
    const displayDate = `${day} ก.ย. 69`;
    const title = `${titles[i % titles.length]} (${loc.province})`;
    const req = 40 + (i % 5) * 10;
    const del = stat === 'completed' ? req : stat === 'in_progress' ? Math.floor(req * 0.6) : 0;

    missions.push({
      id,
      title,
      description: `ภารกิจบันทึกภาพ ${title} เพื่อใช้เป็นคลังภาพประชาสัมพันธ์ ฝอ.5 บช.ตชด.`,
      date: dateStr,
      displayDate,
      startTime: `${8 + (i % 6)}:00`,
      endTime: `${12 + (i % 5)}:30`,
      location: loc.name,
      province: loc.province,
      gpsCoordinates: `${13 + (i % 5)}.${1000 + i * 23}, ${100 + (i % 4)}.${2000 + i * 15}`,
      personnelId: pers.id,
      personnelName: pers.name,
      personnelRank: pers.rank,
      teamCount: (i % 3) + 1,
      category: cat,
      priority: pri,
      status: stat,
      notes: `มอบหมาย ${pers.rank} ${pers.name} เป็นผู้ควบคุมชุดบันทึกภาพ`,
      deliverablesRequired: req,
      deliverablesDelivered: del,
      deliverablesPhotos:
        stat === 'completed'
          ? [
              'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
            ]
          : [],
      timeline: [
        { time: '08:00', activity: 'จัดเตรียมอุปกรณ์และซักซ้อมมุมกล้อง', completed: stat !== 'pending' },
        { time: '09:00', activity: 'เริ่มบันทึกภาพกิจกรรม', completed: stat === 'completed' || stat === 'in_progress' },
        { time: '12:00', activity: 'สรุปส่งไฟล์ภาพ', completed: stat === 'completed' },
      ],
      relatedPostId: i % 4 === 0 ? `post-${(i % 15) + 1}` : undefined,
    });
  }

  return missions;
};

export const ALL_INITIAL_MISSIONS: PhotoMission[] = [];
