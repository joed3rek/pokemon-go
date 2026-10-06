import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Challenge } from '../../components/Challenge';
import { Button, Card, H1, H2, P, Screen } from '../../components/ui';
import { stationById } from '../../content/stations';
import { useGame } from '../../lib/game';
import { colors } from '../../theme';

export default function StationScreen() {
  const { id, new: isNew } = useLocalSearchParams<{ id: string; new?: string }>();
  const { state, t, tl, markCompleted, allComplete } = useGame();
  const station = stationById(id);
  if (!station) return <Redirect404 />;

  const progress = state.progress[station.id];

  if (!progress?.foundAt) {
    return (
      <Screen center>
        <Stack.Screen options={{ title: '🔒' }} />
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🔒</Text>
          <H1>{t('locked')}</H1>
        </View>
        <Card tone="water">
          <Text style={styles.clue}>🔎 {tl(station.clue)}</Text>
          <P muted>{t('lockedHint')}</P>
        </Card>
        <Button title={t('scanQr')} icon="📷" onPress={() => router.replace('/scan')} />
      </Screen>
    );
  }

  const done = !!progress.completedAt;

  return (
    <Screen>
      <Stack.Screen options={{ title: tl(station.name) }} />
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>{station.emoji}</Text>
        {isNew && !done ? <Text style={styles.found}>🎉 {t('youFound')}</Text> : null}
        <H1>{tl(station.name)}</H1>
      </View>

      <Card>
        <H2>📖 {t('learn')}</H2>
        <P>{tl(station.learn)}</P>
      </Card>

      {station.safety && (
        <Card tone="sun">
          <H2>🦺 {t('safety')}</H2>
          <P>{tl(station.safety)}</P>
        </Card>
      )}

      <Card>
        <H2>⭐ {t('challenge')}</H2>
        <Challenge station={station} onDone={() => markCompleted(station.id)} />
      </Card>

      {done && (
        <Card tone="leaf" style={styles.center}>
          <Text style={styles.badge}>{station.emoji}</Text>
          <H2>{t('badgeEarned')}</H2>
          {allComplete ? (
            <Button title={t('getCertificate')} icon="🏅" variant="leaf" onPress={() => router.replace('/certificate')} />
          ) : (
            <Button title={t('nextClue')} icon="🔎" variant="leaf" onPress={() => router.replace('/hunt')} />
          )}
        </Card>
      )}

      <Button
        title={t('somethingWrong')}
        icon="📣"
        variant="ghost"
        onPress={() => router.push({ pathname: '/report', params: { station: station.id } })}
      />
    </Screen>
  );
}

function Redirect404() {
  const { t } = useGame();
  return (
    <Screen center>
      <H1>🤷</H1>
      <P>{t('unknownCode')}</P>
      <Button title={t('backToHunt')} onPress={() => router.replace('/hunt')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 4 },
  heroEmoji: { fontSize: 72 },
  found: { fontSize: 20, fontWeight: '800', color: colors.leaf },
  clue: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.text },
  center: { alignItems: 'center' },
  badge: { fontSize: 64 },
});
