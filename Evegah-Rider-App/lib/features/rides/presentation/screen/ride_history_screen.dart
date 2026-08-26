import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'booking_confirmed_screen.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../support/presentation/screens/help_screen.dart';

class RideHistoryScreen extends StatefulWidget {
  const RideHistoryScreen({super.key});

  @override
  State<RideHistoryScreen> createState() => _RideHistoryScreenState();
}

class _RideHistoryScreenState extends State<RideHistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _reservations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
    _fetchReservations();
  }

  Future<void> _fetchReservations() async {
    setState(() {
      _isLoading = true;
    });

    final mobile = await SessionService().getUserMobile() ?? "+91 98765 43210";
    final urls = [
      '${AppConstants.apiBaseUrl}/reservations?limit=100&search=${Uri.encodeComponent(mobile)}',
      'http://192.168.1.4:5000/api/reservations?limit=100&search=${Uri.encodeComponent(mobile)}',
      'http://localhost:5000/api/reservations?limit=100&search=${Uri.encodeComponent(mobile)}',
    ];

    for (final url in urls) {
      try {
        final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'success' && data['data'] != null) {
            if (mounted) {
              setState(() {
                _reservations = data['data'];
                _isLoading = false;
              });
            }
            return;
          }
        }
      } catch (e) {
        debugPrint("Failed to fetch reservations from $url: $e");
      }
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  // --- PDF GENERATION LOGIC ---
  Future<void> _generateAndDownloadInvoice(String vehicle, String rideId, String date, String cost, String distance, String time) async {
    final pdf = pw.Document();

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
                pw.Text("Official Ride Invoice", style: pw.TextStyle(fontSize: 18, color: PdfColors.grey700)),
                pw.SizedBox(height: 40),
                pw.Divider(),
                pw.SizedBox(height: 20),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Ride ID:"), pw.Text(rideId, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Vehicle:"), pw.Text(vehicle, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Date:"), pw.Text(date, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Distance Covered:"), pw.Text(distance, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Total Time:"), pw.Text(time, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 30),
                pw.Divider(),
                pw.SizedBox(height: 20),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text("Total Amount Paid:", style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                    pw.Text(cost, style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold, color: PdfColors.green800)),
                  ],
                ),
                pw.SizedBox(height: 40),
                pw.Text("Thank you for riding smart and riding green!", style: pw.TextStyle(fontStyle: pw.FontStyle.italic, color: PdfColors.grey)),
              ],
            ),
          );
        },
      ),
    );

    await Printing.sharePdf(
      bytes: await pdf.save(),
      filename: 'EVegah_Invoice_$rideId.pdf',
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        title: const Text(
          "My Bookings",
          style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search, color: Color(0xFF1E293B)),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.filter_list, color: Color(0xFF1E293B)),
            onPressed: () {},
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF4313B8),
          unselectedLabelColor: Colors.grey,
          indicatorColor: const Color(0xFF4313B8),
          indicatorWeight: 3,
          labelPadding: const EdgeInsets.symmetric(horizontal: 8.0), // 🚨 REDUCE: Tightens the space between tabs
          labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 12),
          
          tabs: const [
            Tab(text: "Upcoming"),
            Tab(text: "Ongoing"),
            Tab(text: "Completed"),
            Tab(text: "Cancelled"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildUpcomingTab(),
          _buildOngoingTab(),
          _buildCompletedTab(),
          _buildCancelledTab(),
        ],
      ),
    );
  }

  DateTime? _parseDateTime(dynamic dateStr, dynamic timeStr) {
    if (dateStr == null || dateStr.toString().trim().isEmpty) return null;
    final cleanDate = dateStr.toString().split('T').first;
    final cleanTime = (timeStr != null && timeStr.toString().trim().isNotEmpty) ? timeStr.toString().trim() : '00:00:00';
    try {
      return DateTime.parse("${cleanDate}T$cleanTime");
    } catch (_) {}
    try {
      return DateTime.parse(cleanDate);
    } catch (_) {}
    return null;
  }

  DateTime _calculateReturnTime(DateTime pickup, dynamic packageType, dynamic dropDateStr) {
    if (dropDateStr != null && dropDateStr.toString().trim().isNotEmpty) {
      try {
        final d = DateTime.parse(dropDateStr.toString().split('T').first);
        return d;
      } catch (_) {}
    }
    final pkg = (packageType ?? '').toString().toLowerCase();
    if (pkg.contains('week')) return pickup.add(const Duration(days: 7));
    if (pkg.contains('month')) return pickup.add(const Duration(days: 30));
    return pickup.add(const Duration(days: 1));
  }

  String _formatDateTimeString(dynamic dateStr, dynamic timeStr) {
    final dt = _parseDateTime(dateStr, timeStr);
    if (dt == null) return "${_formatDate(dateStr)} ${timeStr ?? ''}";
    final months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    final hourInt = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final ampm = dt.hour >= 12 ? "PM" : "AM";
    final minuteStr = dt.minute.toString().padLeft(2, '0');
    final hourStr = hourInt.toString().padLeft(2, '0');
    return "${dt.day} ${months[dt.month - 1]} ${dt.year}, $hourStr:$minuteStr $ampm";
  }

  String _getTotalPriceString(dynamic r) {
    final double totalAmount = double.tryParse("${r['total_amount'] ?? r['total_payable'] ?? 0}") ?? 0.0;
    final double fare = double.tryParse("${r['fare'] ?? r['rent'] ?? 0}") ?? 0.0;
    final double deposit = double.tryParse("${r['deposit'] ?? 0}") ?? 0.0;

    double finalVal = totalAmount > 0 ? totalAmount : (fare + deposit);
    if (finalVal <= 0) finalVal = fare;
    return "₹${finalVal.toStringAsFixed(2)}";
  }

  String _getVehicleImagePath(dynamic model, dynamic category) {
    final name = "${model ?? ''} ${category ?? ''}".toLowerCase();
    if (name.contains('mink')) return "assets/mink.png";
    return "assets/city.png";
  }

  void _navigateToDetails(dynamic r) {
    final double fareVal = double.tryParse("${r['fare'] ?? r['rent'] ?? 0}") ?? 0.0;
    final double depositVal = double.tryParse("${r['deposit'] ?? 0}") ?? 0.0;
    final double totalVal = double.tryParse("${r['total_amount'] ?? r['total_payable'] ?? (fareVal + depositVal)}") ?? (fareVal + depositVal);

    final bookingDataMap = {
      "vehicleName": r['vehicle_model'] ?? r['vehicle_category'] ?? "Evegah EV",
      "vehicleImage": _getVehicleImagePath(r['vehicle_model'], r['vehicle_category']),
      "vehicleSpeed": "45 km/h",
      "vehicleRange": "80–100 km",
      "pickupZone": r['pickup_zone'] ?? "Gotri Zone",
      "pickupTime": _formatDateTimeString(r['reservation_date'], r['reservation_time']),
      "dropTime": _formatDateTimeString(r['drop_date'] ?? r['reservation_date'], r['drop_time']),
      "totalFare": totalVal,
      "rentAmount": fareVal,
      "deposit": depositVal,
      "doorstepFee": double.tryParse("${r['doorstep_fee'] ?? 0}") ?? 0.0,
      "isDoorstep": r['doorstep_delivery'] == true || (r['doorstep_address'] != null && r['doorstep_address'].toString().isNotEmpty),
      "doorstepAddress": r['doorstep_address'] ?? r['drop_zone'] ?? '',
      "packageType": r['package_type'] ?? 'Day',
      "pickupRaw": r['reservation_date'],
      "dropRaw": r['drop_date'],
    };

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BookingConfirmedScreen(
          isDepositPaid: (r['payment_status'] ?? '').toString().toLowerCase() == 'paid',
          reservationId: r['reservation_id'] ?? '',
          bookingData: bookingDataMap,
        ),
      ),
    );
  }

  String _formatDate(String? rawDate) {
    if (rawDate == null || rawDate.isEmpty) return "";
    try {
      final dt = DateTime.parse(rawDate);
      final List<String> months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return "${dt.day} ${months[dt.month - 1]} ${dt.year}";
    } catch (_) {
      return rawDate.split('T').first;
    }
  }

  // --- UPCOMING TAB ---
  Widget _buildUpcomingTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF4313B8)));
    }

    final now = DateTime.now();
    final upcomingList = _reservations.where((r) {
      final stat = (r['status'] ?? '').toString().toLowerCase();
      final pTime = _parseDateTime(r['reservation_date'], r['reservation_time']);
      final rTime = pTime != null ? _calculateReturnTime(pTime, r['package_type'], r['drop_date']) : null;

      if (rTime != null && now.isAfter(rTime)) return false;
      return stat == 'upcoming' || stat == 'pending';
    }).toList();

    if (upcomingList.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text("No upcoming bookings found.", style: TextStyle(color: Colors.grey, fontSize: 13)),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchReservations,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: upcomingList.length + 1,
        itemBuilder: (context, index) {
          if (index == upcomingList.length) {
            return Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: _buildSupportCard(),
            );
          }
          final r = upcomingList[index];
          final pTime = _parseDateTime(r['reservation_date'], r['reservation_time']);
          final rTime = pTime != null ? _calculateReturnTime(pTime, r['package_type'], r['drop_date']) : null;
          bool canStartRide = true;
          if (pTime != null && rTime != null) {
            final allowStartTime = pTime.subtract(const Duration(minutes: 30));
            canStartRide = now.isAfter(allowStartTime) && now.isBefore(rTime);
          }

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildBookingCard(
              status: "UPCOMING",
              statusColor: const Color(0xFFEEF2FF),
              textColor: const Color(0xFF4313B8),
              price: _getTotalPriceString(r),
              vehicleName: r['vehicle_model'] ?? r['vehicle_category'] ?? 'Evegah EV',
              vehicleImage: _getVehicleImagePath(r['vehicle_model'], r['vehicle_category']),
              bookingId: r['reservation_id'] ?? '',
              dateTime: _formatDateTimeString(r['reservation_date'], r['reservation_time']),
              location: "${r['pickup_zone'] ?? ''} to ${r['drop_zone'] ?? ''}",
              duration: r['package_type'] ?? 'Day',
              buttons: [
                _buildOutlinedCardButton("View Details", () => _navigateToDetails(r)),
                const SizedBox(width: 12),
                _buildSolidCardButton(
                  "Start Ride",
                  canStartRide
                      ? () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text("Starting ride... Bluetooth unlock initiated.")),
                          );
                        }
                      : () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Ride can only be started during booking window (${_formatDateTimeString(r['reservation_date'], r['reservation_time'])})."),
                              backgroundColor: Colors.orange.shade800,
                            ),
                          );
                        },
                  isDisabled: !canStartRide,
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  // --- ONGOING TAB ---
  Widget _buildOngoingTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF4313B8)));
    }

    final rawOngoingList = _reservations.where((r) {
      final stat = (r['status'] ?? '').toString().toLowerCase();
      return stat == 'confirmed' || stat == 'ongoing' || stat == 'active' || stat == 'active ride';
    }).toList();

    // 🚨 Real-World Business Rule: A rider can only have ONE active ongoing ride at a time!
    // Take only the most recent active ride to prevent unrealistic duplicate active rides.
    final ongoingList = rawOngoingList.isNotEmpty ? [rawOngoingList.first] : [];

    if (ongoingList.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text("No active ongoing ride found.", style: TextStyle(color: Colors.grey, fontSize: 13)),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchReservations,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: ongoingList.length + 1,
        itemBuilder: (context, index) {
          if (index == ongoingList.length) {
            return Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: _buildSupportCard(),
            );
          }
          final r = ongoingList[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildBookingCard(
              status: "ONGOING",
              statusColor: const Color(0xFFDCFCE7),
              textColor: const Color(0xFF16A34A),
              price: _getTotalPriceString(r),
              vehicleName: r['vehicle_model'] ?? r['vehicle_category'] ?? 'Evegah EV',
              vehicleImage: _getVehicleImagePath(r['vehicle_model'], r['vehicle_category']),
              bookingId: r['reservation_id'] ?? '',
              dateTime: _formatDateTimeString(r['reservation_date'], r['reservation_time']),
              location: "${r['pickup_zone'] ?? ''} to ${r['drop_zone'] ?? ''}",
              duration: r['package_type'] ?? 'Day',
              buttons: [
                _buildOutlinedCardButton("View Details", () => _navigateToDetails(r)),
                const SizedBox(width: 12),
                _buildSolidCardButton("End Ride", () {
                  setState(() {
                    r['status'] = 'Completed';
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Ride ended successfully. You can now book your next ride! ⚡"),
                      backgroundColor: Color(0xFF16A34A),
                    ),
                  );
                }),
              ],
            ),
          );
        },
      ),
    );
  }

  // --- COMPLETED TAB ---
  Widget _buildCompletedTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF4313B8)));
    }

    final completedList = _reservations.where((r) {
      final stat = (r['status'] ?? '').toString().toLowerCase();
      return stat == 'completed' || stat == 'done';
    }).toList();

    if (completedList.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text("No completed bookings found.", style: TextStyle(color: Colors.grey, fontSize: 13)),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchReservations,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: completedList.length + 1,
        itemBuilder: (context, index) {
          if (index == completedList.length) {
            return Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: _buildSupportCard(),
            );
          }
          final r = completedList[index];
          final vehicle = r['vehicle_model'] ?? r['vehicle_category'] ?? 'Evegah EV';
          final rId = r['reservation_id'] ?? '';
          final dateStr = _formatDateTimeString(r['reservation_date'], r['reservation_time']);
          final priceStr = _getTotalPriceString(r);
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildBookingCard(
              status: "COMPLETED",
              statusColor: const Color(0xFFF1F5F9),
              textColor: Colors.blueGrey,
              price: priceStr,
              vehicleName: vehicle,
              vehicleImage: _getVehicleImagePath(r['vehicle_model'], r['vehicle_category']),
              bookingId: rId,
              dateTime: dateStr,
              location: "${r['pickup_zone'] ?? ''} to ${r['drop_zone'] ?? ''}",
              duration: r['package_type'] ?? 'Day',
              buttons: [
                _buildOutlinedCardButton("View Invoice", () {
                  _generateAndDownloadInvoice(
                    vehicle,
                    rId,
                    dateStr,
                    priceStr,
                    "12.4 km",
                    r['package_type'] ?? 'Day',
                  );
                }, hasIcon: true),
              ],
            ),
          );
        },
      ),
    );
  }

  // --- CANCELLED TAB ---
  Widget _buildCancelledTab() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator(color: Color(0xFF4313B8)));
    }

    final now = DateTime.now();
    final cancelledList = _reservations.where((r) {
      final stat = (r['status'] ?? '').toString().toLowerCase();
      if (stat == 'cancelled' || stat == 'expired') return true;
      final pTime = _parseDateTime(r['reservation_date'], r['reservation_time']);
      final rTime = pTime != null ? _calculateReturnTime(pTime, r['package_type'], r['drop_date']) : null;
      if (rTime != null && now.isAfter(rTime) && stat != 'completed' && stat != 'done') return true;
      return false;
    }).toList();

    if (cancelledList.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(32.0),
          child: Text("No cancelled bookings found.", style: TextStyle(color: Colors.grey, fontSize: 13)),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _fetchReservations,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: cancelledList.length + 1,
        itemBuilder: (context, index) {
          if (index == cancelledList.length) {
            return Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: _buildSupportCard(),
            );
          }
          final r = cancelledList[index];
          final pTime = _parseDateTime(r['reservation_date'], r['reservation_time']);
          final rTime = pTime != null ? _calculateReturnTime(pTime, r['package_type'], r['drop_date']) : null;
          final isExpired = rTime != null && now.isAfter(rTime);

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _buildBookingCard(
              status: isExpired ? "EXPIRED" : "CANCELLED",
              statusColor: const Color(0xFFFEE2E2),
              textColor: const Color(0xFFEF4444),
              price: _getTotalPriceString(r),
              vehicleName: r['vehicle_model'] ?? r['vehicle_category'] ?? 'Evegah EV',
              vehicleImage: _getVehicleImagePath(r['vehicle_model'], r['vehicle_category']),
              bookingId: r['reservation_id'] ?? '',
              dateTime: _formatDateTimeString(r['reservation_date'], r['reservation_time']),
              location: "${r['pickup_zone'] ?? ''} to ${r['drop_zone'] ?? ''}",
              duration: r['package_type'] ?? 'Day',
              buttons: [
                _buildOutlinedCardButton("View Details", () => _navigateToDetails(r)),
              ],
            ),
          );
        },
      ),
    );
  }

  // --- RIDE CARD BUILDER ---
  Widget _buildBookingCard({
    required String status,
    required Color statusColor,
    required Color textColor,
    required String price,
    required String vehicleName,
    required String vehicleImage,
    required String bookingId,
    required String dateTime,
    required String location,
    required String duration,
    Widget? extraWidget,
    required List<Widget> buttons,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.01),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  status,
                  style: TextStyle(color: textColor, fontSize: 9, fontWeight: FontWeight.bold),
                ),
              ),
              Text(
                price,
                style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF1E293B)),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 70,
                height: 70,
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Image.asset(vehicleImage, fit: BoxFit.contain),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          vehicleName,
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0FDF4),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            "Self-Drive",
                            style: TextStyle(color: Color(0xFF16A34A), fontSize: 8, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      "ID: $bookingId",
                      style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    _buildSpecLabel(Icons.calendar_month_outlined, dateTime),
                    const SizedBox(height: 4),
                    _buildSpecLabel(Icons.location_on_outlined, location),
                    const SizedBox(height: 4),
                    _buildSpecLabel(Icons.timer_outlined, "Duration: $duration"),
                  ],
                ),
              ),
            ],
          ),
          if (extraWidget != null) extraWidget,
          const SizedBox(height: 16),
          const Divider(color: Color(0xFFF1F5F9), height: 1),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: buttons,
          ),
        ],
      ),
    );
  }

  Widget _buildSpecLabel(IconData icon, String text) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, color: const Color(0xFF4313B8), size: 12),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(color: Color(0xFF4B5563), fontSize: 10, height: 1.3, fontWeight: FontWeight.w500),
          ),
        ),
      ],
    );
  }

  Widget _buildOutlinedCardButton(String label, VoidCallback onTap, {bool hasIcon = false}) {
    return Expanded(
      child: OutlinedButton(
        onPressed: onTap,
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFF4313B8),
          side: const BorderSide(color: Color(0xFFDDD6FE), width: 1.2),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 10),
          minimumSize: Size.zero,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            if (hasIcon) ...[
              const SizedBox(width: 4),
              const Icon(Icons.chevron_right, size: 14, color: Color(0xFF4313B8)),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildSolidCardButton(String label, VoidCallback? onTap, {bool isDisabled = false}) {
    return Expanded(
      child: ElevatedButton(
        onPressed: onTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: isDisabled ? Colors.grey.shade300 : const Color(0xFF2B0B78),
          foregroundColor: isDisabled ? Colors.grey.shade600 : Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 10),
          minimumSize: Size.zero,
          elevation: 0,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
            const SizedBox(width: 4),
            const Icon(Icons.arrow_forward, size: 12, color: Colors.white),
          ],
        ),
      ),
    );
  }

  // --- MOCK SUPPORT CARD ---
  Widget _buildSupportCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(20),
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
            child: const Icon(Icons.headset_mic_outlined, color: Color(0xFF16A34A), size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Need help with your booking?",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF16A34A)),
                ),
                SizedBox(height: 2),
                Text(
                  "We're here 24/7 to assist you.",
                  style: TextStyle(color: Colors.grey, fontSize: 10),
                ),
              ],
            ),
          ),
          OutlinedButton(
            onPressed: () {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const HelpScreen(),
        ),
      );
    },
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF16A34A),
              side: const BorderSide(color: Color(0xFF16A34A), width: 1.5),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              minimumSize: Size.zero,
            ),
            child: const Text("Contact Support", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}