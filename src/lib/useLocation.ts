import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { GeoFix } from './types';

/** Live position while `enabled`; null until a fix arrives or if permission is denied. */
export function useLiveLocation(enabled: boolean): { fix: GeoFix | null; denied: boolean } {
  const [fix, setFix] = useState<GeoFix | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let sub: Location.LocationSubscription | undefined;
    let cancelled = false;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (!cancelled) setDenied(true);
        return;
      }
      const s = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 2 },
        (loc) => setFix({ lat: loc.coords.latitude, lng: loc.coords.longitude, accuracy: loc.coords.accuracy }),
      );
      if (cancelled) s.remove();
      else sub = s;
    })().catch(() => setDenied(true));
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [enabled]);

  return { fix, denied };
}

/** One-off position for tagging a report. Never throws; returns undefined if unavailable. */
export async function currentFix(): Promise<GeoFix | undefined> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return undefined;
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { lat: loc.coords.latitude, lng: loc.coords.longitude, accuracy: loc.coords.accuracy };
  } catch {
    return undefined;
  }
}
