import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDocumentDraftContent } from '@/lib/ai/aiService';

const documentRequestSchema = z.object({
  docType: z.string().min(1),
  metadata: z.record(z.string()),
  language: z.enum(['en', 'hi', 'pa'])
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = documentRequestSchema.parse(body);

    const result = await generateDocumentDraftContent(validated as {
      docType: string;
      metadata: Record<string, string>;
      language: 'en' | 'hi' | 'pa';
    });

    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid document request parameters', details: err.errors },
        { status: 400 }
      );
    }

    console.error('API /api/ai/documents error:', err);
    return NextResponse.json(
      { error: 'Failed to generate document draft' },
      { status: 500 }
    );
  }
}
