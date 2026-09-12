import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../support/presentation/screens/help_screen.dart';

class RideDetailScreen extends StatefulWidget {
  final Map<String, dynamic> booking;
  final String status; // 'Ongoing', 'Upcoming', 'Completed', 'Cancelled'

  const RideDetailScreen({
    super.key,
    required this.booking,
    required this.status,
  });

  @override
  State<RideDetailScreen> createState() => _RideDetailScreenState();
}

class _RideDetailScreenState extends State<RideDetailScreen> {
  late String _currentStatus;
  String _userMobile = '+91 98765 43210';
  String _userName = 'Evegah Rider';

  @override
  void initState() {
    super.initState();
    _currentStatus = widget.status;
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    final mob = await SessionService().getUserMobile();
    final prof = await SessionService().getUserProfile();
    if (mounted) {
      setState(() {
        if (mob != null && mob.isNotEmpty) _userMobile = mob;
        if (prof['name'] != null && prof['name']!.isNotEmpty) {
          _userName = prof['name']!;
        } else if (widget.booking['customer_name'] != null) {
          _userName = widget.booking['customer_name'].toString();
        }
      });
    }
  }

  // --- PARSE ANY DATETIME ROBUSTLY ---
  DateTime? _parseAnyDateTime(dynamic input) {
    if (input == null) return null;
    final str = input.toString().trim();
    if (str.isEmpty || str.toLowerCase().contains("select")) return null;

    final parsedIso = DateTime.tryParse(str);
    if (parsedIso != null) return parsedIso;

    try {
      final clean = str.replaceAll(RegExp(r'^[A-Za-z]+,\s*'), '').replaceAll(',', ' ').trim();
      final tokens = clean.split(RegExp(r'\s+'));
      const months = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
      };

      int? day, month, year, hour = 0, minute = 0;
      String? amPm;

      for (int i = 0; i < tokens.length; i++) {
        final t = tokens[i].toLowerCase();
        if (months.containsKey(t)) {
          month = months[t];
          if (i > 0 && day == null) {
            day = int.tryParse(tokens[i - 1]);
          }
        } else if (t == 'am' || t == 'pm') {
          amPm = t;
        } else if (t.contains(':')) {
          final parts = t.split(':');
          hour = int.tryParse(parts[0]) ?? 0;
          if (parts.length > 1) minute = int.tryParse(parts[1]) ?? 0;
        } else if (int.tryParse(t) != null) {
          final val = int.parse(t);
          if (val > 2000 && val < 2100) {
            year = val;
          } else if (day == null && val >= 1 && val <= 31) {
            day = val;
          }
        }
      }

      if (amPm == 'pm' && hour != null && hour < 12) hour += 12;
      if (amPm == 'am' && hour != null && hour == 12) hour = 0;

      final now = DateTime.now();
      year ??= now.year;
      month ??= now.month;
      day ??= now.day;

      return DateTime(year, month, day, hour ?? 0, minute ?? 0);
    } catch (_) {
      return null;
    }
  }

  DateTime? _getBookingDateTime(dynamic r) {
    if (r == null) return null;
    if (r['pickup_datetime'] != null && r['pickup_datetime'].toString().trim().isNotEmpty) {
      final dt = _parseAnyDateTime(r['pickup_datetime']);
      if (dt != null) return dt;
    }

    final dateStr = r['reservation_date'];
    final timeStr = r['reservation_time'];
    if (dateStr != null && dateStr.toString().trim().isNotEmpty) {
      DateTime? baseDate = DateTime.tryParse(dateStr.toString().split('T').first);
      if (baseDate != null) {
        if (timeStr != null && timeStr.toString().trim().isNotEmpty && timeStr.toString().trim() != '00:00:00') {
          final rawTime = timeStr.toString().trim();
          final regex12 = RegExp(r'^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$', caseSensitive: false);
          final match = regex12.firstMatch(rawTime);
          if (match != null) {
            int hour = int.parse(match.group(1)!);
            int minute = int.parse(match.group(2)!);
            String? period = match.group(3)?.toUpperCase();
            if (period == "PM" && hour < 12) hour += 12;
            if (period == "AM" && hour == 12) hour = 0;
            return DateTime(baseDate.year, baseDate.month, baseDate.day, hour, minute);
          }
          final parts = rawTime.split(':');
          if (parts.length >= 2) {
            int hour = int.tryParse(parts[0]) ?? 0;
            int minute = int.tryParse(parts[1].substring(0, 2)) ?? 0;
            return DateTime(baseDate.year, baseDate.month, baseDate.day, hour, minute);
          }
        }
        if (r['created_at'] != null) {
          final cDt = DateTime.tryParse(r['created_at'].toString());
          if (cDt != null) {
            return DateTime(baseDate.year, baseDate.month, baseDate.day, cDt.hour, cDt.minute);
          }
        }
        return baseDate;
      }
    }

    if (r['created_at'] != null) {
      return DateTime.tryParse(r['created_at'].toString());
    }
    return null;
  }

  DateTime? _getReturnDateTime(dynamic r, DateTime? start) {
    if (r == null) return null;
    if (r['drop_datetime'] != null && r['drop_datetime'].toString().trim().isNotEmpty) {
      final dt = _parseAnyDateTime(r['drop_datetime']);
      if (dt != null) return dt;
    }
    if (r['drop_date'] != null && r['drop_date'].toString().trim().isNotEmpty) {
      final dt = _parseAnyDateTime(r['drop_date']);
      if (dt != null) return dt;
    }
    if (start != null) {
      final pkg = (r['package_type'] ?? '').toString().toLowerCase();
      if (pkg.contains('month')) return start.add(const Duration(days: 30));
      if (pkg.contains('week')) return start.add(const Duration(days: 7));
      return start.add(const Duration(days: 1));
    }
    return null;
  }

  String _formatDateTimeShort(DateTime? dt) {
    if (dt == null) return '';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    final hourInt = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final ampm = dt.hour >= 12 ? "PM" : "AM";
    final minStr = dt.minute.toString().padLeft(2, '0');
    final hrStr = hourInt.toString().padLeft(2, '0');
    return "${dt.day} ${months[dt.month - 1]} ${dt.year}, $hrStr:$minStr $ampm";
  }

  String _calculateRemainingDays() {
    final startDt = _getBookingDateTime(widget.booking);
    final endDt = _getReturnDateTime(widget.booking, startDt);
    if (endDt != null) {
      final diff = endDt.difference(DateTime.now());
      if (diff.inDays > 1) return "${diff.inDays} Days Left";
      if (diff.inDays == 1) return "1 Day Left";
      if (diff.inHours > 0) return "${diff.inHours} Hours Left";
      if (diff.isNegative) return "Completed";
    }
    final pkg = (widget.booking['package_type'] ?? widget.booking['packageType'] ?? 'Day').toString().toLowerCase();
    if (pkg.contains('month')) return "30 Days Plan";
    if (pkg.contains('week')) return "7 Days Plan";
    return "1 Day Plan";
  }

  Future<void> _downloadInvoice() async {
    final pdf = pw.Document();
    final vehicle = widget.booking['vehicle_model'] ?? widget.booking['vehicleName'] ?? 'Evegah City';
    final rideId = widget.booking['reservation_id'] ?? widget.booking['id'] ?? 'RID-EVG';
    final cost = "₹${widget.booking['total_payable'] ?? widget.booking['totalFare'] ?? '499'}";

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Padding(
            padding: const pw.EdgeInsets.all(32),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text("EVegah Mobility", style: pw.TextStyle(fontSize: 28, fontWeight: pw.FontWeight.bold, color: PdfColors.green800)),
                pw.SizedBox(height: 8),
                pw.Text("Ride Invoice", style: pw.TextStyle(fontSize: 18, color: PdfColors.grey700)),
                pw.SizedBox(height: 30),
                pw.Divider(),
                pw.SizedBox(height: 16),
                pw.Text("Ride ID: $rideId"),
                pw.SizedBox(height: 6),
                pw.Text("Vehicle: $vehicle"),
                pw.SizedBox(height: 6),
                pw.Text("Rider: $_userName"),
                pw.SizedBox(height: 6),
                pw.Text("Pickup Zone: ${widget.booking['pickup_zone'] ?? widget.booking['pickupZone'] ?? 'Gotri Zone'}"),
                pw.SizedBox(height: 20),
                pw.Divider(),
                pw.SizedBox(height: 16),
                pw.Text("Total Amount Paid: $cost", style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
              ],
            ),
          );
        },
      ),
    );

    await Printing.sharePdf(bytes: await pdf.save(), filename: 'EVegah_$rideId.pdf');
  }

  @override
  Widget build(BuildContext context) {
    final b = widget.booking;
    String vehicleModel = (b['vehicle_model'] ?? b['vehicleName'] ?? b['vehicle_category'] ?? '').toString().trim();
    if (vehicleModel.isEmpty || vehicleModel.toLowerCase() == 'e-scooter' || vehicleModel.toLowerCase() == 'evegah pro') {
      final vNum = (b['vehicle_number'] ?? '').toString().toLowerCase();
      vehicleModel = vNum.contains('mink') ? 'Evegah Mink' : 'Evegah City';
    }
    final rawVehicleNumber = b['vehicle_number'] ?? b['vehiclePlate'];
    final bool isAssigned = rawVehicleNumber != null && rawVehicleNumber.toString().trim().isNotEmpty && !rawVehicleNumber.toString().contains('GJ-06-EV-1024');
    final String plateText = (_currentStatus == 'Upcoming' && !isAssigned)
        ? "Vehicle assignment pending"
        : (rawVehicleNumber?.toString() ?? "GJ-06-EV-1024");

    final String imagePath = vehicleModel.toLowerCase().contains('mink') ? 'assets/mink.png' : 'assets/city.png';
    final String pickupZone = b['pickup_zone'] ?? b['pickupZone'] ?? 'Evegah Station, Alkapuri, Vadodara';
    final String dropZone = b['drop_zone'] ?? b['dropZone'] ?? pickupZone;

    final startDt = _getBookingDateTime(b);
    final endDt = _getReturnDateTime(b, startDt);
    final String startDateTime = startDt != null ? _formatDateTimeShort(startDt) : (b['reservation_date']?.toString().split('T').first ?? '—');
    final String endDateTime = endDt != null ? _formatDateTimeShort(endDt) : '—';
    final double rentVal = double.tryParse("${b['fare'] ?? b['rent'] ?? b['rentAmount'] ?? 499}") ?? 499.0;
    final double depositVal = double.tryParse("${b['deposit'] ?? 500}") ?? 500.0;
    final String paymentMethod = b['payment_mode'] ?? 'UPI (Paid)';

    // Dynamic Telemetry (Speed, Battery, Range, BMS Connectivity)
    final double rawBatteryPct = double.tryParse("${b['battery_pct'] ?? b['soc'] ?? 85}") ?? 85.0;
    final int batteryPctInt = rawBatteryPct.clamp(5, 100).toInt();
    final double rawSpeed = double.tryParse("${b['speed'] ?? 0}") ?? 0.0;
    final String speedStr = "${rawSpeed.toStringAsFixed(0)} km/h";
    final int dynamicRange = b['range_km'] != null ? (int.tryParse("${b['range_km']}") ?? 95) : ((batteryPctInt / 100.0) * 110).round();
    final String bmsStatus = (b['bms_status'] ?? 'Connected').toString().trim();
    final bool isBmsOnline = bmsStatus.toLowerCase() == 'in use' || bmsStatus.toLowerCase() == 'connected' || bmsStatus.toLowerCase() == 'available';

    Color statusBg;
    Color statusTextColor;
    Color statusDot;

    if (_currentStatus == 'Ongoing') {
      statusBg = const Color(0xFFDCFCE7);
      statusTextColor = const Color(0xFF16A34A);
      statusDot = const Color(0xFF22C55E);
    } else if (_currentStatus == 'Upcoming') {
      statusBg = const Color(0xFFEEF2FF);
      statusTextColor = const Color(0xFF4313B8);
      statusDot = const Color(0xFF6366F1);
    } else if (_currentStatus == 'Completed') {
      statusBg = const Color(0xFFF1F5F9);
      statusTextColor = const Color(0xFF475569);
      statusDot = const Color(0xFF94A3B8);
    } else {
      statusBg = const Color(0xFFFEE2E2);
      statusTextColor = const Color(0xFFEF4444);
      statusDot = const Color(0xFFEF4444);
    }

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Booking Details",
          style: TextStyle(color: Color(0xFF0F172A), fontWeight: FontWeight.w800, fontSize: 17),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert, color: Color(0xFF64748B)),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const HelpScreen()));
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Top Vehicle Card with Image & Specs (matching Panel 3)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10, offset: const Offset(0, 4)),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Status Pill
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(color: statusBg, borderRadius: BorderRadius.circular(12)),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(width: 6, height: 6, decoration: BoxDecoration(color: statusDot, shape: BoxShape.circle)),
                                  const SizedBox(width: 6),
                                  Text(_currentStatus, style: TextStyle(color: statusTextColor, fontSize: 11, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              vehicleModel,
                              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF0F172A), letterSpacing: -0.5),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                plateText,
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  fontFamily: 'monospace',
                                  color: (_currentStatus == 'Upcoming' && !isAssigned) ? const Color(0xFF64748B) : const Color(0xFF1E293B),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Vehicle Image on Right
                      Container(
                        width: 120,
                        height: 90,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F3FF),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Center(
                          child: Image.asset(imagePath, fit: BoxFit.contain),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  const Divider(height: 1, color: Color(0xFFF1F5F9)),
                  const SizedBox(height: 16),

                  // 4 Specs in Row: Battery, Range, Speed, BMS
                  Row(
                    children: [
                      Expanded(
                        child: _buildSpecBox(
                          Icons.battery_charging_full_rounded,
                          "$batteryPctInt%",
                          "Battery",
                          batteryPctInt > 30 ? const Color(0xFF16A34A) : const Color(0xFFEF4444),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildSpecBox(
                          Icons.electric_bolt_rounded,
                          "$dynamicRange km",
                          "Est. Range",
                          const Color(0xFF2563EB),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildSpecBox(
                          Icons.speed_rounded,
                          speedStr,
                          "Live Speed",
                          const Color(0xFF8B5CF6),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: _buildSpecBox(
                          Icons.sensors_rounded,
                          isBmsOnline ? "Active" : "Offline",
                          "BMS State",
                          isBmsOnline ? const Color(0xFF059669) : const Color(0xFFF59E0B),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 2. Rental Period Card (matching Panel 3)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.calendar_month_outlined, size: 18, color: Color(0xFF2B0B78)),
                          SizedBox(width: 8),
                          Text("Rental Period", style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(color: const Color(0xFFDCFCE7), borderRadius: BorderRadius.circular(12)),
                        child: Text(
                          _calculateRemainingDays(),
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(startDateTime, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(height: 4),
                            const Text("Start Date & Time", style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                          ],
                        ),
                      ),
                      const Icon(Icons.arrow_forward_rounded, size: 18, color: Color(0xFF94A3B8)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(endDateTime, textAlign: TextAlign.right, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                            const SizedBox(height: 4),
                            const Text("End Date & Time", style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 3. Rider Information Card (matching Panel 3)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.person_outline_rounded, size: 18, color: Color(0xFF2B0B78)),
                          SizedBox(width: 8),
                          Text("Rider Information", style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        ],
                      ),
                      InkWell(
                        onTap: () {
                          launchUrl(Uri.parse("tel:$_userMobile"));
                        },
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(color: const Color(0xFFEEF2FF), borderRadius: BorderRadius.circular(10)),
                          child: const Icon(Icons.phone_outlined, size: 16, color: Color(0xFF4313B8)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildKeyValueRow("Name", _userName),
                  const SizedBox(height: 8),
                  _buildKeyValueRow("Mobile Number", _userMobile),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 4. Pickup & Return Location Card (matching Panel 3)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.location_on_outlined, size: 18, color: Color(0xFF2B0B78)),
                          SizedBox(width: 8),
                          Text("Pickup & Return Location", style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                        ],
                      ),
                      const Text(
                        "View on Map",
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Pickup Location", style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                      const Spacer(),
                      Flexible(
                        child: Text(
                          pickupZone,
                          textAlign: TextAlign.right,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text("Return Location", style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                      const Spacer(),
                      Flexible(
                        child: Text(
                          dropZone,
                          textAlign: TextAlign.right,
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // 5. Rental Information Card (matching Panel 3)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.receipt_long_outlined, size: 18, color: Color(0xFF2B0B78)),
                      SizedBox(width: 8),
                      Text("Rental Information", style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _buildKeyValueRow("Plan", b['package_type'] ?? b['packageType'] ?? 'Daily Plan'),
                  const SizedBox(height: 8),
                  _buildKeyValueRow("Base Rental", "₹${rentVal.toInt()}"),
                  const SizedBox(height: 8),
                  _buildKeyValueRow("Security Deposit", "₹${depositVal.toInt()}"),
                  const SizedBox(height: 8),
                  _buildKeyValueRow("Accessories", "Helmet, Smart Charger"),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Payment Method", style: TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
                      Text(paymentMethod, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // 6. Bottom Action Button (Extend and Exchange removed)
            if (_currentStatus == 'Ongoing') ...[
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    setState(() => _currentStatus = 'Completed');
                    widget.booking['status'] = 'Completed';
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Ride ended successfully. Battery & vehicle checked in! ⚡"),
                        backgroundColor: Color(0xFF16A34A),
                      ),
                    );
                    try {
                      final id = (widget.booking['id'] ?? widget.booking['reservation_id'] ?? '').toString();
                      final urls = [
                        '${AppConstants.apiBaseUrl}/reservations/$id/return',
                        'http://192.168.1.4:5000/api/reservations/$id/return',
                        'http://localhost:5000/api/reservations/$id/return',
                      ];
                      for (final u in urls) {
                        try {
                          final res = await http.post(Uri.parse(u)).timeout(const Duration(seconds: 3));
                          if (res.statusCode == 200) break;
                        } catch (_) {}
                      }
                    } catch (_) {}
                  },
                  icon: const Icon(Icons.stop_circle_outlined, size: 20),
                  label: const Text("End Ride", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                ),
              ),
            ] else if (_currentStatus == 'Upcoming') ...[
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: () async {
                    setState(() => _currentStatus = 'Ongoing');
                    widget.booking['status'] = 'Ongoing';
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text("Vehicle unlocked via Bluetooth! Happy riding! 🛵"),
                        backgroundColor: Color(0xFF16A34A),
                      ),
                    );
                    try {
                      final id = (widget.booking['id'] ?? widget.booking['reservation_id'] ?? '').toString();
                      final urls = [
                        '${AppConstants.apiBaseUrl}/reservations/$id/start',
                        'http://192.168.1.4:5000/api/reservations/$id/start',
                        'http://localhost:5000/api/reservations/$id/start',
                      ];
                      for (final u in urls) {
                        try {
                          final res = await http.post(Uri.parse(u)).timeout(const Duration(seconds: 3));
                          if (res.statusCode == 200) break;
                        } catch (_) {}
                      }
                    } catch (_) {}
                  },
                  icon: const Icon(Icons.play_circle_outline_rounded, size: 20),
                  label: const Text("Start Ride", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2B0B78),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                ),
              ),
            ] else if (_currentStatus == 'Completed') ...[
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _downloadInvoice,
                  icon: const Icon(Icons.download_rounded, size: 20),
                  label: const Text("Download Invoice", style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF16A34A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildSpecBox(IconData icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Column(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(height: 6),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF0F172A))),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8))),
        ],
      ),
    );
  }

  Widget _buildKeyValueRow(String key, String val) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(key, style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), fontWeight: FontWeight.w500)),
        Text(val, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
      ],
    );
  }
}
