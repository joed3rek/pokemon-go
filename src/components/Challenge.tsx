import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../lib/game';
import type { Challenge as ChallengeT, Station } from '../lib/types';
import { colors, radius } from '../theme';
import { Button, Card, Choice, H2, P } from './ui';

/** Renders a station's challenge; calls onDone once it's completed. */
export function Challenge({ station, onDone }: { station: Station; onDone: () => void }) {
  const c = station.challenge;
  switch (c.type) {
    case 'quiz':
      return <Quiz challenge={c} onDone={onDone} />;
    case 'observe':
      return <Observe challenge={c} station={station} onDone={onDone} />;
    case 'photo':
      return <PhotoChallenge challenge={c} station={station} onDone={onDone} />;
  }
}

function Quiz({ challenge, onDone }: { challenge: Extract<ChallengeT, { type: 'quiz' }>; onDone: () => void }) {
  const { t, tl } = useGame();
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === challenge.answer;

  return (
    <View style={styles.gap}>
      <H2>{tl(challenge.question)}</H2>
      {challenge.options.map((o, i) => (
        <Choice
          key={i}
          label={tl(o)}
          selected={picked === i}
          tone={picked === i ? (correct ? 'leaf' : 'danger') : 'water'}
          onPress={() => {
            setPicked(i);
            if (i === challenge.answer) onDone();
          }}
        />
      ))}
      {picked !== null && (
        <Card tone={correct ? 'leaf' : 'danger'}>
          <P>{correct ? `${t('correct')} ${tl(challenge.explain)}` : t('tryAgain')}</P>
        </Card>
      )}
    </View>
  );
}

function Observe({ challenge, station, onDone }: { challenge: Extract<ChallengeT, { type: 'observe' }>; station: Station; onDone: () => void }) {
  const { t, tl, addRecord } = useGame();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Number prompts are optional (a child may not be able to read a gauge); choices are required.
  const ready = challenge.prompts.every((p) => p.kind === 'number' || answers[p.id]);
  const flagged = challenge.prompts.some((p) => p.kind === 'choice' && p.options.find((o) => o.value === answers[p.id])?.flag);

  const save = () => {
    const out: Record<string, string | number> = {};
    for (const p of challenge.prompts) {
      const v = answers[p.id]?.trim();
      if (!v) continue;
      out[p.id] = p.kind === 'number' ? Number(v) : v;
    }
    addRecord({ kind: 'observation', stationId: station.id, answers: out });
    setSaved(true);
    onDone();
  };

  if (saved) {
    return (
      <View style={styles.gap}>
        <Card tone="leaf">
          <P>{t('thanksScientist')}</P>
        </Card>
        {flagged && (
          <Card tone="danger">
            <P>{t('looksLikeProblem')}</P>
            <Button
              title={t('reportProblem')}
              icon="📣"
              variant="danger"
              onPress={() => router.push({ pathname: '/report', params: { station: station.id } })}
            />
          </Card>
        )}
      </View>
    );
  }

  return (
    <View style={styles.gap}>
      <P muted>{tl(challenge.intro)}</P>
      {challenge.prompts.map((p) => (
        <View key={p.id} style={styles.gap}>
          <H2>{tl(p.label)}</H2>
          {p.kind === 'choice' ? (
            p.options.map((o) => (
              <Choice
                key={o.value}
                emoji={o.emoji}
                label={tl(o.label)}
                selected={answers[p.id] === o.value}
                onPress={() => setAnswers((a) => ({ ...a, [p.id]: o.value }))}
              />
            ))
          ) : (
            <View style={styles.numberRow}>
              <TextInput
                style={styles.numberInput}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="0"
                value={answers[p.id] ?? ''}
                onChangeText={(v) => setAnswers((a) => ({ ...a, [p.id]: v.replace(/[^0-9.]/g, '') }))}
              />
              {p.unit ? <Text style={styles.unit}>{p.unit}</Text> : null}
            </View>
          )}
        </View>
      ))}
      <Button title={ready ? t('saveObservation') : t('answerAll')} icon="🔬" variant="leaf" disabled={!ready} onPress={save} />
    </View>
  );
}

function PhotoChallenge({ challenge, station, onDone }: { challenge: Extract<ChallengeT, { type: 'photo' }>; station: Station; onDone: () => void }) {
  const { t, tl, addRecord } = useGame();
  const [uri, setUri] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const take = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled) setUri(res.assets[0].uri);
  };

  if (saved) {
    return (
      <Card tone="leaf">
        <P>{t('thanksScientist')}</P>
      </Card>
    );
  }

  return (
    <View style={styles.gap}>
      <H2>{tl(challenge.instruction)}</H2>
      {uri && <Image source={{ uri }} style={styles.photo} resizeMode="cover" />}
      <Button title={uri ? t('retakePhoto') : t('takePhoto')} icon="📸" variant={uri ? 'secondary' : 'primary'} onPress={take} />
      {uri && (
        <Button
          title={t('savePhoto')}
          icon="✅"
          variant="leaf"
          onPress={() => {
            addRecord({ kind: 'observation', stationId: station.id, answers: { photo_point: 1 }, photoUri: uri });
            setSaved(true);
            onDone();
          }}
        />
      )}
      {!uri && (
        <Button
          title={t('skipPhoto')}
          variant="ghost"
          onPress={() => {
            setSaved(true);
            onDone();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 10 },
  numberRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  numberInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    color: colors.text,
  },
  unit: { fontSize: 20, fontWeight: '700', color: colors.muted },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md, backgroundColor: colors.border },
});
