import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import '../widgets/stepper_progress_bar.dart';
import 'new_ride_payment_screen.dart';

class NewRidePlanPricingScreen extends StatefulWidget {
  final Map<String, dynamic> selectedVehicle;

  const NewRidePlanPricingScreen({
    super.key,
    required this.selectedVehicle,
  });

  @override
  State<NewRidePlanPricingScreen> createState() => _NewRidePlanPricingScreenState();
}

class _NewRidePlanPricingScreenState extends State<NewRidePlanPricingScreen> {
  String _selectedPlan = "Daily Package (3 Days)";
  String _depositOption = "Standard Refundable Deposit (₹500)";

  final List<Map<String, dynamic>> _plans = [
    {
      "name": "Hourly Pass",
      "duration": "12 Hours",
      "rate": "₹150",
      "desc": "Flexible short trips inside city limits",
    },
    {
      "name": "Daily Package (3 Days)",
      "duration": "3 Days Unlimited",
      "rate": "₹897",
      "desc": "Includes unlimited battery swaps at any Evegah hub",
    },
    {
      "name": "Weekly Pass",
      "duration": "7 Days",
      "rate": "₹1,899",
      "desc": "Best value for weekly delivery riders & commuters",
    },
    {
      "name": "Monthly Pass",
      "duration": "30 Days",
      "rate": "₹5,499",
      "desc": "Long term rental plan with free periodic maintenance",
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
          "Plan & Rental Pricing",
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
            const StepperProgressBar(currentStep: 3),
            const SizedBox(height: 14),

            // 2. SELECTED VEHICLE SUMMARY BAR
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: EmployeeTheme.lightPurple,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE0E7FF)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 24),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Vehicle: ${widget.selectedVehicle['name'] ?? 'Evegah City 1S'}",
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                        ),
                        Text(
                          "Plate: ${widget.selectedVehicle['plate'] ?? 'EV-12KA-1234'}",
                          style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 3. RENTAL PLAN SELECTION
            const Text(
              "Select Rental Package",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
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
                          isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                          color: isSelected ? const Color(0xFF84CC16) : const Color(0xFFCBD5E1),
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
                                  Text(
                                    plan['rate'],
                                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: EmployeeTheme.primaryPurple),
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

            // 4. SECURITY DEPOSIT OPTIONS
            const Text(
              "Security Deposit Option",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),

            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Column(
                children: [
                  RadioListTile<String>(
                    value: "Standard Refundable Deposit (₹500)",
                    groupValue: _depositOption,
                    onChanged: (val) => setState(() => _depositOption = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Standard Refundable Deposit (₹500)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Fully refunded upon return after inspection", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  RadioListTile<String>(
                    value: "Zero Deposit with Express Verification",
                    groupValue: _depositOption,
                    onChanged: (val) => setState(() => _depositOption = val!),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Zero Deposit (Corporate Partner)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("For pre-approved franchise corporate riders", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 5. CONTINUE TO PAYMENT BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => NewRidePaymentScreen(
                        selectedVehicle: widget.selectedVehicle,
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
                      "Continue to Payment",
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
