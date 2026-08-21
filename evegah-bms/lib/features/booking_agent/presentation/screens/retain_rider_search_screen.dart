import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'retain_rider_vehicle_battery_screen.dart';

class RetainRiderSearchScreen extends StatefulWidget {
  const RetainRiderSearchScreen({super.key});

  @override
  State<RetainRiderSearchScreen> createState() => _RetainRiderSearchScreenState();
}

class _RetainRiderSearchScreenState extends State<RetainRiderSearchScreen> {
  final TextEditingController _searchController = TextEditingController(text: "+91 98765 43210");
  int _selectedRiderIndex = 0;

  final List<Map<String, dynamic>> _existingRiders = [
    {
      "name": "Rahul Sharma",
      "phone": "+91 98765 43210",
      "riderId": "RIDER-7842",
      "kycStatus": "KYC Verified",
      "totalRides": 14,
      "lastRideDate": "18 May 2024",
      "lastVehicle": "EV-12KA-1234",
      "loyaltyTier": "Gold Rider (10% Off)",
      "dueBalance": "₹0.00",
    },
    {
      "name": "Aman Verma",
      "phone": "+91 98123 45678",
      "riderId": "RIDER-5219",
      "kycStatus": "KYC Verified",
      "totalRides": 8,
      "lastRideDate": "15 May 2024",
      "lastVehicle": "EV-12KA-5678",
      "loyaltyTier": "Silver Rider",
      "dueBalance": "₹0.00",
    },
    {
      "name": "Vikram Singh",
      "phone": "+91 97890 12345",
      "riderId": "RIDER-3104",
      "kycStatus": "KYC Verified",
      "totalRides": 22,
      "lastRideDate": "10 May 2024",
      "lastVehicle": "EV-12KA-9012",
      "loyaltyTier": "Platinum Rider (15% Off)",
      "dueBalance": "₹0.00",
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedRider = _existingRiders[_selectedRiderIndex];

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
          "Retain Existing Rider",
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
            const CustomRetainStepper(currentStep: 1),
            const SizedBox(height: 14),

            // 2. SEARCH BAR
            const Text(
              "Search Existing Rider",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 8),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: EmployeeTheme.borderColor),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.015),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.search_rounded, color: EmployeeTheme.brandPurple, size: 22),
                  const SizedBox(width: 10),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                      decoration: const InputDecoration(
                        hintText: "Enter Mobile Number, Name or Rider ID...",
                        hintStyle: TextStyle(fontSize: 12, color: EmployeeTheme.textMuted, fontWeight: FontWeight.normal),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  if (_searchController.text.isNotEmpty)
                    IconButton(
                      icon: const Icon(Icons.cancel_rounded, color: EmployeeTheme.textMuted, size: 18),
                      onPressed: () {
                        setState(() => _searchController.clear());
                      },
                    ),
                  ElevatedButton(
                    onPressed: () {
                      FocusScope.of(context).unfocus();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: EmployeeTheme.primaryPurple,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      minimumSize: Size.zero,
                      elevation: 0,
                    ),
                    child: const Text("Search", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 3. SEARCH RESULTS LIST
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Found Existing Riders",
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
                    "${_existingRiders.length} Registered",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _existingRiders.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final rider = _existingRiders[index];
                final isSelected = index == _selectedRiderIndex;

                return InkWell(
                  onTap: () {
                    setState(() => _selectedRiderIndex = index);
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
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.01),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        // Radio button
                        Icon(
                          isSelected ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                          color: isSelected ? EmployeeTheme.successGreen : const Color(0xFFCBD5E1),
                          size: 20,
                        ),
                        const SizedBox(width: 12),

                        // Avatar
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isSelected ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.person, color: EmployeeTheme.primaryPurple, size: 24),
                        ),
                        const SizedBox(width: 12),

                        // Details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    rider['name'],
                                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                                  ),
                                  const SizedBox(width: 6),
                                  const Icon(Icons.verified_user_rounded, color: EmployeeTheme.successGreen, size: 13),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "${rider['phone']} • ID: ${rider['riderId']}",
                                style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: EmployeeTheme.lightPurple,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      "${rider['totalRides']} Past Rides",
                                      style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple),
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: EmployeeTheme.successBg,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      rider['loyaltyTier'],
                                      style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                                    ),
                                  ),
                                ],
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

            // 4. SELECTED RIDER EXPANDED PROFILE CARD
            const Text(
              "Rider Retention Eligibility & Profile",
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
                  _buildProfileRow("Rider Name", selectedRider['name']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildProfileRow("Mobile Number", selectedRider['phone']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildProfileRow("Rider ID", selectedRider['riderId']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildProfileRow("Last Rental Date", selectedRider['lastRideDate']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildProfileRow("Previous Vehicle", selectedRider['lastVehicle']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildProfileRow("Outstanding Balance", selectedRider['dueBalance'], isSuccess: true),
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
                      builder: (context) => RetainRiderVehicleBatteryScreen(selectedRider: selectedRider),
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
                      "Continue to Vehicle & Battery Selection",
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

  Widget _buildProfileRow(String label, String value, {bool isSuccess = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(
          value,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.bold,
            color: isSuccess ? EmployeeTheme.successGreen : EmployeeTheme.textDark,
          ),
        ),
      ],
    );
  }
}

// Custom Stepper Progress Bar for Retain Rider Flow (5 Steps)
class CustomRetainStepper extends StatelessWidget {
  final int currentStep; // 1 to 5

  const CustomRetainStepper({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    final steps = [
      'Rider Search',
      'EV & Battery',
      'Rental Plan',
      'Payment',
      'Pre-Inspection',
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
                width: 22,
                height: 22,
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
                      fontSize: 10,
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
                width: 62,
                child: Text(
                  steps[index],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 9,
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
