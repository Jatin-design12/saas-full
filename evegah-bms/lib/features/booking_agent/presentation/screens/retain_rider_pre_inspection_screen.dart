import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'retain_rider_search_screen.dart';
import 'retain_rider_review_screen.dart';

class RetainRiderPreInspectionScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRider;
  final Map<String, dynamic> selectedVehicle;
  final Map<String, dynamic> selectedBattery;
  final String selectedPlan;
  final double netPayable;
  final String paymentMethod;

  const RetainRiderPreInspectionScreen({
    super.key,
    required this.selectedRider,
    required this.selectedVehicle,
    required this.selectedBattery,
    required this.selectedPlan,
    required this.netPayable,
    required this.paymentMethod,
  });

  @override
  State<RetainRiderPreInspectionScreen> createState() => _RetainRiderPreInspectionScreenState();
}

class _RetainRiderPreInspectionScreenState extends State<RetainRiderPreInspectionScreen> {
  final TextEditingController _odometerController = TextEditingController(text: "12450");
  
  // Simulated uploaded photo states
  final Map<String, bool> _photoUploaded = {
    "Front View": true,
    "Back View": true,
    "Left Side": true,
    "Right Side": true,
  };

  // Checklist items
  bool _brakesOk = true;
  bool _lightsHornOk = true;
  bool _batteryLockOk = true;
  bool _helmetOk = true;

  @override
  void dispose() {
    _odometerController.dispose();
    super.dispose();
  }

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
          "Pre-Ride Vehicle Inspection",
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
            // 1. STEPPER PROGRESS BAR (Step 5 active)
            const CustomRetainStepper(currentStep: 5),
            const SizedBox(height: 14),

            // 2. VEHICLE IMAGE CAPTURE SECTION
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Pre-Ride Vehicle Photos (4 Sides)",
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
                    "4/4 Captured",
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // 4 Photo Upload Slots Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.4,
              children: [
                _buildPhotoUploadCard("Front View", Icons.camera_front_rounded),
                _buildPhotoUploadCard("Back View", Icons.camera_rear_rounded),
                _buildPhotoUploadCard("Left Side", Icons.directions_car_rounded),
                _buildPhotoUploadCard("Right Side", Icons.directions_car_filled_rounded),
              ],
            ),
            const SizedBox(height: 18),

            // 3. ODOMETER KM READING INPUT
            const Text(
              "Odometer KM Reading",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 8),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Row(
                children: [
                  const Icon(Icons.speed_rounded, color: EmployeeTheme.brandPurple, size: 20),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Current Odometer (KM)", style: TextStyle(fontSize: 9.5, color: EmployeeTheme.textMuted, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 2),
                        TextField(
                          controller: _odometerController,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                          decoration: const InputDecoration(
                            isDense: true,
                            contentPadding: EdgeInsets.zero,
                            border: InputBorder.none,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Text("KM", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: EmployeeTheme.textMuted)),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 4. VEHICLE SAFETY CHECKLIST
            const Text(
              "Pre-Ride Safety Checklist",
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
                  CheckboxListTile(
                    value: _brakesOk,
                    onChanged: (val) => setState(() => _brakesOk = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Brakes & Tires Condition OK", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Verified front & rear brake pressure and tire tread", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  CheckboxListTile(
                    value: _lightsHornOk,
                    onChanged: (val) => setState(() => _lightsHornOk = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Headlight, Indicators & Horn Functional", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Tested high-beam headlight and turn signals", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  CheckboxListTile(
                    value: _batteryLockOk,
                    onChanged: (val) => setState(() => _batteryLockOk = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Smart Battery Lock Latched & Sealed", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Confirmed battery latch lock is fully engaged", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  CheckboxListTile(
                    value: _helmetOk,
                    onChanged: (val) => setState(() => _helmetOk = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Sanitized Safety Helmet Issued", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Issued clean ISI certified helmet to rider", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 5. REVIEW & CONFIRM BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => RetainRiderReviewScreen(
                        selectedRider: widget.selectedRider,
                        selectedVehicle: widget.selectedVehicle,
                        selectedBattery: widget.selectedBattery,
                        selectedPlan: widget.selectedPlan,
                        netPayable: widget.netPayable,
                        paymentMethod: widget.paymentMethod,
                        odometerKm: _odometerController.text,
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
                      "Review & Confirm Retain Ride",
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

  Widget _buildPhotoUploadCard(String title, IconData defaultIcon) {
    final isUploaded = _photoUploaded[title] ?? false;

    return GestureDetector(
      onTap: () {
        setState(() {
          _photoUploaded[title] = true;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("$title photo captured & attached.")),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isUploaded ? EmployeeTheme.limeCardBg : Colors.white,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isUploaded ? EmployeeTheme.limeCardBorder : EmployeeTheme.borderColor,
            width: isUploaded ? 1.5 : 1.0,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: isUploaded ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    isUploaded ? Icons.photo_camera_rounded : defaultIcon,
                    color: EmployeeTheme.primaryPurple,
                    size: 22,
                  ),
                ),
                if (isUploaded)
                  Positioned(
                    top: -2,
                    right: -2,
                    child: Container(
                      width: 14,
                      height: 14,
                      decoration: const BoxDecoration(
                        color: EmployeeTheme.successGreen,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, color: Colors.white, size: 10),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
            ),
            const SizedBox(height: 2),
            Text(
              isUploaded ? "Photo Attached ✓" : "Tap to Capture",
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: isUploaded ? FontWeight.bold : FontWeight.normal,
                color: isUploaded ? EmployeeTheme.successGreen : EmployeeTheme.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
