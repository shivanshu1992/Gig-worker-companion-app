import { describe, it, expect, beforeEach } from 'vitest';
import { clientStorage } from '@/lib/storage/clientStorage';
import { calculateNetEarnings, calculateHourlyRate, aggregateEarnings } from '@/lib/calculations';

describe('Integration Workflow 1: Shift Logging, Calculation, Edit & Deletion', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('completes the entire shift lifecycle from creation to deletion', () => {
    // 1. Initial State
    const initialRecords = clientStorage.getEarnings();
    const initialStats = aggregateEarnings(initialRecords);

    // 2. Add New Shift Record
    const newShiftData = {
      date: '2026-10-17',
      workCategory: 'delivery' as const,
      platformOrEmployer: 'Swiggy',
      grossEarnings: 1600,
      bonuses: 150,
      tips: 80,
      deductions: 120, // mystery penalty
      deductionReason: 'Late pickup penalty',
      expenses: 310, // petrol
      hoursWorked: 6.5,
      distanceKm: 65,
      paymentMode: 'digital' as const,
      disputeStatus: 'can_dispute' as const,
    };

    const addedRecord = clientStorage.addEarning(newShiftData);

    // Verify calculated take-home
    // 1600 + 150 + 80 - 120 - 310 = 1400
    expect(addedRecord.netEarnings).toBe(1400);

    const hourlyRate = calculateHourlyRate(addedRecord.netEarnings, addedRecord.hoursWorked);
    // 1400 / 6.5 = 215.38
    expect(hourlyRate).toBe(215.38);

    // 3. Verify Aggregated Totals Updated
    const updatedRecords = clientStorage.getEarnings();
    expect(updatedRecords.length).toBe(initialRecords.length + 1);

    const updatedStats = aggregateEarnings(updatedRecords);
    expect(updatedStats.totalGross).toBe(initialStats.totalGross + 1600);
    expect(updatedStats.totalNet).toBe(initialStats.totalNet + 1400);
    expect(updatedStats.totalDeductions).toBe(initialStats.totalDeductions + 120);

    // 4. Edit the Shift (e.g., penalty waived after merchant admitted delay)
    const editedRecord = clientStorage.updateEarning(addedRecord.id, {
      deductions: 0,
      deductionReason: '',
      disputeStatus: 'resolved',
    });

    expect(editedRecord).not.toBeNull();
    // 1600 + 150 + 80 - 0 - 310 = 1520
    expect(editedRecord?.netEarnings).toBe(1520);

    // 5. Delete the Shift
    const deleteSuccess = clientStorage.deleteEarning(addedRecord.id);
    expect(deleteSuccess).toBe(true);

    const finalRecords = clientStorage.getEarnings();
    expect(finalRecords.length).toBe(initialRecords.length);

    const finalStats = aggregateEarnings(finalRecords);
    expect(finalStats.totalGross).toBe(initialStats.totalGross);
    expect(finalStats.totalNet).toBe(initialStats.totalNet);
  });
});
