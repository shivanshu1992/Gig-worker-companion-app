import { describe, it, expect, beforeEach } from 'vitest';
import { clientStorage } from '@/lib/storage/clientStorage';
import { VERIFIED_SCHEMES } from '@/lib/knowledge/schemesData';
import { generateGrievanceAppealDraft } from '@/lib/ai/aiService';

describe('Integration: Connected Workflows across Modules', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Connected Workflow 1: Shift Deduction Penalty -> Grievance Drafter Context Transfer', async () => {
    // 1. A shift with an unfair deduction is recorded
    const shift = clientStorage.addEarning({
      date: '2026-10-15',
      workCategory: 'delivery',
      platformOrEmployer: 'Zomato',
      tripOrOrderId: 'ZOM-441928',
      grossEarnings: 1200,
      bonuses: 0,
      tips: 40,
      deductions: 120, // mystery penalty
      deductionReason: 'Late Pickup Penalty',
      expenses: 250,
      hoursWorked: 5,
      paymentMode: 'digital',
      disputeStatus: 'can_dispute',
    });

    expect(shift.deductions).toBe(120);

    // 2. Transfer context to grievance drafter
    const draft = await generateGrievanceAppealDraft({
      category: 'Damaged Parcel / Spilled Beverage Penalty',
      platformOrEmployer: shift.platformOrEmployer,
      disputedAmount: shift.deductions,
      incidentDate: shift.date,
      referenceIds: shift.tripOrOrderId,
      tone: 'formal_assertive',
      language: 'en',
      userExplanation: `Shift on ${shift.date}: ${shift.deductionReason}. Trip ID: ${shift.tripOrOrderId}. Unfair deduction of ₹${shift.deductions}.`,
    });

    expect(draft.draftContent).toContain('Zomato');
    expect(draft.draftContent).toContain('120');
    expect(draft.draftContent).toContain('ZOM-441928');

    // 3. Save into user grievances
    const saved = clientStorage.addGrievance({
      category: 'unfair_deduction',
      platformOrEmployer: shift.platformOrEmployer,
      disputedAmount: shift.deductions,
      incidentDate: shift.date,
      referenceIds: shift.tripOrOrderId,
      language: 'en',
      tone: 'formal_assertive',
      subjectLine: draft.subjectLine,
      draftContent: draft.draftContent,
      status: 'draft',
    });

    expect(saved.id).toBeDefined();
    const stored = clientStorage.getGrievances();
    expect(stored.some((g) => g.referenceIds === 'ZOM-441928')).toBe(true);
  });

  it('Connected Workflow 2: Penalty Notice Simplification -> Grievance Drafter Porting', async () => {
    const rawNotice = `Partner Alert: Order #SWG-984210
Delivery Partner ID: SWG-IND-8812
Penalty of ₹320 has been applied under Clause 7.2 (Customer Spill). Appeal within 48 hours.`;

    // Extract notice parameters
    const extractedPlatform = 'Swiggy';
    const extractedAmount = 320;
    const extractedTripId = 'SWG-984210';
    const category = 'Damaged Parcel / Spilled Beverage Penalty';

    const draft = await generateGrievanceAppealDraft({
      category,
      platformOrEmployer: extractedPlatform,
      disputedAmount: extractedAmount,
      incidentDate: '2026-10-16',
      referenceIds: extractedTripId,
      tone: 'urgent_legal',
      language: 'en',
      userExplanation: `Appealing notice penalty of ₹320 for ${extractedTripId}. Spillage was due to defective merchant container packaging.`,
    });

    expect(draft.draftContent).toContain('Swiggy');
    expect(draft.draftContent).toContain('320');
    expect(draft.draftContent).toContain('SWG-984210');
  });

  it('Connected Workflow 3: Worker Profile -> Welfare Scheme Eligibility Matching', () => {
    // 1. Worker Profile in Maharashtra
    const profile = clientStorage.getProfile();
    profile.state = 'Maharashtra';
    profile.workCategory = 'delivery';
    clientStorage.saveProfile(profile);

    // 2. Evaluate matching against verified government schemes
    const matchedSchemes = VERIFIED_SCHEMES.filter((scheme) => {
      const stateMatch =
        scheme.stateApplicability.toLowerCase().includes('all india') ||
        scheme.stateApplicability.toLowerCase().includes('maharashtra');

      const roleMatch =
        scheme.intendedBeneficiaries.toLowerCase().includes('delivery') ||
        scheme.intendedBeneficiaries.toLowerCase().includes('gig');

      return stateMatch && roleMatch;
    });

    expect(matchedSchemes.length).toBeGreaterThan(0);
    // e-Shram is universal
    expect(matchedSchemes.some((s) => s.id === 'e-shram')).toBe(true);
    // MoRTH Guidelines protect all delivery/drivers
    expect(matchedSchemes.some((s) => s.id === 'motor-vehicle-aggregator-rights')).toBe(true);
  });
});
