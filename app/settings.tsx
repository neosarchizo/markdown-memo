import { View, StyleSheet } from 'react-native';
import { Text, List, Switch } from 'react-native-paper';
import { useState } from 'react';

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    // TODO: Implement theme switching in Phase 1
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          description="Toggle between light and dark theme"
          right={() => (
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
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
