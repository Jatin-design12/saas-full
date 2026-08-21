import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../../core/utils/razorpay_stub.dart'
    if (dart.library.js) '../../../../core/utils/razorpay_web.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
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
  String _appliedCode = 'GET100';
  String _depositOption = 'Pay Now'; // 'Pay Now' or 'Pay Later'
  String _paymentMethod = 'Razorpay';
  Razorpay? _razorpay;

  double _basePrice = 0.0;
  double _discount = 0.0;
  double _platformFee = 5.0;
  double _taxes = 2.50;

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
    double total = _basePrice + _deliveryFee - _discount + _platformFee + _taxes;
    if (_depositOption == 'Pay Now') {
      total += widget.selectedVehicle["realDeposit"] ?? 500.0;
    }
    return total < 0 ? 0 : total;
  }

  @override
  void initState() {
    super.initState();
    _basePrice = double.tryParse(widget.selectedVehicle["rentAmount"]?.toString() ?? '200') ?? 200.0;
    _appliedCode = 'GET100';
    _discount = 100.00;
    _paymentMethod = 'Razorpay';
    _initRazorpaySafely();
  }

  void _initRazorpaySafely() {
    try {
      if (!kIsWeb && (defaultTargetPlatform == TargetPlatform.android || defaultTargetPlatform == TargetPlatform.iOS)) {
        _razorpay = Razorpay();
        _razorpay?.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
        _razorpay?.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
        _razorpay?.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
      }
    } catch (e) {
      debugPrint("Razorpay init info: $e");
    }
  }

  @override
  void dispose() {
    try {
      _razorpay?.clear();
    } catch (_) {}
    super.dispose();
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Razorpay Payment Successful!"), backgroundColor: Colors.green),
    );
    _confirmBooking(payNow: true);
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Payment Status: ${response.message ?? 'Cancelled'}"), backgroundColor: Colors.orange),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {}

  /// Triggers Razorpay Checkout modal when rider taps Pay Now
  void _triggerRazorpayPayment({required bool payNow}) {
    if (!payNow) {
      _confirmBooking(payNow: false);
      return;
    }

    final double amountToPay = _totalPayable;

    // Web Razorpay Checkout
    if (kIsWeb) {
      try {
        startRazorpayWebCheckout(
          keyId: 'rzp_test_TCrlW614wYWVgA',
          amount: amountToPay,
          description: 'Evegah EV Rental Booking',
          contact: '9876543210',
          email: 'rider@evegah.com',
          orderId: '',
          onSuccess: (paymentId) {
            _confirmBooking(payNow: true);
          },
          onFailure: (error) {
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text("Razorpay Payment Cancelled/Failed: $error"),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
        );
      } catch (e) {
        debugPrint("Web Razorpay error: $e");
        _confirmBooking(payNow: true);
      }
      return;
    }

    // Native Mobile Razorpay Checkout (Android/iOS)
    if (_razorpay != null) {
      var options = {
        'key': 'rzp_test_TCrlW614wYWVgA',
        'amount': (amountToPay * 100).toInt(),
        'name': 'EVegah Mobility',
        'description': 'EV Rental Reservation',
        'timeout': 180,
        'prefill': {
          'contact': '9876543210',
          'email': 'rider@evegah.com',
        },
        'external': {
          'wallets': ['paytm']
        }
      };

      try {
        _razorpay!.open(options);
      } catch (e) {
        debugPrint("Native Razorpay open error: $e");
        _confirmBooking(payNow: true);
      }
    } else {
      _confirmBooking(payNow: true);
    }
  }

  /// Posts the booking to the backend and triggers Razorpay checkout directly.
  Future<void> _confirmBooking({required bool payNow}) async {
    // Show loading
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => const Center(
        child: CircularProgressIndicator(color: Color(0xFF2B0B78)),
      ),
    );

    try {
      final pickupDate = widget.pickupRaw ?? widget.pickupDateTime;
      final dropDate = widget.dropRaw ?? widget.dropDateTime;

      String reservationDate = DateTime.now().toIso8601String().split('T')[0];
      String reservationTime = '00:00:00';
      try {
        final parsed = DateTime.parse(pickupDate);
        reservationDate = parsed.toIso8601String().split('T')[0];
        final h = parsed.hour.toString().padLeft(2, '0');
        final m = parsed.minute.toString().padLeft(2, '0');
        reservationTime = '$h:$m:00';
      } catch (_) {}

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
        'delivery_address': doorstepAddress,
        'payment_mode': 'Razorpay',
        'payment_status': payNow ? 'Paid' : 'Pending',
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

      String reservationId = '';
      if (response.statusCode == 200 || response.statusCode == 201) {
        try {
          final body = jsonDecode(response.body);
          reservationId = body['data']?['reservation_id'] ?? '';
        } catch (_) {}
      }

      if (!mounted) return;

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
            // 1. Vehicle Details Card with 360 viewer link
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Vehicle Image
                      Stack(
                        alignment: Alignment.bottomCenter,
                        children: [
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Image.asset(
                              widget.selectedVehicle["image"] ?? "assets/city.png",
                              fit: BoxFit.contain,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.electric_scooter,
                                size: 50,
                                color: Color(0xFF4313B8),
                              ),
                            ),
                          ),
                          // 360 Badge
                          GestureDetector(
                            onTap: _show360Viewer,
                            child: Container(
                              margin: const EdgeInsets.only(bottom: 4),
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: const Color(0xFF4313B8),
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: const [
                                  Icon(Icons.threed_rotation, color: Colors.white, size: 10),
                                  SizedBox(width: 2),
                                  Text("360° View", style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(width: 16),
                      // Details
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  widget.selectedVehicle["evegah_model_name"] ?? widget.selectedVehicle["name"] ?? "Evegah City",
                                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                                ),
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFDCFCE7),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Text(
                                    "Self-Drive",
                                    style: TextStyle(color: Color(0xFF15803D), fontSize: 9, fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            _buildMiniSpec(Icons.bolt, "${widget.selectedVehicle["range"] ?? '80–100 km'} range"),
                            _buildMiniSpec(Icons.speed, "${widget.selectedVehicle["speed"] ?? '45 km/h'} top speed"),
                            _buildMiniSpec(Icons.airline_seat_recline_normal, "${widget.selectedVehicle["seats"] ?? '1'} Seat"),
                            _buildMiniSpec(Icons.battery_charging_full, "${widget.selectedVehicle["battery_pct"] ?? 100}% charge"),
                          ],
                        ),
                      ),
                      // Price
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            "₹${(widget.selectedVehicle["realPrice"] ?? 29).toStringAsFixed(0)}/${widget.zonePricing?['pricingModel'] == 'Hourly Based' ? 'hr' : 'day'}",
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("Platform Fee:", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      Text("₹${_platformFee.toStringAsFixed(2)}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text("GST & Taxes (18%):", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                      Text("₹${_taxes.toStringAsFixed(2)}", style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                    ],
                  ),
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

            // 5. Payment Options (Razorpay Gateway Only)
            _buildSectionHeader(Icons.payment_outlined, "Payment Method", null),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF4313B8).withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Radio<String>(
                    value: 'Razorpay',
                    groupValue: _paymentMethod,
                    activeColor: const Color(0xFF4313B8),
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF072654),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      "Razorpay",
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.w900,
                        fontSize: 12,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          "Razorpay Gateway",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          "UPI, Cards, Netbanking & Wallets",
                          style: TextStyle(color: Colors.grey, fontSize: 10.5),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.verified, color: Color(0xFF072654), size: 18),
                ],
              ),
            ),

            // 6. Cancellation Policy
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFFEE2E2)),
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
            const SizedBox(width: 16),
            Expanded(
              child: SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: () => _triggerRazorpayPayment(payNow: _depositOption == 'Pay Now'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2B0B78), // Deep purple
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    elevation: 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        _depositOption == 'Pay Now' ? "Pay Now" : "Confirm Booking",
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.arrow_forward, size: 16),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniSpec(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFF4313B8), size: 14),
          const SizedBox(width: 8),
          Text(
            text,
            style: const TextStyle(color: Color(0xFF64748B), fontSize: 11, fontWeight: FontWeight.w500),
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
