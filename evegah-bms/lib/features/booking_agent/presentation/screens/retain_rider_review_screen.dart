import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'booking_agent_home_screen.dart';

class RetainRiderReviewScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRider;
  final Map<String, dynamic> selectedVehicle;
  final Map<String, dynamic> selectedBattery;
  final String selectedPlan;
  final double netPayable;
  final String paymentMethod;
  final String odometerKm;

  const RetainRiderReviewScreen({
    super.key,
    required this.selectedRider,
    required this.selectedVehicle,
    required this.selectedBattery,
    required this.selectedPlan,
    required this.netPayable,
    required this.paymentMethod,
    required this.odometerKm,
  });

  @override
  State<RetainRiderReviewScreen> createState() => _RetainRiderReviewScreenState();
}

class _RetainRiderReviewScreenState extends State<RetainRiderReviewScreen> {
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
          "Review Retain Ride",
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
            // 1. RETAIN RIDE SUMMARY CARD
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: EmployeeTheme.borderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.015),
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
                          color: EmployeeTheme.lightPurple,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.person, color: EmployeeTheme.primaryPurple, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.selectedRider['name'] ?? "Rahul Sharma",
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "${widget.selectedRider['phone']} • ${widget.selectedRider['loyaltyTier']}",
                              style: const TextStyle(fontSize: 11, color: EmployeeTheme.successGreen, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  _buildReviewRow("Vehicle Model", widget.selectedVehicle['name'] ?? "Evegah City 1S"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Registration Plate", widget.selectedVehicle['plate'] ?? "EV-12KA-1234"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Paired Battery SN", "${widget.selectedBattery['serial']} (${widget.selectedBattery['soc']})"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Rental Package", widget.selectedPlan),
                  const SizedBox(height: 8),
                  _buildReviewRow("Odometer Reading", "${widget.odometerKm} KM"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Pre-Ride Photos", "4 Photos Attached ✓"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Payment Method", widget.paymentMethod),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Net Renewal Amount", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
                      Text("₹${widget.netPayable.toStringAsFixed(2)}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: EmployeeTheme.primaryPurple)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 2. CONFIRM & DISPATCH RETAIN RIDE BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isSubmitting
                    ? null
                    : () async {
                        setState(() => _isSubmitting = true);
                        await Future.delayed(const Duration(seconds: 1));
                        if (!mounted) return;

                        // Show Retention Success Dialog
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
                                const Text("Rider Retained & Renewed!", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
                                const SizedBox(height: 8),
                                Text(
                                  "Ride ID: RIDE-1248\nVehicle ${widget.selectedVehicle['plate']} renewed for ${widget.selectedRider['name']}.",
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
                        "Confirm & Dispatch Retain Ride ✓",
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
