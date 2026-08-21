import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'battery_swap_search_screen.dart';
import 'battery_swap_confirm_screen.dart';

class BatterySwapPaymentScreen extends StatefulWidget {
  final Map<String, dynamic> selectedItem;
  final Map<String, dynamic> newBattery;

  const BatterySwapPaymentScreen({
    super.key,
    required this.selectedItem,
    required this.newBattery,
  });

  @override
  State<BatterySwapPaymentScreen> createState() => _BatterySwapPaymentScreenState();
}

class _BatterySwapPaymentScreenState extends State<BatterySwapPaymentScreen> {
  String _paymentMethod = "Razorpay / UPI / QR Code";

  @override
  Widget build(BuildContext context) {
    final bool isUnlimitedPlan = widget.selectedItem['planType'].toString().contains("Unlimited");
    final double swapFee = isUnlimitedPlan ? 0.0 : 80.0;
    final double platformFee = isUnlimitedPlan ? 0.0 : 5.0;
    final double netPayable = swapFee + platformFee;

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
          "Swap Fee Payment",
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
            const CustomSwapStepper(currentStep: 3),
            const SizedBox(height: 14),

            // 2. SWAP FEE BREAKDOWN CARD
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
                        "Battery Swap Fee Breakdown",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isUnlimitedPlan ? EmployeeTheme.successBg : EmployeeTheme.lightPurple,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          isUnlimitedPlan ? "Subscription Included" : "Pay-Per-Swap",
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.bold,
                            color: isUnlimitedPlan ? EmployeeTheme.successGreen : EmployeeTheme.brandPurple,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _buildSwapRow("Standard Battery Swap Charge", isUnlimitedPlan ? "₹80.00" : "₹80.00"),
                  const SizedBox(height: 10),
                  if (isUnlimitedPlan) ...[
                    _buildSwapRow("Unlimited Swap Subscription Discount", "-₹80.00", isDiscount: true),
                    const SizedBox(height: 10),
                  ],
                  _buildSwapRow("BMS Telemetry & Platform Fee", isUnlimitedPlan ? "₹0.00" : "₹5.00"),
                  const Divider(height: 24, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        "Total Swap Payable Amount",
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      ),
                      Text(
                        "₹${netPayable.toStringAsFixed(2)}",
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: isUnlimitedPlan ? EmployeeTheme.successGreen : EmployeeTheme.primaryPurple,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // 3. PAYMENT METHOD ACCEPTANCE
            if (netPayable > 0) ...[
              const Text(
                "Accept Payment From Rider",
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
                      secondary: const Icon(Icons.qr_code_rounded, color: EmployeeTheme.brandPurple),
                      title: const Text("Razorpay / Dynamic UPI QR", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      subtitle: const Text("Show QR code for GPay / PhonePe / Paytm scan", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                    ),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    RadioListTile<String>(
                      value: "Cash at Station Counter",
                      groupValue: _paymentMethod,
                      onChanged: (val) => setState(() => _paymentMethod = val!),
                      activeColor: EmployeeTheme.primaryPurple,
                      secondary: const Icon(Icons.payments_rounded, color: EmployeeTheme.successGreen),
                      title: const Text("Cash Collection at Counter", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      subtitle: const Text("Collect physical ₹85 cash from rider at station counter", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                    ),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    RadioListTile<String>(
                      value: "Deduct from Rider Evegah Wallet",
                      groupValue: _paymentMethod,
                      onChanged: (val) => setState(() => _paymentMethod = val!),
                      activeColor: EmployeeTheme.primaryPurple,
                      secondary: const Icon(Icons.account_balance_wallet_rounded, color: Colors.indigo),
                      title: const Text("Deduct from Rider Evegah Wallet", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      subtitle: const Text("Instant deduction from prepaid balance (₹1,250 Available)", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ] else ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: EmployeeTheme.successBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.check_circle_rounded, color: EmployeeTheme.successGreen, size: 24),
                    SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        "No payment required! Covered under Rider's Daily Unlimited Battery Swap Plan.",
                        style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // 4. PROCEED TO CONFIRM BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => BatterySwapConfirmScreen(
                        selectedItem: widget.selectedItem,
                        newBattery: widget.newBattery,
                        netPayable: netPayable,
                        paymentMethod: netPayable > 0 ? _paymentMethod : "Unlimited Subscription Plan",
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
                      "Complete Payment & Confirm Swap",
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

  Widget _buildSwapRow(String label, String value, {bool isDiscount = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(
          value,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.bold,
            color: isDiscount ? EmployeeTheme.successGreen : EmployeeTheme.textDark,
          ),
        ),
      ],
    );
  }
}
