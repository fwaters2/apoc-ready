"use client";

import { useState, useEffect } from "react";
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
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the background image when scenario changes
  useEffect(() => {
    if (selectedScenario) {
      console.log('Loading background image:', selectedScenario.theme.image);
      const img = new Image();
      img.src = selectedScenario.theme.image;
      img.onload = () => {
        console.log('Background image loaded successfully');
        setImageLoaded(true);
      };
      img.onerror = (e) => {
        console.error('Error loading background image:', e);
        setImageLoaded(false);
      };
    } else {
      setImageLoaded(false);
    }
  }, [selectedScenario]);

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
          name: username,
          locale,
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
    setImageLoaded(false);
  };

  const handleViewHighScores = () => {
    if (result) {
      router.push(`/highscores?name=${encodeURIComponent(result.name)}&scenarioId=${encodeURIComponent(result.scenarioId)}&score=${encodeURIComponent(result.score || 0)}&timestamp=${encodeURIComponent(result.timestamp || '')}`);
    } else {
      router.push('/highscores');
    }
  };

  // Format text with special handling for ALL CAPS and exclamation marks
  const formatText = (text: string = "") => {
    return text.split('\n').map((paragraph, pIndex) => {
      const processedText = paragraph
        .replace(/\b([A-Z]{2,})\b/g, '<span class="text-red-400 font-bold">$1</span>')
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
    <div 
      className="bg-fixed min-h-screen" 
      style={{
        backgroundColor: '#111827', // bg-gray-900
        backgroundImage: selectedScenario && imageLoaded ? `url(${selectedScenario.theme.image})` : 'none',
        padding: 'var(--container-padding-mobile)',
      }}
    >
      {/* Semi-transparent overlay with fixed position */}
      <div className="overlay-fixed" style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)' }} />
      
      {/* Content container that scrolls over the fixed background */}
      <div className="content-scroll text-gray-100 desktop-container">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
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

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 md:mb-12 font-mono text-green-400">
          {getTranslation(locale, 'appTitle')}
        </h1>
        
        {result ? (
          <div className="max-w-3xl mx-auto lg:max-w-4xl">
            <div className="bg-gray-800 bg-opacity-90 p-6 md:p-8 rounded-lg border border-gray-700 mb-8">
              <h2 className="text-2xl md:text-3xl font-mono text-green-400 mb-4">
                {highScoresTranslations[locale].evaluationComplete}
              </h2>
              <div className="flex flex-col md:flex-row items-center mb-6">
                <div className="text-6xl font-bold font-mono text-red-500 mr-4 md:border-r border-gray-600 md:pr-4 mb-4 md:mb-0">
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
            <div className="max-w-3xl mx-auto lg:max-w-5xl">
              <div className="bg-gray-800 bg-opacity-90 p-6 md:p-8 rounded-lg border border-gray-700 mb-8">
                <h2 className="text-2xl md:text-3xl font-mono text-green-400 mb-6">
                  {getTranslation(locale, 'selectScenario')}
                </h2>
                
                <div className="desktop-grid">
                  {APOCALYPSE_SCENARIOS.map((scenario) => (
                    <div 
                      key={scenario.id}
                      className="border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg p-4 md:p-6 mb-4 md:mb-0 cursor-pointer transition-all hover:bg-gray-700 hover:border-gray-500"
                      onClick={() => setSelectedScenario(scenario)}
                    >
                      <h3 className="text-xl md:text-2xl font-mono text-red-400 mb-2">
                        {scenarioTranslations[scenario.id]?.[locale]?.name || scenario.name}
                      </h3>
                      <p className="text-gray-300 mb-2">
                        {scenario.name}
                      </p>
                      <div className="text-xs text-gray-400">
                        {getTranslation(locale, 'evaluateButton')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Username Input */}
            {selectedScenario && (
              <div className="max-w-3xl mx-auto lg:max-w-4xl">
                <div className="bg-gray-800 bg-opacity-90 p-6 md:p-8 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl md:text-2xl font-mono text-green-400">
                      {scenarioTranslations[selectedScenario.id]?.[locale]?.name || selectedScenario.name}
                    </h2>
                    <button
                      onClick={handleReset}
                      className="bg-gray-700 text-gray-200 px-3 py-1 md:px-4 md:py-2 rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      {getTranslation(locale, 'evaluateButton')}
                    </button>
                  </div>
                  
                  {/* Username input */}
                  <div className="mb-6">
                    <input
                      type="text"
                      className="w-full bg-gray-800 bg-opacity-90 text-gray-100 p-3 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono"
                      placeholder="Enter your username..."
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-6">
                    {selectedScenario.questions.map((question, index) => (
                      <div key={index} className="bg-gray-800 bg-opacity-90 p-6 rounded-lg border border-gray-700">
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

                    <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                      <button
                        onClick={handleSubmit}
                        disabled={loading || answers.length < selectedScenario.questions.length}
                        className={`px-6 py-3 rounded-md font-mono text-lg ${
                          loading || answers.length < selectedScenario.questions.length
                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                            : "bg-green-700 text-white hover:bg-green-600 transition-colors"
                        }`}
                      >
                        {loading ? getTranslation(locale, 'evaluatingButton') : getTranslation(locale, 'evaluateButton')}
                      </button>

                      {error && (
                        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-400 font-mono">
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
