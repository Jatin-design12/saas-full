# EVegah Rider App - React Native Edition (v2.0.0)

> **Modern, High-Performance Cross-Platform React Native Mobility App**  
> Converted from the Flutter `Evegah-Rider-App` with upgraded UI, enhanced design system, and smart IoT EV features.

---

## 🚀 Key Highlights & UI Upgrades

1. **Modern EV Emerald & Neon Design System**:
   - Deep forest green (`#042A14`), Evegah emerald brand (`#095D2D`), mint accent (`#10B981`), and electric neon scan accent (`#D7FF00`).
   - Dynamic Dark / Light theme support with seamless instant toggle.
   - 100% vector SVG icons with zero runtime font crash risks.

2. **In-Ride Live Cockpit (`ActiveRideScreen`)**:
   - Dynamic velocity arc **Speedometer Gauge** with digital speed readout and 45 km/h overspeed alert.
   - Dynamic battery SOC progress bar with remaining range in km and color-coded alerts (Green > Amber > Red).
   - Real-time ride metrics: duration timer (mm:ss), distance covered (km), live running fare counter (₹), and CO₂ offset score.
   - Vehicle controls: **Pause Ride / Temporary Lock**, **Headlights ON/OFF**, **Honk / Locate EV**, and **Emergency SOS**.
   - End Ride parking verification with photo upload simulation.

3. **Smart BMS (Battery Management System) Telemetry (`BmsScreen`)**:
   - Full 14-cell pack balancing diagnostics (Cell 1 to 14 voltage bars).
   - Thermal sensor monitoring (Min/Max/Avg pack temperature).
   - Driving Mode range estimator (**Eco Mode: 92 km**, **City Mode: 78 km**, **Sport Mode: 62 km**).
   - Hardware safety interlocks check (Over-voltage, under-voltage, thermal management).

4. **Fintech Wallet & ICICI UPI Integration (`WalletScreen`)**:
   - Luxury **Virtual Mobility Debit Card** with balance readout, bonus cashback credits, and refundable security deposit badge.
   - Quick top-up sheet with preset chips (₹100, ₹250, ₹500, ₹1000) and custom amount.
   - Dynamic ICICI UPI QR generation (Official Bank MID `613268` & VPA `EVEGAHUAT@icici`).
   - Instant UPI bank withdrawal request modal.
   - Filterable transaction history (All, Credits, Debits) with itemized receipts.

5. **Instant QR & Bluetooth IoT Unlock (`ScanQrScreen`)**:
   - Viewfinder camera scanner simulation with animated neon laser sweep.
   - Manual vehicle code entry fallback (`EVEGAH_E1`, `EVEGAH_E2`, `EVEGAH_E3`).
   - 3-step encrypted Bluetooth BLE beacon handshake & wheel immobilizer release.
   - Pre-ride safety checklist modal (Helmet on, Brakes tested, Kickstand retracted).

6. **Live Zones & Station Map (`MapDiscoveryScreen`)**:
   - Interactive zone geofence preview (Gotri Central Zone, Sayaji Baug Hub, Connaught Place).
   - Station switcher showing bike counts, walking distance, and real-time battery status.
   - Instant vehicle selection bottom preview sheet.

7. **KYC & Document Verification (`KycScreen`)**:
   - Support for Driving License, Aadhaar Card, Voter ID, and Passport.
   - Document photo capture & AI OCR simulation with automatic identity data parsing.
   - Instant approval status banner.

8. **Green ESG Impact & Gamification (`HomeScreen` & `ProfileScreen`)**:
   - Lifetime CO₂ prevented (kg), Petrol saved (Liters), and Clean Green kWh used.
   - Green Rider reward points tier.
   - Referral program: Share code `EV-PATEL-100` to earn ₹100 wallet credits.

---

## 📂 Project Architecture

```
rider-native/
├── assets/                     # Copied vehicle renders, logos, empty states, and icons
├── src/
│   ├── components/
│   │   ├── common/             # Button, Card, Badge, Header, SVG Icons
│   │   ├── dashboard/          # ActiveRideCard, StatCard, BannerCarousel, QuickActionsGrid, FleetCard, VehicleDetailModal
│   │   ├── ride/               # SpeedometerGauge, BatteryBar, RideControls, SafetyChecklistModal
│   │   ├── wallet/             # VirtualCard, QuickTopUpSheet, TransactionItem
│   │   └── drawer/             # SidebarDrawer (Profile preview, quick links, theme toggle)
│   ├── constants/
│   │   ├── config.ts           # API endpoints, ICICI UPI merchant configs, pricing rates
│   │   └── theme.ts            # Light & Dark color tokens, spacing, typography
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication state, login, profile updates
│   │   ├── RideContext.tsx     # Live ride state machine, ticker loop, fare calculator
│   │   ├── WalletContext.tsx   # Balances, deposits, transactions, payouts
│   │   └── ThemeContext.tsx    # Light / Dark theme mode
│   ├── navigation/
│   │   └── RootNavigator.tsx   # 5-tab elevated bar + Sub-screens & modals
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── OtpScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── MapDiscoveryScreen.tsx
│   │   ├── ScanQrScreen.tsx
│   │   ├── ActiveRideScreen.tsx
│   │   ├── RideSummaryScreen.tsx
│   │   ├── RideHistoryScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── KycScreen.tsx
│   │   ├── BmsScreen.tsx
│   │   ├── OffersScreen.tsx
│   │   ├── SupportScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── FleetCatalogScreen.tsx
│   └── services/
│       ├── api.ts              # Fetch client with auto-failover to local backend
│       ├── authService.ts      # OTP generation, verification, user session
│       ├── bmsService.ts       # 14-cell telemetry, thermal metrics, range estimator
│       ├── kycService.ts       # Document OCR simulation & storage
│       ├── rideService.ts      # Start, pause, resume, end ride, and history
│       ├── storageService.ts   # Persistent AsyncStorage wrapper
│       ├── vehicleService.ts   # Live zones, nearby fleet, specs
│       └── walletService.ts    # Balance, ICICI UPI QR, payouts, transactions
├── App.tsx                     # App entry with SafeArea and Providers
├── index.js                    # Expo root component registration
├── app.json                    # Expo config with permissions (Camera, Location, BLE)
├── tsconfig.json               # TypeScript config
└── package.json
```

---

## 🛠️ How to Run

### Start the Development Server
```powershell
cd rider-native
npm start
```

### Run on Android
```powershell
npm run android
```

### Run on iOS
```powershell
npm run ios
```

### Run on Web (Browser)
```powershell
npm run web
```
