import { NextResponse } from "next/server";
import { evaluateSurvival } from "@/app/utils/openai";
import type { Submission } from "@/app/types";
import { Locale } from "@/app/i18n";

export async function POST(request: Request) {
  try {
    const body: Submission & { locale?: Locale } = await request.json();
    
    if (!body.scenarioId || !body.answers || !body.answers.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get locale or default to English
    const locale = body.locale || 'en';

    // Sort answers by questionIndex to ensure correct order
    const sortedAnswers = [...body.answers].sort(
      (a, b) => a.questionIndex - b.questionIndex
    );
    
    const result = await evaluateSurvival(
      body.scenarioId,
      sortedAnswers.map(a => a.text),
      locale
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