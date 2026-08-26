import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../support/presentation/screens/help_screen.dart';

class TransactionDetailScreen extends StatelessWidget {
  final Map<String, dynamic>? transaction;

  const TransactionDetailScreen({super.key, this.transaction});

  static const Map<String, dynamic> _defaultTx = {
    "title": "Ride Reservation (Paid)",
    "subtitle": "Evegah EV • Gotri Zone",
    "amount": "- ₹307.50",
    "date": "2026-08-26, 10:30 AM",
    "isCredit": false,
  };

  String _formatCleanDateTime(String rawDate) {
    if (rawDate.isEmpty) return "2026-08-26, 10:30 AM";
    
    // Replace hardcoded 00:00:00 with default active time 10:30 AM
    String cleaned = rawDate.replaceAll(", 00:00:00", ", 10:30 AM")
                             .replaceAll(" 00:00:00", ", 10:30 AM")
                             .replaceAll("00:00", "10:30 AM");
    if (!cleaned.contains("AM") && !cleaned.contains("PM")) {
      cleaned = "$cleaned, 10:30 AM";
    }
    return cleaned;
  }

  @override
  Widget build(BuildContext context) {
    final tx = transaction ?? _defaultTx;
    final bool isCredit = tx['isCredit'] ?? false;
    final String title = tx['title'] ?? 'Ride Reservation (Paid)';
    final String subtitle = tx['subtitle'] ?? 'Evegah EV • Manjalpur Zone';
    final String amount = tx['amount'] ?? '- ₹307.50';
    final String rawDate = tx['date'] ?? '2026-08-26, 10:30 AM';
    final String formattedDate = _formatCleanDateTime(rawDate);

    final String txnId = tx['txnId'] ?? 'EVG-TXN-89843909';
    final String refOrder = tx['refOrder'] ?? 'ORD-2026-9874';

    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: IconButton(
              icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A), size: 18),
              onPressed: () => Navigator.pop(context),
            ),
          ),
        ),
        title: const Text(
          "Transaction Details",
          style: TextStyle(
            fontWeight: FontWeight.w800,
            fontSize: 20,
            color: Color(0xFF0F172A),
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.more_vert_rounded, color: Color(0xFF0F172A)),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // --- 1. TOP PURPLE GRADIENT BANNER CARD ---
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFF3E8FF), Color(0xFFEEF2FF)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFE9D5FF), width: 1.2),
                ),
                child: Row(
                  children: [
                    Stack(
                      children: [
                        Container(
                          width: 58,
                          height: 58,
                          decoration: const BoxDecoration(
                            color: Color(0xFFDDD6FE),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.electric_scooter_rounded,
                            color: Color(0xFF4313B8),
                            size: 28,
                          ),
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            padding: const EdgeInsets.all(2),
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.check_circle_rounded,
                              color: Color(0xFF16A34A),
                              size: 18,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Text(
                                "Evegah EV",
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF4313B8),
                                ),
                              ),
                              const SizedBox(width: 4),
                              const Icon(Icons.verified_rounded, size: 13, color: Color(0xFF4313B8)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  "• ${subtitle.split('•').last.trim()}",
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        const Text(
                          "Amount Paid",
                          style: TextStyle(fontSize: 10, color: Color(0xFF64748B), fontWeight: FontWeight.w600),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          amount,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: isCredit ? const Color(0xFF16A34A) : const Color(0xFF0F172A),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFF86EFAC)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Icon(Icons.check_rounded, size: 12, color: Color(0xFF15803D)),
                              SizedBox(width: 3),
                              Text(
                                "COMPLETED",
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF15803D),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // --- 2. DARK BLUE 3-COLUMN INFO STRIP ---
              Container(
                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 14),
                decoration: BoxDecoration(
                  color: const Color(0xFF161248),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          const Icon(Icons.calendar_today_rounded, size: 16, color: Color(0xFFA78BFA)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  formattedDate.split(',').first,
                                  maxLines: 1,
                                  style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  formattedDate.contains(',') ? formattedDate.split(',').last.trim() : "10:30 AM",
                                  style: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 10),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(height: 24, width: 1, color: Colors.white24),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text("Transaction ID", style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 10)),
                            const SizedBox(height: 2),
                            Text(
                              txnId,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ),
                    Container(height: 24, width: 1, color: Colors.white24),
                    Expanded(
                      child: Row(
                        children: [
                          const SizedBox(width: 8),
                          const Icon(Icons.receipt_long_rounded, size: 16, color: Color(0xFFA78BFA)),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: const [
                                Text("Payment via", style: TextStyle(color: Color(0xFF9CA3AF), fontSize: 10)),
                                SizedBox(height: 2),
                                Text("Evegah Wallet", style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.bold)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 22),

              // --- 3. PAYMENT BREAKDOWN SECTION ---
              const Text(
                "Payment Breakdown",
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 12),

              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFF1F5F9), width: 1.5),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Column(
                  children: [
                    _buildIconDetailRow(
                      icon: Icons.calendar_today_rounded,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF4313B8),
                      label: "Date & Time",
                      value: formattedDate,
                    ),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    _buildIconDetailRow(
                      icon: Icons.receipt_rounded,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF4313B8),
                      label: "Transaction ID",
                      value: txnId,
                      isCopyable: true,
                      onCopy: () {
                        Clipboard.setData(ClipboardData(text: txnId));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Transaction ID copied to clipboard!"), duration: Duration(seconds: 1)),
                        );
                      },
                    ),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    _buildIconDetailRow(
                      icon: Icons.account_balance_wallet_rounded,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF4313B8),
                      label: "Payment Method",
                      value: isCredit ? "Credit/Debit Card (Razorpay)" : "Evegah Wallet Balance",
                    ),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    _buildIconDetailRow(
                      icon: Icons.article_rounded,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF4313B8),
                      label: "Reference Order",
                      value: refOrder,
                    ),
                    const Divider(height: 1, color: Color(0xFFF1F5F9)),
                    _buildIconDetailRow(
                      icon: Icons.local_offer_rounded,
                      iconBg: const Color(0xFFF1F5F9),
                      iconColor: const Color(0xFF4313B8),
                      label: "Taxes & Charges",
                      value: "₹0.00 (Included)",
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // --- 4. CONFIRMATION PAYMENT BANNER IMAGE ---
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.asset(
                  'assets/Confirmation Payment.png',
                  width: double.infinity,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                      ),
                      child: Row(
                        children: const [
                          Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 36),
                          SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "Thank you for riding with Evegah!",
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF065F46)),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  "Your payment has been processed successfully.",
                                  style: TextStyle(fontSize: 11, color: Color(0xFF047857)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),

              const SizedBox(height: 20),

              // --- 5. ACTION BUTTONS (DOWNLOAD RECEIPT & HELP) ---
              SizedBox(
                width: double.infinity,
                height: 50,
                child: ElevatedButton.icon(
                  onPressed: () => _downloadReceiptInvoice(context, title, amount, formattedDate, txnId, refOrder),
                  icon: const Icon(Icons.download_rounded, color: Colors.white, size: 20),
                  label: const Text(
                    "Download Receipt",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF4313B8),
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),

              const SizedBox(height: 10),

              SizedBox(
                width: double.infinity,
                height: 50,
                child: OutlinedButton.icon(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const HelpScreen()),
                    );
                  },
                  icon: const Icon(Icons.headset_mic_rounded, color: Color(0xFF4313B8), size: 18),
                  label: const Text(
                    "Need Help with this Transaction?",
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0F172A)),
                  ),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFE2E8F0), width: 1.2),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                ),
              ),

              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildIconDetailRow({
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String label,
    required String value,
    bool isCopyable = false,
    VoidCallback? onCopy,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 16),
          ),
          const SizedBox(width: 12),
          Text(
            label,
            style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
          ),
          const Spacer(),
          Row(
            children: [
              Text(
                value,
                style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A), fontWeight: FontWeight.bold),
              ),
              if (isCopyable) ...[
                const SizedBox(width: 6),
                InkWell(
                  onTap: onCopy,
                  child: const Icon(Icons.copy_rounded, size: 14, color: Color(0xFF4313B8)),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  void _downloadReceiptInvoice(
    BuildContext context,
    String title,
    String amount,
    String date,
    String txnId,
    String refOrder,
  ) {
    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.task_alt_rounded, color: Color(0xFF16A34A), size: 52),
                const SizedBox(height: 12),
                const Text(
                  "Receipt Downloaded!",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                ),
                const SizedBox(height: 6),
                Text(
                  "Official invoice for $txnId has been generated & saved.",
                  textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                ),
                const SizedBox(height: 20),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Invoice No:", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          Text(refOrder, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Total Paid:", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          Text(amount, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF16A34A))),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Date & Time:", style: TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                          Text(date, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  height: 46,
                  child: ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF4313B8),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text("Close", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
