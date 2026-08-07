import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'StudyFlow AI',
    timestamp: new Date().toISOString(),
  });
}
