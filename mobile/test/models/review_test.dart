import 'package:flutter_test/flutter_test.dart';
import 'package:bizmart_mobile/models/review.dart';

void main() {
  group('Review.fromJson', () {
    test('parses all fields correctly', () {
      final json = {
        '_id': 'r1',
        'businessId': 'b1',
        'userId': 'u1',
        'rating': 4,
        'review': 'Great place!',
        'createdAt': '2024-01-15T10:00:00.000Z',
      };
      final r = Review.fromJson(json);
      expect(r.id, 'r1');
      expect(r.businessId, 'b1');
      expect(r.userId, 'u1');
      expect(r.rating, 4);
      expect(r.review, 'Great place!');
      expect(r.createdAt, isNotNull);
      expect(r.createdAt!.year, 2024);
      expect(r.createdAt!.month, 1);
      expect(r.createdAt!.day, 15);
    });

    test('defaults to empty/zero values when fields are missing', () {
      final r = Review.fromJson({});
      expect(r.id, '');
      expect(r.businessId, '');
      expect(r.userId, '');
      expect(r.rating, 0);
      expect(r.review, '');
      expect(r.createdAt, isNull);
    });

    test('handles null createdAt', () {
      final json = {
        '_id': 'r1',
        'businessId': 'b1',
        'userId': 'u1',
        'rating': 3,
        'review': 'OK',
        'createdAt': null,
      };
      final r = Review.fromJson(json);
      expect(r.createdAt, isNull);
    });

    test('handles invalid createdAt string gracefully', () {
      final json = {
        '_id': 'r1',
        'businessId': 'b1',
        'userId': 'u1',
        'rating': 3,
        'review': 'OK',
        'createdAt': 'not-a-date',
      };
      final r = Review.fromJson(json);
      expect(r.createdAt, isNull);
    });

    test('rating of 1 is parsed correctly', () {
      final json = {
        '_id': 'r2',
        'businessId': 'b1',
        'userId': 'u2',
        'rating': 1,
        'review': 'Terrible',
      };
      final r = Review.fromJson(json);
      expect(r.rating, 1);
    });

    test('rating of 5 is parsed correctly', () {
      final json = {
        '_id': 'r3',
        'businessId': 'b1',
        'userId': 'u3',
        'rating': 5,
        'review': 'Excellent',
      };
      final r = Review.fromJson(json);
      expect(r.rating, 5);
    });
  });
}
