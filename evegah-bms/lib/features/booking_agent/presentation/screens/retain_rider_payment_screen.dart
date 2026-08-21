import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'retain_rider_search_screen.dart';
import 'retain_rider_pre_inspection_screen.dart';

class RetainRiderPaymentScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRider;
  final Map<String, dynamic> selectedVehicle;
  final Map<String, dynamic> selectedBattery;
  final String selectedPlan;
  final String depositOption;

  const RetainRiderPaymentScreen({
    super.key,
    required this.selectedRider,
    required this.selectedVehicle,
    required this.selectedBattery,
    required this.selectedPlan,
    required this.depositOption,
  });

  @override
  State<RetainRiderPaymentScreen> createState() => _RetainRiderPaymentScreenState();
}

class _RetainRiderPaymentScreenState extends State<RetainRiderPaymentScreen> {
  String _paymentMethod = "Razorpay / UPI / QR Code";

  @override
  Widget build(BuildContext context) {
    const double rentCharge = 799.0;
    const double discount = 80.0;
    const double hubFee = 20.0;
    final double depositRollover = widget.depositOption.contains("500") ? 500.0 : 0.0;
    final double netPayable = rentCharge - discount + hubFee;

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
            const CustomRetainStepper(currentStep: 4),
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
                    "Retention Price Breakdown",
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                  ),
                  const SizedBox(height: 14),
                  _buildFareRow("Rental Charge (3 Days Renewal)", "₹${rentCharge.toStringAsFixed(2)}"),
                  const SizedBox(height: 10),
                  _buildFareRow("Existing Deposit Rollover", "₹${depositRollover.toStringAsFixed(2)} (Carried Over)", isSuccessText: true),
                  const SizedBox(height: 10),
                  _buildFareRow("Hub Operations Fee", "₹${hubFee.toStringAsFixed(2)}"),
                  const SizedBox(height: 10),
                  _buildFareRow("Loyalty Retention Discount", "-₹${discount.toStringAsFixed(2)}", isDiscount: true),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Net Payable Amount",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      ),
                      Text(
                        "₹${netPayable.toStringAsFixed(2)}",
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
              "Select Payment Mode",
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
                    value: "Razorpay / UPI / QR Code",
                    groupValue: _paymentMethod,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.account_balance_wallet_rounded, color: EmployeeTheme.brandPurple),
                    title: const Text("Razorpay / UPI / QR Code", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("GPay, PhonePe, Paytm or Credit Card", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Cash at Counter",
                    groupValue: _paymentMethod,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.payments_rounded, color: EmployeeTheme.successGreen),
                    title: const Text("Cash at Counter", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Collect physical cash from rider at hub counter", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Rider Evegah Wallet (₹1,250 Available)",
                    groupValue: _paymentMethod,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    secondary: const Icon(Icons.account_balance_rounded, color: Colors.indigo),
                    title: const Text("Rider Evegah Wallet", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Deduct directly from rider's prepaid wallet (Balance: ₹1,250)", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
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
                      builder: (context) => RetainRiderPreInspectionScreen(
                        selectedRider: widget.selectedRider,
                        selectedVehicle: widget.selectedVehicle,
                        selectedBattery: widget.selectedBattery,
                        selectedPlan: widget.selectedPlan,
                        netPayable: netPayable,
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
                      "Proceed to Pre-Ride Inspection",
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

  Widget _buildFareRow(String label, String value, {bool isDiscount = false, bool isSuccessText = false}) {
    Color valColor = EmployeeTheme.textDark;
    if (isDiscount) valColor = EmployeeTheme.successGreen;
    if (isSuccessText) valColor = EmployeeTheme.brandPurple;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(value, style: TextStyle(fontSize: 11.5, color: valColor, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
