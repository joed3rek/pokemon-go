import { Platform } from 'react-native';
import { config } from './config';
import type { FieldRecord } from './types';

export const syncEnabled = () => config.apiUrl.length > 0;

/**
 * Uploads one record as multipart/form-data to POST {apiUrl}/records:
 *   - `record`: the record as JSON (photoUri stripped — it's a path on this phone)
 *   - `photo`:  the image file, if any
 * Any 2xx counts as delivered.
 */
async function upload(record: FieldRecord): Promise<void> {
  const { photoUri, syncedAt: _unused, ...rest } = record;
  const body = new FormData();
  body.append('record', JSON.stringify({ ...rest, hasPhoto: !!photoUri }));
  if (photoUri) {
    if (Platform.OS === 'web') {
      body.append('photo', await (await fetch(photoUri)).blob(), `${record.id}.jpg`);
    } else {
      // React Native's FormData accepts a file descriptor object.
      body.append('photo', { uri: photoUri, name: `${record.id}.jpg`, type: 'image/jpeg' } as unknown as Blob);
    }
  }
  const res = await fetch(`${config.apiUrl}/records`, { method: 'POST', body });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
}

let inFlight = false;

/**
 * Tries every unsent record; returns the ids that made it. Failures just wait for the next attempt.
 * Overlapping calls return [] so a record is never uploaded twice at once.
 */
export async function pushPending(records: FieldRecord[]): Promise<string[]> {
  if (!syncEnabled() || inFlight) return [];
  inFlight = true;
  const sent: string[] = [];
  try {
    for (const r of records) {
      if (r.syncedAt) continue;
      await upload(r);
      sent.push(r.id);
    }
  } catch {
    // most likely offline — stop and retry later
  } finally {
    inFlight = false;
  }
  return sent;
}
