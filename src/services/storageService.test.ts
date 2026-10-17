import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from './storageService';

describe('storageService — Legacy Shift & Dispute Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves initial pre-seeded shifts if storage is clean', () => {
    const shifts = storageService.getShifts();
    expect(shifts.length).toBeGreaterThanOrEqual(4);
    expect(shifts[0].platform).toBeDefined();
    expect(shifts[0].grossEarnings).toBeGreaterThan(0);
  });

  it('adds a new shift and persists it', () => {
    const initial = storageService.getShifts();
    const newShift = {
      id: 'shift-new-1',
      date: '2026-10-17',
      platform: 'Uber',
      grossEarnings: 2200,
      platformFee: 440,
      fuelCost: 500,
      tips: 100,
      incentives: 150,
      deductions: 0,
      hoursWorked: 7,
      kmDriven: 80,
      tripCount: 12,
      notes: 'Morning airport trips',
      disputeStatus: 'none',
      tripId: 'UBR-TEST-1',
    };

    const updated = storageService.addShift(newShift);
    expect(updated.length).toBe(initial.length + 1);
    expect(updated[0].id).toBe('shift-new-1');
  });

  it('adds and persists disputes', () => {
    const initial = storageService.getDisputes();
    const dispute = {
      id: 'disp-test-1',
      platform: 'Zomato',
      category: 'Unfair Late Pickup Penalty',
      amount: 120,
      tripId: 'ZOM-TEST-1',
      date: '2026-10-17',
      status: 'Submitted',
      subject: 'Formal dispute regarding late pickup',
      body: 'Appeal body...',
      createdAt: new Date().toISOString(),
    };

    const updated = storageService.addDispute(dispute);
    expect(updated.length).toBe(initial.length + 1);
    expect(updated[0].id).toBe('disp-test-1');
  });

  it('manages profile information', () => {
    const profile = storageService.getProfile();
    expect(profile.name).toBe('Ramesh Kumar');

    storageService.saveProfile({
      ...profile,
      name: 'Ramesh Sharma',
      city: 'Pune',
    });

    const retrieved = storageService.getProfile();
    expect(retrieved.name).toBe('Ramesh Sharma');
    expect(retrieved.city).toBe('Pune');
  });

  it('manages sunlight mode toggle', () => {
    expect(storageService.getSunlightMode()).toBe(false);

    storageService.setSunlightMode(true);
    expect(storageService.getSunlightMode()).toBe(true);

    storageService.setSunlightMode(false);
    expect(storageService.getSunlightMode()).toBe(false);
  });

  it('manages local API key storage securely', () => {
    expect(storageService.getApiKey()).toBe('');

    storageService.setApiKey('test-key-123456');
    expect(storageService.getApiKey()).toBe('test-key-123456');

    storageService.setApiKey('');
    expect(storageService.getApiKey()).toBe('');
  });
});
