import 'dart:js' as js;

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
  try {
    js.context.callMethod('payWithRazorpay', [
      js.JsObject.jsify({
        'key': keyId,
        'amount': (amount * 100).toInt(),
        'name': 'Evegah Mobility',
        'description': description,
        'order_id': orderId.isNotEmpty ? orderId : null,
        'contact': contact,
        'email': email,
      }),
      (paymentId) {
        onSuccess(paymentId ?? "PAY_SUCCESS_WEB");
      },
      (error) {
        onFailure(error ?? "Unknown Web Error");
      }
    ]);
  } catch (e) {
    onFailure(e.toString());
  }
}
