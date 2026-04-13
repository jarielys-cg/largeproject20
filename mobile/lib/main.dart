import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

const Color bmCoral = Color(0xFFF26B5B);
const Color bmCoralDark = Color(0xFFD95A4A);
const Color bmDark = Color(0xFF1F1F1F);

void main() {
  runApp(const BizMartApp());
}

class BizMartApp extends StatelessWidget {
  const BizMartApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BizMart',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: bmCoral),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          foregroundColor: bmDark,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: bmCoral,
            foregroundColor: Colors.white,
          ),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
