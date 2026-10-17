import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateDocumentDraftContent } from '@/lib/ai/aiService';

const documentRequestSchema = z.object({
  docType: z.string().min(1),
  metadata: z.record(z.any()).default({}),
  language: z.enum(['en', 'hi', 'pa']).default('en')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = documentRequestSchema.parse(body);

    const stringifiedMetadata: Record<string, string> = {};
    for (const [k, v] of Object.entries(validated.metadata || {})) {
      stringifiedMetadata[k] = String(v ?? '');
    }

    const result = await generateDocumentDraftContent({
      docType: validated.docType,
      metadata: stringifiedMetadata,
      language: validated.language as 'en' | 'hi' | 'pa'
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
      { 
        title: 'Document Draft (Fallback)', 
        content: 'DOCUMENT STATEMENT\nDate: ' + new Date().toISOString().split('T')[0] + '\n\nTo Whom It May Concern,\nThis document confirms service activities and payment records for the registered gig partner.\n\nWorker Name: [Registered Worker]\nPlatform / Contractor: [Platform Partner]\nStatus: Verified Record\n\nSignature / Stamp:\n___________________________'
      },
      { status: 200 }
    );
  }
}

