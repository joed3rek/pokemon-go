import { stations, WATCH_CODE } from '../content/stations';
import type { Station } from './types';

export type ScanResult = { kind: 'station'; station: Station } | { kind: 'watch' } | { kind: 'unknown' };

/**
 * Accepts a bare code ("SP-SWALE") or any URL ending in one
 * ("https://example.org/park/s/SP-SWALE"), so the same QR sign can point
 * phones without the app to a web page.
 */
export function parseCode(raw: string): ScanResult {
  const cleaned = raw.trim().replace(/[?#].*$/, '').replace(/\/+$/, '');
  const code = (cleaned.split('/').pop() ?? '').toUpperCase();
  if (code === WATCH_CODE) return { kind: 'watch' };
  const station = stations.find((s) => s.code === code);
  return station ? { kind: 'station', station } : { kind: 'unknown' };
}
