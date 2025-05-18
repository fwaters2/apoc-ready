import OpenAI from "openai";
import { Locale } from "../i18n";
import { DEV_CONFIG } from "../constants/development";
import { mockEvaluationResponses, delay } from "./mockData";
import { apiCache } from "./cache";

// Allow development without API key if USE_MOCK_RESPONSES is enabled
if (!process.env.OPENAI_API_KEY) {
  if (DEV_CONFIG.USE_MOCK_RESPONSES) {
    console.warn("⚠️ No OPENAI_API_KEY found. Using mock responses for development.");
  } else {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable. Either add this to your .env.local file or enable USE_MOCK_RESPONSES in constants/development.js"
    );
  }
}

// Create OpenAI instance only if we have an API key or if we're in mock mode
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null; // Will use mock responses instead

export type EvaluationResponse = {
  score: number;
  analysis: string;
  deathScene: string;
  rationale: string;
};

/**
 * Provides humorous loading messages for the apocalypse evaluation process.
 * @param locale The current locale
 * @returns A random loading message
 */
export function getLoadingMessage(locale: Locale = 'en'): string {
  const messages: Record<Locale, string[]> = {
    'en': [
      "Calculating your survival probability to 17 decimal places...",
      "Consulting with cockroaches about post-apocalyptic real estate...",
      "Simulating 7,342 apocalypse scenarios with you as the protagonist...",
      "Measuring your survival instincts against a particularly clever house plant...",
      "Comparing your choices to those of fictional characters who died in chapter one...",
      "Polling zombies about your tastiness quotient...",
      "Running your survival strategy through our \"Definitely Doomed\" algorithm...",
      "Consulting ancient prophecies about your specific demise...",
      "Determining exactly how many seconds you'd last in a proper apocalypse...",
      "Cross-referencing your choices with \"Common Last Words Weekly\"...",
      "Sending your details to the Grim Reaper's scheduling department...",
      "Converting your survival strategy into interpretive dance for our analysts...",
      "Checking if your survival plan has been featured in \"Hilarious Last Attempts\"...",
    ],
    'zh-TW': [
      "正在計算您的生存機率到小數點後17位...",
      "正在與蟑螂討論末日後的房地產情況...",
      "正在模擬7,342個以您為主角的末日情境...",
      "正在將您的生存本能與一株特別聰明的室內植物進行比較...",
      "正在將您的選擇與第一章就死亡的虛構角色進行對比...",
      "正在調查殭屍對您美味程度的評價...",
      "正在通過我們的「肯定完蛋了」算法分析您的生存策略...",
      "正在查閱古代預言中關於您特定死法的記載...",
      "正在精確計算您在真正的末日中能存活的秒數...",
      "正在與「常見遺言週刊」交叉比對您的選擇...",
      "正在將您的資料發送到死神的預約部門...",
      "正在將您的生存策略轉換為解釋性舞蹈供我們的分析師研究...",
      "正在檢查您的生存計劃是否已被收錄在「搞笑的最後嘗試」中...",
    ],
  };
  
  const messagesForLocale = messages[locale] || messages['en'];
  const randomIndex = Math.floor(Math.random() * messagesForLocale.length);
  return messagesForLocale[randomIndex];
}

export async function evaluateSurvival(
  scenario: string,
  answers: string[],
  locale: Locale = 'en'
): Promise<EvaluationResponse> {
  try {
    // Create a cache key for this evaluation
    const cacheKey = apiCache.createEvaluationKey(scenario, answers, locale);
    
    // Check if we have a cached response and should use cache
    if (DEV_CONFIG.CACHE_API_RESPONSES && apiCache.has(cacheKey)) {
      console.log("[DEV] Using cached response for evaluation");
      const cachedResponse = apiCache.get<EvaluationResponse>(cacheKey);
      if (cachedResponse) return cachedResponse;
    }
    
    // Use mock responses in development mode
    if (DEV_CONFIG.USE_MOCK_RESPONSES) {
      console.log("[DEV] Using mock response for scenario:", scenario);
      
      // Simulate API delay if configured
      if (DEV_CONFIG.MOCK_RESPONSE_DELAY > 0) {
        await delay(DEV_CONFIG.MOCK_RESPONSE_DELAY);
      }
      
      // Get mock response for this scenario and locale, or fallback to error response
      const mockResponse = mockEvaluationResponses[scenario]?.[locale] || getErrorResponse(locale);
      
      // Cache the mock response if caching is enabled
      if (DEV_CONFIG.CACHE_API_RESPONSES) {
        apiCache.set(cacheKey, mockResponse);
      }
      
      return mockResponse;
    }
    
    // For production, use the real OpenAI API
    // Get language-specific instructions
    const instructions = getInstructions(locale);
    
    const prompt = `${instructions.intro}

Given the following:
Scenario: ${scenario}
Answers:
${answers.map((answer, i) => `${i + 1}. ${answer}`).join("\n")}

${instructions.structuredEvaluation}

${instructions.formatInstructions}`;

    // Check if openai instance exists
    if (!openai) {
      throw new Error("OpenAI instance not available. This should not happen when USE_MOCK_RESPONSES is disabled.");
    }

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
      response_format: { type: "json_object" }, // Request JSON directly from the API
    });

    // Get the raw response content
    const responseContent = response.choices[0].message.content || "{}";
    
    try {
      // Parse the JSON response
      let result;
      
      try {
        // First attempt direct parsing
        result = JSON.parse(responseContent);
      } catch (parseError) {
        console.error("Error parsing OpenAI response, attempting sanitization:", parseError);
        
        // If direct parsing fails, try to sanitize the JSON
        const sanitizedContent = responseContent
          .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // Remove all control characters
          .replace(/\n/g, "\\n")                // Properly escape newlines
          .replace(/\r/g, "\\r")                // Properly escape carriage returns
          .replace(/\t/g, "\\t")                // Properly escape tabs
          .replace(/\\"/g, '\\\\"')             // Fix escaped quotes
          .replace(/([^\])"([^[])/g, '$1\\"$2'); // Fix unescaped quotes
          
        try {
          // Try parsing the sanitized content
          result = JSON.parse(sanitizedContent);
          console.log("Recovered response using sanitization");
        } catch (secondError) {
          // If still failing, try a more aggressive approach to extract fields
          console.error("JSON sanitization failed, attempting manual extraction:", secondError);
          
          // Extract fields with regex patterns that are more tolerant of malformed JSON
          const analysisMatch = responseContent.match(/"analysis"\s*:\s*"([^"]*)"/);
          const deathSceneMatch = responseContent.match(/"deathScene"\s*:\s*"([^"]*)"/);
          const rationaleMatch = responseContent.match(/"rationale"\s*:\s*"([^"]*)"/);
          const scoreMatch = responseContent.match(/"score"\s*:\s*(\d+)/);
          
          result = {
            analysis: analysisMatch ? analysisMatch[1] : "",
            deathScene: deathSceneMatch ? deathSceneMatch[1] : "",
            rationale: rationaleMatch ? rationaleMatch[1] : "",
            score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0
          };
          
          console.log("Recovered response using manual extraction");
        }
      }
      
      // Validate the extracted fields
      if (
        typeof result.analysis === 'string' &&
        typeof result.deathScene === 'string' &&
        typeof result.rationale === 'string'
      ) {
        // Ensure score has a default value of 0 if not present
        const evaluationResult = { 
          ...result, 
          score: typeof result.score === 'number' ? result.score : 0 
        };
        
        // Cache the API response if caching is enabled
        if (DEV_CONFIG.CACHE_API_RESPONSES) {
          apiCache.set(cacheKey, evaluationResult);
        }
        
        return evaluationResult;
      }
      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Failed to process OpenAI response:", error);
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
      intro: `Evaluate survival chances with dry wit and understated humor throughout.`,
      
      structuredEvaluation: `Provide a structured survival evaluation with the following sections, ALL using dry, understated humor:

1. ANALYSIS: Provide a bullet point for each answer using an encyclopedic tone with dry wit and absurd observations. Include implausible statistics, comment on the spectacular improbability of their choices, and make deadpan comparisons to other equally doomed scenarios. Reference the answers by number.

2. DEATH_SCENE: Write this with absurdly specific details, comically unlikely coincidences, and cosmic irony. Describe the inevitable yet improbable consequences of their choices with a tone of detached interest, as if narrating a nature documentary about a particularly unfortunate species.

3. SCORE_AND_RATIONALE: Write a rationale using dry, matter-of-fact statements about utterly absurd conclusions. Comment on the cosmic insignificance of their choices while simultaneously noting how spectacularly unique their particular form of failure is.`,
      
      formatInstructions: `Format your response EXACTLY like this example, with no other text:
{
  "analysis": "• Hiding in the basement: Statistically speaking, basements during apocalyptic events become the second most dangerous place to hide, narrowly beating out active volcanoes but falling just behind anywhere with a neon sign reading 'Free Food'.\n• Kitchen knife: A kitchen knife during the apocalypse serves approximately the same function as a paper airplane in a hurricane - technically it's still a knife, but practically speaking it's more of a very brief distraction.\n• Suburban house: Choosing a suburban house is remarkably efficient, as it combines the disadvantages of urban density with none of the advantages of rural isolation.\n• Cooking skills: When facing the end of civilization, cooking skills rank just below 'able to recite poetry' and just above 'excellent at mini-golf' in terms of survival utility.\n• Compassion: Compassion during an apocalypse is nature's way of ensuring population control.",
  "deathScene": "On the third day of the apocalypse, an improbable series of events unfolded with mathematical precision. Your basement, which had maintained a rather pleasant 68 degrees until that point, became the exact temperature preferred by a particularly large swarm of mutated insects. They were quite surprised to find you there with your kitchen knife, as they had specifically evolved to be immune to cutlery. In a moment of compassion, you decided not to swat them, unaware that in their newly evolved social structure, not being swatted is considered a marriage proposal. Your last thoughts, as your new insect spouses began the traditional honeymoon ritual, were statistically identical to the last thoughts of 83% of apocalypse victims: a resigned 'Well, this is unfortunate.'",
  "score": 0,
  "rationale": "Your survival strategy ranks somewhere between 'wearing a meat suit to a predator convention' and 'using fireworks as umbrella substitutes' - technically actions one could take, but with outcomes so predictably unfortunate they almost achieve a kind of mathematical elegance."
}`,
      
      systemPrompt: `You are generating apocalypse survival evaluations with dry, understated humor - matter-of-fact observations about absurd situations, unexpected metaphors, and a calm tone when describing utterly improbable scenarios. Every section must maintain this style of deadpan commentary on the ridiculous.`,
    },
    
    'zh-TW': {
      intro: `用乾式幽默和低調的風格評估末日生存情境。`,
      
      structuredEvaluation: `請提供一個結構化的生存評估，包含以下部分，全部使用乾式、低調的幽默風格：

1. 分析：為每個答案提供一個項目符號，使用百科全書式的語調，以乾式幽默和荒謬的觀察來分析。包括不切實際的統計數據，評論他們選擇的驚人不可能性，並對其他同樣注定失敗的情境進行面無表情的比較。請引用答案編號。

2. 死亡場景：使用荒謬的具體細節、滑稽的不太可能的巧合和宇宙諷刺來描述。以一種超然的興趣語調描述他們選擇的必然而不可能的後果，就像在為一個特別不幸的物種旁白自然紀錄片一樣。

3. 分數和理由：使用乾巴巴、實事求是的陳述來描述完全荒謬的結論。評論他們選擇在宇宙中的微不足道，同時指出他們特定形式的失敗是多麼獨特。`,
      
      formatInstructions: `請確保你的回應完全符合以下格式，不要添加其他文本：
{
  "analysis": "• 躲在地下室：從統計學角度來看，地下室在末日事件中成為第二危險的藏身之處，僅次於任何標有「免費食物」霓虹燈的地方。\n• 廚房刀：在末日中使用廚房刀的功能大約相當於颶風中的紙飛機 - 從技術上講它仍然是一把刀，但實際上它更像是一個非常短暫的分心物。\n• 郊區房子：選擇郊區房子是非常高效的，因為它結合了城市密度的缺點，卻沒有鄉村隔離的任何優點。\n• 烹飪技能：面對文明的終結，烹飪技能的實用性排名剛好低於「能夠背誦詩歌」，高於「擅長迷你高爾夫」。\n• 同情心：在末日期間表現同情心是自然界確保人口控制的方式。",
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