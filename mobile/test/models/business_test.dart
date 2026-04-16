import 'package:flutter_test/flutter_test.dart';
import 'package:bizmart_mobile/models/business.dart';

void main() {
  group('Business.fromJson', () {
    test('parses all required fields', () {
      final json = {
        '_id': 'b1',
        'name': 'Test Bakery',
        'ownerId': 'u1',
        'category': ['Food', 'Bakery'],
        'image': [],
        'reviewCount': 5,
        'averageReviewScore': 4.2,
      };
      final b = Business.fromJson(json);
      expect(b.id, 'b1');
      expect(b.name, 'Test Bakery');
      expect(b.ownerId, 'u1');
      expect(b.category, ['Food', 'Bakery']);
      expect(b.reviewCount, 5);
      expect(b.averageReviewScore, 4.2);
    });

    test('defaults to empty/zero values when fields are missing', () {
      final b = Business.fromJson({});
      expect(b.id, '');
      expect(b.name, '');
      expect(b.ownerId, '');
      expect(b.reviewCount, 0);
      expect(b.averageReviewScore, 0.0);
      expect(b.image, isEmpty);
      expect(b.category, isEmpty);
    });

    test('prefixes relative image URLs with CDN base', () {
      final json = {
        '_id': 'b1',
        'name': 'Shop',
        'ownerId': 'u1',
        'category': [],
        'image': ['folder/my-image.jpg'],
        'reviewCount': 0,
        'averageReviewScore': 0,
      };
      final b = Business.fromJson(json);
      expect(
        b.image.first,
        'https://marketplacegroup20.sfo3.digitaloceanspaces.com/folder/my-image.jpg',
      );
    });

    test('keeps absolute image URLs unchanged', () {
      final json = {
        '_id': 'b1',
        'name': 'Shop',
        'ownerId': 'u1',
        'category': [],
        'image': ['https://example.com/photo.jpg'],
        'reviewCount': 0,
        'averageReviewScore': 0,
      };
      final b = Business.fromJson(json);
      expect(b.image.first, 'https://example.com/photo.jpg');
    });

    test('parses zipCode as int from string', () {
      final json = {
        '_id': 'b1',
        'name': 'Shop',
        'ownerId': 'u1',
        'category': [],
        'image': [],
        'reviewCount': 0,
        'averageReviewScore': 0,
        'zipCode': '32801',
      };
      final b = Business.fromJson(json);
      expect(b.zipCode, 32801);
    });

    test('parses zipCode as int directly', () {
      final json = {
        '_id': 'b1',
        'name': 'Shop',
        'ownerId': 'u1',
        'category': [],
        'image': [],
        'reviewCount': 0,
        'averageReviewScore': 0,
        'zipCode': 32801,
      };
      final b = Business.fromJson(json);
      expect(b.zipCode, 32801);
    });

    test('optional fields are null when absent', () {
      final b = Business.fromJson({
        '_id': 'b1',
        'name': 'X',
        'ownerId': 'u1',
        'category': [],
        'image': [],
        'reviewCount': 0,
        'averageReviewScore': 0,
      });
      expect(b.description, isNull);
      expect(b.address, isNull);
      expect(b.city, isNull);
      expect(b.state, isNull);
      expect(b.zipCode, isNull);
      expect(b.phone, isNull);
      expect(b.websiteLink, isNull);
    });

    test('parses all optional fields when present', () {
      final json = {
        '_id': 'b1',
        'name': 'Cafe',
        'ownerId': 'u1',
        'category': ['Food'],
        'image': [],
        'reviewCount': 2,
        'averageReviewScore': 3.5,
        'description': 'A cozy cafe',
        'address': '123 Main St',
        'city': 'Orlando',
        'state': 'FL',
        'zipCode': 32801,
        'phone': '555-1234',
        'websiteLink': 'https://cafe.com',
      };
      final b = Business.fromJson(json);
      expect(b.description, 'A cozy cafe');
      expect(b.address, '123 Main St');
      expect(b.city, 'Orlando');
      expect(b.state, 'FL');
      expect(b.zipCode, 32801);
      expect(b.phone, '555-1234');
      expect(b.websiteLink, 'https://cafe.com');
    });

    test('averageReviewScore is cast to double from int', () {
      final json = {
        '_id': 'b1',
        'name': 'X',
        'ownerId': 'u1',
        'category': [],
        'image': [],
        'reviewCount': 0,
        'averageReviewScore': 4,
      };
      final b = Business.fromJson(json);
      expect(b.averageReviewScore, isA<double>());
      expect(b.averageReviewScore, 4.0);
    });
  });

  group('Business.toJson', () {
    test('returns correct map with all fields', () {
      final b = Business(
        id: 'b1',
        name: 'Cafe',
        ownerId: 'u1',
        category: ['Food'],
        image: [],
        reviewCount: 0,
        averageReviewScore: 0.0,
        address: '123 Main St',
        city: 'Orlando',
        state: 'FL',
        zipCode: 32801,
        phone: '555-1234',
        websiteLink: 'https://cafe.com',
        description: 'Nice place',
      );
      final json = b.toJson();
      expect(json['name'], 'Cafe');
      expect(json['address'], '123 Main St');
      expect(json['city'], 'Orlando');
      expect(json['state'], 'FL');
      expect(json['zipCode'], 32801);
      expect(json['phone'], '555-1234');
      expect(json['websiteLink'], 'https://cafe.com');
      expect(json['description'], 'Nice place');
      expect(json['category'], ['Food']);
    });

    test('does not include id or ownerId', () {
      final b = Business(
        id: 'b1',
        name: 'Shop',
        ownerId: 'u1',
        category: [],
        image: [],
        reviewCount: 0,
        averageReviewScore: 0.0,
      );
      final json = b.toJson();
      expect(json.containsKey('_id'), isFalse);
      expect(json.containsKey('ownerId'), isFalse);
    });
  });
}
