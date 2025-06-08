export interface ShareableResult {
  scenarioId: string;
  scenarioName: string;
  userScore: number;
  survivalTime?: number;
}

/**
 * Generate a shareable URL for a stored result
 */
export function generateResultShareUrl(shareId: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/results/${shareId}`;
}

/**
 * Generate a shareable URL that pre-selects a scenario for others to try
 */
export function generateScenarioShareUrl(result: ShareableResult): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    scenario: result.scenarioId,
    challenge: `${result.userScore}%`, // Show what score to beat
  });
  
  if (result.survivalTime) {
    // Convert ms to human readable for URL
    const timeText = formatTimeForUrl(result.survivalTime);
    params.set('survived', timeText);
  }
  
  return `${baseUrl}/?${params.toString()}`;
}

/**
 * Generate social sharing text with the result details
 */
export function generateShareText(result: ShareableResult, locale: 'en' | 'zh-TW' = 'en'): string {
  const translations = {
    'en': {
      scored: 'scored',
      survived: 'survived',
      canYouBeat: 'Can you beat my score?',
      tryScenario: 'Try the',
      scenario: 'scenario'
    },
    'zh-TW': {
      scored: '得分',
      survived: '生存了',
      canYouBeat: '你能超過我的分數嗎？',
      tryScenario: '試試',
      scenario: '情境'
    }
  };
  
  const t = translations[locale];
  let shareText = `I ${t.scored} ${result.userScore}% in the ${result.scenarioName} apocalypse scenario!`;
  
  if (result.survivalTime) {
    const timeText = formatTimeForShare(result.survivalTime);
    shareText += ` I ${t.survived} ${timeText}.`;
  }
  
  shareText += ` ${t.canYouBeat}`;
  
  return shareText;
}

/**
 * Parse URL parameters to get shared scenario info
 */
export function parseSharedScenario(): { scenarioId?: string; challengeScore?: string; survivalTime?: string } {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    scenarioId: params.get('scenario') || undefined,
    challengeScore: params.get('challenge') || undefined,
    survivalTime: params.get('survived') || undefined,
  };
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Format time for URL (shorter format)
 */
function formatTimeForUrl(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)}h`;
  return `${Math.round(ms / 86400000)}d`;
}

/**
 * Format time for social sharing (more readable)
 */
function formatTimeForShare(ms: number): string {
  if (ms < 1000) return `${ms} milliseconds`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)} seconds`;
  if (ms < 3600000) return `${Math.round(ms / 60000)} minutes`;
  if (ms < 86400000) return `${Math.round(ms / 3600000)} hours`;
  return `${Math.round(ms / 86400000)} days`;
} 