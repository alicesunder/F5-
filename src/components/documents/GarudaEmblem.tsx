import React from 'react';
import { GARUDA_PATH_D, GARUDA_TRANSFORM, GARUDA_VIEWBOX } from './garudaPath';

interface GarudaEmblemProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

/**
 * ตราครุฑพ่าห์ สำหรับเอกสารราชการไทย
 * ตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. ๒๕๒๖ และฉบับแก้ไขเพิ่มเติม
 * - ขนาด ๓ เซนติเมตร (md): สำหรับหนังสือภายนอก, คำสั่ง, ระเบียบ, ข้อบังคับ, ประกาศ (วางกึ่งกลางหน้า)
 * - ขนาด ๑.๕ เซนติเมตร (sm): สำหรับหนังสือภายใน (บันทึกข้อความ) (วางมุมบนด้านซ้าย)
 * - ขนาด ๔.๕ เซนติเมตร (lg): สำหรับตราประทับ พระราชโองการ หรือเอกสารพิธีการพิเศษ
 */
export const GarudaEmblem: React.FC<GarudaEmblemProps> = ({
  size = 'md',
  className = '',
  alt = 'ตราครุฑพ่าห์ราชการ (ตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ)',
}) => {
  // Thai Government Saraban standard physical sizes
  // - sm = 1.5 cm (15mm)
  // - md = 3.0 cm (30mm)
  // - lg = 4.5 cm (45mm)
  const sizeStyles = {
    sm: 'h-[1.5cm] min-h-[42px] max-h-[50px] w-auto',
    md: 'h-[3cm] min-h-[85px] max-h-[105px] w-auto',
    lg: 'h-[4.5cm] min-h-[130px] max-h-[150px] w-auto',
    xl: 'h-[6cm] min-h-[180px] max-h-[210px] w-auto',
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none shrink-0 ${sizeStyles[size]} ${className}`}
      aria-label={alt}
      title={alt}
    >
      <svg
        viewBox={GARUDA_VIEWBOX}
        className="h-full w-auto object-contain text-black fill-current drop-shadow-2xs print:drop-shadow-none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={alt}
      >
        <g transform={GARUDA_TRANSFORM}>
          <path
            d={GARUDA_PATH_D}
            fill="#000000"
            fillRule="evenodd"
          />
        </g>
      </svg>
    </div>
  );
};

