import 'package:flutter/material.dart';
import '../../../../core/theme/employee_theme.dart';

class StepperProgressBar extends StatelessWidget {
  final int currentStep; // 1 to 5

  const StepperProgressBar({
    super.key,
    required this.currentStep,
  });

  @override
  Widget build(BuildContext context) {
    final steps = [
      'Rider Details',
      'Vehicle Details',
      'Plan & Pricing',
      'Payment',
      'Review',
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
      child: Column(
        children: [
          Row(
            children: List.generate(steps.length * 2 - 1, (index) {
              if (index.isOdd) {
                // Divider line between steps
                final stepBefore = (index ~/ 2) + 1;
                final isCompletedLine = stepBefore < currentStep;
                return Expanded(
                  child: Container(
                    height: 2,
                    color: isCompletedLine ? EmployeeTheme.primaryPurple : const Color(0xFFE2E8F0),
                  ),
                );
              }

              // Step Circle
              final stepNumber = (index ~/ 2) + 1;
              final isCurrent = stepNumber == currentStep;
              final isPassed = stepNumber < currentStep;

              return Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isCurrent || isPassed ? EmployeeTheme.primaryPurple : Colors.white,
                  border: Border.all(
                    color: isCurrent || isPassed ? EmployeeTheme.primaryPurple : const Color(0xFFCBD5E1),
                    width: 1.5,
                  ),
                ),
                child: Center(
                  child: Text(
                    '$stepNumber',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isCurrent || isPassed ? Colors.white : const Color(0xFF64748B),
                    ),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 6),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: List.generate(steps.length, (index) {
              final stepNumber = index + 1;
              final isCurrent = stepNumber == currentStep;

              return SizedBox(
                width: 62,
                child: Text(
                  steps[index],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: isCurrent ? FontWeight.bold : FontWeight.w500,
                    color: isCurrent ? EmployeeTheme.primaryPurple : const Color(0xFF64748B),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              );
            }),
          ),
        ],
      ),
    );
  }
}
