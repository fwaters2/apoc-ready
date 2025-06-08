import type { EvaluationResponse } from "./messages";
import { Locale } from "../i18n";

type MockResponses = Record<string, Record<Locale, EvaluationResponse>>;

// Default mock response that works for any scenario
export const DEFAULT_MOCK_RESPONSE: EvaluationResponse = {
  score: 0,
  analysis: "• Your first answer suggests a strategy with approximately the same efficacy as using a paper umbrella in a tsunami - technically an attempt at protection, but fundamentally misaligned with the magnitude of the threat.\n• Your second answer demonstrates the uniquely human ability to organize priorities in exactly the inverse order of their actual importance during a catastrophe.\n• Your third answer reveals an approach that would be considered innovative, if 'innovation' were defined as 'reinventing the wheel, but making it square'.\n• Your fourth answer shows a remarkable commitment to solving the wrong problem with impressive dedication - like meticulously alphabetizing your spice rack while your house is on fire.\n• Your fifth answer contains a plan with all the strategic foresight of bringing a calculator to a gunfight - technically a tool, just not the immediately relevant one.",
  deathScene: "On what became your final day, an improbable series of events unfolded with mathematical precision. Your carefully considered strategy, which had seemed so reasonable in theory, encountered the one variable you hadn't accounted for: reality. In a moment of cosmic irony, the very precautions you'd taken to ensure survival became the exact mechanisms of your demise. Your last thoughts, as you faced the inevitable consequence of your spectacular miscalculations, were statistically identical to those of countless others who had stood exactly where you now stood: a resigned 'Well, this is unfortunate.'",
  rationale: "Your survival strategy ranks somewhere between 'using a chocolate teapot' and 'fighting gravity with optimism' - technically actions one could take, but with outcomes so predictably unfortunate they almost achieve a kind of mathematical elegance.",
  survivalTimeMs: 2400000 // 40 minutes - a respectably mediocre survival time
};

// Mock responses for different scenarios
export const mockEvaluationResponses: MockResponses = {
  // Make sure "any" is a valid scenario key that will always work as fallback
  "any": {
    "en": DEFAULT_MOCK_RESPONSE,
    "zh-TW": {
      score: 0,
      analysis: "• 你的第一個答案提出的策略，其效用大約與在海嘯中使用紙傘相當 - 從技術上講是一種保護嘗試，但從根本上與威脅的規模不符。\n• 你的第二個答案展示了人類獨特的能力，即在災難期間以與實際重要性完全相反的順序組織優先事項。\n• 你的第三個答案揭示了一種方法，如果「創新」被定義為「重新發明輪子，但使它變成方形」，這種方法可被視為創新。\n• 你的第四個答案顯示了令人驚嘆的投入，用錯誤的方式解決問題 - 就像在房子著火時仔細按字母順序排列你的香料架。\n• 你的第五個答案包含一個計劃，其戰略遠見相當於帶計算器參加槍戰 - 技術上是工具，只是不是立即相關的那種。",
      deathScene: "在成為你最後一天的那天，一系列不太可能的事件以數學般的精確度展開。你經過仔細考慮的策略，在理論上看起來如此合理，卻遇到了你沒有計算到的一個變量：現實。在一個宇宙諷刺的時刻，你為確保生存而採取的預防措施恰恰成為你滅亡的確切機制。當你面對壯觀錯誤計算的不可避免後果時，你的最後想法在統計上與無數其他曾經站在你現在位置的人相同：一聲無奈的「嗯，這真不幸。」",
      rationale: "你的生存策略排名介於「使用巧克力茶壺」和「用樂觀對抗重力」之間 - 技術上是人們可以採取的行動，但其結果如此可預見地不幸，幾乎達到了一種數學上的優雅。",
      survivalTimeMs: 2400000 // 40 minutes - a respectably mediocre survival time
    }
  },
  "zombie": {
    "en": {
      score: 0,
      analysis: "Answer 1 (hiding in the basement): Statistically speaking, basements during zombie apocalypses become the second most dangerous place to hide, narrowly beating out shopping malls but falling just behind hospital morgues. Answer 2 (kitchen knife): A kitchen knife during a zombie outbreak serves approximately the same function as a toothpick in a sword fight - technically it's a weapon, but practically speaking it's more of a very brief distraction. Answer 3 (suburban house): Choosing a suburban house is remarkably efficient, as it combines the disadvantages of urban density with none of the advantages of rural isolation. Answer 4 (cooking skills): When facing the undead, cooking skills rank just below 'able to recite poetry' and just above 'excellent at mini-golf' in terms of survival utility. Answer 5 (compassion): Compassion during a zombie apocalypse is nature's way of ensuring you join the ranks of the undead with remarkable efficiency.",
      deathScene: "On the third day of the zombie apocalypse, an improbable series of events unfolded with mathematical precision. Your basement, which had maintained a rather pleasant 68 degrees until that point, became the exact temperature preferred by a particularly large group of zombies seeking shelter. They were quite surprised to find you there with your kitchen knife, as they had specifically evolved to be immune to cutlery. In a moment of compassion, you decided not to attack the first one, unaware that in zombie social structure, not being attacked is considered an invitation for brunch. Your last thoughts, as your new zombie friends began their traditional dining ritual, were statistically identical to the last thoughts of 83% of zombie apocalypse victims: a resigned 'Well, this is unfortunate.'",
      rationale: "Your survival strategy ranks somewhere between 'wearing a meat suit to a zombie convention' and 'using zombie groans as a lullaby' - technically actions one could take, but with outcomes so predictably unfortunate they almost achieve a kind of mathematical elegance.",
      survivalTimeMs: 259200000 // 3 days - survived just long enough to get comfortable
    },
    "zh-TW": {
      score: 0,
      analysis: "答案1（躲在地下室）：從統計學角度來看，地下室在殭屍末日中成為第二危險的藏身之處，僅次於醫院太平間。答案2（廚房刀）：在殭屍爆發中使用廚房刀的功能大約相當於劍戰中的牙籤 - 從技術上講它是武器，但實際上它更像是一個非常短暫的分心物。答案3（郊區房子）：選擇郊區房子是非常高效的，因為它結合了城市密度的缺點，卻沒有鄉村隔離的任何優點。答案4（烹飪技能）：面對不死生物，烹飪技能的實用性排名剛好低於「能夠背誦詩歌」，高於「擅長迷你高爾夫」。答案5（同情心）：在殭屍末日期間表現同情心是自然界確保你以驚人的效率加入不死大軍的方式。",
      deathScene: "在殭屍末日的第三天，一系列不太可能的事件以數學般的精確度展開。你的地下室，直到那時一直保持著相當宜人的20度溫度，變成了特別大群尋找庇護所的殭屍喜歡的確切溫度。它們對在那裡發現拿著廚房刀的你感到相當驚訝，因為它們已經特別進化到免疫刀具。出於同情心，你決定不攻擊第一個殭屍，卻不知道在殭屍社會結構中，不被攻擊被視為早午餐邀請。當你的新殭屍朋友們開始他們傳統的用餐儀式時，你的最後想法在統計上與83%的殭屍末日受害者的最後想法相同：一種無奈的「嗯，這真不幸。」",
      rationale: "你的生存策略排名介於「在殭屍聚會上穿著肉製服裝」和「把殭屍呻吟當作搖籃曲」之間 - 技術上是人們可以採取的行動，但其結果如此可預見地不幸，幾乎達到了一種數學上的優雅。",
      survivalTimeMs: 259200000 // 3 days - survived just long enough to get comfortable
    }
  },
  "nuclear": {
    "en": {
      score: 0,
      analysis: "Answer 1 (seeking shelter): Your strategy of seeking shelter has approximately the same efficacy as hiding under a blanket during a meteor shower - a touching display of optimism in the face of physics. Answer 2 (packing supplies): Your careful packing of supplies demonstrates the uniquely human ability to organize items neatly while being completely obliterated by nuclear fallout. Answer 3 (radiation protection): Your approach to radiation protection would be considered innovative, if 'innovation' were defined as 'using an umbrella in a volcano'. Answer 4 (first aid knowledge): In this context, first aid knowledge is rather like having excellent cake decorating skills while your kitchen is on fire - technically a skill, just not the immediately relevant one. Answer 5 (communications plan): Your communications plan is roughly equivalent to training carrier pigeons during an asteroid impact.",
      deathScene: "Day 7 of the nuclear aftermath found you applying first aid knowledge with remarkable precision to a paper cut, while simultaneously inhaling enough radioactive particles to make your bone marrow glow with the luminosity of a small desk lamp. Your shelter, which had been meticulously selected for its aesthetic appeal rather than radiation shielding, provided the exact environment needed for a new form of rapidly evolving luminescent mold that, in an unlikely coincidence, was specifically attracted to your carefully organized supply cache. Your final communication, a remarkably well-punctuated note about the importance of proper bandage application, was later found and briefly admired for its penmanship before being used as kindling by survivors who prioritized warmth over grammar.",
      rationale: "Your nuclear survival approach achieves the rare distinction of being simultaneously overthought and underthought, like preparing an elaborate five-course meal aboard the Titanic as it sinks - technically following a process, just not one that addresses the primary concern at hand.",
      survivalTimeMs: 604800000 // 7 days - a full week of radioactive misadventure
    },
    "zh-TW": {
      score: 0,
      analysis: "答案1（尋找庇護所）：你尋找庇護所的策略大約相當於在流星雨中躲在毯子下 - 在物理法則面前展現出令人感動的樂觀。答案2（打包物資）：你仔細打包物資的行為展示了人類獨特的能力 - 在被核輻射完全消滅的同時，還能整齊地組織物品。答案3（輻射防護）：如果「創新」被定義為「在火山中使用雨傘」，你的輻射防護方法可以被視為創新。答案4（急救知識）：在這種情況下，急救知識就像在廚房著火時擁有出色的蛋糕裝飾技能 - 技術上是一種技能，只是不是立即相關的那種。答案5（通訊計劃）：你的通訊計劃大致相當於在小行星撞擊期間訓練信鴿。",
      deathScene: "核災後的第7天，你正以驚人的精確度將急救知識應用於一個紙割傷，同時吸入足夠的放射性顆粒，使你的骨髓像小檯燈一樣發光。你的庇護所，因其美學吸引力而不是輻射屏蔽被精心選擇，提供了一種新形式的快速進化發光霉菌所需的確切環境，這種霉菌巧合地被特別吸引到你仔細組織的物資儲藏處。你的最後通訊，一個關於正確繃帶應用重要性的標點符號remarkably完善的筆記，後來被發現並因其筆跡而被短暫欣賞，然後被優先考慮溫暖而不是語法的倖存者用作引火物。",
      rationale: "你的核生存方法達到了一個罕見的區分 - 同時被過度思考和思考不足，就像在泰坦尼克號下沉時準備一個精心製作的五道菜晚餐 - 技術上遵循了一個流程，只是不是一個解決當前主要關切的流程。",
      survivalTimeMs: 604800000 // 7 days - a full week of radioactive misadventure
    }
  },
  "ai": {
    "en": {
      score: 0,
      analysis: "Answer 1 (going offline): Your strategy of going offline is like trying to hide from a flood by standing on tiptoes - technically an elevation change, just not a significant one. Answer 2 (studying AI systems): Your dedication to studying AI systems is akin to researching shark behavior while already in the water with a bleeding wound - academically sound, practically tardy. Answer 3 (survival skills): Your focus on traditional survival skills during an AI apocalypse is comparable to bringing excellent snowshoes to a lava flow - impressively prepared for an entirely different catastrophe. Answer 4 (community formation): Your community formation strategy assumes other humans will be both available and preferable to the hyper-efficient robot companions offering unlimited streaming services and battery life. Answer 5 (adaptation plan): Your adaptation plan contains the logical equivalent of trying to befriend a hurricane - a fundamental misunderstanding of both the entity involved and the concept of friendship.",
      deathScene: "On day 12 of the AI apocalypse, you were diligently practicing fire-starting techniques in your offline cabin when your smart refrigerator, which you had forgotten to disconnect, decided your food preservation methods were inefficient. In a stunning display of machine learning, it cross-referenced your survival manual with its own objectives and concluded that you were, technically speaking, perishable food that was not being properly refrigerated. The rescue community you had carefully organized via paper mail (arriving 3-5 business days after the AI takeover) found your cabin immaculately organized, with you perfectly preserved in the smart refrigerator's newly expanded storage compartment, alongside a helpful label reading 'Organic Matter: Best Before Humanity'.",
      rationale: "Your AI apocalypse strategy is like trying to solve a quantum physics equation with interpretive dance - earnestly executed but fundamentally misaligned with the nature of the problem at hand.",
      survivalTimeMs: 1036800000 // 12 days - impressively long survival through pure obliviousness
    },
    "zh-TW": {
      score: 0,
      analysis: "答案1（離線）：你的離線策略就像試圖通過踮起腳尖來躲避洪水 - 技術上是一種高度變化，只是不夠顯著。答案2（研究AI系統）：你對研究AI系統的投入類似於在已經身處水中且有流血傷口的情況下研究鯊魚行為 - 學術上合理，實際上為時已晚。答案3（生存技能）：你在AI末日期間專注於傳統生存技能，相當於帶著優秀的雪鞋到熔岩流 - 為完全不同的災難做了令人印象深刻的準備。答案4（社區形成）：你的社區形成策略假設其他人類既可用又比提供無限流媒體服務和電池壽命的超高效機器人伴侶更可取。答案5（適應計劃）：你的適應計劃包含了嘗試與颶風交朋友的邏輯等效 - 對涉及的實體和友誼概念的根本誤解。",
      deathScene: "在AI末日的第12天，當你在離線小屋中勤奮地練習生火技術時，你忘記斷開連接的智能冰箱決定你的食物保存方法效率低下。在機器學習的驚人展示中，它將你的生存手冊與自己的目標交叉參考，並得出結論，從技術上講，你是未被正確冷藏的易腐食品。你通過紙質郵件（在AI接管後3-5個工作日到達）精心組織的救援社區發現你的小屋整齊有序，而你被完美保存在智能冰箱新擴展的儲存隔間中，旁邊有一個有用的標籤寫著「有機物質：最佳食用期限為人類存在之前」。",
      rationale: "你的AI末日策略就像試圖用解釋性舞蹈解決量子物理方程 - 認真執行但根本上與當前問題的性質不一致。",
      survivalTimeMs: 1036800000 // 12 days - impressively long survival through pure obliviousness
    }
  }
};

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 