import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _isBusinessOwner = false;
  bool _loading = false;
  String _message = '';
  bool _isError = false;

  @override
  void dispose() {
    _usernameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _message = ''; });

    try {
      final result = await AuthService.signUp(
        username: _usernameCtrl.text.trim(),
        email: _emailCtrl.text.trim(),
        password: _passwordCtrl.text,
        isBusinessOwner: _isBusinessOwner,
      );
      if (!mounted) return;

      final isSuccess = result['status'] == 201;
      setState(() {
        _isError = !isSuccess;
        _message = (isSuccess ? result['message'] : result['error']) as String? ?? '';
      });
    } catch (_) {
      setState(() { _isError = true; _message = 'Could not connect to server'; });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create Account')),
      backgroundColor: Colors.grey[100],
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('Join BizMart', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blue)),
                    const SizedBox(height: 24),

                    if (_message.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.all(10),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: _isError ? Colors.red[50] : Colors.green[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(_message, style: TextStyle(color: _isError ? Colors.red : Colors.green[800])),
                      ),

                    TextFormField(
                      controller: _usernameCtrl,
                      decoration: const InputDecoration(labelText: 'Username', border: OutlineInputBorder(), prefixIcon: Icon(Icons.person)),
                      validator: (v) => v == null || v.isEmpty ? 'Enter a username' : null,
                    ),
                    const SizedBox(height: 16),

                    TextFormField(
                      controller: _emailCtrl,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder(), prefixIcon: Icon(Icons.email)),
                      validator: (v) => v == null || !v.contains('@') ? 'Enter a valid email' : null,
                    ),
                    const SizedBox(height: 16),

                    TextFormField(
                      controller: _passwordCtrl,
                      obscureText: true,
                      decoration: const InputDecoration(labelText: 'Password', border: OutlineInputBorder(), prefixIcon: Icon(Icons.lock)),
                      validator: (v) => v == null || v.length < 6 ? 'Password must be at least 6 characters' : null,
                    ),
                    const SizedBox(height: 12),

                    SwitchListTile(
                      title: const Text('I am a business owner'),
                      value: _isBusinessOwner,
                      onChanged: (val) => setState(() => _isBusinessOwner = val),
                    ),
                    const SizedBox(height: 16),

                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _loading ? null : _signUp,
                        style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                        child: _loading
                            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                            : const Text('Create Account', style: TextStyle(fontSize: 16)),
                      ),
                    ),
                    const SizedBox(height: 12),

                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Already have an account? Log in'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
