# Sponge Park Hunt

A treasure-hunt app for **Nallurhalli Sponge Park** (WELL Labs × MBRDI). Kids and adults walk the park, find QR signs at each intervention, learn what it does, complete a small challenge, and earn a badge. Collect all eight and you become a **Sponge Park Steward**.

The challenges are also the park's citizen-science monitoring: inlet checks, water-level readings, plant health, rain-gauge readings, photo-points and biodiversity counts are saved as structured records. Anyone can file a **Sponge Park Watch** problem report. All of this data is designed to feed the Climate Solution Hub (Workstream C).

Built with Expo (React Native + TypeScript) for Android, iOS and web.

## Run it

```bash
npm install
npm start          # scan the QR in the terminal with the Expo Go app (Android/iOS)
npm run web        # or try it in a browser
npm run typecheck && npx expo lint
```

Everything works **offline**. Progress and records live on the phone, and records upload automatically whenever a backend is configured and the phone is online.

## How the hunt works

| Step | What happens |
|---|---|
| Welcome | Pick English/ಕನ್ನಡ, **Explorer** (kids) or **Expert** (teens/adults) and a nickname, then tick the 4-point safety promise. |
| Hunt | Shows the clue for the next station. Once that station has GPS coordinates, it also gives a 🔥 hot / ❄️ cold hint. Unfound stations show as `???`. |
| Unlock | Scan the station's QR sign, or type the code printed on it (fallback for broken cameras / web). |
| Station | Short lesson (different text for kids and adults), safety note, then a challenge: **quiz**, **observe** (monitoring form) or **photo** (photo-point). |
| Badge | When the challenge is done. If an observation looks like a problem (e.g. "inlet blocked"), the app offers to file a report. |
| Certificate | Shown after all 8 badges; can be shared. |
| Sponge Park Watch | Pick-a-picture problem report with location, optional photo and note. There is an optional WhatsApp backup. |

Stations: Welcome Board, Bioswale, Water Inlet, Recharge Well, Native Garden, Rain Gauge, Photo Point, Nature Spot.

## Setting it up for the park

1. **Edit the content** in [src/content/stations.ts](src/content/stations.ts). This one file holds the order, clues, lessons and challenges. UI text is in [src/content/strings.ts](src/content/strings.ts).
2. **Print QR signs.** Each sign's QR holds the station code (e.g. `SP-SWALE`), *or* a URL ending in it (e.g. `https://your-site.org/park/s/SP-SWALE`), so phones without the app land on your website. `SP-WATCH` opens the report form; use it for the park signboard and field cards. Print the code in large text under the QR too, for typing. The full list is in the app under **Organiser tools**.
3. **Capture GPS.** Go to **Organiser tools → Capture station GPS**, walk to each station and tap its name. Then share the result and paste the coordinates into `stations.ts`. Until then the hot/cold hint stays hidden.
4. **Configure** (optional): copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_WHATSAPP_NUMBER`.
5. **Shared phones:** **Organiser tools → Reset hunt progress** clears progress and the nickname for the next child. Their observations are kept.

## Data for the Climate Solution Hub

Each record is uploaded as `multipart/form-data` to `POST {EXPO_PUBLIC_API_URL}/records`, with a `record` field (JSON) and an optional `photo` file. Any 2xx response marks it as delivered. Without a server, use **Organiser tools → Export all records (JSON)**.

```jsonc
// spongepark.observation/v1
{ "kind": "observation", "schema": "spongepark.observation/v1",
  "id": "muwmsttg-v5ise4qh", "site": "nallurhalli", "deviceId": "…", "mode": "explorer",
  "createdAt": "2026-10-06T12:04:54.388Z", "stationId": "inlet",
  "answers": { "inlet_state": "blocked" }, "hasPhoto": false }

// spongepark.report/v1
{ "kind": "report", "schema": "spongepark.report/v1",
  "id": "…", "site": "nallurhalli", "deviceId": "…", "mode": "explorer",
  "createdAt": "…", "stationId": "inlet",            // omitted if "somewhere else"
  "issue": "erosion",                                 // standing_water | blocked_inlet | erosion | broken_structure | plants_dying | bad_water | other
  "note": "Big gully next to the inlet",
  "location": { "lat": 12.97, "lng": 77.7, "accuracy": 14 },   // if permission given
  "hasPhoto": true }
```

Answer keys per station are the `prompts[].id` values in `stations.ts`, e.g. `water_level`, `water_look`, `plant_health`, `rained_recently`, `rain_mm`, `butterflies`, `birds`, `photo_point`. Records hold no personal data: just a random device id, and no names. `id` is unique per record, so the server can safely deduplicate retries.

## Before launch

- **Kannada:** UI strings, station names and report labels have Kannada drafts, which need review by a native speaker. Station lessons and clues are English-only for now and fall back automatically. Add `kn:` next to any `en:` to translate.
- **Station coordinates** (step 3 above) and **QR signs** (step 2).
- **Backend** for `/records`, or a decision to collect data by JSON export only.
- **App store builds:** `npx eas-cli@latest build` (see [Expo EAS docs](https://docs.expo.dev/eas/)).

## Code map

```
src/app/            screens (Expo Router: each file is a route)
  welcome · index (home) · hunt · scan · station/[id] · report · certificate · tools
src/content/        stations, report issue types, UI strings  ← edit these
src/components/     shared UI + the quiz/observe/photo challenge renderer
src/lib/            game state (persisted), sync outbox, QR parsing, GPS
```
