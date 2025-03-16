import { NextResponse } from 'next/server';
import { runAgent, AgentInput } from '@/lib/agents';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input: AgentInput = body.input;
    
    if (!input) {
      return NextResponse.json(
        { error: 'Missing required field: input' },
        { status: 400 }
      );
    }
    
    const report = await runAgent(input);
    
    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
} 