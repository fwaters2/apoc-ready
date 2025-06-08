"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoredResult } from '../../utils/kvStore';
import { Locale, getTranslation } from '../../i18n';
import { SCENARIOS } from '../../constants/scenarios';
import { injectScenarioStyles } from '../../utils/styles';
import Header from '../../components/Header';
import ResultDisplay from '../../components/ResultDisplay';

interface ResultPageProps {
  params: Promise<{ shareId: string }>;
}

export default function ResultPage({ params }: ResultPageProps) {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('en');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shareId, setShareId] = useState<string>('');

  // Load locale from localStorage and resolve params
  useEffect(() => {
    const savedLocale = localStorage.getItem('apoc-locale');
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh-TW')) {
      setLocale(savedLocale as Locale);
    }
    
    // Inject dynamic scenario styles
    injectScenarioStyles();
    
    // Resolve the async params
    params.then(({ shareId: id }) => {
      setShareId(id);
    });
  }, [params]);

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('apoc-locale', locale);
  }, [locale]);

  // Fetch the shared result
  useEffect(() => {
    if (!shareId) return;
    
    async function fetchResult() {
      try {
        const response = await fetch(`/api/results/${shareId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('This result has expired or does not exist');
          } else {
            setError('Failed to load result');
          }
          return;
        }

        const data: StoredResult = await response.json();
        setResult(data);
      } catch (err) {
        setError('Failed to load result');
        console.error('Error fetching result:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [shareId]);

  // Find the scenario for styling
  const selectedScenario = result ? SCENARIOS.find(s => s.id === result.scenarioId) : null;

  // Preload the background image when scenario is loaded
  useEffect(() => {
    if (selectedScenario) {
      const img = new Image();
      img.src = selectedScenario.theme.backgroundImage;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(false);
    }
  }, [selectedScenario]);

  const handleReset = () => {
    router.push('/');
  };

  const handleViewHighScores = () => {
    if (result) {
      router.push(`/highscores?scenarioId=${encodeURIComponent(result.scenarioId)}`);
    } else {
      router.push('/highscores');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Header locale={locale} setLocale={setLocale} />
        <main className="relative px-4 md:px-8 pb-8 min-h-screen" style={{ paddingTop: "calc(var(--header-height) + 1rem)", zIndex: 1 }}>
          <div className="content-scroll text-gray-100 max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                <p className="text-gray-400 font-mono">Loading shared result...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="bg-gray-900 min-h-screen">
        <Header locale={locale} setLocale={setLocale} />
        <main className="relative px-4 md:px-8 pb-8 min-h-screen" style={{ paddingTop: "calc(var(--header-height) + 1rem)", zIndex: 1 }}>
          <div className="content-scroll text-gray-100 max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-red-400">⚠️ Oops!</h1>
                <p className="text-gray-400 font-mono mb-6">{error || 'Result not found'}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-mono hover:bg-blue-700 transition-colors"
                >
                  {locale === 'en' ? 'Back to Home' : '返回首頁'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div 
      className={`bg-fixed min-h-screen ${selectedScenario ? `theme-${selectedScenario.id}` : ''}`} 
      style={{
        backgroundColor: '#111827',
        backgroundImage: selectedScenario && imageLoaded ? `url(${selectedScenario.theme.backgroundImage})` : 'none',
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="overlay-fixed" style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)' }} />
      
      <Header locale={locale} setLocale={setLocale} />

      <main 
        className="relative px-4 md:px-8 pb-8 min-h-screen" 
        style={{ paddingTop: "calc(var(--header-height) + 1rem)", zIndex: 1 }}
      >
        <div className="content-scroll text-gray-100 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 md:mb-12 font-mono" style={{ color: 'var(--theme-highlight)' }}>
            {getTranslation(locale, 'appTitle')}
          </h1>
          
          {/* Shared Result Banner */}
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-4 text-center">
              <div className="text-blue-300 font-mono">
                <span className="text-2xl mr-2">🔗</span>
                {locale === 'en' ? 'Shared Result' : '分享結果'}
                <span className="text-2xl ml-2">🔗</span>
              </div>
              <div className="text-sm text-blue-200 mt-1">
                {locale === 'en' 
                  ? `Someone challenged you to beat their score!` 
                  : '有人挑戰你超越他們的分數！'
                }
              </div>
            </div>
          </div>

          <ResultDisplay
            result={result}
            locale={locale}
            onReset={handleReset}
            onViewHighScores={handleViewHighScores}
          />
        </div>
      </main>
    </div>
  );
} 