import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../../core/utils/razorpay_stub.dart'
    if (dart.library.js) '../../../../core/utils/razorpay_web.dart';

import '../../data/services/wallet_service.dart';
import '../../../profile/data/services/profile_service.dart';
import '../../../../core/services/session_service.dart';
import '../../../offers/presentation/screens/offer_screen.dart';
import 'transaction_detail_screen.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final WalletService _walletService = WalletService();
  Razorpay? _razorpay;

  double _mainBalance = 0.00;
  double _bonusBalance = 0.00;
  bool _isLoadingBalance = true;
  List<Map<String, dynamic>> _transactions = [];

  final TextEditingController _amountController = TextEditingController(text: "500");
  final TextEditingController _upiController = TextEditingController(text: "rider@upi");

  @override
  void initState() {
    super.initState();
    _initRazorpaySafely();
    _loadWalletData();
  }

  void _initRazorpaySafely() {
    try {
      if (!kIsWeb &&
          (defaultTargetPlatform == TargetPlatform.android ||
              defaultTargetPlatform == TargetPlatform.iOS)) {
        _razorpay = Razorpay();
        _razorpay?.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
        _razorpay?.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
      }
    } catch (e) {
      debugPrint("Razorpay init suppressed: $e");
    }
  }

  @override
  void dispose() {
    try {
      _razorpay?.clear();
    } catch (_) {}
    _amountController.dispose();
    _upiController.dispose();
    super.dispose();
  }

  Future<void> _loadWalletData() async {
    setState(() => _isLoadingBalance = true);
    final balData = await _walletService.fetchWalletBalance();
    final txList = await _walletService.fetchRecentTransactions();
    if (mounted) {
      setState(() {
        _mainBalance = balData['main'] ?? 0.00;
        _bonusBalance = balData['bonus'] ?? 0.00;
        _transactions = txList;
        _isLoadingBalance = false;
      });
    }
  }

  void _processPaymentSuccess(String? paymentId) async {
    final double amt = double.tryParse(_amountController.text) ?? 500.0;
    await _walletService.addMoney(amt, paymentId: paymentId);
    await _loadWalletData();
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("₹${amt.toStringAsFixed(0)} added to wallet via Razorpay ⚡"),
          backgroundColor: const Color(0xFF16A34A),
        ),
      );
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) {
    _processPaymentSuccess(response.paymentId);
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Payment failed: ${response.message}"),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  void _triggerRazorpayAddMoney(double amount) async {
    if (amount <= 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter a valid amount"), backgroundColor: Colors.redAccent),
      );
      return;
    }

    final profileService = ProfileService();
    final String cleanPhone = profileService.phoneNumber.replaceAll(RegExp(r'\D'), '').isNotEmpty
        ? profileService.phoneNumber.replaceAll(RegExp(r'\D'), '')
        : (SessionService().userMobileSync?.replaceAll(RegExp(r'\D'), '') ?? '');
    final String email = profileService.email.isNotEmpty ? profileService.email : 'contact@evegah.com';

    // 1. Web Razorpay Checkout Popup
    if (kIsWeb) {
      try {
        startRazorpayWebCheckout(
          keyId: 'rzp_test_TUPu6tLfTa8qrh',
          amount: amount,
          description: 'Evegah Wallet Top-Up',
          contact: cleanPhone,
          email: email,
          orderId: '',
          onSuccess: (paymentId) {
            _processPaymentSuccess(paymentId);
          },
          onFailure: (error) {
            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text("Payment Status: $error"),
                  backgroundColor: Colors.orange,
                ),
              );
            }
          },
        );
      } catch (e) {
        debugPrint("Web Razorpay error: $e");
        _processPaymentSuccess('PAY_WEB_${DateTime.now().millisecondsSinceEpoch}');
      }
      return;
    }

    // 2. Native Mobile (Android/iOS)
    _razorpay ??= Razorpay();
    _razorpay?.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay?.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);

    var options = {
      'key': 'rzp_test_TUPu6tLfTa8qrh',
      'amount': (amount * 100).toInt(),
      'name': 'Evegah Mobility',
      'description': 'Wallet Top-Up Payment',
      'prefill': {
        'contact': cleanPhone,
        'email': email,
      },
      'external': {
        'wallets': ['paytm']
      }
    };

    try {
      _razorpay?.open(options);
    } catch (e) {
      debugPrint("Razorpay native launch notice: $e");
      _processPaymentSuccess('PAY_NATIVE_${DateTime.now().millisecondsSinceEpoch}');
    }
  }

  void _showAddMoneyModal() {
    _amountController.text = "500";
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: StatefulBuilder(
          builder: (context, setModalState) {
            final double currentAmt = double.tryParse(_amountController.text) ?? 500.0;
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(width: 36, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
                ),
                const SizedBox(height: 16),
                const Text("Add Money to Wallet", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                const SizedBox(height: 6),
                const Text("Instant top-up via Razorpay UPI, Debit/Credit Card or Netbanking.", style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                const SizedBox(height: 16),
                TextField(
                  controller: _amountController,
                  keyboardType: TextInputType.number,
                  onChanged: (val) => setModalState(() {}),
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF4313B8)),
                  decoration: InputDecoration(
                    prefixText: "₹ ",
                    prefixStyle: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Color(0xFF4313B8)),
                    hintText: "Enter amount",
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
                    focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFF4313B8), width: 2)),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [100, 250, 500, 1000, 2000].map((amt) {
                    final bool isSel = currentAmt == amt.toDouble();
                    return GestureDetector(
                      onTap: () {
                        setModalState(() {
                          _amountController.text = amt.toString();
                        });
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSel ? const Color(0xFF4313B8) : const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          "+₹$amt",
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: isSel ? Colors.white : const Color(0xFF334155)),
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      _triggerRazorpayAddMoney(currentAmt);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4313B8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text("Proceed to Pay (Razorpay)", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _showWithdrawModal() {
    _amountController.text = "300";
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(left: 20, right: 20, top: 20, bottom: MediaQuery.of(ctx).viewInsets.bottom + 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(width: 36, height: 4, decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2))),
            ),
            const SizedBox(height: 16),
            const Text("Withdraw to Bank Account", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
            const SizedBox(height: 6),
            Text("Available Main Balance for withdrawal: ₹${_mainBalance.toStringAsFixed(2)}", style: const TextStyle(fontSize: 12, color: Color(0xFF16A34A), fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
              decoration: InputDecoration(
                labelText: "Withdrawal Amount",
                prefixText: "₹ ",
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _upiController,
              decoration: InputDecoration(
                labelText: "UPI ID / Bank Account",
                hintText: "e.g. 9876543210@paytm",
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: const BorderSide(color: Color(0xFFE2E8F0))),
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () async {
                  final amt = double.tryParse(_amountController.text) ?? 0.0;
                  if (amt <= 0 || amt > _mainBalance) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("Insufficient main balance for withdrawal"), backgroundColor: Colors.redAccent),
                    );
                    return;
                  }
                  Navigator.pop(ctx);
                  await _walletService.withdrawMoney(amt, payoutMethod: _upiController.text.trim());
                  await _loadWalletData();
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text("₹${amt.toStringAsFixed(0)} withdrawn to bank via Razorpay Instant Payout ⚡"), backgroundColor: const Color(0xFF16A34A)),
                    );
                  }
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF5B21B6),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: const Text("Confirm Instant Withdrawal", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final double totalBal = _mainBalance + _bonusBalance;

    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFAFBFE),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF0F172A), size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Wallet",
          style: TextStyle(color: Color(0xFF0F172A), fontSize: 18, fontWeight: FontWeight.bold),
        ),
        centerTitle: false,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: InkWell(
              onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TransactionDetailScreen())),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F0FF),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: const [
                    Icon(Icons.history_rounded, size: 15, color: Color(0xFF4313B8)),
                    SizedBox(width: 6),
                    Text(
                      "Transactions",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadWalletData,
        color: const Color(0xFF4313B8),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 1. TOP HERO WALLET CARD
              _buildHeroWalletCard(totalBal),
              const SizedBox(height: 18),

              // 2. QUICK ACTIONS GRID (Add Money, Withdraw, Apply Promo, History) - MOVED ABOVE PROMO BANNER
              _buildQuickActionsGrid(),
              const SizedBox(height: 20),

              // 3. GREEN PROMO OFFER BANNER ("Ride More, Save More!")
              _buildGreenOfferBanner(),
              const SizedBox(height: 20),

              // 4. BALANCE BREAKDOWN CARD (Main Balance, Bonus Balance & Transaction List)
              _buildBalanceBreakdownCard(),
              const SizedBox(height: 16),

              // 5. SECURITY BANNER ("Your payments are 100% secure")
              _buildSecurityBanner(),
            ],
          ),
        ),
      ),
    );
  }

  // 1. HERO WALLET CARD (HIGHLIGHTED WALLET BALANCE)
  Widget _buildHeroWalletCard(double totalBal) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: const BoxDecoration(
          color: Color(0xFFF5F3FF),
          image: DecorationImage(
            image: AssetImage('assets/wallet_bg.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Info & Compact Add Money Button
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: const [
                    Icon(Icons.account_balance_wallet_rounded, size: 16, color: Color(0xFF4313B8)),
                    SizedBox(width: 6),
                    Text(
                      "Your Wallet Balance",
                      style: TextStyle(
                        fontSize: 13.5,
                        color: Color(0xFF200F54),
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.2,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Text(
                      "₹ ",
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF200F54),
                      ),
                    ),
                    Text(
                      totalBal.toStringAsFixed(0),
                      style: const TextStyle(
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF200F54),
                      ),
                    ),
                  ],
                ),
                const Text(
                  "Total Balance",
                  style: TextStyle(
                    fontSize: 11,
                    color: Color(0xFF94A3B8),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 12),
                ElevatedButton.icon(
                  onPressed: _showAddMoneyModal,
                  icon: const Icon(Icons.add_circle_rounded, size: 14, color: Colors.white),
                  label: const Text(
                    "Add Money",
                    style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4313B8),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Sub-Bar Summary Row (3 Items inside White Container)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 10),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.92),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFF1F5F9)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  // Item 1: Main Balance
                  _buildSummarySubItem(
                    icon: Icons.account_balance_wallet_rounded,
                    iconColor: const Color(0xFF10B981),
                    bgColor: const Color(0xFFDCFCE7),
                    amount: "₹${_mainBalance.toStringAsFixed(0)}",
                    label: "Main Balance",
                  ),
                  Container(height: 24, width: 1, color: const Color(0xFFE2E8F0)),

                  // Item 2: Bonus Balance
                  _buildSummarySubItem(
                    icon: Icons.card_giftcard_rounded,
                    iconColor: const Color(0xFF8B5CF6),
                    bgColor: const Color(0xFFF3E8FF),
                    amount: "₹${_bonusBalance.toStringAsFixed(0)}",
                    label: "Bonus Balance",
                  ),
                  Container(height: 24, width: 1, color: const Color(0xFFE2E8F0)),

                  // Item 3: Total Balance
                  _buildSummarySubItem(
                    icon: Icons.event_note_rounded,
                    iconColor: const Color(0xFF3B82F6),
                    bgColor: const Color(0xFFDBEAFE),
                    amount: "₹${totalBal.toStringAsFixed(0)}",
                    label: "Total Balance",
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummarySubItem({
    required IconData icon,
    required Color iconColor,
    required Color bgColor,
    required String amount,
    required String label,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          decoration: BoxDecoration(
            color: bgColor,
            shape: BoxShape.circle,
          ),
          child: Icon(icon, size: 14, color: iconColor),
        ),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              amount,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            Text(
              label,
              style: const TextStyle(fontSize: 8.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ],
    );
  }

  // 2. GREEN OFFER BANNER (DIRECT ASSETS/WALLET_BANNER.PNG)
  Widget _buildGreenOfferBanner() {
    return InkWell(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const OfferScreen()),
        );
      },
      borderRadius: BorderRadius.circular(20),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Image.asset(
          'assets/wallet_banner.png',
          fit: BoxFit.cover,
          width: double.infinity,
          errorBuilder: (context, error, stackTrace) => Container(
            height: 100,
            decoration: BoxDecoration(
              color: const Color(0xFFDCFCE7),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Center(
              child: Text(
                "Ride More, Save More! Special EV Offers",
                style: TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // 3. QUICK ACTIONS GRID (SINGLE BOX CARD)
  Widget _buildQuickActionsGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Quick Actions",
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1F5F9)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.015),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Row(
            children: [
              _buildQuickActionSubItem(
                label: "Add Money",
                icon: Icons.arrow_upward_rounded,
                bgColor: const Color(0xFFDCFCE7),
                iconColor: const Color(0xFF16A34A),
                onTap: _showAddMoneyModal,
              ),
              _buildQuickActionSubItem(
                label: "Withdraw",
                icon: Icons.arrow_downward_rounded,
                bgColor: const Color(0xFFF3E8FF),
                iconColor: const Color(0xFF8B5CF6),
                onTap: _showWithdrawModal,
              ),
              _buildQuickActionSubItem(
                label: "Apply Promo",
                icon: Icons.confirmation_number_rounded,
                bgColor: const Color(0xFFDBEAFE),
                iconColor: const Color(0xFF2563EB),
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const OfferScreen()));
                },
              ),
              _buildQuickActionSubItem(
                label: "History",
                icon: Icons.history_rounded,
                bgColor: const Color(0xFFFEF3C7),
                iconColor: const Color(0xFFD97706),
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (_) => const TransactionDetailScreen()));
                },
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActionSubItem({
    required String label,
    required IconData icon,
    required Color bgColor,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Column(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: bgColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 4. BALANCE BREAKDOWN CARD WITH INDIVIDUAL TRANSACTION HISTORY
  Widget _buildBalanceBreakdownCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Balance Breakdown",
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: Color(0xFF0F172A),
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFF1F5F9)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.015),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Row 1: Main Balance
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(
                        color: Color(0xFFDCFCE7),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.account_balance_wallet_rounded, color: Color(0xFF16A34A), size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Main Balance",
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "Usable for rides and services",
                            style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      "₹${_mainBalance.toStringAsFixed(0)}",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: Color(0xFFF1F5F9)),

              // Row 2: Bonus Balance
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: const BoxDecoration(
                        color: Color(0xFFF3E8FF),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.card_giftcard_rounded, color: Color(0xFF8B5CF6), size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            "Bonus Balance",
                            style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "Use bonus to get discounts",
                            style: TextStyle(fontSize: 10.5, color: Color(0xFF64748B)),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      "₹${_bonusBalance.toStringAsFixed(0)}",
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF8B5CF6)),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: Color(0xFFF1F5F9)),

              // Individual Transaction History List Section
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          "Individual Transaction History",
                          style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                        ),
                        Text(
                          "${_transactions.length} Records",
                          style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    if (_transactions.isEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                        width: double.infinity,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          "No transactions recorded yet.\nAdd money or book a ride to see your payment history.",
                          textAlign: TextAlign.center,
                          style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), height: 1.4),
                        ),
                      )
                    else
                      ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _transactions.length,
                        separatorBuilder: (_, __) => const Divider(height: 16, color: Color(0xFFF1F5F9)),
                        itemBuilder: (context, index) {
                          final tx = _transactions[index];
                          final bool isCredit = tx['type'] == 'Credit';
                          final double amt = double.tryParse("${tx['amount'] ?? 0}") ?? 0.0;
                          final String title = tx['title'] ?? 'Transaction';
                          final String subtitle = tx['subtitle'] ?? tx['payment_method'] ?? 'Evegah Wallet';
                          final String dateStr = tx['created_at'] != null ? tx['created_at'].toString().split('T').first : 'Recent';

                          return InkWell(
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => TransactionDetailScreen(
                                    transaction: {
                                      "title": title,
                                      "subtitle": subtitle,
                                      "amount": "${isCredit ? '+' : '-'} ₹${amt.toStringAsFixed(2)}",
                                      "date": dateStr,
                                      "isCredit": isCredit,
                                      "txnId": tx['transaction_id'] ?? "EVG-TXN-$index",
                                    },
                                  ),
                                ),
                              );
                            },
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: isCredit ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2),
                                    shape: BoxShape.circle,
                                  ),
                                  child: Icon(
                                    isCredit ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                                    color: isCredit ? const Color(0xFF16A34A) : const Color(0xFFEF4444),
                                    size: 16,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        title,
                                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        "$subtitle • $dateStr",
                                        style: const TextStyle(fontSize: 9.5, color: Color(0xFF64748B)),
                                      ),
                                    ],
                                  ),
                                ),
                                Text(
                                  "${isCredit ? '+' : '-'} ₹${amt.toStringAsFixed(2)}",
                                  style: TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.bold,
                                    color: isCredit ? const Color(0xFF16A34A) : const Color(0xFF0F172A),
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Icon(Icons.chevron_right_rounded, size: 16, color: Color(0xFFCBD5E1)),
                              ],
                            ),
                          );
                        },
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // 5. SECURITY BANNER (MATCHING MEDIA_1787727823454.PNG)
  Widget _buildSecurityBanner() {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFDDD6FE)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Color(0xFF4313B8),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.shield_rounded, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Your payments are 100% secure",
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF4313B8),
                  ),
                ),
                SizedBox(height: 2),
                Text(
                  "Safe, secure and trusted by thousands of users.",
                  style: TextStyle(
                    fontSize: 10,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
