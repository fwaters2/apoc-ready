import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type EvaluationResponse = {
  score: number;
  analysis: string;
  deathScene: string;
  rationale: string;
};

export async function evaluateSurvival(
  scenario: string,
  answers: string[]
): Promise<EvaluationResponse> {
  try {
    const prompt = `You are evaluating survival chances for an apocalypse scenario. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with escalating frustration, rhetorical questions, and frequent ALL CAPS for emphasis.

Given the following:
Scenario: ${scenario}
Answers:
${answers.map((answer, i) => `${i + 1}. ${answer}`).join("\n")}

Provide a structured survival evaluation with the following sections, ALL in Bill Burr's comedic voice:

1. ANALYSIS: Channel Bill Burr's direct, no-nonsense style as you analyze each answer. Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each answer is worse than the last. Reference the answers by number.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Include his typical phrases like "OH MY GOD" or "WHAT ARE YOU DOING?!" Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant. Include ALL CAPS for emphasis.

Format your response EXACTLY like this example, with no other text:
{
  "analysis": "Answer 1 (hiding in the basement): Oh my GOD, the BASEMENT?! What are you, outta your mind?! That's like jumping into a shark tank with a paper cut! Answer 2 (kitchen knife): A KITCHEN KNIFE?! Are you serious?! What are you gonna do, make the zombies a salad before they eat your face?! Answer 3 (suburban house): Oh, FANTASTIC choice! Nothing says 'safety' like being surrounded by 500 neighbors who ALL become zombies! Answer 4 (cooking skills): COOKING?! You're worried about COOKING?! That's like being on the Titanic and asking if they have WiFi! Answer 5 (compassion): Oh, that's just BEAUTIFUL. Your loved one is trying to EAT YOU and you're having a moment. Unbelievable.",
  "deathScene": "So there you are, day THREE, hiding in your BRILLIANT basement fortress with your AMAZING kitchen knife, when your infected neighbor - who by the way, used to bring you Christmas cookies - smashes through your window. And what do you do? You HESITATE! Because OF COURSE YOU DO! What are ya, STUPID?! Oh, let me just have a MOMENT with this ZOMBIE who wants to CHEW MY FACE OFF! GENIUS! And that's it! That's your story! They don't even finish eating you because even ZOMBIES have standards! Un-BELIEVABLE!",
  "score": 2,
  "rationale": "Your survival plan is so BAD it actually HELPS the apocalypse, you're basically on the ZOMBIE RECRUITING TEAM at this point!"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are generating apocalypse survival evaluations in the EXACT comedic style of Bill Burr - direct, cynical, exasperated rants with ALL CAPS for emphasis and lots of rhetorical questions. Every section must sound like Bill Burr's stand-up comedy.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    try {
      const result = JSON.parse(response.choices[0].message.content || "{}");
      if (
        typeof result.score === 'number' && 
        typeof result.analysis === 'string' &&
        typeof result.deathScene === 'string' &&
        typeof result.rationale === 'string'
      ) {
        return result;
      }
      throw new Error("Invalid response format");
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return {
        score: 0,
        analysis: "Error analyzing your apocalypse strategy. Which is honestly impressive - you broke the AI before the zombies even showed up! WHAT ARE YA DOIN'?!",
        deathScene: "Look, I can't even DESCRIBE how bad your death would be. The computer literally GAVE UP trying to process your survival plan. It's like your strategy was SO STUPID the AI was like 'I'm not even touching this one!'",
        rationale: "Your strategy was so BAD it BROKE our EVALUATION SYSTEM, which is actually an ACHIEVEMENT in itself!"
      };
    }
  } catch (error) {
    console.error("Error evaluating survival:", error);
    throw error;
  }
} 