import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
import { StorageService } from '../services/storageService';
import { AppConfig } from '../constants/config';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof Colors.light;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  isDark: false,
  colors: Colors.light,
  setMode: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    StorageService.getItem<ThemeMode>(AppConfig.storageKeys.appTheme).then((saved) => {
      if (saved) setModeState(saved);
    });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    StorageService.setItem(AppConfig.storageKeys.appTheme, newMode);
  };

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const toggleTheme = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
