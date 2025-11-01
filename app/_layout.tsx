import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { PaperProvider, ActivityIndicator, Text, IconButton } from 'react-native-paper';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { MemoProvider } from '@/contexts/MemoContext';
import { StorageService } from '@/services/storage';

function RootLayoutContent() {
  const { theme } = useTheme();
  const router = useRouter();
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeDatabase();
  }, []);

  const initializeDatabase = async () => {
    try {
      await StorageService.init();
      setDbReady(true);
    } catch (err) {
      console.error('Database initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
    }
  };

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleLarge" style={{ color: theme.colors.error, marginBottom: 8 }}>
          Database Error
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, textAlign: 'center', opacity: 0.7 }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="bodyLarge" style={{ color: theme.colors.onBackground, marginTop: 16 }}>
          Initializing...
        </Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <MemoProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              title: 'Memos',
              headerShown: true,
              headerRight: () => (
                <IconButton
                  icon="cog-outline"
                  onPress={() => router.push('/settings')}
                />
              ),
            }}
          />
          <Stack.Screen
            name="editor/[id]"
            options={{
              title: 'Edit Memo',
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: 'Settings',
              headerShown: true,
            }}
          />
        </Stack>
      </MemoProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
