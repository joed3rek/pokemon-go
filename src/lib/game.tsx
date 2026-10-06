import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { stations } from '../content/stations';
import { strings, type StringKey } from '../content/strings';
import { config } from './config';
import { pushPending } from './sync';
import type { ByMode, FieldRecord, GameState, L, Lang, Mode } from './types';

const STORAGE_KEY = 'spongepark/state/v1';

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const freshState = (): GameState => ({
  onboarded: false,
  nickname: '',
  mode: 'explorer',
  lang: 'en',
  deviceId: newId(),
  progress: {},
  records: [],
});

type AutoFields = 'id' | 'site' | 'createdAt' | 'deviceId' | 'mode' | 'schema' | 'syncedAt';
/** What callers supply; the provider stamps the rest. Distributes over the union so `kind` narrows. */
type NewRecord = FieldRecord extends infer R ? (R extends FieldRecord ? Omit<R, AutoFields> : never) : never;

type Game = {
  state: GameState;
  t: (key: StringKey) => string;
  tl: (text: L | ByMode) => string;
  setProfile: (p: { nickname: string; mode: Mode; lang: Lang }) => void;
  setLang: (lang: Lang) => void;
  markFound: (stationId: string) => void;
  markCompleted: (stationId: string) => void;
  addRecord: (r: NewRecord) => void;
  syncNow: () => Promise<void>;
  resetProgress: () => void;
  completedCount: number;
  allComplete: boolean;
};

const GameContext = createContext<Game | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setState(raw ? { ...freshState(), ...JSON.parse(raw) } : freshState()))
      .catch(() => setState(freshState()));
  }, []);

  useEffect(() => {
    if (state) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const update = useCallback((fn: (s: GameState) => GameState) => setState((s) => (s ? fn(s) : s)), []);

  const sync = useCallback(
    (records: FieldRecord[]) =>
      pushPending(records).then((ids) => {
        if (ids.length === 0) return;
        const sent = new Set(ids);
        const at = new Date().toISOString();
        update((cur) => ({ ...cur, records: cur.records.map((r) => (sent.has(r.id) ? { ...r, syncedAt: at } : r)) }));
      }),
    [update],
  );

  // Deliver queued records whenever they change, and retry when the app returns to the foreground.
  // A failed attempt changes nothing, so this can't loop.
  const records = state?.records;
  useEffect(() => {
    if (records?.some((r) => !r.syncedAt)) void sync(records);
  }, [records, sync]);
  useEffect(() => {
    if (!records) return;
    const sub = AppState.addEventListener('change', (s) => s === 'active' && void sync(records));
    return () => sub.remove();
  }, [records, sync]);

  const value = useMemo<Game | null>(() => {
    if (!state) return null;
    const lang = state.lang;
    const pick = (l: L) => (lang === 'kn' && l.kn ? l.kn : l.en);
    const completedCount = stations.filter((s) => state.progress[s.id]?.completedAt).length;
    const now = () => new Date().toISOString();

    return {
      state,
      t: (key) => pick(strings[key]),
      tl: (text) => pick('explorer' in text ? text[state.mode] : text),
      setProfile: (p) => update((s) => ({ ...s, ...p, onboarded: true })),
      setLang: (l) => update((s) => ({ ...s, lang: l })),
      markFound: (id) =>
        update((s) =>
          s.progress[id]?.foundAt ? s : { ...s, progress: { ...s.progress, [id]: { ...s.progress[id], foundAt: now() } } },
        ),
      markCompleted: (id) =>
        update((s) => ({
          ...s,
          progress: { ...s.progress, [id]: { foundAt: now(), ...s.progress[id], completedAt: s.progress[id]?.completedAt ?? now() } },
        })),
      addRecord: (r) => {
        const base = { id: newId(), site: config.siteId, createdAt: now(), deviceId: state.deviceId, mode: state.mode };
        const record = (
          r.kind === 'report'
            ? { ...r, ...base, schema: 'spongepark.report/v1' }
            : { ...r, ...base, schema: 'spongepark.observation/v1' }
        ) as FieldRecord;
        update((s) => ({ ...s, records: [...s.records, record] }));
      },
      syncNow: () => sync(state.records),
      resetProgress: () => update((s) => ({ ...s, progress: {}, nickname: '', onboarded: false })),
      completedCount,
      allComplete: completedCount === stations.length,
    };
  }, [state, update, sync]);

  if (!value) return null; // brief: storage loads in a few ms; splash screen covers it
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): Game {
  const g = useContext(GameContext);
  if (!g) throw new Error('useGame must be used inside <GameProvider>');
  return g;
}
