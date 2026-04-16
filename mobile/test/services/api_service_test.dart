import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bizmart_mobile/services/api_service.dart';
import 'package:bizmart_mobile/models/business.dart';
import 'package:bizmart_mobile/models/review.dart';

Map<String, dynamic> _businessJson({String id = 'b1', String name = 'Test Biz'}) => {
  '_id': id,
  'name': name,
  'ownerId': 'u1',
  'category': ['Food'],
  'image': [],
  'reviewCount': 10,
  'averageReviewScore': 4.0,
};

Map<String, dynamic> _reviewJson({String id = 'r1', int rating = 4}) => {
  '_id': id,
  'businessId': 'b1',
  'userId': 'u1',
  'rating': rating,
  'review': 'Good place',
};

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({'auth_token': 'test-token'});
  });

  group('ApiService.searchBusinesses', () {
    test('returns list of businesses on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('search'));
        return http.Response(
          jsonEncode({
            'data': [_businessJson(), _businessJson(id: 'b2', name: 'Another Place')],
            'totalPages': 2,
            'page': 1,
          }),
          200,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.searchBusinesses('pizza'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
      expect(result['businesses'], isA<List<Business>>());
      expect((result['businesses'] as List).length, 2);
      expect(result['totalPages'], 2);
      expect(result['page'], 1);
    });

    test('sends query, location, and page in request body', () async {
      final mockClient = MockClient((request) async {
        final body = jsonDecode(request.body);
        expect(body['search'], 'coffee');
        expect(body['location'], 'Orlando');
        expect(body['page'], 2);
        return http.Response(
          jsonEncode({'data': [], 'totalPages': 0, 'page': 2}),
          200,
        );
      });

      await http.runWithClient(
        () => ApiService.searchBusinesses('coffee', location: 'Orlando', page: 2),
        () => mockClient,
      );
    });

    test('returns empty businesses list when data is empty', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'data': [], 'totalPages': 0, 'page': 1}),
          200,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.searchBusinesses('nothing'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
      expect((result['businesses'] as List), isEmpty);
    });

    test('returns error on non-200', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Server error'}), 500);
      });

      final result = await http.runWithClient(
        () => ApiService.searchBusinesses('pizza'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
    });
  });

  group('ApiService.getBusinessById', () {
    test('returns Business on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('businesses/b1'));
        return http.Response(jsonEncode(_businessJson()), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.getBusinessById('b1'),
        () => mockClient,
      );

      expect(result, isNotNull);
      expect(result!.id, 'b1');
      expect(result.name, 'Test Biz');
    });

    test('returns null on 404', () async {
      final mockClient = MockClient((request) async {
        return http.Response('Not found', 404);
      });

      final result = await http.runWithClient(
        () => ApiService.getBusinessById('invalid'),
        () => mockClient,
      );

      expect(result, isNull);
    });
  });

  group('ApiService.getMyBusinesses', () {
    test('returns list of businesses on 200 with auth header', () async {
      final mockClient = MockClient((request) async {
        expect(request.headers['Authorization'], 'Bearer test-token');
        expect(request.url.path, contains('businesses/mine'));
        return http.Response(
          jsonEncode([
            _businessJson(id: 'b1'),
            _businessJson(id: 'b2', name: 'Second Shop'),
          ]),
          200,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.getMyBusinesses(),
        () => mockClient,
      );

      expect(result.length, 2);
      expect(result[0].id, 'b1');
      expect(result[1].name, 'Second Shop');
    });

    test('returns empty list on 401', () async {
      final mockClient = MockClient((request) async {
        return http.Response('Unauthorized', 401);
      });

      final result = await http.runWithClient(
        () => ApiService.getMyBusinesses(),
        () => mockClient,
      );

      expect(result, isEmpty);
    });

    test('returns empty list on 500', () async {
      final mockClient = MockClient((request) async {
        return http.Response('Server error', 500);
      });

      final result = await http.runWithClient(
        () => ApiService.getMyBusinesses(),
        () => mockClient,
      );

      expect(result, isEmpty);
    });
  });

  group('ApiService.addBusiness', () {
    test('returns success with Business on 201', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('addB'));
        expect(request.method, 'POST');
        return http.Response(jsonEncode(_businessJson()), 201);
      });

      final result = await http.runWithClient(
        () => ApiService.addBusiness({'name': 'Test Biz', 'category': ['Food']}),
        () => mockClient,
      );

      expect(result['success'], isTrue);
      expect(result['business'], isA<Business>());
    });

    test('returns success with Business on 200', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode(_businessJson()), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.addBusiness({'name': 'Test Biz', 'category': ['Food']}),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on 400', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'error': 'Business already exists'}),
          400,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.addBusiness({'name': 'Existing', 'category': []}),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Business already exists');
    });

    test('returns default error message when no error field', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({}), 500);
      });

      final result = await http.runWithClient(
        () => ApiService.addBusiness({'name': 'X', 'category': []}),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Failed to add business');
    });
  });

  group('ApiService.editBusiness', () {
    test('returns success on 200 and sends id in body', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'PATCH');
        final body = jsonDecode(request.body);
        expect(body['id'], 'b1');
        expect(body['name'], 'Updated Name');
        return http.Response(jsonEncode({}), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.editBusiness('b1', {'name': 'Updated Name'}),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on failure', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Not found'}), 404);
      });

      final result = await http.runWithClient(
        () => ApiService.editBusiness('bad-id', {}),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Not found');
    });
  });

  group('ApiService.removeBusiness', () {
    test('returns success on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'DELETE');
        final body = jsonDecode(request.body);
        expect(body['name'], 'My Shop');
        return http.Response(jsonEncode({}), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.removeBusiness('My Shop'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on failure', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Business not found'}), 404);
      });

      final result = await http.runWithClient(
        () => ApiService.removeBusiness('Ghost Shop'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Business not found');
    });
  });

  group('ApiService.getReviews', () {
    test('returns reviews and totalPages on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.path, contains('reviews/business/b1'));
        return http.Response(
          jsonEncode({
            'reviews': [_reviewJson(), _reviewJson(id: 'r2', rating: 5)],
            'totalPages': 3,
          }),
          200,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.getReviews('b1'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
      expect(result['reviews'], isA<List<Review>>());
      expect((result['reviews'] as List).length, 2);
      expect(result['totalPages'], 3);
    });

    test('includes page parameter in URL', () async {
      final mockClient = MockClient((request) async {
        expect(request.url.queryParameters['page'], '2');
        return http.Response(
          jsonEncode({'reviews': [], 'totalPages': 5}),
          200,
        );
      });

      await http.runWithClient(
        () => ApiService.getReviews('b1', page: 2),
        () => mockClient,
      );
    });

    test('returns error on failure', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Server error'}), 500);
      });

      final result = await http.runWithClient(
        () => ApiService.getReviews('b1'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Failed to load reviews');
    });
  });

  group('ApiService.addReview', () {
    test('returns success on 201', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'POST');
        final body = jsonDecode(request.body);
        expect(body['businessId'], 'b1');
        expect(body['rating'], 5);
        expect(body['review'], 'Excellent!');
        return http.Response(jsonEncode({}), 201);
      });

      final result = await http.runWithClient(
        () => ApiService.addReview('b1', 5, 'Excellent!'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on 400', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Already reviewed this business'}),
          400,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.addReview('b1', 3, 'Decent'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Already reviewed this business');
    });

    test('returns default error when no message field', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({}), 500);
      });

      final result = await http.runWithClient(
        () => ApiService.addReview('b1', 3, 'OK'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Failed to submit review');
    });
  });

  group('ApiService.updateReview', () {
    test('returns success on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'PUT');
        expect(request.url.path, contains('reviews/r1'));
        final body = jsonDecode(request.body);
        expect(body['rating'], 4);
        expect(body['review'], 'Updated review');
        return http.Response(jsonEncode({}), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.updateReview('r1', 4, 'Updated review'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on failure', () async {
      final mockClient = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Review not found'}),
          404,
        );
      });

      final result = await http.runWithClient(
        () => ApiService.updateReview('bad-id', 3, 'test'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Review not found');
    });
  });

  group('ApiService.deleteReview', () {
    test('returns success on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'DELETE');
        expect(request.url.path, contains('reviews/r1'));
        return http.Response(jsonEncode({}), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.deleteReview('r1'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on 404', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'message': 'Not found'}), 404);
      });

      final result = await http.runWithClient(
        () => ApiService.deleteReview('bad-id'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Not found');
    });

    test('returns default error when no message field', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({}), 500);
      });

      final result = await http.runWithClient(
        () => ApiService.deleteReview('r1'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Failed to delete review');
    });
  });

  group('ApiService.removeBusinessImage', () {
    test('returns success on 200', () async {
      final mockClient = MockClient((request) async {
        expect(request.method, 'DELETE');
        final body = jsonDecode(request.body);
        expect(body['name'], 'My Shop');
        expect(body['key'], 'images/my-shop/photo.jpg');
        return http.Response(jsonEncode({}), 200);
      });

      final result = await http.runWithClient(
        () => ApiService.removeBusinessImage('My Shop', 'images/my-shop/photo.jpg'),
        () => mockClient,
      );

      expect(result['success'], isTrue);
    });

    test('returns error on failure', () async {
      final mockClient = MockClient((request) async {
        return http.Response(jsonEncode({'error': 'Image not found'}), 404);
      });

      final result = await http.runWithClient(
        () => ApiService.removeBusinessImage('Shop', 'bad-key'),
        () => mockClient,
      );

      expect(result['success'], isFalse);
      expect(result['error'], 'Image not found');
    });
  });
}
