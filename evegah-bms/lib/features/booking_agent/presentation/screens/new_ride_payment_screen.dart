import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import '../widgets/stepper_progress_bar.dart';
import 'new_ride_review_screen.dart';

class NewRidePaymentScreen extends StatefulWidget {
  final Map<String, dynamic> selectedVehicle;
  final String selectedPlan;
  final String depositOption;

  const NewRidePaymentScreen({
    super.key,
    required this.selectedVehicle,
    required this.selectedPlan,
    required this.depositOption,
  });

  @override
  State<NewRidePaymentScreen> createState() => _NewRidePaymentScreenState();
}

class _NewRidePaymentScreenState extends State<NewRidePaymentScreen> {
  String _paymentMethod = "Razorpay / UPI";

  @override
  Widget build(BuildContext context) {
    const double rentCharge = 897.0;
    final double securityDeposit = widget.depositOption.contains("500") ? 500.0 : 0.0;
    const double platformFee = 25.0;
    final double totalPayable = rentCharge + securityDeposit + platformFee;

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
          "Payment & Deposit",
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
            // 1. STEPPER PROGRESS BAR (Step 4 active)
            const StepperProgressBar(currentStep: 4),
            const SizedBox(height: 14),

            // 2. FARE BREAKDOWN CARD
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
                  const Text(
                    "Price Breakdown",
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                  ),
                  const SizedBox(height: 14),
                  _buildFareRow("EV Rental Charge (3 days)", "₹${rentCharge.toStringAsFixed(2)}"),
                  const SizedBox(height: 10),
                  _buildFareRow("Security Deposit (Refundable)", "₹${securityDeposit.toStringAsFixed(2)}"),
                  const SizedBox(height: 10),
                  _buildFareRow("Hub Platform & Cleaning Fee", "₹${platformFee.toStringAsFixed(2)}"),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Total Payable Amount",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      ),
                      Text(
                        "₹${totalPayable.toStringAsFixed(2)}",
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: EmployeeTheme.primaryPurple),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 3. PAYMENT METHOD SELECTION
            const Text(
              "Select Payment Method",
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
                    value: "Razorpay / UPI",
                    groupValue: _paymentMethod,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.account_balance_wallet_rounded, color: EmployeeTheme.brandPurple),
                    title: const Text("Razorpay / UPI / QR Code", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("GPay, PhonePe, Paytm or Credit Card", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Cash at Hub Counter",
                    groupValue: _paymentMethod,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.payments_rounded, color: EmployeeTheme.successGreen),
                    title: const Text("Cash at Counter", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Collect physical cash from rider at hub", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 4. PROCEED TO REVIEW BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => NewRideReviewScreen(
                        selectedVehicle: widget.selectedVehicle,
                        selectedPlan: widget.selectedPlan,
                        totalPayable: totalPayable,
                        paymentMethod: _paymentMethod,
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
                      "Proceed to Review & Confirm",
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

  Widget _buildFareRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(value, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textDark, fontWeight: FontWeight.w700)),
      ],
    );
  }
}
