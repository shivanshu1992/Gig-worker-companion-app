// Financial and Performance Calculation Rules for Gig Worker Companion

import { EarningRecord } from '@/types';

/**
 * Safely parses any value into a finite number.
 * Returns 0 if null, undefined, NaN, Infinity, or unparseable.
 */
export function safeNumber(val: any): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') {
    return isFinite(val) && !isNaN(val) ? val : 0;
  }
  const str = String(val).trim();
  if (str === '') return 0;
  const parsed = parseFloat(str);
  return isFinite(parsed) && !isNaN(parsed) ? parsed : 0;
}

/**
 * Net Earnings Formula:
 * Net Take-Home = Gross Earnings - Fuel/EV Cost - Platform Fee + Tips
 * Or: Net = Gross + Bonuses + Tips - Deductions - Expenses
 */
export function calculateNetEarnings(record: {
  grossEarnings: number;
  fuelCost?: number;
  platformFee?: number;
  bonuses?: number;
  incentives?: number;
  tips?: number;
  deductions?: number;
  expenses?: number;
}): number {
  if (!record) return 0;

  const gross = safeNumber(record.grossEarnings);
  const fuel = safeNumber(record.fuelCost);
  const platformFee = safeNumber(record.platformFee);
  const bonuses = safeNumber(record.bonuses ?? record.incentives);
  const tips = safeNumber(record.tips);
  const deductions = safeNumber(record.deductions);
  const expenses = safeNumber(record.expenses);

  // If fuelCost or platformFee are explicitly provided, include them in outgoings
  const totalOutgoings = fuel + platformFee + deductions + expenses;
  const total = gross + bonuses + tips - totalOutgoings;
  return Math.round(total * 100) / 100;
}

/**
 * Calculate Net Hourly Rate:
 * Hourly Net = Net Take-Home / Hours
 */
export function calculateHourlyRate(netEarnings: number, hoursWorked: number): number {
  const net = safeNumber(netEarnings);
  const hours = safeNumber(hoursWorked);
  if (hours <= 0) return 0;
  const rate = net / hours;
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
  const target = safeNumber(goal);
  const actual = Math.max(0, safeNumber(actualEarnings));

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
  if (!Array.isArray(records)) {
    return {
      totalGross: 0,
      totalBonuses: 0,
      totalTips: 0,
      totalDeductions: 0,
      totalExpenses: 0,
      totalNet: 0,
      totalHours: 0,
      avgHourlyRate: 0,
      tripCount: 0,
    };
  }

  let totalGross = 0;
  let totalBonuses = 0;
  let totalTips = 0;
  let totalDeductions = 0;
  let totalExpenses = 0;
  let totalNet = 0;
  let totalHours = 0;

  for (const r of records) {
    if (!r) continue;
    totalGross += safeNumber(r.grossEarnings);
    totalBonuses += safeNumber(r.bonuses);
    totalTips += safeNumber(r.tips);
    totalDeductions += safeNumber(r.deductions);
    totalExpenses += safeNumber(r.expenses);
    totalNet += r.netEarnings !== undefined ? safeNumber(r.netEarnings) : calculateNetEarnings(r);
    totalHours += safeNumber(r.hoursWorked);
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
  if (!Array.isArray(records)) return [];

  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const refDateFormatted = refDate.toISOString().split('T')[0];

  return records.filter((r) => {
    if (!r || !r.date) return false;
    if (period === 'all') return true;
    if (period === 'today') {
      return r.date === refDateFormatted;
    }

    const recordDate = new Date(r.date);
    if (isNaN(recordDate.getTime())) return false;
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

