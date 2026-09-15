import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:evegah_rider_app/core/constants/app_constants.dart';

class RideService {
  static final RideService _instance = RideService._internal();
  factory RideService() => _instance;
  RideService._internal();

  // --- 1. FETCH RIDE HISTORY ---
  Future<List<Map<String, dynamic>>> fetchRideHistory() async {
    await Future.delayed(const Duration(milliseconds: 350));
    return [
      {
        "rideId": "RIDE-9021",
        "date": "18-06-2026",
        "vehicleId": "EVEGAH_E1",
        "distance": "5.2 km",
        "time": "22 mins",
        "cost": "₹ 45"
      },
      {
        "rideId": "RIDE-8942",
        "date": "15-06-2026",
        "vehicleId": "EVEGAH_E2",
        "distance": "3.1 km",
        "time": "15 mins",
        "cost": "₹ 30"
      },
      {
        "rideId": "RIDE-8711",
        "date": "10-06-2026",
        "vehicleId": "EVEGAH_E3",
        "distance": "8.4 km",
        "time": "40 mins",
        "cost": "₹ 75"
      }
    ];
  }

  // --- 2. POLL LIVE RIDE DETAILS ---
  Future<Map<String, dynamic>> getLiveRideDetails(String vehicleId, int rideBookingId) async {
    await Future.delayed(const Duration(milliseconds: 200));
    return {
      "batteryPercentage": 82,
      "speed": 24,
      "distanceCovered": 1.4,
      "durationMinutes": 6,
      "currentCost": 18.00,
    };
  }

  // --- 3. START RIDE (ONGOING STATUS) ---
  Future<bool> startRide(dynamic reservationId, {String? vehicleNumber}) async {
    final urls = [
      '${AppConstants.apiBaseUrl}/reservations/$reservationId/start',
      if (kDebugMode) ...[
        'http://localhost:5000/api/reservations/$reservationId/start',
        'http://192.168.1.4:5000/api/reservations/$reservationId/start',
      ]
    ];

    for (final url in urls) {
      try {
        final res = await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            if (vehicleNumber != null) 'vehicle_number': vehicleNumber,
          }),
        ).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          debugPrint("Ride $reservationId started successfully on backend");
          return true;
        }
      } catch (e) {
        debugPrint("Start ride network error for $url: $e");
      }
    }
    return true; // Graceful offline/local fallback
  }

  // --- 4. END THE RIDE (COMPLETED STATUS & VEHICLE RELEASE) ---
  Future<bool> endRide(dynamic rideBookingId, double endLat, double endLng) async {
    final urls = [
      '${AppConstants.apiBaseUrl}/reservations/$rideBookingId/return',
      if (kDebugMode) ...[
        'http://localhost:5000/api/reservations/$rideBookingId/return',
        'http://192.168.1.4:5000/api/reservations/$rideBookingId/return',
      ]
    ];

    for (final url in urls) {
      try {
        final res = await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'end_lat': endLat,
            'end_lng': endLng,
          }),
        ).timeout(const Duration(seconds: 4));
        if (res.statusCode == 200) {
          debugPrint("Ride $rideBookingId ended and returned successfully on backend");
          return true;
        }
      } catch (e) {
        debugPrint("End ride network error for $url: $e");
      }
    }
    return true; // Graceful offline/local fallback
  }

  // --- 4. SUBMIT FEEDBACK ---
  Future<bool> submitFeedback({
    required String vehicleId,
    required int rideBookingId,
    required int rating,
    required List<String> issues,
    required String comment,
  }) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return true;
  }
}