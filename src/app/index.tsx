import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, H1, H2, P, Progress, Screen } from '../components/ui';
import { stations } from '../content/stations';
import { useGame } from '../lib/game';
import { colors } from '../theme';

export default function Home() {
  const { state, t, completedCount, allComplete } = useGame();
  if (!state.onboarded) return <Redirect href="/welcome" />;

  const started = Object.keys(state.progress).length > 0;

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🧽</Text>
        <H1>
          {t('hello')}
          {state.nickname ? `, ${state.nickname}` : ''}!
        </H1>
        <P muted>{t('tagline')}</P>
      </View>

      <Card>
        <View style={styles.badgeRow}>
          {stations.map((s) => (
            <Text key={s.id} style={[styles.badge, !state.progress[s.id]?.completedAt && styles.badgeLocked]}>
              {state.progress[s.id]?.completedAt ? s.emoji : '❔'}
            </Text>
          ))}
        </View>
        <Progress value={completedCount} total={stations.length} />
        <H2>
          {completedCount} / {stations.length} {t('badges')}
        </H2>
      </Card>

      {allComplete ? (
        <Button title={t('getCertificate')} icon="🏅" variant="leaf" onPress={() => router.push('/certificate')} />
      ) : (
        <Button title={started ? t('continueHunt') : t('startHunt')} icon="🗺️" onPress={() => router.push('/hunt')} />
      )}
      <Button title={t('scanQr')} icon="📷" variant="secondary" onPress={() => router.push('/scan')} />
      <Button title={t('reportProblem')} subtitle={t('reportProblemHint')} icon="📣" variant="danger" onPress={() => router.push('/report')} />

      <Card tone="water">
        <P>
          {state.mode === 'explorer' ? '🧒' : '🧑‍🔬'} {t(state.mode)} ·{' '}
          {state.lang === 'kn' ? 'ಕನ್ನಡ' : 'English'}
        </P>
        <Button title={t('settings')} variant="ghost" onPress={() => router.push('/welcome')} />
      </Card>

      <Button title={t('organiser')} icon="🛠️" variant="ghost" onPress={() => router.push('/tools')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  heroEmoji: { fontSize: 56 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  badge: { fontSize: 30, width: 44, height: 44, textAlign: 'center', lineHeight: 44, borderRadius: 22, backgroundColor: colors.leafLight, overflow: 'hidden' },
  badgeLocked: { backgroundColor: colors.border, opacity: 0.6 },
});
