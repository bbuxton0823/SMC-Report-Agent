import { NextRequest, NextResponse } from 'next/server';
import { ENABLE_VERSION_CONTROL } from '@/lib/env';

// In-memory storage for versions (in a real app, this would be a database)
let versions: Array<{
  id: string;
  timestamp: Date;
  name?: string;
  content: string;
}> = [];

export async function GET() {
  try {
    if (!ENABLE_VERSION_CONTROL) {
      return NextResponse.json(
        { error: 'Version control is disabled' },
        { status: 403 }
      );
    }

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error getting versions:', error);
    return NextResponse.json(
      { error: 'Failed to get versions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!ENABLE_VERSION_CONTROL) {
      return NextResponse.json(
        { error: 'Version control is disabled' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, name } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const newVersion = {
      id: Date.now().toString(),
      timestamp: new Date(),
      name,
      content,
    };

    versions.push(newVersion);

    return NextResponse.json(newVersion);
  } catch (error) {
    console.error('Error saving version:', error);
    return NextResponse.json(
      { error: 'Failed to save version' },
      { status: 500 }
    );
  }
} 