import { initialBudgets } from '../data/budgetData';
import { initialTravelRecords } from '../data/travelData';
import { initialIncomingDocs } from '../data/incomingDocsData';
import { initialOutgoingDocs } from '../data/outgoingDocsData';
import { initialArchivalDocs } from '../data/archivalDocsData';
import { initialUnits, initialPersonnel } from '../data/unitsAndPersonnel';
import { initialMeetings } from '../data/meetingsData';
import { initialMissions } from '../data/missionsData';
import { DEPARTMENT_COLORS } from '../types';

export interface AdminStats {
  totalDocuments: number;
  totalIncoming: number;
  totalOutgoing: number;
  totalArchival: number;
  pendingIncoming: number;
  totalBudget: number;
  spentBudget: number;
  totalPersonnel: number;
  totalUnits: number;
  activeMissions: number;
  totalMeetings: number;
}

class AdminService {
  private budgets = [...initialBudgets];
  private travelRecords = [...initialTravelRecords];
  private incomingDocs = [...initialIncomingDocs];
  private outgoingDocs = [...initialOutgoingDocs];
  private archivalDocs = [...initialArchivalDocs];
  private units = [...initialUnits];
  private personnel = [...initialPersonnel];
  private meetings = [...initialMeetings];
  private missions = [...initialMissions];

  public getStats(): AdminStats {
    const totalDocs = this.incomingDocs.length + this.outgoingDocs.length + this.archivalDocs.length;
    const pendingInc = this.incomingDocs.filter(d => d.status === 'รอดำเนินการ' || d.status === 'รับแล้ว').length;
    const totalBudget = this.budgets.reduce((sum, b) => sum + (b.allocated_amount || 0), 0);
    const spentBudget = this.budgets.reduce((sum, b) => sum + (b.spent_amount || 0), 0);
    const activeMissions = this.missions.filter(m => m.status === 'กำลังดำเนินการ' || m.status === 'รอดำเนินการ').length;

    return {
      totalDocuments: totalDocs,
      totalIncoming: this.incomingDocs.length,
      totalOutgoing: this.outgoingDocs.length,
      totalArchival: this.archivalDocs.length,
      pendingIncoming: pendingInc,
      totalBudget,
      spentBudget,
      totalPersonnel: this.personnel.length,
      totalUnits: this.units.length,
      activeMissions,
      totalMeetings: this.meetings.length,
    };
  }

  public getIncomingDocs() {
    return this.incomingDocs;
  }

  public getOutgoingDocs() {
    return this.outgoingDocs;
  }

  public getArchivalDocs() {
    return this.archivalDocs;
  }

  public getBudgets() {
    return this.budgets;
  }

  public getMissions() {
    return this.missions;
  }

  public getPersonnel() {
    return this.personnel;
  }

  public getUnits() {
    return this.units;
  }

  public getMeetings() {
    return this.meetings;
  }

  public getDepartmentColor() {
    return DEPARTMENT_COLORS.admin;
  }
}

export const adminService = new AdminService();
