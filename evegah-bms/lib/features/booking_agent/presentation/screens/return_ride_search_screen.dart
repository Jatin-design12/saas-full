import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'return_ride_inspection_screen.dart';

class ReturnRideSearchScreen extends StatefulWidget {
  const ReturnRideSearchScreen({super.key});

  @override
  State<ReturnRideSearchScreen> createState() => _ReturnRideSearchScreenState();
}

class _ReturnRideSearchScreenState extends State<ReturnRideSearchScreen> {
  final TextEditingController _searchController = TextEditingController(text: "EV-12KA-1234");
  int _selectedRideIndex = 0;

  final List<Map<String, dynamic>> _activeRides = [
    {
      "rideId": "RIDE-1256",
      "riderName": "Rahul Sharma",
      "phone": "+91 98765 43210",
      "vehicleName": "Evegah City 1S",
      "plate": "EV-12KA-1234",
      "startDate": "14 Jul 2026, 10:00 AM",
      "plannedReturn": "17 Jul 2026, 10:00 AM",
      "status": "Return Due Today",
      "depositPaid": "₹500.00",
      "rentPaid": "₹897.00",
      "initialOdometer": "12,450 km",
      "initialBatterySn": "BAT-72V-9842",
    },
    {
      "rideId": "RIDE-1248",
      "riderName": "Aman Verma",
      "phone": "+91 98123 45678",
      "vehicleName": "Evegah Fly",
      "plate": "EV-12KA-5678",
      "startDate": "12 Jul 2026, 09:00 AM",
      "plannedReturn": "15 Jul 2026, 09:00 AM",
      "status": "Overdue (2 Hrs)",
      "depositPaid": "₹500.00",
      "rentPaid": "₹1,699.00",
      "initialOdometer": "8,920 km",
      "initialBatterySn": "BAT-72V-7104",
    },
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selectedRide = _activeRides[_selectedRideIndex];

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
          "Return Ride Inspection",
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
            const CustomReturnStepper(currentStep: 1),
            const SizedBox(height: 14),

            // 2. SEARCH BAR
            const Text(
              "Search Active Ride to Return",
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
                        hintText: "Enter Vehicle Plate, Ride ID or Rider Mobile...",
                        hintStyle: TextStyle(fontSize: 12, color: EmployeeTheme.textMuted, fontWeight: FontWeight.normal),
                        border: InputBorder.none,
                      ),
                    ),
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

            // 3. ACTIVE RIDES LIST
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Active Rentals Pending Return",
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
                    "${_activeRides.length} Active Rides",
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _activeRides.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final ride = _activeRides[index];
                final isSelected = index == _selectedRideIndex;
                final isOverdue = ride['status'].contains("Overdue");

                return InkWell(
                  onTap: () {
                    setState(() => _selectedRideIndex = index);
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
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: isSelected ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 24),
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
                                    "${ride['rideId']} • ${ride['plate']}",
                                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: isOverdue ? const Color(0xFFFEF2F2) : EmployeeTheme.successBg,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      ride['status'],
                                      style: TextStyle(
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        color: isOverdue ? const Color(0xFFEF4444) : EmployeeTheme.successGreen,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Rider: ${ride['riderName']} (${ride['phone']})",
                                style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Start: ${ride['startDate']}",
                                style: const TextStyle(fontSize: 9.5, color: EmployeeTheme.textMuted),
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

            // 4. SELECTED RIDE SUMMARY DETAILS CARD
            const Text(
              "Initial Dispatch Parameters",
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
                  _buildDetailRow("Rider Name", selectedRide['riderName']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDetailRow("Vehicle Plate", selectedRide['plate']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDetailRow("Initial Odometer", selectedRide['initialOdometer']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDetailRow("Dispatched Battery SN", selectedRide['initialBatterySn']),
                  const Divider(height: 16, color: Color(0xFFF1F5F9)),
                  _buildDetailRow("Security Deposit Paid", selectedRide['depositPaid'], isHighlight: true),
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
                      builder: (context) => ReturnRideInspectionScreen(selectedRide: selectedRide),
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
                      "Continue to Vehicle Return Inspection",
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

  Widget _buildDetailRow(String label, String value, {bool isHighlight = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 11.5, color: EmployeeTheme.textSecondary, fontWeight: FontWeight.w500)),
        Text(
          value,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.bold,
            color: isHighlight ? EmployeeTheme.brandPurple : EmployeeTheme.textDark,
          ),
        ),
      ],
    );
  }
}

// Stepper Progress Bar for Return Ride Flow (4 Steps)
class CustomReturnStepper extends StatelessWidget {
  final int currentStep;

  const CustomReturnStepper({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    final steps = [
      'Active Ride',
      'Inspection & Photos',
      'Fare Settlement',
      'Confirmation',
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
                width: 24,
                height: 24,
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
                      fontSize: 11,
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
                width: 76,
                child: Text(
                  steps[index],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 9.5,
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
