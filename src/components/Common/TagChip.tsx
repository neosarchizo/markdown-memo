import React from 'react';
import { Chip } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface TagChipProps {
  label: string;
  onDelete?: () => void;
  onPress?: () => void;
  selected?: boolean;
}

export const TagChip: React.FC<TagChipProps> = ({
  label,
  onDelete,
  onPress,
  selected = false,
}) => {
  return (
    <Chip
      mode={selected ? 'flat' : 'outlined'}
      selected={selected}
      onClose={onDelete}
      onPress={onPress}
      style={styles.chip}
      compact
    >
      {label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
});
