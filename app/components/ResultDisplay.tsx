import { Submission } from "../types";
import { Locale, getTranslation } from "../i18n";
import { formatSurvivalTime } from "../utils/timeUtils";
import { generateShareText, generateResultShareUrl, copyToClipboard, ShareableResult } from "../utils/shareUtils";
import { useState } from "react";
import { SCENARIOS } from "../constants/scenarios";

interface ResultDisplayProps {
  result: Submission;
  locale: Locale;
  onReset: () => void;
  onViewHighScores: () => void;
  showActions?: boolean;
  compact?: boolean;
  isSharedResult?: boolean; // New prop to indicate this is a shared result
}

// Translations for the component
const resultTranslations = {
  'en': {
    evaluationComplete: 'EVALUATION COMPLETE',
    timeSurvived: 'Time Survived',
    tryAgain: 'tryAgainButton',
    tryScenario: 'TRY THIS SCENARIO',
    viewHighScores: 'VIEW HALL OF FAME',
    shareChallenge: 'SHARE CHALLENGE',
    linkCopied: 'Link copied!',
    copyFailed: 'Copy failed',
  },
  'zh-TW': {
    evaluationComplete: '評估完成',
    timeSurvived: '生存時間',
    tryAgain: 'tryAgainButton',
    tryScenario: '嘗試此情境',
    viewHighScores: '查看名人堂',
    shareChallenge: '分享挑戰',
    linkCopied: '鏈接已複製！',
    copyFailed: '複製失敗',
  }
};

export default function ResultDisplay({ 
  result, 
  locale, 
  onReset, 
  onViewHighScores, 
  showActions = true,
  compact = false,
  isSharedResult = false
}: ResultDisplayProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleShare = async () => {
    try {
      // First, store the result to get a share ID
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error('Failed to store result');
      }

      const { shareId } = await response.json();
      
      // Generate the persistent share URL
      const shareUrl = generateResultShareUrl(shareId);
      
      // Find the scenario name for the share text
      const scenario = SCENARIOS.find(s => s.id === result.scenarioId);
      const scenarioName = scenario?.name[locale] || scenario?.name.en || 'Unknown Scenario';
      
      const shareableResult: ShareableResult = {
        scenarioId: result.scenarioId,
        scenarioName,
        userScore: result.score || 0,
        survivalTime: result.survivalTimeMs,
      };

      const shareText = generateShareText(shareableResult, locale);
      const fullShareText = `${shareText}\n\n${shareUrl}`;

      const success = await copyToClipboard(fullShareText);
      setShareStatus(success ? 'copied' : 'failed');
    } catch (error) {
      console.error('Share failed:', error);
      setShareStatus('failed');
    }
    
    // Reset status after 2 seconds
    setTimeout(() => setShareStatus('idle'), 2000);
  };
  
  // Format text with special handling for ALL CAPS and exclamation marks
  const formatText = (text: string = "") => {
    return text.split('\n').map((paragraph, pIndex) => {
      const processedText = paragraph
        .replace(/\b([A-Z]{2,})\b/g, `<span style="color: var(--theme-secondary); font-weight: bold;">$1</span>`)
        .replace(/(!{1,})/g, `<span style="color: var(--theme-secondary); font-weight: bold;">$1</span>`);
      
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
    <div className={`${compact ? 'max-w-2xl' : 'max-w-3xl'} mx-auto ${compact ? 'lg:max-w-3xl' : 'lg:max-w-4xl'}`}>
      <div className="bg-gray-800 bg-opacity-90 p-6 md:p-8 rounded-lg border border-gray-700 mb-8">
        <h2 className={`${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} font-mono mb-4`} style={{ color: 'var(--theme-highlight)' }}>
          {resultTranslations[locale].evaluationComplete}
        </h2>
        
        <div className="flex flex-col md:flex-row items-center mb-6">
          <div className={`${compact ? 'text-4xl md:text-5xl' : 'text-6xl'} font-bold font-mono mr-4 md:border-r border-gray-600 md:pr-4 mb-4 md:mb-0`} style={{ color: 'var(--theme-primary)' }}>
            {result.score}%
          </div>
          <div className="text-gray-400 flex-1">
            <div className={`${compact ? 'text-lg' : 'text-xl'} mb-1`}>{getTranslation(locale, 'survivalRate')}</div>
            <div className="text-sm font-mono italic" style={{ color: 'var(--theme-secondary)' }}>
              &ldquo;{result.rationale}&rdquo;
            </div>
          </div>
          {result.survivalTimeMs && (
            <div className="md:border-l border-gray-600 md:pl-4 mt-4 md:mt-0">
              <div className="text-center">
                <div className={`${compact ? 'text-2xl' : 'text-3xl'} font-bold font-mono`} style={{ color: 'var(--theme-accent)' }}>
                  {formatSurvivalTime(result.survivalTimeMs)}
                </div>
                <div className="text-sm text-gray-400">{resultTranslations[locale].timeSurvived}</div>
              </div>
            </div>
          )}
        </div>
        
        {result.analysis && !compact && (
          <div className="border-t border-gray-700 pt-6 mb-6">
            <h3 className="text-xl font-mono mb-4" style={{ color: 'var(--theme-secondary)' }}>
              {getTranslation(locale, 'analysisTitle')}
            </h3>
            <div className="text-gray-300 leading-relaxed font-mono text-sm bg-gray-900/30 p-5 rounded border-l-4" style={{ borderLeftColor: 'var(--theme-accent)' }}>
              {formatText(result.analysis)}
            </div>
          </div>
        )}
        
        {result.deathScene && !compact && (
          <div className="border-t border-gray-700 pt-6 mb-6">
            <h3 className="text-xl font-mono mb-4" style={{ color: 'var(--theme-secondary)' }}>
              {getTranslation(locale, 'deathSceneTitle')}
            </h3>
            <div className="text-gray-300 leading-relaxed font-mono text-sm italic bg-gray-900/50 p-5 rounded border-l-4" style={{ borderLeftColor: 'var(--theme-accent)' }}>
              {formatText(result.deathScene)}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        {showActions && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <button
              className="py-4 text-white font-bold rounded-lg font-mono transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: 'var(--theme-accent)'
              }}
              onClick={onReset}
            >
              {isSharedResult 
                ? resultTranslations[locale].tryScenario 
                : getTranslation(locale, 'tryAgainButton')
              }
            </button>
            
            <button
              className="py-4 text-white font-bold rounded-lg font-mono transition-colors hover:opacity-90 relative"
              style={{ 
                backgroundColor: shareStatus === 'copied' ? '#10B981' : shareStatus === 'failed' ? '#EF4444' : 'var(--theme-primary)'
              }}
              onClick={handleShare}
              disabled={shareStatus !== 'idle'}
            >
              {shareStatus === 'copied' ? resultTranslations[locale].linkCopied : 
               shareStatus === 'failed' ? resultTranslations[locale].copyFailed : 
               resultTranslations[locale].shareChallenge}
            </button>
            
            <button
              className="py-4 text-white font-bold rounded-lg font-mono transition-colors hover:opacity-90"
              style={{ 
                backgroundColor: 'var(--theme-secondary)'
              }}
              onClick={onViewHighScores}
            >
              {resultTranslations[locale].viewHighScores}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 