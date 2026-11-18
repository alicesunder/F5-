import { HydrologicalStation } from '../types';
import { initialHydrologicalStations } from './disasterMockData';

/**
 * Approximate reference coordinates for the province each monitored station
 * sits in. Good enough for a "nearest station" helper and map centering —
 * not survey-grade station coordinates.
 */
export const PROVINCE_COORDS: Record<string, { lat: number; lng: number }> = {
  นครสวรรค์: { lat: 15.7047, lng: 100.1372 },
  สุโขทัย: { lat: 17.0068, lng: 99.8265 },
  น่าน: { lat: 18.7756, lng: 100.7730 },
  เชียงใหม่: { lat: 18.7883, lng: 98.9853 },
  อุบลราชธานี: { lat: 15.2286, lng: 104.8574 },
  เชียงราย: { lat: 20.0208, lng: 99.8880 },
};

export type ChainStage = 'upstream' | 'reference' | 'downstream';

export interface ChainStation extends HydrologicalStation {
  stage: ChainStage;
}

/** Haversine distance in kilometers between two lat/lng points. */
export const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
};

/**
 * Every monitored basin currently has exactly one telemetry station in the
 * dataset. To show a meaningful upstream → reference → downstream chain
 * (like the source platform's River Chain view) we derive a plausible
 * neighbour reading on each side from that single station, offset by a
 * deterministic percentage of its own level — clearly a same-basin
 * estimate, not a second physical station.
 */
export const buildRiverChain = (station: HydrologicalStation): ChainStation[] => {
  const upstreamLevel = +(station.currentWaterLevel * 0.82).toFixed(2);
  const downstreamLevel = +(station.currentWaterLevel * 1.08).toFixed(2);

  const pctOf = (level: number, bankfull: number) => Math.round((level / bankfull) * 100);

  const upstream: ChainStation = {
    ...station,
    id: `${station.id}-UP`,
    code: `${station.code}*`,
    name: `พื้นที่ต้นน้ำ (เหนือสถานี ${station.code})`,
    currentWaterLevel: upstreamLevel,
    capacityPercent: pctOf(upstreamLevel, station.bankfullLevel),
    status: upstreamLevel >= station.warningLevel ? (upstreamLevel >= station.bankfullLevel ? 'critical' : 'warning') : 'normal',
    stage: 'upstream',
  };

  const downstream: ChainStation = {
    ...station,
    id: `${station.id}-DOWN`,
    code: `${station.code}*`,
    name: `พื้นที่ท้ายน้ำ (ใต้สถานี ${station.code})`,
    currentWaterLevel: downstreamLevel,
    capacityPercent: pctOf(downstreamLevel, station.bankfullLevel),
    status: downstreamLevel >= station.warningLevel ? (downstreamLevel >= station.bankfullLevel ? 'critical' : 'warning') : 'normal',
    stage: 'downstream',
  };

  const reference: ChainStation = { ...station, stage: 'reference' };

  return [upstream, reference, downstream];
};

/**
 * Deterministic 7-day water-level series for a station's detail chart.
 * Seeded from the station code so re-renders stay stable (no Math.random).
 */
export const buildHistoricalSeries = (station: HydrologicalStation) => {
  let seed = Array.from(station.code).reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const days = ['วันที่ 1', 'วันที่ 2', 'วันที่ 3', 'วันที่ 4', 'วันที่ 5', 'วันที่ 6', 'วันนี้'];
  const trendBias = station.trend === 'rising' ? 0.045 : station.trend === 'falling' ? -0.035 : 0;

  let level = station.currentWaterLevel - trendBias * 6 * station.currentWaterLevel;
  return days.map((label, idx) => {
    level += trendBias * station.currentWaterLevel + (next() - 0.5) * 0.03 * station.currentWaterLevel;
    const isToday = idx === days.length - 1;
    return {
      day: label,
      level: +(isToday ? station.currentWaterLevel : level).toFixed(2),
      bankfull: station.bankfullLevel,
      warning: station.warningLevel,
    };
  });
};

export const allStations = initialHydrologicalStations;
