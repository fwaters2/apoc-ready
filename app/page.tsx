"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { APOCALYPSE_SCENARIOS } from "./constants/scenarios";
import type { Answer, ApocalypseScenario, Submission } from "./types";
import { Locale, locales, getTranslation, scenarioTranslations } from "./i18n";

// Add translations for high scores link
const highScoresTranslations = {
  'en': {
    viewHighScores: 'VIEW HALL OF FAME',
    evaluationComplete: 'EVALUATION COMPLETE',
  },
  'zh-TW': {
    viewHighScores: '查看名人堂',
    evaluationComplete: '評估完成',
  }
};

export default function Home() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<ApocalypseScenario | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [username, setUsername] = useState<string>("Anonymous");

  const getTranslatedQuestion = (scenario: ApocalypseScenario, index: number) => {
    const translation = scenarioTranslations[scenario.id]?.[locale];
    if (!translation || !translation.questions[index]) {
      return scenario.questions[index];
    }
    return translation.questions[index];
  };

  const handleAnswerChange = (questionIndex: number, text: string) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(a => a.questionIndex === questionIndex);
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionIndex, text };
      } else {
        newAnswers.push({ questionIndex, text });
      }
      
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (!selectedScenario) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          answers,
          name: username, // Use the entered username
          locale, // Add the current locale
        }),
      });

      if (!response.ok) {
        throw new Error(getTranslation(locale, 'errorMessage'));
      }

      const evaluation = await response.json();
      setResult(evaluation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  const handleViewHighScores = () => {
    if (result) {
      // Navigate to high scores with the user's result as URL parameters
      router.push(`/highscores?name=${encodeURIComponent(result.name)}&scenarioId=${encodeURIComponent(result.scenarioId)}&score=${encodeURIComponent(result.score || 0)}&timestamp=${encodeURIComponent(result.timestamp || '')}`);
    } else {
      // Navigate to high scores without parameters
      router.push('/highscores');
    }
  };

  // Format text with special handling for ALL CAPS and exclamation marks
  const formatText = (text: string = "") => {
    // Split by newlines first
    return text.split('\n').map((paragraph, pIndex) => {
      // Further process each paragraph for emphasis
      const processedText = paragraph
        // Add emphasis to ALL CAPS phrases
        .replace(/\b([A-Z]{2,})\b/g, '<span class="text-red-400 font-bold">$1</span>')
        // Add emphasis to exclamation marks
        .replace(/(!{1,})/g, '<span class="text-red-400 font-bold">$1</span>');
      
      return (
        <p 
          key={pIndex} 
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <select
          className="bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-700"
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
        >
          {Object.entries(locales).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 font-mono text-green-400">
        {getTranslation(locale, 'appTitle')}
      </h1>
      
      {result ? (
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-2xl font-mono text-green-400 mb-4">
              {highScoresTranslations[locale].evaluationComplete}
            </h2>
            <div className="flex items-center mb-6">
              <div className="text-6xl font-bold font-mono text-red-500 mr-4 border-r border-gray-600 pr-4">
                {result.score}%
              </div>
              <div className="text-gray-400">
                <div className="text-xl mb-1">{getTranslation(locale, 'survivalRate')}</div>
                <div className="text-sm font-mono text-red-400 italic">&ldquo;{result.rationale}&rdquo;</div>
              </div>
            </div>
            
            {result.analysis && (
              <div className="border-t border-gray-700 pt-6 mb-6">
                <h3 className="text-xl font-mono text-red-400 mb-4">
                  {getTranslation(locale, 'analysisTitle')}
                </h3>
                <div className="text-gray-300 leading-relaxed font-mono text-sm bg-gray-900/30 p-5 rounded border-l-4 border-red-900">
                  {formatText(result.analysis)}
                </div>
              </div>
            )}
            
            {result.deathScene && (
              <div className="border-t border-gray-700 pt-6 mb-6">
                <h3 className="text-xl font-mono text-red-400 mb-4">
                  {getTranslation(locale, 'deathSceneTitle')}
                </h3>
                <div className="text-gray-300 leading-relaxed font-mono text-sm italic bg-gray-900/50 p-5 rounded border-l-4 border-red-900">
                  {formatText(result.deathScene)}
                </div>
              </div>
            )}
            
            {/* Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <button
                className="py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg font-mono transition-colors"
                onClick={handleReset}
              >
                {getTranslation(locale, 'tryAgainButton')}
              </button>
              
              <button
                className="py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg font-mono transition-colors"
                onClick={handleViewHighScores}
              >
                {highScoresTranslations[locale].viewHighScores}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Scenario Selection */}
          <div className="mb-8">
            <select
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg font-mono text-green-400"
              value={selectedScenario?.id || ""}
              onChange={(e) => {
                const scenario = APOCALYPSE_SCENARIOS.find(s => s.id === e.target.value);
                setSelectedScenario(scenario || null);
                setAnswers([]);
              }}
            >
              <option value="">{getTranslation(locale, 'selectScenario')}</option>
              {APOCALYPSE_SCENARIOS.map(scenario => {
                const translatedName = scenarioTranslations[scenario.id]?.[locale]?.name || scenario.name;
                return (
                  <option key={scenario.id} value={scenario.id}>
                    {translatedName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Username Input */}
          {selectedScenario && (
            <div className="mb-6">
              <input
                type="text"
                className="w-full bg-gray-800 text-gray-100 p-3 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono"
                placeholder="Enter your username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}

          {/* Questions */}
          {selectedScenario && (
            <div className="space-y-6">
              {selectedScenario.questions.map((question, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <label className="block mb-3 font-mono text-green-400">
                    {`[${index + 1}] ${getTranslatedQuestion(selectedScenario, index)}`}
                  </label>
                  <textarea
                    className="w-full bg-gray-900 text-gray-100 p-3 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    rows={3}
                    value={answers.find(a => a.questionIndex === index)?.text || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={getTranslation(locale, 'questionPlaceholder')}
                  />
                </div>
              ))}

              <button
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg font-mono mt-8 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || answers.length !== selectedScenario.questions.length}
              >
                {loading ? getTranslation(locale, 'evaluatingButton') : getTranslation(locale, 'evaluateButton')}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-400 font-mono">
                  {error}
                </div>
              )}

              {/* Link to high scores */}
              <div className="mt-8 text-center">
                <button
                  className="text-gray-400 hover:text-green-400 font-mono transition-colors text-sm underline"
                  onClick={() => router.push('/highscores')}
                >
                  {highScoresTranslations[locale].viewHighScores}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
