import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateChatResponse } from '@/lib/ai/aiService';

const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string()
    })
  ).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'pa']).optional(),
  userEarnings: z.array(z.any()).optional(),
  userProfileSummary: z.string().optional()
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = chatRequestSchema.parse(body);

    const result = await generateChatResponse({
      message: validated.message,
      conversationHistory: validated.conversationHistory as { role: 'user' | 'assistant'; content: string }[] | undefined,
      preferredLanguage: validated.preferredLanguage,
      userEarnings: validated.userEarnings,
      userProfileSummary: validated.userProfileSummary
    });

    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: err.errors },
        { status: 400 }
      );
    }

    console.error('API /api/ai/chat error:', err);
    return NextResponse.json(
      { 
        content: 'I encountered an unexpected issue connecting to the knowledge service. Please try again shortly.',
        citations: [],
        modelUsed: 'fallback',
        isFallback: true 
      },
      { status: 200 }
    );
  }
}
