import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// Extend dayjs with plugins - this will be executed once when the module is imported
dayjs.extend(duration);
dayjs.extend(relativeTime);

/**
 * Format survival time from milliseconds to human-readable format using dayjs
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "1.2s", "45m 30s", "3d 2h")
 */
export const formatSurvivalTime = (ms: number): string => {
  const dur = dayjs.duration(ms);
  
  // For very short times (less than 1 second), show milliseconds
  if (ms < 1000) {
    return `${ms}ms`;
  }
  
  // For longer durations, use dayjs humanize with custom formatting
  if (ms < 60000) { // Less than 1 minute
    const seconds = dur.seconds();
    const milliseconds = dur.milliseconds();
    return milliseconds > 0 ? `${seconds}.${Math.floor(milliseconds / 100)}s` : `${seconds}s`;
  } else if (ms < 3600000) { // Less than 1 hour
    return dur.format('m[m] s[s]').replace(' 0s', '');
  } else if (ms < 86400000) { // Less than 1 day
    return dur.format('H[h] m[m]').replace(' 0m', '');
  } else { // 1 day or more
    return dur.format('D[d] H[h]').replace(' 0h', '');
  }
};

// Export dayjs instance with plugins already configured for other time operations
export { dayjs }; 