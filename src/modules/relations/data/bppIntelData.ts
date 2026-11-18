import { MonitoredPage, PostItem, MonitoredKeyword, AlertItem } from '../types/bppTypes';

export const INITIAL_PAGES: MonitoredPage[] = [];

export const INITIAL_KEYWORDS: MonitoredKeyword[] = [];

export const generateInitialPosts = (): PostItem[] => {
  const basePosts: Omit<PostItem, 'id' | 'minutesAgo'>[] = [
    {
      pageId: 'p1',
      pageName: 'ข่าวชายแดนไทย-เมียนมา',
      pageAvatar: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T06:34:00Z',
      content: 'ตชด. สกัดกั้นขบวนการลักลอบนำเข้าสิ่งผิดกฎหมายช่องทางธรรมชาติชายแดนแม่ฮ่องสอน เจ้าหน้าที่ ตชด.ร้อย 336 ร่วมกับฝ่ายความมั่นคง ตรวจยึดยานพาหนะดัดแปลงพร้อมของกลางมูลค่ากว่า 2.4 ล้านบาท',
      imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&auto=format&fit=crop&q=80',
      keywords: ['ตชด.', 'ความมั่นคงชายแดน', 'ด่านตรวจชายแดน'],
      category: 'ความมั่นคงชายแดน',
      sentiment: 'positive',
      engagement: { likes: 1240, comments: 86, shares: 124 },
      isImportant: true,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1001',
      aiSummary: 'รายงานผลการจับกุมและสกัดกั้นการกระทำผิดกฎหมายบริเวณชายแดนแม่ฮ่องสอน สะท้อนการปฏิบัติการเชิงรุกของ ตชด.ร้อย 336',
      reachEstimate: 34500
    },
    {
      pageId: 'p2',
      pageName: 'อีสานทูเดย์ เกาะติดสถานการณ์',
      pageAvatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T06:29:00Z',
      content: 'สุดประทับใจ! ครู ตชด. นำเด็กนักเรียนบนดอยสูงจัดกิจกรรมอนุรักษ์พันธุ์พืชและภูมิปัญญาท้องถิ่น พร้อมแจกจ่ายชุดเครื่องเขียนพระราชทานแก่เยาวชนยากไร้',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      keywords: ['ครู ตชด.', 'โรงเรียน ตชด.', 'จิตอาสา'],
      category: 'การศึกษา/ครู ตชด.',
      sentiment: 'positive',
      engagement: { likes: 2180, comments: 142, shares: 310 },
      isImportant: false,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1002',
      aiSummary: 'ข่าวเชิงบวกสร้างภาพลักษณ์อันดีต่อครู ตชด. ในการพัฒนาเยาวชนและสนับสนุนการศึกษาในถิ่นทุรกันดาร',
      reachEstimate: 48200
    },
    {
      pageId: 'p3',
      pageName: 'เกาะติดความมั่นคงชายแดนใต้',
      pageAvatar: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T06:23:00Z',
      content: 'ตชด. ภาค 4 เพิ่มความเข้มงวดในการลาดตระเวนเส้นทางเชื่อมต่อพื้นที่ป่าเขาในยะลาและนราธิวาส ป้องกันการแทรกซึมตลอด 24 ชั่วโมง เพื่อสร้างความมั่นใจแก่ชาวบ้านในพื้นที่',
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&auto=format&fit=crop&q=80',
      keywords: ['ตชด. ภาค 4', 'ลาดตระเวน', 'ความมั่นคงชายแดน'],
      category: 'ความมั่นคงชายแดน',
      sentiment: 'neutral',
      engagement: { likes: 890, comments: 54, shares: 62 },
      isImportant: true,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1003',
      aiSummary: 'การปฏิบัติหน้าที่รักษาความสงบเรียบร้อยชายแดนใต้ มีความพร้อมสูงและตอบสนองสถานการณ์รวดเร็ว',
      reachEstimate: 21000
    },
    {
      pageId: 'p4',
      pageName: 'เสียงประชาชนริมชายแดน',
      pageAvatar: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T06:17:00Z',
      content: 'ชาวบ้านสะท้อนปัญหาถนนดินลูกรังเสียหายหนักจากฝนตกต่อเนื่อง รถพยาบาลเข้าไม่ถึง วอนหน่วยงานเข้าตรวจสอบช่วยเหลือด่วน',
      keywords: ['ภัยพิบัติ', 'ช่วยเหลือประชาชน', 'ดินโคลนถล่ม'],
      category: 'ภัยพิบัติ',
      sentiment: 'negative',
      engagement: { likes: 640, comments: 95, shares: 48 },
      isImportant: true,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1004',
      aiSummary: 'ข้อร้องเรียนปัญหาโครงสร้างพื้นฐานคมนาคม ต้องการความช่วยเหลือด้านการเปิดเส้นทางคมนาคม',
      reachEstimate: 16500
    },
    {
      pageId: 'p12',
      pageName: 'เกาะติดปราบปรามยาเสพติดชายแดน',
      pageAvatar: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T06:12:00Z',
      content: 'ด่วน! ตชด.ร้อย 237 สนธิกำลังทหารพรานและฝ่ายปกครอง สกัดจับยาบ้าล็อตใหญ่กว่า 500,000 เม็ด ริมฝั่งแม่น้ำโขง จ.นครพนม ผู้ต้องหา 2 รายเตรียมส่งกระจายพื้นที่ตอนใน',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      keywords: ['จับกุมยาเสพติด', 'สกัดกั้นยาเสพติด', 'ตชด.'],
      category: 'ยาเสพติด',
      sentiment: 'positive',
      engagement: { likes: 3450, comments: 230, shares: 420 },
      isImportant: true,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1005',
      aiSummary: 'ข่าวความสำเร็จในการตัดวงจรยาเสพติดริมโขง สร้างความเชื่อมั่นในศักยภาพของเจ้าหน้าที่ ตชด.',
      reachEstimate: 62000
    },
    {
      pageId: 'p5',
      pageName: 'ข่าวภาคเหนือ อัปเดตรายวัน',
      pageAvatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=120&auto=format&fit=crop&q=80',
      isVerified: false,
      timestamp: '2026-09-06T06:04:00Z',
      content: 'ตชด. กก.31 จัดชุดช่วยเหลือผู้ประสบอุทกภัยฉับพลัน ลำเลียงถุงยังชีพเข้าช่วยเหลือชาวบ้านติดค้างในพื้นที่ห่างไกล อ.ชาติตระการ จ.พิษณุโลก',
      keywords: ['ช่วยเหลือน้ำท่วม', 'จิตอาสา', 'ตชด.'],
      category: 'ภัยพิบัติ',
      sentiment: 'positive',
      engagement: { likes: 520, comments: 24, shares: 38 },
      isImportant: false,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1006',
      aiSummary: 'การบรรเทาสาธารณภัยเชิงรุก เจ้าหน้าที่เข้าถึงพื้นที่ภายในเวลาอันรวดเร็ว',
      reachEstimate: 12000
    },
    {
      pageId: 'p6',
      pageName: 'รายงานสดแดนใต้',
      pageAvatar: 'https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T05:58:00Z',
      content: 'กองกำกับการตำรวจตระเวนชายแดนที่ 44 ส่งเสริมอาชีพเกษตรผสมผสานแก่ชุมชนรอบค่าย ตามหลักปรัชญาเศรษฐกิจพอเพียง สร้างรายได้มั่นคงสู่ครัวเรือน',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
      keywords: ['ตชด. ภาค 4', 'จิตอาสา', 'กิจกรรมองค์กร'],
      category: 'กิจกรรมองค์กร',
      sentiment: 'positive',
      engagement: { likes: 1820, comments: 115, shares: 140 },
      isImportant: true,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1007',
      aiSummary: 'ภาพลักษณ์การพัฒนาคุณภาพชีวิต สร้างความสัมพันธ์อันดีระหว่างตำรวจและประชาชน',
      reachEstimate: 39000
    },
    {
      pageId: 'p19',
      pageName: 'เรารักครู ตชด.',
      pageAvatar: 'https://images.unsplash.com/photo-1544717305-996b815c338c?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T05:45:00Z',
      content: 'หัวใจทองคำ! ครู ตชด. เดินเท้าลุยน้ำป่าข้ามห้วยกว่า 5 กิโลเมตร นำวัคซีนและเวชภัณฑ์ไปฉีดให้เด็กนักเรียนในศูนย์การเรียนรู้ชาวไทยภูเขา จ.เชียงใหม่',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      keywords: ['ครู ตชด.', 'แพทย์เดินเท้า', 'โรงเรียน ตชด.'],
      category: 'การศึกษา/ครู ตชด.',
      sentiment: 'positive',
      engagement: { likes: 4520, comments: 380, shares: 920 },
      isImportant: true,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1008',
      aiSummary: 'ไวรัลข่าวดี กระแสตอบรับในโลกออนไลน์เป็นบวกสูงมาก ผู้คนชื่นชมความทุ่มเทและเสียสละของครู ตชด.',
      reachEstimate: 115000
    },
    {
      pageId: 'p10',
      pageName: 'จิตอาสาพระราชทาน 904',
      pageAvatar: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T05:35:00Z',
      content: 'กำลังพลจิตอาสา ตชด. ร่วมกับประชาชนจิตอาสาพระราชทาน 904 พัฒนาทำความสะอาดปรับภูมิทัศน์และสร้างฝายชะลอน้ำ ณ อุทยานแห่งชาติ จ.เพชรบุรี',
      keywords: ['จิตอาสา', 'พระราชทาน', 'กิจกรรมองค์กร'],
      category: 'จิตอาสา/ช่วยเหลือ',
      sentiment: 'positive',
      engagement: { likes: 1640, comments: 72, shares: 154 },
      isImportant: false,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1009',
      aiSummary: 'กิจกรรมจิตอาสาสร้างความสมัครสมานสามัคคีและอนุรักษ์ทรัพยากรธรรมชาติ',
      reachEstimate: 29000
    },
    {
      pageId: 'p7',
      pageName: 'เสียงจากฐานปฏิบัติการ',
      pageAvatar: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=120&auto=format&fit=crop&q=80',
      isVerified: false,
      timestamp: '2026-09-06T05:22:00Z',
      content: 'เบื้องหลังความสงบสุขของประชาชน คือการยืนหยัดของเหล่านักรบชุดพราง ตชด. ที่ไม่เคยหยุดพัก แม้ในค่ำคืนที่มืดมิดและเหน็บหนาว',
      keywords: ['ตชด.', 'ลาดตระเวน', 'ความมั่นคงชายแดน'],
      category: 'กิจกรรมองค์กร',
      sentiment: 'positive',
      engagement: { likes: 810, comments: 45, shares: 58 },
      isImportant: false,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1010',
      aiSummary: 'การเล่าเรื่องเชิงอารมณ์ความรู้สึกเพื่อสร้างความผูกพันและความเข้าใจในภารกิจตำรวจตระเวนชายแดน',
      reachEstimate: 14200
    },
    {
      pageId: 'p11',
      pageName: 'แม่ฮ่องสอน อัปเดต',
      pageAvatar: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=120&auto=format&fit=crop&q=80',
      isVerified: false,
      timestamp: '2026-09-06T05:08:00Z',
      content: 'ตชด.ร้อย 336 นำรถบรรทุกน้ำออกแจกจ่ายน้ำดื่มสะอาดแก่ชาวบ้านบนดอยที่ได้รับผลกระทบจากภัยแล้งใน อ.เมืองแม่ฮ่องสอน',
      keywords: ['ตชด.', 'ช่วยเหลือประชาชน', 'จิตอาสา'],
      category: 'ภัยพิบัติ',
      sentiment: 'positive',
      engagement: { likes: 980, comments: 64, shares: 82 },
      isImportant: false,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1011',
      aiSummary: 'การบรรเทาความเดือดร้อนด้านน้ำอุปโภคบริโภคให้แก่ชุมชนบนพื้นที่สูง',
      reachEstimate: 18500
    },
    {
      pageId: 'p14',
      pageName: 'ตำรวจไทย หัวใจเพื่อประชาชน',
      pageAvatar: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: '2026-09-06T04:55:00Z',
      content: 'ฝอ.5 บช.ตชด. จัดโครงการอบรมเครือข่ายประชาสัมพันธ์ดิจิทัล ยกระดับการสื่อสารความจริงสู่ประชาชนอย่างรวดเร็ว ถูกต้อง และทันสถานการณ์',
      imageUrl: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&auto=format&fit=crop&q=80',
      keywords: ['ฝอ.5', 'ฝอ.5 ประชาสัมพันธ์', 'ฝึกอบรม ตชด.'],
      category: 'กิจกรรมองค์กร',
      sentiment: 'positive',
      engagement: { likes: 1450, comments: 88, shares: 74 },
      isImportant: false,
      bppRelated: true,
      sourceUrl: 'https://facebook.com/demo/post/1012',
      aiSummary: 'การพัฒนาบุคลากรด้านงานประชาสัมพันธ์ของ ฝอ.5 สู่ยุคดิจิทัล',
      reachEstimate: 26000
    }
  ];

  const generated: PostItem[] = [];
  const timeOffsets = [
    2, 7, 13, 19, 24, 35, 42, 50, 55, 62, 70, 85, 94, 102, 115, 128, 140, 155, 172, 185,
    198, 215, 230, 245, 260, 280, 310, 330, 350, 360, 380, 410, 440, 470, 500, 530, 560,
    590, 620, 650, 680, 710, 740, 770, 800, 830, 860, 890, 920, 950, 980, 1020, 1060,
    1100, 1140, 1180, 1220, 1260, 1300, 1340, 1380, 1420, 1460, 1500, 1550, 1600, 1650,
    1700, 1750, 1800, 1850, 1900, 1950, 2000, 2050, 2100, 2150, 2200, 2250, 2300, 2350,
    2400, 2450, 2500, 2550, 2600, 2650, 2700, 2750, 2800, 2850
  ];

  const contentTemplates = [
    {
      content: 'ตชด. ปฏิบัติการร่วมลาดตระเวนชายแดนอย่างเข้มงวด รักษาอธิปไตยและความปลอดภัยของพี่น้องประชาชนอย่างเต็มกำลัง',
      cat: 'ความมั่นคงชายแดน' as const,
      kw: ['ตชด.', 'ลาดตระเวน', 'ความมั่นคงชายแดน'],
      sen: 'positive' as const
    },
    {
      content: 'รายงานตรวจพบกลุ่มผู้ลักลอบนำสิ่งของผิดกฎหมายข้ามแดน เจ้าหน้าที่อยู่ระหว่างขยายผลดำเนินคดี',
      cat: 'ยาเสพติด' as const,
      kw: ['ยาเสพติด', 'สกัดกั้นยาเสพติด', 'ตชด.'],
      sen: 'neutral' as const
    },
    {
      content: 'นักเรียนโรงเรียน ตชด. ได้รับทุนการศึกษาเพื่อสานฝันสู่อนาคต ชุมชนร่วมอนุโมทนาและขอบคุณครู ตชด.',
      cat: 'การศึกษา/ครู ตชด.' as const,
      kw: ['ครู ตชด.', 'โรงเรียน ตชด.'],
      sen: 'positive' as const
    },
    {
      content: 'สถานการณ์ระดับน้ำในแม่น้ำสายสำคัญริมชายแดนเริ่มสูงขึ้น หน่วยกู้ภัย ตชด. จัดชุดเฝ้าระวัง 24 ชั่วโมง',
      cat: 'ภัยพิบัติ' as const,
      kw: ['ช่วยเหลือน้ำท่วม', 'ภัยพิบัติ'],
      sen: 'neutral' as const
    },
    {
      content: 'เกิดเหตุดินสไลด์ปิดทับเส้นทางเข้าออกหมู่บ้านบนดอยสูง ตชด. เร่งประสานเครื่องจักรกลเข้าเปิดเส้นทาง',
      cat: 'ภัยพิบัติ' as const,
      kw: ['ดินโคลนถล่ม', 'ตชด.'],
      sen: 'negative' as const
    },
    {
      content: 'กำลังพลจิตอาสาพระราชทาน ตชด. ร่วมฟื้นฟูชุมชนและมอบถุงยังชีพแก่ผู้สูงอายุในถิ่นทุรกันดาร',
      cat: 'จิตอาสา/ช่วยเหลือ' as const,
      kw: ['จิตอาสา', 'พระราชทาน'],
      sen: 'positive' as const
    },
    {
      content: 'พิธีมอบประกาศเกียรติคุณแก่กำลังพล ตชด. ผู้ปฏิบัติงานดีเด่นและอุทิศตนเพื่อความผาสุกของประเทศ',
      cat: 'กิจกรรมองค์กร' as const,
      kw: ['กิจกรรมองค์กร', 'ตชด.', 'ฝอ.5'],
      sen: 'positive' as const
    },
    {
      content: 'หน่วยแพทย์เดินเท้า ตชด. ลงพื้นที่ตรวจสุขภาพและแจกยาสามัญประจำบ้านแก่ชนเผ่าในหุบเขา',
      cat: 'จิตอาสา/ช่วยเหลือ' as const,
      kw: ['แพทย์เดินเท้า', 'จิตอาสา', 'ตชด.'],
      sen: 'positive' as const
    }
  ];

  basePosts.forEach((bp, idx) => {
    generated.push({
      ...bp,
      id: `post-${idx + 1}`,
      matchedKeywords: bp.keywords || [],
      minutesAgo: timeOffsets[idx] || (idx + 1) * 3
    });
  });

  for (let i = basePosts.length; i < 105; i++) {
    const pageIndex = i % INITIAL_PAGES.length;
    const page = INITIAL_PAGES[pageIndex];
    const template = contentTemplates[i % contentTemplates.length];
    const minutesAgo = timeOffsets[i] || (i * 26 + 15);
    const likes = Math.floor(250 + (i * 67) % 3800);
    const comments = Math.floor(20 + (i * 13) % 290);
    const shares = Math.floor(15 + (i * 21) % 450);
    const isImportant = i % 6 === 0;

    generated.push({
      id: `post-${i + 1}`,
      pageId: page.id,
      pageName: page.name,
      pageAvatar: page.avatar,
      isVerified: page.verified,
      timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
      minutesAgo,
      content: `${template.content} (รายงานจาก ${page.name})`,
      keywords: template.kw,
      matchedKeywords: template.kw,
      category: template.cat,
      sentiment: template.sen,
      engagement: { likes, comments, shares },
      isImportant,
      bppRelated: true,
      sourceUrl: `https://facebook.com/demo/post/${1000 + i}`,
      aiSummary: `รายงานสรุปจาก ${page.name} หมวดหมู่ ${template.cat} ตรวจจับสัญญาณเนื้อหาสำคัญ`,
      reachEstimate: likes * 14 + shares * 45
    });
  }

  return generated;
};

export const INITIAL_POSTS: PostItem[] = [];

export const generateInitialAlerts = (): AlertItem[] => {
  const alerts: AlertItem[] = [
    {
      id: 'alt-1',
      title: 'ข่าวไวรัลเชิงบวกในพื้นที่ จ.เชียงใหม่',
      message: 'โพสต์เกี่ยวกับครู ตชด. เดินเท้าลุยน้ำแจกวัคซีน มียอด Engagement พุ่งสูงกว่า 1.4K ในเวลา 15 นาที',
      severity: 'high',
      pageName: 'เรารักครู ตชด.',
      postId: 'post-1',
      timestamp: '2026-09-06T06:34:00Z',
      minutesAgo: 2,
      keyword: 'ครู ตชด.',
      read: false
    },
    {
      id: 'alt-2',
      title: 'Keyword การค้นหาพุ่งสูง 42%',
      message: 'คำว่า "สกัดกั้นยาเสพติด" และ "ตชด.ร้อย 237" มีการพูดถึงหนาแน่น หลังการแถลงข่าวยึดยาบ้า 5 แสนเม็ด',
      severity: 'medium',
      pageName: 'เกาะติดปราบปรามยาเสพติดชายแดน',
      postId: 'post-2',
      timestamp: '2026-09-06T06:29:00Z',
      minutesAgo: 7,
      keyword: 'สกัดกั้นยาเสพติด',
      read: false
    },
    {
      id: 'alt-3',
      title: 'เสียงสะท้อนข้อร้องเรียนคมนาคมชายแดน',
      message: 'ชาวบ้านร้องทุกข์ผ่านเพจชุมชน กรณีดินสไลด์ปิดทางสัญจรในเขต อ.แม่สะเรียง ขอรับการสนับสนุน',
      severity: 'high',
      pageName: 'เสียงประชาชนริมชายแดน',
      postId: 'post-4',
      timestamp: '2026-09-06T06:17:00Z',
      minutesAgo: 19,
      keyword: 'ดินโคลนถล่ม',
      read: false
    },
    {
      id: 'alt-4',
      title: 'สื่อมวลชนแชร์ข่าวช่วยเหลือภัยพิบัติ',
      message: 'ข่าว ตชด.ร้อย 336 แจกจ่ายน้ำดื่มสะอาด มียอดแชร์กว่า 420 ครั้ง สะท้อนภาพลักษณ์การดูแลประชาชน',
      severity: 'info',
      pageName: 'ข่าวภาคเหนือ อัปเดตรายวัน',
      postId: 'post-5',
      timestamp: '2026-09-06T06:12:00Z',
      minutesAgo: 24,
      keyword: 'ช่วยเหลือประชาชน',
      read: false
    },
    {
      id: 'alt-5',
      title: 'เตือนภัยข่าวปลอม (Disinformation Alert)',
      message: 'ตรวจพบบัญชีไม่ระบุตัวตนบิดเบือนข้อมูลเกี่ยวกับเหตุการณ์แนวชายแดน เจ้าหน้าที่ ฝอ.5 ควรออกแถลงการณ์ชี้แจงข้อเท็จจริง',
      severity: 'critical',
      pageName: 'จับตาภัยไซเบอร์ & อาชญากรรมข้ามแดน',
      postId: 'post-15',
      timestamp: '2026-09-06T03:45:00Z',
      minutesAgo: 170,
      keyword: 'ความมั่นคงชายแดน',
      read: true
    },
    {
      id: 'alt-6',
      title: 'รายงานสถานการณ์ลาดตระเวนชายแดนใต้',
      message: 'ตชด. ภาค 4 รายงานผลการลาดตระเวนร่วม ตรวจพบความเคลื่อนไหวปกติในพื้นที่เป้าหมาย',
      severity: 'info',
      pageName: 'เกาะติดความมั่นคงชายแดนใต้',
      postId: 'post-3',
      timestamp: '2026-09-06T06:23:00Z',
      minutesAgo: 13,
      keyword: 'ตชด. ภาค 4',
      read: false
    }
  ];

  const pageNames = INITIAL_PAGES.map(p => p.name);
  const severities: ('critical' | 'high' | 'medium' | 'info')[] = ['high', 'medium', 'info', 'medium', 'info'];
  const titles = [
    'ตรวจพบประเด็นสำคัญในสื่อออนไลน์',
    'ยอด Engagement พุ่งสูงผิดปกติ',
    'ข่าวสะท้อนความเดือดร้อนประชาชน',
    'รายงานการปฏิบัติงานในพื้นที่ห่างไกล',
    'ความเคลื่อนไหวสื่อมวลชนภูมิภาค',
    'การส่งมอบสิ่งของพระราชทาน',
    'ผลการดำเนินงานจิตอาสา ตชด.',
    'สถิติการกล่าวถึงหน่วยงานเพิ่มขึ้น'
  ];

  for (let i = 6; i < 52; i++) {
    const pageName = pageNames[i % pageNames.length];
    const sev = severities[i % severities.length];
    const mins = (i * 28) + 12;
    alerts.push({
      id: `alt-${i + 1}`,
      title: titles[i % titles.length],
      message: `รายงานข้อความและกระแสตอบรับจากเพจ ${pageName} เกี่ยวข้องกับภารกิจ ตชด. และ ฝอ.5`,
      severity: sev,
      pageName,
      postId: `post-${(i % 20) + 1}`,
      timestamp: new Date(Date.now() - mins * 60000).toISOString(),
      minutesAgo: mins,
      keyword: i % 2 === 0 ? 'ตชด.' : 'ความมั่นคงชายแดน',
      read: i > 15
    });
  }

  return alerts;
};

export const INITIAL_ALERTS: AlertItem[] = [];
