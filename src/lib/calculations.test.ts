import { describe, it, expect } from 'vitest';
import { 
  calculateNetEarnings, 
  calculateHourlyRate, 
  calculateGoalProgress, 
  aggregateEarnings, 
  filterRecordsByPeriod,
  safeNumber 
} from './calculations';
import { EarningRecord } from '@/types';

describe('Financial Calculations — PromptWars Core Spec', () => {
  it('TEST 1: Gross=1200, Fuel=500, Platform Fee=100, Tips=100, Hours=6 => Net=700, Hourly=116.67', () => {
    const net = calculateNetEarnings({
      grossEarnings: 1200,
      fuelCost: 500,
      platformFee: 100,
      tips: 100,
    });
    expect(net).toBe(700);

    const hourly = calculateHourlyRate(net, 6);
    expect(hourly).toBe(116.67);
  });

  it('TEST 2: Gross=1000, Fuel=0, Fee=0, Tips=0, Hours=5 => Net=1000, Hourly=200', () => {
    const net = calculateNetEarnings({
      grossEarnings: 1000,
      fuelCost: 0,
      platformFee: 0,
      tips: 0,
    });
    expect(net).toBe(1000);

    const hourly = calculateHourlyRate(net, 5);
    expect(hourly).toBe(200);
  });

  it('TEST 3: Gross=5000, Fuel=1200, Fee=500, Tips=300, Hours=10 => Net=3600, Hourly=360', () => {
    const net = calculateNetEarnings({
      grossEarnings: 5000,
      fuelCost: 1200,
      platformFee: 500,
      tips: 300,
    });
    expect(net).toBe(3600);

    const hourly = calculateHourlyRate(net, 10);
    expect(hourly).toBe(360);
  });

  it('TEST 4: All values = 0 => Net=0, Hourly=0', () => {
    const net = calculateNetEarnings({
      grossEarnings: 0,
      fuelCost: 0,
      platformFee: 0,
      tips: 0,
    });
    expect(net).toBe(0);

    const hourly = calculateHourlyRate(net, 0);
    expect(hourly).toBe(0);
  });

  it('TEST 5: Gross=100, Fuel=150, Fee=20, Tips=0, Hours=2 => Net=-70, Hourly=-35', () => {
    const net = calculateNetEarnings({
      grossEarnings: 100,
      fuelCost: 150,
      platformFee: 20,
      tips: 0,
    });
    expect(net).toBe(-70);

    const hourly = calculateHourlyRate(net, 2);
    expect(hourly).toBe(-35);
  });
});

describe('Calculations — Edge Cases & Safety Resilience', () => {
  it('handles safeNumber with null, undefined, invalid strings, NaN, Infinity', () => {
    expect(safeNumber(null)).toBe(0);
    expect(safeNumber(undefined)).toBe(0);
    expect(safeNumber('abc')).toBe(0);
    expect(safeNumber('')).toBe(0);
    expect(safeNumber('  ')).toBe(0);
    expect(safeNumber(NaN)).toBe(0);
    expect(safeNumber(Infinity)).toBe(0);
    expect(safeNumber(-Infinity)).toBe(0);
    expect(safeNumber(42.5)).toBe(42.5);
    expect(safeNumber('125.75')).toBe(125.75);
    expect(safeNumber(-50)).toBe(-50);
  });

  it('handles calculateNetEarnings with null or missing input safely', () => {
    expect(calculateNetEarnings(null as any)).toBe(0);
    expect(calculateNetEarnings(undefined as any)).toBe(0);
    expect(calculateNetEarnings({ grossEarnings: 0 })).toBe(0);
  });

  it('handles calculateNetEarnings with decimal values accurately', () => {
    const net = calculateNetEarnings({
      grossEarnings: 1450.55,
      bonuses: 150.25,
      tips: 90.1,
      deductions: 50.4,
      expenses: 320.5,
    });
    // 1450.55 + 150.25 + 90.10 - 50.40 - 320.50 = 1320.00
    expect(net).toBe(1320);
  });

  it('handles calculateHourlyRate edge cases (zero hours, negative hours, negative earnings)', () => {
    expect(calculateHourlyRate(500, 0)).toBe(0);
    expect(calculateHourlyRate(500, -2)).toBe(0);
    expect(calculateHourlyRate(0, 5)).toBe(0);
    expect(calculateHourlyRate(-150, 3)).toBe(-50);
    expect(calculateHourlyRate(NaN, 5)).toBe(0);
    expect(calculateHourlyRate(500, NaN)).toBe(0);
  });

  it('handles calculateGoalProgress correctly with normal and extreme goals', () => {
    // Normal progress
    const p1 = calculateGoalProgress(500, 1000);
    expect(p1.percentage).toBe(50);
    expect(p1.remaining).toBe(500);
    expect(p1.isAchieved).toBe(false);

    // Goal achieved
    const p2 = calculateGoalProgress(1200, 1000);
    expect(p2.percentage).toBe(120);
    expect(p2.remaining).toBe(0);
    expect(p2.isAchieved).toBe(true);

    // Capped at 200%
    const p3 = calculateGoalProgress(3000, 1000);
    expect(p3.percentage).toBe(200);
    expect(p3.remaining).toBe(0);
    expect(p3.isAchieved).toBe(true);

    // Goal is 0 or negative
    const p4 = calculateGoalProgress(500, 0);
    expect(p4.percentage).toBe(100);
    expect(p4.remaining).toBe(0);
    expect(p4.isAchieved).toBe(true);

    // Actual is negative or 0
    const p5 = calculateGoalProgress(-200, 1000);
    expect(p5.percentage).toBe(0);
    expect(p5.remaining).toBe(1000);
    expect(p5.isAchieved).toBe(false);
  });

  it('aggregates multiple earning records correctly', () => {
    const records: EarningRecord[] = [
      {
        id: '1',
        date: '2026-10-16',
        workCategory: 'delivery',
        platformOrEmployer: 'Swiggy',
        grossEarnings: 1500,
        bonuses: 100,
        tips: 50,
        deductions: 0,
        expenses: 300,
        netEarnings: 1350,
        hoursWorked: 6,
        paymentMode: 'digital',
        disputeStatus: 'none',
        createdAt: '2026-10-16T12:00:00Z',
      },
      {
        id: '2',
        date: '2026-10-15',
        workCategory: 'delivery',
        platformOrEmployer: 'Zomato',
        grossEarnings: 1000,
        bonuses: 0,
        tips: 30,
        deductions: 120,
        expenses: 200,
        netEarnings: 710,
        hoursWorked: 4,
        paymentMode: 'digital',
        disputeStatus: 'can_dispute',
        createdAt: '2026-10-15T12:00:00Z',
      },
    ];

    const agg = aggregateEarnings(records);
    expect(agg.totalGross).toBe(2500);
    expect(agg.totalBonuses).toBe(100);
    expect(agg.totalTips).toBe(80);
    expect(agg.totalDeductions).toBe(120);
    expect(agg.totalExpenses).toBe(500);
    expect(agg.totalNet).toBe(2060);
    expect(agg.totalHours).toBe(10);
    expect(agg.avgHourlyRate).toBe(206);
    expect(agg.tripCount).toBe(2);
  });

  it('handles aggregateEarnings with empty array or null safely', () => {
    const empty = aggregateEarnings([]);
    expect(empty.totalGross).toBe(0);
    expect(empty.totalNet).toBe(0);
    expect(empty.avgHourlyRate).toBe(0);
    expect(empty.tripCount).toBe(0);

    const fromNull = aggregateEarnings(null as any);
    expect(fromNull.totalGross).toBe(0);
    expect(fromNull.totalNet).toBe(0);
  });

  it('filters records by period accurately', () => {
    const ref = '2026-10-16';
    const records: EarningRecord[] = [
      {
        id: 'today-rec',
        date: '2026-10-16',
        workCategory: 'delivery',
        platformOrEmployer: 'Swiggy',
        grossEarnings: 1000,
        bonuses: 0,
        tips: 0,
        deductions: 0,
        expenses: 200,
        netEarnings: 800,
        hoursWorked: 5,
        paymentMode: 'digital',
        disputeStatus: 'none',
        createdAt: '2026-10-16T12:00:00Z',
      },
      {
        id: 'week-rec',
        date: '2026-10-12',
        workCategory: 'delivery',
        platformOrEmployer: 'Uber',
        grossEarnings: 1500,
        bonuses: 0,
        tips: 0,
        deductions: 0,
        expenses: 300,
        netEarnings: 1200,
        hoursWorked: 6,
        paymentMode: 'digital',
        disputeStatus: 'none',
        createdAt: '2026-10-12T12:00:00Z',
      },
      {
        id: 'old-rec',
        date: '2026-08-01',
        workCategory: 'delivery',
        platformOrEmployer: 'Zomato',
        grossEarnings: 2000,
        bonuses: 0,
        tips: 0,
        deductions: 0,
        expenses: 400,
        netEarnings: 1600,
        hoursWorked: 8,
        paymentMode: 'digital',
        disputeStatus: 'none',
        createdAt: '2026-08-01T12:00:00Z',
      },
    ];

    expect(filterRecordsByPeriod(records, 'today', ref).length).toBe(1);
    expect(filterRecordsByPeriod(records, 'week', ref).length).toBe(2);
    expect(filterRecordsByPeriod(records, 'month', ref).length).toBe(2);
    expect(filterRecordsByPeriod(records, 'all', ref).length).toBe(3);
  });
});
