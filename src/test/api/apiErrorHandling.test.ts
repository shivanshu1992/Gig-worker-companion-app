import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as chatHandler } from '@/app/api/ai/chat/route';
import { POST as docHandler } from '@/app/api/ai/documents/route';
import { POST as explainHandler } from '@/app/api/ai/explain-earnings/route';
import { POST as grievanceHandler } from '@/app/api/ai/grievances/route';

function createJsonRequest(url: string, body: any): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('API Route Error Handling, HTTP Status Codes & Malformed Payloads', () => {
  // 1. CHAT API
  describe('/api/ai/chat', () => {
    it('returns 200 OK for valid chat request', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/chat', {
        message: 'How can I save fuel during afternoon shifts?',
        preferredLanguage: 'en',
      });

      const res = await chatHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.content).toBeDefined();
    });

    it('returns 400 Bad Request when message is empty or missing', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/chat', {
        message: '',
      });

      const res = await chatHandler(req);
      expect(res.status).toBe(400);

      const json = await res.json();
      expect(json.error).toBe('Invalid request data');
    });

    it('handles malformed / non-JSON input gracefully with status 200 fallback', async () => {
      const req = new NextRequest('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'NOT_A_VALID_JSON{',
      });

      const res = await chatHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.content).toBeDefined();
      expect(json.isFallback).toBe(true);
    });
  });

  // 2. DOCUMENTS API
  describe('/api/ai/documents', () => {
    it('returns 200 OK for valid document drafting request', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/documents', {
        docType: 'invoice_request',
        metadata: { workerName: 'Ramesh Kumar', amount: '3500' },
        language: 'en',
      });

      const res = await docHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.title).toBeDefined();
      expect(json.content).toBeDefined();
    });

    it('handles non-string / mixed metadata without crashing', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/documents', {
        docType: 'invoice_request',
        metadata: { workerName: 'Ramesh Kumar', amount: 3500, active: true },
        language: 'en',
      });

      const res = await docHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.content).toBeDefined();
    });

    it('returns 400 Bad Request when docType is missing', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/documents', {
        docType: '',
        metadata: {},
      });

      const res = await docHandler(req);
      expect(res.status).toBe(400);
    });
  });

  // 3. EXPLAIN EARNINGS API
  describe('/api/ai/explain-earnings', () => {
    it('returns 200 OK with summary for valid records', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/explain-earnings', {
        records: [
          { grossEarnings: 1200, deductions: 50, expenses: 200, hoursWorked: 5 },
        ],
        preferredLanguage: 'en',
      });

      const res = await explainHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.summary).toBeDefined();
    });

    it('returns 400 Bad Request when records array is missing', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/explain-earnings', {
        preferredLanguage: 'en',
      });

      const res = await explainHandler(req);
      expect(res.status).toBe(400);
    });
  });

  // 4. GRIEVANCES API
  describe('/api/ai/grievances', () => {
    it('returns 200 OK for valid grievance appeal request', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/grievances', {
        category: 'Unfair Late Pickup Penalty',
        platformOrEmployer: 'Swiggy',
        disputedAmount: 120,
        incidentDate: '2026-10-16',
        referenceIds: 'ORD-984210',
        tone: 'formal_assertive',
        language: 'en',
        userExplanation: 'Kitchen delayed dispatch by 30 mins.',
      });

      const res = await grievanceHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.subjectLine).toBeDefined();
      expect(json.draftContent).toBeDefined();
    });

    it('handles empty explanation gracefully with default fallback rather than 500', async () => {
      const req = createJsonRequest('http://localhost:3000/api/ai/grievances', {
        category: 'Unfair Penalty',
        platformOrEmployer: 'Zomato',
        tone: 'formal_assertive',
        language: 'en',
        userExplanation: '',
      });

      const res = await grievanceHandler(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.draftContent).toBeDefined();
    });
  });
});
