"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Locale } from "../i18n";
import { SCENARIOS } from "../constants/scenarios";
import { getMockHighScores, scoreComments, getRandomHighScorePosition, HighScore } from "../data/mockHighScores";
import Header from "../components/Header";
import { formatSurvivalTime } from "../utils/timeUtils";

// Add translations for high scores page
const translations = {
  'en': {
    title: 'APOCALYPSE SURVIVORS HALL OF FAME',
    subtitle: '(Well, "Survivors" is a Strong Word...)',
    rank: 'Rank',
    name: 'Username',
    scenario: 'Scenario',
    score: 'Score',
    survivalTime: 'Time Survived',
    backToAssessment: 'BACK TO ASSESSMENT',
    yourScore: 'YOUR SCORE',
    filterAll: 'All Scenarios',
    sorryNoSurvivors: 'Sorry, no survivors found!',
    loading: 'Loading...',
  },
  'zh-TW': {
    title: '末日倖存者名人堂',
    subtitle: '（好吧，「倖存者」是個很勉強的詞...）',
    rank: '排名',
    name: '用戶名',
    scenario: '情境',
    score: '分數',
    survivalTime: '生存時間',
    backToAssessment: '返回評估',
    yourScore: '你的分數',
    filterAll: '所有情境',
    sorryNoSurvivors: '抱歉，找不到倖存者！',
    loading: '載入中...',
  }
};

// Create a component that uses useSearchParams
function HighScoreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>('en');
  
  // Load locale from localStorage on component mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('apoc-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh-TW')) {
      setLocale(savedLocale as Locale);
    }
  }, []);

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('apoc-locale', locale);
  }, [locale]);
  
  // Read user's submission from URL parameters if available
  const userName = searchParams.get('name') || '';
  const scenarioId = searchParams.get('scenarioId') || '';
  const userScore = parseInt(searchParams.get('score') || '0', 10);
  const userSurvivalTimeMs = parseInt(searchParams.get('survivalTimeMs') || '0', 10);
  const timestamp = searchParams.get('timestamp') || new Date().toISOString();
  
  // State for high scores
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [filteredScores, setFilteredScores] = useState<HighScore[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  // Create user's entry if we have parameters
  const hasUserEntry = !!userName && !!scenarioId && !!userScore;
  

  
  // Initialize high scores with user's score inserted
  useEffect(() => {
    const scores = getMockHighScores();
    
    if (hasUserEntry) {
      // Find position to insert the user's score
      const position = getRandomHighScorePosition();
      
      // Create user entry
      const userEntry: HighScore = {
        id: 'user',
        name: userName,
        scenarioId,
        score: userScore,
        timestamp,
        survivalTimeMs: userSurvivalTimeMs || Math.floor(Math.random() * (86400000 - 1000) + 1000) // Use provided survival time or random fallback
      };
      
      // Insert user at the selected position
      scores.splice(position, 0, userEntry);
    }
    
    // Sort scores by survival time (descending), then by score (descending), then by timestamp (most recent first)
    const sortedScores = scores.sort((a, b) => {
      if (b.survivalTimeMs !== a.survivalTimeMs) return b.survivalTimeMs - a.survivalTimeMs;
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    setHighScores(sortedScores);
    setFilteredScores(sortedScores);
  }, [hasUserEntry, userName, scenarioId, userScore, userSurvivalTimeMs, timestamp]);
  
  // Filter scores when filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredScores(highScores);
    } else {
      setFilteredScores(highScores.filter(score => score.scenarioId === filter));
    }
  }, [filter, highScores]);
  
  // Get scenario name
  const getScenarioName = (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return scenarioId;
    return scenario.name[locale];
  };
  
  // Get score comment
  const getScoreComment = (name: string) => {
    return scoreComments[locale][name] || '';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header with language selector and highscores link */}
      <Header locale={locale} setLocale={setLocale} />

      {/* Main content area with proper header spacing */}
      <main 
        className="relative px-4 md:px-8 pb-8 min-h-screen"
        style={{ paddingTop: "calc(var(--header-height) + 1rem)", zIndex: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 font-mono text-green-400">
            {translations[locale].title}
          </h1>
          <p className="text-gray-400 text-center mb-8 font-mono">
            {translations[locale].subtitle}
          </p>
          
          {/* Filter by scenario */}
          <div className="mb-8 flex justify-center">
            <select
              className="bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-700 w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">{translations[locale].filterAll}</option>
              {SCENARIOS.map(scenario => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name[locale]}
                </option>
              ))}
            </select>
          </div>
          
          {/* High Scores Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full text-gray-300">
              <thead className="bg-gray-900 font-mono text-green-400">
                <tr>
                  <th className="px-4 py-3 text-left">{translations[locale].rank}</th>
                  <th className="px-4 py-3 text-left">{translations[locale].name}</th>
                  <th className="px-4 py-3 text-left">{translations[locale].scenario}</th>
                  <th className="px-4 py-3 text-left">{translations[locale].score}</th>
                  <th className="px-4 py-3 text-left">{translations[locale].survivalTime}</th>
                </tr>
              </thead>
              <tbody>
                {filteredScores.length > 0 ? (
                  filteredScores.map((score, index) => {
                    const isUserScore = score.id === 'user';
                    return (
                      <tr 
                        key={score.id} 
                        className={`${isUserScore ? 'bg-green-900/20' : 'hover:bg-gray-700/30'} border-t border-gray-700`}
                      >
                        <td className="px-4 py-3 font-mono">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-bold">{score.name}</div>
                          <div className="text-sm text-gray-400">
                            {isUserScore ? translations[locale].yourScore : getScoreComment(score.name)}
                          </div>
                        </td>
                        <td className="px-4 py-3">{getScenarioName(score.scenarioId)}</td>
                        <td className="px-4 py-3 font-mono font-bold text-red-500">{score.score}%</td>
                        <td className="px-4 py-3">{formatSurvivalTime(score.survivalTimeMs)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                      {translations[locale].sorryNoSurvivors}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg font-mono transition-colors"
              onClick={() => router.push('/')}
            >
              {translations[locale].backToAssessment}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Main component with Suspense boundary
export default function HighScores() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center font-mono text-xl">Loading...</div>}>
      <HighScoreContent />
    </Suspense>
  );
} 