import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Memos',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="editor/[id]"
          options={{
            title: 'Edit Memo',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
            headerShown: true
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
