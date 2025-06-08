import OpenAI from "openai";
import { Locale } from "../i18n";
import { DEV_CONFIG } from "../constants/development";
import { mockEvaluationResponses, delay } from "./mockData";
import { apiCache } from "./cache";
import { EvaluationResponse, getErrorResponse } from "./messages";

// Get API key from environment variables - check both regular and NEXT_PUBLIC_ variants
const API_KEY = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

// Production safety check - fall back to mock responses rather than breaking the app
if (!API_KEY) {
  if (DEV_CONFIG.USE_MOCK_RESPONSES || process.env.NODE_ENV !== "production") {
    console.warn("⚠️ No OpenAI API key found. Using mock responses instead.");
  } else {
    // In production with no API key - force mock responses to prevent breaking the app
    console.error("⚠️ WARNING: No OpenAI API key found in production. Forcing mock responses.");
    Object.assign(DEV_CONFIG, { USE_MOCK_RESPONSES: true });
  }
}

// Create OpenAI instance only if we have an API key
const openai = API_KEY ? new OpenAI({ apiKey: API_KEY }) : null;



export async function evaluateSurvival(
  scenario: string,
  answers: string[],
  locale: Locale = 'en'
): Promise<EvaluationResponse> {
  try {
    console.log(`Evaluating survival for scenario: ${scenario}`);
    console.log(`Mock responses enabled: ${DEV_CONFIG.USE_MOCK_RESPONSES}`);
    
    // Create a cache key for this evaluation
    const cacheKey = apiCache.createEvaluationKey(scenario, answers, locale);
    
    // Check if we have a cached response and should use cache
    if (DEV_CONFIG.CACHE_API_RESPONSES && apiCache.has(cacheKey)) {
      console.log("[DEV] Using cached response for evaluation");
      const cachedResponse = apiCache.get<EvaluationResponse>(cacheKey);
      if (cachedResponse) return cachedResponse;
    }
    
    // Use mock responses in development mode or when forced in production
    if (DEV_CONFIG.USE_MOCK_RESPONSES) {
      console.log(`Using mock response for scenario: ${scenario}`);
      
      // Simulate API delay if configured
      if (DEV_CONFIG.MOCK_RESPONSE_DELAY > 0) {
        await delay(DEV_CONFIG.MOCK_RESPONSE_DELAY);
      }
      
      // Get mock response for this scenario and locale, or fallback to error response
      let mockResponse;
      try {
        // Try to get a specific mock response for this scenario
        mockResponse = mockEvaluationResponses[scenario]?.[locale];
        
        // If no scenario-specific mock is found, try to get one from any available scenario
        if (!mockResponse) {
          console.log(`No mock for scenario "${scenario}" and locale "${locale}", trying fallback...`);
          // Get all available scenarios
          const availableScenarios = Object.keys(mockEvaluationResponses);
          if (availableScenarios.length > 0) {
            // Use the first available scenario as fallback
            const fallbackScenario = availableScenarios[0];
            mockResponse = mockEvaluationResponses[fallbackScenario]?.[locale] || 
                          mockEvaluationResponses[fallbackScenario]?.['en'];
            console.log(`Using fallback mock from scenario "${fallbackScenario}"`);
          }
        }
      } catch (mockError) {
        console.error("Error accessing mock data:", mockError);
      }
      
      // If still no response, use the error response
      if (!mockResponse) {
        console.log("No suitable mock found, using error response");
        mockResponse = getErrorResponse(locale);
      }
      
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
      model: "chatgpt-4o-latest",
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
      response_format: { type: "json_object" },
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
          const survivalTimeMatch = responseContent.match(/"survivalTimeMs"\s*:\s*(\d+)/);
          
          result = {
            analysis: analysisMatch ? analysisMatch[1] : "",
            deathScene: deathSceneMatch ? deathSceneMatch[1] : "",
            rationale: rationaleMatch ? rationaleMatch[1] : "",
            score: scoreMatch ? parseInt(scoreMatch[1], 10) : 0,
            survivalTimeMs: survivalTimeMatch ? parseInt(survivalTimeMatch[1], 10) : 0
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
        // Always set score to 0 regardless of what was returned
        // If survivalTimeMs is not provided, default to a random time between 1 minute and 48 hours
        const evaluationResult = { 
          ...result, 
          score: 0,
          survivalTimeMs: result.survivalTimeMs || Math.floor(Math.random() * (172800000 - 60000) + 60000) // 1 min to 48 hours
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

3. SURVIVAL_TIME: Calculate how long they survived from the start of the apocalypse in milliseconds, based on the death scene. Consider both the severity of their choices and the comedic timing. Use very short times (500-5000ms) for immediate disasters, moderate times (hours to days in milliseconds) for gradual failures, and longer times (weeks in milliseconds) for surprisingly persistent but ultimately doomed strategies.

4. SCORE_AND_RATIONALE: Write a rationale using dry, matter-of-fact statements about utterly absurd conclusions. Comment on the cosmic insignificance of their choices while simultaneously noting how spectacularly unique their particular form of failure is.`,
      
      formatInstructions: `Format your response EXACTLY like this example, with no other text:
{
  "analysis": "• Hiding in the basement: Statistically speaking, basements during apocalyptic events become the second most dangerous place to hide, narrowly beating out active volcanoes but falling just behind anywhere with a neon sign reading 'Free Food'.\n• Kitchen knife: A kitchen knife during the apocalypse serves approximately the same function as a paper airplane in a hurricane - technically it's still a knife, but practically speaking it's more of a very brief distraction.\n• Suburban house: Choosing a suburban house is remarkably efficient, as it combines the disadvantages of urban density with none of the advantages of rural isolation.\n• Cooking skills: When facing the end of civilization, cooking skills rank just below 'able to recite poetry' and just above 'excellent at mini-golf' in terms of survival utility.\n• Compassion: Compassion during an apocalypse is nature's way of ensuring population control.",
  "deathScene": "On the third day of the apocalypse, an improbable series of events unfolded with mathematical precision. Your basement, which had maintained a rather pleasant 68 degrees until that point, became the exact temperature preferred by a particularly large swarm of mutated insects. They were quite surprised to find you there with your kitchen knife, as they had specifically evolved to be immune to cutlery. In a moment of compassion, you decided not to swat them, unaware that in their newly evolved social structure, not being swatted is considered a marriage proposal. Your last thoughts, as your new insect spouses began the traditional honeymoon ritual, were statistically identical to the last thoughts of 83% of apocalypse victims: a resigned 'Well, this is unfortunate.'",
  "survivalTimeMs": 259200000,
  "score": 0,
  "rationale": "Your survival strategy ranks somewhere between 'wearing a meat suit to a predator convention' and 'using fireworks as umbrella substitutes' - technically actions one could take, but with outcomes so predictably unfortunate they almost achieve a kind of mathematical elegance."
}`,
      
      systemPrompt: `You are generating apocalypse survival evaluations with dry, understated humor - matter-of-fact observations about absurd situations, unexpected metaphors, and a calm tone when describing utterly improbable scenarios. Every section must maintain this style of deadpan commentary on the ridiculous. Provide your response in JSON format.`,
    },
    
    'zh-TW': {
      intro: `用乾式幽默和低調的風格評估末日生存情境。`,
      
      structuredEvaluation: `請提供一個結構化的生存評估，包含以下部分，全部使用乾式、低調的幽默風格：

1. 分析：為每個答案提供一個項目符號，使用百科全書式的語調，以乾式幽默和荒謬的觀察來分析。包括不切實際的統計數據，評論他們選擇的驚人不可能性，並對其他同樣注定失敗的情境進行面無表情的比較。請引用答案編號。

2. 死亡場景：使用荒謬的具體細節、滑稽的不太可能的巧合和宇宙諷刺來描述。以一種超然的興趣語調描述他們選擇的必然而不可能的後果，就像在為一個特別不幸的物種旁白自然紀錄片一樣。

3. 生存時間：根據死亡場景計算他們從末日開始存活了多長時間（以毫秒為單位）。考慮他們選擇的嚴重性和喜劇時機。對於立即災難使用非常短的時間（500-5000毫秒），對於漸進失敗使用中等時間（小時到天的毫秒），對於令人驚訝的持久但最終注定失敗的策略使用較長時間（週的毫秒）。

4. 分數和理由：使用乾巴巴、實事求是的陳述來描述完全荒謬的結論。評論他們選擇在宇宙中的微不足道，同時指出他們特定形式的失敗是多麼獨特。`,
      
      formatInstructions: `請確保你的回應完全符合以下格式，不要添加其他文本：
{
  "analysis": "• 躲在地下室：從統計學角度來看，地下室在末日事件中成為第二危險的藏身之處，僅次於任何標有「免費食物」霓虹燈的地方。\n• 廚房刀：在末日中使用廚房刀的功能大約相當於颶風中的紙飛機 - 從技術上講它仍然是一把刀，但實際上它更像是一個非常短暫的分心物。\n• 郊區房子：選擇郊區房子是非常高效的，因為它結合了城市密度的缺點，卻沒有鄉村隔離的任何優點。\n• 烹飪技能：面對文明的終結，烹飪技能的實用性排名剛好低於「能夠背誦詩歌」，高於「擅長迷你高爾夫」。\n• 同情心：在末日期間表現同情心是自然界確保人口控制的方式。",
  "deathScene": "在末日的第三天，一系列不太可能的事件以數學般的精確度展開。你的地下室，直到那時一直保持著相當宜人的20度溫度，變成了特別大的變異昆蟲群喜歡的確切溫度。它們對在那裡發現拿著廚房刀的你感到相當驚訝，因為它們已經特別進化到免疫刀具。出於同情心，你決定不拍打它們，卻不知道在它們新進化的社會結構中，不被拍打被視為求婚。當你的新昆蟲配偶們開始傳統的蜜月儀式時，你的最後想法在統計上與83%的末日受害者的最後想法相同：一種無奈的「嗯，這真不幸。」",
  "survivalTimeMs": 259200000,
  "score": 0,
  "rationale": "你的生存策略排名介於「在掠食者大會上穿著肉製服裝」和「把煙花當作雨傘替代品」之間 - 技術上是人們可以採取的行動，但其結果如此可預見地不幸，幾乎達到了一種數學上的優雅。"
}`,
      
      systemPrompt: `你正在生成末日生存評估，使用乾式、低調的幽默風格 - 對荒謬情況進行實事求是的觀察，使用意想不到的比喻，並在描述完全不可能的情況時保持冷靜的語調。每個部分都必須保持這種對荒謬事物的面無表情的評論風格。請以JSON格式提供你的回應。`,
    }
  };
  
  return instructions[locale];
}

