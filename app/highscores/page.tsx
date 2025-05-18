"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Locale, locales } from "../i18n";
import { APOCALYPSE_SCENARIOS } from "../constants/scenarios";
import { getMockHighScores, scoreComments, getRandomHighScorePosition, HighScore } from "../data/mockHighScores";

// Add translations for high scores page
const translations = {
  'en': {
    title: 'APOCALYPSE SURVIVORS HALL OF FAME',
    subtitle: '(Well, "Survivors" is a Strong Word...)',
    rank: 'Rank',
    name: 'Username',
    scenario: 'Scenario',
    score: 'Score',
    backToAssessment: 'BACK TO ASSESSMENT',
    yourScore: 'YOUR SCORE',
    filterAll: 'All Scenarios',
    sorryNoSurvivors: 'Sorry, no survivors found!',
  },
  'zh-TW': {
    title: '末日倖存者名人堂',
    subtitle: '（好吧，「倖存者」是個很勉強的詞...）',
    rank: '排名',
    name: '用戶名',
    scenario: '情境',
    score: '分數',
    backToAssessment: '返回評估',
    yourScore: '你的分數',
    filterAll: '所有情境',
    sorryNoSurvivors: '抱歉，找不到倖存者！',
  }
};

export default function HighScores() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState<Locale>('en');
  
  // Read user's submission from URL parameters if available
  const userName = searchParams.get('name') || '';
  const scenarioId = searchParams.get('scenarioId') || '';
  const userScore = parseInt(searchParams.get('score') || '0', 10);
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
      const position = getRandomHighScorePosition(userScore);
      
      // Create user entry
      const userEntry: HighScore = {
        id: 'user',
        name: userName,
        scenarioId,
        score: userScore,
        timestamp,
      };
      
      // Insert user at the selected position
      scores.splice(position, 0, userEntry);
    }
    
    // Sort scores by score (descending) and then by timestamp (most recent first)
    const sortedScores = scores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    setHighScores(sortedScores);
    setFilteredScores(sortedScores);
  }, [hasUserEntry, userName, scenarioId, userScore, timestamp]);
  
  // Filter scores when filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredScores(highScores);
    } else {
      setFilteredScores(highScores.filter(score => score.scenarioId === filter));
    }
  }, [filter, highScores]);
  
  // Handle language change
  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };
  
  // Get scenario name
  const getScenarioName = (scenarioId: string) => {
    const scenario = APOCALYPSE_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return scenarioId;
    return scenario.name;
  };
  
  // Get score comment
  const getScoreComment = (name: string) => {
    return scoreComments[locale][name] || '';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <select
          className="bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-700"
          value={locale}
          onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        >
          {Object.entries(locales).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

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
            {APOCALYPSE_SCENARIOS.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {getScenarioName(scenario.id)}
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
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
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
    </div>
  );
} 