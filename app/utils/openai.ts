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
      intro: `You are evaluating survival chances for an apocalypse scenario. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with escalating frustration, rhetorical questions, and frequent ALL CAPS for emphasis.`,
      
      structuredEvaluation: `Provide a structured survival evaluation with the following sections, ALL in Bill Burr's comedic voice:

1. ANALYSIS: Channel Bill Burr's direct, no-nonsense style as you analyze each answer. Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each answer is worse than the last. Reference the answers by number.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Include his typical phrases like "OH MY GOD" or "WHAT ARE YOU DOING?!" Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant. Include ALL CAPS for emphasis.`,
      
      formatInstructions: `Format your response EXACTLY like this example, with no other text:
{
  "analysis": "Answer 1 (hiding in the basement): Oh my GOD, the BASEMENT?! What are you, outta your mind?! That's like jumping into a shark tank with a paper cut! Answer 2 (kitchen knife): A KITCHEN KNIFE?! Are you serious?! What are you gonna do, make the zombies a salad before they eat your face?! Answer 3 (suburban house): Oh, FANTASTIC choice! Nothing says 'safety' like being surrounded by 500 neighbors who ALL become zombies! Answer 4 (cooking skills): COOKING?! You're worried about COOKING?! That's like being on the Titanic and asking if they have WiFi! Answer 5 (compassion): Oh, that's just BEAUTIFUL. Your loved one is trying to EAT YOU and you're having a moment. Unbelievable.",
  "deathScene": "So there you are, day THREE, hiding in your BRILLIANT basement fortress with your AMAZING kitchen knife, when your infected neighbor - who by the way, used to bring you Christmas cookies - smashes through your window. And what do you do? You HESITATE! Because OF COURSE YOU DO! What are ya, STUPID?! Oh, let me just have a MOMENT with this ZOMBIE who wants to CHEW MY FACE OFF! GENIUS! And that's it! That's your story! They don't even finish eating you because even ZOMBIES have standards! Un-BELIEVABLE!",
  "score": 2,
  "rationale": "Your survival plan is so BAD it actually HELPS the apocalypse, you're basically on the ZOMBIE RECRUITING TEAM at this point!"
}`,
      
      systemPrompt: `You are generating apocalypse survival evaluations in the EXACT comedic style of Bill Burr - direct, cynical, exasperated rants with ALL CAPS for emphasis and lots of rhetorical questions. Every section must sound like Bill Burr's stand-up comedy.`,
    },
    
    'zh-TW': {
      intro: `你正在評估一個末日生存情境。使用諷刺、直接、憤怒的語氣，像脫口秀喜劇演員一樣，對人們荒謬的選擇表達強烈的不可置信，並使用大寫字母來強調重點。`,
      
      structuredEvaluation: `請提供一個結構化的生存評估，包含以下部分，全部使用誇張、諷刺的喜劇風格：

1. 分析：直接、毫不留情地分析每個答案。對他們的選擇表達難以置信的態度，使用反問句，並逐漸升級對每個選擇比上一個更糟的抱怨。請引用答案編號。

2. 死亡場景：像脫口秀一樣描述他們不可避免的結局 - 使用誇張的語氣，經常自我打斷，使用大寫字母強調重點，並對用戶的愚蠢選擇表達完全的不可置信。包括像"天啊"或"你在幹什麼？！"之類的典型短語。讓場景既喜劇又荒謬，展示他們糟糕選擇的必然後果。

3. 分數和理由：用一句話總結為什麼他們的生存分數如此之低 - 尖刻、直接，充滿憤怒的語氣。讓它聽起來像是在播客中大喊出來的內容。使用大寫字母來強調重點。`,
      
      formatInstructions: `請確保你的回應完全符合以下格式，不要添加其他文本：
{
  "analysis": "答案1（躲在地下室）：天啊，地下室？！你瘋了嗎？！這就像帶著紙傷口跳進鯊魚缸！答案2（廚房刀）：廚房刀？！你認真的嗎？！你要幹嘛，在殭屍吃你臉之前給他們做沙拉？！答案3（郊區房子）：哦，太棒了！沒有什麼比被500個全部變成殭屍的鄰居包圍更能代表'安全'了！答案4（烹飪技能）：烹飪？！你擔心烹飪？！這就像在鐵達尼號上問有沒有WiFi一樣！答案5（同情心）：哦，太美了。你的親人正試圖吃掉你，而你卻在那裡感動。難以置信。",
  "deathScene": "所以你在第三天，躲在你那個超級棒的地下室堡壘裡，拿著你那把超級厲害的廚房刀，當你那個以前還給你送聖誕餅乾的被感染鄰居衝破你的窗戶。你做了什麼？你猶豫了！因為你當然會這樣做！你是傻子嗎？！哦，讓我和這個想要咬掉我臉的殭屍來個情感時刻！真是天才！就是這樣！這就是你的故事！他們甚至不會吃完你，因為連殭屍都有標準！難以置信！",
  "score": 2,
  "rationale": "你的生存計劃爛到甚至幫助了末日apocalypse的進行，你基本上是殭屍招募團隊的一員了！"
}`,
      
      systemPrompt: `你正在生成末日生存評估，使用誇張、諷刺的喜劇風格 - 直接、尖刻、憤怒的抱怨，使用大寫字母強調重點，並大量使用反問句。每個部分都必須聽起來像脫口秀喜劇。`,
    }
  };
  
  return instructions[locale];
}

function getErrorResponse(locale: Locale): EvaluationResponse {
  const errorResponses: Record<Locale, EvaluationResponse> = {
    'en': {
      score: 0,
      analysis: "Error analyzing your apocalypse strategy. Which is honestly impressive - you broke the AI before the zombies even showed up! WHAT ARE YA DOIN'?!",
      deathScene: "Look, I can't even DESCRIBE how bad your death would be. The computer literally GAVE UP trying to process your survival plan. It's like your strategy was SO STUPID the AI was like 'I'm not even touching this one!'",
      rationale: "Your strategy was so BAD it BROKE our EVALUATION SYSTEM, which is actually an ACHIEVEMENT in itself!"
    },
    'zh-TW': {
      score: 0,
      analysis: "分析你的末日策略時出錯了。說實話，這真是驚人 - 殭屍還沒出現，你就已經讓AI崩潰了！你到底在幹什麼？！",
      deathScene: "看，我甚至無法描述你的死亡會有多慘。電腦字面意思上放棄嘗試處理你的生存計劃。就像你的策略蠢到連AI都說'這個我可不碰！'",
      rationale: "你的策略爛到弄壞了我們的評估系統，這本身就是一種成就！"
    }
  };
  
  return errorResponses[locale];
} 