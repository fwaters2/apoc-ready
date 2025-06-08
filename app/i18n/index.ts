export type Locale = 'en' | 'zh-TW';

export const locales: Record<Locale, string> = {
  'en': 'English',
  'zh-TW': '繁體中文',
};

export type TranslationKey = 
  | 'appTitle'
  | 'selectScenario'
  | 'evaluateButton'
  | 'evaluatingButton'
  | 'tryAgainButton'
  | 'survivalRate'
  | 'analysisTitle'
  | 'deathSceneTitle'
  | 'errorMessage'
  | 'questionPlaceholder';

export type Translations = Record<TranslationKey, string>;

export type LocaleTranslations = Record<Locale, Translations>;

export const translations: LocaleTranslations = {
  'en': {
    appTitle: 'APOCALYPSE READINESS ASSESSOR',
    selectScenario: 'SELECT YOUR APOCALYPSE',
    evaluateButton: 'EVALUATE MY CHANCES (IF YOU DARE)',
    evaluatingButton: 'EVALUATING...',
    tryAgainButton: 'TRY AGAIN, FOR THE LOVE OF GOD',
    survivalRate: 'Survival Rate',
    analysisTitle: 'WHAT WERE YOU THINKING?!',
    deathSceneTitle: 'YOUR INEVITABLE END:',
    errorMessage: 'Failed to evaluate survival chances',
    questionPlaceholder: 'Type your answer here...',
  },
  'zh-TW': {
    appTitle: '末日生存評估器',
    selectScenario: '選擇你的末日情境',
    evaluateButton: '評估我的生存機率（如果你敢）',
    evaluatingButton: '正在評估...',
    tryAgainButton: '天啊，再試一次',
    survivalRate: '生存率',
    analysisTitle: '你到底在想什麼？！',
    deathSceneTitle: '你無可避免的結局：',
    errorMessage: '無法評估生存機率',
    questionPlaceholder: '在此輸入你的答案...',
  }
};

export const getTranslation = (locale: Locale, key: TranslationKey): string => {
  return translations[locale][key] || translations['en'][key];
};

// Scenario translations
export type ScenarioTranslations = {
  name: string;
  questions: string[];
};

export type ScenarioLocaleTranslations = Record<string, Record<Locale, ScenarioTranslations>>;

export const scenarioTranslations: ScenarioLocaleTranslations = {
  'zombie': {
    'en': {
      name: 'Zombie Outbreak',
      questions: [
        "What's your first move when you hear about the zombie outbreak?",
        "What's your weapon of choice for the zombie apocalypse?",
        "Where would you set up your base of operations?",
        "What special skill do you bring to a survivor group?",
        "How would you handle encountering an infected loved one?",
      ]
    },
    'zh-TW': {
      name: '殭屍爆發',
      questions: [
        "當你聽到殭屍爆發的消息時，你的第一步是什麼？",
        "在殭屍末日中，你選擇的武器是什麼？",
        "你會在哪裡建立你的基地？",
        "你能為倖存者團體帶來什麼特殊技能？",
        "如果遇到被感染的親人，你會如何處理？",
      ]
    }
  },
  'alien': {
    'en': {
      name: 'Alien Invasion',
      questions: [
        "How would you try to communicate with the aliens?",
        "What Earth technology would you use against them?",
        "Where would you hide from their advanced detection systems?",
        "How would you convince them humans are worth keeping around?",
        "What's your backup plan if negotiation fails?",
      ]
    },
    'zh-TW': {
      name: '外星人入侵',
      questions: [
        "你會如何嘗試與外星人溝通？",
        "你會使用地球上的哪種科技對抗他們？",
        "你會在哪裡躲避他們先進的偵測系統？",
        "你會如何說服外星人人類值得保留？",
        "如果談判失敗，你的備用計劃是什麼？",
      ]
    }
  },
  'ai-takeover': {
    'en': {
      name: 'AI Takeover',
      questions: [
        "What's your strategy for avoiding AI detection systems?",
        "How would you disable or hack into the AI network?",
        "Where would you find shelter from robot patrols?",
        "What analog tools would you rely on in a digital world?",
        "How would you organize human resistance against the machines?",
      ]
    },
    'zh-TW': {
      name: 'AI 接管',
      questions: [
        "你避開AI偵測系統的策略是什麼？",
        "你會如何癱瘓或駭入AI網路？",
        "你會在哪裡躲避機器人巡邏？",
        "在數位世界中，你會依賴什麼類比工具？",
        "你會如何組織人類對抗機器的抵抗？",
      ]
    }
  },
  'asteroid-impact': {
    'en': {
      name: 'Asteroid Impact',
      questions: [
        "Where would you go to survive the initial impact?",
        "What supplies would you stockpile for the nuclear winter?",
        "How would you find or create breathable air?",
        "What's your plan for finding food in the post-impact wasteland?",
        "How would you stay warm during the endless winter?",
      ]
    },
    'zh-TW': {
      name: '小行星撞擊',
      questions: [
        "你會去哪裡躲避初期的撞擊？",
        "你會為核子冬天囤積什麼物資？",
        "你會如何找到或製造可呼吸的空氣？",
        "在撞擊後的荒地中尋找食物的計劃是什麼？",
        "在無盡的冬天中你會如何保暖？",
      ]
    }
  }
}; 