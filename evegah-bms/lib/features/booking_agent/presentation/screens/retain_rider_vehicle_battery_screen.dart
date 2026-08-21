import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'retain_rider_search_screen.dart';
import 'retain_rider_plan_screen.dart';

class RetainRiderVehicleBatteryScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRider;

  const RetainRiderVehicleBatteryScreen({
    super.key,
    required this.selectedRider,
  });

  @override
  State<RetainRiderVehicleBatteryScreen> createState() => _RetainRiderVehicleBatteryScreenState();
}

class _RetainRiderVehicleBatteryScreenState extends State<RetainRiderVehicleBatteryScreen> {
  int _selectedVehicleIndex = 0;
  int _selectedBatteryIndex = 0;

  final List<Map<String, dynamic>> _vehicles = [
    {
      "name": "Evegah City 1S",
      "category": "E-Scooter",
      "plate": "EV-12KA-1234",
      "status": "Available",
      "odometer": "12,450 km",
    },
    {
      "name": "Evegah Fly",
      "category": "E-Scooter",
      "plate": "EV-12KA-5678",
      "status": "Available",
      "odometer": "8,920 km",
    },
  ];

  final List<Map<String, dynamic>> _batteries = [
    {
      "serial": "BAT-72V-9842",
      "soc": "98%",
      "health": "99% SOH",
      "temp": "28°C",
      "voltage": "74.2 V",
      "status": "Fully Charged & Balanced",
    },
    {
      "serial": "BAT-72V-7104",
      "soc": "95%",
      "health": "97% SOH",
      "temp": "29°C",
      "voltage": "73.8 V",
      "status": "Fully Charged",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final selectedVehicle = _vehicles[_selectedVehicleIndex];
    final selectedBattery = _batteries[_selectedBatteryIndex];

    return Scaffold(
      backgroundColor: EmployeeTheme.softBlueBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: EmployeeTheme.textDark, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Vehicle & Battery Pairing",
          style: TextStyle(
            color: EmployeeTheme.textDark,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. STEPPER PROGRESS BAR (Step 2 active)
            const CustomRetainStepper(currentStep: 2),
            const SizedBox(height: 14),

            // 2. SELECTED RIDER BAR
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: EmployeeTheme.lightPurple,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE0E7FF)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.person, color: EmployeeTheme.primaryPurple, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Retaining Rider: ${widget.selectedRider['name']}",
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                        ),
                        Text(
                          "Mobile: ${widget.selectedRider['phone']} • ID: ${widget.selectedRider['riderId']}",
                          style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 3. SELECT VEHICLE
            const Text(
              "Select EV Scooter",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _vehicles.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final vehicle = _vehicles[index];
                final isSelected = index == _selectedVehicleIndex;

                return InkWell(
                  onTap: () {
                    setState(() => _selectedVehicleIndex = index);
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isSelected ? EmployeeTheme.limeCardBg : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? EmployeeTheme.limeCardBorder : EmployeeTheme.borderColor,
                        width: isSelected ? 1.5 : 1.0,
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                          color: isSelected ? EmployeeTheme.successGreen : const Color(0xFFCBD5E1),
                          size: 20,
                        ),
                        const SizedBox(width: 12),
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isSelected ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                vehicle['name'],
                                style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Plate: ${vehicle['plate']} • Odometer: ${vehicle['odometer']}",
                                style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 18),

            // 4. SELECT & PAIR BATTERY PACK
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Pair Fully Charged Battery",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Bluetooth BLE Scanner scanning battery QR code...")),
                    );
                  },
                  icon: const Icon(Icons.qr_code_scanner_rounded, size: 14, color: Colors.white),
                  label: const Text("Scan QR", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: EmployeeTheme.brandPurple,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    minimumSize: Size.zero,
                    elevation: 0,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _batteries.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final bat = _batteries[index];
                final isSelected = index == _selectedBatteryIndex;

                return InkWell(
                  onTap: () {
                    setState(() => _selectedBatteryIndex = index);
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isSelected ? EmployeeTheme.limeCardBg : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? EmployeeTheme.limeCardBorder : EmployeeTheme.borderColor,
                        width: isSelected ? 1.5 : 1.0,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(
                              isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                              color: isSelected ? EmployeeTheme.successGreen : const Color(0xFFCBD5E1),
                              size: 20,
                            ),
                            const SizedBox(width: 10),
                            const Icon(Icons.battery_charging_full_rounded, color: EmployeeTheme.successGreen, size: 22),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                "Battery SN: ${bat['serial']}",
                                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: EmployeeTheme.successBg,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                "SOC: ${bat['soc']}",
                                style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Divider(height: 1, color: Color(0xFFF1F5F9)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            _buildBatteryMetric("Voltage", bat['voltage']),
                            _buildBatteryMetric("Health", bat['health']),
                            _buildBatteryMetric("Temp", bat['temp']),
                            _buildBatteryMetric("State", "BMS OK"),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // 5. CONTINUE TO RENTAL PLAN BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => RetainRiderPlanScreen(
                        selectedRider: widget.selectedRider,
                        selectedVehicle: selectedVehicle,
                        selectedBattery: selectedBattery,
                      ),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmployeeTheme.primaryPurple,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      "Continue to Rental Plan Selection",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      width: 24,
                      height: 24,
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.chevron_right_rounded,
                        color: EmployeeTheme.primaryPurple,
                        size: 18,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildBatteryMetric(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
        const SizedBox(height: 1),
        Text(label, style: const TextStyle(fontSize: 9, color: EmployeeTheme.textMuted)),
      ],
    );
  }
}
