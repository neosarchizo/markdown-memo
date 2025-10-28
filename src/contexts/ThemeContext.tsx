import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
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

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<MD3Theme>(MD3LightTheme);

  // Load theme preference on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update theme object when isDark changes
  useEffect(() => {
    setTheme(isDark ? MD3DarkTheme : MD3LightTheme);
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
