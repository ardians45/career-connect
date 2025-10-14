import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(
    JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}