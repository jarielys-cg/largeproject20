import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bizmart_mobile/screens/signup_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  Widget buildApp() => const MaterialApp(home: SignupScreen());

  group('SignupScreen rendering', () {
    testWidgets('shows Create Account title', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.text('Create Account'), findsWidgets);
    });

    testWidgets('shows all required form fields', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.byType(TextFormField), findsNWidgets(6));
    });

    testWidgets('shows business owner toggle', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.text('I am a business owner'), findsOneWidget);
      expect(find.byType(Switch), findsOneWidget);
    });

    testWidgets('business owner toggle is off by default', (tester) async {
      await tester.pumpWidget(buildApp());
      final toggle = tester.widget<Switch>(find.byType(Switch));
      expect(toggle.value, isFalse);
    });
  });

  group('SignupScreen form validation', () {
    testWidgets('shows required errors when all fields empty on submit', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.ensureVisible(find.byType(ElevatedButton));
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(find.text('Required'), findsWidgets);
      expect(find.text('Enter a username'), findsOneWidget);
      expect(find.text('Enter your email'), findsOneWidget);
      expect(find.text('At least 6 characters'), findsOneWidget);
    });

    testWidgets('shows error for invalid email format', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(0), 'John');
      await tester.enterText(find.byType(TextFormField).at(1), 'Doe');
      await tester.enterText(find.byType(TextFormField).at(2), 'johndoe');
      await tester.enterText(find.byType(TextFormField).at(3), 'not-an-email');
      await tester.enterText(find.byType(TextFormField).at(4), 'password123');
      await tester.ensureVisible(find.byType(ElevatedButton));
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(find.text('Enter a valid email address'), findsOneWidget);
    });

    testWidgets('accepts valid email format', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(3), 'user@example.com');
      await tester.ensureVisible(find.byType(ElevatedButton));
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(find.text('Enter a valid email address'), findsNothing);
      expect(find.text('Enter your email'), findsNothing);
    });

    testWidgets('shows error for password shorter than 6 chars', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(4), '123');
      await tester.ensureVisible(find.byType(ElevatedButton));
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(find.text('At least 6 characters'), findsOneWidget);
    });

    testWidgets('no password error when password is 6 or more chars', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(4), 'secure');
      await tester.ensureVisible(find.byType(ElevatedButton));
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      expect(find.text('At least 6 characters'), findsNothing);
    });

    testWidgets('first name and last name show Required when empty', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.ensureVisible(find.byType(ElevatedButton));
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();
      final requiredWidgets = find.text('Required');
      expect(tester.widgetList(requiredWidgets).length, greaterThanOrEqualTo(2));
    });
  });

  group('SignupScreen interactions', () {
    testWidgets('business owner toggle can be turned on', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.tap(find.byType(Switch));
      await tester.pump();
      final toggle = tester.widget<Switch>(find.byType(Switch));
      expect(toggle.value, isTrue);
    });

    testWidgets('business owner toggle can be toggled back off', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.tap(find.byType(Switch));
      await tester.pump();
      await tester.tap(find.byType(Switch));
      await tester.pump();
      final toggle = tester.widget<Switch>(find.byType(Switch));
      expect(toggle.value, isFalse);
    });

    testWidgets('password is obscured by default', (tester) async {
      await tester.pumpWidget(buildApp());
      final passwordField = tester.widget<EditableText>(
        find.descendant(
          of: find.byType(TextFormField).at(4),
          matching: find.byType(EditableText),
        ),
      );
      expect(passwordField.obscureText, isTrue);
    });

    testWidgets('password visibility toggle works', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.byIcon(Icons.visibility_off), findsOneWidget);
      await tester.tap(find.byIcon(Icons.visibility_off));
      await tester.pump();
      expect(find.byIcon(Icons.visibility), findsOneWidget);
    });

    testWidgets('zip code field is optional and accepts numeric input', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(5), '32801');
      await tester.pump();
      expect(find.text('32801'), findsOneWidget);
    });
  });
}
