import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';
import '../widgets/stepper_progress_bar.dart';
import 'new_ride_plan_pricing_screen.dart';

class NewRideVehicleDetailsScreen extends StatefulWidget {
  const NewRideVehicleDetailsScreen({super.key});

  @override
  State<NewRideVehicleDetailsScreen> createState() => _NewRideVehicleDetailsScreenState();
}

class _NewRideVehicleDetailsScreenState extends State<NewRideVehicleDetailsScreen> {
  int _selectedVehicleIndex = 0;
  bool _includeHelmet = true;
  bool _includeCharger = true;

  final List<Map<String, dynamic>> _vehicles = [
    {
      "name": "Evegah City 1S",
      "category": "E-Scooter",
      "speed": "65 km/h",
      "range": "85 km",
      "battery": "94%",
      "plate": "EV-12KA-1234",
      "status": "Available",
      "price": "₹299/day",
    },
    {
      "name": "Evegah Fly",
      "category": "E-Scooter",
      "speed": "75 km/h",
      "range": "110 km",
      "battery": "100%",
      "plate": "EV-12KA-5678",
      "status": "Available",
      "price": "₹349/day",
    },
    {
      "name": "Evegah Pro",
      "category": "E-Scooter",
      "speed": "85 km/h",
      "range": "120 km",
      "battery": "88%",
      "plate": "EV-12KA-9012",
      "status": "Available",
      "price": "₹399/day",
    },
  ];

  @override
  Widget build(BuildContext context) {
    final vehicle = _vehicles[_selectedVehicleIndex];

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
          "Vehicle Selection",
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
            const StepperProgressBar(currentStep: 2),
            const SizedBox(height: 14),

            // 2. SEARCH & FILTER BAR
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: EmployeeTheme.borderColor),
              ),
              child: Row(
                children: const [
                  Icon(Icons.search_rounded, color: EmployeeTheme.textMuted, size: 20),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      "Search vehicle by model or registration plate...",
                      style: TextStyle(fontSize: 11.5, color: EmployeeTheme.textMuted),
                    ),
                  ),
                  Icon(Icons.tune_rounded, color: EmployeeTheme.brandPurple, size: 18),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // 3. AVAILABLE VEHICLES CARDS
            const Text(
              "Available EV Vehicles at Sayajigunj Hub",
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
              itemCount: _vehicles.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final item = _vehicles[index];
                final isSelected = index == _selectedVehicleIndex;

                return InkWell(
                  onTap: () {
                    setState(() => _selectedVehicleIndex = index);
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
                        // Vehicle Thumbnail Box
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: isSelected ? EmployeeTheme.limeGreenCircle : const Color(0xFFF0EFFE),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Icon(Icons.electric_scooter_rounded, color: EmployeeTheme.primaryPurple, size: 36),
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
                                    item['name'],
                                    style: const TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                      color: EmployeeTheme.textDark,
                                    ),
                                  ),
                                  Text(
                                    item['price'],
                                    style: const TextStyle(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w900,
                                      color: EmployeeTheme.brandPurple,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                "Plate: ${item['plate']} • Range: ${item['range']}",
                                style: const TextStyle(fontSize: 10.5, color: EmployeeTheme.textSecondary),
                              ),
                              const SizedBox(height: 6),
                              Row(
                                children: [
                                  const Icon(Icons.battery_charging_full_rounded, size: 14, color: EmployeeTheme.successGreen),
                                  const SizedBox(width: 4),
                                  Text(
                                    "${item['battery']} Battery",
                                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
                                  ),
                                  const SizedBox(width: 10),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: EmployeeTheme.successBg,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      item['status'],
                                      style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: EmployeeTheme.successGreen),
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

            // 4. ACCESSORIES SELECTION
            const Text(
              "Accessories & Add-ons",
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
                    value: _includeHelmet,
                    onChanged: (val) => setState(() => _includeHelmet = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Safety Helmet (Complimentary)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Clean ISI certified helmet for rider safety", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
                  ),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  CheckboxListTile(
                    value: _includeCharger,
                    onChanged: (val) => setState(() => _includeCharger = val ?? true),
                    activeColor: EmployeeTheme.primaryPurple,
                    title: const Text("Fast Portable Charger", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    subtitle: const Text("Include 72V portable fast home charger in trunk", style: TextStyle(fontSize: 10, color: EmployeeTheme.textSecondary)),
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
                      builder: (context) => NewRidePlanPricingScreen(selectedVehicle: vehicle),
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
                      "Continue to Plan & Pricing",
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
