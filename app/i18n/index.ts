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