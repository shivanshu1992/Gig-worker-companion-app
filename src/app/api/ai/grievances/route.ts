import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGrievanceAppealDraft } from '@/lib/ai/aiService';

const grievanceRequestSchema = z.object({
  category: z.string().min(1).default('Unfair Deduction / Penalty'),
  platformOrEmployer: z.string().min(1).default('Platform Partner'),
  disputedAmount: z.number().optional().default(0),
  incidentDate: z.string().optional().default(() => new Date().toISOString().split('T')[0]),
  referenceIds: z.string().optional().default('N/A'),
  tone: z.enum(['formal_assertive', 'polite_cooperative', 'urgent_legal']).default('formal_assertive'),
  language: z.enum(['en', 'hi', 'pa']).default('en'),
  userExplanation: z.string().max(5000).optional().default('')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = grievanceRequestSchema.parse(body);

    const draft = await generateGrievanceAppealDraft(validated as any);

    return NextResponse.json(draft);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid grievance request parameters', details: err.errors },
        { status: 400 }
      );
    }

    console.error('API /api/ai/grievances error:', err);
    return NextResponse.json(
      { 
        subjectLine: 'Formal Dispute & Grievance Appeal Notice',
        draftContent: 'To: Grievance Redressal Officer / Operations Team\n\nI am writing to formally dispute an unfair deduction/penalty levied against my partner account. Under fair platform partner standards and applicable labor protections, I request an itemized review of the trip logs and prompt restitution of the disputed amount.\n\nDate: ' + new Date().toISOString().split('T')[0] + '\nStatus: Appeal Pending Review\n\nWorker Name: [Registered Worker]\nContact: [Registered Mobile Number]',
        escalationContacts: [
          { name: 'National Consumer Helpline', contact: '1915' },
          { name: 'e-Shram National Helpdesk', contact: '14434' },
          { name: 'Emergency Labor Assistance', contact: '1800-180-1111' }
        ]
      },
      { status: 200 }
    );
  }
}

