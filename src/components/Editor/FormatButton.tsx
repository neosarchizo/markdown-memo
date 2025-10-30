import React from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

interface FormatButtonProps {
  icon: string;
  onPress: () => void;
  disabled?: boolean;
  active?: boolean;
}

export const FormatButton: React.FC<FormatButtonProps> = ({
  icon,
  onPress,
  disabled = false,
  active = false,
}) => {
  const theme = useTheme();

  return (
    <IconButton
      icon={icon}
      mode={active ? 'contained' : 'outlined'}
      size={20}
      onPress={onPress}
      disabled={disabled}
      containerColor={active ? theme.colors.primaryContainer : undefined}
      iconColor={active ? theme.colors.primary : theme.colors.onSurface}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 2,
  },
});
