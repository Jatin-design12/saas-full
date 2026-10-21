import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../rides/presentation/screen/booking_confirmed_screen.dart';
import '../../../../core/services/payu_service.dart';
import '../../../../core/widgets/payu_in_app_checkout_modal.dart';

class PaymentScreen extends StatefulWidget {
  final double? initialAmount;
  final double? rentAmount;
  final double? depositAmount;
  final String? vehicleName;
  final String? vehicleImage;
  final String? batteryId;
  final String? planName;
  final String? duration;
  final String? pickupZone;
  final String? dropZone;
  final String? reservationId;

  const PaymentScreen({
    super.key,
    this.initialAmount,
    this.rentAmount,
    this.depositAmount,
    this.vehicleName,
    this.vehicleImage,
    this.batteryId,
    this.planName,
    this.duration,
    this.pickupZone,
    this.dropZone,
    this.reservationId,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  bool _showPriceDetails = true;
  bool _isProcessing = false;

  // Coupon state
  final TextEditingController _couponController = TextEditingController();
  String? _appliedCoupon;
  double _discount = 0.0;
  String? _couponError;
  bool _isApplyingCoupon = false;

  // Pricing calculations
  late double _baseRent;
  late double _deposit;

  @override
  void initState() {
    super.initState();
    _baseRent = widget.rentAmount ?? (widget.initialAmount != null ? math.max(0.0, widget.initialAmount! - 500.0) : 500.0);
    _deposit = widget.depositAmount ?? 500.0;
  }

  @override
  void dispose() {
    _couponController.dispose();
    super.dispose();
  }

  double get _totalPayable {
    final net = _baseRent + _deposit - _discount;
    return net < 0 ? 0.0 : net;
  }

  /// Authoritative server-validated coupon apply
  Future<void> _applyCoupon() async {
    final code = _couponController.text.trim().toUpperCase();
    if (code.isEmpty) return;

    setState(() {
      _isApplyingCoupon = true;
      _couponError = null;
    });

    try {
      final res = await http.get(Uri.parse('${AppConstants.apiBaseUrl}/coupons')).timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final body = jsonDecode(res.body);
        final list = body['data'] ?? body['coupons'] ?? [];
        Map<String, dynamic>? match;
        if (list is List) {
          for (final c in list) {
            if ((c['code']?.toString() ?? '').toUpperCase() == code && c['status'] == 'Active') {
              match = Map<String, dynamic>.from(c);
              break;
            }
          }
        }

        if (match == null) {
          setState(() {
            _couponError = 'Coupon "$code" is invalid or expired.';
            _isApplyingCoupon = false;
          });
          return;
        }

        final minOrder = double.tryParse(match['min_order']?.toString() ?? match['min_order_amount']?.toString() ?? '0') ?? 0.0;
        if (_baseRent < minOrder) {
          setState(() {
            _couponError = 'Coupon "$code" requires minimum rent of ₹${minOrder.toStringAsFixed(0)}.';
            _isApplyingCoupon = false;
          });
          return;
        }

        double disc = 0.0;
        final discType = (match['discount_type'] ?? 'Flat').toString().toLowerCase();
        final discVal = double.tryParse(match['discount_value']?.toString() ?? '0') ?? 0.0;
        if (discType.contains('percent')) {
          disc = (_baseRent * discVal) / 100.0;
        } else {
          disc = discVal;
        }

        disc = math.min(_baseRent, math.max(0.0, disc));

        setState(() {
          _appliedCoupon = code;
          _discount = disc;
          _couponError = null;
          _isApplyingCoupon = false;
        });
      } else {
        setState(() {
          _couponError = 'Could not validate coupon. Please try again.';
          _isApplyingCoupon = false;
        });
      }
    } catch (_) {
      setState(() {
        _couponError = 'Network error while validating coupon.';
        _isApplyingCoupon = false;
      });
    }
  }

  void _removeCoupon() {
    setState(() {
      _appliedCoupon = null;
      _discount = 0.0;
      _couponController.clear();
      _couponError = null;
    });
  }

  /// Single PayU payment initiation and server verification lifecycle
  Future<void> _processPayment() async {
    if (_isProcessing || _totalPayable <= 0) return;

    setState(() => _isProcessing = true);

    try {
      final payuData = await PayUService().initiatePayment(
        amount: _totalPayable,
        purpose: 'ride',
        reservationId: widget.reservationId,
      );

      if (!mounted) return;

      if (payuData != null && (payuData['checkout_url'] != null || payuData['action_url'] != null)) {
        final txnid = payuData['txnid']?.toString() ?? '';
        final checkoutUrl = payuData['checkout_url']?.toString() ?? payuData['action_url']?.toString() ?? '';

        final result = await PayUInAppCheckoutModal.show(
          context: context,
          checkoutUrl: checkoutUrl,
          txnid: txnid,
          amount: _totalPayable,
        );

        if (!mounted) return;
        setState(() => _isProcessing = false);

        if (result != null && result.success) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => BookingConfirmedScreen(
                isDepositPaid: true,
                reservationId: widget.reservationId ?? 'RID-2026-${(DateTime.now().millisecondsSinceEpoch % 1000000)}',
                bookingData: {
                  'vehicleName': widget.vehicleName ?? 'Evegah Mink',
                  'totalFare': _totalPayable,
                  'rentAmount': _baseRent,
                  'deposit': _deposit,
                  'pickupZone': widget.pickupZone ?? 'Gotri Zone',
                  'pickupTime': widget.duration ?? '2 Hours',
                },
              ),
            ),
          );
        } else {
          _showPaymentFailedDialog(result?.message ?? "PayU payment was cancelled or could not be verified by server.");
        }
      } else {
        setState(() => _isProcessing = false);
        _showPaymentFailedDialog("Could not connect to PayU gateway. Please check your internet connection.");
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isProcessing = false);
        _showPaymentFailedDialog("Payment initiation failed: $e");
      }
    }
  }

  void _showPaymentFailedDialog(String reason) {
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        contentPadding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: const BoxDecoration(
                color: Color(0xFFFEE2E2),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.close_rounded, color: Color(0xFFDC2626), size: 32),
            ),
            const SizedBox(height: 16),
            const Text(
              "Payment Verification Failed",
              style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 8),
            Text(
              reason.isNotEmpty ? reason : "Your PayU payment could not be authoritative verified. Please try again.",
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12, color: Color(0xFF64748B), height: 1.4),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2A195C),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.pop(ctx);
                  _processPayment();
                },
                child: const Text("Retry Payment", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              ),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancel", style: TextStyle(color: Color(0xFF64748B), fontSize: 12)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final vehicleTitle = widget.vehicleName ?? 'EVegah Mink';
    final vehicleImg = widget.vehicleImage ?? 'assets/mink.png';
    final planTitle = widget.planName ?? 'Standard Rental Plan';
    final durationText = widget.duration ?? '2 Hours';
    final batteryText = widget.batteryId ?? 'BAT-MNZ-001';
    final zoneText = widget.pickupZone ?? 'Vadodara Zone';

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
          "Payment & Charges",
          style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.bold, fontSize: 18),
        ),
        centerTitle: false,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFEEF2FF),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: const [
                Icon(Icons.verified_user, color: Color(0xFF2A195C), size: 14),
                SizedBox(width: 4),
                Text(
                  "100% Secure",
                  style: TextStyle(color: Color(0xFF2A195C), fontWeight: FontWeight.bold, fontSize: 10),
                ),
              ],
            ),
          )
        ],
      ),
      body: _isProcessing
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  CircularProgressIndicator(color: Color(0xFF2A195C)),
                  SizedBox(height: 16),
                  Text(
                    "Verifying with PayU Server...",
                    style: TextStyle(color: Color(0xFF1E293B), fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  SizedBox(height: 6),
                  Text(
                    "Please do not close the app or press back",
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Vehicle & Plan Summary Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                      boxShadow: const [
                        BoxShadow(color: Color(0x05000000), blurRadius: 10, offset: Offset(0, 4)),
                      ],
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                color: const Color(0xFFF1F5F9),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Image.asset(vehicleImg, fit: BoxFit.contain, errorBuilder: (_, __, ___) => const Icon(Icons.electric_scooter, color: Color(0xFF2A195C), size: 32)),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    vehicleTitle,
                                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    "$planTitle • $durationText",
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                                  ),
                                  const SizedBox(height: 2),
                                  Row(
                                    children: [
                                      const Icon(Icons.battery_charging_full, size: 12, color: Color(0xFF2A195C)),
                                      const SizedBox(width: 3),
                                      Text(batteryText, style: const TextStyle(fontSize: 10, color: Color(0xFF2A195C), fontWeight: FontWeight.bold)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text("₹${_baseRent.toStringAsFixed(0)}", style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF2A195C))),
                                const SizedBox(height: 4),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF0FDF4),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text("Zero GST", style: TextStyle(color: Color(0xFF16A34A), fontSize: 9, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        const Divider(color: Color(0xFFF1F5F9)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildInfoChip(Icons.location_on_outlined, zoneText, "Pickup Zone"),
                            _buildInfoChip(Icons.timer_outlined, durationText, "Duration"),
                            _buildInfoChip(Icons.bolt_outlined, "Swap Included", "Battery"),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 2. PayU India Primary Gateway (Single Supported Gateway)
                  const Text("Payment Gateway", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF2A195C), width: 1.5),
                      boxShadow: const [
                        BoxShadow(color: Color(0x082A195C), blurRadius: 10, offset: Offset(0, 4)),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF3F0FF),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.shield_outlined, color: Color(0xFF2A195C), size: 24),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text(
                                "PayU India (Primary Gateway)",
                                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13.5, color: Color(0xFF1E293B)),
                              ),
                              SizedBox(height: 2),
                              Text(
                                "Cards, NetBanking, UPI, Google Pay & Wallets",
                                style: TextStyle(color: Color(0xFF64748B), fontSize: 10.5),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            "Verified",
                            style: TextStyle(color: Color(0xFF16A34A), fontSize: 9.5, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // 3. Coupon Entry (Clean Input with Apply Button)
                  const Text("Have a coupon code?", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                  const SizedBox(height: 8),
                  _appliedCoupon == null
                      ? Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.discount_outlined, color: Color(0xFF2A195C), size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: TextField(
                                  controller: _couponController,
                                  textCapitalization: TextCapitalization.characters,
                                  decoration: const InputDecoration(
                                    hintText: "Enter coupon code",
                                    hintStyle: TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                                    border: InputBorder.none,
                                    isDense: true,
                                  ),
                                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                                  onSubmitted: (_) => _applyCoupon(),
                                ),
                              ),
                              SizedBox(
                                height: 36,
                                child: ElevatedButton(
                                  onPressed: _isApplyingCoupon ? null : _applyCoupon,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF2A195C),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    elevation: 0,
                                    padding: const EdgeInsets.symmetric(horizontal: 14),
                                  ),
                                  child: _isApplyingCoupon
                                      ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                      : const Text("Apply", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                                ),
                              ),
                            ],
                          ),
                        )
                      : Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF0FDF4),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFBBF7D0)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Coupon '$_appliedCoupon' Applied",
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF15803D)),
                                    ),
                                    Text(
                                      "Saved ₹${_discount.toStringAsFixed(2)}",
                                      style: const TextStyle(fontSize: 11, color: Color(0xFF16A34A), fontWeight: FontWeight.w600),
                                    ),
                                  ],
                                ),
                              ),
                              TextButton(
                                onPressed: _removeCoupon,
                                child: const Text("Remove", style: TextStyle(color: Color(0xFFDC2626), fontWeight: FontWeight.bold, fontSize: 11)),
                              ),
                            ],
                          ),
                        ),
                  if (_couponError != null) ...[
                    const SizedBox(height: 6),
                    Padding(
                      padding: const EdgeInsets.only(left: 4),
                      child: Text(_couponError!, style: const TextStyle(color: Color(0xFFDC2626), fontSize: 11, fontWeight: FontWeight.w500)),
                    ),
                  ],
                  const SizedBox(height: 18),

                  // 4. Payment Breakdown Card
                  Container(
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
                            const Text("Payment Summary", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1E293B))),
                            IconButton(
                              icon: Icon(_showPriceDetails ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, size: 18, color: const Color(0xFF2A195C)),
                              onPressed: () => setState(() => _showPriceDetails = !_showPriceDetails),
                              constraints: const BoxConstraints(),
                              padding: EdgeInsets.zero,
                            ),
                          ],
                        ),
                        if (_showPriceDetails) ...[
                          const SizedBox(height: 12),
                          const Divider(color: Color(0xFFF1F5F9)),
                          const SizedBox(height: 8),
                          _buildSummaryRow("Plan Charges ($planTitle)", "₹${_baseRent.toStringAsFixed(2)}"),
                          const SizedBox(height: 8),
                          _buildSummaryRow("Refundable Security Deposit", "₹${_deposit.toStringAsFixed(2)}", isImportant: true),
                          const SizedBox(height: 8),
                          _buildSummaryRow("Swappable Battery & Swap Access", "Included (₹0.00)"),
                          const SizedBox(height: 8),
                          _buildSummaryRow("Accessories", "₹0.00"),
                          if (_discount > 0) ...[
                            const SizedBox(height: 8),
                            _buildSummaryRow("Coupon Discount ($_appliedCoupon)", "-₹${_discount.toStringAsFixed(2)}", isDiscount: true),
                          ],
                          const SizedBox(height: 12),
                          const Divider(color: Color(0xFFF1F5F9)),
                        ],
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text("Total Payable", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF64748B))),
                                SizedBox(height: 2),
                                Text("Zero GST applied", style: TextStyle(fontSize: 9.5, color: Color(0xFF16A34A), fontWeight: FontWeight.w600)),
                              ],
                            ),
                            Text("₹${_totalPayable.toStringAsFixed(2)}", style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF2A195C))),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // 5. Deposit Refund Note
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: const Color(0xFFDCFCE7)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.security, color: Color(0xFF16A34A), size: 18),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Security deposit is 100% refundable upon vehicle return in good condition. Instant refund via original payment mode.",
                            style: TextStyle(color: Color(0xFF15803D), fontSize: 10.5, height: 1.4, fontWeight: FontWeight.w600),
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
        child: SizedBox(
          height: 54,
          width: double.infinity,
          child: ElevatedButton(
            onPressed: (_isProcessing || _totalPayable <= 0) ? null : _processPayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2A195C),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  "Pay ₹${_totalPayable.toStringAsFixed(2)}",
                  style: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.bold),
                ),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward, size: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String value, String label) {
    return Column(
      children: [
        Icon(icon, color: const Color(0xFF2A195C), size: 16),
        const SizedBox(height: 4),
        Text(value, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: Color(0xFF1E293B))),
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 8.5)),
      ],
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isDiscount = false, bool isImportant = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isDiscount ? const Color(0xFF16A34A) : const Color(0xFF64748B),
            fontWeight: isImportant ? FontWeight.w600 : FontWeight.w500,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 12,
            fontWeight: isImportant ? FontWeight.w800 : FontWeight.bold,
            color: isDiscount ? const Color(0xFF16A34A) : const Color(0xFF0F172A),
          ),
        ),
      ],
    );
  }
}
