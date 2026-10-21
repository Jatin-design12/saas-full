import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRide } from '../context/RideContext';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RiderProfileSelectScreen } from '../screens/RiderProfileSelectScreen';
import { TermsConditionsScreen } from '../screens/TermsConditionsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ActiveRideScreen } from '../screens/ActiveRideScreen';
import { RideSummaryScreen } from '../screens/RideSummaryScreen';
import { RideHistoryScreen } from '../screens/RideHistoryScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { KycScreen } from '../screens/KycScreen';
import { BmsScreen } from '../screens/BmsScreen';
import { OffersScreen } from '../screens/OffersScreen';
import { SupportScreen } from '../screens/SupportScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { FleetCatalogScreen } from '../screens/FleetCatalogScreen';
import { ScanQrScreen } from '../screens/ScanQrScreen';
import { Icons } from '../components/common/Icons';

type TabRoute = 'home' | 'my_rides' | 'wallet' | 'profile';

const PRIMARY_COLOR = '#4327A8';
const INACTIVE_COLOR = '#94A3B8';
const SCAN_COLOR = '#D7FF00';

export const RootNavigator: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { activeRide } = useRide();

  // Root stack states
  const [showSplash, setShowSplash] = useState(true);

  // Active tab state
  const [currentTab, setCurrentTab] = useState<TabRoute>('home');

  // Sub-screen / Modal route state
  const [currentSubScreen, setCurrentSubScreen] = useState<string | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // 1. Splash Screen
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 2. Auth Flow (Login & OTP)
  if (currentSubScreen === 'login' || (!isLoggedIn && currentTab !== 'home')) {
    return (
      <LoginScreen
        onBack={() => {
          setCurrentSubScreen(null);
          setCurrentTab('home');
        }}
        onLoginSuccess={() => {
          // After successful login & OTP, guide through Riding Profile selection & Terms
          if (!hasCompletedOnboarding) {
            setCurrentSubScreen('rider_profile_select');
          } else {
            setCurrentSubScreen(null);
          }
        }}
      />
    );
  }

  // 2.1 Onboarding: Choose Your Riding Profile (Screenshot 5)
  if (currentSubScreen === 'rider_profile_select') {
    return (
      <RiderProfileSelectScreen
        onContinue={(profileType) => {
          setCurrentSubScreen('terms');
        }}
        onBack={() => setCurrentSubScreen(null)}
      />
    );
  }

  // 2.2 Onboarding: Terms & Conditions (Screenshot 4)
  if (currentSubScreen === 'terms') {
    return (
      <TermsConditionsScreen
        onAccept={() => {
          setHasCompletedOnboarding(true);
          setCurrentSubScreen(null);
          setCurrentTab('home');
        }}
        onBack={() => setCurrentSubScreen(null)}
      />
    );
  }

  // 3. Modals and Sub-screens
  if (currentSubScreen === 'active_cockpit' || currentSubScreen === 'live_map') {
    return (
      <ActiveRideScreen
        onMinimize={() => setCurrentSubScreen(null)}
        onRideEnded={() => {
          setCurrentSubScreen(null);
          setCurrentTab('my_rides');
        }}
      />
    );
  }

  if (currentSubScreen === 'scan_qr') {
    return (
      <ScanQrScreen
        onBack={() => setCurrentSubScreen(null)}
        onRideStarted={() => {
          setCurrentSubScreen('active_cockpit');
        }}
      />
    );
  }

  if (currentSubScreen === 'fleet_catalog') {
    return (
      <FleetCatalogScreen
        onBack={() => setCurrentSubScreen(null)}
        onBookModel={() => {
          setCurrentSubScreen('active_cockpit');
        }}
      />
    );
  }

  if (currentSubScreen === 'live_zones') {
    return (
      <ActiveRideScreen
        onMinimize={() => setCurrentSubScreen(null)}
        onRideEnded={() => setCurrentSubScreen(null)}
      />
    );
  }

  if (currentSubScreen === 'smart_bms') {
    return <BmsScreen onBack={() => setCurrentSubScreen(null)} />;
  }

  if (currentSubScreen === 'offers') {
    return <OffersScreen onBack={() => setCurrentSubScreen(null)} />;
  }

  if (currentSubScreen === 'kyc') {
    return <KycScreen onBack={() => setCurrentSubScreen(null)} />;
  }

  if (currentSubScreen === 'support') {
    return <SupportScreen onBack={() => setCurrentSubScreen(null)} />;
  }

  if (currentSubScreen === 'wallet') {
    return <WalletScreen onBack={() => setCurrentSubScreen(null)} onNavigate={(r) => setCurrentSubScreen(r)} />;
  }

  // 4. Main 5-Tab Navigation Layout (100000% matched to Screenshots 1, 2, 3)
  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeScreen
            onNavigate={(route, params) => {
              if (route === 'wallet' || route === 'my_rides' || route === 'profile') {
                handleTabTap(route);
              } else {
                setCurrentSubScreen(route);
              }
            }}
          />
        );
      case 'my_rides':
        return <RideHistoryScreen onBack={() => setCurrentTab('home')} />;
      case 'wallet':
        return <WalletScreen onBack={() => setCurrentTab('home')} onNavigate={(r) => setCurrentSubScreen(r)} />;
      case 'profile':
        return (
          <ProfileScreen
            onNavigate={(route) => {
              if (route === 'wallet' || route === 'my_rides') {
                handleTabTap(route);
              } else {
                setCurrentSubScreen(route);
              }
            }}
          />
        );
      default:
        return <HomeScreen onNavigate={(r) => setCurrentSubScreen(r)} />;
    }
  };

  const handleTabTap = (tab: TabRoute) => {
    if (!isLoggedIn && (tab === 'my_rides' || tab === 'wallet' || tab === 'profile')) {
      setCurrentSubScreen('login');
      return;
    }
    setCurrentTab(tab);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Active Tab Screen */}
      <View style={styles.screenContainer}>{renderTabContent()}</View>

      {/* 5-Tab Bottom Navigation Bar (Matched to Screenshots) */}
      <View style={styles.bottomBar}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleTabTap('home')}
          style={styles.tabItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'home' && styles.iconWrapperSelected,
            ]}
          >
            <Icons.Home
              size={22}
              color={currentTab === 'home' ? PRIMARY_COLOR : INACTIVE_COLOR}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              {
                color: currentTab === 'home' ? PRIMARY_COLOR : '#64748B',
                fontWeight: currentTab === 'home' ? '800' : '500',
              },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* Tab 2: My Rides */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleTabTap('my_rides')}
          style={styles.tabItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'my_rides' && styles.iconWrapperSelected,
            ]}
          >
            <Icons.Scooter
              size={22}
              color={currentTab === 'my_rides' ? PRIMARY_COLOR : INACTIVE_COLOR}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              {
                color: currentTab === 'my_rides' ? PRIMARY_COLOR : '#64748B',
                fontWeight: currentTab === 'my_rides' ? '800' : '500',
              },
            ]}
          >
            My Rides
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Center Elevated Neon Scan Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            if (!isLoggedIn) {
              setCurrentSubScreen('login');
            } else {
              setCurrentSubScreen('scan_qr');
            }
          }}
          style={styles.centerScanItem}
        >
          <View style={styles.centerScanCircle}>
            <Icons.QrCode size={23} color="#4313B8" />
          </View>
          <Text style={styles.centerScanLabel}>Scan</Text>
        </TouchableOpacity>

        {/* Tab 4: Wallet */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleTabTap('wallet')}
          style={styles.tabItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'wallet' && styles.iconWrapperSelected,
            ]}
          >
            <Icons.Wallet
              size={22}
              color={currentTab === 'wallet' ? PRIMARY_COLOR : INACTIVE_COLOR}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              {
                color: currentTab === 'wallet' ? PRIMARY_COLOR : '#64748B',
                fontWeight: currentTab === 'wallet' ? '800' : '500',
              },
            ]}
          >
            Wallet
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleTabTap('profile')}
          style={styles.tabItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'profile' && styles.iconWrapperSelected,
            ]}
          >
            <Icons.User
              size={22}
              color={currentTab === 'profile' ? PRIMARY_COLOR : INACTIVE_COLOR}
            />
          </View>
          <Text
            style={[
              styles.tabLabel,
              {
                color: currentTab === 'profile' ? PRIMARY_COLOR : '#64748B',
                fontWeight: currentTab === 'profile' ? '800' : '500',
              },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFBFE',
  },
  screenContainer: {
    flex: 1,
  },
  bottomBar: {
    height: 74,
    backgroundColor: '#FEFEFF',
    borderTopWidth: 1,
    borderTopColor: '#E9EDF3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 64,
  },
  iconWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperSelected: {
    backgroundColor: '#F0EEFF',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 9.5,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  centerScanItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: -14,
  },
  centerScanCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: SCAN_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: SCAN_COLOR,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  centerScanLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
  },
});
