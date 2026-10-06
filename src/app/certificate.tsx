import { Redirect, router } from 'expo-router';
import { Share, StyleSheet, Text, View } from 'react-native';
import { Button, P, Screen } from '../components/ui';
import { stations } from '../content/stations';
import { useGame } from '../lib/game';
import { colors, radius } from '../theme';

export default function Certificate() {
  const { state, t, allComplete } = useGame();
  if (!allComplete) return <Redirect href="/hunt" />;

  const finished = stations
    .map((s) => state.progress[s.id]?.completedAt ?? '')
    .sort()
    .pop();
  const date = finished ? new Date(finished).toLocaleDateString() : '';
  const name = state.nickname || '🦸';

  return (
    <Screen>
      <View style={styles.cert}>
        <Text style={styles.medal}>🏅</Text>
        <Text style={styles.title}>{t('certificateTitle')}</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.body}>{t('certificateBody')}</Text>
        <View style={styles.badges}>
          {stations.map((s) => (
            <Text key={s.id} style={styles.badge}>
              {s.emoji}
            </Text>
          ))}
        </View>
        <Text style={styles.date}>Nallurhalli Sponge Park · {date}</Text>
      </View>

      <P muted>{t('keepWatching')}</P>
      <Button
        title={t('share')}
        icon="📤"
        onPress={() =>
          Share.share({ message: `🏅 ${name} — ${t('certificateTitle')}! ${t('certificateBody')} 🧽🌧️🌱` })
        }
      />
      <Button title={t('reportProblem')} icon="📣" variant="secondary" onPress={() => router.push('/report')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  cert: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
    borderRadius: radius.lg,
    borderWidth: 4,
    borderColor: colors.sun,
    backgroundColor: colors.sunLight,
  },
  medal: { fontSize: 72 },
  title: { fontSize: 26, fontWeight: '900', color: colors.waterDark, textAlign: 'center' },
  name: { fontSize: 32, fontWeight: '800', color: colors.text, textAlign: 'center' },
  body: { fontSize: 16, lineHeight: 24, color: colors.text, textAlign: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  badge: { fontSize: 30 },
  date: { fontSize: 14, color: colors.muted },
});
