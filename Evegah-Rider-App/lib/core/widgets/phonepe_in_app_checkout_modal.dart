import 'dart:async';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart' as url_launcher;
import 'package:webview_flutter/webview_flutter.dart';
import '../services/phonepe_service.dart';

class PhonePeInAppCheckoutModal extends StatefulWidget {
  final String checkoutUrl;
  final String txId;
  final double amount;

  const PhonePeInAppCheckoutModal({
    super.key,
    required this.checkoutUrl,
    required this.txId,
    required this.amount,
  });

  static Future<PhonePePaymentResult?> show({
    required BuildContext context,
    required String checkoutUrl,
    required String txId,
    required double amount,
  }) {
    return showModalBottomSheet<PhonePePaymentResult>(
      context: context,
      isScrollControlled: true,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (ctx) => PhonePeInAppCheckoutModal(
        checkoutUrl: checkoutUrl,
        txId: txId,
        amount: amount,
      ),
    );
  }

  @override
  State<PhonePeInAppCheckoutModal> createState() => _PhonePeInAppCheckoutModalState();
}

class _PhonePeInAppCheckoutModalState extends State<PhonePeInAppCheckoutModal> {
  late final WebViewController _controller;
  bool _isLoading = true;
  int _progress = 0;
  bool _isFinished = false;
  Timer? _statusPollTimer;

  @override
  void initState() {
    super.initState();
    _initWebview();
    _startStatusPolling();
  }

  @override
  void dispose() {
    _statusPollTimer?.cancel();
    super.dispose();
  }

  void _startStatusPolling() {
    _statusPollTimer = Timer.periodic(const Duration(seconds: 3), (timer) async {
      if (_isFinished || !mounted) return;
      final status = await PhonePeService().checkPaymentStatus(widget.txId);
      if (status == 'SUCCESS') {
        timer.cancel();
        _onPaymentSuccess(widget.txId);
      } else if (status == 'FAILED') {
        timer.cancel();
        _onPaymentFailed("Payment was declined or failed on PhonePe.");
      }
    });
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
            debugPrint('PhonePe In-App WebView error: ${error.description}');
          },
          onNavigationRequest: (NavigationRequest request) async {
            final url = request.url;

            // Handle UPI intents or other mobile apps
            if (url.startsWith('upi://') ||
                url.startsWith('phonepe://') ||
                url.startsWith('tez://') ||
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

            if (_checkUrlForOutcome(url)) {
              return NavigationDecision.prevent;
            }

            return NavigationDecision.navigate;
          },
        ),
      );

    _controller.loadRequest(Uri.parse(widget.checkoutUrl));
  }

  bool _checkUrlForOutcome(String url) {
    if (_isFinished) return true;

    final lower = url.toLowerCase();
    if (lower.contains('status=success') || lower.contains('/payment/success') || lower.contains('code=payment_success')) {
      _onPaymentSuccess(widget.txId);
      return true;
    } else if (lower.contains('status=failed') || lower.contains('/payment/failed') || lower.contains('code=payment_error')) {
      _onPaymentFailed("Payment was cancelled or failed.");
      return true;
    }
    return false;
  }

  void _onPaymentSuccess(String txId) {
    if (_isFinished) return;
    _isFinished = true;
    _statusPollTimer?.cancel();
    if (mounted) {
      Navigator.of(context).pop(PhonePePaymentResult(
        success: true,
        txId: txId,
        message: 'Payment completed successfully via PhonePe',
      ));
    }
  }

  void _onPaymentFailed(String message) {
    if (_isFinished) return;
    _isFinished = true;
    _statusPollTimer?.cancel();
    if (mounted) {
      Navigator.of(context).pop(PhonePePaymentResult(
        success: false,
        txId: widget.txId,
        message: message,
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Container(
      height: size.height * 0.90,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        child: Column(
          children: [
            // Header bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: const BoxDecoration(
                color: Color(0xFF5F259F),
                border: Border(bottom: BorderSide(color: Color(0xFF4C1D95), width: 1)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    alignment: Alignment.center,
                    child: const Text('पे', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          "PhonePe Secure Checkout",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          "Paying ₹${widget.amount.toStringAsFixed(2)}",
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.85),
                            fontSize: 11.5,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: Colors.white, size: 22),
                    onPressed: () => _showCancelConfirmation(),
                  ),
                ],
              ),
            ),

            // Linear Progress Indicator
            if (_isLoading)
              LinearProgressIndicator(
                value: _progress > 0 ? _progress / 100 : null,
                color: const Color(0xFF5F259F),
                backgroundColor: const Color(0xFFEDE9FE),
                minHeight: 2.5,
              ),

            // WebView
            Expanded(
              child: WebViewWidget(controller: _controller),
            ),
          ],
        ),
      ),
    );
  }

  void _showCancelConfirmation() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text("Cancel PhonePe Payment?"),
        content: const Text("Are you sure you want to exit this payment session?"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Continue Paying"),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(ctx);
              _onPaymentFailed("Transaction cancelled by user");
            },
            child: const Text("Yes, Cancel", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
