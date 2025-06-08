import { StoredResult } from './kvStore';

// Simple in-memory stores for development
const devStore = new Map<string, StoredResult>();
const devLeaderboards = new Map<string, Array<{score: number, member: string}>>();

/**
 * Development mock of Vercel KV
 */
export const mockKv = {
  async set(key: string, value: StoredResult): Promise<void> {
    devStore.set(key, value);
    
    // Persist to localStorage
    try {
      localStorage.setItem(`dev_kv_${key}`, JSON.stringify(value));
    } catch {
      console.warn('localStorage not available');
    }
  },

  async get<T>(key: string): Promise<T | null> {
    if (devStore.has(key)) {
      return devStore.get(key) as T;
    }

    try {
      const stored = localStorage.getItem(`dev_kv_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        devStore.set(key, parsed as StoredResult);
        return parsed;
      }
    } catch {
      console.warn('Error reading from localStorage');
    }

    return null;
  },

  async zadd(key: string, scoreObj: { score: number; member: string }): Promise<void> {
    if (!devLeaderboards.has(key)) {
      devLeaderboards.set(key, []);
    }
    
    const leaderboard = devLeaderboards.get(key)!;
    const existingIndex = leaderboard.findIndex(item => item.member === scoreObj.member);
    
    if (existingIndex >= 0) {
      leaderboard.splice(existingIndex, 1);
    }
    
    leaderboard.push(scoreObj);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.splice(100); // Keep top 100
    
    try {
      localStorage.setItem(`dev_leaderboard_${key}`, JSON.stringify(leaderboard));
    } catch {
      console.warn('Could not persist leaderboard');
    }
  },

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!devLeaderboards.has(key)) {
      try {
        const stored = localStorage.getItem(`dev_leaderboard_${key}`);
        if (stored) {
          devLeaderboards.set(key, JSON.parse(stored));
        }
      } catch {
        console.warn('Error loading leaderboard');
      }
    }

    const leaderboard = devLeaderboards.get(key) || [];
    return leaderboard.slice(start, stop + 1).map(item => item.member);
  }
};

/**
 * Generate sample development data
 */
export function seedDevData(): void {
  console.log('🌱 Seeding development data...');
  
  const sampleResults: StoredResult[] = [
    {
      id: 'dev000aa',
      scenarioId: 'zombie',
      answers: [],
      name: 'TestSurvivor1',
      score: 85,
      rationale: 'Strong defensive strategy',
      analysis: 'Built excellent fortifications and managed resources well.',
      deathScene: 'Eventually overwhelmed by a massive horde.',
      survivalTimeMs: 259200000, // 3 days
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      createdAt: Date.now() - 3600000
    },
    {
      id: 'dev001aa',
      scenarioId: 'zombie',
      answers: [],
      name: 'TestSurvivor2', 
      score: 72,
      rationale: 'Good mobility, poor planning',
      analysis: 'Stayed mobile but ran out of supplies.',
      deathScene: 'Cornered while searching for food.',
      survivalTimeMs: 172800000, // 2 days
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      createdAt: Date.now() - 7200000
    }
  ];

  // Store sample results
  sampleResults.forEach((result) => {
    mockKv.set(`result:${result.id}`, result);
    
    // Add to leaderboards
    const leaderboardScore = (result.survivalTimeMs || 0) * 1000 + (result.score || 0);
    mockKv.zadd(`leaderboard:${result.scenarioId}`, {
      score: leaderboardScore,
      member: result.id
    });
    mockKv.zadd('leaderboard:global', {
      score: leaderboardScore,
      member: result.id
    });
  });

  console.log('✅ Development data seeded! Try: /results/dev000aa');
}

/**
 * Clear development data
 */
export function clearDevData(): void {
  devStore.clear();
  devLeaderboards.clear();
  
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('dev_kv_') || key.startsWith('dev_leaderboard_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('🗑️ Development data cleared');
  } catch {
    console.warn('Could not clear localStorage');
  }
} 