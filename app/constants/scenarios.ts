import { ConsolidatedScenario } from "../types";

// Consolidated scenario configurations - single source of truth
export const SCENARIOS: ConsolidatedScenario[] = [
  {
    id: "zombie",
    name: {
      en: "Zombie Outbreak",
      'zh-TW': "殭屍爆發"
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
    theme: {
      backgroundImage: "/backgrounds/zombie.png",
      colors: {
        primary: "#aa2222",
        secondary: "#ff4444",
        accent: "#990000",
        text: "#ffcccc",
        highlight: "#dd3333"
      }
    }
  },
  {
    id: "alien",
    name: {
      en: "Alien Invasion",
      'zh-TW': "外星人入侵"
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
    theme: {
      backgroundImage: "/backgrounds/alien.png",
      colors: {
        primary: "#22aa44",
        secondary: "#44ff66",
        accent: "#009922",
        text: "#ccffdd",
        highlight: "#33dd55"
      }
    }
  },
  {
    id: "ai-takeover",
    name: {
      en: "AI Takeover",
      'zh-TW': "AI 接管"
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
    theme: {
      backgroundImage: "/backgrounds/ai-takeover.png",
      colors: {
        primary: "#1A1A2E",
        secondary: "#4A90E2",
        accent: "#16213E",
        text: "#F4F4F4",
        highlight: "#2563EB"
      }
    }
  },
  {
    id: "asteroid-impact",
    name: {
      en: "Asteroid Impact",
      'zh-TW': "小行星撞擊"
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
    theme: {
      backgroundImage: "/backgrounds/asteroid.png",
      colors: {
        primary: "#8B4513",
        secondary: "#F4A460",
        accent: "#CD853F",
        text: "#FFF8DC",
        highlight: "#D2691E"
      }
    }
  }
];

