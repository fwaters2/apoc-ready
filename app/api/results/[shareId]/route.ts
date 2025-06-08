import { NextRequest, NextResponse } from 'next/server';
import { getResult } from '../../../utils/kvStore';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    
    if (!shareId || shareId.length !== 8) {
      return NextResponse.json(
        { error: 'Invalid share ID' },
        { status: 400 }
      );
    }

    const result = await getResult(shareId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Result not found or expired' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error retrieving result:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve result' },
      { status: 500 }
    );
  }
} 