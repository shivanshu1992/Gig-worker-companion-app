import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateGrievanceAppealDraft } from '@/lib/ai/aiService';

const grievanceRequestSchema = z.object({
  category: z.string().min(1),
  platformOrEmployer: z.string().min(1),
  disputedAmount: z.number().optional(),
  incidentDate: z.string().optional(),
  referenceIds: z.string().optional(),
  tone: z.enum(['formal_assertive', 'polite_cooperative', 'urgent_legal']),
  language: z.enum(['en', 'hi', 'pa']),
  userExplanation: z.string().min(1).max(3000)
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
      { error: 'Failed to generate grievance appeal' },
      { status: 500 }
    );
  }
}
