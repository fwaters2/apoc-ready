export type ApocalypseScenario = {
  id: string;
  name: string;
  theme: {
    image: string;
    colorPalette: string[];
  };
  questions: string[];
  promptTemplate: string;
};

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
  timestamp?: string;
  // Development mode indicators
  isDevelopmentMode?: boolean;
  mockData?: boolean;
}; 