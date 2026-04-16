import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:bizmart_mobile/screens/login_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  Widget buildApp() => const MaterialApp(home: LoginScreen());

  group('LoginScreen rendering', () {
    testWidgets('shows BizMart title and subtitle', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.text('BizMart'), findsOneWidget);
      expect(find.text('Sign in to continue'), findsOneWidget);
    });

    testWidgets('shows email and password fields', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.byType(TextFormField), findsNWidgets(2));
    });

    testWidgets('shows Login button', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.text('Login'), findsOneWidget);
    });

    testWidgets('shows Forgot Password link', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.text('Forgot Password?'), findsOneWidget);
    });

    testWidgets('shows Sign up link', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.text('Sign up'), findsOneWidget);
    });

    testWidgets('shows store icon', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.byIcon(Icons.store), findsOneWidget);
    });
  });

  group('LoginScreen form validation', () {
    testWidgets('shows error when both fields empty on submit', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.tap(find.text('Login'));
      await tester.pump();
      expect(find.text('Enter your email'), findsOneWidget);
      expect(find.text('Enter your password'), findsOneWidget);
    });

    testWidgets('shows email error only when password is filled', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(1), 'mypassword');
      await tester.tap(find.text('Login'));
      await tester.pump();
      expect(find.text('Enter your email'), findsOneWidget);
      expect(find.text('Enter your password'), findsNothing);
    });

    testWidgets('shows password error only when email is filled', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(0), 'user@example.com');
      await tester.tap(find.text('Login'));
      await tester.pump();
      expect(find.text('Enter your email'), findsNothing);
      expect(find.text('Enter your password'), findsOneWidget);
    });

    testWidgets('no validation errors when both fields filled', (tester) async {
      await tester.pumpWidget(buildApp());
      await tester.enterText(find.byType(TextFormField).at(0), 'user@example.com');
      await tester.enterText(find.byType(TextFormField).at(1), 'password123');
      await tester.pump();
      expect(find.text('Enter your email'), findsNothing);
      expect(find.text('Enter your password'), findsNothing);
    });
  });

  group('LoginScreen password visibility', () {
    testWidgets('password is obscured by default', (tester) async {
      await tester.pumpWidget(buildApp());
      final passwordField = tester.widget<EditableText>(
        find.descendant(
          of: find.byType(TextFormField).at(1),
          matching: find.byType(EditableText),
        ),
      );
      expect(passwordField.obscureText, isTrue);
    });

    testWidgets('password toggle changes visibility icon', (tester) async {
      await tester.pumpWidget(buildApp());
      expect(find.byIcon(Icons.visibility_off), findsOneWidget);
      await tester.tap(find.byIcon(Icons.visibility_off));
      await tester.pump();
      expect(find.byIcon(Icons.visibility), findsOneWidget);
    });
  });
}
