import { describe, it, expect, beforeEach } from 'vitest';
import { clientStorage } from './clientStorage';

describe('clientStorage — Local & Demo State Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default demo profile if storage is empty', () => {
    const profile = clientStorage.getProfile();
    expect(profile).toBeDefined();
    expect(profile.fullName).toBe('Ramesh Kumar');
    expect(profile.state).toBe('Delhi');
    expect(profile.workCategory).toBe('delivery');
  });

  it('saves and updates profile correctly', () => {
    const original = clientStorage.getProfile();
    const updated = {
      ...original,
      fullName: 'Vikram Singh',
      state: 'Punjab',
      workCategory: 'driver' as const,
    };

    clientStorage.saveProfile(updated);
    const retrieved = clientStorage.getProfile();

    expect(retrieved.fullName).toBe('Vikram Singh');
    expect(retrieved.state).toBe('Punjab');
    expect(retrieved.workCategory).toBe('driver');
  });

  it('manages demo mode flag', () => {
    expect(clientStorage.isDemoMode()).toBe(true);

    clientStorage.setDemoMode(false);
    expect(clientStorage.isDemoMode()).toBe(false);

    clientStorage.setDemoMode(true);
    expect(clientStorage.isDemoMode()).toBe(true);
  });

  it('manages preferred language', () => {
    expect(clientStorage.getLanguage()).toBe('en');

    clientStorage.setLanguage('hi');
    expect(clientStorage.getLanguage()).toBe('hi');

    clientStorage.setLanguage('pa');
    expect(clientStorage.getLanguage()).toBe('pa');
  });

  it('performs CRUD operations on earnings records', () => {
    const initial = clientStorage.getEarnings();
    expect(initial.length).toBeGreaterThan(0);

    const added = clientStorage.addEarning({
      date: '2026-10-17',
      workCategory: 'delivery',
      platformOrEmployer: 'Swiggy',
      grossEarnings: 1500,
      bonuses: 100,
      tips: 50,
      deductions: 50,
      expenses: 300,
      hoursWorked: 6,
      paymentMode: 'digital',
      disputeStatus: 'none',
    });

    expect(added.id).toBeDefined();
    // 1500 + 100 + 50 - 50 - 300 = 1300
    expect(added.netEarnings).toBe(1300);

    const afterAdd = clientStorage.getEarnings();
    expect(afterAdd.length).toBe(initial.length + 1);

    // Update earning
    const updated = clientStorage.updateEarning(added.id, {
      grossEarnings: 1800,
    });
    expect(updated).not.toBeNull();
    // 1800 + 100 + 50 - 50 - 300 = 1600
    expect(updated?.netEarnings).toBe(1600);

    // Delete earning
    const deleted = clientStorage.deleteEarning(added.id);
    expect(deleted).toBe(true);

    const afterDelete = clientStorage.getEarnings();
    expect(afterDelete.length).toBe(initial.length);
  });

  it('performs CRUD operations on grievance drafts', () => {
    const initial = clientStorage.getGrievances();
    expect(initial.length).toBeGreaterThan(0);

    const added = clientStorage.addGrievance({
      category: 'unfair_deduction',
      platformOrEmployer: 'Zomato',
      disputedAmount: 120,
      incidentDate: '2026-10-17',
      language: 'en',
      tone: 'formal_assertive',
      subjectLine: 'Dispute regarding unfair late pickup penalty',
      draftContent: 'Formal appeal letter text...',
      status: 'draft',
    });

    expect(added.id).toBeDefined();
    expect(added.disputedAmount).toBe(120);

    const list = clientStorage.getGrievances();
    expect(list.length).toBe(initial.length + 1);

    const deleted = clientStorage.deleteGrievance(added.id);
    expect(deleted).toBe(true);

    const listAfter = clientStorage.getGrievances();
    expect(listAfter.length).toBe(initial.length);
  });

  it('performs CRUD operations on document drafts', () => {
    const initial = clientStorage.getDocuments();

    const added = clientStorage.addDocument({
      docType: 'invoice_request',
      title: 'Payment Invoice - Swiggy',
      language: 'en',
      metadata: { amount: 3200 },
      generatedContent: 'Invoice statement details...',
    });

    expect(added.id).toBeDefined();

    const list = clientStorage.getDocuments();
    expect(list.length).toBe(initial.length + 1);

    const deleted = clientStorage.deleteDocument(added.id);
    expect(deleted).toBe(true);
  });

  it('persists safety checklist items', () => {
    const initial = clientStorage.getSafetyChecklist();
    expect(initial.length).toBeGreaterThan(0);

    const item = initial[0];
    const toggled = clientStorage.toggleChecklistItem(item.id);
    expect(toggled[0].checked).toBe(!item.checked);
  });
});
