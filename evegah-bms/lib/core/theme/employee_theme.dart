import 'package:flutter/material.dart';

class EmployeeTheme {
  // Brand Colors
  static const Color primaryPurple = Color(0xFF200F54);
  static const Color brandPurple = Color(0xFF4313B8);
  static const Color lightPurple = Color(0xFFF5F3FF);
  static const Color softBlueBackground = Color(0xFFFAFBFE);
  
  // Accents & Badges
  static const Color limeAccent = Color(0xFFCCFF00);
  static const Color limeGreenCircle = Color(0xFFD2FC00);
  static const Color limeCardBg = Color(0xFFF8FDE8);
  static const Color limeCardBorder = Color(0xFFD9F99D);
  
  // Status Colors
  static const Color successGreen = Color(0xFF16A34A);
  static const Color successBg = Color(0xFFDCFCE7);
  static const Color draftBlue = Color(0xFF2563EB);
  static const Color draftBg = Color(0xFFF0F4FF);
  static const Color warningOrange = Color(0xFFEA580C);
  static const Color warningBg = Color(0xFFFFF7ED);

  // Neutral Colors
  static const Color textDark = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color inputBg = Color(0xFFFFFFFF);

  // Gradients
  static const LinearGradient overviewGradient = LinearGradient(
    colors: [Color(0xFFF0F3FF), Color(0xFFF8F6FF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient activeRideGradient = LinearGradient(
    colors: [Color(0xFF1B0C52), Color(0xFF2A1175)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}
