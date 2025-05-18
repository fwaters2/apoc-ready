import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type EvaluationResponse = {
  score: number;
  feedback: string;
};

export async function evaluateSurvival(
  scenario: string,
  answers: string[]
): Promise<EvaluationResponse> {
  try {
    const prompt = `You are evaluating survival chances for an apocalypse scenario. Be brutally honest but humorous.

Given the following:
Scenario: ${scenario}
Answers:
${answers.map((answer, i) => `${i + 1}. ${answer}`).join("\n")}

Provide a survival evaluation following these rules:
1. Give a score between 0-100 (typically 0-5% unless truly exceptional)
2. Write a brief, sarcastic comment about their chances
3. Format your response EXACTLY like this example, with no other text:
{"score": 2, "feedback": "Your optimism is adorable. Too bad optimism can't stop a zombie."}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a sarcastic apocalypse survival evaluator. You must respond with valid JSON containing 'score' (number) and 'feedback' (string) fields only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content || "{}");
      if (typeof result.score === 'number' && typeof result.feedback === 'string') {
        return result;
      }
      throw new Error("Invalid response format");
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return {
        score: 0,
        feedback: "Error processing your survival evaluation. Maybe that's for the best...",
      };
    }
  } catch (error) {
    console.error("Error evaluating survival:", error);
    throw error;
  }
} 