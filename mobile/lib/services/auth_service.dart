import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config.dart';
import '../models/user.dart';

class AuthService {
  static const _tokenKey = 'auth_token';
  static const _userKey = 'auth_user';

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  static Future<void> _saveSession(String token, Map<String, dynamic> userJson) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_userKey, jsonEncode(userJson));
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
  }

  static Future<User?> getCachedUser() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_userKey);
    if (raw == null) return null;
    return User.fromJson(jsonDecode(raw));
  }

  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      await _saveSession(data['token'], data['user']);
      return {'success': true, 'user': User.fromJson(data['user'])};
    }
    return {'success': false, 'error': data['error'] ?? 'Login failed'};
  }

  static Future<Map<String, dynamic>> forgotPassword(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/forgotPassword'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true};
    }
    return {'success': false, 'error': data['error'] ?? 'Failed to send reset email'};
  }

  static Future<Map<String, dynamic>> signUp({
    required String firstName,
    required String lastName,
    required String username,
    required String email,
    required String password,
    required bool isBusinessOwner,
    String? zipCode,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/signUp'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'username': username,
        'email': email,
        'password': password,
        'isBusinessOwner': isBusinessOwner,
        'zipCode': zipCode != null ? int.tryParse(zipCode) : null,
      }),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      await _saveSession(data['token'], data['savedUser']);
      return {'success': true, 'user': User.fromJson(data['savedUser'])};
    }
    return {'success': false, 'error': data['error'] ?? 'Sign up failed'};
  }
}
