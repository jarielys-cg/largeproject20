import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bizmart_mobile/services/auth_service.dart';
import 'package:bizmart_mobile/models/user.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('AuthService.login', () {
    test('returns success and saves session on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('login'));
        expect(request.method, 'POST');
        final body = jsonDecode(request.body);
        expect(body['email'], 'john@example.com');
        expect(body['password'], 'pass123');
        return http.Response(
          jsonEncode({
            'token': 'test-token-abc',
            'user': {
              '_id': 'u1',
              'firstName': 'John',
              'lastName': 'Doe',
              'username': 'johndoe',
              'email': 'john@example.com',
              'isBusinessOwner': false,
            },
          }),
          200,
        );
      });

      final result = await http.runWithClient(
        () => AuthService.login('john@example.com', 'pass123'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
      expect(result['user'], isA<User>());
      final user = result['user'] as User;
      expect(user.email, 'john@example.com');
      expect(user.firstName, 'John');

      final token = await AuthService.getToken();
      expect(token, 'test-token-abc');
    });

    test('returns error message on 401', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'error': 'Invalid credentials'}),
          401,
        );
      });

      final result = await http.runWithClient(
        () => AuthService.login('bad@example.com', 'wrong'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Invalid credentials');
    });

    test('returns default error when response has no error field', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({}), 401);
      });

      final result = await http.runWithClient(
        () => AuthService.login('x@x.com', 'wrong'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Login failed');
    });

    test('does not save token on failure', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Bad credentials'}), 401);
      });

      await http.runWithClient(
        () => AuthService.login('bad@example.com', 'wrong'),
        () => mockClient,
      );

      final token = await AuthService.getToken();
      expect(token, isNull);
    });
  });

  group('AuthService.signUp', () {
    test('returns success on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('signUp'));
        final body = jsonDecode(request.body);
        expect(body['email'], 'new@example.com');
        expect(body['isBusinessOwner'], false);
        return http.Response(jsonEncode({}), 200);
      });

      final result = await http.runWithClient(
        () => AuthService.signUp(
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          email: 'new@example.com',
          password: 'password123',
          isBusinessOwner: false,
        ),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on 400', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'error': 'Email already exists'}),
          400,
        );
      });

      final result = await http.runWithClient(
        () => AuthService.signUp(
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'janesmith',
          email: 'existing@example.com',
          password: 'pass123',
          isBusinessOwner: false,
        ),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Email already exists');
    });

    test('sends zipCode as int when provided', () async {
      final mockClient = MockClient((request) async {
        final body = jsonDecode(request.body);
        expect(body['zipCode'], 32801);
        return http.Response(jsonEncode({}), 200);
      });

      await http.runWithClient(
        () => AuthService.signUp(
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'jsmith',
          email: 'jane@example.com',
          password: 'pass123',
          isBusinessOwner: false,
          zipCode: '32801',
        ),
        () => mockClient,
      );
    });

    test('sends null zipCode when empty string provided', () async {
      final mockClient = MockClient((request) async {
        final body = jsonDecode(request.body);
        expect(body['zipCode'], isNull);
        return http.Response(jsonEncode({}), 200);
      });

      await http.runWithClient(
        () => AuthService.signUp(
          firstName: 'Jane',
          lastName: 'Smith',
          username: 'jsmith',
          email: 'jane@example.com',
          password: 'pass123',
          isBusinessOwner: false,
          zipCode: '',
        ),
        () => mockClient,
      );
    });

    test('returns default error when no error field in response', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({}), 500);
      });

      final result = await http.runWithClient(
        () => AuthService.signUp(
          firstName: 'A',
          lastName: 'B',
          username: 'ab',
          email: 'a@b.com',
          password: 'pass123',
          isBusinessOwner: false,
        ),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Sign up failed');
    });
  });

  group('AuthService.logout', () {
    test('clears token and user from storage', () async {
      SharedPreferences.setMockInitialValues({
        'auth_token': 'some-token',
        'auth_user': jsonEncode({
          '_id': 'u1',
          'firstName': 'John',
          'lastName': 'Doe',
          'username': 'jd',
          'email': 'j@j.com',
          'isBusinessOwner': false,
        }),
      });

      await AuthService.logout();

      final token = await AuthService.getToken();
      expect(token, isNull);

      final user = await AuthService.getCachedUser();
      expect(user, isNull);
    });

    test('does not throw when storage is already empty', () async {
      expect(() => AuthService.logout(), returnsNormally);
    });
  });

  group('AuthService.getCachedUser', () {
    test('returns User when stored', () async {
      SharedPreferences.setMockInitialValues({
        'auth_user': jsonEncode({
          '_id': 'u1',
          'firstName': 'John',
          'lastName': 'Doe',
          'username': 'johndoe',
          'email': 'john@example.com',
          'isBusinessOwner': true,
        }),
      });

      final user = await AuthService.getCachedUser();
      expect(user, isNotNull);
      expect(user!.firstName, 'John');
      expect(user.isBusinessOwner, isTrue);
    });

    test('returns null when nothing stored', () async {
      final user = await AuthService.getCachedUser();
      expect(user, isNull);
    });
  });

  group('AuthService.getToken', () {
    test('returns stored token', () async {
      SharedPreferences.setMockInitialValues({'auth_token': 'my-token'});
      final token = await AuthService.getToken();
      expect(token, 'my-token');
    });

    test('returns null when no token stored', () async {
      final token = await AuthService.getToken();
      expect(token, isNull);
    });
  });

  group('AuthService.forgotPassword', () {
    test('returns success on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('forgotPassword'));
        final body = jsonDecode(request.body);
        expect(body['email'], 'user@example.com');
        return http.Response('{}', 200);
      });

      final result = await http.runWithClient(
        () => AuthService.forgotPassword('user@example.com'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error message on non-200', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'error': 'Email not found'}),
          404,
        );
      });

      final result = await http.runWithClient(
        () => AuthService.forgotPassword('nobody@example.com'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Email not found');
    });

    test('returns connection error on network exception', () async {
      final mockClient = MockClient((request) async {
        throw Exception('Network error');
      });

      final result = await http.runWithClient(
        () => AuthService.forgotPassword('user@example.com'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Could not connect to server');
    });

    test('returns default error when response body has no error field', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({}), 500);
      });

      final result = await http.runWithClient(
        () => AuthService.forgotPassword('user@example.com'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Failed to send reset email');
    });
  });

  group('AuthService.resendVerificationEmail', () {
    test('returns success with retryAfterSeconds on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('resend-email'));
        return http.Response(
          jsonEncode({'retryAfterSeconds': 60}),
          200,
        );
      });

      final result = await http.runWithClient(
        () => AuthService.resendVerificationEmail('user@example.com'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
      expect(result['retryAfterSeconds'], 60);
    });

    test('returns error on non-200', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'error': 'Too many requests', 'retryAfterSeconds': 120}),
          429,
        );
      });

      final result = await http.runWithClient(
        () => AuthService.resendVerificationEmail('user@example.com'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Too many requests');
      expect(result['retryAfterSeconds'], 120);
    });

    test('returns connection error on network exception', () async {
      final mockClient = MockClient((request) async {
        throw Exception('Timeout');
      });

      final result = await http.runWithClient(
        () => AuthService.resendVerificationEmail('user@example.com'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Could not connect to server');
    });
  });
}
