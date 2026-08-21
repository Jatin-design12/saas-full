void startRazorpayWebCheckout({
  required String keyId,
  required double amount,
  required String description,
  required String contact,
  required String email,
  required String orderId,
  required Function(String paymentId) onSuccess,
  required Function(String error) onFailure,
}) {
  // Stub for native platforms - web razorpay is not called here
}
