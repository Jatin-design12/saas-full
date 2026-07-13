# Project Scope of Work
## Evegah — EV Rental & Battery Swapping Platform
**Prepared by:** NetSec InfoTech
**Project Version:** 1.0
**Date:** June 2026

---

## 1. Project Overview

Evegah is a full-stack, multi-platform electric vehicle (EV) rental and battery swapping ecosystem. The project covers the development of three interconnected applications:

| Application | Platform | Users |
|---|---|---|
| **Admin & Franchise Web Dashboard** | Web (Desktop Browser) | Admins, Franchise Managers, Customer Support |
| **Rider Mobile App** | Android & iOS | End Customers / Riders |
| **BMS / Employee Operations App** | Android & iOS | Field Technicians, Swap Agents, Maintenance Staff |

All three applications are connected to a shared cloud backend and database, ensuring real-time synchronization of data across every platform.

---

## 2. Module 1 — Admin & Franchise Web Dashboard

The web-based control panel is the nerve center of the entire operation. It gives administrators, franchise managers, and support staff complete visibility and control over all aspects of the business.

---

### 2.1 Main Dashboard (Home)

The first screen visible upon login. Provides a real-time snapshot of the entire business.

- **Business Metrics Cards** — Displays total active rentals, total revenue collected, total pending KYC requests, and battery health overview, each with trend indicators (up/down vs. previous period).
- **Today's Summary Panel** — A quick glance at daily figures: number of new riders onboarded, batteries swapped, ride returns processed, and total collections for the day.
- **Recent Requests Table** — A live-updating table listing the most recent incoming requests (New Rider, Retain Rider, Return Ride, Battery Swap, Reservation). Shows request ID, type, assigned employee, status badge, and action buttons.
- **Request Status Donut Chart** — Visual breakdown of all requests by their current status: Completed, In Progress, and Pending.
- **Quick Action Cards** — One-click shortcuts to launch the five main operational workflows: New Rider, Retain Rider, Return Ride, Battery Swap, and Reservation.
- **Knowledge Resources Panel** — Links to internal standard operating procedures (SOPs), training guides, and support documents for staff reference.

---

### 2.2 Rider Management — New Rider Onboarding

A structured, step-by-step workflow to onboard a brand-new customer into the system.

**Step 1 — Rider Information**
- Capture rider's full name, mobile number, address, and emergency contact.
- System auto-generates a unique Rider ID.

**Step 2 — Document Upload & KYC**
- Upload scans/photos of Government-issued ID (Aadhaar, PAN, Passport).
- Upload Driving License (front and back).
- Staff can preview, zoom, and approve or reject each document individually.

**Step 3 — Rental Package Selection**
- Choose from available rental packages (Hourly, Daily, Weekly, Monthly).
- Auto-calculates the applicable rental fee and security deposit based on selected package.

**Step 4 — Payment Collection**
- Record payment details: amount collected, payment mode (Cash, UPI, Card, Bank Transfer).
- System generates a digital payment receipt.

**Step 5 — Vehicle & Battery Assignment**
- Browse available vehicles from inventory and assign one to the rider.
- Browse available charged batteries and assign one to the rider's vehicle.
- System locks the assigned vehicle and battery so they cannot be double-allocated.

**Step 6 — Review & Confirm**
- Full summary view of all entered information before final submission.
- On confirmation, the rider's status becomes "Active Ride" and they receive a push notification on the Rider App.

---

### 2.3 Rider Management — Retain Rider (Extension / Renewal)

Used when an existing rider wants to continue renting beyond their current package end date.

- Search and pull up an existing active rider by name, mobile, or Rider ID.
- View their current rental terms, battery status, and any outstanding dues.
- Select a new renewal package (Hourly, Daily, Weekly, Monthly).
- Upload any updated documents if required (e.g., renewed driving license).
- Collect the renewal payment and issue a fresh receipt.
- System automatically extends the rider's end date and updates all records.

---

### 2.4 Rider Management — Return Ride (Ride Closure)

A digital checklist for closing out a rental and processing the security deposit refund.

- Retrieve the rider's active rental record by scanning the vehicle QR or searching by Rider ID.
- **Vehicle Inspection Checklist** — Staff tick off the condition of each component: body panels, mirrors, headlights, brakes, tires, motor, charger port, and accessories.
- Attach photos of any damage found during inspection.
- Log the final odometer reading and battery State of Charge (SOC) at return.
- System calculates the refund amount: Security Deposit minus any applicable damage charges or late-return fees.
- Process refund and issue a digital closure receipt.
- Vehicle and battery are automatically freed back into available inventory.

---

### 2.5 Rider Management — Renters Ledger

A master list of all active and past rental contracts.

- **All Active Renters** — Searchable, filterable table showing every active ride, with rider name, vehicle ID, battery ID, package type, start date, end date, daily rate, deposit collected, and current status.
- **Renter Profile View** — Clicking any renter opens their full profile: personal details, document previews, full payment history, ride start/end logs, and notes.
- **Reserved Rides** — A separate tab listing all advance bookings made through the Rider App, with booking details, scheduled pickup/drop zones, fare, and deposit.
- Filter and search by name, status (Active / Completed / Overdue), date range, and zone.

---

### 2.6 Battery Management — Battery Inventory

A complete registry of every battery pack owned by the franchise.

- **Add New Battery** — Register a new battery with its serial number, make, model, capacity (Ah/kWh), purchase date, warranty expiry date, supplier name, purchase cost, and invoice number.
- **Battery List View** — Full searchable table displaying all batteries with their current status (Available, In Use, Charging, Under Maintenance, Faulty), current vehicle assignment, zone location, and health percentage.
- **Battery Detail Page** — Opens a deep-dive view for any individual battery showing:
  - Live telemetry: Voltage, Current, Temperature, State of Charge (SOC).
  - Battery health % and total charge cycles completed.
  - Cell-by-cell balance readings (per the smart BMS chip data).
  - Assigned rider name and vehicle number.
  - Full historical log of all swap events and telemetry readings.
  - GPS last-known location on a map.
  - Warranty status with expiry date and supplier contact.
  - Notes and maintenance history.

---

### 2.7 Battery Management — Battery Monitoring (Live Map)

A real-time map-based view of all battery pack locations and statuses.

- Displays all active battery packs as pins on a Google Map, color-coded by status (Green = Available, Orange = Low Charge, Red = Critical/Fault, Blue = In Use).
- Click any pin to view the battery's live SOC, temperature, voltage, and assigned rider.
- Filter by zone, status, or charge level range.
- Alerts panel listing all batteries flagged for attention (overheating, critically low charge, offline for extended period).

---

### 2.8 Battery Management — Battery Inward (Receiving)

Tracks the process of adding newly purchased battery packs into the operational inventory.

- Log a batch inward entry: supplier name, invoice number, quantity received, delivery date.
- Scan or enter individual battery serial numbers for each unit received.
- Assign initial status (New / Requires Inspection / Ready to Deploy).
- System creates individual records for each battery in the main inventory.

---

### 2.9 Battery Management — Swap History

A searchable log of every battery swap event ever performed.

- Shows date/time, agent who performed the swap, rider/vehicle involved, depleted battery ID, fresh battery ID, and swap location zone.
- Filter by date range, agent, zone, or battery ID.
- Export swap reports as CSV for accounting or compliance purposes.

---

### 2.10 Vehicle Management — All Vehicles

The master registry of every electric vehicle in the fleet.

- **Add Vehicle** — Register a new vehicle with its registration number, make, model, category (Hatchback / Sedan / SUV / Two-Wheeler), purchase date, chassis number, insurance expiry, and assigned zone.
- **Vehicle List View** — Searchable table of all vehicles with status (Available, Active Ride, Under Maintenance, Retired), assigned rider (if active), and zone.

---

### 2.11 Vehicle Management — Active Vehicles

A focused view of only the vehicles currently out on active rides.

- Shows vehicle number, rider name, rental start date, package type, and number of days remaining.
- Quick-access button to open the renter's full profile or initiate a return.

---

### 2.12 Vehicle Management — Vehicle Detail

Individual vehicle page showing its complete history and current state.

- Full vehicle specifications and registration details.
- Insurance and service due-date reminders.
- Full rental history: every rider who has rented this vehicle with dates, duration, and return condition.
- Current battery assignment.
- Maintenance and repair log.

---

### 2.13 Vehicle Management — Vehicle Map

Live map showing the GPS locations of all active vehicles.

- Color-coded pins for vehicle status.
- Click a pin to see rider name, battery SOC, and time elapsed on current ride.

---

### 2.14 Vehicle Management — Ride History

A complete log of every completed ride for the entire fleet.

- Filter by vehicle, rider, date range, or duration.
- Shows start and end odometer, duration, package used, and return condition.

---

### 2.15 Reservations Management

Manage advance bookings made through the Rider App.

- **Reservations Table** — Lists all reservations with status tabs: Upcoming, Completed, Cancelled.
- Each reservation entry shows: Reservation ID, customer name, mobile, package type, vehicle category, scheduled date & time, pickup zone, drop zone, fare, deposit, payment mode, and payment status.
- **Create Reservation** — Staff can also manually create a reservation on behalf of a walk-in or phone-in customer.
- **Reservation Detail** — Full booking view with document previews (uploaded ID card), inspection media, and action buttons (Confirm, Cancel, Mark Complete).
- Filter and search by date, status, zone, or customer name.
- Paginated list with configurable results per page.

---

### 2.16 Zone Management

Define and manage the geographical operating regions for the business.

- **Create Zone** — Draw polygonal boundaries on an interactive map to define a new operational zone. Assign a zone code, name, city, locality, type (Pickup / Drop / Both / Restricted), priority level, status (Active / Inactive), and maximum vehicle capacity.
- **Zone List View** — All defined zones in a table with status, type, vehicle count, and quick edit/delete actions.
- **Zone Detail** — View the full zone boundary on map, zone rules, operating hours, and any assigned pricing overrides.
- **Zone Pricing** — Set zone-specific pricing rules that override the default package rates for rides starting or ending in that zone.

---

### 2.17 Franchise Management

Manage franchise partners and their individual hub operations.

- **Franchise List** — Directory of all franchise owners with contact details, location, zone assignment, and operational status.
- **Franchise Detail Page** — Individual franchise profile showing: owner details, hub address, assigned vehicles count, assigned batteries count, revenue share terms, and contact logs.
- **Create Franchise** — Onboard a new franchise partner with their business details, hub location, and assigned operational zone.

---

### 2.18 Franchise — Expense Tracker

A ledger for tracking operating costs at each franchise hub.

- Log expenses by category (Maintenance, Electricity, Staff Salary, Hub Rent, Miscellaneous).
- Filter by franchise, category, date range.
- Summary totals for monthly and yearly expense reporting.

---

### 2.19 Franchise — Rental Packages

Manage the master list of available rental packages that riders can choose from.

- Create, edit, and deactivate rental packages.
- Define package name, duration, base price, deposit amount, included km/kWh allowance, and overages.
- Assign packages to specific zones or make them globally available.

---

### 2.20 Attendance Management

Track field staff and hub operator attendance.

- View daily attendance records: check-in time, check-out time, GPS location at check-in, and total hours worked.
- Filter by employee, date, or hub.
- Flag and review exceptions (early exits, late check-ins, location mismatches).

---

### 2.21 Announcements

Internal broadcast system for staff communication.

- **Announcements Board** — Lists all published internal announcements in a timeline view.
- **Create Announcement** — Compose and publish a new announcement with title, message body, target audience (All Staff / Specific Role), and priority level.

---

### 2.22 Reports & Analytics

A dedicated reporting module for business intelligence.

- Generate reports for: Revenue by Period, Active Rides, Battery Health Summary, Swap Count, Zone Performance, and Rider Retention Rate.
- Date range selectors (Daily, Weekly, Monthly, Custom).
- Charts and tabular data views.
- Download reports as CSV or PDF.

---

### 2.23 CO2 Savings Tracker

Highlights the environmental impact of Evegah's EV fleet.

- Displays total CO2 kilograms offset by the fleet over selected time periods.
- Breakdown by zone, vehicle category, and rider.
- Comparison charts showing monthly CO2 savings trends.

---

### 2.24 IoT Devices Management — Device Inward

Tracks incoming IoT hardware (smart locks, GPS trackers, BMS units) being added to the system.

- Log new device batches: device type, serial numbers, firmware version, supplier, and date received.
- Assign devices to specific vehicles or battery packs.
- Track device activation status and last-seen ping.

---

### 2.25 Payments — Transaction History

A complete log of all financial transactions processed through the platform.

- Shows transaction ID, rider name, amount, payment mode (Cash, UPI, Card), transaction type (Deposit, Rental, Top-Up, Refund), date, and status.
- Filter by date range, payment mode, transaction type, and amount range.
- Download full history as CSV for accounting.

---

### 2.26 Payments — Refund Management

Dedicated screen to initiate and track refund requests.

- View all pending refund requests with the reason and eligible refund amount.
- Approve or reject refunds with a comment.
- Approved refunds are logged and can be processed manually or via integrated payment gateway.
- Full refund history with status tracking (Pending, Approved, Processed, Rejected).

---

### 2.27 User & Role Management

Manage staff accounts and control system access.

- **User Directory** — List of all system users (admins, support staff, franchise managers, inspectors) with their roles, email, and last-login timestamp.
- **User Profile** — Individual staff member view with account details, assigned permissions, and activity log.
- **Add User** — Create new staff accounts with a name, email, assigned role, and zone.
- **Role Management** — Define custom roles with granular permission sets (e.g., can only view rentals, can approve KYC, can manage zones, full admin).

---

### 2.28 Platform Settings

Global configuration panel for system-wide parameters.

- **General Settings** — Business name, logo, default currency, timezone.
- **Rental Settings** — Default grace period (minutes) before late fees apply, minimum/maximum rental duration, overtime charge rates.
- **Battery Thresholds** — Set the minimum SOC % at which a battery triggers a "Low" alert, and the critical threshold % for emergency dispatch.
- **Notification Settings** — Configure which events trigger push notifications or SMS alerts.
- **Payment Gateway** — Manage connected Razorpay credentials and webhook configurations.
- **Tax & Fee Settings** — Configure applicable taxes (GST) and any fixed service fees.

---

## 3. Module 2 — Rider Mobile Application (Android & iOS)

The consumer-facing mobile app that allows riders to independently discover vehicles, book rides, make payments, and manage their entire rental lifecycle from their smartphone.

---

### 3.1 Authentication & Onboarding

- **Splash Screen & App Intro** — Animated brand splash screen on launch with an optional onboarding walkthrough for first-time users.
- **Login Screen** — Login via registered mobile number.
- **OTP Verification** — Receive and enter a one-time password via SMS to verify mobile number.
- **Create Profile** — New users fill in their full name, date of birth, email address, and profile photo after OTP verification.
- **KYC Document Upload** — Guided flow to upload Government ID and Driving License photos directly from camera or gallery.
- **Animated Success Screen** — After KYC submission, a branded animated screen confirms the submission and informs the rider that admin review is pending.

---

### 3.2 Home Dashboard

The main screen riders land on after login.

- **Active Ride Card** — If the rider has an active rental, a prominent card shows their assigned vehicle, current battery SOC%, rental end date, and a quick-access button to the vehicle controls.
- **Quick Action Buttons** — Tap to Find a Vehicle, Scan QR Code to unlock, or View Ride History.
- **Nearby Vehicles Teaser** — A mini map preview showing the closest available EVs to the rider's current location.
- **Wallet Balance Widget** — Shows current wallet balance with a quick "Top Up" button.
- **Recent Activity Feed** — A short list of the rider's most recent transactions and ride events.
- **Offers & Promotions Banner** — Rotating carousel showing active promotional offers or referral rewards.

---

### 3.3 Map Discovery Screen

A full-screen interactive map for locating vehicles and infrastructure.

- **Live Map with Vehicle Pins** — All available electric vehicles appear as custom pins on a Google Map centered on the rider's current GPS location.
- **Cluster View** — When zoomed out, nearby pins group into numbered clusters for clarity. Zooming in expands clusters into individual vehicle pins.
- **Vehicle Info Card** — Tapping a pin opens a bottom sheet card showing the vehicle's photo, model, battery charge %, distance from rider, and an "Unlock" button.
- **Swap Station Pins** — Separate pin type shows the locations of all nearby battery swap stations.
- **Zone Boundary Overlay** — Optional toggle to show operational zone boundaries on the map.
- **Search & Filter** — Search by location or filter vehicles by availability or category.
- **Navigation Button** — Opens turn-by-turn directions to the selected vehicle in Google Maps or Apple Maps.

---

### 3.4 Vehicle Details Screen

Full detail view for a selected vehicle before booking.

- Vehicle photo gallery (multiple images).
- Vehicle make, model, category, and license plate.
- Current battery SOC% with visual indicator.
- Estimated range remaining (in km).
- Available rental packages and their prices.
- Pickup zone and nearest swap station distance.
- "Book Now" / "Unlock Now" call-to-action button.

---

### 3.5 Date & Time Selection

Booking scheduler for advance reservations.

- Calendar date picker for selecting the ride start date.
- Time slot selector for choosing the pickup time.
- Package duration selector (Hourly / Daily / Weekly / Monthly).
- Real-time fare calculation preview showing base fare, deposit amount, and taxes before confirming.

---

### 3.6 QR Code Scanner — Vehicle Unlock

The primary method for riders to unlock their assigned vehicle.

- Opens the device camera in QR scanning mode.
- Rider points the camera at the QR code sticker on the vehicle's handlebar.
- System validates that the scanned vehicle matches the rider's active assignment.
- Triggers the remote unlock command via the IoT module.

---

### 3.7 Bluetooth Unlock Screen

An offline backup unlock method using proximity Bluetooth.

- Scans for nearby Evegah Bluetooth-enabled vehicles.
- Lists discovered devices by signal strength (closest first).
- Rider taps their assigned vehicle from the list to initiate a direct BLE connection.
- Sends the unlock command directly via Bluetooth, independent of internet connectivity.
- Also supports locking the vehicle and triggering the storage boot release via BLE.

---

### 3.8 Unlocking Screen

A feedback screen shown while the unlock command is processing.

- Animated lock-opening graphic while awaiting server or BLE confirmation.
- Shows current step (Connecting → Authenticating → Unlocking).
- Success confirmation with a subtle haptic buzz and sound effect.
- Error state with a clear retry or help option if the unlock fails.

---

### 3.9 Booking Confirmed Screen

The screen displayed immediately after a successful booking or unlock.

- Large success animation and "Ride Started!" confirmation message.
- Summary card: Vehicle ID, battery %, package selected, rental end time.
- Estimated battery range.
- Quick links: "View Ride Controls", "Find Swap Station", "Contact Support".

---

### 3.10 Active Ride Screen

Control panel displayed while a ride is in progress.

- Vehicle lock/unlock toggle.
- Current battery SOC % with live update indicator.
- Elapsed ride time and estimated remaining time on current package.
- "End Ride" button to initiate the return process.
- Emergency SOS button.

---

### 3.11 Ride History Screen

A log of all past rides taken by the rider.

- Chronological list of completed and cancelled rides.
- Each entry shows: vehicle model, ride dates, duration, package used, and total amount charged.
- Tap any ride to open the full ride detail.

---

### 3.12 Ride Detail Screen

Detailed breakdown of any individual completed ride.

- Ride summary: start/end date & time, duration, pickup and return location.
- Vehicle and battery assigned.
- Package used and pricing breakdown (base fare, taxes, any overages).
- Return condition noted by the franchise agent.
- Refund amount (if applicable) and refund status.
- Download/Share ride receipt as PDF.

---

### 3.13 Wallet Screen

The rider's in-app financial hub.

- **Wallet Balance** — Large, prominent display of available balance.
- **Transaction History** — Chronological list of all credits (top-ups, refunds) and debits (ride payments, deposits) with dates and descriptions.
- **Filter** — Filter transactions by type (All / Credit / Debit) and date range.

---

### 3.14 Payment Screen (Razorpay Integration)

Used whenever a monetary transaction is required (deposit, top-up, renewal).

- Displays the payment summary: what is being charged and why.
- Supported payment methods: UPI, Credit/Debit Card, Net Banking, Wallets.
- Secure Razorpay payment gateway handles all transactions.
- Real-time payment success/failure feedback.
- Successful payment automatically updates the rider's wallet and booking status.

---

### 3.15 Insights & Analytics Screen

The rider's personal performance and impact dashboard.

- **Total Rides** — Count of all rides completed.
- **Distance Traveled** — Cumulative kilometers ridden.
- **CO2 Saved** — Estimated kilograms of CO2 emissions avoided by riding electric vs. petrol.
- **Energy Consumed** — Total kWh used across all rides.
- **Average Speed** — Calculated average speed across rides.
- **Monthly Trends** — Bar chart showing ride frequency or distance per month.

---

### 3.16 Offers & Promotions Screen

A dedicated screen for viewing and redeeming promotional offers.

- Active offers listed as cards with title, description, validity date, and a "Claim" or "Copy Code" button.
- Referral program section: rider's unique referral code and number of successful referrals made.
- Applied discounts reflected automatically during the payment checkout.

---

### 3.17 Profile Screen

The rider's personal account management area.

- View and edit personal details: name, email, profile photo.
- View KYC status (Submitted / Approved / Rejected).
- Linked mobile number (with option to update via OTP re-verification).
- Account preferences: notification settings, language preference.
- Logout button.

---

### 3.18 Security Settings Screen

Account security and privacy controls.

- Enable/Disable biometric login (Fingerprint / Face ID).
- Change linked mobile number (requires OTP verification of old and new number).
- View active login sessions.
- Delete account request option.

---

### 3.19 Preferences Screen

Rider's app personalization settings.

- Preferred notification types (Ride alerts, Payment alerts, Offers, System updates).
- Language selection.
- Map style preference (Standard / Satellite).

---

### 3.20 Help & Support Screen

In-app support channels for riders needing assistance.

- **FAQ Section** — Expandable list of frequently asked questions organized by topic (Payments, Vehicles, KYC, Returns, Bluetooth).
- **Raise a Ticket** — Form to submit a support ticket with issue category, description, and optional image attachment.
- **Contact Us** — Direct phone and WhatsApp links to customer care.
- **Emergency SOS** — Prominent button that calls a dedicated emergency helpline number.

---

### 3.21 Notifications Screen

Centralized inbox for all in-app push notifications.

- Chronological list of all notifications received.
- Badge count indicator on app icon for unread notifications.
- Tap a notification to navigate to the relevant screen (e.g., "KYC Approved" → opens Booking screen).

---

## 4. Module 3 — BMS / Employee Operations App (Android & iOS)

A purpose-built tool for field agents, swap technicians, and hub managers. This app works in low-network conditions and syncs data automatically when connectivity is restored.

---

### 4.1 Login & Authentication

- Secure staff login using email and password credentials issued by the admin panel.
- Session is tied to the employee's role, restricting access only to permitted features.

---

### 4.2 Employee Dashboard (Home)

The main summary screen for field staff after login.

- **Today's Stats** — Swaps completed today, batteries charged, vehicles serviced, and shift hours logged.
- **Pending Tasks** — Actionable list of open tasks assigned to this employee.
- **Quick Action Tiles** — Shortcut buttons to the most common operations: Battery Scan, Swap, Diagnostics, Check Attendance.
- **Zone Status Overview** — A mini summary of the employee's assigned zone: total active rides, low-battery alerts, and maintenance-pending vehicles.

---

### 4.3 Rider Dashboard View

A focused rider-centric view available to support-facing staff.

- Look up an active rider by Rider ID or mobile number.
- View their active vehicle status, battery SOC, package end date, and payment history.

---

### 4.4 Battery Management Screen

The primary battery operations hub for field staff. Organized into four functional tabs:

**Tab 1 — Battery Home**
- Full list of all batteries the employee can see or manage, searchable by Battery ID.
- Color-coded status badges: Available (Green), In Use (Blue), Charging (Yellow), Faulty (Red).

**Tab 2 — Battery Scan (Swap Operations)**
- Guided step-by-step swap flow triggered by scanning QR codes.
- Scans depleted battery → validates details → scans fresh battery → confirms swap completion.
- Record is immediately saved and all platform data updates in real-time.

**Tab 3 — Battery Live (BLE Diagnostics)**
- Bluetooth scan to discover nearby smart batteries.
- Live telemetry streamed directly from the battery BMS chip: Pack Voltage, Current, Temperature, SOC%, Health%, Charge Cycles, and individual cell voltage grid.
- Fault codes and alert flags displayed with recommended actions.
- Log a fault report directly from the diagnostic view.

**Tab 4 — Battery Monitoring**
- Live-updating SOC graph tracking a battery's charge progression.
- Logs charging session duration and peak temperature.

---

### 4.5 Employee Management

Available to hub managers and supervisors only.

- **Employee List** — View all staff registered under this franchise/hub.
- **Employee Detail** — Individual staff profile with attendance summary, total swaps completed, and task history.
- **Create Employee** — Onboard new field staff with their details and assigned role.

---

### 4.6 Franchise Management

- **Franchise List** — Directory of all franchise hubs.
- **Franchise Detail** — Hub address, operating hours, assigned zone, fleet count, and battery count.
- **Create Franchise** — Register a new sub-franchise hub from within the app.

---

### 4.7 Zone Management

- **Zone List** — Lists all operational geofenced zones with status and vehicle capacity.
- **Zone Detail** — Map view of zone boundary, assigned vehicles and batteries, and active riders in zone.
- **Create Zone** — Field managers can create new zone boundaries directly from the app.

---

### 4.8 Attendance & Shift Management

- **Clock In** — GPS-verified clock-in confirming the employee is within the franchise hub's geo-boundary.
- **Clock Out** — Records clock-out time and total shift hours.
- **Attendance Log** — Employee can view their own attendance history with dates, shift durations, and location confirmations.

---

### 4.9 Offline Mode Support

- All swap records, diagnostic logs, and attendance entries entered offline are stored securely on the device.
- A clear "Offline" banner is displayed whenever internet is unavailable.
- All queued records sync automatically to the main database the moment connectivity is restored.
- Employees are notified with a count of records successfully uploaded.

---

## 5. Deliverables Summary

| # | Deliverable | Status |
|---|---|---|
| 1 | Admin & Franchise Web Dashboard (All 28 modules listed above) | Included |
| 2 | Rider Mobile Application for Android | Included |
| 3 | Rider Mobile Application for iOS | Included |
| 4 | BMS / Employee Operations App for Android | Included |
| 5 | BMS / Employee Operations App for iOS | Included |
| 6 | Backend Cloud Server & Database | Included |
| 7 | Razorpay Payment Gateway Integration | Included |
| 8 | Google Maps Integration (Web & Mobile) | Included |
| 9 | Bluetooth BLE Integration (Rider & Employee Apps) | Included |
| 10 | Push Notifications System | Included |
| 11 | QR Code Scan & IoT Vehicle Unlock | Included |
| 12 | Offline Sync Engine (Employee App) | Included |
| 13 | CO2 Savings Tracking Module | Included |
| 14 | Reports & Analytics Module | Included |
| 15 | Admin panel user roles & permissions system | Included |

---

*This document represents the agreed scope of development for the Evegah EV SaaS Platform. Any features, screens, or modules not listed above are considered out of scope for this project phase.*
