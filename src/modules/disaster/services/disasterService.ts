import {
  DisasterIncident,
  IncidentStatus,
  DisasterStats,
  MapPoint,
  HydrologicalStation,
  RainfallTelemetry,
  IncidentAttachment,
  IncidentTimelineEvent,
} from '../types';
import { getCollectionStore } from '../../../lib/collections';

const incidentStore = getCollectionStore<DisasterIncident>('disaster.incidents');
const pointStore = getCollectionStore<MapPoint>('disaster.map_points');


class DisasterService {
  private incidents: DisasterIncident[] = [];
  private mapPoints: MapPoint[] = [];
  private stations: HydrologicalStation[] = [];
  private rainfalls: RainfallTelemetry[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const sync = () => {
      this.incidents = structuredClone(incidentStore.items);
      this.mapPoints = structuredClone(pointStore.items);
      this.notify();
    };
    incidentStore.subscribe(sync);
    pointStore.subscribe(sync);
    incidentStore.ensureLoaded();
    pointStore.ensureLoaded();
    sync();
  }

  private saveToStorage() {
    void incidentStore.set(structuredClone(this.incidents));
    void pointStore.set(structuredClone(this.mapPoints));
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // --- Incidents CRUD ---

  public getIncidents(): DisasterIncident[] {
    return [...this.incidents];
  }

  public getIncidentById(id: string): DisasterIncident | undefined {
    return this.incidents.find(i => i.id === id);
  }

  public createIncident(
    data: Omit<DisasterIncident, 'id' | 'reportedAt' | 'updatedAt' | 'timeline' | 'attachments'> & {
      attachments?: IncidentAttachment[];
    }
  ): DisasterIncident {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeFormatted = now.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const timestampStr = `${dateFormatted} ${timeFormatted} น.`;

    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = `DIS-2569-${randomSuffix}`;

    const newTimeline: IncidentTimelineEvent[] = [
      {
        id: `tl-${Date.now()}-1`,
        time: timeFormatted + ' น.',
        title: 'สร้างรายงานเหตุการณ์',
        description: `บันทึกข้อมูลเหตุการณ์เข้าระบบศูนย์สาธารณภัย โดย ${data.officerInCharge || 'เจ้าหน้าที่รับแจ้ง'}`,
        actor: data.officerInCharge || 'ศูนย์วิทยุเตือนภัย',
        statusChange: data.status,
      },
    ];

    const newIncident: DisasterIncident = {
      ...data,
      id: newId,
      reportedAt: timestampStr,
      updatedAt: timestampStr,
      attachments: data.attachments || [],
      timeline: newTimeline,
    };

    this.incidents = [newIncident, ...this.incidents];

    // Auto-create map point
    if (newIncident.coordinates.lat && newIncident.coordinates.lng) {
      const newMapPoint: MapPoint = {
        id: `mp-${newId}`,
        name: newIncident.title,
        category: newIncident.type.includes('น้ำ') ? 'floods' : 'incidents',
        lat: newIncident.coordinates.lat,
        lng: newIncident.coordinates.lng,
        province: newIncident.province,
        district: newIncident.district,
        severity: newIncident.severity,
        statusText: `สถานะ: ${newIncident.status}`,
        details: newIncident.description,
        incidentId: newId,
      };
      this.mapPoints = [newMapPoint, ...this.mapPoints];
    }

    this.saveToStorage();
    return newIncident;
  }

  public updateIncident(id: string, updates: Partial<DisasterIncident>): DisasterIncident | null {
    const index = this.incidents.findIndex(i => i.id === id);
    if (index === -1) return null;

    const existing = this.incidents[index];
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`;

    const updatedTimeline = [...existing.timeline];
    if (updates.status && updates.status !== existing.status) {
      updatedTimeline.unshift({
        id: `tl-${Date.now()}`,
        time: now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
        title: `ปรับสถานะเป็น "${updates.status}"`,
        description: `ปรับปรุงสถานะการปฏิบัติงานในพื้นที่`,
        actor: updates.officerInCharge || existing.officerInCharge || 'ผู้บังคับบัญชาส่วนหน้า',
        statusChange: updates.status,
      });
    }

    const updatedIncident: DisasterIncident = {
      ...existing,
      ...updates,
      updatedAt: timestampStr,
      timeline: updatedTimeline,
    };

    this.incidents[index] = updatedIncident;

    // Update corresponding map point if exists
    const mapIndex = this.mapPoints.findIndex(mp => mp.incidentId === id);
    if (mapIndex !== -1) {
      this.mapPoints[mapIndex] = {
        ...this.mapPoints[mapIndex],
        name: updatedIncident.title,
        severity: updatedIncident.severity,
        statusText: `สถานะ: ${updatedIncident.status}`,
        details: updatedIncident.description,
        lat: updatedIncident.coordinates.lat,
        lng: updatedIncident.coordinates.lng,
      };
    }

    this.saveToStorage();
    return updatedIncident;
  }

  public updateIncidentStatus(
    id: string,
    newStatus: IncidentStatus,
    actorName: string = 'เจ้าหน้าที่ปฏิบัติการ',
    note?: string
  ): boolean {
    const incident = this.incidents.find(i => i.id === id);
    if (!incident) return false;

    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

    const timelineEntry: IncidentTimelineEvent = {
      id: `tl-${Date.now()}`,
      time: timeFormatted + ' น.',
      title: `เปลี่ยนสถานะเป็น "${newStatus}"`,
      description: note || `ปรับสถานะการควบคุมเหตุการณ์`,
      actor: actorName,
      statusChange: newStatus,
    };

    incident.status = newStatus;
    incident.updatedAt = `${now.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })} ${timeFormatted} น.`;
    incident.timeline = [timelineEntry, ...incident.timeline];

    this.saveToStorage();
    return true;
  }

  public deleteIncident(id: string): boolean {
    const initialLen = this.incidents.length;
    this.incidents = this.incidents.filter(i => i.id !== id);
    this.mapPoints = this.mapPoints.filter(mp => mp.incidentId !== id);
    if (this.incidents.length !== initialLen) {
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public addAttachment(incidentId: string, attachment: Omit<IncidentAttachment, 'id' | 'uploadedAt'>) {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    const now = new Date();
    const newAtt: IncidentAttachment = {
      ...attachment,
      id: `att-${Date.now()}`,
      uploadedAt: `${now.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.`,
    };

    incident.attachments = [newAtt, ...incident.attachments];
    this.saveToStorage();
    return newAtt;
  }

  // --- Statistics ---

  public getStats(): DisasterStats {
    const inProgress = this.incidents.filter(i => i.status === 'กำลังดำเนินการ').length;
    const critical = this.incidents.filter(i => i.severity === 'วิกฤต').length;
    const controlled = this.incidents.filter(i => i.status === 'ควบคุมสถานการณ์').length;
    const resolved = this.incidents.filter(i => i.status === 'เสร็จสิ้น').length;

    const affectedHouseholds = this.incidents.reduce((acc, i) => acc + (i.affectedHouseholds || 0), 0);
    const affectedPeople = this.incidents.reduce((acc, i) => acc + (i.affectedPeople || 0), 0);

    // Watch areas count based on active telemetry + watchpoints
    const watchAreas = this.mapPoints.filter(p => p.category === 'watchpoints' || p.category === 'risk_zones').length + 8;

    const latest = this.incidents[0];

    return {
      totalIncidents: this.incidents.length,
      inProgressIncidents: inProgress,
      watchAreasCount: watchAreas,
      affectedHouseholdsTotal: affectedHouseholds,
      affectedPeopleTotal: affectedPeople,
      latestReportTime: latest?.reportedAt || '10 ก.ย. 2569 11:30 น.',
      latestIncidentTitle: latest?.title || 'ไม่มีรายงานเหตุใหม่',
      criticalCount: critical,
      controlledCount: controlled,
      resolvedCount: resolved,
    };
  }

  // --- Map and Telemetry ---

  public getMapPoints(): MapPoint[] {
    return [...this.mapPoints];
  }

  public getHydrologicalStations(): HydrologicalStation[] {
    return [...this.stations];
  }

  public getRainfallData(): RainfallTelemetry[] {
    return [...this.rainfalls];
  }
}

export const disasterService = new DisasterService();
