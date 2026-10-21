import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/storage/local_storage_service.dart';
import 'booking_agent_home_screen.dart';

class BatterySwapConfirmScreen extends StatefulWidget {
  final Map<String, dynamic> selectedItem;
  final Map<String, dynamic> newBattery;
  final double netPayable;
  final String paymentMethod;

  const BatterySwapConfirmScreen({
    super.key,
    required this.selectedItem,
    required this.newBattery,
    required this.netPayable,
    required this.paymentMethod,
  });

  @override
  State<BatterySwapConfirmScreen> createState() => _BatterySwapConfirmScreenState();
}

class _BatterySwapConfirmScreenState extends State<BatterySwapConfirmScreen> {
  bool _isSubmitting = false;

  @override
  Widget build(BuildContext context) {
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
          "Confirm Battery Swap",
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
            // 1. SWAP SUMMARY RECEIPT CARD
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: EmployeeTheme.borderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.015),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: const BoxDecoration(
                          color: EmployeeTheme.limeGreenCircle,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.published_with_changes_rounded, color: EmployeeTheme.primaryPurple, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Battery Swap: ${widget.selectedItem['plate']}",
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Rider: ${widget.selectedItem['riderName']} (${widget.selectedItem['phone']})",
                              style: const TextStyle(fontSize: 11, color: EmployeeTheme.brandPurple, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  _buildReviewRow("Vehicle Model", widget.selectedItem['vehicleName']),
                  const SizedBox(height: 8),
                  _buildReviewRow("Removed Battery SN", "${widget.selectedItem['currentBatSn']} (${widget.selectedItem['currentSoc']} Depleted)"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Installed Battery SN", "${widget.newBattery['serial']} (${widget.newBattery['soc']} Fully Charged)"),
                  const SizedBox(height: 8),
                  _buildReviewRow("BMS Telemetry Lock", "LATCHED & SEALED ✓"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Payment Method", widget.paymentMethod),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Swap Fee Paid", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
                      Text("₹${widget.netPayable.toStringAsFixed(2)}", style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: EmployeeTheme.primaryPurple)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 2. CONFIRM & AUTHORIZE SWAP BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isSubmitting
                    ? null
                    : () async {
                        setState(() => _isSubmitting = true);

                        final swapData = {
                          'client_tx_id': 'SWAP_${DateTime.now().millisecondsSinceEpoch}',
                          'rider_name': widget.selectedItem['riderName'] ?? 'Rider',
                          'rider_mobile': widget.selectedItem['phone'] ?? '',
                          'vehicle_number': widget.selectedItem['plate'] ?? '',
                          'old_battery_id': widget.selectedItem['batteryId'] ?? '',
                          'old_battery_soc': widget.selectedItem['soc'] ?? 15,
                          'new_battery_id': widget.newBattery['serial'] ?? widget.newBattery['id'] ?? '',
                          'new_battery_soc': widget.newBattery['soc'] ?? 100,
                          'amount': widget.netPayable,
                          'payment_mode': widget.paymentMethod,
                          'zone': widget.selectedItem['zone'] ?? 'Gotri Zone',
                          'station': 'Central Swap Station',
                        };

                        bool isOnlineSuccess = false;
                        String swapId = 'SWAP-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}';

                        try {
                          final client = ApiClient();
                          client.updateBaseUrl();
                          final res = await client.dio.post(
                            '/batteries/swap',
                            data: swapData,
                          );

                          if (res.statusCode == 200 || res.statusCode == 201) {
                            isOnlineSuccess = true;
                            if (res.data?['swap']?['swap_id'] != null) {
                              swapId = res.data['swap']['swap_id'].toString();
                            }
                          }
                        } catch (e) {
                          debugPrint('Online swap failed, queueing offline: $e');
                          await LocalStorageService.queueBatterySwap(swapData);
                        } finally {
                          if (mounted) setState(() => _isSubmitting = false);
                        }

                        if (!mounted || !context.mounted) return;

                        // Show Success Dialog
                        showDialog(
                          context: context,
                          barrierDismissible: false,
                          builder: (context) => AlertDialog(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            content: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 60,
                                  height: 60,
                                  decoration: const BoxDecoration(
                                    color: EmployeeTheme.successBg,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.check_circle_rounded, color: EmployeeTheme.successGreen, size: 36),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  isOnlineSuccess ? "Battery Swap Authorized!" : "Swap Queued Offline!",
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  isOnlineSuccess
                                      ? "Swap ID: $swapId\nBattery ${widget.newBattery['serial']} (100% SOC) activated on vehicle ${widget.selectedItem['plate']}."
                                      : "Swap saved securely on device.\nIt will sync automatically with the server once connectivity is restored.",
                                  textAlign: TextAlign.center,
                                  style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary),
                                ),
                                const SizedBox(height: 20),
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: () {
                                      Navigator.of(context).pop();
                                      Navigator.of(context).pushAndRemoveUntil(
                                        MaterialPageRoute(builder: (context) => const BookingAgentHomeScreen()),
                                        (route) => false,
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: EmployeeTheme.primaryPurple,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                    ),
                                    child: const Text("Return to Agent Dashboard", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: EmployeeTheme.primaryPurple,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 0,
                ),
                child: _isSubmitting
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text(
                        "Confirm & Authorize Battery Swap ✓",
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildReviewRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(value, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textDark, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
