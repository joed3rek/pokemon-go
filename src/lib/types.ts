export type Lang = 'en' | 'kn';
export type Mode = 'explorer' | 'expert';

/** Localised text. Kannada is optional and falls back to English. */
export type L = { en: string; kn?: string };

/** Text that differs between the kids' (explorer) and teen/adult (expert) modes. */
export type ByMode = { explorer: L; expert: L };

export type Coords = { lat: number; lng: number };

export type ChoiceOption = {
  value: string;
  emoji: string;
  label: L;
  /** Picking this option means something is wrong — the app offers to file a report. */
  flag?: boolean;
};

export type ObservePrompt =
  | { id: string; kind: 'choice'; label: L; options: ChoiceOption[] }
  | { id: string; kind: 'number'; label: L; unit?: string };

export type Challenge =
  | { type: 'quiz'; question: L; options: L[]; answer: number; explain: L }
  | { type: 'observe'; intro: L; prompts: ObservePrompt[] }
  | { type: 'photo'; instruction: L };

export type Station = {
  id: string;
  /** Printed on the QR sign at this spot. QR may hold just the code or a URL ending in it. */
  code: string;
  emoji: string;
  name: L;
  /** Fill in on site via Organiser tools → "Capture GPS". Unset = no hot/cold hint. */
  coords?: Coords;
  clue: ByMode;
  learn: ByMode;
  safety?: L;
  challenge: Challenge;
};

export type IssueType =
  | 'standing_water'
  | 'blocked_inlet'
  | 'erosion'
  | 'broken_structure'
  | 'plants_dying'
  | 'bad_water'
  | 'other';

export type GeoFix = Coords & { accuracy: number | null };

type RecordBase = {
  /** Versioned so the Climate Solution Hub can ingest old and new records safely. */
  schema: string;
  id: string;
  site: string;
  createdAt: string;
  deviceId: string;
  mode: Mode;
  stationId?: string;
  location?: GeoFix;
  photoUri?: string;
  syncedAt?: string;
};

export type ObservationRecord = RecordBase & {
  kind: 'observation';
  schema: 'spongepark.observation/v1';
  answers: Record<string, string | number>;
};

export type ReportRecord = RecordBase & {
  kind: 'report';
  schema: 'spongepark.report/v1';
  issue: IssueType;
  note?: string;
};

export type FieldRecord = ObservationRecord | ReportRecord;

export type StationProgress = { foundAt?: string; completedAt?: string };

export type GameState = {
  onboarded: boolean;
  nickname: string;
  mode: Mode;
  lang: Lang;
  deviceId: string;
  progress: Record<string, StationProgress>;
  records: FieldRecord[];
};
