import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { StorageService } from '@/services/storage';
import type { ThemeContextValue } from '@/types/memo';

interface ThemeContextValueExtended extends ThemeContextValue {
  theme: MD3Theme;
}

const ThemeContext = createContext<ThemeContextValueExtended | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

// Custom light theme with better colors
const customLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',
    secondary: '#625B71',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',
    background: '#FFFBFE',
    onBackground: '#1C1B1F',
    surface: '#FFFBFE',
    onSurface: '#1C1B1F',
    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    elevation: {
      level0: 'transparent',
      level1: '#F7F2FA',
      level2: '#F2EDF7',
      level3: '#ECE6F0',
      level4: '#EAE7EC',
      level5: '#E6E0E9',
    },
  },
};

// Custom dark theme with better colors
const customDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',
    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',
    background: '#1C1B1F',
    onBackground: '#E6E1E5',
    surface: '#1C1B1F',
    onSurface: '#E6E1E5',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    outline: '#938F99',
    outlineVariant: '#49454F',
    elevation: {
      level0: 'transparent',
      level1: '#2B2930',
      level2: '#322F35',
      level3: '#38353C',
      level4: '#3A373D',
      level5: '#3F3B41',
    },
  },
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<MD3Theme>(customLightTheme);

  // Load theme preference on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update theme object when isDark changes
  useEffect(() => {
    setTheme(isDark ? customDarkTheme : customLightTheme);
  }, [isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await StorageService.loadTheme();
      setIsDark(savedTheme === 'dark');
    } catch (err) {
      console.error('Error loading theme:', err);
      // Default to light theme on error
      setIsDark(false);
    }
  };

  const toggleTheme = useCallback(async (): Promise<void> => {
    try {
      const newIsDark = !isDark;
      setIsDark(newIsDark);
      await StorageService.saveTheme(newIsDark ? 'dark' : 'light');
    } catch (err) {
      console.error('Error saving theme:', err);
      throw err;
    }
  }, [isDark]);

  const value: ThemeContextValueExtended = {
    theme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValueExtended {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
