import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { RideProvider } from './src/context/RideContext';
import { WalletProvider } from './src/context/WalletContext';
import { RootNavigator } from './src/navigation/RootNavigator';

const AppInner: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RideProvider>
            <WalletProvider>
              <AppInner />
            </WalletProvider>
          </RideProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
