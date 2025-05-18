import { NextResponse } from "next/server";
import { evaluateSurvival } from "@/app/utils/openai";
import type { Submission } from "@/app/types";
import { Locale } from "@/app/i18n";
import { DEV_CONFIG } from "@/app/constants/development";

export async function POST(request: Request) {
  try {
    // Log environment for debugging
    console.log(`API route running in ${process.env.NODE_ENV} mode`);
    console.log(`DEV_CONFIG settings:`, {
      DEV_MODE: DEV_CONFIG.DEV_MODE,
      USE_MOCK_RESPONSES: DEV_CONFIG.USE_MOCK_RESPONSES
    });
    
    const body: Submission & { locale?: Locale } = await request.json();
    
    if (!body.scenarioId || !body.answers || !body.answers.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get locale or default to English
    const locale = body.locale || 'en';
    console.log(`Processing evaluation for scenario: ${body.scenarioId}, locale: ${locale}`);

    // Sort answers by questionIndex to ensure correct order
    const sortedAnswers = [...body.answers].sort(
      (a, b) => a.questionIndex - b.questionIndex
    );
    
    try {
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

      // Add development mode indicator when using mock data
      if (DEV_CONFIG.DEV_MODE && DEV_CONFIG.USE_MOCK_RESPONSES) {
        return NextResponse.json({
          ...evaluation,
          isDevelopmentMode: true,
          mockData: true,
        });
      }

      // Add debug info in all environments for troubleshooting
      const responseWithDebug = {
        ...evaluation,
        debug: {
          mockResponsesEnabled: DEV_CONFIG.USE_MOCK_RESPONSES,
          environment: process.env.NODE_ENV,
        }
      };

      console.log(`Successfully processed evaluation`);
      return NextResponse.json(responseWithDebug);
    } catch (evalError) {
      console.error("Error in evaluateSurvival function:", evalError);
      return NextResponse.json(
        { 
          error: "Evaluation failed", 
          details: evalError instanceof Error ? evalError.message : "Unknown error",
          debug: {
            mockResponsesEnabled: DEV_CONFIG.USE_MOCK_RESPONSES,
            environment: process.env.NODE_ENV,
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in evaluation route:", error);
    return NextResponse.json(
      { 
        error: "Failed to process evaluation",
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
} 