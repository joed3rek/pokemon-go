import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, space } from '../theme';

export function Screen({ children, center }: { children: ReactNode; center?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={[styles.scroll, center && { justifyContent: 'center' }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.screen, { paddingBottom: insets.bottom + space.xl }]}>{children}</View>
    </ScrollView>
  );
}

export function Card({ children, tone, style }: { children: ReactNode; tone?: 'water' | 'leaf' | 'sun' | 'danger'; style?: StyleProp<ViewStyle> }) {
  const bg = tone ? { water: colors.waterLight, leaf: colors.leafLight, sun: colors.sunLight, danger: colors.dangerLight }[tone] : colors.card;
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'leaf' | 'secondary' | 'danger' | 'ghost';
  icon?: string;
  disabled?: boolean;
  subtitle?: string;
};

export function Button({ title, onPress, variant = 'primary', icon, disabled, subtitle }: ButtonProps) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, borderColor: v.border },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.45 },
      ]}
    >
      {icon ? <Text style={styles.buttonIcon}>{icon}</Text> : null}
      <View style={{ flexShrink: 1 }}>
        <Text style={[styles.buttonText, { color: v.fg }]}>{title}</Text>
        {subtitle ? <Text style={[styles.buttonSub, { color: v.fg }]}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );
}

const buttonVariants = {
  primary: { bg: colors.water, fg: '#fff', border: colors.water },
  leaf: { bg: colors.leaf, fg: '#fff', border: colors.leaf },
  secondary: { bg: colors.card, fg: colors.waterDark, border: colors.border },
  danger: { bg: colors.danger, fg: '#fff', border: colors.danger },
  ghost: { bg: 'transparent', fg: colors.waterDark, border: 'transparent' },
};

/** Big tappable tile for picking an answer — works for kids who can't read well yet. */
export function Choice({ emoji, label, selected, onPress, tone = 'water' }: { emoji?: string; label: string; selected?: boolean; onPress: () => void; tone?: 'water' | 'leaf' | 'danger' }) {
  const accent = { water: colors.water, leaf: colors.leaf, danger: colors.danger }[tone];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.choice,
        selected && { borderColor: accent, backgroundColor: colors.waterLight },
        pressed && { opacity: 0.8 },
      ]}
    >
      {emoji ? <Text style={styles.choiceEmoji}>{emoji}</Text> : null}
      <Text style={[styles.choiceLabel, selected && { color: accent }]}>{label}</Text>
    </Pressable>
  );
}

export function Progress({ value, total }: { value: number; total: number }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${total ? (value / total) * 100 : 0}%` }]} />
    </View>
  );
}

export const H1 = ({ children }: { children: ReactNode }) => <Text style={styles.h1}>{children}</Text>;
export const H2 = ({ children }: { children: ReactNode }) => <Text style={styles.h2}>{children}</Text>;
export const P = ({ children, muted }: { children: ReactNode; muted?: boolean }) => (
  <Text style={[styles.p, muted && { color: colors.muted }]}>{children}</Text>
);
export const Gap = ({ size = space.md }: { size?: number }) => <View style={{ height: size }} />;

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, alignItems: 'center' },
  screen: { padding: space.md, gap: space.md, maxWidth: 640, width: '100%' },
  card: { borderRadius: radius.lg, padding: space.md, gap: space.sm, borderWidth: 1, borderColor: colors.border },
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  buttonIcon: { fontSize: 22 },
  buttonText: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  buttonSub: { fontSize: 13, opacity: 0.85, textAlign: 'center' },
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 54,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  choiceEmoji: { fontSize: 26 },
  choiceLabel: { fontSize: 16, fontWeight: '600', color: colors.text, flexShrink: 1 },
  progressTrack: { height: 14, borderRadius: 7, backgroundColor: colors.border, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.leaf, borderRadius: 7 },
  h1: { fontSize: 28, fontWeight: '800', color: colors.text },
  h2: { fontSize: 20, fontWeight: '700', color: colors.text },
  p: { fontSize: 16, lineHeight: 24, color: colors.text },
});
