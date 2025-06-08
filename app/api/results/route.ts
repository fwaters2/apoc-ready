import { NextRequest, NextResponse } from 'next/server';
import { storeResult } from '../../utils/kvStore';
import { Submission } from '../../types';

export async function POST(request: NextRequest) {
  try {
    const result: Submission = await request.json();
    
    // Validate required fields
    if (!result.scenarioId || !result.name || result.score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: scenarioId, name, score' },
        { status: 400 }
      );
    }

    // Store the result and get share ID
    const shareId = await storeResult(result);
    
    return NextResponse.json({ 
      shareId,
      url: `/results/${shareId}`
    });

  } catch (error) {
    console.error('Error storing result:', error);
    return NextResponse.json(
      { error: 'Failed to store result' },
      { status: 500 }
    );
  }
} 