import {
  DisasterIncident,
  HydrologicalStation,
  RainfallTelemetry,
  MapPoint,
} from '../types';

export const initialIncidents: DisasterIncident[] = [];

export const initialHydrologicalStations: HydrologicalStation[] = [];

export const initialRainfallData: RainfallTelemetry[] = [];

export const initialMapPoints: MapPoint[] = [];

// 24-hour rainfall trend (mm/hour)
export const rainfallChartData: any[] = [];

// River Water Level vs Warning and Bankfull Levels
export const waterLevelChartData: any[] = [];

// Affected Area trend (Rai or km2 over past 7 days)
export const affectedAreaTrendData: any[] = [];

// Weekly Incident Trend by Type
export const incidentTrendData: any[] = [];
