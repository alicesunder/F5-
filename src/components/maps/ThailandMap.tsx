import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color: string;
  label: string;
  /** วงกลมรัศมีเป็นกิโลเมตร (เช่น พื้นที่ฝนตกหนัก) ถ้าไม่ใส่จะเป็นหมุดจุด */
  radiusKm?: number;
  shape?: 'circle' | 'diamond';
  pulse?: boolean;
  selected?: boolean;
}

interface Props {
  markers: MapMarker[];
  onSelect?: (id: string) => void;
  className?: string;
}

// ขอบเขตประเทศไทย ใช้เป็นมุมมองเริ่มต้น
const THAILAND: L.LatLngBoundsExpression = [
  [5.6, 97.3],
  [20.5, 105.7],
];

/** แผนที่จริงของประเทศไทย (OpenStreetMap) ซูม/เลื่อนได้ ใช้ร่วมกันทุกหน้าที่ต้องแสดงพิกัด */
export const ThailandMap: React.FC<Props> = ({ markers, onSelect, className = '' }) => {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.LayerGroup | null>(null);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { zoomControl: false, attributionControl: true, minZoom: 4 }).fitBounds(THAILAND);
    L.control.zoom({ position: 'topright', zoomInTitle: 'ขยาย', zoomOutTitle: 'ย่อ' }).addTo(m);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; ผู้ร่วมพัฒนา <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    map.current = m;
    // แผนที่อยู่ในกล่องที่อาจเปลี่ยนขนาดตอนสลับแท็บ ให้คำนวณขนาดใหม่
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    for (const mk of markers) {
      if (!Number.isFinite(mk.lat) || !Number.isFinite(mk.lng)) continue;
      let shape: L.Layer;
      if (mk.radiusKm) {
        shape = L.circle([mk.lat, mk.lng], {
          radius: mk.radiusKm * 1000,
          color: mk.color,
          weight: mk.selected ? 3 : 1.5,
          fillColor: mk.color,
          fillOpacity: 0.25,
        });
      } else if (mk.shape === 'diamond') {
        const size = mk.selected ? 22 : 16;
        shape = L.marker([mk.lat, mk.lng], {
          icon: L.divIcon({
            className: '',
            iconSize: [size, size],
            html: `<div style="width:${size}px;height:${size}px;background:${mk.color};border:2px solid #fff;transform:rotate(45deg);box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
          }),
        });
      } else {
        shape = L.circleMarker([mk.lat, mk.lng], {
          radius: mk.selected ? 11 : 8,
          color: '#fff',
          weight: 2,
          fillColor: mk.color,
          fillOpacity: 1,
          className: mk.pulse ? 'fo5-pulse' : undefined,
        });
      }
      (shape as L.Layer & { bindTooltip: (s: string) => void }).bindTooltip(mk.label);
      shape.on('click', () => selectRef.current?.(mk.id));
      g.addLayer(shape);
    }
  }, [markers]);

  return (
    <>
      <style>{`.fo5-pulse{animation:fo5pulse 1.4s ease-out infinite}@keyframes fo5pulse{0%{stroke-width:2;stroke-opacity:1}100%{stroke-width:14;stroke-opacity:0}}.leaflet-container{font-family:inherit}`}</style>
      <div ref={el} className={`w-full h-full z-0 ${className}`} role="region" aria-label="แผนที่ประเทศไทย" />
    </>
  );
};
