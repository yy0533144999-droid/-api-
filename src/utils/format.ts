/**
 * Utility functions for forum formatting
 */

/**
 * Formats user reputation:
 * If reputation is >= 1000, displays with 'K' (e.g. 5000 -> 5K, 1500 -> 1.5K)
 */
export function formatReputation(reputation?: number | null): string {
  if (reputation === undefined || reputation === null) return '0';
  const num = Number(reputation);
  if (isNaN(num)) return '0';
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (abs >= 1000) {
    const kVal = abs / 1000;
    const formatted = kVal % 1 === 0 ? `${kVal}K` : `${kVal.toFixed(1)}K`;
    return `${sign}${formatted}`;
  }
  return `${sign}${abs}`;
}
