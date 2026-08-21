import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'retain_rider_search_screen.dart';
import 'retain_rider_payment_screen.dart';

class RetainRiderPlanScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRider;
  final Map<String, dynamic> selectedVehicle;
  final Map<String, dynamic> selectedBattery;

  const RetainRiderPlanScreen({
    super.key,
    required this.selectedRider,
    required this.selectedVehicle,
    required this.selectedBattery,
  });

  @override
  State<RetainRiderPlanScreen> createState() => _RetainRiderPlanScreenState();
}

class _RetainRiderPlanScreenState extends State<RetainRiderPlanScreen> {
  String _selectedPlan = "3-Day Retention Pack (₹799)";
  String _depositOption = "Retain Existing Deposit Balance (₹500)";

  final List<Map<String, dynamic>> _plans = [
    {
      "name": "3-Day Retention Pack (₹799)",
      "duration": "3 Days",
      "rate": "₹799",
      "origRate": "₹897",
      "desc": "Special 10% loyalty discount for existing rider renewal",
    },
    {
      "name": "Weekly Retention Pass (₹1,699)",
      "duration": "7 Days",
      "rate": "₹1,699",
      "origRate": "₹1,899",
      "desc": "Unlimited battery swaps at all Evegah EV hubs",
    },
    {
      "name": "15-Day Commuter Pack (₹3,299)",
      "duration": "15 Days",
      "rate": "₹3,299",
      "origRate": "₹3,750",
      "desc": "Includes free roadside assistance & maintenance",
    },
    {
      "name": "Monthly Super Saver (₹4,999)",
      "duration": "30 Days",
      "rate": "₹4,999",
      "origRate": "₹5,999",
      "desc": "Maximum savings for full month operational rental",
    },
  ];

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
          "Select Retention Plan",
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
            const CustomRetainStepper(currentStep: 3),
            const SizedBox(height: 14),

            // 2. SUMMARY BAR
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: EmployeeTheme.lightPurple,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE0E7FF)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Vehicle: ${widget.selectedVehicle['name']} (${widget.selectedVehicle['plate']})",
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                        ),
                        Text(
                          "Battery: ${widget.selectedBattery['serial']} (${widget.selectedBattery['soc']} SOC)",
                          style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 3. RETENTION PLAN SELECTION
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Retention Rental Packages",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: EmployeeTheme.textDark,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: EmployeeTheme.successBg,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    "Loyalty Discount Applied",
                    style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _plans.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final plan = _plans[index];
                final isSelected = plan['name'] == _selectedPlan;

                return InkWell(
                  onTap: () {
                    setState(() => _selectedPlan = plan['name']);
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
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    plan['name'],
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                                  ),
                                  Row(
                                    children: [
                                      Text(
                                        plan['origRate'],
                                        style: const TextStyle(fontSize: 11, color: EmployeeTheme.textMuted, decoration: TextDecoration.lineThrough),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        plan['rate'],
                                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: EmployeeTheme.primaryPurple),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                plan['desc'],
                                style: const TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary),
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

            // 4. DEPOSIT ROLLOVER OPTIONS
            const Text(
              "Security Deposit Handling",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Column(
                children: [
                  RadioListTile<String>(
                    value: "Retain Existing Deposit Balance (₹500)",
                    groupValue: _depositOption,
                    onChanged: (val) => setState(() => _depositOption = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Rollover Existing Deposit (₹500)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Use pre-validated deposit from previous ride (No additional cash needed)", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Zero Deposit (Platinum Loyal Rider)",
                    groupValue: _depositOption,
                    onChanged: (val) => setState(() => _depositOption = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Zero Deposit Loyalty Waiver", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Waiver for riders with >10 completed rides & 100% clean record", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
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
                      builder: (context) => RetainRiderPaymentScreen(
                        selectedRider: widget.selectedRider,
                        selectedVehicle: widget.selectedVehicle,
                        selectedBattery: widget.selectedBattery,
                        selectedPlan: _selectedPlan,
                        depositOption: _depositOption,
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
                      "Continue to Payment & Breakdown",
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
