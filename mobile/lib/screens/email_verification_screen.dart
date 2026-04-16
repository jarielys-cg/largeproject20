import 'dart:async';
import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';

class EmailVerificationScreen extends StatefulWidget {
  final String email;

  const EmailVerificationScreen({super.key, required this.email});

  @override
  State<EmailVerificationScreen> createState() => _EmailVerificationScreenState();
}

class _EmailVerificationScreenState extends State<EmailVerificationScreen> {
  late final TextEditingController _emailCtrl;
  bool _loading = false;
  String? _message;
  String? _error;
  int _cooldown = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _emailCtrl = TextEditingController(text: widget.email);
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void _startCooldown(int seconds) {
    setState(() => _cooldown = seconds);
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (t) {
      if (_cooldown <= 1) {
        t.cancel();
        setState(() => _cooldown = 0);
      } else {
        setState(() => _cooldown--);
      }
    });
  }

  Future<void> _resend() async {
    final email = _emailCtrl.text.trim();
    if (email.isEmpty) return;
    setState(() { _loading = true; _message = null; _error = null; });
    final result = await AuthService.resendVerificationEmail(email);
    if (!mounted) return;
    setState(() => _loading = false);
    if (result['success'] == true) {
      setState(() => _message = 'Verification email sent! Check your inbox.');
      _startCooldown(result['retryAfterSeconds'] ?? 60);
    } else {
      final retryAfter = result['retryAfterSeconds'];
      if (retryAfter != null) {
        _startCooldown(retryAfter);
      }
      setState(() => _error = result['error'] ?? 'Failed to send email');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF5F4),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Top salmon banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 48),
                decoration: const BoxDecoration(
                  color: Color(0xFFF26B5B),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(32),
                    bottomRight: Radius.circular(32),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.25),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'VERIFICATION EMAIL SENT',
                        style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1.2),
                      ),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Check your inbox to finish creating your account.',
                      style: TextStyle(color: Colors.white, fontSize: 26, fontWeight: FontWeight.bold, height: 1.3),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'We sent a verification link to the email address you used during signup. The link expires in 1 hour.',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                    const SizedBox(height: 24),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Didn't see it?",
                            style: TextStyle(color: Color(0xFFF26B5B), fontWeight: FontWeight.w600, fontSize: 14),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Check spam, promotions, or other filtered folders.',
                            style: TextStyle(color: Color(0xFF555555), fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Bottom card
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
                child: Column(
                  children: [
                    // Email icon
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFDE8E6),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.email_outlined, size: 40, color: Color(0xFFF26B5B)),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Almost there',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1A1A1A)),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Your account is created, but email verification is required before sign in and other account actions will fully work.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF555555), fontSize: 14, height: 1.5),
                    ),
                    const SizedBox(height: 28),

                    // Feedback messages
                    if (_message != null)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.green[200]!),
                        ),
                        child: Text(_message!, style: const TextStyle(color: Colors.green, fontSize: 13)),
                      ),
                    if (_error != null)
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.red[200]!),
                        ),
                        child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13)),
                      ),

                    // Email field
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE0E0E0)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(left: 16, top: 12, right: 16),
                            child: Text(
                              'EMAIL ADDRESS',
                              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.grey[600], letterSpacing: 1.0),
                            ),
                          ),
                          TextField(
                            controller: _emailCtrl,
                            keyboardType: TextInputType.emailAddress,
                            style: const TextStyle(fontSize: 15),
                            decoration: const InputDecoration(
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              border: InputBorder.none,
                            ),
                          ),
                          // Resend button inside card
                          Padding(
                            padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
                            child: SizedBox(
                              width: double.infinity,
                              height: 46,
                              child: ElevatedButton(
                                onPressed: (_loading || _cooldown > 0) ? null : _resend,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFFF26B5B),
                                  foregroundColor: Colors.white,
                                  disabledBackgroundColor: const Color(0xFFE0A89F),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                  elevation: 0,
                                ),
                                child: _loading
                                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                    : Text(
                                        _cooldown > 0 ? 'Resend in ${_cooldown}s' : 'Resend verification email',
                                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                                      ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 16),

                    // Back to Login
                    SizedBox(
                      width: double.infinity,
                      height: 46,
                      child: OutlinedButton(
                        onPressed: () => Navigator.pushAndRemoveUntil(
                          context,
                          MaterialPageRoute(builder: (_) => const LoginScreen()),
                          (_) => false,
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFFF26B5B),
                          side: const BorderSide(color: Color(0xFFF26B5B)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text('Back to Login', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
