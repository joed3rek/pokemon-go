import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, Choice, H1, H2, P, Screen } from '../components/ui';
import { useGame } from '../lib/game';
import type { Mode } from '../lib/types';
import { colors, radius } from '../theme';

const PROMISES = ['safety1', 'safety2', 'safety3', 'safety4'] as const;

export default function Welcome() {
  const { state, t, setLang, setProfile } = useGame();
  const [nickname, setNickname] = useState(state.nickname);
  const [mode, setMode] = useState<Mode>(state.mode);
  // Returning players have already made the promise.
  const [ticked, setTicked] = useState<Set<string>>(new Set(state.onboarded ? PROMISES : []));
  const allTicked = ticked.size === PROMISES.length;

  const toggle = (k: string) =>
    setTicked((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🧽🌧️🌱</Text>
        <H1>{t('appName')}</H1>
        <P muted>{t('tagline')}</P>
      </View>

      <Card>
        <H2>{t('language')}</H2>
        <View style={styles.row}>
          <View style={styles.flex}>
            <Choice label="English" selected={state.lang === 'en'} onPress={() => setLang('en')} />
          </View>
          <View style={styles.flex}>
            <Choice label="ಕನ್ನಡ" selected={state.lang === 'kn'} onPress={() => setLang('kn')} />
          </View>
        </View>
      </Card>

      <Card>
        <H2>{t('whoIsPlaying')}</H2>
        <Choice emoji="🧒" label={`${t('explorer')} — ${t('explorerHint')}`} selected={mode === 'explorer'} onPress={() => setMode('explorer')} />
        <Choice emoji="🧑‍🔬" label={`${t('expert')} — ${t('expertHint')}`} selected={mode === 'expert'} onPress={() => setMode('expert')} />
        <Text style={styles.label}>{t('nickname')}</Text>
        <TextInput style={styles.input} value={nickname} onChangeText={setNickname} maxLength={24} autoCapitalize="words" placeholder="🦸" />
        <P muted>{t('nicknameHint')}</P>
      </Card>

      <Card tone="sun">
        <H2>🤝 {t('safetyTitle')}</H2>
        {PROMISES.map((k) => (
          <Choice key={k} emoji={ticked.has(k) ? '✅' : '⬜'} label={t(k)} selected={ticked.has(k)} tone="leaf" onPress={() => toggle(k)} />
        ))}
      </Card>

      <Button
        title={allTicked ? t('promise') : t('tickAll')}
        icon="🚀"
        variant="leaf"
        disabled={!allTicked}
        onPress={() => {
          setProfile({ nickname: nickname.trim(), mode, lang: state.lang });
          router.replace('/');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 6, paddingVertical: 8 },
  heroEmoji: { fontSize: 48 },
  row: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: colors.text, marginTop: 6 },
  input: {
    fontSize: 18,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
  },
});
