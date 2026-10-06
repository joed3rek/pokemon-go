import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Linking, StyleSheet, TextInput, View } from 'react-native';
import { Button, Card, Choice, H1, H2, P, Screen } from '../components/ui';
import { issues } from '../content/issues';
import { stationById, stations } from '../content/stations';
import { config } from '../lib/config';
import { useGame } from '../lib/game';
import { syncEnabled } from '../lib/sync';
import type { IssueType } from '../lib/types';
import { currentFix } from '../lib/useLocation';
import { colors, radius } from '../theme';

const ELSEWHERE = '';

export default function Report() {
  const params = useLocalSearchParams<{ station?: string }>();
  const { t, tl, addRecord } = useGame();
  const [issue, setIssue] = useState<IssueType | null>(null);
  const [stationId, setStationId] = useState(params.station ?? ELSEWHERE);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const pickPhoto = async (fromCamera: boolean) => {
    if (fromCamera) {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) return;
    }
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.6 };
    const res = fromCamera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };

  const submit = async () => {
    if (!issue) return;
    setSending(true);
    const location = await currentFix();
    addRecord({
      kind: 'report',
      issue,
      stationId: stationId || undefined,
      note: note.trim() || undefined,
      photoUri: photoUri ?? undefined,
      location,
    });
    setSending(false);
    setSent(true);
  };

  const whatsapp = () => {
    const where = stationById(stationId)?.name.en ?? 'Somewhere in the park';
    const what = issues.find((i) => i.type === issue)?.label.en ?? '';
    const text = `Sponge Park Watch 📣\nProblem: ${what}\nWhere: ${where}${note.trim() ? `\nNote: ${note.trim()}` : ''}`;
    Linking.openURL(`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(text)}`);
  };

  if (sent) {
    return (
      <Screen center>
        <View style={styles.hero}>
          <H1>🙏</H1>
          <H1>{t('reportSaved')}</H1>
          {syncEnabled() && <P muted>{t('reportQueued')}</P>}
        </View>
        {config.whatsappNumber ? <Button title={t('alsoWhatsapp')} icon="💬" variant="secondary" onPress={whatsapp} /> : null}
        <Button title={t('done2')} icon="✅" variant="leaf" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      </Screen>
    );
  }

  return (
    <Screen>
      <P>{t('reportIntro')}</P>

      <Card>
        <H2>{t('reportTitle')}</H2>
        <View style={styles.grid}>
          {issues.map((i) => (
            <View key={i.type} style={styles.cell}>
              <Choice emoji={i.emoji} label={tl(i.label)} selected={issue === i.type} tone="danger" onPress={() => setIssue(i.type)} />
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <H2>📍 {t('where')}</H2>
        <View style={styles.grid}>
          {stations.map((s) => (
            <View key={s.id} style={styles.cell}>
              <Choice emoji={s.emoji} label={tl(s.name)} selected={stationId === s.id} onPress={() => setStationId(s.id)} />
            </View>
          ))}
          <View style={styles.cell}>
            <Choice emoji="🗺️" label={t('notSureWhere')} selected={stationId === ELSEWHERE} onPress={() => setStationId(ELSEWHERE)} />
          </View>
        </View>
      </Card>

      <Card>
        <H2>📸 {t('addPhoto')}</H2>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />}
        <View style={styles.row}>
          <View style={styles.flex}>
            <Button title={t('takePhoto')} icon="📷" variant="secondary" onPress={() => pickPhoto(true)} />
          </View>
          <View style={styles.flex}>
            <Button title="🖼️" variant="secondary" onPress={() => pickPhoto(false)} />
          </View>
        </View>
        <TextInput style={styles.note} value={note} onChangeText={setNote} placeholder={t('note')} multiline maxLength={500} />
      </Card>

      <Button
        title={issue ? t('sendReport') : t('pickIssue')}
        icon="📣"
        variant="danger"
        disabled={!issue || sending}
        onPress={submit}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { flexGrow: 1, flexBasis: '45%' },
  row: { flexDirection: 'row', gap: 8 },
  flex: { flex: 1 },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.md },
  note: {
    minHeight: 80,
    fontSize: 16,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    textAlignVertical: 'top',
    color: colors.text,
  },
});
