import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import 'return_ride_search_screen.dart';
import 'return_ride_settlement_screen.dart';

class ReturnRideInspectionScreen extends StatefulWidget {
  final Map<String, dynamic> selectedRide;

  const ReturnRideInspectionScreen({
    super.key,
    required this.selectedRide,
  });

  @override
  State<ReturnRideInspectionScreen> createState() => _ReturnRideInspectionScreenState();
}

class _ReturnRideInspectionScreenState extends State<ReturnRideInspectionScreen> {
  final TextEditingController _finalOdometerController = TextEditingController(text: "12580");
  final TextEditingController _returnedSocController = TextEditingController(text: "18");

  final Map<String, bool> _photoUploaded = {
    "Front View": true,
    "Back View": true,
    "Left Side": true,
    "Right Side": true,
  };

  String _cleanlinessStatus = "Clean & Satisfactory";
  String _physicalCondition = "No Scratches / Damage";
  bool _helmetReturned = true;

  @override
  void dispose() {
    _finalOdometerController.dispose();
    _returnedSocController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const int startKm = 12450;
    final int endKm = int.tryParse(_finalOdometerController.text) ?? 12580;
    final int distanceDriven = endKm - startKm > 0 ? endKm - startKm : 130;

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
          "Vehicle Return Inspection",
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
            // 1. STEPPER PROGRESS BAR (Step 2 active)
            const CustomReturnStepper(currentStep: 2),
            const SizedBox(height: 14),

            // 2. SELECTED RIDE SUMMARY BAR
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
                          "Return Ride: ${widget.selectedRide['rideId']} (${widget.selectedRide['plate']})",
                          style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                        ),
                        Text(
                          "Rider: ${widget.selectedRide['riderName']} (${widget.selectedRide['phone']})",
                          style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 3. POST-RIDE 4-SIDE PHOTO CAPTURE
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  "Post-Ride Vehicle Photos (4 Sides)",
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

            // 4. RETURN ODOMETER & BATTERY SOC INPUTS
            const Text(
              "Odometer & Battery Return Status",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: EmployeeTheme.textDark,
              ),
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: EmployeeTheme.borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Final Odometer (KM)", style: TextStyle(fontSize: 9.5, color: EmployeeTheme.textMuted, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _finalOdometerController,
                          keyboardType: TextInputType.number,
                          onChanged: (_) => setState(() {}),
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                          decoration: const InputDecoration(isDense: true, contentPadding: EdgeInsets.zero, border: InputBorder.none),
                        ),
                        const SizedBox(height: 4),
                        Text("Driven: $distanceDriven KM", style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.brandPurple)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: EmployeeTheme.borderColor),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("Returned Battery SOC %", style: TextStyle(fontSize: 9.5, color: EmployeeTheme.textMuted, fontWeight: FontWeight.w600)),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _returnedSocController,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark),
                          decoration: const InputDecoration(isDense: true, contentPadding: EdgeInsets.zero, border: InputBorder.none),
                        ),
                        const SizedBox(height: 4),
                        const Text("Battery SN: BAT-72V-9842", style: TextStyle(fontSize: 9.5, color: EmployeeTheme.textSecondary)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 18),

            // 5. CLEANLINESS & CONDITION CHECKLIST
            const Text(
              "Physical Condition & Inspection",
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
                  DropdownButtonFormField<String>(
                    value: _cleanlinessStatus,
                    decoration: const InputDecoration(
                      labelText: "Vehicle Cleanliness State",
                      labelStyle: TextStyle(fontSize: 11, color: EmployeeTheme.textMuted),
                      border: InputBorder.none,
                    ),
                    items: const [
                      DropdownMenuItem(value: "Clean & Satisfactory", child: Text("Clean & Satisfactory (No Fee)", style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: "Minor Cleaning Needed", child: Text("Minor Cleaning Needed (+₹50)", style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: "Heavy Dirt / Wash Needed", child: Text("Heavy Dirt / Wash Needed (+₹150)", style: TextStyle(fontSize: 12))),
                    ],
                    onChanged: (val) => setState(() => _cleanlinessStatus = val!),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  DropdownButtonFormField<String>(
                    value: _physicalCondition,
                    decoration: const InputDecoration(
                      labelText: "Physical Body Condition",
                      labelStyle: TextStyle(fontSize: 11, color: EmployeeTheme.textMuted),
                      border: InputBorder.none,
                    ),
                    items: const [
                      DropdownMenuItem(value: "No Scratches / Damage", child: Text("No Scratches / Damage (Clean Return)", style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: "Minor Paint Scratch", child: Text("Minor Paint Scratch (+₹100)", style: TextStyle(fontSize: 12))),
                      DropdownMenuItem(value: "Body Part Replacement Needed", child: Text("Body Part Replacement Needed (+₹500)", style: TextStyle(fontSize: 12))),
                    ],
                    onChanged: (val) => setState(() => _physicalCondition = val!),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  CheckboxListTile(
                    value: _helmetReturned,
                    onChanged: (val) => setState(() => _helmetReturned = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Safety Helmet Returned OK", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Verified helmet returned in good clean condition", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 6. CONTINUE BUTTON
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ReturnRideSettlementScreen(
                        selectedRide: widget.selectedRide,
                        distanceDrivenKm: distanceDriven,
                        cleanlinessStatus: _cleanlinessStatus,
                        physicalCondition: _physicalCondition,
                        returnedSoc: _returnedSocController.text,
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
                      "Continue to Fare Settlement & Deposit Refund",
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
          SnackBar(content: Text("$title return photo attached.")),
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
            Text(title, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: EmployeeTheme.textDark)),
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
