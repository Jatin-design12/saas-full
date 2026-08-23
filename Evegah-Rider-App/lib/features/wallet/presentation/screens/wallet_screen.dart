import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:razorpay_flutter/razorpay_flutter.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../../core/utils/razorpay_stub.dart'
    if (dart.library.js) '../../../../core/utils/razorpay_web.dart';

import '../../data/services/wallet_service.dart';
import '../../../offers/presentation/screens/offer_screen.dart';
import '../../../support/presentation/screens/help_screen.dart';
import 'transaction_detail_screen.dart';
import '../../../notifications/presentation/screens/notification_screen.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final WalletService _walletService = WalletService();
  final TextEditingController _amountController = TextEditingController();

  Razorpay? _razorpay;

  bool _isProcessingPayment = false;
  bool _showBalance = true;

  double _walletBalance = 500.00;
  final double _bonusBalance = 150.00;

  List<Map<String, dynamic>> _transactions = [];
  bool _isLoadingTransactions = true;

  @override
  void initState() {
    super.initState();

    _initRazorpaySafely();
    _fetchBalance();
    _fetchRealTransactions();
  }

  // =========================================================
  // FETCH TRANSACTIONS
  // =========================================================

  Future<void> _fetchRealTransactions() async {
    final mobile =
        await SessionService().getUserMobile() ?? "+91 98765 43210";

    final url =
        '${AppConstants.apiBaseUrl}/reservations?limit=100&search=${Uri.encodeComponent(mobile)}';

    try {
      final response = await http
          .get(Uri.parse(url))
          .timeout(const Duration(seconds: 4));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);

        if (data['status'] == 'success' && data['data'] != null) {
          final List dbList = data['data'];

          final List<Map<String, dynamic>> realTxList = [];

          for (var r in dbList) {
            final double fare =
                double.tryParse("${r['fare'] ?? r['rent'] ?? 0}") ?? 0.0;

            final double deposit =
                double.tryParse("${r['deposit'] ?? 0}") ?? 0.0;

            final double total = double.tryParse(
                  "${r['total_amount'] ?? r['total_payable'] ?? (fare + deposit)}",
                ) ??
                (fare + deposit);

            final String dateStr = r['reservation_date'] != null
                ? r['reservation_date'].toString().split('T').first
                : 'Recent';

            realTxList.add({
              "title":
                  "Ride Reservation (${r['payment_status'] ?? 'Paid'})",
              "subtitle":
                  "${r['vehicle_model'] ?? 'Evegah EV'} • ${r['pickup_zone'] ?? 'Gotri Zone'}",
              "date":
                  "$dateStr, ${r['reservation_time'] ?? '10:00 AM'}",
              "amount":
                  "- ₹${total.toStringAsFixed(2)}",
              "isCredit": false,
              "icon": Icons.electric_scooter_rounded,
              "iconBg": const Color(0xFFEEF2FF),
              "iconColor": const Color(0xFF4313B8),
            });
          }

          if (mounted) {
            setState(() {
              _transactions = realTxList;
              _isLoadingTransactions = false;
            });
          }

          return;
        }
      }
    } catch (e) {
      debugPrint(
        "Error fetching real wallet transactions: $e",
      );
    }

    if (mounted) {
      setState(() {
        _isLoadingTransactions = false;
      });
    }
  }

  // =========================================================
  // RAZORPAY
  // =========================================================

  void _initRazorpaySafely() {
    try {
      if (!kIsWeb &&
          (defaultTargetPlatform == TargetPlatform.android ||
              defaultTargetPlatform == TargetPlatform.iOS)) {
        _razorpay = Razorpay();

        _razorpay?.on(
          Razorpay.EVENT_PAYMENT_SUCCESS,
          _handlePaymentSuccess,
        );

        _razorpay?.on(
          Razorpay.EVENT_PAYMENT_ERROR,
          _handlePaymentError,
        );

        _razorpay?.on(
          Razorpay.EVENT_EXTERNAL_WALLET,
          _handleExternalWallet,
        );
      }
    } catch (e) {
      debugPrint(
        "Razorpay init suppressed for unsupported platform: $e",
      );
    }
  }

  @override
  void dispose() {
    try {
      _razorpay?.clear();
    } catch (_) {}

    _amountController.dispose();

    super.dispose();
  }

  // =========================================================
  // WALLET BALANCE
  // =========================================================

  Future<void> _fetchBalance() async {
    try {
      double bal = await _walletService.fetchWalletBalance();

      if (bal > 0 && mounted) {
        setState(() {
          _walletBalance = bal;
        });
      }
    } catch (_) {}
  }

  // =========================================================
  // PAYMENT CALLBACKS
  // =========================================================

  void _handlePaymentSuccess(
    PaymentSuccessResponse response,
  ) {
    setState(() {
      _isProcessingPayment = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          "Payment Successful! Wallet Recharged.",
        ),
        backgroundColor: Colors.green,
      ),
    );

    _fetchBalance();
  }

  void _handlePaymentError(
    PaymentFailureResponse response,
  ) {
    setState(() {
      _isProcessingPayment = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          "Payment Failed: ${response.message}",
        ),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _handleExternalWallet(
    ExternalWalletResponse response,
  ) {
    setState(() {
      _isProcessingPayment = false;
    });
  }

  // =========================================================
  // START PAYMENT
  // =========================================================

  Future<void> _startPayment(double amount) async {
    setState(() {
      _isProcessingPayment = true;
    });

    Map<String, String>? orderData =
        await _walletService.createOrder(
      amount.toInt(),
    );

    if (orderData == null) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              "Failed to secure payment connection. Using mock top-up.",
            ),
            backgroundColor: Colors.orange,
          ),
        );

        setState(() {
          _walletBalance += amount;
          _isProcessingPayment = false;
        });
      }

      return;
    }

    // ---------------------------------------------------------
    // WEB
    // ---------------------------------------------------------

    if (kIsWeb) {
      startRazorpayWebCheckout(
        keyId:
            orderData["keyId"] ??
                'rzp_test_TCrlW614wYWVgA',
        amount: amount,
        description: 'Wallet Recharge',
        contact: '9876543210',
        email: 'user@evegah.com',
        orderId: orderData["orderId"] ?? '',
        onSuccess: (paymentId) {
          _handlePaymentSuccess(
            PaymentSuccessResponse.fromMap({
              "razorpay_payment_id": paymentId,
              "razorpay_order_id": orderData["orderId"],
              "razorpay_signature": "",
            }),
          );
        },
        onFailure: (error) {
          _handlePaymentError(
            PaymentFailureResponse.fromMap({
              "code": 0,
              "message": error,
            }),
          );
        },
      );

      return;
    }

    // ---------------------------------------------------------
    // MOBILE
    // ---------------------------------------------------------

    var options = {
      'key': orderData["keyId"],
      'amount': (amount * 100).toInt(),
      'name': 'EVegah Mobility',
      'description': 'Wallet Recharge',
      'order_id': orderData["orderId"],
      'timeout': 120,
      'prefill': {
        'contact': '9876543210',
        'email': 'user@evegah.com',
      },
    };

    try {
      if (_razorpay != null) {
        _razorpay!.open(options);
      } else {
        await Future.delayed(
          const Duration(seconds: 1),
        );

        _handlePaymentSuccess(
          PaymentSuccessResponse.fromMap({
            "razorpay_payment_id":
                "pay_mock_${DateTime.now().millisecondsSinceEpoch}",
            "razorpay_order_id":
                orderData["orderId"],
            "razorpay_signature": "mock_sig",
          }),
        );
      }
    } catch (e) {
      setState(() {
        _isProcessingPayment = false;
      });
    }
  }

  // =========================================================
  // BUILD
  // =========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),

      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),

          padding: const EdgeInsets.symmetric(
            horizontal: 20,
            vertical: 14,
          ),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,

            children: [

              // =================================================
              // HEADER
              // =================================================

              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,

                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [

                  Column(
                    crossAxisAlignment:
                        CrossAxisAlignment.start,

                    mainAxisSize:
                        MainAxisSize.min,

                    children: const [

                      Text(
                        "Wallet",

                        style: TextStyle(
                          fontWeight: FontWeight.w900,
                          fontSize: 28,
                          color: Color(0xFF0F172A),
                          letterSpacing: -0.5,
                        ),
                      ),

                      SizedBox(height: 4),

                      Text(
                        "Manage your balance and payments",

                        style: TextStyle(
                          fontSize: 13,
                          color: Color(0xFF64748B),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),

                  // =================================================
                  // NOTIFICATION BUTTON
                  // =================================================

                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              const NotificationScreen(),
                        ),
                      );
                    },

                    child: Stack(
                      clipBehavior: Clip.none,

                      children: [

                        Container(
                          padding:
                              const EdgeInsets.all(8),

                          decoration: BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,

                            border: Border.all(
                              color:
                                  const Color(0xFFE2E8F0),
                            ),
                          ),

                          child: const Icon(
                            Icons
                                .notifications_none_rounded,

                            color:
                                Color(0xFF0F172A),

                            size: 22,
                          ),
                        ),

                        Positioned(
                          right: 2,
                          top: 2,

                          child: Container(
                            padding:
                                const EdgeInsets.all(5),

                            decoration:
                                const BoxDecoration(
                              color:
                                  Color(0xFF4F46E5),
                              shape:
                                  BoxShape.circle,
                            ),

                            child: const Text(
                              "2",

                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 9,
                                fontWeight:
                                    FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],

              ),

              const SizedBox(height: 18),

              // =================================================
              // BALANCE CARD
              // =================================================

              _buildPurpleBalanceCard(),

              const SizedBox(height: 28),

              // =================================================
              // QUICK ACTIONS HEADER
              // =================================================

              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,

                crossAxisAlignment:
                    CrossAxisAlignment.center,

                children: [

                  const Text(
                    "Quick Actions",

                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.3,
                    ),
                  ),

                  GestureDetector(
                    onTap: () {},

                    child: Row(
                      children: const [

                        Text(
                          "More",

                          style: TextStyle(
                            fontSize: 16,
                            fontWeight:
                                FontWeight.w700,
                            color:
                                Color(0xFF5B45E0),
                          ),
                        ),

                        SizedBox(width: 4),

                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 20,
                          color:
                              Color(0xFF5B45E0),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // =================================================
              // QUICK ACTION CARDS
              // =================================================

              Row(
                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [

                  Expanded(
                    child: _buildQuickActionItem(
                      title:
                          "Transaction\nHistory",

                      icon:
                          Icons.description_outlined,

                      iconBg:
                          const Color(0xFFEFFBF3),

                      iconColor:
                          const Color(0xFF16A34A),

                      onTap: () {},
                    ),
                  ),

                  const SizedBox(width: 10),

                  Expanded(
                    child: _buildQuickActionItem(
                      title:
                          "Promotions\n& Offers",

                      icon:
                          Icons.local_offer_outlined,

                      iconBg:
                          const Color(0xFFF3EEFF),

                      iconColor:
                          const Color(0xFF7C3AED),

                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                const OfferScreen(),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(width: 10),

                  Expanded(
                    child: _buildQuickActionItem(
                      title:
                          "Payment\nMethods",

                      icon:
                          Icons.credit_card_rounded,

                      iconBg:
                          const Color(0xFFEEF5FF),

                      iconColor:
                          const Color(0xFF2563EB),

                      onTap: () {},
                    ),
                  ),

                  const SizedBox(width: 10),

                  Expanded(
                    child: _buildQuickActionItem(
                      title:
                          "Help &\nSupport",

                      icon:
                          Icons.headset_mic_outlined,

                      iconBg:
                          const Color(0xFFFFEEF6),

                      iconColor:
                          const Color(0xFFDB2777),

                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) =>
                                const HelpScreen(),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 32),

              // =================================================
              // RECENT TRANSACTIONS HEADER
              // =================================================

              Row(
                mainAxisAlignment:
                    MainAxisAlignment.spaceBetween,

                children: [

                  const Text(
                    "Recent Transactions",

                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.3,
                    ),
                  ),

                  GestureDetector(
                    onTap: () {},

                    child: Row(
                      children: const [

                        Text(
                          "View All",

                          style: TextStyle(
                            fontSize: 16,
                            fontWeight:
                                FontWeight.w700,
                            color:
                                Color(0xFF5B45E0),
                          ),
                        ),

                        SizedBox(width: 4),

                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 20,
                          color:
                              Color(0xFF5B45E0),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // =================================================
              // TRANSACTION LIST
              // =================================================

              Container(
                decoration: BoxDecoration(
                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(20),

                  border: Border.all(
                    color:
                        const Color(0xFFF1F5F9),
                    width: 1.5,
                  ),

                  boxShadow: [
                    BoxShadow(
                      color:
                          Colors.black.withValues(
                        alpha: 0.02,
                      ),

                      blurRadius: 10,

                      offset:
                          const Offset(0, 4),
                    ),
                  ],
                ),

                child: Column(
                  mainAxisSize:
                      MainAxisSize.min,

                  children: _transactions
                      .asMap()
                      .entries
                      .map((entry) {

                    final idx =
                        entry.key;

                    final tx =
                        entry.value;

                    final isLast =
                        idx ==
                            _transactions.length -
                                1;

                    return _buildTransactionTile(
                      tx,
                      isLast,
                    );

                  }).toList(),
                ),
              ),

              const SizedBox(height: 22),

              // =================================================
              // THANK YOU CARD
              // =================================================

              _buildThankYouCard(),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  // ===========================================================
  // PURPLE BALANCE CARD
  // ===========================================================

  Widget _buildPurpleBalanceCard() {
    return Container(
      width: double.infinity,

      padding: const EdgeInsets.all(22),

      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFF1B0764),
            Color(0xFF2C10A3),
          ],

          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),

        borderRadius:
            BorderRadius.circular(24),

        boxShadow: [
          BoxShadow(
            color:
                const Color(0xFF2C10A3)
                    .withValues(alpha: 0.35),

            blurRadius: 16,

            offset:
                const Offset(0, 8),
          ),
        ],
      ),

      child: Column(
        crossAxisAlignment:
            CrossAxisAlignment.start,

        mainAxisSize:
            MainAxisSize.min,

        children: [

          Row(
            mainAxisAlignment:
                MainAxisAlignment.spaceBetween,

            crossAxisAlignment:
                CrossAxisAlignment.start,

            children: [

              Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,

                mainAxisSize:
                    MainAxisSize.min,

                children: [

                  Row(
                    children: [

                      const Text(
                        "Total Balance",

                        style: TextStyle(
                          fontSize: 13.5,
                          fontWeight:
                              FontWeight.w600,
                          color:
                              Colors.white70,
                        ),
                      ),

                      const SizedBox(width: 8),

                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _showBalance =
                                !_showBalance;
                          });
                        },

                        child: Icon(
                          _showBalance
                              ? Icons
                                  .visibility_outlined
                              : Icons
                                  .visibility_off_outlined,

                          size: 18,

                          color:
                              Colors.white70,
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8),

                  Text(
                    _showBalance
                        ? "₹${_walletBalance.toStringAsFixed(2)}"
                        : "₹ ••••••",

                    style:
                        const TextStyle(
                      fontSize: 36,
                      fontWeight:
                          FontWeight.w900,
                      color:
                          Colors.white,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),

              // Wallet illustration
              _build3DWalletGraphic(),
            ],
          ),

          const SizedBox(height: 14),

          // Bonus Balance
          Container(
            padding:
                const EdgeInsets.symmetric(
              horizontal: 12,
              vertical: 6,
            ),

            decoration: BoxDecoration(
              color:
                  Colors.white.withValues(
                alpha: 0.15,
              ),

              borderRadius:
                  BorderRadius.circular(16),
            ),

            child: Row(
              mainAxisSize:
                  MainAxisSize.min,

              children: [

                const Icon(
                  Icons.card_giftcard_rounded,
                  size: 14,
                  color: Colors.white,
                ),

                const SizedBox(width: 6),

                Text(
                  "Bonus Balance: ₹${_bonusBalance.toStringAsFixed(2)}",

                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight:
                        FontWeight.bold,
                    color: Colors.white,
                  ),
                ),

                const SizedBox(width: 4),

                const Icon(
                  Icons.chevron_right_rounded,
                  size: 14,
                  color: Colors.white70,
                ),
              ],
            ),
          ),

          const SizedBox(height: 22),

          // Buttons
          Row(
            children: [

              Expanded(
                child: ElevatedButton.icon(
                  onPressed:
                      () => _showAddMoneyDialog(),

                  icon: const Icon(
                    Icons.add_rounded,
                    color:
                        Color(0xFF0F172A),
                    size: 20,
                  ),

                  label: const Text(
                    "Add Money",

                    style: TextStyle(
                      fontWeight:
                          FontWeight.w900,
                      fontSize: 14.5,
                      color:
                          Color(0xFF0F172A),
                    ),
                  ),

                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(0xFFD2FC00),

                    elevation: 0,

                    padding:
                        const EdgeInsets.symmetric(
                      vertical: 14,
                    ),

                    shape:
                        RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(
                        14,
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(width: 12),

              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},

                  icon: const Icon(
                    Icons.north_east_rounded,
                    color: Colors.white,
                    size: 18,
                  ),

                  label: const Text(
                    "Withdraw",

                    style: TextStyle(
                      fontWeight:
                          FontWeight.w800,
                      fontSize: 14.5,
                      color: Colors.white,
                    ),
                  ),

                  style:
                      ElevatedButton.styleFrom(
                    backgroundColor:
                        const Color(0xFF5A44E5),

                    elevation: 0,

                    padding:
                        const EdgeInsets.symmetric(
                      vertical: 14,
                    ),

                    shape:
                        RoundedRectangleBorder(
                      borderRadius:
                          BorderRadius.circular(
                        14,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ===========================================================
  // WALLET GRAPHIC
  // ===========================================================

  Widget _build3DWalletGraphic() {
    return SizedBox(
      width: 85,
      height: 75,

      child: Stack(
        children: [

          // Yellow card
          Positioned(
            top: 4,
            right: 12,

            child: Container(
              width: 50,
              height: 30,

              decoration: BoxDecoration(
                color:
                    const Color(0xFFD2FC00),

                borderRadius:
                    BorderRadius.circular(6),

                boxShadow: [
                  BoxShadow(
                    color:
                        Colors.black.withValues(
                      alpha: 0.2,
                    ),
                    blurRadius: 4,
                  ),
                ],
              ),
            ),
          ),

          // Main wallet
          Positioned(
            bottom: 0,
            right: 0,

            child: Container(
              width: 76,
              height: 56,

              decoration: BoxDecoration(
                gradient:
                    const LinearGradient(
                  colors: [
                    Color(0xFF6B42F2),
                    Color(0xFF4C27D0),
                  ],

                  begin:
                      Alignment.topLeft,

                  end:
                      Alignment.bottomRight,
                ),

                borderRadius:
                    BorderRadius.circular(14),

                border: Border.all(
                  color:
                      Colors.white.withValues(
                    alpha: 0.2,
                  ),

                  width: 1,
                ),

                boxShadow: [
                  BoxShadow(
                    color:
                        Colors.black.withValues(
                      alpha: 0.3,
                    ),

                    blurRadius: 10,

                    offset:
                        const Offset(0, 4),
                  ),
                ],
              ),

              child: Stack(
                children: [

                  Positioned(
                    right: 8,
                    top: 22,

                    child: Container(
                      width: 14,
                      height: 14,

                      decoration:
                          const BoxDecoration(
                        color:
                            Color(0xFFD2FC00),
                        shape:
                            BoxShape.circle,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================
  // QUICK ACTION CARD
  // ===========================================================

  Widget _buildQuickActionItem({
    required String title,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
        onTap: onTap,
        child: Container(
          // Same compact height for all four cards.
          height: 135,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(
            horizontal: 2,
            vertical: 10,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15),
            border: Border.all(
              color: const Color(0xFFE9EDF3),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.035),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: iconBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: iconColor,
                  size: 25,
                ),
              ),
              const SizedBox(height: 10),
              SizedBox(
                height: 36,
                child: Center(
                  child: Text(
                    title,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    softWrap: true,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF1E293B),
                      height: 1.2,
                      letterSpacing: -0.1,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
    );
  }

  // ===========================================================
  // TRANSACTION TILE
  // ===========================================================

  Widget _buildTransactionTile(
    Map<String, dynamic> item,
    bool isLast,
  ) {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,

          MaterialPageRoute(
            builder: (_) =>
                TransactionDetailScreen(
              transaction: item,
            ),
          ),
        );
      },

      child: Container(
        padding:
            const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),

        decoration: BoxDecoration(
          border: isLast
              ? null
              : const Border(
                  bottom: BorderSide(
                    color:
                        Color(0xFFF1F5F9),
                    width: 1.2,
                  ),
                ),
        ),

        child: Row(
          children: [

            Container(
              width: 44,
              height: 44,

              decoration: BoxDecoration(
                color:
                    item['iconBg'],

                shape:
                    BoxShape.circle,
              ),

              child: Icon(
                item['icon'],
                color:
                    item['iconColor'],
                size: 22,
              ),
            ),

            const SizedBox(width: 12),

            Expanded(
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,

                mainAxisSize:
                    MainAxisSize.min,

                children: [

                  Text(
                    item['title'],

                    maxLines: 2,

                    overflow:
                        TextOverflow.ellipsis,

                    style:
                        const TextStyle(
                      fontSize: 14.5,
                      fontWeight:
                          FontWeight.w800,
                      color:
                          Color(0xFF0F172A),
                    ),
                  ),

                  const SizedBox(height: 3),

                  Text(
                    item['subtitle'],

                    maxLines: 1,

                    overflow:
                        TextOverflow.ellipsis,

                    style:
                        const TextStyle(
                      fontSize: 12,
                      color:
                          Color(0xFF64748B),
                      fontWeight:
                          FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 8),

            Column(
              crossAxisAlignment:
                  CrossAxisAlignment.end,

              mainAxisSize:
                  MainAxisSize.min,

              children: [

                Text(
                  item['amount'],

                  style: TextStyle(
                    fontSize: 14.5,
                    fontWeight:
                        FontWeight.w800,

                    color: item['isCredit']
                        ? const Color(
                            0xFF16A34A,
                          )
                        : const Color(
                            0xFF0F172A,
                          ),
                  ),
                ),

                const SizedBox(height: 3),

                Text(
                  item['date'],

                  style:
                      const TextStyle(
                    fontSize: 11,
                    color:
                        Color(0xFF94A3B8),
                    fontWeight:
                        FontWeight.w500,
                  ),
                ),
              ],
            ),

            const SizedBox(width: 6),

            const Icon(
              Icons.chevron_right_rounded,
              color:
                  Color(0xFFCBD5E1),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }

  // ===========================================================
  // THANK YOU CARD
  // ===========================================================

  Widget _buildThankYouCard() {
    return Container(
      padding:
          const EdgeInsets.all(16),

      decoration: BoxDecoration(
        color:
            const Color(0xFFECFDF5),

        borderRadius:
            BorderRadius.circular(20),

        border: Border.all(
          color:
              const Color(0xFFA7F3D0),

          width: 1.2,
        ),
      ),

      child: Row(
        children: [

          Container(
            width: 42,
            height: 42,

            decoration:
                const BoxDecoration(
              color: Colors.white,
              shape:
                  BoxShape.circle,
            ),

            child: const Icon(
              Icons.eco_rounded,
              color:
                  Color(0xFF10B981),
              size: 24,
            ),
          ),

          const SizedBox(width: 14),

          Expanded(
            child: Column(
              crossAxisAlignment:
                  CrossAxisAlignment.start,

              mainAxisSize:
                  MainAxisSize.min,

              children: const [

                Text(
                  "Thank you for choosing EVegah!",

                  style: TextStyle(
                    fontSize: 14,
                    fontWeight:
                        FontWeight.w800,
                    color:
                        Color(0xFF0F172A),
                  ),
                ),

                SizedBox(height: 3),

                Text(
                  "Together we're building a cleaner and greener future.",

                  style: TextStyle(
                    fontSize: 11.5,
                    color:
                        Color(0xFF047857),
                    fontWeight:
                        FontWeight.w500,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ===========================================================
  // ADD MONEY DIALOG
  // ===========================================================

  void _showAddMoneyDialog() {
    final List<int> quickAmounts = [
      500,
      1000,
      2000,
      5000,
    ];

    final controller =
        TextEditingController(text: "500");

    showModalBottomSheet(
      context: context,

      isScrollControlled: true,

      shape:
          const RoundedRectangleBorder(
        borderRadius:
            BorderRadius.vertical(
          top: Radius.circular(24),
        ),
      ),

      builder: (context) {
        return StatefulBuilder(
          builder:
              (
                BuildContext context,
                StateSetter setModalState,
              ) {
            return Padding(
              padding: EdgeInsets.only(
                bottom:
                    MediaQuery.of(context)
                        .viewInsets
                        .bottom,

                left: 24,
                right: 24,
                top: 24,
              ),

              child: Column(
                mainAxisSize:
                    MainAxisSize.min,

                crossAxisAlignment:
                    CrossAxisAlignment.start,

                children: [

                  const Text(
                    "Add Money to Wallet",

                    style: TextStyle(
                      fontSize: 18,
                      fontWeight:
                          FontWeight.w800,
                      color:
                          Color(0xFF0F172A),
                    ),
                  ),

                  const SizedBox(height: 16),

                  TextField(
                    controller:
                        controller,

                    keyboardType:
                        TextInputType.number,

                    decoration:
                        InputDecoration(
                      prefixText: "₹ ",

                      labelText:
                          "Enter Amount",

                      border:
                          OutlineInputBorder(
                        borderRadius:
                            BorderRadius.circular(
                          14,
                        ),
                      ),
                    ),

                    onChanged: (val) {
                      setModalState(() {});
                    },
                  ),

                  const SizedBox(height: 14),

                  Wrap(
                    spacing: 10,

                    children:
                        quickAmounts.map(
                      (amt) {

                        return GestureDetector(
                          onTap: () {
                            setModalState(() {
                              controller.text =
                                  amt.toString();
                            });
                          },

                          child: Container(
                            padding:
                                const EdgeInsets
                                    .symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),

                            decoration:
                                BoxDecoration(
                              color:
                                  const Color(
                                0xFFF5F3FF,
                              ),

                              borderRadius:
                                  BorderRadius
                                      .circular(
                                10,
                              ),

                              border:
                                  Border.all(
                                color:
                                    const Color(
                                  0xFFDDD6FE,
                                ),
                              ),
                            ),

                            child: Text(
                              "₹$amt",

                              style:
                                  const TextStyle(
                                color:
                                    Color(
                                  0xFF5B45E0,
                                ),

                                fontWeight:
                                    FontWeight.w800,

                                fontSize: 13,
                              ),
                            ),
                          ),
                        );
                      },
                    ).toList(),
                  ),

                  const SizedBox(height: 20),

                  SizedBox(
                    width:
                        double.infinity,

                    child:
                        ElevatedButton(
                      onPressed:
                          _isProcessingPayment
                              ? null
                              : () async {
                                  final amt =
                                      double.tryParse(
                                            controller
                                                .text,
                                          ) ??
                                          500;

                                  if (amt > 0) {
                                    Navigator.pop(
                                      context,
                                    );

                                    await _startPayment(
                                      amt,
                                    );
                                  }
                                },

                      style:
                          ElevatedButton.styleFrom(
                        backgroundColor:
                            const Color(
                          0xFF5B45E0,
                        ),

                        padding:
                            const EdgeInsets
                                .symmetric(
                          vertical: 14,
                        ),

                        shape:
                            RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(
                            14,
                          ),
                        ),
                      ),

                      child:
                          _isProcessingPayment
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child:
                                      CircularProgressIndicator(
                                    color:
                                        Colors.white,
                                    strokeWidth:
                                        2,
                                  ),
                                )
                              : const Text(
                                  "Proceed to Pay",

                                  style:
                                      TextStyle(
                                    fontWeight:
                                        FontWeight
                                            .w800,
                                    color:
                                        Colors.white,
                                    fontSize:
                                        15,
                                  ),
                                ),
                    ),
                  ),

                  const SizedBox(height: 28),
                ],
              ),
            );
          },
        );
      },
    );
  }
}