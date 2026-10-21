import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/services/session_service.dart';
import '../../../dashboard/presentation/screens/main_navigation.dart';

class OtpScreen extends StatefulWidget {
  final String phoneNumber;

  const OtpScreen({
    super.key,
    required this.phoneNumber,
  });

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen>
    with SingleTickerProviderStateMixin {
  // ── Premium palette ─────────────────────────────────────────────
  static const Color _bg = Color(0xFF0D0B1A);
  static const Color _card = Color(0xFF16132B);
  static const Color _accent = Color(0xFFFFC629);
  static const Color _accentSoft = Color(0xFFFFE082);
  static const Color _purple = Color(0xFF6C4DF6);
  static const Color _purpleDeep = Color(0xFF2A195C);
  static const Color _textPrimary = Color(0xFFF5F3FF);
  static const Color _textMuted = Color(0xFF8B87A3);
  static const Color _line = Color(0xFF2A2540);

  final List<TextEditingController> _controllers =
      List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  int _resendTimerSeconds = 45;
  Timer? _timer;
  bool _isLoading = false;

  late final AnimationController _animController;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;
  late final Animation<double> _glowPulse;

  @override
  void initState() {
    super.initState();
    _startTimer();

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _fade = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.06),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutCubic,
    ));
    _glowPulse = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeInOut),
    );

    _animController.forward();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _focusNodes.first.requestFocus();
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _animController.dispose();
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    super.dispose();
  }

  void _startTimer() {
    _timer?.cancel();
    if (mounted) setState(() => _resendTimerSeconds = 45);
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) {
        timer.cancel();
        return;
      }
      if (_resendTimerSeconds > 0) {
        setState(() => _resendTimerSeconds--);
      } else {
        timer.cancel();
      }
    });
  }

  void _onDigitChanged(int index, String value) {
    if (value.length > 1) {
      final digits = value.replaceAll(RegExp(r'\D'), '');
      for (var i = 0; i < 4; i++) {
        _controllers[i].text = i < digits.length ? digits[i] : '';
      }
      final next = digits.length.clamp(0, 3);
      _focusNodes[next].requestFocus();
      setState(() {});
      if (digits.length >= 4) _verifyOtp();
      return;
    }

    setState(() {});
    if (value.isNotEmpty) {
      if (index < 3) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    } else if (index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
  }

  String _getOtpString() => _controllers.map((c) => c.text).join();

  Future<void> _verifyOtp() async {
    if (_isLoading) return;
    final otp = _getOtpString();
    if (otp.length != 4) {
      _showMessage('Please enter the complete 4-digit OTP code.');
      return;
    }

    setState(() => _isLoading = true);
    try {
      await Future.delayed(const Duration(milliseconds: 450));
      await SessionService().saveToken('mock_evegah_session_token_12345');
      await SessionService().saveUserMobile(widget.phoneNumber);

      if (!mounted) return;
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => const MainNavigation()),
        (route) => false,
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _showMessage('Unable to verify right now. Please try again.');
      debugPrint('OTP verification/session error: $e');
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        SnackBar(
          content: Text(message),
          behavior: SnackBarBehavior.floating,
          backgroundColor: _purpleDeep,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          margin: const EdgeInsets.all(16),
        ),
      );
  }

  @override
  Widget build(BuildContext context) {
    final media = MediaQuery.of(context);
    final isCompact = media.size.height < 720;

    return Scaffold(
      backgroundColor: _bg,
      resizeToAvoidBottomInset: true,
      body: Stack(
        children: [
          // ── Ambient background ──────────────────────────────
          Positioned(
            top: -120,
            left: -80,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    _purple.withOpacity(.25),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Positioned(
            bottom: -150,
            right: -100,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    _accent.withOpacity(.08),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),

          // ── Main content ────────────────────────────────────
          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              keyboardDismissBehavior:
                  ScrollViewKeyboardDismissBehavior.onDrag,
              padding: EdgeInsets.only(
                bottom: media.viewInsets.bottom > 0 ? 24 : 32,
              ),
              child: FadeTransition(
                opacity: _fade,
                child: SlideTransition(
                  position: _slide,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // ── Top bar ──────────────────────────
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
                        child: Row(
                          children: [
                            _GlassIconButton(
                              icon: Icons.arrow_back_rounded,
                              onTap: () => Navigator.maybePop(context),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 14,
                                vertical: 9,
                              ),
                              decoration: BoxDecoration(
                                color: _accent.withOpacity(.10),
                                borderRadius: BorderRadius.circular(30),
                                border: Border.all(
                                  color: _accent.withOpacity(.20),
                                ),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.shield_rounded,
                                    size: 14,
                                    color: _accent,
                                  ),
                                  const SizedBox(width: 7),
                                  Text(
                                    'SECURE',
                                    style: TextStyle(
                                      color: _accent.withOpacity(.9),
                                      fontSize: 10,
                                      fontWeight: FontWeight.w800,
                                      letterSpacing: 1.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: isCompact ? 20 : 32),

                      // ── Brand mark ───────────────────────
                      Center(
                        child: Column(
                          children: [
                            Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [_accent, _accentSoft],
                                ),
                                borderRadius: BorderRadius.circular(24),
                                boxShadow: [
                                  BoxShadow(
                                    color: _accent.withOpacity(.30),
                                    blurRadius: 30,
                                    offset: const Offset(0, 10),
                                  ),
                                ],
                              ),
                              child: const Icon(
                                Icons.bolt_rounded,
                                color: _purpleDeep,
                                size: 40,
                              ),
                            ),
                            const SizedBox(height: 16),
                            const Text(
                              'evegah',
                              style: TextStyle(
                                color: _textPrimary,
                                fontWeight: FontWeight.w900,
                                fontSize: 26,
                                letterSpacing: -1,
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(height: isCompact ? 24 : 36),

                      // ── Main card ────────────────────────
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: _card,
                          borderRadius: BorderRadius.circular(28),
                          border: Border.all(color: _line),
                          boxShadow: [
                            BoxShadow(
                              color: _purpleDeep.withOpacity(.30),
                              blurRadius: 40,
                              offset: const Offset(0, 16),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(28),
                          child: Stack(
                            children: [
                              // Glass highlight
                              Positioned(
                                top: -60,
                                right: -40,
                                child: Container(
                                  width: 180,
                                  height: 180,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: _purple.withOpacity(.08),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: EdgeInsets.fromLTRB(
                                  24,
                                  isCompact ? 24 : 30,
                                  24,
                                  28,
                                ),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.stretch,
                                  children: [
                                    // Header
                                    const Text(
                                      'Verification Code',
                                      style: TextStyle(
                                        color: _textPrimary,
                                        fontSize: 22,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: -0.5,
                                      ),
                                    ),
                                    const SizedBox(height: 6),
                                    Text(
                                      'Enter the 4-digit code sent to',
                                      style: TextStyle(
                                        color: _textMuted,
                                        fontSize: 13,
                                        height: 1.4,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      widget.phoneNumber,
                                      style: const TextStyle(
                                        color: _accent,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 0.3,
                                      ),
                                    ),

                                    SizedBox(height: isCompact ? 20 : 28),

                                    // OTP inputs
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: List.generate(4, (index) {
                                        final focused =
                                            _focusNodes[index].hasFocus;
                                        final filled = _controllers[index]
                                            .text
                                            .isNotEmpty;
                                        return _OtpDigitField(
                                          controller: _controllers[index],
                                          focusNode: _focusNodes[index],
                                          index: index,
                                          focused: focused,
                                          filled: filled,
                                          onChanged: (v) =>
                                              _onDigitChanged(index, v),
                                          width: (media.size.width - 112) / 4,
                                        );
                                      }),
                                    ),

                                    SizedBox(height: isCompact ? 18 : 24),

                                    // Resend row
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 16,
                                        vertical: 14,
                                      ),
                                      decoration: BoxDecoration(
                                        color: _bg.withOpacity(.6),
                                        borderRadius:
                                            BorderRadius.circular(16),
                                        border: Border.all(
                                          color: _line.withOpacity(.6),
                                        ),
                                      ),
                                      child: Row(
                                        children: [
                                          Icon(
                                            Icons.timer_outlined,
                                            color: _textMuted,
                                            size: 18,
                                          ),
                                          const SizedBox(width: 10),
                                          Expanded(
                                            child: Text(
                                              _resendTimerSeconds > 0
                                                  ? 'Resend in 00:${_resendTimerSeconds.toString().padLeft(2, '0')}'
                                                  : 'Didn\'t receive the code?',
                                              style: TextStyle(
                                                color: _textMuted,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),
                                          TextButton(
                                            onPressed:
                                                _resendTimerSeconds == 0
                                                    ? () {
                                                        _startTimer();
                                                        _showMessage(
                                                            'Request a new OTP using your SMS service.');
                                                      }
                                                    : null,
                                            style: TextButton.styleFrom(
                                              foregroundColor: _accent,
                                              disabledForegroundColor:
                                                  _textMuted.withOpacity(.4),
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 8),
                                              minimumSize:
                                                  const Size(0, 32),
                                              tapTargetSize:
                                                  MaterialTapTargetSize
                                                      .shrinkWrap,
                                            ),
                                            child: Text(
                                              'Resend',
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w800,
                                                color: _resendTimerSeconds == 0
                                                    ? _accent
                                                    : _textMuted
                                                        .withOpacity(.4),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                    SizedBox(height: isCompact ? 20 : 26),

                                    // Verify button
                                    SizedBox(
                                      height: 56,
                                      child: ElevatedButton(
                                        onPressed:
                                            _isLoading ? null : _verifyOtp,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: _accent,
                                          disabledBackgroundColor:
                                              _accent.withOpacity(.45),
                                          foregroundColor: _purpleDeep,
                                          elevation: 0,
                                          shadowColor: Colors.transparent,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(18),
                                          ),
                                        ),
                                        child: _isLoading
                                            ? const SizedBox(
                                                width: 22,
                                                height: 22,
                                                child:
                                                    CircularProgressIndicator(
                                                  color: _purpleDeep,
                                                  strokeWidth: 2.4,
                                                ),
                                              )
                                            : const Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  Text(
                                                    'Verify & Continue',
                                                    style: TextStyle(
                                                      fontSize: 15,
                                                      fontWeight:
                                                          FontWeight.w800,
                                                      letterSpacing: 0.2,
                                                    ),
                                                  ),
                                                  SizedBox(width: 10),
                                                  Icon(
                                                    Icons
                                                        .arrow_forward_rounded,
                                                    size: 20,
                                                  ),
                                                ],
                                              ),
                                      ),
                                    ),

                                    const SizedBox(height: 18),

                                    // Privacy note
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.lock_outline_rounded,
                                          color:
                                              _textMuted.withOpacity(.6),
                                          size: 13,
                                        ),
                                        const SizedBox(width: 6),
                                        Text(
                                          'End-to-end encrypted',
                                          style: TextStyle(
                                            color: _textMuted
                                                .withOpacity(.6),
                                            fontSize: 11,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // ── Footer ───────────────────────────
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'By continuing, you agree to Evegah\'s Terms & Conditions and Privacy Policy.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: _textMuted.withOpacity(.5),
                            fontSize: 10.5,
                            height: 1.6,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── OTP digit field ──────────────────────────────────────────────
class _OtpDigitField extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final int index;
  final bool focused;
  final bool filled;
  final ValueChanged<String> onChanged;
  final double width;

  const _OtpDigitField({
    required this.controller,
    required this.focusNode,
    required this.index,
    required this.focused,
    required this.filled,
    required this.onChanged,
    required this.width,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: 68,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
        decoration: BoxDecoration(
          color: focused
              ? const Color(0xFFFFFBEB)
              : const Color(0xFF0D0B1A),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: focused
                ? const Color(0xFFFFC629)
                : filled
                    ? const Color(0xFFFFC629).withOpacity(.4)
                    : const Color(0xFF2A2540),
            width: focused ? 2 : 1.4,
          ),
          boxShadow: focused
              ? [
                  BoxShadow(
                    color: const Color(0xFFFFC629).withOpacity(.20),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ]
              : null,
        ),
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          keyboardType: TextInputType.number,
          textInputAction:
              index == 3 ? TextInputAction.done : TextInputAction.next,
          textAlign: TextAlign.center,
          maxLength: 1,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          autofillHints: const [AutofillHints.oneTimeCode],
          style: const TextStyle(
            fontSize: 26,
            fontWeight: FontWeight.w800,
            color: Color(0xFFFFC629),
          ),
          decoration: InputDecoration(
            counterText: '',
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 16),
            hintText: '·',
            hintStyle: TextStyle(
              color: const Color(0xFF2A2540).withOpacity(.8),
              fontSize: 28,
              fontWeight: FontWeight.w300,
            ),
          ),
          onChanged: onChanged,
        ),
      ),
    );
  }
}

// ── Glass icon button ────────────────────────────────────────────
class _GlassIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;

  const _GlassIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFF16132B),
      borderRadius: BorderRadius.circular(15),
      child: InkWell(
        borderRadius: BorderRadius.circular(15),
        onTap: onTap,
        child: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(15),
            border: Border.all(color: const Color(0xFF2A2540)),
          ),
          child: Icon(icon, color: const Color(0xFFF5F3FF), size: 20),
        ),
      ),
    );
  }
}