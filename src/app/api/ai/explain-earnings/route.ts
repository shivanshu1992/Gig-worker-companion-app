import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { explainEarningsSummary } from '@/lib/ai/aiService';

const explainRequestSchema = z.object({
  records: z.array(z.any()),
  preferredLanguage: z.enum(['en', 'hi', 'pa']).optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = explainRequestSchema.parse(body);

    const summary = await explainEarningsSummary({
      records: validated.records,
      preferredLanguage: validated.preferredLanguage
    });

    return NextResponse.json({ summary });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.errors },
        { status: 400 }
      );
    }

    console.error('API /api/ai/explain-earnings error:', err);
    return NextResponse.json(
      { summary: 'Unable to analyze earnings records at this moment. Please review your saved shift history.' },
      { status: 200 }
    );
  }
}
