import 'package:flutter_test/flutter_test.dart';
import 'package:bizmart_mobile/models/user.dart';

void main() {
  group('User.fromJson', () {
    test('parses all fields correctly', () {
      final json = {
        '_id': 'u1',
        'firstName': 'John',
        'lastName': 'Doe',
        'username': 'johndoe',
        'email': 'john@example.com',
        'isBusinessOwner': true,
        'zipCode': 32801,
      };
      final u = User.fromJson(json);
      expect(u.id, 'u1');
      expect(u.firstName, 'John');
      expect(u.lastName, 'Doe');
      expect(u.username, 'johndoe');
      expect(u.email, 'john@example.com');
      expect(u.isBusinessOwner, isTrue);
      expect(u.zipCode, 32801);
    });

    test('defaults to empty strings for missing name fields', () {
      final u = User.fromJson({});
      expect(u.id, '');
      expect(u.firstName, '');
      expect(u.lastName, '');
      expect(u.username, '');
      expect(u.email, '');
    });

    test('defaults isBusinessOwner to false when missing', () {
      final u = User.fromJson({
        '_id': 'u1',
        'firstName': 'Jane',
        'lastName': 'Doe',
        'username': 'janedoe',
        'email': 'jane@example.com',
      });
      expect(u.isBusinessOwner, isFalse);
    });

    test('isBusinessOwner is true when set', () {
      final u = User.fromJson({
        '_id': 'u1',
        'firstName': 'Bob',
        'lastName': 'Smith',
        'username': 'bsmith',
        'email': 'bob@example.com',
        'isBusinessOwner': true,
      });
      expect(u.isBusinessOwner, isTrue);
    });

    test('zipCode is null when not provided', () {
      final u = User.fromJson({
        '_id': 'u1',
        'firstName': 'Jane',
        'lastName': 'Doe',
        'username': 'janedoe',
        'email': 'jane@example.com',
        'isBusinessOwner': false,
      });
      expect(u.zipCode, isNull);
    });

    test('zipCode is parsed when provided', () {
      final u = User.fromJson({
        '_id': 'u1',
        'firstName': 'Jane',
        'lastName': 'Doe',
        'username': 'janedoe',
        'email': 'jane@example.com',
        'isBusinessOwner': false,
        'zipCode': 90210,
      });
      expect(u.zipCode, 90210);
    });
  });
}
