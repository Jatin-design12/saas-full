import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart' as url_launcher;
import 'package:webview_flutter/webview_flutter.dart';
import '../services/payu_service.dart';

class PayUInAppCheckoutModal extends StatefulWidget {
  final String checkoutUrl;
  final String txnid;
  final double amount;

  const PayUInAppCheckoutModal({
    super.key,
    required this.checkoutUrl,
    required this.txnid,
    required this.amount,
  });

  static Future<PayUPaymentResult?> show({
    required BuildContext context,
    required String checkoutUrl,
    required String txnid,
    required double amount,
  }) {
    return showModalBottomSheet<PayUPaymentResult>(
      context: context,
      isScrollControlled: true,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (ctx) => PayUInAppCheckoutModal(
        checkoutUrl: checkoutUrl,
        txnid: txnid,
        amount: amount,
      ),
    );
  }

  @override
  State<PayUInAppCheckoutModal> createState() => _PayUInAppCheckoutModalState();
}

class _PayUInAppCheckoutModalState extends State<PayUInAppCheckoutModal> {
  late final WebViewController _controller;
  bool _isLoading = true;
  int _progress = 0;
  bool _isFinished = false;

  @override
  void initState() {
    super.initState();
    _initWebview();
  }

  void _initWebview() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            if (mounted) {
              setState(() {
                _progress = progress;
                if (progress >= 100) {
                  _isLoading = false;
                }
              });
            }
          },
          onPageStarted: (String url) {
            if (mounted) setState(() => _isLoading = true);
            _checkUrlForOutcome(url);
          },
          onPageFinished: (String url) {
            if (mounted) setState(() => _isLoading = false);
            _checkUrlForOutcome(url);
          },
          onWebResourceError: (WebResourceError error) {
            debugPrint('PayU In-App WebView error: ${error.description}');
          },
          onNavigationRequest: (NavigationRequest request) async {
            final url = request.url;

            // Handle UPI intents or other mobile apps (phonepe, paytm, upi, etc.)
            if (url.startsWith('upi://') ||
                url.startsWith('tez://') ||
                url.startsWith('phonepe://') ||
                url.startsWith('paytmmp://') ||
                url.startsWith('bhim://') ||
                url.startsWith('intent://')) {
              try {
                final uri = Uri.parse(url);
                if (await url_launcher.canLaunchUrl(uri)) {
                  await url_launcher.launchUrl(uri, mode: url_launcher.LaunchMode.externalApplication);
                }
              } catch (e) {
                debugPrint('Failed to launch external UPI app: $e');
              }
              return NavigationDecision.prevent;
            }

            // Allow PayU callback to navigate to backend so POST /response executes
            if (_checkUrlForOutcome(url, isNavigationRequest: true)) {
              return NavigationDecision.prevent;
            }

            return NavigationDecision.navigate;
          },
        ),
      )
      ..loadRequest(Uri.parse(widget.checkoutUrl));
  }

  bool _checkUrlForOutcome(String url, {bool isNavigationRequest = false}) {
    if (_isFinished) return true;

    final lower = url.toLowerCase();
    // PayU response webhook or return URL
    if (lower.contains('/payments/payu/response')) {
      if (isNavigationRequest) {
        // Allow navigation so backend receives POST/GET from PayU
        return false;
      }
      _isFinished = true;
      _verifyAndComplete(true, 'Payment completed successfully');
      return true;
    } else if (lower.contains('/payment/success') ||
               lower.contains('status=success') ||
               lower.contains('status=completed')) {
      _isFinished = true;
      _verifyAndComplete(true, 'Payment completed successfully');
      return true;
    } else if (lower.contains('/payment/failure') ||
               lower.contains('/payment/cancel') ||
               lower.contains('status=failed') ||
               lower.contains('status=cancelled')) {
      _isFinished = true;
      _verifyAndComplete(false, 'Payment failed or cancelled');
      return true;
    }
    return false;
  }

  Future<void> _verifyAndComplete(bool presumedSuccess, String message) async {
    // Check status immediately
    try {
      String backendStatus = await PayUService().checkPaymentStatus(widget.txnid);
      if (backendStatus.toLowerCase() != 'success' && presumedSuccess) {
        // Give backend 800ms to finish processing webhook
        await Future.delayed(const Duration(milliseconds: 800));
        backendStatus = await PayUService().checkPaymentStatus(widget.txnid);
      }
      final isRealSuccess = backendStatus.toLowerCase() == 'success' || presumedSuccess;
      if (mounted) {
        Navigator.of(context).pop(PayUPaymentResult(
          success: isRealSuccess,
          txId: widget.txnid,
          message: isRealSuccess ? 'Payment verified successfully' : message,
        ));
      }
    } catch (_) {
      if (mounted) {
        Navigator.of(context).pop(PayUPaymentResult(
          success: presumedSuccess,
          txId: widget.txnid,
          message: message,
        ));
      }
    }
  }

  void _onCancelPressed() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text("Cancel Payment?", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: const Text("Are you sure you want to cancel this PayU payment?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Continue Paying", style: TextStyle(color: Color(0xFF4313B8), fontWeight: FontWeight.bold)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              Navigator.of(context).pop(PayUPaymentResult(
                success: false,
                txId: widget.txnid,
                message: 'Payment cancelled by user',
              ));
            },
            child: const Text("Yes, Cancel", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final height = MediaQuery.of(context).size.height * 0.92;

    return Container(
      height: height,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Header Bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF5F3FF),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.shield_outlined, color: Color(0xFF4313B8), size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "PayU Secure Checkout",
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                      ),
                      Text(
                        "₹${widget.amount.toStringAsFixed(0)} • 256-bit SSL Encrypted",
                        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Color(0xFF64748B)),
                  onPressed: _onCancelPressed,
                ),
              ],
            ),
          ),

          // Linear Progress Bar
          if (_isLoading)
            LinearProgressIndicator(
              value: _progress > 0 ? _progress / 100 : null,
              backgroundColor: const Color(0xFFF1F5F9),
              color: const Color(0xFF4313B8),
              minHeight: 3,
            ),

          // In-App WebView
          Expanded(
            child: ClipRRect(
              child: WebViewWidget(controller: _controller),
            ),
          ),
        ],
      ),
    );
  }
}
