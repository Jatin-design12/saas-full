import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'return_ride_search_screen.dart';
import 'return_ride_review_screen.dart';

class ReturnRideSettlementScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRide;
  final int distanceDrivenKm;
  final String cleanlinessStatus;
  final String physicalCondition;
  final String returnedSoc;

  const ReturnRideSettlementScreen({
    super.key,
    required this.selectedRide,
    required this.distanceDrivenKm,
    required this.cleanlinessStatus,
    required this.physicalCondition,
    required this.returnedSoc,
  });

  @override
  State<ReturnRideSettlementScreen> createState() => _ReturnRideSettlementScreenState();
}

class _ReturnRideSettlementScreenState extends State<ReturnRideSettlementScreen> {
  String _refundMethod = "Refund via Razorpay / Original Mode (₹420.00)";

  @override
  Widget build(BuildContext context) {
    const double initialDeposit = 500.0;
    const double extraOverdueFee = 80.0; // 2 hrs overdue
    final double cleaningFee = widget.cleanlinessStatus.contains("+₹50") ? 50.0 : (widget.cleanlinessStatus.contains("+₹150") ? 150.0 : 0.0);
    final double damageFee = widget.physicalCondition.contains("+₹100") ? 100.0 : (widget.physicalCondition.contains("+₹500") ? 500.0 : 0.0);
    
    final double totalDeductions = extraOverdueFee + cleaningFee + damageFee;
    final double netRefundToRider = initialDeposit - totalDeductions;

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
          "Fare Settlement & Refund",
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
            // 1. STEPPER PROGRESS BAR (Step 3 active)
            const CustomReturnStepper(currentStep: 3),
            const SizedBox(height: 14),

            // 2. SETTLEMENT BREAKDOWN CARD
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
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Return Settlement Breakdown",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: EmployeeTheme.lightPurple,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          "Driven: ${widget.distanceDrivenKm} KM",
                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _buildSettlementRow("Security Deposit Paid Initially", "₹${initialDeposit.toStringAsFixed(2)}"),
                  const SizedBox(height: 10),
                  _buildSettlementRow("Overdue Delay Fee (2 hrs @ ₹40/hr)", "-₹${extraOverdueFee.toStringAsFixed(2)}", isDeduction: true),
                  const SizedBox(height: 10),
                  _buildSettlementRow("Vehicle Wash / Cleaning Charge", "-₹${cleaningFee.toStringAsFixed(2)}", isDeduction: cleaningFee > 0),
                  const SizedBox(height: 10),
                  _buildSettlementRow("Body Scratch / Damage Charge", "-₹${damageFee.toStringAsFixed(2)}", isDeduction: damageFee > 0),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Net Refund Amount to Rider",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      ),
                      Text(
                        "₹${netRefundToRider.toStringAsFixed(2)}",
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: EmployeeTheme.successGreen),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 3. REFUND / PAYMENT ACCEPTANCE MODE
            const Text(
              "Select Deposit Refund / Settlement Mode",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),

            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Column(
                children: [
                  RadioListTile<String>(
                    value: "Refund via Razorpay / Original Mode (₹420.00)",
                    groupValue: _refundMethod,
                    onChanged: (val) => setState(() => _refundMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.account_balance_wallet_rounded, color: EmployeeTheme.brandPurple),
                    title: const Text("Original Payment Gateway / UPI", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Auto-refund back to rider's original UPI / Card within 2 hours", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Instant Credit to Rider Evegah Wallet",
                    groupValue: _refundMethod,
                    onChanged: (val) => setState(() => _refundMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.account_balance_rounded, color: Colors.indigo),
                    title: const Text("Instant Credit to Rider Wallet", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Instant 100% wallet credit for future Evegah rides", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Cash Handover at Hub Counter",
                    groupValue: _refundMethod,
                    onChanged: (val) => setState(() => _refundMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.payments_rounded, color: EmployeeTheme.successGreen),
                    title: const Text("Cash Handover at Counter", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Handover physical cash refund directly to rider", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 4. PROCEED BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ReturnRideReviewScreen(
                        selectedRide: widget.selectedRide,
                        distanceDrivenKm: widget.distanceDrivenKm,
                        netRefundAmount: netRefundToRider,
                        refundMethod: _refundMethod,
                        returnedSoc: widget.returnedSoc,
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
                      "Proceed to Return Review & Receipt",
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

  Widget _buildSettlementRow(String label, String value, {bool isDeduction = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(
          value,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.bold,
            color: isDeduction ? const Color(0xFFEF4444) : EmployeeTheme.textDark,
          ),
        ),
      ],
    );
  }
}
