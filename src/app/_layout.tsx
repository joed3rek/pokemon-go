import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GameProvider, useGame } from '../lib/game';
import { colors } from '../theme';

function Navigator() {
  const { t } = useGame();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.water },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ title: t('appName') }} />
      <Stack.Screen name="welcome" options={{ title: t('appName'), headerBackVisible: false }} />
      <Stack.Screen name="hunt" options={{ title: t('stations') }} />
      <Stack.Screen name="scan" options={{ title: t('scanQr') }} />
      <Stack.Screen name="station/[id]" options={{ title: '' }} />
      <Stack.Screen name="report" options={{ title: t('reportProblemHint') }} />
      <Stack.Screen name="certificate" options={{ title: t('certificateTitle') }} />
      <Stack.Screen name="tools" options={{ title: t('organiser') }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <StatusBar style="light" />
        <Navigator />
      </GameProvider>
    </SafeAreaProvider>
  );
}
