// Consolidated interface that captures all scenario data
export interface ConsolidatedScenario {
  // Core identification
  id: string;
  
  // Content with internationalization support
  name: {
    en: string;
    'zh-TW': string;
  };
  questions: Array<{
    en: string;
    'zh-TW': string;
  }>;
  
  // Visual theming - comprehensive color system
  theme: {
    backgroundImage: string;
    colors: {
      primary: string;      // Main brand color for this scenario
      secondary: string;    // Accent/highlight color used in UI
      accent: string;       // Border/accent color for forms and elements
      text: string;         // Text color optimized for this theme
      highlight: string;    // Special emphasis color for headings
    };
  };
}

export type Answer = {
  questionIndex: number;
  text: string;
};

export type Submission = {
  scenarioId: string;
  answers: Answer[];
  name: string;
  score?: number;
  feedback?: string;
  analysis?: string;
  deathScene?: string;
  rationale?: string;
  survivalTimeMs?: number;
  timestamp?: string;
  // Development mode indicators
  isDevelopmentMode?: boolean;
  mockData?: boolean;
}; 