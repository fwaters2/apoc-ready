"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SCENARIOS } from "./constants/scenarios";
import type { Answer, ConsolidatedScenario, Submission } from "./types";
import { Locale, getTranslation } from "./i18n";
import Header from "./components/Header";
import { getLoadingMessage } from "./utils/messages";
import { injectScenarioStyles } from "./utils/styles";
import ResultDisplay from "./components/ResultDisplay";
import { parseSharedScenario } from "./utils/shareUtils";
import { seedDevData } from "./utils/mockKvStore";

export default function Home() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<ConsolidatedScenario | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [username, setUsername] = useState<string>("Anonymous");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [challengeInfo, setChallengeInfo] = useState<{ score: string; survivalTime?: string } | null>(null);

  // Load locale from localStorage and inject scenario styles on component mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('apoc-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh-TW')) {
      setLocale(savedLocale as Locale);
    }
    
    // Inject dynamic scenario styles
    injectScenarioStyles();
    
    // Seed development data if in development mode
    if (process.env.NODE_ENV === 'development') {
      seedDevData();
    }
    
    // Check for shared scenario in URL
    const sharedScenario = parseSharedScenario();
    if (sharedScenario.scenarioId) {
      const scenario = SCENARIOS.find(s => s.id === sharedScenario.scenarioId);
      if (scenario) {
        setSelectedScenario(scenario);
        // Store challenge info if available
        if (sharedScenario.challengeScore || sharedScenario.survivalTime) {
          setChallengeInfo({
            score: sharedScenario.challengeScore || '',
            survivalTime: sharedScenario.survivalTime
          });
        }
      }
    }
  }, []);

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('apoc-locale', locale);
  }, [locale]);

  // Preload the background image when scenario changes
  useEffect(() => {
    if (selectedScenario) {
      console.log('Loading background image:', selectedScenario.theme.backgroundImage);
      const img = new Image();
      img.src = selectedScenario.theme.backgroundImage;
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

  const getTranslatedQuestion = (scenario: ConsolidatedScenario, index: number) => {
    return scenario.questions[index][locale] || scenario.questions[index].en;
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
    
    // Set initial loading message
    setLoadingMessage(getLoadingMessage(locale));
    
    // Change loading message every 3 seconds
    const loadingInterval = setInterval(() => {
      setLoadingMessage(getLoadingMessage(locale));
    }, 3000);
    
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
      
      // Store the result for sharing in development/production
      try {
        await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(evaluation),
        });
      } catch (error) {
        console.warn('Failed to store result for sharing:', error);
        // Don't fail the main flow if storage fails
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      clearInterval(loadingInterval);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setAnswers([]);
    setResult(null);
    setError(null);
    setImageLoaded(false);
    setChallengeInfo(null); // Clear any challenge mode info
    
    // Clear URL parameters
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleViewHighScores = () => {
    if (result) {
      // Just pass the essential parameters - the high scores page can handle the rest
      router.push(`/highscores?scenarioId=${encodeURIComponent(result.scenarioId)}&name=${encodeURIComponent(result.name)}`);
    } else {
      router.push('/highscores');
    }
  };






  return (
    <div 
      className={`bg-fixed min-h-screen ${selectedScenario ? `theme-${selectedScenario.id}` : ''}`} 
      style={{
        backgroundColor: '#111827', // bg-gray-900
        backgroundImage: selectedScenario && imageLoaded ? `url(${selectedScenario.theme.backgroundImage})` : 'none',
      }}
    >
      {/* Semi-transparent overlay with fixed position */}
      <div className="overlay-fixed" style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)' }} />
      
      {/* Header with language selector and highscores link */}
      <Header locale={locale} setLocale={setLocale} />

      {/* Main content area with proper header spacing */}
      <main 
        className="relative px-4 md:px-8 pb-8 min-h-screen" 
        style={{ paddingTop: "calc(var(--header-height) + 1rem)", zIndex: 1 }}
      >
        <div className="content-scroll text-gray-100 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 md:mb-12 font-mono" style={{ color: 'var(--theme-highlight)' }}>
            {getTranslation(locale, 'appTitle')}
          </h1>
          
          {result ? (
            <ResultDisplay
              key="results"
              result={result}
              locale={locale}
              onReset={handleReset}
              onViewHighScores={handleViewHighScores}
              isSharedResult={false}
            />
          ) : (
            <div key="quiz">
              {/* Scenario Selection */}
              <div className="max-w-3xl mx-auto lg:max-w-5xl">
                <div className="bg-gray-800 bg-opacity-90 p-6 md:p-8 rounded-lg border border-gray-700 mb-8">
                  <h2 className="text-2xl md:text-3xl font-mono mb-6" style={{ color: 'var(--theme-highlight)' }}>
                    {getTranslation(locale, 'selectScenario')}
                  </h2>
                  
                  <div className="desktop-grid">
                    {SCENARIOS.map((scenario) => (
                      <div 
                        key={scenario.id}
                        className="border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg p-4 md:p-6 mb-4 md:mb-0 cursor-pointer transition-all hover:bg-gray-700 hover:border-gray-500"
                        onClick={() => setSelectedScenario(scenario)}
                      >
                        <h3 className="text-xl md:text-2xl font-mono mb-2" style={{ 
                          color: `var(--${scenario.id}-secondary, var(--theme-secondary))` 
                        }}>
                          {scenario.name[locale] || scenario.name.en}
                        </h3>
                        <p className="text-gray-300 mb-2">
                          {scenario.name.en}
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
                      <h2 className="text-xl md:text-2xl font-mono" style={{ color: 'var(--theme-highlight)' }}>
                        {selectedScenario.name[locale] || selectedScenario.name.en}
                      </h2>
                    </div>
                    
                    {/* Challenge Banner */}
                    {challengeInfo && (
                      <div className="mb-6 p-4 bg-opacity-70 border rounded-lg" style={{ 
                        backgroundColor: 'var(--theme-primary)', 
                        borderColor: 'var(--theme-accent)',
                        color: 'var(--theme-text)'
                      }}>
                        <div className="text-center font-mono">
                          <div className="text-sm opacity-75 mb-1">
                            {locale === 'en' ? '🎯 CHALLENGE MODE' : '🎯 挑戰模式'}
                          </div>
                          <div className="text-lg">
                            {locale === 'en' ? 'Can you beat' : '你能超過'} <strong>{challengeInfo.score}</strong>
                            {challengeInfo.survivalTime && (
                              <span> {locale === 'en' ? 'and survive longer than' : '並生存超過'} <strong>{challengeInfo.survivalTime}</strong></span>
                            )}?
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Username input */}
                    <div className="mb-6">
                      <input
                        type="text"
                        className="w-full bg-gray-800 bg-opacity-90 text-gray-100 p-3 rounded-lg border border-gray-700 font-mono focus:outline-none"
                        style={{ 
                          borderColor: 'var(--theme-accent)',
                        }}
                        placeholder="Enter your username..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-6">
                      {selectedScenario.questions.map((question, index) => (
                        <div key={index} className="bg-gray-800 bg-opacity-90 p-6 rounded-lg border border-gray-700">
                          <label className="block mb-3 font-mono" style={{ color: 'var(--theme-secondary)' }}>
                            {`[${index + 1}] ${getTranslatedQuestion(selectedScenario, index)}`}
                          </label>
                          <textarea
                            className="w-full bg-gray-900 text-gray-100 p-3 rounded-lg border focus:outline-none"
                            style={{ borderColor: 'var(--theme-accent)' }}
                            rows={3}
                            value={answers.find(a => a.questionIndex === index)?.text || ""}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder={getTranslation(locale, 'questionPlaceholder')}
                          />
                        </div>
                      ))}

                      <div className="flex flex-col gap-4 justify-center mt-8">
                        <button
                          onClick={handleSubmit}
                          disabled={loading || answers.length < selectedScenario.questions.length}
                          className={`px-6 py-3 rounded-md font-mono text-lg transition-colors ${
                            loading || answers.length < selectedScenario.questions.length
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-white hover:opacity-90"
                          }`}
                          style={{ 
                            backgroundColor: loading || answers.length < selectedScenario.questions.length 
                              ? "#4B5563" // gray-600
                              : "var(--theme-secondary)"
                          }}
                        >
                          {loading ? getTranslation(locale, 'evaluatingButton') : getTranslation(locale, 'evaluateButton')}
                        </button>

                        {loading && (
                          <div className="p-4 bg-opacity-50 bg-gray-900 border rounded-lg font-mono animate-pulse text-center"
                            style={{ 
                              borderColor: 'var(--theme-accent)',
                              color: 'var(--theme-highlight)'
                            }}
                          >
                            {loadingMessage}
                          </div>
                        )}

                        {error && (
                          <div 
                            className="p-4 bg-opacity-50 border rounded-lg font-mono"
                            style={{ 
                              backgroundColor: 'var(--theme-primary)', 
                              borderColor: 'var(--theme-accent)',
                              color: 'var(--theme-text)'
                            }}
                          >
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
