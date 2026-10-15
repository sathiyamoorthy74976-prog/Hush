import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ProfileStepLayout } from '@/components/profile';
import { AppText, Chip } from '@/components/ui';
import { VALUES_POOL } from '@/constants/profileOptions';
import { useProfileDraftStore } from '@/store/profileDraft';
import { space, useTheme } from '@/theme';

import { useProfileStepNavigation } from './useProfileStepNavigation';

export function ValuesScreen() {
  const { colors } = useTheme();
  const { config, step, total, isValid, onBack, onContinue, skippable, onSkip } =
    useProfileStepNavigation('values');
  const values = useProfileDraftStore((s) => s.values);
  const setValues = useProfileDraftStore((s) => s.setValues);

  const available = useMemo(() => VALUES_POOL.filter((v) => !values.includes(v)), [values]);

  const addValue = (v: string) => {
    if (values.length >= 5 || values.includes(v)) return;
    setValues([...values, v]);
  };

  const removeValue = (v: string) => {
    setValues(values.filter((x) => x !== v));
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<string>) => (
      <ScaleDecorator>
        <Pressable
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.rankRow,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: isActive ? 0.9 : 1,
            },
          ]}
        >
          <Ionicons name="reorder-three" size={24} color={colors.textMuted} />
          <AppText variant="heading" style={styles.rankLabel}>{item}</AppText>
          <Pressable accessibilityRole="button" onPress={() => removeValue(item)} hitSlop={8}>
            <Ionicons name="close-circle" size={22} color={colors.textMuted} />
          </Pressable>
        </Pressable>
      </ScaleDecorator>
    ),
    [colors, values],
  );

  return (
    <ProfileStepLayout
      step={step}
      total={total}
      title={config.title}
      subtitle="Choose your top 5, then drag to rank — #1 matters most."
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      skippable={skippable}
      onSkip={onSkip}
      scroll={false}
    >
      <GestureHandlerRootView style={styles.flex}>
        <AppText variant="caption" tone="textSecondary">{values.length}/5 selected</AppText>
        {values.length > 0 ? (
          <DraggableFlatList
            data={values}
            keyExtractor={(item) => item}
            onDragEnd={({ data }) => setValues(data)}
            renderItem={renderItem}
            containerStyle={styles.list}
          />
        ) : (
          <AppText tone="textSecondary">Tap values below to add them to your list.</AppText>
        )}
        <View style={styles.chips}>
          {available.map((v) => (
            <Chip key={v} label={v} onPress={() => addValue(v)} />
          ))}
        </View>
      </GestureHandlerRootView>
    </ProfileStepLayout>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: space.sm },
  list: { flexGrow: 0, maxHeight: 280 },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    padding: space.sm,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: space.xs,
  },
  rankLabel: { flex: 1 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
