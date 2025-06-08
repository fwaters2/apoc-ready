import { Locale } from "../i18n";

// Unified scenario configuration types
export interface ScenarioTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    highlight: string;
  };
  backgroundImage: string;
}

export interface LocalizedText {
  en: string;
  'zh-TW': string;
}

export interface ScenarioConfig {
  id: string;
  name: LocalizedText;
  theme: ScenarioTheme;
  questions: LocalizedText[];
  promptTemplate: string;
}

// Base prompt template function to eliminate duplication
function createPromptTemplate(scenarioName: string): string {
  return `Given the following ${scenarioName.toLowerCase()} scenario and user answers, evaluate their likelihood of survival. Channel comedian Bill Burr's style throughout ALL sections - use his direct, cynical, exasperated rants about the absurdity of people's choices, with ALL CAPS for emphasis and lots of rhetorical questions.
Scenario: ${scenarioName}
Answers:
{{answers}}

Provide a structured evaluation with ALL sections in Bill Burr's comedic voice:

1. ANALYSIS: Express exasperated disbelief at their choices, use rhetorical questions, and build up a rant about how each choice is worse than the last. Use Bill Burr's signature phrases and comedic timing.

2. DEATH_SCENE: Write this EXACTLY like Bill Burr would describe it in a stand-up routine - with his characteristic rants, interrupting himself, using ALL CAPS for emphasis, and expressing complete disbelief at the user's stupidity. Make it a comedic, absurd scene showing the inevitable consequences of their terrible choices.

3. SCORE_AND_RATIONALE: Write a one-sentence rationale in pure Bill Burr style - cynical, blunt, with his signature exasperated tone. Make it sound like something he would yell during a podcast rant.

Respond with properly formatted JSON containing these sections.`;
}

// Unified scenario configurations - single source of truth
export const scenarioConfigs: Record<string, ScenarioConfig> = {
  'zombie': {
    id: 'zombie',
    name: {
      en: 'Zombie Outbreak',
      'zh-TW': '殭屍爆發'
    },
    theme: {
      colors: {
        primary: '#aa2222',
        secondary: '#ff4444',
        accent: '#990000',
        text: '#ffcccc',
        highlight: '#dd3333'
      },
      backgroundImage: '/backgrounds/zombie.png'
    },
    questions: [
      {
        en: "What's your first move when you hear about the zombie outbreak?",
        'zh-TW': "當你聽到殭屍爆發的消息時，你的第一步是什麼？"
      },
      {
        en: "What's your weapon of choice for the zombie apocalypse?",
        'zh-TW': "在殭屍末日中，你選擇的武器是什麼？"
      },
      {
        en: "Where would you set up your base of operations?",
        'zh-TW': "你會在哪裡建立你的基地？"
      },
      {
        en: "What special skill do you bring to a survivor group?",
        'zh-TW': "你能為倖存者團體帶來什麼特殊技能？"
      },
      {
        en: "How would you handle encountering an infected loved one?",
        'zh-TW': "如果遇到被感染的親人，你會如何處理？"
      }
    ],
    promptTemplate: createPromptTemplate('Zombie Outbreak')
  },

  'alien': {
    id: 'alien',
    name: {
      en: 'Alien Invasion',
      'zh-TW': '外星人入侵'
    },
    theme: {
      colors: {
        primary: '#22aa44',
        secondary: '#44ff66',
        accent: '#009922',
        text: '#ccffdd',
        highlight: '#33dd55'
      },
      backgroundImage: '/backgrounds/alien.png'
    },
    questions: [
      {
        en: "How would you try to communicate with the aliens?",
        'zh-TW': "你會如何嘗試與外星人溝通？"
      },
      {
        en: "What Earth technology would you use against them?",
        'zh-TW': "你會使用地球上的哪種科技對抗他們？"
      },
      {
        en: "Where would you hide from their advanced detection systems?",
        'zh-TW': "你會在哪裡躲避他們先進的偵測系統？"
      },
      {
        en: "How would you convince them humans are worth keeping around?",
        'zh-TW': "你會如何說服外星人人類值得保留？"
      },
      {
        en: "What's your backup plan if negotiation fails?",
        'zh-TW': "如果談判失敗，你的備用計劃是什麼？"
      }
    ],
    promptTemplate: createPromptTemplate('Alien Invasion')
  },

  'ai-takeover': {
    id: 'ai-takeover',
    name: {
      en: 'AI Takeover',
      'zh-TW': 'AI 接管'
    },
    theme: {
      colors: {
        primary: '#1A1A2E',
        secondary: '#E94560',
        accent: '#16213E',
        text: '#F4F4F4',
        highlight: '#0F3460'
      },
      backgroundImage: '/backgrounds/ai-takeover.png'
    },
    questions: [
      {
        en: "What's your strategy for avoiding AI detection systems?",
        'zh-TW': "你避開AI偵測系統的策略是什麼？"
      },
      {
        en: "How would you disable or hack into the AI network?",
        'zh-TW': "你會如何癱瘓或駭入AI網路？"
      },
      {
        en: "Where would you find shelter from robot patrols?",
        'zh-TW': "你會在哪裡躲避機器人巡邏？"
      },
      {
        en: "What analog tools would you rely on in a digital world?",
        'zh-TW': "在數位世界中，你會依賴什麼類比工具？"
      },
      {
        en: "How would you organize human resistance against the machines?",
        'zh-TW': "你會如何組織人類對抗機器的抵抗？"
      }
    ],
    promptTemplate: createPromptTemplate('AI Takeover')
  },

  'asteroid-impact': {
    id: 'asteroid-impact',
    name: {
      en: 'Asteroid Impact',
      'zh-TW': '小行星撞擊'
    },
    theme: {
      colors: {
        primary: '#8B4513',
        secondary: '#F4A460',
        accent: '#CD853F',
        text: '#FFF8DC',
        highlight: '#D2691E'
      },
      backgroundImage: '/backgrounds/asteroid.png'
    },
    questions: [
      {
        en: "Where would you go to survive the initial impact?",
        'zh-TW': "你會去哪裡躲避初期的撞擊？"
      },
      {
        en: "What supplies would you stockpile for the nuclear winter?",
        'zh-TW': "你會為核子冬天囤積什麼物資？"
      },
      {
        en: "How would you find or create breathable air?",
        'zh-TW': "你會如何找到或製造可呼吸的空氣？"
      },
      {
        en: "What's your plan for finding food in the post-impact wasteland?",
        'zh-TW': "在撞擊後的荒地中尋找食物的計劃是什麼？"
      },
      {
        en: "How would you stay warm during the endless winter?",
        'zh-TW': "在無盡的冬天中你會如何保暖？"
      }
    ],
    promptTemplate: createPromptTemplate('Asteroid Impact')
  }
};

// Validation function to ensure all scenarios are complete
export function validateScenario(config: ScenarioConfig): void {
  const requiredFields = ['id', 'name', 'theme', 'questions', 'promptTemplate'];
  
  for (const field of requiredFields) {
    if (!config[field as keyof ScenarioConfig]) {
      throw new Error(`Scenario ${config.id} is missing required field: ${field}`);
    }
  }
  
  // Validate translations exist for both locales
  const requiredLocales: Locale[] = ['en', 'zh-TW'];
  for (const locale of requiredLocales) {
    if (!config.name[locale]) {
      throw new Error(`Scenario ${config.id} is missing name translation for locale: ${locale}`);
    }
    
    for (let i = 0; i < config.questions.length; i++) {
      if (!config.questions[i][locale]) {
        throw new Error(`Scenario ${config.id} is missing question ${i} translation for locale: ${locale}`);
      }
    }
  }
  
  // Validate theme colors
  const requiredColors = ['primary', 'secondary', 'accent', 'text', 'highlight'];
  for (const color of requiredColors) {
    if (!config.theme.colors[color as keyof typeof config.theme.colors]) {
      throw new Error(`Scenario ${config.id} is missing theme color: ${color}`);
    }
  }
}

// Validate all scenarios in development
if (process.env.NODE_ENV === 'development') {
  for (const [id, config] of Object.entries(scenarioConfigs)) {
    try {
      validateScenario(config);
    } catch (error) {
      console.error(`❌ Scenario validation failed for ${id}:`, (error as Error).message);
    }
  }
  console.log(`✅ Validated ${Object.keys(scenarioConfigs).length} scenarios`);
} 