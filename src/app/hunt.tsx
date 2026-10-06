import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, H2, P, Progress, Screen } from '../components/ui';
import { stations } from '../content/stations';
import { useGame } from '../lib/game';
import { distanceMeters, warmth } from '../lib/geo';
import type { Station } from '../lib/types';
import { useLiveLocation } from '../lib/useLocation';
import { colors, radius } from '../theme';

export default function Hunt() {
  const { state, t, tl, completedCount, allComplete } = useGame();
  const next = stations.find((s) => !state.progress[s.id]?.completedAt);
  const nextFound = next && state.progress[next.id]?.foundAt;

  return (
    <Screen>
      <Progress value={completedCount} total={stations.length} />

      {allComplete ? (
        <Card tone="leaf">
          <H2>{t('allFound')}</H2>
          <Button title={t('getCertificate')} icon="🏅" variant="leaf" onPress={() => router.push('/certificate')} />
        </Card>
      ) : next && nextFound ? (
        <Card tone="sun">
          <H2>
            {next.emoji} {tl(next.name)}
          </H2>
          <Button title={t('foundTapToPlay')} icon="▶️" onPress={() => router.push(`/station/${next.id}`)} />
        </Card>
      ) : next ? (
        <ClueCard station={next} />
      ) : null}

      <Button title={t('scanQr')} icon="📷" onPress={() => router.push('/scan')} />

      <H2>{t('stations')}</H2>
      {stations.map((s, i) => {
        const p = state.progress[s.id];
        const status = p?.completedAt ? t('done') : p?.foundAt ? t('foundTapToPlay') : t('notFoundYet');
        return (
          <Pressable
            key={s.id}
            onPress={() => router.push(`/station/${s.id}`)}
            style={({ pressed }) => [styles.row, p?.completedAt && styles.rowDone, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.rowEmoji}>{p?.foundAt ? s.emoji : '❔'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{p?.foundAt ? tl(s.name) : `${i + 1}. ???`}</Text>
              <Text style={styles.rowStatus}>{status}</Text>
            </View>
            <Text style={styles.rowCheck}>{p?.completedAt ? '✅' : p?.foundAt ? '▶️' : '🔒'}</Text>
          </Pressable>
        );
      })}
    </Screen>
  );
}

function ClueCard({ station }: { station: Station }) {
  const { t, tl } = useGame();
  const { fix } = useLiveLocation(!!station.coords);
  const meters = fix && station.coords ? distanceMeters(fix, station.coords) : null;
  const hint = meters !== null ? warmth(meters) : null;

  return (
    <Card tone="water">
      <Text style={styles.clueLabel}>🔎 {t('nextClue')}</Text>
      <Text style={styles.clue}>{tl(station.clue)}</Text>
      {hint && meters !== null && (
        <View style={[styles.warmth, { backgroundColor: hint.color }]}>
          <Text style={styles.warmthText}>{t(hint.key)}</Text>
          <Text style={styles.warmthMeters}>~{Math.round(meters)} m</Text>
        </View>
      )}
      <P muted>{t('lockedHint')}</P>
    </Card>
  );
}

const styles = StyleSheet.create({
  clueLabel: { fontSize: 14, fontWeight: '800', color: colors.waterDark, textTransform: 'uppercase', letterSpacing: 1 },
  clue: { fontSize: 22, lineHeight: 30, fontWeight: '700', color: colors.text },
  warmth: { borderRadius: radius.md, padding: 12, alignItems: 'center' },
  warmthText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  warmthMeters: { color: '#fff', fontSize: 14, opacity: 0.9 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowDone: { backgroundColor: colors.leafLight },
  rowEmoji: { fontSize: 30 },
  rowTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  rowStatus: { fontSize: 13, color: colors.muted },
  rowCheck: { fontSize: 20 },
});
