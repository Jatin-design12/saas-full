import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'battery_swap_search_screen.dart';
import 'battery_swap_payment_screen.dart';

class BatterySwapPairingScreen extends StatefulWidget {
  final Map<String, dynamic> selectedItem;

  const BatterySwapPairingScreen({
    super.key,
    required this.selectedItem,
  });

  @override
  State<BatterySwapPairingScreen> createState() => _BatterySwapPairingScreenState();
}

class _BatterySwapPairingScreenState extends State<BatterySwapPairingScreen> {
  int _selectedNewBatteryIndex = 0;
  bool _unlatchedOldBattery = true;
  bool _latchedNewBattery = true;

  final List<Map<String, dynamic>> _newChargedBatteries = [
    {
      "serial": "BAT-72V-4102",
      "soc": "100%",
      "voltage": "75.2 V",
      "health": "100% SOH",
      "temp": "27°C",
      "status": "Ready for Dispatch",
    },
    {
      "serial": "BAT-72V-8831",
      "soc": "98%",
      "voltage": "74.8 V",
      "health": "98% SOH",
      "temp": "28°C",
      "status": "Ready for Dispatch",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final newBat = _newChargedBatteries[_selectedNewBatteryIndex];

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
          "Unpair & Pair Battery",
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
            const CustomSwapStepper(currentStep: 2),
            const SizedBox(height: 14),

            // 2. DEPLETED OLD BATTERY UNPAIR CARD
            const Text(
              "1. Remove Depleted Battery",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 8),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(
                          color: Color(0xFFFEF2F2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.battery_0_bar_rounded, color: Color(0xFFEF4444), size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Old Battery: ${widget.selectedItem['currentBatSn']}",
                              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Charge: ${widget.selectedItem['currentSoc']} • Temp: 34°C",
                              style: const TextStyle(fontSize: 10.5, color: Color(0xFFEF4444), fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                      Checkbox(
                        value: _unlatchedOldBattery,
                        onChanged: (val) => setState(() => _unlatchedOldBattery = val ?? true),
                        activeColor: EmployeeTheme.primaryPurple,
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  const Text("✓ Unlocked via BMS BLE & removed from scooter bay", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 3. SELECT NEW CHARGED BATTERY
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "2. Select & Pair New Fully Charged Battery",
                  style: TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("BLE QR Scan new battery serial...")),
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
              itemCount: _newChargedBatteries.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = _newChargedBatteries[index];
                final isSelected = index == _selectedNewBatteryIndex;

                return InkWell(
                  onTap: () {
                    setState(() => _selectedNewBatteryIndex = index);
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
                                "New Bat SN: ${item['serial']}",
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
                                "SOC: ${item['soc']}",
                                style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            Text("Voltage: ${item['voltage']}", style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary)),
                            Text("Health: ${item['health']}", style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary)),
                            Text("Temp: ${item['temp']}", style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 18),

            // 4. LATCH LOCK VERIFICATION CHECKBOX
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: CheckboxListTile(
                value: _latchedNewBattery,
                onChanged: (val) => setState(() => _latchedNewBattery = val ?? true),
                activeColor: EmployeeTheme.primaryPurple,
                contentPadding: EdgeInsets.zero,
                title: const Text("New Battery Latched & Sealed in Scooter Bay", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                subtitle: const Text("Verified smart latch lock is securely engaged and BMS signal communicating", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
              ),
            ),
            const SizedBox(height: 24),

            // 5. CONTINUE TO SWAP PAYMENT BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => BatterySwapPaymentScreen(
                        selectedItem: widget.selectedItem,
                        newBattery: newBat,
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
                      "Continue to Swap Fee Payment",
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
}
