import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../dashboard/presentation/screens/main_navigation.dart';
import '../../../kyc/presentation/screens/kyc_screen.dart';
import '../../../wallet/presentation/screens/payment_screen.dart';
import '../../../../core/services/session_service.dart';

class BookingConfirmedScreen extends StatefulWidget {
  final bool isDepositPaid;
  final String reservationId;
  final Map<String, dynamic>? bookingData;

  const BookingConfirmedScreen({
    super.key,
    this.isDepositPaid = false,
    this.reservationId = '',
    this.bookingData,
  });

  @override
  State<BookingConfirmedScreen> createState() => _BookingConfirmedScreenState();
}

class _BookingConfirmedScreenState extends State<BookingConfirmedScreen> {
  late bool _depositPaid;
  Map<String, dynamic>? _fetchedReservation;

  @override
  void initState() {
    super.initState();
    _depositPaid = widget.isDepositPaid;
    SessionService().setFirstRideBooked(true);
    _fetchBackendReservation();
  }

  Future<void> _fetchBackendReservation() async {
    if (widget.reservationId.isEmpty) return;
    try {
      final res = await http.get(Uri.parse('${AppConstants.apiBaseUrl}/reservations/${widget.reservationId}')).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['data'] != null && mounted) {
          setState(() {
            _fetchedReservation = data['data'];
          });
        }
      }
    } catch (e) {
      debugPrint("Fetch reservation details error: $e");
    }
  }

  void _copyBookingId() {
    final id = widget.reservationId.isNotEmpty ? widget.reservationId : 'EVG12345678';
    Clipboard.setData(ClipboardData(text: id));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text("Booking ID copied to clipboard!"),
        duration: Duration(seconds: 1),
      ),
    );
  }

  DateTime? _parseAnyDate(String str) {
    if (str.trim().isEmpty) return null;
    try {
      return DateTime.parse(str.trim());
    } catch (_) {}

    // Parse "20 Aug 2026 10:00 AM" or "20 Aug 2026, 10:00 AM"
    try {
      final months = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
      };
      final clean = str.replaceAll(',', '').trim();
      final parts = clean.split(RegExp(r'\s+'));
      if (parts.length >= 3) {
        final day = int.parse(parts[0]);
        final monthStr = parts[1].substring(0, 3).toLowerCase();
        final month = months[monthStr] ?? 1;
        final year = int.parse(parts[2]);

        int hour = 0;
        int minute = 0;
        if (parts.length >= 4 && parts[3].contains(':')) {
          final timeParts = parts[3].split(':');
          hour = int.parse(timeParts[0]);
          minute = int.parse(timeParts[1]);
          if (parts.length >= 5) {
            final ampm = parts[4].toUpperCase();
            if (ampm == 'PM' && hour < 12) hour += 12;
            if (ampm == 'AM' && hour == 12) hour = 0;
          }
        }
        return DateTime(year, month, day, hour, minute);
      }
    } catch (_) {}
    return null;
  }

  String _getDynamicDuration() {
    final String pickup = widget.bookingData?['pickupRaw'] ?? widget.bookingData?['pickupTime'] ?? _fetchedReservation?['reservation_date'] ?? '';
    final String drop = widget.bookingData?['dropRaw'] ?? widget.bookingData?['dropTime'] ?? _fetchedReservation?['drop_date'] ?? '';
    final String? pkg = _fetchedReservation?['package_type'] ?? widget.bookingData?['packageType'];

    final pDate = _parseAnyDate(pickup);
    final dDate = _parseAnyDate(drop);

    if (pDate != null && dDate != null) {
      final hours = dDate.difference(pDate).inHours;
      final days = (hours / 24).round();
      if (days >= 28 || pkg == 'Month') {
        return "30 Days (1 Month)";
      } else if (days >= 6 || pkg == 'Week') {
        return "7 Days (1 Week)";
      } else if (days >= 1 || pkg == 'Day') {
        return "$days ${days == 1 ? 'Day' : 'Days'}";
      } else if (hours > 0) {
        return "$hours ${hours == 1 ? 'Hour' : 'Hours'}";
      }
    }

    if (pkg == 'Day') return "1 Day";
    if (pkg == 'Week') return "7 Days (1 Week)";
    if (pkg == 'Month') return "30 Days (1 Month)";
    return "1 Day";
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black87),
          onPressed: () {
            // Go back to main navigation (index 0 - Home)
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(builder: (context) => const MainNavigation(initialIndex: 0)),
              (route) => false,
            );
          },
        ),
        title: Row(
          children: const [
            Text(
              "Booking Confirmed!",
              style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.bold, fontSize: 18),
            ),
            SizedBox(width: 6),
            Icon(Icons.check_circle, color: Color(0xFF10B981), size: 18),
          ],
        ),
        centerTitle: false,
        actions: [
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.headset_mic_outlined, size: 16, color: Color(0xFF4313B8)),
            label: const Text(
              "Help",
              style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 12),
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Subtitle
            Container(
              width: double.infinity,
              color: Colors.white,
              padding: const EdgeInsets.only(left: 16, bottom: 12),
              child: const Text(
                "Pay anytime before ride starts",
                style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w500),
              ),
            ),

            // 1. Booking ID Header Card
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Booking ID", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Text(
                            widget.reservationId.isNotEmpty ? widget.reservationId : "EVG12345678",
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1E293B)),
                          ),
                          const SizedBox(width: 8),
                          GestureDetector(
                            onTap: _copyBookingId,
                            child: const Icon(Icons.copy, size: 16, color: Color(0xFF4313B8)),
                          ),
                        ],
                      )
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text("Booking Status", style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          "Confirmed",
                          style: TextStyle(color: Color(0xFF15803D), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  )
                ],
              ),
            ),

            // 2. Payment Pending Alert (only if unpaid)
            if (!_depositPaid)
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 16),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFDCFCE7)),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: const BoxDecoration(
                        color: Color(0xFFDCFCE7),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.account_balance_wallet_outlined, color: Color(0xFF16A34A), size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Payment Pending",
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF15803D)),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "You can pay the refundable deposit anytime before ride starts",
                            style: TextStyle(color: Colors.grey, fontSize: 10, height: 1.3),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const PaymentScreen()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF15803D),
                        foregroundColor: Colors.white,
                        minimumSize: const Size(80, 34),
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      child: const Text("Pay Now", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),

            // 3. Vehicle Detail Card
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 70,
                    height: 70,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Image.asset(
                      widget.bookingData?['vehicleImage'] ?? "assets/city.png",
                      fit: BoxFit.contain,
                      errorBuilder: (_, __, ___) => const Icon(Icons.electric_scooter, size: 40, color: Color(0xFF4313B8)),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              widget.bookingData?['vehicleName'] ?? _fetchedReservation?['vehicle_model'] ?? "Evegah City",
                              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEEF2FF),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: const Text(
                                "Self-Drive",
                                style: TextStyle(color: Color(0xFF4313B8), fontSize: 8, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.bolt, color: Color(0xFF4313B8), size: 12),
                            const SizedBox(width: 4),
                            Text(widget.bookingData?['vehicleRange'] ?? "80–100 km range", style: const TextStyle(color: Colors.grey, fontSize: 10)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.speed, color: Color(0xFF4313B8), size: 12),
                            const SizedBox(width: 4),
                            Text(widget.bookingData?['vehicleSpeed'] ?? "45 km/h top speed", style: const TextStyle(color: Colors.grey, fontSize: 10)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: const [
                            Icon(Icons.airline_seat_recline_normal, color: Color(0xFF4313B8), size: 12),
                            SizedBox(width: 4),
                            Text("1 Seat", style: TextStyle(color: Colors.grey, fontSize: 10)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: const [
                            Icon(Icons.battery_charging_full, color: Color(0xFF4313B8), size: 12),
                            SizedBox(width: 4),
                            Text("100% Charge", style: TextStyle(color: Colors.grey, fontSize: 10)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        widget.bookingData?['totalFare'] != null
                            ? "₹${(widget.bookingData!['totalFare'] as num).toStringAsFixed(0)}"
                            : "₹350/day",
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0FDF4),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: const Color(0xFFBBF7D0)),
                        ),
                        child: const Text(
                          "Available",
                          style: TextStyle(color: Color(0xFF16A34A), fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 4. Ride Schedule
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.calendar_month, color: Color(0xFF4313B8), size: 18),
                      SizedBox(width: 8),
                      Text("Ride Schedule", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1E293B))),
                    ],
                  ),
                  GestureDetector(
                    onTap: () {},
                    child: Row(
                      children: const [
                        Icon(Icons.my_location, color: Color(0xFF4313B8), size: 14),
                        SizedBox(width: 4),
                        Text("View on Map", style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 11)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Dotted Schedule Cards
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  // Timeline column
                  Column(
                    children: [
                      Container(
                        width: 14,
                        height: 14,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF4313B8), width: 3),
                        ),
                      ),
                      Container(
                        width: 1.5,
                        height: 40,
                        color: Colors.grey.shade300,
                      ),
                      Container(
                        width: 14,
                        height: 14,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: const Color(0xFF4313B8), width: 3),
                        ),
                      ),
                      Container(
                        width: 1.5,
                        height: 40,
                        color: Colors.grey.shade300,
                      ),
                      Container(
                        width: 14,
                        height: 14,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.grey, width: 2),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(width: 16),
                  // Details Column
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Pickup
                        const Text("Pickup", style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 11)),
                        const SizedBox(height: 2),
                        Text(
                          widget.bookingData?['pickupTime'] ?? _fetchedReservation?['reservation_date'] ?? "20 Aug 2026, 10:00 AM",
                          style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 14),
                        // Return
                        const Text("Return", style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 11)),
                        const SizedBox(height: 2),
                        Text(
                          widget.bookingData?['dropTime'] ?? _fetchedReservation?['drop_date'] ?? "21 Aug 2026, 06:00 PM",
                          style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 14),
                        // Duration
                        const Text("Duration", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 11)),
                        const SizedBox(height: 2),
                        Text(_getDynamicDuration(), style: const TextStyle(color: Color(0xFF1E293B), fontSize: 10, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                  // Location Summary column
                  Expanded(
                    child: Builder(
                      builder: (context) {
                        final bool isDoorstep = widget.bookingData?['isDoorstep'] == true ||
                            (_fetchedReservation?['doorstep_delivery'] == true);
                        final String doorstepAddress = widget.bookingData?['doorstepAddress'] ??
                            _fetchedReservation?['doorstep_address'] ??
                            _fetchedReservation?['drop_zone'] ?? '';
                        final String baseZone = widget.bookingData?['pickupZone'] ??
                            _fetchedReservation?['pickup_zone'] ?? "Gotri Zone";

                        final String locName = (isDoorstep && doorstepAddress.isNotEmpty) ? doorstepAddress : baseZone;

                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    locName,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF1E293B)),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                if (isDoorstep) ...[
                                  const SizedBox(width: 4),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFF0FDF4),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text("Doorstep", style: TextStyle(color: Color(0xFF16A34A), fontSize: 8, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              isDoorstep && doorstepAddress.isNotEmpty
                                  ? "$doorstepAddress (Doorstep Delivery)"
                                  : "$baseZone, Vadodara",
                              style: TextStyle(
                                color: isDoorstep ? const Color(0xFF16A34A) : Colors.grey,
                                fontSize: 9,
                                height: 1.3,
                                fontWeight: isDoorstep ? FontWeight.w600 : FontWeight.normal,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 18),
                            GestureDetector(
                              onTap: () {},
                              child: Text(
                                isDoorstep ? "Deliver to Doorstep" : "Same as Pickup",
                                style: const TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 10, decoration: TextDecoration.underline),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(height: 30),
                          ],
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // 5. What's next banner
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF5F3FF),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFDDD6FE)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: const BoxDecoration(color: Color(0xFFEEF2FF), shape: BoxShape.circle),
                    child: const Icon(Icons.info, color: Color(0xFF4313B8), size: 20),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text("What's next?", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF4313B8))),
                        SizedBox(height: 4),
                        Text(
                          "Reach your pickup zone 10 mins before your pickup time.\nComplete E-KYC and pay the deposit anytime before your ride starts.",
                          style: TextStyle(color: Color(0xFF5B21B6), fontSize: 10, height: 1.4),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right, color: Color(0xFF8B5CF6)),
                ],
              ),
            ),

            // 6. Complete E-KYC Card
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(10)),
                        child: const Icon(Icons.shield_outlined, color: Color(0xFF4313B8), size: 20),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Wrap(
                              crossAxisAlignment: WrapCrossAlignment.center,
                              children: [
                                const Text("Complete E-KYC", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(6)),
                                  child: const Text("Required", style: TextStyle(color: Color(0xFF4313B8), fontSize: 8, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            const Text("Complete E-KYC to unlock ride.", style: TextStyle(color: Colors.grey, fontSize: 10)),
                          ],
                        ),
                      ),
                      OutlinedButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => const KycScreen(),
                            ),
                          ).then((_) {
                            setState(() {});
                          });
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFF4313B8),
                          side: const BorderSide(color: Color(0xFF4313B8)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          minimumSize: Size.zero,
                        ),
                        child: const Text("Start E-KYC", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: Color(0xFFF1F5F9)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _buildKycMetric(Icons.check_circle_outline, "Quick & Secure", "Takes < 2 mins"),
                      _buildKycMetric(Icons.badge_outlined, "Aadhaar Verified", "100% secure"),
                      _buildKycMetric(Icons.lock_open, "Required for Unlock", "Complete before start"),
                    ],
                  ),
                ],
              ),
            ),

            // 7. Booking Summary Section
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Booking Summary", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                  const SizedBox(height: 14),
                  _buildSummaryRow(
                    "Rental Charges (${_getDynamicDuration()})",
                    widget.bookingData?['rentAmount'] != null
                        ? "₹${(widget.bookingData!['rentAmount'] as num).toStringAsFixed(2)}"
                        : "₹${_fetchedReservation?['fare'] ?? '350.00'}",
                  ),
                  if (widget.bookingData?['doorstepFee'] != null && (widget.bookingData!['doorstepFee'] as num) > 0) ...[
                    const SizedBox(height: 10),
                    _buildSummaryRow("Doorstep Delivery Fee", "+₹${(widget.bookingData!['doorstepFee'] as num).toStringAsFixed(2)}"),
                  ],
                  const SizedBox(height: 10),
                  _buildSummaryRow("Platform Fee", "₹5.00"),
                  const SizedBox(height: 10),
                  _buildSummaryRow("Taxes", "₹2.50"),
                  const SizedBox(height: 12),
                  const Divider(color: Color(0xFFF1F5F9)),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Total Payable", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                      Text(
                        widget.bookingData?['totalFare'] != null
                            ? "₹${(widget.bookingData!['totalFare'] as num).toStringAsFixed(2)}"
                            : "₹${_fetchedReservation?['total_payable'] ?? _fetchedReservation?['fare'] ?? '357.50'}",
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: Color(0xFF4313B8)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // Refundable Deposit row
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: const [
                            Icon(Icons.check_circle, color: Color(0xFF16A34A), size: 16),
                            SizedBox(width: 8),
                            Text("Refundable Deposit", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF16A34A))),
                          ],
                        ),
                        Text(
                          widget.bookingData?['deposit'] != null
                              ? "₹${(widget.bookingData!['deposit'] as num).toStringAsFixed(0)}"
                              : "₹${_fetchedReservation?['deposit'] ?? '500'}",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: const Color(0xFF16A34A),
                            decoration: _depositPaid ? TextDecoration.none : TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, -2))],
        ),
        child: Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 54,
                child: OutlinedButton(
                  onPressed: _depositPaid
                      ? null
                      : () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const PaymentScreen()),
                          );
                        },
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF4313B8),
                    side: const BorderSide(color: Color(0xFFDDD6FE), width: 1.5),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _depositPaid ? "Deposit Paid" : "Pay Now",
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _depositPaid ? "Successfully paid" : "Pay the deposit anytime",
                        style: const TextStyle(color: Colors.grey, fontSize: 8),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2B0B78), // Deep purple
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: Builder(
                    builder: (context) {
                      final bool isDoorstep = widget.bookingData?['isDoorstep'] == true ||
                          (_fetchedReservation?['doorstep_delivery'] == true);
                      return Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            isDoorstep ? "Doorstep Delivery Location" : "Navigate to Pickup Zone",
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            isDoorstep ? "Vehicle will be delivered to doorstep" : "Reach 10 mins before pickup time",
                            style: const TextStyle(color: Colors.white70, fontSize: 8),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      persistentFooterButtons: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildFooterNavButton(Icons.calendar_today_outlined, "Add to Calendar", () {}),
              _buildFooterNavButton(Icons.share_outlined, "Share Booking", () {}),
              _buildFooterNavButton(Icons.receipt_long_outlined, "View My Bookings", () {
                // Navigate to bookings list (MainNavigation at index 1)
                Navigator.pushAndRemoveUntil(
                  context,
                  MaterialPageRoute(builder: (context) => const MainNavigation(initialIndex: 1)),
                  (route) => false,
                );
              }),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500)),
        Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
      ],
    );
  }

  Widget _buildKycMetric(IconData icon, String title, String subtitle) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF4313B8), size: 16),
        const SizedBox(height: 4),
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 9, color: Color(0xFF1E293B))),
        const SizedBox(height: 2),
        Text(subtitle, style: const TextStyle(color: Colors.grey, fontSize: 8)),
      ],
    );
  }

  Widget _buildFooterNavButton(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        child: Row(
          children: [
            Icon(icon, size: 14, color: const Color(0xFF4313B8)),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 10),
            ),
          ],
        ),
      ),
    );
  }
}
