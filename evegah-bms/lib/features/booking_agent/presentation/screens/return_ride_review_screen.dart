import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'booking_agent_home_screen.dart';

class ReturnRideReviewScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRide;
  final int distanceDrivenKm;
  final double netRefundAmount;
  final String refundMethod;
  final String returnedSoc;

  const ReturnRideReviewScreen({
    super.key,
    required this.selectedRide,
    required this.distanceDrivenKm,
    required this.netRefundAmount,
    required this.refundMethod,
    required this.returnedSoc,
  });

  @override
  State<ReturnRideReviewScreen> createState() => _ReturnRideReviewScreenState();
}

class _ReturnRideReviewScreenState extends State<ReturnRideReviewScreen> {
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
          "Review & Close Return",
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
            // 1. RETURN RIDE REVIEW CARD
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
                        child: const Icon(Icons.assignment_turned_in_rounded, color: EmployeeTheme.primaryPurple, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Ride Return: ${widget.selectedRide['rideId']}",
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Rider: ${widget.selectedRide['riderName']} (${widget.selectedRide['phone']})",
                              style: const TextStyle(fontSize: 11, color: EmployeeTheme.brandPurple, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  _buildReviewRow("Vehicle Plate", widget.selectedRide['plate']),
                  const SizedBox(height: 8),
                  _buildReviewRow("Distance Driven", "${widget.distanceDrivenKm} KM"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Returned Battery SOC", "${widget.returnedSoc}%"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Post-Ride Inspection", "4 Photos Attached ✓"),
                  const SizedBox(height: 8),
                  _buildReviewRow("Settlement Mode", widget.refundMethod),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Net Deposit Refunded", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
                      Text("₹${widget.netRefundAmount.toStringAsFixed(2)}", style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: EmployeeTheme.successGreen)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 2. CONFIRM & CLOSE RETURN BUTTON
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
                                const Text("Vehicle Return Completed!", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
                                const SizedBox(height: 8),
                                Text(
                                  "Ride ${widget.selectedRide['rideId']} closed successfully.\nVehicle ${widget.selectedRide['plate']} marked as AVAILABLE.",
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
                        "Confirm & Close Return Ride ✓",
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
