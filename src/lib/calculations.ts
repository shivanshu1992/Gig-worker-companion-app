// Financial and Performance Calculation Rules for Gig Worker Companion

import { EarningRecord, ExpenseItem } from '@/types';

/**
 * Net Earnings Formula:
 * Net = Gross Earnings + Bonuses + Tips - Recorded Deductions - Recorded Work Expenses
 */
export function calculateNetEarnings(record: {
  grossEarnings: number;
  bonuses?: number;
  tips?: number;
  deductions?: number;
  expenses?: number;
}): number {
  const gross = Number(record.grossEarnings) || 0;
  const bonuses = Number(record.bonuses) || 0;
  const tips = Number(record.tips) || 0;
  const deductions = Number(record.deductions) || 0;
  const expenses = Number(record.expenses) || 0;

  const total = gross + bonuses + tips - deductions - expenses;
  return Math.round(total * 100) / 100;
}

/**
 * Calculate Net Hourly Rate
 */
export function calculateHourlyRate(netEarnings: number, hoursWorked: number): number {
  const hours = Number(hoursWorked) || 0;
  if (hours <= 0) return 0;
  const rate = netEarnings / hours;
  return Math.round(rate * 100) / 100;
}

/**
 * Calculate Progress toward an Income Goal (Percentage capped between 0 and 200)
 */
export function calculateGoalProgress(actualEarnings: number, goal: number): {
  percentage: number;
  remaining: number;
  isAchieved: boolean;
} {
  const target = Number(goal) || 1;
  const actual = Math.max(0, Number(actualEarnings) || 0);

  if (target <= 0) {
    return { percentage: 100, remaining: 0, isAchieved: true };
  }

  const rawPercent = (actual / target) * 100;
  const percentage = Math.round(Math.min(200, Math.max(0, rawPercent)));
  const remaining = Math.max(0, Math.round((target - actual) * 100) / 100);
  const isAchieved = actual >= target;

  return { percentage, remaining, isAchieved };
}

/**
 * Aggregate earnings records for a given set
 */
export function aggregateEarnings(records: EarningRecord[]): {
  totalGross: number;
  totalBonuses: number;
  totalTips: number;
  totalDeductions: number;
  totalExpenses: number;
  totalNet: number;
  totalHours: number;
  avgHourlyRate: number;
  tripCount: number;
} {
  let totalGross = 0;
  let totalBonuses = 0;
  let totalTips = 0;
  let totalDeductions = 0;
  let totalExpenses = 0;
  let totalNet = 0;
  let totalHours = 0;

  for (const r of records) {
    totalGross += Number(r.grossEarnings) || 0;
    totalBonuses += Number(r.bonuses) || 0;
    totalTips += Number(r.tips) || 0;
    totalDeductions += Number(r.deductions) || 0;
    totalExpenses += Number(r.expenses) || 0;
    totalNet += Number(r.netEarnings) || calculateNetEarnings(r);
    totalHours += Number(r.hoursWorked) || 0;
  }

  const avgHourlyRate = totalHours > 0 ? Math.round((totalNet / totalHours) * 100) / 100 : 0;

  return {
    totalGross: Math.round(totalGross * 100) / 100,
    totalBonuses: Math.round(totalBonuses * 100) / 100,
    totalTips: Math.round(totalTips * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    totalNet: Math.round(totalNet * 100) / 100,
    totalHours: Math.round(totalHours * 10) / 10,
    avgHourlyRate,
    tripCount: records.length,
  };
}

/**
 * Filter earnings by date period
 */
export function filterRecordsByPeriod(
  records: EarningRecord[],
  period: 'today' | 'week' | 'month' | 'all',
  referenceDateStr?: string
): EarningRecord[] {
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const refDateFormatted = refDate.toISOString().split('T')[0];

  return records.filter((r) => {
    if (period === 'all') return true;
    if (period === 'today') {
      return r.date === refDateFormatted;
    }

    const recordDate = new Date(r.date);
    const diffTime = refDate.getTime() - recordDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (period === 'week') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (period === 'month') {
      return diffDays >= 0 && diffDays <= 30;
    }
    return true;
  });
}
