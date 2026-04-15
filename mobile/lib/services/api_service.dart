import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config.dart';
import '../models/business.dart';
import '../models/review.dart';
import 'auth_service.dart';

class ApiService {
  static Future<Map<String, String>> _authHeaders() async {
    final token = await AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<Map<String, dynamic>> searchBusinesses(String query, {String location = '', int page = 1}) async {
    final response = await http.post(
      Uri.parse('$baseUrl/search'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'search': query, 'location': location, 'page': page}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {
        'success': true,
        'businesses': (data['data'] as List).map((b) => Business.fromJson(b)).toList(),
        'totalPages': data['totalPages'],
        'page': data['page'],
      };
    }
    return {'success': false, 'error': data['error'] ?? 'Search failed'};
  }

  static Future<Business?> getBusinessById(String id) async {
    final response = await http.get(Uri.parse('$baseUrl/businesses/$id'));
    if (response.statusCode == 200) {
      return Business.fromJson(jsonDecode(response.body));
    }
    return null;
  }

  static Future<List<Business>> getMyBusinesses() async {
    final headers = await _authHeaders();
    final response = await http.get(Uri.parse('$baseUrl/businesses/mine'), headers: headers);
    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((b) => Business.fromJson(b)).toList();
    }
    return [];
  }

  static Future<Map<String, dynamic>> addBusiness(Map<String, dynamic> body) async {
    final headers = await _authHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/addB'),
      headers: headers,
      body: jsonEncode(body),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200 || response.statusCode == 201) {
      return {'success': true, 'business': Business.fromJson(data)};
    }
    return {'success': false, 'error': data['error'] ?? 'Failed to add business'};
  }

  static Future<Map<String, dynamic>> editBusiness(String id, Map<String, dynamic> body) async {
    final headers = await _authHeaders();
    final response = await http.patch(
      Uri.parse('$baseUrl/editB'),
      headers: headers,
      body: jsonEncode({'id': id, ...body}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true};
    }
    return {'success': false, 'error': data['error'] ?? 'Failed to update business'};
  }

  static Future<Map<String, dynamic>> removeBusiness(String name) async {
    final headers = await _authHeaders();
    final response = await http.delete(
      Uri.parse('$baseUrl/removeB'),
      headers: headers,
      body: jsonEncode({'name': name}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true};
    }
    return {'success': false, 'error': data['error'] ?? 'Failed to remove business'};
  }

  static Future<Map<String, dynamic>> updateReview(String reviewId, int rating, String review) async {
    final headers = await _authHeaders();
    final response = await http.put(
      Uri.parse('$baseUrl/reviews/$reviewId'),
      headers: headers,
      body: jsonEncode({'rating': rating, 'review': review}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true};
    }
    return {'success': false, 'error': data['message'] ?? 'Failed to update review'};
  }

  static Future<Map<String, dynamic>> getReviews(String businessId, {int page = 1}) async {
    final response = await http.get(
      Uri.parse('$baseUrl/reviews/business/$businessId?page=$page'),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {
        'success': true,
        'reviews': (data['reviews'] as List).map((r) => Review.fromJson(r)).toList(),
        'totalPages': data['totalPages'],
      };
    }
    return {'success': false, 'error': 'Failed to load reviews'};
  }

  static Future<Map<String, dynamic>> addReview(String businessId, int rating, String review) async {
    final headers = await _authHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/reviews'),
      headers: headers,
      body: jsonEncode({'businessId': businessId, 'rating': rating, 'review': review}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 201) {
      return {'success': true};
    }
    return {'success': false, 'error': data['message'] ?? 'Failed to submit review'};
  }

  static Future<Map<String, dynamic>> uploadBusinessImage(String businessName, File imageFile) async {
    final headers = await _authHeaders();
    // Step 1: get presigned upload URL
    final urlRes = await http.post(
      Uri.parse('$baseUrl/getUploadUrl'),
      headers: headers,
      body: jsonEncode({'name': businessName, 'fileType': 'image/jpeg'}),
    );
    if (urlRes.statusCode != 200) {
      final err = jsonDecode(urlRes.body);
      return {'success': false, 'error': err['error'] ?? 'Failed to get upload URL'};
    }
    final urlData = jsonDecode(urlRes.body);
    final signedUrl = urlData['url'] as String;
    // Step 2: PUT image bytes directly to S3
    final imageBytes = await imageFile.readAsBytes();
    final putRes = await http.put(
      Uri.parse(signedUrl),
      headers: {'Content-Type': 'image/jpeg'},
      body: imageBytes,
    );
    if (putRes.statusCode == 200 || putRes.statusCode == 204) {
      return {'success': true};
    }
    return {'success': false, 'error': 'Failed to upload image'};
  }

  static Future<Map<String, dynamic>> removeBusinessImage(String businessName, String key) async {
    final headers = await _authHeaders();
    final response = await http.delete(
      Uri.parse('$baseUrl/removeUrl'),
      headers: headers,
      body: jsonEncode({'name': businessName, 'key': key}),
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) return {'success': true};
    return {'success': false, 'error': data['error'] ?? 'Failed to remove image'};
  }

  static Future<Map<String, dynamic>> deleteReview(String reviewId) async {
    final headers = await _authHeaders();
    final response = await http.delete(
      Uri.parse('$baseUrl/reviews/$reviewId'),
      headers: headers,
    );
    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return {'success': true};
    }
    return {'success': false, 'error': data['message'] ?? 'Failed to delete review'};
  }
}
