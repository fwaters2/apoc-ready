import { Submission } from '../types';
import { randomBytes } from 'crypto';

// Import mock for development
import { mockKv } from './mockKvStore';

// Always use mock in development, this will be switched to real KV when deployed
const kvStore = mockKv;

export interface StoredResult extends Submission {
  id: string;
  createdAt: number;
}

/**
 * Generate a short, URL-friendly ID for sharing using crypto for better randomness
 */
export function generateShareId(): string {
  // Use crypto for better randomness and collision resistance
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    // Browser environment - use Web Crypto API
    const array = new Uint8Array(6); // 6 bytes = 48 bits of entropy
    crypto.getRandomValues(array);
    
    // Convert to base36 (0-9, a-z) for URL-friendly format
    return Array.from(array)
      .map(byte => (byte % 36).toString(36))
      .join('');
  } else {
    // Node.js environment - use crypto module
    const bytes = randomBytes(6);
    
    return Array.from(bytes)
      .map((byte: number) => (byte % 36).toString(36))
      .join('');
  }
}

/**
 * Store a result and return the share ID
 */
export async function storeResult(result: Submission): Promise<string> {
  const shareId = generateShareId();
  
  const storedResult: StoredResult = {
    ...result,
    id: shareId,
    createdAt: Date.now(),
  };

  try {
    // Store the result (mock doesn't support expiration)
    await kvStore.set(`result:${shareId}`, storedResult);
    
    // Add to leaderboard (sorted by survival time desc, then score desc)
    const leaderboardScore = (result.survivalTimeMs || 0) * 1000 + (result.score || 0);
    await kvStore.zadd(`leaderboard:${result.scenarioId}`, {
      score: leaderboardScore,
      member: shareId
    });
    
    // Add to global leaderboard  
    await kvStore.zadd('leaderboard:global', {
      score: leaderboardScore,
      member: shareId
    });

    return shareId;
  } catch (error) {
    console.error('Failed to store result:', error);
    throw new Error('Failed to save result');
  }
}

/**
 * Retrieve a result by share ID
 */
export async function getResult(shareId: string): Promise<StoredResult | null> {
  try {
    const result = await kvStore.get(`result:${shareId}`) as StoredResult | null;
    return result;
  } catch (error) {
    console.error('Failed to retrieve result:', error);
    return null;
  }
}

/**
 * Get top results for a scenario (default: top 10)
 */
export async function getScenarioLeaderboard(scenarioId: string, limit: number = 10): Promise<StoredResult[]> {
  try {
    // Get top share IDs from leaderboard
    const shareIds = await kvStore.zrange(`leaderboard:${scenarioId}`, 0, limit - 1);
    
    if (!shareIds || shareIds.length === 0) {
      return [];
    }

    // Fetch all results in parallel
    const results = await Promise.all(
      shareIds.map(async (shareId: string) => {
        const result = await kvStore.get(`result:${shareId}`) as StoredResult | null;
        return result;
      })
    );

    // Filter out null results and return
    return results.filter((result): result is StoredResult => result !== null);
  } catch (error) {
    console.error('Failed to get scenario leaderboard:', error);
    return [];
  }
}

/**
 * Get global top results across all scenarios
 */
export async function getGlobalLeaderboard(limit: number = 20): Promise<StoredResult[]> {
  try {
    const shareIds = await kvStore.zrange('leaderboard:global', 0, limit - 1);
    
    if (!shareIds || shareIds.length === 0) {
      return [];
    }

    const results = await Promise.all(
      shareIds.map(async (shareId: string) => {
        const result = await kvStore.get(`result:${shareId}`) as StoredResult | null;
        return result;
      })
    );

    return results.filter((result): result is StoredResult => result !== null);
  } catch (error) {
    console.error('Failed to get global leaderboard:', error);
    return [];
  }
}

/**
 * Clean up expired results from leaderboards
 * Called periodically to maintain data consistency
 */
export async function cleanupExpiredResults(): Promise<void> {
  try {
    // This would be called by a cron job or similar
    // For now, we rely on Redis TTL to handle cleanup
    console.log('Cleanup function called - relying on TTL for now');
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
} 