// Client storage and state management with seamless offline & demo persistence

import { 
  UserProfile, 
  EarningRecord, 
  GrievanceDraft, 
  DocumentDraft, 
  SafetyChecklistItem,
  SupportedLanguage 
} from '@/types';
import { 
  DEMO_PROFILE, 
  DEMO_EARNINGS, 
  DEMO_GRIEVANCES, 
  DEMO_DOCUMENTS 
} from './demoData';
import { INITIAL_PRE_SHIFT_CHECKLIST } from '../knowledge/safetyData';
import { calculateNetEarnings, aggregateEarnings } from '../calculations';

const KEYS = {
  IS_DEMO: 'gwc_is_demo_v1',
  PROFILE: 'gwc_user_profile_v1',
  EARNINGS: 'gwc_earnings_v1',
  GRIEVANCES: 'gwc_grievances_v1',
  DOCUMENTS: 'gwc_documents_v1',
  CHECKLIST: 'gwc_safety_checklist_v1',
  LANGUAGE: 'gwc_language_v1'
};

class ClientStorage {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Demo Mode Status ---
  isDemoMode(): boolean {
    if (!this.isBrowser()) return true;
    const stored = localStorage.getItem(KEYS.IS_DEMO);
    if (stored === null) {
      // Default to true for friction-free exploration unless Supabase auth user is logged in
      return true;
    }
    return stored === 'true';
  }

  setDemoMode(val: boolean): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.IS_DEMO, val ? 'true' : 'false');
  }

  // --- Preferred Language ---
  getLanguage(): SupportedLanguage {
    if (!this.isBrowser()) return 'en';
    const lang = localStorage.getItem(KEYS.LANGUAGE) as SupportedLanguage;
    return lang || 'en';
  }

  setLanguage(lang: SupportedLanguage): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.LANGUAGE, lang);
  }

  // --- Profile ---
  getProfile(): UserProfile {
    if (!this.isBrowser()) return DEMO_PROFILE;
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) {
      this.saveProfile(DEMO_PROFILE);
      return DEMO_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_PROFILE;
    }
  }

  saveProfile(profile: UserProfile): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }

  // --- Earnings Records (CRUD) ---
  getEarnings(): EarningRecord[] {
    if (!this.isBrowser()) return DEMO_EARNINGS;
    const raw = localStorage.getItem(KEYS.EARNINGS);
    if (!raw) {
      this.saveAllEarnings(DEMO_EARNINGS);
      return DEMO_EARNINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_EARNINGS;
    }
  }

  saveAllEarnings(records: EarningRecord[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.EARNINGS, JSON.stringify(records));
  }

  getSummary() {
    return aggregateEarnings(this.getEarnings());
  }

  addEarning(record: Omit<EarningRecord, 'id' | 'createdAt' | 'netEarnings'>): EarningRecord {
    const records = this.getEarnings();
    const netEarnings = calculateNetEarnings({
      grossEarnings: record.grossEarnings,
      bonuses: record.bonuses,
      tips: record.tips,
      deductions: record.deductions,
      expenses: record.expenses
    });

    const newRecord: EarningRecord = {
      ...record,
      id: `shift-${Date.now()}`,
      netEarnings,
      createdAt: new Date().toISOString()
    };

    records.unshift(newRecord);
    this.saveAllEarnings(records);
    return newRecord;
  }

  updateEarning(id: string, updates: Partial<EarningRecord>): EarningRecord | null {
    const records = this.getEarnings();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const current = records[index];
    const merged = { ...current, ...updates };
    merged.netEarnings = calculateNetEarnings({
      grossEarnings: merged.grossEarnings,
      bonuses: merged.bonuses,
      tips: merged.tips,
      deductions: merged.deductions,
      expenses: merged.expenses
    });

    records[index] = merged;
    this.saveAllEarnings(records);
    return merged;
  }

  deleteEarning(id: string): boolean {
    const records = this.getEarnings();
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length === records.length) return false;
    this.saveAllEarnings(filtered);
    return true;
  }

  // --- Grievance Drafts ---
  getGrievances(): GrievanceDraft[] {
    if (!this.isBrowser()) return DEMO_GRIEVANCES;
    const raw = localStorage.getItem(KEYS.GRIEVANCES);
    if (!raw) {
      this.saveAllGrievances(DEMO_GRIEVANCES);
      return DEMO_GRIEVANCES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_GRIEVANCES;
    }
  }

  saveAllGrievances(drafts: GrievanceDraft[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.GRIEVANCES, JSON.stringify(drafts));
  }

  addGrievance(draft: Omit<GrievanceDraft, 'id' | 'createdAt'>): GrievanceDraft {
    const drafts = this.getGrievances();
    const newDraft: GrievanceDraft = {
      ...draft,
      id: `grievance-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    drafts.unshift(newDraft);
    this.saveAllGrievances(drafts);
    return newDraft;
  }

  deleteGrievance(id: string): boolean {
    const drafts = this.getGrievances();
    const filtered = drafts.filter((d) => d.id !== id);
    if (filtered.length === drafts.length) return false;
    this.saveAllGrievances(filtered);
    return true;
  }

  // --- Document Drafts ---
  getDocuments(): DocumentDraft[] {
    if (!this.isBrowser()) return DEMO_DOCUMENTS;
    const raw = localStorage.getItem(KEYS.DOCUMENTS);
    if (!raw) {
      this.saveAllDocuments(DEMO_DOCUMENTS);
      return DEMO_DOCUMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_DOCUMENTS;
    }
  }

  saveAllDocuments(docs: DocumentDraft[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));
  }

  addDocument(doc: Omit<DocumentDraft, 'id' | 'createdAt'>): DocumentDraft {
    const docs = this.getDocuments();
    const newDoc: DocumentDraft = {
      ...doc,
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    docs.unshift(newDoc);
    this.saveAllDocuments(docs);
    return newDoc;
  }

  deleteDocument(id: string): boolean {
    const docs = this.getDocuments();
    const filtered = docs.filter((d) => d.id !== id);
    if (filtered.length === docs.length) return false;
    this.saveAllDocuments(filtered);
    return true;
  }

  // --- Safety Checklist ---
  getSafetyChecklist(): SafetyChecklistItem[] {
    if (!this.isBrowser()) return INITIAL_PRE_SHIFT_CHECKLIST;
    const raw = localStorage.getItem(KEYS.CHECKLIST);
    if (!raw) {
      this.saveSafetyChecklist(INITIAL_PRE_SHIFT_CHECKLIST);
      return INITIAL_PRE_SHIFT_CHECKLIST;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRE_SHIFT_CHECKLIST;
    }
  }

  saveSafetyChecklist(items: SafetyChecklistItem[]): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(items));
  }

  toggleChecklistItem(id: string): SafetyChecklistItem[] {
    const items = this.getSafetyChecklist();
    const updated = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    this.saveSafetyChecklist(updated);
    return updated;
  }

  // --- Reset & Export ---
  resetToDemo(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(KEYS.IS_DEMO, 'true');
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(DEMO_PROFILE));
    localStorage.setItem(KEYS.EARNINGS, JSON.stringify(DEMO_EARNINGS));
    localStorage.setItem(KEYS.GRIEVANCES, JSON.stringify(DEMO_GRIEVANCES));
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(DEMO_DOCUMENTS));
    localStorage.setItem(KEYS.CHECKLIST, JSON.stringify(INITIAL_PRE_SHIFT_CHECKLIST));
  }

  exportAllDataJson(): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      earnings: this.getEarnings(),
      grievances: this.getGrievances(),
      documents: this.getDocuments(),
      safetyChecklist: this.getSafetyChecklist()
    };
    return JSON.stringify(payload, null, 2);
  }

  exportEarningsCsv(): string {
    const earnings = this.getEarnings();
    const headers = [
      'Date',
      'Work Category',
      'Platform/Employer',
      'Trip/Order ID',
      'Gross Earnings (INR)',
      'Bonuses (INR)',
      'Tips (INR)',
      'Deductions (INR)',
      'Expenses (INR)',
      'Net Earnings (INR)',
      'Hours Worked',
      'Distance (km)',
      'Payment Mode',
      'Notes'
    ];

    const rows = earnings.map((e) => [
      `"${e.date}"`,
      `"${e.workCategory}"`,
      `"${e.platformOrEmployer}"`,
      `"${e.tripOrOrderId || ''}"`,
      e.grossEarnings,
      e.bonuses,
      e.tips,
      e.deductions,
      e.expenses,
      e.netEarnings,
      e.hoursWorked,
      e.distanceKm || 0,
      `"${e.paymentMode}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const clientStorage = new ClientStorage();
