# Evegah EV Mobility SaaS Platform
## Comprehensive Scope of Work (SOW) & Technical Specification

**Document Version:** 2.0  
**Target Audience:** Engineering Leads, Product Managers, Frontend/Backend/Mobile Developers, QA Engineers, and Executive Stakeholders  
**Platform Architecture:** Microservices-ready Monolith (Node.js/Express) + Next.js 14 Admin Portal + React Native/Expo Rider App + Flutter Technician/Employee App + PostgreSQL + Redis + IoT/BLE Telemetry  

---

## Table of Contents
1. [Executive Summary & System Architecture](#1-executive-summary--system-architecture)
2. [Technology Stack & System Topology](#2-technology-stack--system-topology)
3. [Module 1: Super Admin & Operations Dashboard](#3-module-1-super-admin--operations-dashboard)
4. [Module 2: Rider Mobile Application (iOS & Android)](#4-module-2-rider-mobile-application-ios--android)
5. [Module 3: Employee & Technician App (Registration, Maintenance & BMS)](#5-module-3-employee--technician-app-registration-maintenance--bms)
6. [Hardware, IoT & Bluetooth Low Energy (BLE) Integration](#6-hardware-iot--bluetooth-low-energy-ble-integration)
7. [Database Schema & Core Entities](#7-database-schema--core-entities)
8. [API Architecture & Service Contracts](#8-api-architecture--service-contracts)
9. [Payment Gateways & Financial Settlement Engine](#9-payment-gateways--financial-settlement-engine)
10. [Security, Geofencing & Compliance](#10-security-geofencing--compliance)
11. [Project Phases, Milestones & Acceptance Criteria](#11-project-phases-milestones--acceptance-criteria)

---

## 1. Executive Summary & System Architecture

### 1.1 Platform Mission
The **Evegah EV Mobility SaaS Platform** is an enterprise-grade smart electric vehicle rental, fleet management, and battery-swapping ecosystem. The system unifies real-time IoT vehicle telemetry, customer self-service mobile booking, on-ground staff fleet operations, battery lifecycle analytics, and centralized administrative controls into a coordinated multi-application suite.

```
                                  +-------------------------------------------------+
                                  |            Evegah Cloud Infrastructure          |
                                  |        Node.js / Express API (Port 5000)        |
                                  |     PostgreSQL (Port 5433) + Redis Cache        |
                                  +--------+-------------------+--------------------+
                                           |                   |
                     +---------------------+                   +--------------------+
                     |                                                              |
      +--------------v---------------+                               +--------------v---------------+
      |   Next.js 14 Admin Portal    |                               |    IoT Telemetry & SMS Gateways|
      |   Super Admin & Operations   |                               |    GPS / 4G Telematics Box   |
      |   (Port 3000 Web App)        |                               |    ICICI / WhatsApp / Razorpay |
      +------------------------------+                               +------------------------------+
                     ^                                                              ^
                     |                                                              |
      +--------------+---------------+                               +--------------+---------------+
      |    Rider Mobile Application  |                               |   Employee & Technician App  |
      |   (React Native / Expo)      |                               |   (Flutter Engine)           |
      |   Consumer iOS & Android     |                               |   Staff Registration,        |
      |   Booking, Payments, BLE     |                               |   Maintenance & Smart BMS    |
      +------------------------------+                               +------------------------------+
```

### 1.2 Multi-Application Ecosystem
1. **Next.js 14 Web Portal**: Enterprise control plane for Super Admins, Zone Managers, Franchise Partners, and Finance Controllers.
2. **Rider Mobile App**: Consumer-facing React Native application enabling on-demand hourly and monthly package EV rentals, dynamic hero content, QR unlocking, in-app wallet, and live trip navigation.
3. **Employee App (`evegah-bms`)**: Flutter cross-platform mobile app for station booking agents, field technicians, and hub mechanics for rider KYC onboarding, maintenance inspections, and BLE smart battery swapping.

---

## 2. Technology Stack & System Topology

| Component | Technology | Version / Framework | Core Responsibilities |
| :--- | :--- | :--- | :--- |
| **Backend API** | Node.js / Express | Node v20 LTS, Express v4.19 | REST API endpoints, business logic, auth, cron schedulers |
| **Primary Database** | PostgreSQL | PostgreSQL 16.x (Port 5433) | Relational store for users, rentals, fleets, telemetry logs |
| **Cache & Queue** | Redis | Redis 7.x | Token caching, lock states, live GPS cache |
| **Admin Dashboard** | Next.js | Next.js 14 (App Router), TailwindCSS | Fleet dashboard, KYC approval, geofencing, finance, CMS |
| **Rider Mobile App** | React Native | Expo SDK 51, React Native 0.74 | Customer onboarding, Bluetooth vehicle control, wallet, map |
| **Employee App** | Flutter | Flutter 3.22 / Dart 3.4 | BLE BMS telemetry, walk-in KYC, physical inspection, swap flow |
| **IoT Connectivity** | MQTT / TCP / HTTP | Custom binary parser & JSON | Real-time GPS, speed, battery voltage, ignition control |
| **Payment Gateways** | ICICI Bank, Razorpay, PhonePe, PayU | REST & Webhook APIs | UPI intent, dynamic QR, card payments, instant refunds |
| **Communications** | WhatsApp Business API, MSG91 | REST API | Transactional OTP, rental agreements, payment reminders |

---

## 3. Module 1: Super Admin & Operations Dashboard

The Admin Dashboard provides full visibility and role-based authority over the entire platform. Built on Next.js 14 App Router, it is organized into three operational tiers: **Global Super Admin**, **Zone Operations**, and **Franchise Partner**.

### 3.1 Super Admin Executive Overview (`/super-admin`)
- **Fleet KPI Metrics**: Total active vehicles, vehicles rented, vehicles in maintenance, offline vehicles, low battery warnings (<20%).
- **Financial Run-Rate**: Real-time revenue counter (today, MTD, YTD), rental revenue vs. deposit collections, gross margins by zone.
- **Rider Metrics**: Total registered riders, active ongoing rentals, overdue returns, pending KYC verification queue.
- **CO2 Savings Engine (`/co2-saving`)**: Real-time calculation of metric tonnes of carbon emissions avoided based on cumulative EV kilometers ridden; exportable sustainability reports for ESG compliance.

### 3.2 Rider Lifecycle & KYC Management
- **New Rider Registration & Approval (`/new-rider`, `/registrations`)**:
  - Live queue of newly submitted rider profiles awaiting KYC verification.
  - Side-by-side verification view: Aadhaar front/back, Driving License, live selfie photograph with facial match indicator.
  - One-click Actions: Approve, Reject with Reason (SMS/WhatsApp notification dispatched), Request Re-upload.
  - Duplicate detection based on Aadhaar number, phone number, and facial recognition hash.
- **Master Renters Ledger (`/renters`)**:
  - Searchable, filterable directory of all historical and active riders.
  - Zone-specific filtering (e.g., Gotri Zone, Manjalpur Zone, L&T Knowledge City Zone).
  - Columnar view: Rider ID, Full Name, Contact, Assigned Vehicle Code, Plan Name, Deposit Paid, Rental Start Date, Next Due Date, Overdue Penalty, Status (Active, Overdue, Terminated).
  - CSV/Excel export engine with custom date range filtering.
- **Retain & Renewal Engine (`/retain-rider`)**:
  - Module dedicated to extending ongoing monthly/weekly contracts.
  - Automatic calculation of renewal charges, grace period allowances, and promotional coupon discounts.
  - Payment collection tracking: Cash, UPI QR, or Debit from Rider Wallet.
- **Return & Offboarding Settlement (`/return-ride`)**:
  - Processing vehicle check-in when a rider completes their rental period.
  - Multi-point damage check comparison between check-in and check-out photos.
  - Automated security deposit reconciliation: Deduct late fees, damage penalties, unpaid electricity/traffic fines, and initiate instant refund of net balance to rider bank account via ICICI Payout API.

### 3.3 Fleet & Asset Management (`/vehicles`)
- **Vehicle Directory & Telemetry**:
  - Search by Plate Number, Chassis Number, IoT IMEI, or Assigned Zone.
  - Live status indicators: `Available`, `Rented`, `Under Maintenance`, `Impounded`, `Offline`.
  - Vehicle specifications management: Make, Model (e.g., Evegah City, Evegah Cargo), Motor Wattage, Max Speed limit, Battery chemistry (LFP/NMC).
  - Total operational odometer reading (synced continuously from IoT GPS tracker).
- **Remote Commands**:
  - Super Admin remote ignition disable (`Immobilize Vehicle`) in case of non-payment or geofence breach.
  - Remote horn/light chirp for locating lost or impounded vehicles.
  - Over-The-Air (OTA) firmware upgrade trigger for vehicle IoT modules.

### 3.4 Zone Geofencing & Dynamic Pricing Models (`/zones`)
- **Interactive Geofence Editor**:
  - Leaflet / Mapbox interactive polygon drawing tool to define zone perimeters (e.g., Gotri, Manjalpur, Akota).
  - Define Hub Locations (charging/swapping stations) within zones with GPS coordinates and parking capacity.
  - Maximum speed caps and restricted "No-Ride" or "Red Zones" with automated vehicle throttling alerts.
- **Dynamic Pricing Engine**:
  - Configurable pricing matrices per zone and vehicle model:
    - **Hourly Rental**: Base unlock fee + per-minute or per-hour charge.
    - **Daily / Weekly Packages**: Flat day rates (e.g., ₹250/day) with daily kilometer allowances.
    - **Monthly Delivery Packages**: Subscription pricing for gig-workers (Zomato, Swiggy, Blinkit) with included battery swaps.
  - Security deposit configuration per vehicle tier (e.g., ₹1,500 for low-speed; ₹3,000 for high-speed).

### 3.5 Battery Inventory & Swap Hub Monitor (`/battery`, `/battery-swap`)
- **Live Battery Ledger**:
  - Unique Battery Serial Number (BSN), Chemistry, Capacity (kWh), Cycle Count, SOH (State of Health).
  - Current location: Inside Vehicle ID, In Charging Hub Slot ID, or In Transit.
- **Swap Analytics**:
  - Swaps executed per day per hub, average turnaround time, peak swapping hours.
  - Grid load management: Charging status of batteries in racks (0-80% fast-charge, 80-100% trickle balance).

### 3.6 Maintenance & Repair Work Orders (`/maintenance`)
- **Service Work Orders**:
  - Automated ticket generation based on odometer intervals (e.g., every 2,500 km) or battery degradation alerts.
  - Manual ticket creation for road breakdowns, tire punctures, brake failures, or chassis damage.
  - Technician assignment, job status (`Pending`, `In Progress`, `Awaiting Spares`, `Resolved`).
- **Spare Parts Inventory**:
  - Stock levels for brake pads, tires, controllers, throttle assemblies, headlights, and wiring harnesses.
  - Auto-deduction of inventory when a work order is closed.

### 3.7 IoT Device & Telematics Tracking (`/iot-devices`, `/ride-operations`)
- **Device Health Monitor**:
  - Tracking 4G GSM signal strength (CSQ), satellite lock count, internal backup battery voltage.
  - Heartbeat status: Online (ping within 30s), Stale (ping within 5 min), Dead/Offline.
- **Live Map Fleet Radar (`/ride-operations`)**:
  - Real-time live map showing all moving and stationary vehicles color-coded by operational status.
  - Breadcrumb historical trail player: Replay any trip with speed graph, heading, and battery drop curves.

### 3.8 Franchise Management (`/franchise`, `/franchise-users`)
- **Franchise Hierarchy**:
  - Multi-tenant partitioning allowing independent business partners to operate Evegah sub-fleets.
  - Franchise profile: Assigned vehicles, dedicated hubs, territory boundaries.
- **Revenue Sharing & Financial Split**:
  - Configurable commission models (e.g., 70% Franchisee / 30% Evegah Platform).
  - P&L ledger: Automated calculation of gross collections, charging electricity expenses, platform royalty fees, and net payout.

### 3.9 Financial Ledger, Invoicing & Refunds (`/payment`)
- **Transaction Audit Log**:
  - Real-time stream of all gateway payments (ICICI, Razorpay, PhonePe, PayU).
  - Reconciliation matching PG reference IDs with Evegah ride IDs and wallet top-ups.
- **Automated Tax Invoicing**:
  - GST-compliant invoice generation (CGST + SGST or IGST) with downloadable PDF format.
- **Deposit Refund Approvals**:
  - Two-stage approval workflow for security deposit refunds: Zone Manager request -> Super Admin approval -> Automated bank disbursement.

### 3.10 System Alerts & Broadcast Announcements (`/alerts`, `/announcements`)
- **System Alert Trigger Engine**:
  - Automated alarms for Geofence Breaches, Low Battery in Field, IoT Disconnection, Tamper / Tow Alerts.
- **Push & WhatsApp Broadcasts**:
  - Send targeted notifications to all riders in a specific zone or segment (e.g., "Monsoon safety tips", "Scheduled hub maintenance").

### 3.11 White-Label Settings & App Slider CMS (`/settings/white-label`, `/settings`)
- **Brand Identity Controls**:
  - Dynamic company logo, favicon, portal primary/secondary color schemes, brand typography, and terms/privacy links.
- **App Slider Management (HomeScreen & RentScreen)**:
  - Dual-layer slider authoring tool:
    - Layer 1: Background banner photography / gradient.
    - Layer 2: Transparent vehicle cutout or mascot PNG.
    - Title, Subtitle, Category Tag / Badge, and Call-to-Action (CTA) target deep-link.
  - Instant publishing via REST API with cache-invalidation to mobile clients.
  - Upload sanitizer preventing double extensions (e.g., `.png.png`) and automatic synchronization with production cloud storage.

---

## 4. Module 2: Rider Mobile Application (iOS & Android)

Built with **React Native and Expo**, the Rider Mobile App delivers a high-performance consumer experience with low latency, offline-tolerant Bluetooth device control, and animated UI transitions.

### 4.1 Onboarding, Authentication & KYC
- **Splash & Onboarding Carousel (`SplashScreen.js`, `OnboardingScreen.js`)**:
  - Visual walk-through highlighting zero-emission travel, instant battery swapping, and flexible subscription plans.
- **Mobile OTP Authentication (`LoginScreen.js`, `OtpScreen.js`)**:
  - Frictionless phone number entry with auto-read SMS OTP on Android and keyboard suggestion on iOS.
  - JWT session generation with refresh token rotation stored in encrypted device storage (`expo-secure-store`).
- **Digital KYC Engine (`KycScreen.js`)**:
  - In-app camera module with custom guideline overlays for capturing:
    1. Aadhaar Card (Front and Back) with OCR text extraction.
    2. Driving License with validity verification.
    3. Live Selfie with anti-spoofing detection.
  - Real-time application status tracker (`Pending Review`, `Verified`, `Action Required`).

### 4.2 Dynamic Home Screen & Discovery (`HomeScreen.js`, `RentScreen.js`)
- **Dynamic Multi-Layer Hero Slider**:
  - Multi-layer parallax carousel driven by Admin CMS.
  - Synchronous asset loading with high-resolution image caching (`expo-image`).
  - Active deep links routing riders directly to specific zone packages, promo offers, or vehicle categories.
- **Interactive Map & Hub Discovery (`LocationScreen.js`)**:
  - Real-time map powered by React Native Maps / Mapbox.
  - Clustered station markers displaying available vehicles, battery swap inventory count, and walking distance.
  - Turn-by-turn routing to the nearest Evegah hub.

### 4.3 Fleet Catalog & Rental Booking Flow
- **Vehicle Catalog & Zone Normalization (`VehicleListScreen.js`)**:
  - Browse scooters filtered by Zone (Gotri, Manjalpur, etc.) and model tier (Evegah City, Evegah Cargo).
  - Dynamic package selector: Hourly, Daily (₹250/day), Weekly, or Monthly.
  - Fallback package synthesizer ensuring smooth booking even during temporary pricing updates.
- **Vehicle Details & Story Modal (`VehicleDetailsScreen.js`)**:
  - Interactive 360-degree vehicle showcase with technical specs: Top speed (45 km/h), Range per swap (75 km), Motor power, Max load capacity.
  - Rental date and time selector with automated calculation of rental charges and security deposit.
  - Digital rental agreement review with rider sign-off.
- **Booking Confirmation (`BookingConfirmedScreen.js`)**:
  - Booking receipt with unique Booking Code, assigned hub address, pickup deadline countdown, and directions.

### 4.4 Vehicle Unlocking & Bluetooth Control
- **Dual Unlock Mechanism (`ScanScreen.js`, `UnlockingScreen.js`, `BluetoothScreen.js`)**:
  - **Method 1: Cloud IoT Unlock**: Rider scans vehicle QR code; mobile app dispatches unlock command to Node.js backend -> MQTT broker -> Vehicle IoT controller.
  - **Method 2: Offline Bluetooth Low Energy (BLE) Unlock**: Direct encrypted BLE handshake between phone and vehicle telematics box for underground parking garages or low-cellular areas.
- **Audio & Visual Feedback**:
  - Vehicle headlights flash and speaker chirps confirmation upon successful unlock.

### 4.5 Active Ride Telemetry & Dashboard (`RideScreen.js`)
- **Digital Instrument Cluster**:
  - Real-time speedometer (km/h) sourced from IoT CAN-bus.
  - Battery State of Charge (SoC %) with visual battery health gauge.
  - Estimated remaining distance range (km).
  - Current trip duration and accrued charges timer.
- **Vehicle Controls**:
  - **Lock / Unlock**: Pause rental while parking outside stores without ending the trip.
  - **Horn / Flash**: Locate vehicle in crowded parking lots.
  - **BMS Telemetry View (`BmsScreen.js`)**: Detailed view of battery health, temperature, and nearest swap stations.
  - **Emergency SOS (`HelpScreen.js`)**: Instant panic button alerting Evegah 24/7 command center with exact live GPS coordinates.

### 4.6 Trip Completion & Geofenced Return (`EndRideScreen.js`)
- **Return Station Validation**:
  - GPS geofencing checks to ensure vehicle is returned inside an authorized Evegah Hub.
  - If returned outside designated zones, app warns rider of penalty fees or blocks trip completion.
- **Return Checklist & Photo Proof**:
  - Rider captures a mandatory photograph of the parked scooter to prove safe return without physical damage.
- **Trip Summary & Rating**:
  - Distance traveled, trip duration, carbon offset (kg CO2 saved), itemized billing breakdown.

### 4.7 In-App Wallet, Payments & Loyalty
- **Multi-Gateway Payment Integration (`PayScreen.js`, `WalletScreen.js`, `TransactionScreen.js`)**:
  - Native checkout supporting ICICI Bank Direct UPI Intent, Razorpay, PhonePe, and PayU.
  - Evegah In-App Wallet: One-click fast checkout, auto-reload, and instant refund credit.
- **Offers, Referral & Gift Cards (`OffersScreen.js`, `ReferScreen.js`, `GiftCardScreen.js`, `RedeemGiftCardScreen.js`)**:
  - Referral code sharing: Earn rental credits for every referred friend who completes their first ride.
  - Gift card purchase, sharing, and instant redemption into wallet balance.
- **Ride History & Tax Invoices (`MyRidesScreen.js`, `RideDetailScreen.js`)**:
  - Historical log of all trips with interactive route replay map and downloadable PDF tax invoices.

---

## 5. Module 3: Employee & Technician App (Registration, Maintenance & BMS)

The Employee Mobile App (`evegah-bms`), built with **Flutter**, is an on-ground field operations tool serving three distinct staff profiles: **Booking Agents**, **Field Technicians**, and **Battery Hub Managers**.

```
                           +-------------------------------------------------------+
                           |           Evegah Employee & Operations App            |
                           |                   (Flutter Engine)                    |
                           +---------------------------+---------------------------+
                                                       |
        +----------------------------------------------+----------------------------------------------+
        |                                              |                                              |
+-------v----------------------+             +---------v--------------------+              +----------v-------------------+
|  1. Field Registration & KYC |             |  2. Maintenance & Inspection |              |  3. Smart BMS & Battery Swap |
+------------------------------+             +------------------------------+              +------------------------------+
| * Walk-in Rider Onboarding   |             | * 12-Point Return Inspection |              | * BLE Cell-Level Diagnostics |
| * Fast Camera Document Capture|            | * Damage Photo Logging       |              | * Depleted-to-Fresh Swap Flow|
| * Plan & Security Deposit    |             | * Breakdown Work Orders      |              | * Charging Rack Slot Monitor |
| * Vehicle & Battery Pairing  |             | * Spare Parts Inventory Deduct|             | * Offline Telemetry Cache    |
+------------------------------+             +------------------------------+              +------------------------------+
```

### 5.1 Field Registration & Walk-In Onboarding Module
Designed for station booking agents to onboard riders who visit hubs in person without prior app reservation.

- **Fast Rider KYC Onboarding (`new_ride_rider_details_screen.dart`)**:
  - Capture rider full name, phone number, alternate emergency contact, and permanent address.
  - High-speed camera capture with auto-cropping: Aadhaar front/back, Driving License, and live customer portrait.
  - Immediate duplicate check against backend blacklist and active ledger.
- **Plan Selection & Pricing Configurator (`new_ride_plan_pricing_screen.dart`)**:
  - Select vehicle category and rental plan (Daily, Weekly, Monthly Gig Delivery Package).
  - Apply station agent promotional codes or seasonal discounts.
- **Vehicle & Battery Assignment (`new_ride_vehicle_details_screen.dart`)**:
  - Station agent scans vehicle QR code / barcode using camera scanner.
  - Agent scans Battery Serial Number (BSN) QR code.
  - System executes atomic database binding linking Rider + Vehicle + Battery in the master ledger.
- **Payment Collection & Deposit Management (`new_ride_payment_screen.dart`)**:
  - Accept Cash payment at hub (logs agent cash-in-hand liability ledger).
  - Generate dynamic UPI QR on employee phone screen for customer to scan and pay via GooglePay/PhonePe/Paytm.
  - Security deposit ledger entry recorded with refundable flag.
- **Rental Agreement & Digital Signature (`new_ride_review_screen.dart`)**:
  - Complete contract summary displayed on screen.
  - Customer provides digital signature on device screen.
  - System dispatches automated WhatsApp message to rider containing signed PDF agreement and vehicle unlock instructions.

### 5.2 Rider Retention & Renewal Module
Handles walk-in or phone renewals for ongoing riders wanting to extend their vehicle usage.

- **Rider Lookup (`retain_rider_search_screen.dart`)**:
  - Search rider by phone number, vehicle plate number, or chassis number.
  - View current contract status, expiry date, accrued penalties, and payment history.
- **Vehicle & Battery Condition Check (`retain_rider_vehicle_battery_screen.dart`, `retain_rider_pre_inspection_screen.dart`)**:
  - Physical inspection of scooter condition prior to authorizing extension.
  - Check odometer reading and compare with IoT reported distance.
- **Renewal Extension & Payment (`retain_rider_plan_screen.dart`, `retain_rider_payment_screen.dart`, `retain_rider_review_screen.dart`)**:
  - Select extension duration (e.g., additional 30 days).
  - Collect renewal payment via Cash or UPI QR.
  - Extend contract end date in database and update IoT auto-lock schedulers.

### 5.3 Return Inspection & Settlement Module
Processes vehicle return when a rider surrenders a vehicle at the conclusion of their contract.

- **Return Vehicle Lookup (`return_ride_search_screen.dart`)**:
  - Agent scans vehicle QR code to pull up the active rental contract and initial checkout inspection photos.
- **12-Point Physical Inspection (`return_ride_inspection_screen.dart`)**:
  - Interactive multi-point inspection checklist:
    1. Front & rear tire tread wear and pressure.
    2. Front disc / rear drum brake functionality.
    3. Headlight, taillight, indicators, and horn operation.
    4. Throttle response and smooth motor drive.
    5. Handlebar alignment and front fork suspension.
    6. Body fairings, paint scratches, mirror integrity.
    7. Under-seat storage lock and charging port flap.
    8. Battery casing inspection (zero dents or swelling).
- **Damage Documentation & Penalty Assessment**:
  - Mandatory photo capture for any identified damage.
  - Preset standardized damage penalty calculator (e.g., broken mirror = ₹350; scratched panel = ₹700).
- **Final Settlement & Deposit Refund (`return_ride_settlement_screen.dart`, `return_ride_review_screen.dart`)**:
  - Automated reconciliation ledger:
    $$\text{Refund Amount} = \text{Security Deposit} - (\text{Late Return Penalty} + \text{Damage Penalty} + \text{Unpaid Tolls})$$
  - Cash payout receipt or trigger instant bank UPI refund via ICICI Payout API.
  - Vehicle status automatically transitions to `Under Inspection` or `Available`.

### 5.4 Battery Management System (BMS) & Smart Swapping Module
The core operational innovation of the Evegah platform, giving field operators deep hardware diagnostics into lithium-ion battery packs.

- **Bluetooth Low Energy (BLE) Scanner & Protocol Decoder (`ble_decoder.dart`, `bluetooth_scan_dialog.dart`)**:
  - Mobile device connects directly to battery smart BMS via Bluetooth 5.0.
  - Proprietary binary protocol parser decodes byte streams in real time.
- **Live Battery Telemetry Dashboard (`battery_live_tab.dart`, `battery_monitoring_tab.dart`, `battery_management_screen.dart`)**:
  - **Pack Voltages**: Total pack voltage (e.g., 67.2V for 60V nominal LFP pack).
  - **Cell-by-Cell Voltage Balance**: Live bar-graph visualization of all 16 to 20 individual series cells (e.g., Cell 1: 3.32V, Cell 2: 3.31V... Cell 16: 3.32V). Flags cell imbalance if differential exceeds 30mV.
  - **Thermal Monitoring**: Temperature sensors (T1, T2, MOS switch temp, ambient temp) with high-temperature cut-off indicators (>55°C).
  - **Current & Load**: Instantaneous charging/discharging current (Amperes) and power output (Watts).
  - **Health Metrics**: Total lifetime charge cycles completed, calculated State of Health (SOH %), and actual available ampere-hour capacity vs. design capacity.
- **Guided 4-Step Battery Swap Workflow**:
  ```
  +--------------------+      +--------------------+      +--------------------+      +--------------------+
  | 1. Scan Depleted   | ---> | 2. Scan Fresh      | ---> | 3. Verify Payment  | ---> | 4. Confirm &       |
  | Battery on Vehicle |      | Battery from Rack  |      | / Swap Fee         |      | Hand Over to Rider |
  +--------------------+      +--------------------+      +--------------------+      +--------------------+
  ```
  1. **Step 1 - Scan Depleted Battery (`battery_swap_search_screen.dart`)**: Agent scans QR of battery removed from vehicle. App records drop-off SoC (e.g., 12%) and checks for fault codes.
  2. **Step 2 - Scan Fresh Battery (`battery_swap_pairing_screen.dart`)**: Agent scans QR of fully charged battery from charging rack. App verifies SoC is above 95% and cell balance is healthy.
  3. **Step 3 - Fee Calculation & Payment (`battery_swap_payment_screen.dart`)**: If rider has a subscription with unlimited swaps, fee is ₹0. Otherwise, app calculates swap fee and collects via Cash or UPI.
  4. **Step 4 - Atomic Confirmation (`battery_swap_confirm_screen.dart`)**: System updates database, assigns new battery to vehicle, sets depleted battery status to `Charging`, and dispatches SMS confirmation to rider.
- **Offline Telemetry Queue**:
  - If technician operates in an underground parking hub with zero cellular connectivity, all BMS telemetry logs and swap records are cached locally in SQLite and automatically synchronized once internet access is restored.

### 5.5 Fleet Maintenance & Field Ticketing
- **Preventative & Corrective Work Orders**:
  - Log scheduled periodic maintenance (brake fluid check, motor bearing greasing).
  - Report unexpected roadside breakdown and dispatch mobile rescue technician with spare battery/scooter.
- **Spare Part Consumption Tracking**:
  - Scan barcode of replacement brake pads, tires, or controllers to log installation against specific vehicle chassis.

### 5.6 Staff Operations & Hub Attendance
- **Geofenced Staff Attendance**:
  - Clock-in and clock-out with GPS geofence verification ensuring staff is physically located at their assigned hub.
  - Facial recognition selfie check to eliminate buddy punching.
- **End-of-Shift Hub Inventory Audit**:
  - Reconcile physical inventory at shift handover: Total scooters parked, total fully charged batteries, total batteries in charging rack, and total cash collected.

---

## 6. Hardware, IoT & Bluetooth Low Energy (BLE) Integration

### 6.1 IoT Telematics Box Specifications
- **Connectivity**: 4G LTE Cat-1 with 2G GSM fallback; integrated eSIM with roaming network support.
- **Positioning**: Multi-GNSS engine (GPS, GLONASS, BeiDou) with assisted GPS (A-GPS) for sub-2.5m accuracy.
- **Vehicle Bus Interface**: CAN 2.0B / RS485 communication with motor controller and electronic instrument cluster.
- **Internal Backup Battery**: 450mAh Li-ion battery providing up to 72 hours of heartbeat tracking if main vehicle battery is disconnected.
- **Sensors**: 6-axis accelerometer and gyroscope for tilt detection, crash notification, and unauthorized towing alerts.

### 6.2 Communication Protocols & Telemetry Frequency
- **Moving State**: Telemetry packet sent every 10 seconds (Latitude, Longitude, Speed, Heading, Odometer, SoC, Motor RPM).
- **Parked / Idle State**: Heartbeat packet sent every 300 seconds to conserve battery.
- **Emergency Trigger**: Instantaneous packet transmission upon Tamper, Crash, or Geofence Breach.

### 6.3 Bluetooth Low Energy (BLE) Custom Handshake
- **BLE Service UUID**: Proprietary 128-bit custom service for Evegah smart hardware.
- **Security Authentication**: AES-128 dynamic challenge-response encryption; rolling session keys generated by backend prevent replay attacks.
- **Commands Supported**: Unlock Ignition, Lock Ignition, Pop Seat Catch, Query BMS Status.

---

## 7. Database Schema & Core Entities

The platform utilizes **PostgreSQL 16** with indexed relational tables ensuring data integrity and query performance.

```
                          +-------------------+
                          |      zones        |
                          +---------+---------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
+---------v---------+                               +---------v---------+
|     vehicles      |                               |  pricing_plans    |
+---------+---------+                               +---------+---------+
          |                                                   |
          +-------------------------+-------------------------+
                                    |
+---------+---------+     +---------v---------+     +---------+---------+
|      users        +---->|     rentals       |<----+   batteries       |
| (Riders/Employees)|     +---------+---------+     +---------+---------+
+-------------------+               |
                                    |
                          +---------v---------+
                          |   transactions    |
                          +-------------------+
```

### 7.1 Primary Database Tables
1. **`users`**: User ID, Phone, Email, Password Hash, Role (`super_admin`, `zone_manager`, `technician`, `rider`), KYC Status (`pending`, `verified`, `rejected`), Profile Data.
2. **`zones`**: Zone ID, Name, Boundary Polygon (GeoJSON), Active Status, City, Assigned Manager ID.
3. **`vehicles`**: Vehicle ID, Plate Number, Chassis Number, IoT IMEI, Model Name, Zone ID, Status (`available`, `rented`, `maintenance`, `impounded`), Current Odometer, Battery SoC.
4. **`batteries`**: Battery ID, Serial Number, Chemistry, Capacity kWh, Current Voltage, SOH %, Cycle Count, Assigned Vehicle ID, Hub Slot ID, Status (`in_vehicle`, `charging`, `ready`, `maintenance`).
5. **`rentals`**: Rental ID, Rider ID, Vehicle ID, Initial Battery ID, Start Time, Expected End Time, Actual Return Time, Rental Type (`hourly`, `daily`, `monthly`), Zone ID, Total Amount, Security Deposit, Status (`active`, `completed`, `overdue`, `cancelled`).
6. **`battery_swaps`**: Swap ID, Rental ID, Technician ID, Depleted Battery ID, Depleted SoC, Fresh Battery ID, Fresh SoC, Timestamp, Hub ID, Fee Charged.
7. **`vehicle_inspections`**: Inspection ID, Vehicle ID, Inspector ID, Type (`checkout`, `checkin`, `routine`), 12-Point Checklist JSON, Damage Photos Array, Penalty Calculated.
8. **`transactions`**: Transaction ID, Rental ID, User ID, Amount, Gateway (`icici`, `razorpay`, `phonepe`, `payu`, `cash`), Gateway Ref ID, Type (`rental_fee`, `deposit`, `swap_fee`, `refund`), Status (`success`, `failed`, `pending`).
9. **`app_sliders`**: Slide ID, Section (`home_screen`, `rent_screen`), Title, Subtitle, Tag Badge, Background Image URL, Cutout Image URL, CTA Deep Link, Display Order, Is Active.

---

## 8. API Architecture & Service Contracts

The REST API operates on Node.js/Express with standardized JSON responses and Bearer JWT authentication headers.

### 8.1 API Grouping & Endpoints

| Resource Group | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/send-otp` | Request SMS OTP for login |
| | `POST` | `/api/auth/verify-otp` | Verify OTP and return JWT access token |
| **KYC** | `POST` | `/api/kyc/upload` | Upload KYC documents (Aadhaar, DL, Selfie) |
| | `PUT` | `/api/kyc/review/:id` | Admin approve or reject KYC submission |
| **Renters** | `GET` | `/api/renters` | Master renter ledger with zone & model filters |
| | `POST` | `/api/renters/new` | Field agent new walk-in rider creation |
| | `POST` | `/api/renters/renew` | Retain/Renew existing rider contract |
| | `POST` | `/api/renters/return` | Check-in vehicle return, inspect & settle |
| **Vehicles** | `GET` | `/api/vehicles` | List vehicles filtered by status and zone |
| | `POST` | `/api/vehicles/:id/command` | Dispatch remote command (lock, unlock, immobilize) |
| **Zones** | `GET` | `/api/zones` | Retrieve all zones with geofences and pricing models |
| | `POST` | `/api/zones` | Create or update zone boundary polygon and rates |
| **BMS & Swaps** | `POST` | `/api/bms/telemetry` | Ingest live cell-level battery telemetry packet |
| | `POST` | `/api/bms/swap` | Execute atomic battery swap workflow |
| **Payments** | `POST` | `/api/payments/create-order` | Initialize PG transaction (ICICI/Razorpay) |
| | `POST` | `/api/payments/webhook` | Process payment status notifications |
| | `POST` | `/api/payments/refund` | Trigger instant security deposit payout |
| **Settings & CMS**| `GET` | `/api/settings/app-sliders` | Fetch published mobile hero sliders |
| | `POST` | `/api/settings/app-sliders` | Admin create, update, reorder slider banners |
| | `POST` | `/api/settings/upload-asset` | Upload and sanitize CMS assets |

---

## 9. Payment Gateways & Financial Settlement Engine

### 9.1 Multi-Gateway Redundancy
The platform incorporates smart routing across multiple payment processors:
- **Primary UPI Provider**: ICICI Bank Direct UPI Intent / Dynamic QR API for lowest transaction fees.
- **Secondary Card & NetBanking**: Razorpay and PayU for credit cards, debit cards, and net-banking.
- **Alternate UPI Fallback**: PhonePe PG integration automatically engaged if primary gateway latency exceeds 2,500ms.

### 9.2 Security Deposit Holding & Instant Refund Workflow
1. Rider deposits security amount (e.g., ₹2,500) during checkout.
2. Funds are credited to Evegah Escrow Pool account; marked as `HELD` in the internal ledger.
3. Upon return inspection, if zero damage and zero overdue fines exist, system invokes ICICI Payout API via IMPS/UPI for instant refund within 60 seconds.

---

## 10. Security, Geofencing & Compliance

### 10.1 Access Control Matrix (RBAC)

| Feature / Module | Super Admin | Zone Manager | Booking Agent | Technician | Rider |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Executive Dashboard & P&L** | Full Access | View Only | No Access | No Access | No Access |
| **Approve / Reject KYC** | Full Access | Full Access | No Access | No Access | No Access |
| **Field Walk-in Onboarding** | Full Access | Full Access | Full Access | No Access | No Access |
| **Vehicle Immobilization** | Full Access | Full Access | No Access | Emergency Only | No Access |
| **Return Inspection & Settlement**| Full Access | Full Access | Full Access | Full Access | No Access |
| **BMS Bluetooth Diagnostics** | Full Access | Full Access | No Access | Full Access | Read Only |
| **Execute Battery Swap** | Full Access | Full Access | Full Access | Full Access | No Access |
| **White-Label CMS & Sliders** | Full Access | No Access | No Access | No Access | No Access |
| **Unlock Rented Scooter** | Remote Only | Remote Only | Station Only | Test Mode | Active Ride Only |

### 10.2 Geofence Enforcement & Anti-Theft
- Vehicles crossing zone boundaries trigger automated warning notifications to the rider.
- If vehicle moves more than 2 km beyond authorized boundary without authorization:
  1. System sounds audible siren on vehicle.
  2. Motor speed is progressively capped to 15 km/h, then disabled once the vehicle comes to a complete halt.
  3. Geofence violation event logged on Admin radar screen with automated dispatch to field recovery team.

---

## 11. Project Phases, Milestones & Acceptance Criteria

### Milestone Roadmap

```
+-------------------------------------------------------------------------------------------------------+
| Phase 1: Core Foundation & APIs                                                                       |
| [Database Schema, Node.js REST Endpoints, Multi-Tenant Auth, Redis Cache]                             |
+---------------------------------------------------+---------------------------------------------------+
                                                    |
+---------------------------------------------------v---------------------------------------------------+
| Phase 2: Super Admin & Operations Portal                                                              |
| [Next.js Dashboard, Renters Ledger, Zone Geofences, Pricing Config, White-Label CMS]                   |
+---------------------------------------------------+---------------------------------------------------+
                                                    |
+---------------------------------------------------v---------------------------------------------------+
| Phase 3: Rider Mobile Application                                                                     |
| [React Native / Expo App, OTP Auth, KYC, Dynamic Sliders, Map Discovery, QR/BLE Unlock, Checkout]      |
+---------------------------------------------------+---------------------------------------------------+
                                                    |
+---------------------------------------------------v---------------------------------------------------+
| Phase 4: Employee & BMS Operations App                                                                |
| [Flutter BMS App, Walk-in Onboarding, 12-Pt Return Inspection, BLE Battery Telemetry, Swap Flow]     |
+---------------------------------------------------+---------------------------------------------------+
                                                    |
+---------------------------------------------------v---------------------------------------------------+
| Phase 5: Hardware Integration, Field Testing & Launch                                                 |
| [IoT CAN-bus Calibration, ICICI Payout Testing, Pilot Run, Security Audit & Production Deployment]    |
+-------------------------------------------------------------------------------------------------------+
```

### Team Deliverables & Acceptance Criteria

| Workstream | Team Deliverables | Acceptance Criteria |
| :--- | :--- | :--- |
| **Backend & Database** | Node.js REST API, PostgreSQL migrations, Redis session cache, IoT ingestion engine | <100ms API response time, zero data loss under simulated 10,000 concurrent socket connections. |
| **Admin Dashboard** | Next.js 14 Web Portal, KYC approval queue, live radar map, CMS slider editor | Zero console errors, responsive desktop/tablet UI, real-time sync with mobile app sliders. |
| **Rider Mobile App** | React Native Expo application (Android APK & iOS TestFlight build) | Instant OTP login, smooth 60fps parallax slider rendering, reliable QR and BLE vehicle unlock. |
| **Employee App** | Flutter mobile application for technicians and booking agents | Real-time BLE cell voltage readouts, complete 4-step battery swap workflow in <90 seconds. |
| **Hardware & IoT** | IoT CAN-bus firmware integration, BLE encryption protocol | Accurate GPS positioning, remote immobilize command executed within 3 seconds of admin click. |
| **Fintech & Billing** | ICICI Bank, Razorpay, PhonePe, PayU integrations, GST invoices | 100% automated payment-to-ledger reconciliation, instant deposit refund processing within 60s. |

---

*End of Evegah EV Mobility Platform Scope of Work (SOW) Specification.*
