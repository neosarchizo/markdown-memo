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
      <View style={styles.centerContainer}>
        <Text variant="titleLarge" style={styles.errorText}>
          Database Error
        </Text>
        <Text variant="bodyMedium" style={styles.errorMessage}>
          {error}
        </Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.loadingText}>
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
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    opacity: 0.7,
  },
});
