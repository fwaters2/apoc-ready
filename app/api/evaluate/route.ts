import { NextResponse } from "next/server";
import { evaluateSurvival } from "@/app/utils/openai";
import type { Submission } from "@/app/types";

export async function POST(request: Request) {
  try {
    const body: Submission = await request.json();
    
    if (!body.scenarioId || !body.answers || !body.answers.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Sort answers by questionIndex to ensure correct order
    const sortedAnswers = [...body.answers].sort(
      (a, b) => a.questionIndex - b.questionIndex
    );
    
    const result = await evaluateSurvival(
      body.scenarioId,
      sortedAnswers.map(a => a.text)
    );

    const evaluation: Submission = {
      ...body,
      score: result.score,
      analysis: result.analysis,
      deathScene: result.deathScene,
      rationale: result.rationale,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("Error in evaluation route:", error);
    return NextResponse.json(
      { error: "Failed to process evaluation" },
      { status: 500 }
    );
  }
} 