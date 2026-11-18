import { DisasterIncident, DisasterStats } from '../types';

/**
 * Exports disaster incidents to a properly formatted CSV with UTF-8 BOM
 * ensuring Thai characters render cleanly in Excel and Google Sheets.
 */
export const exportIncidentsToCSV = (incidents: DisasterIncident[], filename?: string) => {
  const defaultFilename = filename || `รายงานสาธารณภัย_ศปภ_${new Date().toISOString().slice(0, 10)}.csv`;

  const headers = [
    'รหัสเหตุการณ์',
    'หัวข้อเหตุการณ์',
    'ประเภทเหตุ',
    'ระดับความรุนแรง',
    'สถานะ',
    'จังหวัด',
    'อำเภอ',
    'ตำบล',
    'หมู่บ้าน/ชุมชน',
    'พิกัด ละติจูด',
    'พิกัด ลองจิจูด',
    'เวลาที่รับแจ้ง',
    'เวลาที่อัปเดตล่าสุด',
    'ครัวเรือนที่ได้รับผลกระทบ',
    'ผู้ประสบภัย (คน)',
    'ผู้บาดเจ็บ',
    'ผู้เสียชีวิต',
    'ระดับน้ำ (ซม.)',
    'ปริมาณฝน (มม.)',
    'หน่วยงานรับผิดชอบ',
    'หัวหน้าชุดปฏิบัติการ',
    'เบอร์โทรติดต่อ',
    'ศูนย์พักพิง',
    'รายละเอียดเหตุการณ์',
  ];

  const rows = incidents.map(item => [
    `"${item.id}"`,
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.type}"`,
    `"${item.severity}"`,
    `"${item.status}"`,
    `"${item.province}"`,
    `"${item.district}"`,
    `"${item.subdistrict}"`,
    `"${item.village || '-'}"`,
    item.coordinates.lat,
    item.coordinates.lng,
    `"${item.reportedAt}"`,
    `"${item.updatedAt}"`,
    item.affectedHouseholds,
    item.affectedPeople,
    item.casualties.injured,
    item.casualties.deceased,
    item.waterLevelCm || 0,
    item.rainfallMm || 0,
    `"${item.assignedUnit.replace(/"/g, '""')}"`,
    `"${item.officerInCharge}"`,
    `"${item.officerPhone}"`,
    `"${item.shelterLocation || '-'}"`,
    `"${item.description.replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', defaultFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates an Excel-compatible XML HTML format file
 */
export const exportIncidentsToExcel = (incidents: DisasterIncident[], filename?: string) => {
  const defaultFilename = filename || `รายงานสาธารณภัย_ศปภ_${new Date().toISOString().slice(0, 10)}.xls`;

  let htmlTable = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Disaster Incidents</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <style>
        th { background-color: #8191BA; color: #ffffff; font-weight: bold; padding: 6px; }
        td { padding: 5px; border: 0.5pt solid #cccccc; }
      </style>
    </head>
    <body>
      <h3>รายงานสรุปสถานการณ์สาธารณภัย - ฝ่ายสาธารณภัย ศปภ.</h3>
      <p>ข้อมูล ณ วันที่: ${new Date().toLocaleDateString('th-TH', { dateStyle: 'full' })}</p>
      <table border="1">
        <thead>
          <tr>
            <th>รหัส</th>
            <th>หัวข้อเหตุการณ์</th>
            <th>ประเภทภัย</th>
            <th>ความรุนแรง</th>
            <th>สถานะ</th>
            <th>จังหวัด</th>
            <th>อำเภอ</th>
            <th>ครัวเรือนกระทบ</th>
            <th>ผู้ประสบภัย (คน)</th>
            <th>ระดับน้ำ (ซม.)</th>
            <th>หน่วยรับผิดชอบ</th>
            <th>เบอร์ติดต่อ</th>
          </tr>
        </thead>
        <tbody>
          ${incidents
            .map(
              i => `
            <tr>
              <td>${i.id}</td>
              <td>${i.title}</td>
              <td>${i.type}</td>
              <td>${i.severity}</td>
              <td>${i.status}</td>
              <td>${i.province}</td>
              <td>${i.district}</td>
              <td align="right">${i.affectedHouseholds}</td>
              <td align="right">${i.affectedPeople}</td>
              <td align="right">${i.waterLevelCm || 0}</td>
              <td>${i.assignedUnit}</td>
              <td>${i.officerPhone}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\uFEFF' + htmlTable], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', defaultFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Triggers clean print view for official PDF generation
 */
export const printDisasterReport = () => {
  window.print();
};
