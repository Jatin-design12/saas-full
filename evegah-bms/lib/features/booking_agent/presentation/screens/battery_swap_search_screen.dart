import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'battery_swap_pairing_screen.dart';

class BatterySwapSearchScreen extends StatefulWidget {
  const BatterySwapSearchScreen({super.key});

  @override
  State<BatterySwapSearchScreen> createState() => _BatterySwapSearchScreenState();
}

class _BatterySwapSearchScreenState extends State<BatterySwapSearchScreen> {
  final TextEditingController _searchController = TextEditingController(text: "EV-12KA-1234");
  int _selectedVehicleIndex = 0;

  final List<Map<String, dynamic>> _swapEligibleVehicles = [
    {
      "vehicleName": "Evegah City 1S",
      "plate": "EV-12KA-1234",
      "riderName": "Rahul Sharma",
      "phone": "+91 98765 43210",
      "currentBatSn": "BAT-72V-9842",
      "currentSoc": "12%",
      "planType": "Daily Unlimited Swaps",
      "status": "Low Battery Alert",
    },
    {
      "vehicleName": "Evegah Fly",
      "plate": "EV-12KA-5678",
      "riderName": "Aman Verma",
      "phone": "+91 98123 45678",
      "currentBatSn": "BAT-72V-7104",
      "currentSoc": "18%",
      "planType": "Pay-Per-Swap (₹85/swap)",
      "status": "Swap Required",
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedItem = _swapEligibleVehicles[_selectedVehicleIndex];

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
          "Battery Swap & Payment",
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
            // 1. STEPPER PROGRESS BAR (Step 1 active)
            const CustomSwapStepper(currentStep: 1),
            const SizedBox(height: 14),

            // 2. SEARCH & QR SCAN BAR
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: EmployeeTheme.borderColor),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.search_rounded, color: EmployeeTheme.brandPurple, size: 22),
                        const SizedBox(width: 8),
                        Expanded(
                          child: TextField(
                            controller: _searchController,
                            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                            decoration: const InputDecoration(
                              hintText: "Enter Vehicle Plate or Battery SN...",
                              hintStyle: TextStyle(fontSize: 12, color: EmployeeTheme.textMuted, fontWeight: FontWeight.normal),
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Bluetooth BLE QR Scanner initialized...")),
                    );
                  },
                  icon: const Icon(Icons.qr_code_scanner_rounded, size: 16, color: Colors.white),
                  label: const Text("Scan QR", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: EmployeeTheme.primaryPurple,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                    elevation: 0,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // 3. VEHICLES REQUIRING SWAP LIST
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "EVs at Station Pending Swap",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: EmployeeTheme.lightPurple,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    "${_swapEligibleVehicles.length} Nearby",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _swapEligibleVehicles.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = _swapEligibleVehicles[index];
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
                          child: const Icon(Icons.battery_alert_rounded, color: EmployeeTheme.primaryPurple, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "${item['vehicleName']} (${item['plate']})",
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFEF2F2),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      "SOC: ${item['currentSoc']}",
                                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFFEF4444)),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Rider: ${item['riderName']} • ${item['planType']}",
                                style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Current Bat SN: ${item['currentBatSn']}",
                                style: const TextStyle(fontSize: 9.5, color: EmployeeTheme.textMuted),
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

            // 4. SELECTED VEHICLE SWAP SUMMARY
            const Text(
              "Current Depleted Battery Diagnostics",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Column(
                children: [
                  _buildDiagRow("Vehicle Registration", selectedItem['plate']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDiagRow("Battery Serial", selectedItem['currentBatSn']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDiagRow("Remaining Charge (SOC)", selectedItem['currentSoc'], isAlert: true),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDiagRow("Rider Package Plan", selectedItem['planType'], isHighlight: true),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 5. CONTINUE BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => BatterySwapPairingScreen(selectedItem: selectedItem),
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
                      "Continue to Battery Pairing",
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

  Widget _buildDiagRow(String label, String value, {bool isAlert = false, bool isHighlight = false}) {
    Color valColor = EmployeeTheme.textDark;
    if (isAlert) valColor = const Color(0xFFEF4444);
    if (isHighlight) valColor = EmployeeTheme.brandPurple;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(value, style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: valColor)),
      ],
    );
  }
}

// Stepper Progress Bar for Battery Swap Flow (4 Steps)
class CustomSwapStepper extends StatelessWidget {
  final int currentStep;

  const CustomSwapStepper({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    final steps = [
      'Scan Vehicle',
      'Swap Pairing',
      'Swap Payment',
      'Confirmation',
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        children: [
          Row(
            children: List.generate(steps.length * 2 - 1, (index) {
              if (index.isOdd) {
                final stepBefore = (index ~/ 2) + 1;
                final isCompletedLine = stepBefore < currentStep;
                return Expanded(
                  child: Container(
                    height: 2,
                    color: isCompletedLine ? EmployeeTheme.primaryPurple : const Color(0xFFE2E8F0),
                  ),
                );
              }

              final stepNumber = (index ~/ 2) + 1;
              final isCurrent = stepNumber == currentStep;
              final isPassed = stepNumber < currentStep;

              return Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isCurrent || isPassed ? EmployeeTheme.primaryPurple : Colors.white,
                  border: Border.all(
                    color: isCurrent || isPassed ? EmployeeTheme.primaryPurple : const Color(0xFFCBD5E1),
                    width: 1.5,
                  ),
                ),
                child: Center(
                  child: Text(
                    '$stepNumber',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isCurrent || isPassed ? Colors.white : const Color(0xFF64748B),
                    ),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(steps.length, (index) {
              final stepNumber = index + 1;
              final isCurrent = stepNumber == currentStep;

              return SizedBox(
                width: 76,
                child: Text(
                  steps[index],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                    color: isCurrent ? EmployeeTheme.primaryPurple : const Color(0xFF64748B),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
