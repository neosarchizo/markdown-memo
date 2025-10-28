import { View, StyleSheet } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { isDark, toggleTheme } = useTheme();

  const handleToggleTheme = async () => {
    try {
      await toggleTheme();
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          description="Toggle between light and dark theme"
          right={() => (
            <Switch value={isDark} onValueChange={handleToggleTheme} />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
        />
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
