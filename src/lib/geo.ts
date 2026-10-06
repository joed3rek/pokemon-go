import type { Coords } from './types';
import type { StringKey } from '../content/strings';

/** Great-circle distance in metres. */
export function distanceMeters(a: Coords, b: Coords): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Hot/cold hint. Thresholds are generous because phone GPS in a park is often ±10–20 m. */
export function warmth(meters: number): { key: StringKey; color: string } {
  if (meters < 15) return { key: 'hotRightHere', color: '#C8452F' };
  if (meters < 40) return { key: 'hot', color: '#E8642C' };
  if (meters < 80) return { key: 'warm', color: '#F4B400' };
  if (meters < 150) return { key: 'cool', color: '#5FA8B8' };
  return { key: 'cold', color: '#1F7A8C' };
}
