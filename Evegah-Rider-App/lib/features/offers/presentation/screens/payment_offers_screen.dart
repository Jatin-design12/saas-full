import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../../core/services/icici_upi_service.dart';
import '../../../../core/services/payu_service.dart';
import '../../../../core/services/payment_gateway_service.dart';
import '../../../profile/data/services/profile_service.dart';
import '../../../dashboard/presentation/widgets/vehicle_360_viewer.dart';
import '../../../rides/presentation/screen/booking_confirmed_screen.dart';
import 'offer_screen.dart';

class PaymentOffersScreen extends StatefulWidget {
  final String selectedZone;
  final String? dropZone;
  final bool? isFlexiDrop;
  final double? flexiDropFee;
  final String pickupDateTime;
  final String dropDateTime;
  final String? pickupRaw;
  final String? dropRaw;
  final Map<String, dynamic> selectedVehicle;
  final Map<String, dynamic>? zonePricing;

  const PaymentOffersScreen({
    super.key,
    required this.selectedZone,
    this.dropZone,
    this.isFlexiDrop,
    this.flexiDropFee,
    required this.pickupDateTime,
    required this.dropDateTime,
    this.pickupRaw,
    this.dropRaw,
    required this.selectedVehicle,
    this.zonePricing,
  });

  @override
  State<PaymentOffersScreen> createState() => _PaymentOffersScreenState();
}

class _PaymentOffersScreenState extends State<PaymentOffersScreen> {
  String _appliedCode = '';
  String _depositOption = 'Pay Now'; // 'Pay Now' or 'Pay Later'
  String _paymentMethod = 'PayU';
  String _activeGatewayId = 'payu';
  List<Map<String, dynamic>> _activeGateways = [];

  double _basePrice = 0.0;
  double _discount = 0.0;
  double _platformFee = 0.0;
  double _taxes = 0.0;

  double get _deliveryFee {
    if (widget.isFlexiDrop != true) {
      return 0.0;
    }
    if (widget.flexiDropFee != null && widget.flexiDropFee! > 0) {
      return widget.flexiDropFee!;
    }
    return 0.0;
  }

  double get _totalPayable {
    double total = _basePrice + _deliveryFee - _discount;
    if (_depositOption == 'Pay Now') {
      total += widget.selectedVehicle["realDeposit"] ?? 500.0;
    }
    return total < 0 ? 0 : total;
  }

  @override
  void initState() {
    super.initState();
    _basePrice = double.tryParse(widget.selectedVehicle["rentAmount"]?.toString() ?? '200') ?? 200.0;
    // No coupon is applied by default. The user must explicitly tap Apply.
    _appliedCode = '';
    _loadPaymentGatewayConfig();
    _discount = 0.0;
    _paymentMethod = 'PayU';
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> _loadPaymentGatewayConfig() async {
    try {
      final cfg = await PaymentGatewayService().getPaymentConfig(forceRefresh: true);
      final list = await PaymentGatewayService().getActiveGateways();
      if (mounted) {
        setState(() {
          _activeGateways = list.isNotEmpty
              ? list
              : [
                  {'id': 'payu', 'name': 'PayU India', 'provider': 'payu'},
                  {'id': 'icici', 'name': 'ICICI Bank UPI', 'provider': 'icici'}
                ];
          final primary = cfg['primary_gateway']?.toString() ?? (_activeGateways.isNotEmpty ? _activeGateways.first['id'].toString() : 'payu');
          _activeGatewayId = primary;
          _paymentMethod = _activeGatewayId == 'payu' ? 'PayU' : 'ICICI UPI';
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _activeGateways = [
            {'id': 'payu', 'name': 'PayU India', 'provider': 'payu'},
            {'id': 'icici', 'name': 'ICICI Bank UPI', 'provider': 'icici'}
          ];
        });
      }
    }
  }

  /// Triggers the selected active payment gateway (PayU, ICICI UPI, etc.)
  void _triggerPayment({required bool payNow}) {
    final double amountToPay = _totalPayable;

    if (amountToPay <= 0 || !payNow) {
      _confirmBooking(payNow: payNow);
      return;
    }

    if (_paymentMethod == 'PayU' || _activeGatewayId == 'payu') {
      _triggerPayUPayment(amountToPay: amountToPay);
    } else {
      _triggerIciciUpiPayment(payNow: payNow);
    }
  }

  /// Initiates PayU online checkout
  Future<void> _triggerPayUPayment({required double amountToPay}) async {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(
        child: CircularProgressIndicator(color: Color(0xFF528900)),
      ),
    );

    try {
      final payuData = await PayUService().initiatePayment(
        amount: amountToPay,
        purpose: 'ride',
      );

      if (!mounted) return;
      Navigator.pop(context);

      if (payuData != null && payuData['action_url'] != null) {
        final txnid = payuData['txnid']?.toString() ?? '';
        final launched = await PayUService().launchPayUCheckout(
          payuData['action_url'],
          payuData,
        );

        if (launched) {
          if (!mounted) return;
          // Show verification dialog and poll status so cancelled payment is NEVER confirmed
          bool isFinished = false;
          Timer? pollTimer;

          await showDialog(
            context: context,
            barrierDismissible: false,
            builder: (dialogCtx) {
              return StatefulBuilder(
                builder: (context, setDialogState) {
                  pollTimer ??= Timer.periodic(const Duration(seconds: 3), (t) async {
                    if (isFinished) {
                      t.cancel();
                      return;
                    }
                    final status = await PayUService().checkPaymentStatus(txnid);
                    if (status.toLowerCase() == 'success') {
                      isFinished = true;
                      t.cancel();
                      if (Navigator.canPop(dialogCtx)) Navigator.pop(dialogCtx);
                      _confirmBooking(payNow: true, transactionId: txnid);
                    } else if (status.toLowerCase() == 'failed') {
                      isFinished = true;
                      t.cancel();
                      if (Navigator.canPop(dialogCtx)) Navigator.pop(dialogCtx);
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("PayU payment was cancelled or failed. Booking NOT confirmed."),
                            backgroundColor: Colors.redAccent,
                          ),
                        );
                      }
                    }
                  });

                  return AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    title: Row(
                      children: const [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2.5, color: Color(0xFF2B0B78)),
                        ),
                        SizedBox(width: 12),
                        Text("PayU Payment", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      ],
                    ),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "Please complete your payment in the PayU browser window.",
                          style: TextStyle(fontSize: 13, color: Color(0xFF475569)),
                        ),
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.shield_outlined, size: 16, color: Color(0xFF16A34A)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  "Txn: $txnid",
                                  style: const TextStyle(fontSize: 11, fontFamily: 'monospace', color: Color(0xFF334155)),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          isFinished = true;
                          pollTimer?.cancel();
                          Navigator.pop(dialogCtx);
                          if (mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text("PayU payment cancelled. Booking was not confirmed."),
                                backgroundColor: Colors.orange,
                              ),
                            );
                          }
                        },
                        child: const Text("Cancel Payment", style: TextStyle(color: Colors.redAccent)),
                      ),
                      ElevatedButton(
                        onPressed: () async {
                          final status = await PayUService().checkPaymentStatus(txnid);
                          if (status.toLowerCase() == 'success') {
                            isFinished = true;
                            pollTimer?.cancel();
                            if (Navigator.canPop(dialogCtx)) Navigator.pop(dialogCtx);
                            _confirmBooking(payNow: true, transactionId: txnid);
                          } else if (status.toLowerCase() == 'failed') {
                            isFinished = true;
                            pollTimer?.cancel();
                            if (Navigator.canPop(dialogCtx)) Navigator.pop(dialogCtx);
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text("Payment was cancelled or failed in PayU. Booking NOT confirmed."),
                                  backgroundColor: Colors.redAccent,
                                ),
                              );
                            }
                          } else {
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text("Payment is still pending in PayU. Please finish payment or cancel."),
                                  backgroundColor: Colors.orange,
                                ),
                              );
                            }
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2B0B78),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text("Check Status"),
                      ),
                    ],
                  );
                },
              );
            },
          );
          pollTimer?.cancel();
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Could not open PayU checkout. Please check your connection."),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text("PayU initiation failed. Switching to UPI."),
            backgroundColor: Colors.orange,
          ),
        );
        _triggerIciciUpiPayment(payNow: true);
      }
    } catch (e) {
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Payment error: $e"), backgroundColor: Colors.redAccent),
        );
      }
    }
  }

  /// Triggers ICICI Bank UPI intent modal or confirms booking
  void _triggerIciciUpiPayment({required bool payNow}) {
    final double amountToPay = _totalPayable;

    if (amountToPay <= 0 || !payNow) {
      _confirmBooking(payNow: payNow);
      return;
    }

    final profile = ProfileService();
    final cleanPhone = profile.phoneNumber.replaceAll(RegExp(r'\D'), '');
    final userContact = cleanPhone.isNotEmpty ? cleanPhone : (SessionService().userMobileSync?.replaceAll(RegExp(r'\D'), '') ?? '');

    IciciUpiService().showUpiPaymentModal(
      context: context,
      amount: amountToPay,
      mobile: userContact,
      note: 'Evegah Ride Booking',
      onPaymentSuccess: (txId) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Payment Verified Successfully via ICICI UPI!"),
              backgroundColor: Colors.green,
            ),
          );
          _confirmBooking(payNow: true, transactionId: txId);
        }
      },
      onPaymentFailed: (msg) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(msg.isNotEmpty ? msg : "UPI Payment Cancelled"),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      },
    );
  }

  DateTime? _parseDateTimeRobust(String? input) {
    if (input == null || input.isEmpty || input.toLowerCase().contains('select')) return null;
    DateTime? dt = DateTime.tryParse(input);
    if (dt != null) return dt;

    try {
      final clean = input.replaceAll(RegExp(r'^[A-Za-z]+,\s*'), '').replaceAll(',', ' ').trim();
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

  /// Posts the booking to the backend with active payment mode (PayU or ICICI UPI).
  Future<void> _confirmBooking({required bool payNow, String? transactionId}) async {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(
        child: CircularProgressIndicator(color: Color(0xFF2B0B78)),
      ),
    );

    try {
      final pickupDt = _parseDateTimeRobust(widget.pickupRaw) ?? _parseDateTimeRobust(widget.pickupDateTime);
      final dropDt = _parseDateTimeRobust(widget.dropRaw) ?? _parseDateTimeRobust(widget.dropDateTime);

      final pickupDate = widget.pickupRaw ?? widget.pickupDateTime;
      final dropDate = widget.dropRaw ?? widget.dropDateTime;

      String reservationDate = pickupDt != null
          ? "${pickupDt.year}-${pickupDt.month.toString().padLeft(2, '0')}-${pickupDt.day.toString().padLeft(2, '0')}"
          : DateTime.now().toIso8601String().split('T')[0];
      String reservationTime = pickupDt != null
          ? "${pickupDt.hour.toString().padLeft(2, '0')}:${pickupDt.minute.toString().padLeft(2, '0')}:00"
          : '10:00:00';

      // Determine dynamic package_type
      String packageType = 'Day';
      try {
        final pDate = DateTime.tryParse(pickupDate);
        final dDate = DateTime.tryParse(dropDate);
        if (pDate != null && dDate != null) {
          final days = dDate.difference(pDate).inDays;
          if (days >= 28) {
            packageType = 'Month';
          } else if (days >= 6) {
            packageType = 'Week';
          } else if (days >= 1) {
            packageType = 'Day';
          } else {
            packageType = 'Hourly';
          }
        }
      } catch (_) {}

      // Fetch real rider info
      final userMobile = await SessionService().getUserMobile() ?? '+91 8128251172';
      final userProfile = await SessionService().getUserProfile();
      final riderName = (userProfile['name'] != null && userProfile['name']!.isNotEmpty)
          ? userProfile['name']!
          : 'Himanshu chavda';

      final double rentVal = _basePrice - _discount + _platformFee + _taxes;
      final double depositVal = _depositOption == 'Pay Now'
          ? (widget.selectedVehicle['realDeposit'] ?? 500.0)
          : 0.0;
      final double doorstepFeeVal = _deliveryFee;
      final String doorstepAddress = (widget.isFlexiDrop == true && widget.dropZone != null && widget.dropZone!.isNotEmpty)
          ? widget.dropZone!
          : '';

      final payload = {
        'customer_name': riderName,
        'mobile': userMobile,
        'gov_id': '',
        'reservation_date': reservationDate,
        'reservation_time': reservationTime,
        'package_type': packageType,
        'vehicle_category': widget.selectedVehicle['vehicle_category'] ?? 'E-Scooter',
        'vehicle_model': widget.selectedVehicle['evegah_model_name'] ?? widget.selectedVehicle['name'] ?? 'Evegah City',
        'fare': rentVal,
        'rent': rentVal,
        'deposit': depositVal,
        'doorstep_delivery': widget.isFlexiDrop == true,
        'doorstep_fee': doorstepFeeVal,
        'doorstep_address': doorstepAddress,
        'payment_mode': _paymentMethod,
        'payment_status': payNow ? 'Paid' : 'Pending',
        'transaction_id': transactionId ?? '',
        'pickup_datetime': pickupDt?.toIso8601String() ?? widget.pickupDateTime,
        'drop_datetime': dropDt?.toIso8601String() ?? widget.dropDateTime,
        'pickup_zone': widget.selectedZone,
        'drop_zone': doorstepAddress.isNotEmpty ? doorstepAddress : widget.selectedZone,
        'coupon_code': _appliedCode,
        'discount': _discount,
        'platform_fee': _platformFee,
        'taxes': _taxes,
        'deposit_option': _depositOption,
        'total_payable': _totalPayable,
        'total_amount': _totalPayable,
      };

      final response = await http.post(
        Uri.parse('${AppConstants.apiBaseUrl}/reservations'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 15));

      // Dismiss loading
      if (mounted) Navigator.of(context, rootNavigator: true).pop();

      if (response.statusCode != 200 && response.statusCode != 201) {
        String errorMsg = "Could not complete booking. Please try again.";
        try {
          final errBody = jsonDecode(response.body);
          if (errBody['message'] != null) {
            errorMsg = errBody['message'].toString();
          }
        } catch (_) {}

        if (mounted) {
          showDialog(
            context: context,
            builder: (ctx) => AlertDialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              title: Row(
                children: const [
                  Icon(Icons.warning_amber_rounded, color: Colors.orange, size: 28),
                  SizedBox(width: 8),
                  Text("Booking Notice", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              content: Text(errorMsg, style: const TextStyle(fontSize: 14)),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  child: const Text("OK", style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          );
        }
        return;
      }

      String reservationId = '';
      try {
        final body = jsonDecode(response.body);
        if (body['reservation'] != null && body['reservation']['_id'] != null) {
          reservationId = body['reservation']['_id'];
        } else if (body['id'] != null) {
          reservationId = body['id'];
        }
      } catch (_) {}

      final bookingDataMap = {
        "vehicleName": widget.selectedVehicle['evegah_model_name'] ?? widget.selectedVehicle['name'] ?? "Evegah City",
        "vehicleImage": widget.selectedVehicle['image'] ?? "assets/city.png",
        "vehicleSpeed": widget.selectedVehicle['speed'] ?? "45 km/h",
        "vehicleRange": widget.selectedVehicle['range'] ?? "80–100 km",
        "pickupZone": widget.selectedZone,
        "pickupTime": widget.pickupDateTime,
        "dropTime": widget.dropDateTime,
        "totalFare": _totalPayable,
        "rentAmount": rentVal,
        "deposit": depositVal,
        "doorstepFee": doorstepFeeVal,
        "isDoorstep": widget.isFlexiDrop == true,
        "doorstepAddress": doorstepAddress,
      };

      // Direct Razorpay Connection & Navigate to BookingConfirmedScreen
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => BookingConfirmedScreen(
            isDepositPaid: payNow,
            reservationId: reservationId.isNotEmpty ? reservationId : 'RID-2026-${(DateTime.now().millisecondsSinceEpoch % 1000000)}',
            bookingData: bookingDataMap,
          ),
        ),
      );
    } catch (e) {
      if (mounted) Navigator.of(context, rootNavigator: true).pop();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Connection info: ${e.toString().split(':').first}'),
            backgroundColor: Colors.orange,
          ),
        );
      }
    }
  }

  void _show360Viewer() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.9,
        builder: (_, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: Column(
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      children: [
                        Vehicle360Viewer(
                          vehicleModel: widget.selectedVehicle["evegah_model_name"] ?? widget.selectedVehicle["name"] ?? "Evegah City",
                          imageAsset: widget.selectedVehicle["image"] ?? "assets/city.png",
                        ),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
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
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Payment & Offers",
          style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: false,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFEEF2FF),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: const [
                Icon(Icons.verified_user, color: Color(0xFF4313B8), size: 14),
                SizedBox(width: 4),
                Text(
                  "100% Secure",
                  style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 10),
                ),
              ],
            ),
          )
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 1. Redesigned Vehicle Details Card
            Container(
              margin: const EdgeInsets.fromLTRB(16, 16, 16, 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A0F172A),
                    blurRadius: 14,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Vehicle image + 360 viewer
                  SizedBox(
                    width: 112,
                    height: 132,
                    child: Stack(
                      alignment: Alignment.bottomCenter,
                      children: [
                        Container(
                          width: 112,
                          height: 132,
                          padding: const EdgeInsets.all(7),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF6F7FB),
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: const Color(0xFFE8EAF2)),
                          ),
                          child: Image.asset(
                            widget.selectedVehicle["image"] ?? "assets/city.png",
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => const Icon(
                              Icons.electric_scooter_rounded,
                              size: 52,
                              color: Color(0xFF4313B8),
                            ),
                          ),
                        ),
                        GestureDetector(
                          onTap: _show360Viewer,
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 7),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 5,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF4313B8),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: const [
                                BoxShadow(
                                  color: Color(0x33000000),
                                  blurRadius: 5,
                                  offset: Offset(0, 2),
                                ),
                              ],
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.threed_rotation_rounded,
                                  color: Colors.white,
                                  size: 12,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  "360° View",
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 9,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 14),

                  // Vehicle information
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // The zone/vehicle name gets the remaining width.
                            // It may use a second line only when the available
                            // width is not enough; otherwise it stays on one line.
                            Expanded(
                              child: Padding(
                                padding: const EdgeInsets.only(right: 4),
                                child: Text(
                                  widget.selectedVehicle["evegah_model_name"] ??
                                      widget.selectedVehicle["name"] ??
                                      widget.selectedZone,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  softWrap: true,
                                  style: const TextStyle(
                                    fontSize: 17,
                                    height: 1.15,
                                    fontWeight: FontWeight.w800,
                                    color: Color(0xFF172033),
                                  ),
                                ),
                              ),
                            ),
                            // Keep the complete price + unit together on one line.
                            // A fixed width reserves enough room for ₹499 / hr
                            // without hiding the zone name unnecessarily.
                            SizedBox(
                              width: 78,
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.centerRight,
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  crossAxisAlignment: CrossAxisAlignment.baseline,
                                  textBaseline: TextBaseline.alphabetic,
                                  children: [
                                    Text(
                                      "₹${(widget.selectedVehicle["realPrice"] ?? 29).toStringAsFixed(0)}",
                                      maxLines: 1,
                                      softWrap: false,
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF4313B8),
                                      ),
                                    ),
                                    const SizedBox(width: 3),
                                    Text(
                                      widget.zonePricing?['pricingModel'] == 'Hourly Based'
                                          ? "/ hr"
                                          : "/ day",
                                      maxLines: 1,
                                      softWrap: false,
                                      style: const TextStyle(
                                        fontSize: 8,
                                        fontWeight: FontWeight.w600,
                                        color: Color(0xFF94A3B8),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 7),

                        // Status row
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFECFDF3),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: const Color(0xFFBBF7D0),
                                ),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.check_circle_rounded,
                                    color: Color(0xFF16A34A),
                                    size: 11,
                                  ),
                                  SizedBox(width: 4),
                                  Text(
                                    "Available",
                                    style: TextStyle(
                                      color: Color(0xFF15803D),
                                      fontSize: 9,
                                      fontWeight: FontWeight.w800,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F0FF),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: const Text(
                                "Self-Drive",
                                style: TextStyle(
                                  color: Color(0xFF5B21B6),
                                  fontSize: 9,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),

                        // Vehicle specifications
                        Wrap(
                          spacing: 6,
                          runSpacing: 6,
                          children: [
                            _buildVehicleSpecChip(
                              Icons.bolt_rounded,
                              widget.selectedVehicle["range"] ?? "80–100 km",
                            ),
                            _buildVehicleSpecChip(
                              Icons.speed_rounded,
                              widget.selectedVehicle["speed"] ?? "45 km/h",
                            ),
                            _buildVehicleSpecChip(
                              Icons.airline_seat_recline_normal_rounded,
                              "${widget.selectedVehicle["seats"] ?? '1'} Seat",
                            ),
                            _buildVehicleSpecChip(
                              Icons.battery_charging_full_rounded,
                              "${widget.selectedVehicle["battery_pct"] ?? 100}%",
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 2. Exclusive Offers
            _buildSectionHeader(Icons.local_offer_outlined, "Exclusive Offers", "Apply offers and save more on your booking"),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFBBF7D0)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFDCFCE7),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.percent_rounded, color: Color(0xFF15803D), size: 16),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _discount > 0 ? _appliedCode : "No coupon applied",
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B)),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                _discount > 0 ? "Flat ₹${_discount.toStringAsFixed(0)} off on your ride" : "Apply offers and save more on your booking",
                                style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            setState(() {
                              if (_discount > 0) {
                                _discount = 0.0;
                                _appliedCode = '';
                              } else {
                                _appliedCode = 'GET100';
                                _discount = 100.00;
                              }
                            });
                          },
                          child: Text(
                            _discount > 0 ? "Remove" : "Apply",
                            style: TextStyle(
                              color: _discount > 0 ? Colors.red : const Color(0xFF15803D),
                              fontWeight: FontWeight.bold,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  InkWell(
                    onTap: () async {
                      final selectedOffer = await Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const OfferScreen()),
                      );
                      if (selectedOffer != null && selectedOffer is Map<String, dynamic>) {
                        final String code = selectedOffer["code"] ?? '';
                        final bool isExpired = selectedOffer["isExpired"] == true || selectedOffer["statusTag"] == "Expired";
                        final bool isLimitReached = selectedOffer["isLimitReached"] == true || selectedOffer["statusTag"] == "Redeemed";

                        if (isExpired) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Coupon '$code' has expired and cannot be redeemed!"),
                              backgroundColor: Colors.red.shade700,
                            ),
                          );
                          return;
                        }

                        if (isLimitReached) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text("Coupon '$code' redemption limit has been reached!"),
                              backgroundColor: Colors.orange.shade800,
                            ),
                          );
                          return;
                        }

                        final double discountVal = double.tryParse("${selectedOffer['discount_value'] ?? 0}") ?? 50.0;

                        setState(() {
                          _appliedCode = code;
                          _discount = discountVal > 0 ? discountVal : 50.0;
                        });

                        if (!mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Offer '$code' applied! Saved ₹${_discount.toStringAsFixed(0)} 🎉"),
                            backgroundColor: const Color(0xFF15803D),
                          ),
                        );
                      }
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.discount_outlined, size: 16, color: Color(0xFF4313B8)),
                        SizedBox(width: 6),
                        Text("View all offers", style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold, fontSize: 12)),
                        Icon(Icons.chevron_right, size: 16, color: Color(0xFF4313B8)),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 3. Zone Location
            _buildSectionHeader(Icons.location_on_outlined, "Zone Location", null),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        widget.selectedZone,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.selectedVehicle["zone_address"] ?? "${widget.selectedZone}, Bengaluru",
                    style: const TextStyle(color: Colors.grey, fontSize: 11, height: 1.4),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F3FF),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: const [
                        Icon(Icons.info_outline, color: Color(0xFF4313B8), size: 14),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            "Reach your pickup zone 10 mins before your pickup time.",
                            style: TextStyle(color: Color(0xFF4313B8), fontSize: 10, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 4. Detailed Fare & Delivery Breakdown Card
            _buildSectionHeader(Icons.receipt_long_outlined, "Fare Breakdown", "Detailed calculation of ride & doorstep delivery"),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("EV Vehicle Base Fare:", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      Text("₹${_basePrice.toStringAsFixed(2)}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                  if (widget.isFlexiDrop == true && _deliveryFee > 0) ...[
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text("Doorstep Delivery Fare:", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                            const SizedBox(width: 4),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3E8FF),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: const Text("₹30/km", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF4313B8))),
                            ),
                          ],
                        ),
                        Text(
                          "+₹${_deliveryFee.toStringAsFixed(2)}",
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF16A34A),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],

                  if (_discount > 0) ...[
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text("Offer Discount ($_appliedCode):", style: const TextStyle(fontSize: 12, color: Color(0xFF16A34A))),
                        Text("-₹${_discount.toStringAsFixed(2)}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                      ],
                    ),
                  ],
                  const Divider(height: 20, color: Color(0xFFF1F5F9)),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Subtotal (Excl. Deposit):", style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                      Text(
                        "₹${(_basePrice + _deliveryFee - _discount + _platformFee + _taxes).toStringAsFixed(2)}",
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF4313B8)),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // 5. Deposit Option
            _buildSectionHeader(Icons.security_outlined, "Deposit Option", null),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text("Refundable Deposit:", style: TextStyle(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w600)),
                      const SizedBox(width: 4),
                      Text("₹${(widget.selectedVehicle["realDeposit"] ?? 500.0).toStringAsFixed(0)}", style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
                      const SizedBox(width: 6),
                      GestureDetector(
                        onTap: () {},
                        child: const Text("Learn more", style: TextStyle(color: Color(0xFF16A34A), fontSize: 11, fontWeight: FontWeight.bold, decoration: TextDecoration.underline)),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.info_outline, size: 12, color: Color(0xFF16A34A)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Pay Now option
                  GestureDetector(
                    onTap: () => setState(() => _depositOption = 'Pay Now'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          Radio<String>(
                            value: 'Pay Now',
                            groupValue: _depositOption,
                            activeColor: const Color(0xFF4313B8),
                            onChanged: (val) => setState(() => _depositOption = val!),
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text("Pay Now", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                                SizedBox(height: 2),
                                Text("Complete the payment along with your booking", style: TextStyle(color: Colors.grey, fontSize: 11)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const Divider(color: Color(0xFFF1F5F9)),
                  // Pay Later option
                  GestureDetector(
                    onTap: () => setState(() => _depositOption = 'Pay Later'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: Row(
                        children: [
                          Radio<String>(
                            value: 'Pay Later',
                            groupValue: _depositOption,
                            activeColor: const Color(0xFF4313B8),
                            onChanged: (val) => setState(() => _depositOption = val!),
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text("Pay Later", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                                SizedBox(height: 2),
                                Text("Pay anytime before your trip start", style: TextStyle(color: Colors.grey, fontSize: 11)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Green box refund promise
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.check_circle_outline, color: Color(0xFF16A34A), size: 16),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            "You'll get a full refund within 2-3 days after booking completion, unless there's a damage or late return.",
                            style: TextStyle(color: Color(0xFF16A34A), fontSize: 10, height: 1.4, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // 5. Dynamic Multi Payment Gateway Section
            _buildSectionHeader(Icons.bolt, "Payment Method", null),
            ...(_activeGateways.isNotEmpty
                ? _activeGateways
                : [
                    {'id': 'payu', 'name': 'PayU India', 'provider': 'payu'},
                    {'id': 'icici', 'name': 'ICICI Bank UPI', 'provider': 'icici'}
                  ]).map((gw) {
              final String gwId = (gw['id'] ?? gw['provider'] ?? 'payu').toString().toLowerCase();
              final bool isPayU = gwId == 'payu';
              final bool isIcici = gwId == 'icici';
              final bool isPhonePe = gwId == 'phonepe';
              final bool isPaytm = gwId == 'paytm';
              final bool isRazorpay = gwId == 'razorpay';

              final String methodValue = isPayU ? 'PayU' : isIcici ? 'ICICI UPI' : (gw['name']?.toString() ?? 'UPI');
              final bool isSelected = _paymentMethod == methodValue || _activeGatewayId == gwId;

              final Color themeColor = isPayU
                  ? const Color(0xFF528900)
                  : isIcici
                      ? const Color(0xFFE05315)
                      : isPhonePe
                          ? const Color(0xFF5F259F)
                          : isPaytm
                              ? const Color(0xFF002E6E)
                              : const Color(0xFF2A195C);

              final String brandLabel = isPayU
                  ? "PAYU INDIA"
                  : isIcici
                      ? "ICICI BANK"
                      : isPhonePe
                          ? "PHONEPE"
                          : isPaytm
                              ? "PAYTM"
                              : isRazorpay
                                  ? "RAZORPAY"
                                  : (gw['name']?.toString().toUpperCase() ?? "GATEWAY");

              final String titleText = isPayU
                  ? "PayU Payment Gateway"
                  : isIcici
                      ? "Instant UPI Intent (ICICI Bank)"
                      : gw['name']?.toString() ?? "Online Payment";

              final String subText = isPayU
                  ? "Cards, NetBanking, Wallets & All UPI"
                  : isIcici
                      ? "GPay, PhonePe, Paytm, BHIM & All UPI"
                      : "Direct online digital payment";

              final String detailText = isPayU
                  ? "100% Secure Checkout (256-bit SSL)"
                  : isIcici
                      ? "VPA: ${gw['vpa'] ?? 'EVEGAHRIDE@icici'}"
                      : "Instant automated digital checkout";

              final String badgeText = isPayU ? "SSL Verified" : "NPCI Verified";

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _activeGatewayId = gwId;
                    _paymentMethod = methodValue;
                  });
                },
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? themeColor : const Color(0xFFE2E8F0),
                      width: isSelected ? 2.0 : 1.2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isSelected ? themeColor.withOpacity(0.08) : Colors.black.withOpacity(0.02),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Radio<String>(
                            value: methodValue,
                            groupValue: _paymentMethod,
                            activeColor: themeColor,
                            onChanged: (val) {
                              setState(() {
                                _activeGatewayId = gwId;
                                _paymentMethod = val!;
                              });
                            },
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: themeColor,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              brandLabel,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 10.5,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  titleText,
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                    color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF334155),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  subText,
                                  style: const TextStyle(color: Colors.grey, fontSize: 10.5),
                                ),
                              ],
                            ),
                          ),
                          if (isSelected)
                            Icon(Icons.check_circle, color: themeColor, size: 20)
                          else
                            const Icon(Icons.radio_button_unchecked, color: Colors.grey, size: 20),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(isPayU ? Icons.shield_outlined : Icons.bolt, color: themeColor, size: 14),
                                const SizedBox(width: 5),
                                Text(
                                  detailText,
                                  style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFF334155)),
                                ),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFDCFCE7),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                badgeText,
                                style: const TextStyle(
                                  color: Color(0xFF16A34A),
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),

            // 6. Cancellation Policy
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFEE2E8)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.hourglass_empty, color: Colors.red, size: 16),
                      const SizedBox(width: 8),
                      const Text(
                        "Cancellation Policy",
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF7F1D1D)),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFEE2E2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          "Non-Refundable",
                          style: TextStyle(color: Color(0xFF991B1B), fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "This booking is non-refundable as per our policy. View full policy",
                    style: TextStyle(color: Color(0xFF991B1B), fontSize: 11),
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
              flex: 4,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text("Total Payable", style: TextStyle(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Text("₹${_totalPayable.toStringAsFixed(2)}", style: const TextStyle(color: Color(0xFF1E293B), fontSize: 20, fontWeight: FontWeight.bold)),
                      const SizedBox(width: 4),
                      const Icon(Icons.info_outline, color: Colors.grey, size: 14),
                    ],
                  ),
                  const SizedBox(height: 2),
                  const Text("Incl. of all taxes", style: TextStyle(color: Colors.grey, fontSize: 9, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              flex: 5,
              child: SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: () => _triggerPayment(payNow: _depositOption == 'Pay Now'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2B0B78), // Deep purple
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _depositOption == 'Pay Now'
                              ? (_activeGatewayId == 'payu'
                                  ? "⚡ Pay ₹${_totalPayable.toStringAsFixed(0)} via PayU"
                                  : "⚡ Pay ₹${_totalPayable.toStringAsFixed(0)} via UPI")
                              : "Confirm Booking",
                          maxLines: 1,
                          softWrap: false,
                          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 6),
                        const Icon(Icons.arrow_forward, size: 16),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVehicleSpecChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F7FF),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: const Color(0xFFE8E2FF)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: const Color(0xFF5B21B6), size: 13),
          const SizedBox(width: 4),
          Text(
            text,
            style: const TextStyle(
              color: Color(0xFF475569),
              fontSize: 9,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(IconData icon, String title, String? subtitle) {
    return Padding(
      padding: const EdgeInsets.only(left: 20, right: 20, top: 16, bottom: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: const Color(0xFF4313B8), size: 18),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1E293B)),
              ),
            ],
          ),
          if (subtitle != null) ...[
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(color: Colors.grey, fontSize: 11),
            ),
          ]
        ],
      ),
    );
  }
}
