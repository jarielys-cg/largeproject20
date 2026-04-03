import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config.dart';

class AuthService {
  static const _storage = FlutterSecureStorage();

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await http.post(
      Uri.parse('$apiBaseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    if (res.statusCode == 200) {
      await _storage.write(key: 'token', value: data['token'] as String);
      await _storage.write(key: 'user', value: jsonEncode(data['user']));
    }
    return {'status': res.statusCode, ...data};
  }

  static Future<Map<String, dynamic>> signUp({
    required String username,
    required String email,
    required String password,
    bool isBusinessOwner = false,
  }) async {
    final res = await http.post(
      Uri.parse('$apiBaseUrl/signUp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'username': username,
        'email': email,
        'password': password,
        'isBusinessOwner': isBusinessOwner,
      }),
    );
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return {'status': res.statusCode, ...data};
  }

  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    final res = await http.post(
      Uri.parse('$apiBaseUrl/forgot-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );
    final data = jsonDecode(res.body) as Map<String, dynamic>;
    return {'status': res.statusCode, ...data};
  }

  static Future<String?> getToken() => _storage.read(key: 'token');

  static Future<void> logout() async {
    await _storage.delete(key: 'token');
    await _storage.delete(key: 'user');
  }

  static Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'token');
    return token != null && token.isNotEmpty;
  }
}
