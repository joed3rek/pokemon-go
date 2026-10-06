import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Button, Card, H2, P, Screen } from '../components/ui';
import { stations, WATCH_CODE } from '../content/stations';
import { config } from '../lib/config';
import { useGame } from '../lib/game';
import { syncEnabled } from '../lib/sync';
import type { GeoFix } from '../lib/types';
import { useLiveLocation } from '../lib/useLocation';
import { colors } from '../theme';

const CAPTURE_KEY = 'spongepark/captured-coords/v1';

/** For WELL Labs staff / volunteers. Plain English on purpose — not shown to kids by default. */
export default function Tools() {
  const { state, syncNow, resetProgress } = useGame();
  const [gpsOn, setGpsOn] = useState(false);
  const { fix, denied } = useLiveLocation(gpsOn);
  const [captured, setCaptured] = useState<Record<string, GeoFix>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  // Persist captures so a field walk survives leaving this screen.
  useEffect(() => {
    AsyncStorage.getItem(CAPTURE_KEY).then((raw) => raw && setCaptured(JSON.parse(raw))).catch(() => {});
  }, []);
  const capture = (id: string) => {
    if (!fix) return;
    const next = { ...captured, [id]: fix };
    setCaptured(next);
    AsyncStorage.setItem(CAPTURE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const pending = state.records.filter((r) => !r.syncedAt).length;
  const reports = state.records.filter((r) => r.kind === 'report').length;

  return (
    <Screen>
      <Card>
        <H2>📍 Capture station GPS</H2>
        <P muted>
          Walk to each station, wait for accuracy under ~10 m, then tap its name. Share the result and paste each line into
          src/content/stations.ts as that station’s coords. Until then the hunt simply hides the hot/cold hint.
        </P>
        {!gpsOn ? (
          <Button title="Start GPS" icon="🛰️" onPress={() => setGpsOn(true)} />
        ) : denied ? (
          <P>Location permission denied.</P>
        ) : fix ? (
          <Text style={styles.mono}>
            {fix.lat.toFixed(6)}, {fix.lng.toFixed(6)} · ±{fix.accuracy ? Math.round(fix.accuracy) : '?'} m
          </Text>
        ) : (
          <P>Waiting for GPS fix…</P>
        )}
        {stations.map((s) => (
          <Button
            key={s.id}
            variant="secondary"
            disabled={!fix}
            title={`${s.emoji} ${s.name.en}`}
            subtitle={captured[s.id] ? `✓ ${captured[s.id].lat.toFixed(6)}, ${captured[s.id].lng.toFixed(6)}` : 'not captured'}
            onPress={() => capture(s.id)}
          />
        ))}
        <Button
          title="Share captured coordinates"
          icon="📤"
          disabled={Object.keys(captured).length === 0}
          onPress={() =>
            Share.share({
              message: Object.entries(captured)
                .map(([id, c]) => `${id}: coords: { lat: ${c.lat.toFixed(6)}, lng: ${c.lng.toFixed(6)} }, // ±${Math.round(c.accuracy ?? 0)} m`)
                .join('\n'),
            })
          }
        />
      </Card>

      <Card>
        <H2>🔳 QR codes to print</H2>
        <P muted>Each sign’s QR should contain exactly this text (or a URL ending in it).</P>
        {stations.map((s) => (
          <Text key={s.id} style={styles.mono}>
            {s.code} — {s.name.en}
          </Text>
        ))}
        <Text style={styles.mono}>{WATCH_CODE} — opens “Sponge Park Watch” report form</Text>
      </Card>

      <Card>
        <H2>📡 Data on this phone</H2>
        <P>
          {state.records.length} records ({reports} reports) · {pending} not yet sent
        </P>
        <P muted>{syncEnabled() ? `Sending to ${config.apiUrl}` : 'No server configured (EXPO_PUBLIC_API_URL). Use export below.'}</P>
        {syncEnabled() && <Button title="Send now" icon="🔄" variant="secondary" onPress={() => void syncNow()} />}
        <Button
          title="Export all records (JSON)"
          icon="📤"
          variant="secondary"
          disabled={state.records.length === 0}
          onPress={() => Share.share({ message: JSON.stringify(state.records, null, 2) })}
        />
        <P muted>Photos stay on the phone; exported records include a local photoUri only.</P>
      </Card>

      <Card tone="danger">
        <H2>♻️ New player on this phone</H2>
        <P muted>Clears hunt progress and nickname, and shows the safety promise again for the next child. Observations and reports are kept.</P>
        <Button
          title={confirmReset ? 'Tap again to confirm' : 'Reset hunt progress'}
          variant="danger"
          onPress={() => {
            if (!confirmReset) return setConfirmReset(true);
            resetProgress();
            router.replace('/welcome');
          }}
        />
      </Card>

      <View style={{ alignItems: 'center' }}>
        <Text style={styles.small}>Device {state.deviceId} · site {config.siteId}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mono: { fontFamily: 'monospace', fontSize: 14, color: colors.text },
  small: { fontSize: 12, color: colors.muted },
});
