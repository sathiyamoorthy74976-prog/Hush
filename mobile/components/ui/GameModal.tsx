import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { radii, space, useTheme } from '@/theme';

import { AppText } from './AppText';
import { Button } from './Button';

type Props = {
  visible: boolean;
  title: string;
  body: string;
  cta: string;
  onClose: () => void;
  children?: ReactNode;
};

export function GameModal({ visible, title, body, cta, onClose, children }: Props) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.text }]}
        onPress={onClose}
        accessibilityLabel="Close"
      />
      <View pointerEvents="box-none" style={styles.center}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, borderColor: colors.text },
          ]}
        >
          {children}
          <AppText variant="title" style={{ textAlign: 'center' }}>
            {title}
          </AppText>
          <AppText tone="textSecondary" style={{ textAlign: 'center' }}>
            {body}
          </AppText>
          <Button label={cta} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, opacity: 0.45 },
  center: { flex: 1, justifyContent: 'center', padding: space.md },
  card: {
    borderRadius: radii.lg,
    borderWidth: 3,
    borderBottomWidth: 6,
    padding: space.md,
    gap: space.sm,
  },
});
