import { Locale } from "../i18n";

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

export function getErrorResponse(locale: Locale): EvaluationResponse {
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