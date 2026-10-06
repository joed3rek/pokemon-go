import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Button, Card, H2, P, Screen } from '../components/ui';
import { parseCode } from '../lib/codes';
import { useGame } from '../lib/game';
import { colors, radius } from '../theme';

export default function Scan() {
  const { t, markFound } = useGame();
  const [permission, requestPermission] = useCameraPermissions();
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  // The scanner fires many times per second while a code is in view.
  const handled = useRef(false);

  const handle = (raw: string) => {
    if (handled.current) return;
    const result = parseCode(raw);
    if (result.kind === 'unknown') {
      setError(true);
      return;
    }
    handled.current = true;
    if (result.kind === 'watch') {
      router.replace('/report');
    } else {
      markFound(result.station.id);
      router.replace({ pathname: '/station/[id]', params: { id: result.station.id, new: '1' } });
    }
  };

  return (
    <Screen>
      <H2>{t('scanTitle')}</H2>
      {permission?.granted ? (
        <View style={styles.cameraWrap}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
            onBarcodeScanned={({ data }) => handle(data)}
          />
          <View style={styles.frame} pointerEvents="none" />
        </View>
      ) : (
        <Card tone="water">
          <P>{t('cameraNeeded')}</P>
          <Button title={t('allowCamera')} icon="📷" onPress={requestPermission} />
        </Card>
      )}

      {error && (
        <Card tone="danger">
          <P>{t('unknownCode')}</P>
        </Card>
      )}

      <Card>
        <P muted>{t('orTypeCode')}</P>
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={(v) => {
            setCode(v);
            setError(false);
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          placeholder="SP-…"
          onSubmitEditing={() => handle(code)}
        />
        <Button title={t('unlock')} icon="🔓" variant="secondary" disabled={!code.trim()} onPress={() => handle(code)} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cameraWrap: { width: '100%', aspectRatio: 1, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#000' },
  frame: { position: 'absolute', top: '18%', left: '18%', right: '18%', bottom: '18%', borderWidth: 4, borderColor: '#fff', borderRadius: radius.md },
  input: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 2,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    color: colors.text,
  },
});
