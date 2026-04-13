import 'package:flutter/material.dart';
import 'screens/splash_screen.dart';

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
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1976D2)),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1976D2),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF1976D2),
            foregroundColor: Colors.white,
          ),
        ),
      ),
      home: const SplashScreen(),
    );
  }
}
