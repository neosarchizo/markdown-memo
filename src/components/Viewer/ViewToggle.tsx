import { StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { ViewMode } from '@/types/memo';

interface ViewToggleProps {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
}

export default function ViewToggle({ value, onValueChange }: ViewToggleProps) {
  return (
    <SegmentedButtons
      value={value}
      onValueChange={(val) => onValueChange(val as ViewMode)}
      buttons={[
        {
          value: 'raw',
          label: 'Edit',
          icon: 'pencil',
        },
        {
          value: 'rendered',
          label: 'Preview',
          icon: 'eye',
        },
      ]}
      style={styles.toggle}
    />
  );
}

const styles = StyleSheet.create({
  toggle: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
