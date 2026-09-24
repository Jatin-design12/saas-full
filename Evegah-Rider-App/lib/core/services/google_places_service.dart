import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:google_maps_flutter/google_maps_flutter.dart';

class PlacePrediction {
  final String description;
  final String mainText;
  final String secondaryText;
  final String placeId;
  final double? lat;
  final double? lng;

  PlacePrediction({
    required this.description,
    required this.mainText,
    required this.secondaryText,
    required this.placeId,
    this.lat,
    this.lng,
  });
}

class GooglePlacesService {
  static final GooglePlacesService _instance = GooglePlacesService._internal();
  factory GooglePlacesService() => _instance;
  GooglePlacesService._internal();

  // API Key used across app maps
  static const String apiKey = 'AIzaSyC_Pn12n9hRH5jQdxU7hQUOPDy820ehjwo';

  // Local database of known Vadodara & Indian societies/localities for instant autocomplete
  static final List<PlacePrediction> _knownSocieties = [
    PlacePrediction(
      description: "Gotri Main Road, Vadodara, Gujarat",
      mainText: "Gotri",
      secondaryText: "Vadodara, Gujarat",
      placeId: "loc_gotri",
      lat: 22.3168,
      lng: 73.1415,
    ),
    PlacePrediction(
      description: "Alkapuri, Vadodara, Gujarat",
      mainText: "Alkapuri",
      secondaryText: "Vadodara, Gujarat",
      placeId: "loc_alkapuri",
      lat: 22.3100,
      lng: 73.1700,
    ),
    PlacePrediction(
      description: "Manjalpur, Vadodara, Gujarat",
      mainText: "Manjalpur",
      secondaryText: "Vadodara, Gujarat",
      placeId: "loc_manjalpur",
      lat: 22.2684,
      lng: 73.1952,
    ),
    PlacePrediction(
      description: "Akota, Vadodara, Gujarat",
      mainText: "Akota",
      secondaryText: "Vadodara, Gujarat",
      placeId: "loc_akota",
      lat: 22.2900,
      lng: 73.1750,
    ),
    PlacePrediction(
      description: "Vasna Road, Vadodara, Gujarat",
      mainText: "Vasna Road",
      secondaryText: "Vadodara, Gujarat",
      placeId: "loc_vasna",
      lat: 22.2910,
      lng: 73.1610,
    ),
    PlacePrediction(
      description: "Aatapi Wonderland, Ajwa Nimeta Road, Vadodara",
      mainText: "Aatapi Wonderland",
      secondaryText: "Ajwa Road, Vadodara",
      placeId: "loc_aatapi",
      lat: 22.3615,
      lng: 73.3524,
    ),
    PlacePrediction(
      description: "KPGU Campus, Vadodara, Gujarat",
      mainText: "KPGU Campus",
      secondaryText: "Vadodara, Gujarat",
      placeId: "loc_kpgu",
      lat: 22.2510,
      lng: 73.2140,
    ),
  ];
  /// Fetch Autocomplete place predictions given query text (Society Name, Area, Landmark)
  Future<List<PlacePrediction>> searchPlaces(String query) async {
    final cleanQuery = query.trim().toLowerCase();
    if (cleanQuery.isEmpty) return [];

    List<PlacePrediction> results = [];

    // 1. Check local society database first for fast response
    final matchedLocal = _knownSocieties.where((p) {
      return p.description.toLowerCase().contains(cleanQuery) ||
          p.mainText.toLowerCase().contains(cleanQuery) ||
          p.secondaryText.toLowerCase().contains(cleanQuery);
    }).toList();

    results.addAll(matchedLocal);

    // 2. Query Google Maps Places / Geocoding API online
    try {
      final String url =
          'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${Uri.encodeComponent(query)}&components=country:in&key=$apiKey';
      final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status'] == 'OK' && data['predictions'] != null) {
          final List predictions = data['predictions'];
          for (var item in predictions) {
            final pId = item['place_id'] ?? '';
            final desc = item['description'] ?? '';
            final structured = item['structured_formatting'] ?? {};
            final mainT = structured['main_text'] ?? desc.split(',').first;
            final secT = structured['secondary_text'] ?? '';

            // Avoid duplicate ids
            if (!results.any((r) => r.placeId == pId)) {
              results.add(
                PlacePrediction(
                  description: desc,
                  mainText: mainT,
                  secondaryText: secT,
                  placeId: pId,
                ),
              );
            }
          }
        }
      }
    } catch (e) {
      debugPrint("Places API search error: $e");
    }

    // 3. Fallback to Google Geocoding API if no predictions found
    if (results.isEmpty) {
      try {
        final String geoUrl =
            'https://maps.googleapis.com/maps/api/geocode/json?address=${Uri.encodeComponent(query)}&key=$apiKey';
        final geoRes = await http.get(Uri.parse(geoUrl)).timeout(const Duration(seconds: 3));
        if (geoRes.statusCode == 200) {
          final geoData = json.decode(geoRes.body);
          if (geoData['status'] == 'OK' && geoData['results'] != null) {
            for (var res in geoData['results']) {
              final formatted = res['formatted_address'] as String;
              final loc = res['geometry']['location'];
              final lat = (loc['lat'] as num).toDouble();
              final lng = (loc['lng'] as num).toDouble();
              results.add(
                PlacePrediction(
                  description: formatted,
                  mainText: formatted.split(',').first,
                  secondaryText: formatted.split(',').skip(1).take(2).join(','),
                  placeId: res['place_id'] ?? 'geo_${lat}_$lng',
                  lat: lat,
                  lng: lng,
                ),
              );
            }
          }
        }
      } catch (ge) {
        debugPrint("Geocode fallback error: $ge");
      }
    }

    return results;
  }

  /// Get LatLng coordinates for a Place ID or Place Prediction
  Future<LatLng?> getCoordinatesForPlace(PlacePrediction prediction) async {
    if (prediction.lat != null && prediction.lng != null) {
      return LatLng(prediction.lat!, prediction.lng!);
    }

    try {
      if (prediction.placeId.startsWith('loc_')) {
        final found = _knownSocieties.firstWhere(
          (p) => p.placeId == prediction.placeId,
          orElse: () => _knownSocieties.first,
        );
        return LatLng(found.lat ?? 22.3072, found.lng ?? 73.1812);
      }

      // Call Place Details API
      final url =
          'https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.placeId}&fields=geometry&key=$apiKey';
      final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'OK' && data['result']?['geometry']?['location'] != null) {
          final loc = data['result']['geometry']['location'];
          return LatLng((loc['lat'] as num).toDouble(), (loc['lng'] as num).toDouble());
        }
      }
    } catch (e) {
      debugPrint("Place details error: $e");
    }
    return null;
  }

  /// Get LatLng coordinates for a text address
  Future<LatLng?> getCoordinatesForAddress(String address) async {
    try {
      final url = 'https://maps.googleapis.com/maps/api/geocode/json?address=${Uri.encodeComponent(address)}&key=$apiKey';
      final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'OK' && data['results'] != null && data['results'].isNotEmpty) {
          final loc = data['results'][0]['geometry']['location'];
          return LatLng((loc['lat'] as num).toDouble(), (loc['lng'] as num).toDouble());
        }
      }
    } catch (e) {
      debugPrint("Address geocode error: $e");
    }
    return null;
  }

  /// Reverse Geocode coordinates to full Google Maps formatted address
  Future<String?> reverseGeocode(double lat, double lng) async {
    try {
      final url =
          'https://maps.googleapis.com/maps/api/geocode/json?latlng=$lat,$lng&key=$apiKey';
      final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 3));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'OK' && data['results'] != null && data['results'].isNotEmpty) {
          return data['results'][0]['formatted_address'] as String;
        }
      }
    } catch (e) {
      debugPrint("Reverse geocode error: $e");
    }
    return null;
  }

  /// Fetch driving road distances from origin to multiple destination LatLngs via Google Maps Distance Matrix API
  Future<List<Map<String, dynamic>>?> getBatchRoadDistances({
    required double originLat,
    required double originLng,
    required List<LatLng> destinations,
  }) async {
    if (destinations.isEmpty) return null;

    try {
      final destsParam = destinations
          .map((d) => '${d.latitude},${d.longitude}')
          .join('|');
      final url =
          'https://maps.googleapis.com/maps/api/distancematrix/json?origins=$originLat,$originLng&destinations=$destsParam&mode=driving&key=$apiKey';

      final res = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
      if (res.statusCode == 200) {
        final data = json.decode(res.body);
        if (data['status'] == 'OK' &&
            data['rows'] != null &&
            (data['rows'] as List).isNotEmpty) {
          final elements = data['rows'][0]['elements'] as List?;
          if (elements != null) {
            List<Map<String, dynamic>> results = [];
            for (var elem in elements) {
              if (elem['status'] == 'OK' && elem['distance'] != null) {
                final text = elem['distance']['text'] ?? '';
                final valueMeters = (elem['distance']['value'] as num).toDouble();
                final durationText = elem['duration']?['text'] ?? '';
                results.add({
                  'distanceText': text.contains('km') || text.contains('m') ? '$text away' : '$text km away',
                  'distanceMeters': valueMeters,
                  'distanceKm': valueMeters / 1000.0,
                  'durationText': durationText,
                });
              } else {
                results.add({});
              }
            }
            return results;
          }
        }
      }
    } catch (e) {
      debugPrint("Distance Matrix API error: $e");
    }
    return null;
  }
}
