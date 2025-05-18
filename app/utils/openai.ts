import OpenAI from "openai";
import { Locale } from "../i18n";

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
  answers: string[],
  locale: Locale = 'en'
): Promise<EvaluationResponse> {
  try {
    // Get language-specific instructions
    const instructions = getInstructions(locale);
    
    const prompt = `${instructions.intro}

Given the following:
Scenario: ${scenario}
Answers:
${answers.map((answer, i) => `${i + 1}. ${answer}`).join("\n")}

${instructions.structuredEvaluation}

${instructions.formatInstructions}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: instructions.systemPrompt,
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
        typeof result.analysis === 'string' &&
        typeof result.deathScene === 'string' &&
        typeof result.rationale === 'string'
      ) {
        // Ensure score is always 0 regardless of the API response
        return { ...result, score: 0 };
      }
      throw new Error("Invalid response format");
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      return getErrorResponse(locale);
    }
  } catch (error) {
    console.error("Error evaluating survival:", error);
    throw error;
  }
}

// Language-specific instruction templates
type InstructionSet = {
  intro: string;
  structuredEvaluation: string;
  formatInstructions: string;
  systemPrompt: string;
};

function getInstructions(locale: Locale): InstructionSet {
  const instructions: Record<Locale, InstructionSet> = {
    'en': {
      intro: `You are evaluating survival chances for an apocalypse scenario. Use dry wit and understated humor throughout ALL sections - employ matter-of-fact observations about absurd situations, unexpected metaphors, and a calm, detached tone when describing utterly improbable scenarios.`,
      
      structuredEvaluation: `Provide a structured survival evaluation with the following sections, ALL using dry, understated humor:

1. ANALYSIS: Use an encyclopedic tone to analyze each answer with dry wit and absurd observations. Include implausible statistics, comment on the spectacular improbability of their choices, and make deadpan comparisons to other equally doomed scenarios. Reference the answers by number.

2. DEATH_SCENE: Write this with absurdly specific details, comically unlikely coincidences, and cosmic irony. Describe the inevitable yet improbable consequences of their choices with a tone of detached interest, as if narrating a nature documentary about a particularly unfortunate species.

3. SCORE_AND_RATIONALE: Write a rationale using dry, matter-of-fact statements about utterly absurd conclusions. Comment on the cosmic insignificance of their choices while simultaneously noting how spectacularly unique their particular form of failure is.`,
      
      formatInstructions: `Format your response EXACTLY like this example, with no other text:
{
  "analysis": "Answer 1 (hiding in the basement): Statistically speaking, basements during apocalyptic events become the second most dangerous place to hide, narrowly beating out active volcanoes but falling just behind anywhere with a neon sign reading 'Free Food'. Answer 2 (kitchen knife): A kitchen knife during the apocalypse serves approximately the same function as a paper airplane in a hurricane - technically it's still a knife, but practically speaking it's more of a very brief distraction. Answer 3 (suburban house): Choosing a suburban house is remarkably efficient, as it combines the disadvantages of urban density with none of the advantages of rural isolation. Answer 4 (cooking skills): When facing the end of civilization, cooking skills rank just below 'able to recite poetry' and just above 'excellent at mini-golf' in terms of survival utility. Answer 5 (compassion): Compassion during an apocalypse is nature's way of ensuring population control.",
  "deathScene": "On the third day of the apocalypse, an improbable series of events unfolded with mathematical precision. Your basement, which had maintained a rather pleasant 68 degrees until that point, became the exact temperature preferred by a particularly large swarm of mutated insects. They were quite surprised to find you there with your kitchen knife, as they had specifically evolved to be immune to cutlery. In a moment of compassion, you decided not to swat them, unaware that in their newly evolved social structure, not being swatted is considered a marriage proposal. Your last thoughts, as your new insect spouses began the traditional honeymoon ritual, were statistically identical to the last thoughts of 83% of apocalypse victims: a resigned 'Well, this is unfortunate.'",
  "score": 0,
  "rationale": "Your survival strategy ranks somewhere between 'wearing a meat suit to a predator convention' and 'using fireworks as umbrella substitutes' - technically actions one could take, but with outcomes so predictably unfortunate they almost achieve a kind of mathematical elegance."
}`,
      
      systemPrompt: `You are generating apocalypse survival evaluations with dry, understated humor - matter-of-fact observations about absurd situations, unexpected metaphors, and a calm tone when describing utterly improbable scenarios. Every section must maintain this style of deadpan commentary on the ridiculous.`,
    },
    
    'zh-TW': {
      intro: `你正在評估一個末日生存情境。在所有部分中使用乾式幽默和低調的幽默風格 - 對荒謬情況進行實事求是的觀察，使用意想不到的比喻，並在描述完全不可能的情況時保持冷靜、超然的語調。`,
      
      structuredEvaluation: `請提供一個結構化的生存評估，包含以下部分，全部使用乾式、低調的幽默風格：

1. 分析：使用百科全書式的語調，以乾式幽默和荒謬的觀察來分析每個答案。包括不切實際的統計數據，評論他們選擇的驚人不可能性，並對其他同樣注定失敗的情境進行面無表情的比較。請引用答案編號。

2. 死亡場景：使用荒謬的具體細節、滑稽的不太可能的巧合和宇宙諷刺來描述。以一種超然的興趣語調描述他們選擇的必然而不可能的後果，就像在為一個特別不幸的物種旁白自然紀錄片一樣。

3. 分數和理由：使用乾巴巴、實事求是的陳述來描述完全荒謬的結論。評論他們選擇在宇宙中的微不足道，同時指出他們特定形式的失敗是多麼獨特。`,
      
      formatInstructions: `請確保你的回應完全符合以下格式，不要添加其他文本：
{
  "analysis": "答案1（躲在地下室）：從統計學角度來看，地下室在末日事件中成為第二危險的藏身之處，僅次於任何標有「免費食物」霓虹燈的地方。答案2（廚房刀）：在末日中使用廚房刀的功能大約相當於颶風中的紙飛機 - 從技術上講它仍然是一把刀，但實際上它更像是一個非常短暫的分心物。答案3（郊區房子）：選擇郊區房子是非常高效的，因為它結合了城市密度的缺點，卻沒有鄉村隔離的任何優點。答案4（烹飪技能）：面對文明的終結，烹飪技能的實用性排名剛好低於「能夠背誦詩歌」，高於「擅長迷你高爾夫」。答案5（同情心）：在末日期間表現同情心是自然界確保人口控制的方式。",
  "deathScene": "在末日的第三天，一系列不太可能的事件以數學般的精確度展開。你的地下室，直到那時一直保持著相當宜人的20度溫度，變成了特別大的變異昆蟲群喜歡的確切溫度。它們對在那裡發現拿著廚房刀的你感到相當驚訝，因為它們已經特別進化到免疫刀具。出於同情心，你決定不拍打它們，卻不知道在它們新進化的社會結構中，不被拍打被視為求婚。當你的新昆蟲配偶們開始傳統的蜜月儀式時，你的最後想法在統計上與83%的末日受害者的最後想法相同：一種無奈的「嗯，這真不幸。」",
  "score": 0,
  "rationale": "你的生存策略排名介於「在掠食者大會上穿著肉製服裝」和「把煙花當作雨傘替代品」之間 - 技術上是人們可以採取的行動，但其結果如此可預見地不幸，幾乎達到了一種數學上的優雅。"
}`,
      
      systemPrompt: `你正在生成末日生存評估，使用乾式、低調的幽默風格 - 對荒謬情況進行實事求是的觀察，使用意想不到的比喻，並在描述完全不可能的情況時保持冷靜的語調。每個部分都必須保持這種對荒謬事物的面無表情的評論風格。`,
    }
  };
  
  return instructions[locale];
}

function getErrorResponse(locale: Locale): EvaluationResponse {
  const errorResponses: Record<Locale, EvaluationResponse> = {
    'en': {
      score: 0,
      analysis: "Our analysis system has encountered what scientists technically refer to as 'a bit of a problem.' After careful examination of your survival strategy, the computer has politely declined to continue processing, which is rather concerning considering computers rarely have opinions.",
      deathScene: "In an unprecedented display of computational stubbornness, your survival plan has managed to completely confuse our analysis systems. This is rather like trying to divide by zero - technically possible to attempt, but with results so spectacularly unhelpful that even discussing them becomes somewhat philosophical.",
      rationale: "Your survival plan defies categorization in any known system of measurement, as it appears to exist in a quantum state of being simultaneously too creative and not creative enough."
    },
    'zh-TW': {
      score: 0,
      analysis: "我們的分析系統遇到了科學家技術上稱為「有點小問題」的情況。在仔細檢查你的生存策略後，電腦已禮貌地拒絕繼續處理，考慮到電腦很少有意見，這相當令人擔憂。",
      deathScene: "在一場前所未有的計算頑固性展示中，你的生存計劃已成功地完全混淆了我們的分析系統。這有點像嘗試除以零 - 技術上可以嘗試，但結果如此驚人地無用，以至於討論它們變得有些哲學性。",
      rationale: "你的生存計劃在任何已知的測量系統中都無法分類，因為它似乎存在於一種量子狀態，同時既太有創意又不夠有創意。"
    }
  };
  
  return errorResponses[locale];
} 