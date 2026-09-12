import 'package:flutter/material.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'ride_detail_screen.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../support/presentation/screens/help_screen.dart';

class RideHistoryScreen extends StatefulWidget {
  const RideHistoryScreen({super.key});

  @override
  State<RideHistoryScreen> createState() => _RideHistoryScreenState();
}

class _RideHistoryScreenState extends State<RideHistoryScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _reservations = [];
  bool _isLoading = true;

  // Search & Filter state
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  int _selectedFilterPillIndex = 0; // 0: All, 1: Ongoing, 2: Upcoming, 3: Completed, 4: Cancelled

  // Modal filter options
  String _filterDateRange = 'All Time'; // 'Today', 'This Week', 'This Month', 'Custom', 'All Time'
  DateTimeRange? _customDateRange;
  String _filterVehicleType = 'All'; // 'All', 'Evegah City', 'Evegah Mink'
  String _filterPaymentStatus = 'All'; // 'All', 'Paid', 'Pending', 'Failed', 'Refunded'
  String _filterSortBy = 'Newest'; // 'Newest', 'Oldest', 'Nearest Start', 'Vehicle Number'

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _tabController.addListener(() {
      if (_tabController.indexIsChanging || _tabController.index != _selectedFilterPillIndex) {
        setState(() {
          _selectedFilterPillIndex = _tabController.index;
        });
      }
    });
    _fetchReservations();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchReservations() async {
    setState(() {
      _isLoading = true;
    });

    final mobile = await SessionService().getUserMobile() ?? "+91 98765 43210";
    final urls = [
      '${AppConstants.apiBaseUrl}/reservations?limit=100&search=${Uri.encodeComponent(mobile)}',
      'http://192.168.1.4:5000/api/reservations?limit=100&search=${Uri.encodeComponent(mobile)}',
      'http://localhost:5000/api/reservations?limit=100&search=${Uri.encodeComponent(mobile)}',
    ];

    for (final url in urls) {
      try {
        final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 4));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'success' && data['data'] != null) {
            if (mounted) {
              setState(() {
                _reservations = data['data'];
                _isLoading = false;
              });
            }
            return;
          }
        }
      } catch (e) {
        debugPrint("Failed to fetch reservations from $url: $e");
      }
    }

    if (mounted) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // --- PARSE ANY DATETIME ROBUSTLY ---
  DateTime? _parseAnyDateTime(dynamic input) {
    if (input == null) return null;
    final str = input.toString().trim();
    if (str.isEmpty || str.toLowerCase().contains("select")) return null;

    final parsedIso = DateTime.tryParse(str);
    if (parsedIso != null) return parsedIso;

    try {
      final clean = str.replaceAll(RegExp(r'^[A-Za-z]+,\s*'), '').replaceAll(',', ' ').trim();
      final tokens = clean.split(RegExp(r'\s+'));
      const months = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
      };

      int? day, month, year, hour = 0, minute = 0;
      String? amPm;

      for (int i = 0; i < tokens.length; i++) {
        final t = tokens[i].toLowerCase();
        if (months.containsKey(t)) {
          month = months[t];
          if (i > 0 && day == null) {
            day = int.tryParse(tokens[i - 1]);
          }
        } else if (t == 'am' || t == 'pm') {
          amPm = t;
        } else if (t.contains(':')) {
          final parts = t.split(':');
          hour = int.tryParse(parts[0]) ?? 0;
          if (parts.length > 1) minute = int.tryParse(parts[1]) ?? 0;
        } else if (int.tryParse(t) != null) {
          final val = int.parse(t);
          if (val > 2000 && val < 2100) {
            year = val;
          } else if (day == null && val >= 1 && val <= 31) {
            day = val;
          }
        }
      }

      if (amPm == 'pm' && hour != null && hour < 12) hour += 12;
      if (amPm == 'am' && hour != null && hour == 12) hour = 0;

      final now = DateTime.now();
      year ??= now.year;
      month ??= now.month;
      day ??= now.day;

      return DateTime(year, month, day, hour ?? 0, minute ?? 0);
    } catch (_) {
      return null;
    }
  }

  DateTime? _getBookingDateTime(dynamic r) {
    if (r == null) return null;
    if (r['pickup_datetime'] != null && r['pickup_datetime'].toString().trim().isNotEmpty) {
      final dt = _parseAnyDateTime(r['pickup_datetime']);
      if (dt != null) return dt;
    }

    final dateStr = r['reservation_date'];
    final timeStr = r['reservation_time'];
    if (dateStr != null && dateStr.toString().trim().isNotEmpty) {
      DateTime? baseDate = DateTime.tryParse(dateStr.toString().split('T').first);
      if (baseDate != null) {
        if (timeStr != null && timeStr.toString().trim().isNotEmpty && timeStr.toString().trim() != '00:00:00') {
          final rawTime = timeStr.toString().trim();
          final regex12 = RegExp(r'^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$', caseSensitive: false);
          final match = regex12.firstMatch(rawTime);
          if (match != null) {
            int hour = int.parse(match.group(1)!);
            int minute = int.parse(match.group(2)!);
            String? period = match.group(3)?.toUpperCase();
            if (period == "PM" && hour < 12) hour += 12;
            if (period == "AM" && hour == 12) hour = 0;
            return DateTime(baseDate.year, baseDate.month, baseDate.day, hour, minute);
          }
          final parts = rawTime.split(':');
          if (parts.length >= 2) {
            int hour = int.tryParse(parts[0]) ?? 0;
            int minute = int.tryParse(parts[1].substring(0, 2)) ?? 0;
            return DateTime(baseDate.year, baseDate.month, baseDate.day, hour, minute);
          }
        }
        if (r['created_at'] != null) {
          final cDt = DateTime.tryParse(r['created_at'].toString());
          if (cDt != null) {
            return DateTime(baseDate.year, baseDate.month, baseDate.day, cDt.hour, cDt.minute);
          }
        }
        return baseDate;
      }
    }

    if (r['created_at'] != null) {
      return DateTime.tryParse(r['created_at'].toString());
    }
    return null;
  }

  DateTime? _getReturnDateTime(dynamic r, DateTime? start) {
    if (r == null) return null;
    if (r['drop_datetime'] != null && r['drop_datetime'].toString().trim().isNotEmpty) {
      final dt = _parseAnyDateTime(r['drop_datetime']);
      if (dt != null) return dt;
    }
    if (r['drop_date'] != null && r['drop_date'].toString().trim().isNotEmpty) {
      final dt = _parseAnyDateTime(r['drop_date']);
      if (dt != null) return dt;
    }
    if (start != null) {
      final pkg = (r['package_type'] ?? '').toString().toLowerCase();
      if (pkg.contains('month')) return start.add(const Duration(days: 30));
      if (pkg.contains('week')) return start.add(const Duration(days: 7));
      return start.add(const Duration(days: 1));
    }
    return null;
  }

  String _formatDateTimeShort(DateTime? dt) {
    if (dt == null) return '';
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    final hourInt = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final ampm = dt.hour >= 12 ? "PM" : "AM";
    final minStr = dt.minute.toString().padLeft(2, '0');
    final hrStr = hourInt.toString().padLeft(2, '0');
    return "${dt.day} ${months[dt.month - 1]} ${dt.year}, $hrStr:$minStr $ampm";
  }

  String _formatStartEndDateTime(dynamic r) {
    final start = _getBookingDateTime(r);
    final end = _getReturnDateTime(r, start);
    if (start != null && end != null) {
      return "${_formatDateTimeShort(start)}  →  ${_formatDateTimeShort(end)}";
    } else if (start != null) {
      return _formatDateTimeShort(start);
    }
    return r['reservation_date']?.toString().split('T').first ?? '—';
  }

  String _getTotalPriceString(dynamic r) {
    final double totalAmount = double.tryParse("${r['total_amount'] ?? r['total_payable'] ?? 0}") ?? 0.0;
    final double fare = double.tryParse("${r['fare'] ?? r['rent'] ?? 0}") ?? 0.0;
    final double deposit = double.tryParse("${r['deposit'] ?? 0}") ?? 0.0;

    double finalVal = totalAmount > 0 ? totalAmount : (fare + deposit);
    if (finalVal <= 0) finalVal = fare;
    return "₹${finalVal.toStringAsFixed(0)}";
  }

  String _getVehicleModelName(dynamic r) {
    final model = (r['vehicle_model'] ?? r['vehicle_category'] ?? '').toString().trim();
    if (model.isNotEmpty &&
        model.toLowerCase() != 'e-scooter' &&
        model.toLowerCase() != 'evegah pro') {
      return model;
    }
    final vNum = (r['vehicle_number'] ?? '').toString().toLowerCase();
    if (vNum.contains('mink')) return "Evegah Mink";
    return "Evegah City";
  }

  String _getVehicleImagePath(String modelName) {
    final name = modelName.toLowerCase();
    if (name.contains('mink')) return "assets/mink.png";
    return "assets/city.png";
  }

  String _normalizeStatus(dynamic r) {
    final stat = (r['status'] ?? '').toString().trim().toLowerCase();
    final now = DateTime.now();
    final start = _getBookingDateTime(r);
    final end = _getReturnDateTime(r, start);

    if (stat == 'cancelled' || stat == 'expired') return 'Cancelled';
    if (stat == 'completed' || stat == 'done') return 'Completed';
    if (end != null && now.isAfter(end) && stat != 'confirmed' && stat != 'active' && stat != 'ongoing') return 'Cancelled';

    // Any active or ongoing ride status
    if (stat == 'ongoing' || stat == 'active' || stat == 'active ride' || stat == 'started' || stat == 'in progress' || stat == 'in_progress') {
      return 'Ongoing';
    }

    // If ride is confirmed and vehicle has been assigned by operator / system, or if booking start time has arrived
    final rawPlate = r['vehicle_number'];
    final bool hasAssignedVehicle = rawPlate != null &&
        rawPlate.toString().trim().isNotEmpty &&
        !rawPlate.toString().contains('GJ-06-EV-1024') &&
        !rawPlate.toString().toLowerCase().contains('pending');

    if (stat == 'confirmed') {
      if (hasAssignedVehicle || (start != null && now.isAfter(start))) {
        return 'Ongoing';
      }
    }

    if (stat == 'upcoming' || stat == 'pending' || stat == 'confirmed') {
      return 'Upcoming';
    }
    return 'Upcoming';
  }

  List<dynamic> _getFilteredReservations() {
    List<dynamic> list = List.from(_reservations);

    // 1. Search Query
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.toLowerCase().trim();
      list = list.where((r) {
        final vModel = _getVehicleModelName(r).toLowerCase();
        final resId = (r['reservation_id'] ?? '').toString().toLowerCase();
        final zone = (r['pickup_zone'] ?? '').toString().toLowerCase();
        final vNum = (r['vehicle_number'] ?? '').toString().toLowerCase();
        return vModel.contains(q) || resId.contains(q) || zone.contains(q) || vNum.contains(q);
      }).toList();
    }

    // 2. Status Pill
    if (_selectedFilterPillIndex == 1) {
      list = list.where((r) => _normalizeStatus(r) == 'Ongoing').toList();
    } else if (_selectedFilterPillIndex == 2) {
      list = list.where((r) => _normalizeStatus(r) == 'Upcoming').toList();
    } else if (_selectedFilterPillIndex == 3) {
      list = list.where((r) => _normalizeStatus(r) == 'Completed').toList();
    } else if (_selectedFilterPillIndex == 4) {
      list = list.where((r) => _normalizeStatus(r) == 'Cancelled').toList();
    }

    // 3. Vehicle Type Filter
    if (_filterVehicleType != 'All') {
      list = list.where((r) {
        final name = _getVehicleModelName(r).toLowerCase();
        return name.contains(_filterVehicleType.toLowerCase());
      }).toList();
    }

    // 4. Payment Status Filter
    if (_filterPaymentStatus != 'All') {
      list = list.where((r) {
        final p = (r['payment_status'] ?? '').toString().toLowerCase();
        return p == _filterPaymentStatus.toLowerCase();
      }).toList();
    }

    // 5. Date Range Filter
    if (_filterDateRange == 'Custom' && _customDateRange != null) {
      list = list.where((r) {
        final dt = _getBookingDateTime(r);
        if (dt == null) return false;
        return dt.isAfter(_customDateRange!.start.subtract(const Duration(days: 1))) &&
               dt.isBefore(_customDateRange!.end.add(const Duration(days: 1)));
      }).toList();
    } else if (_filterDateRange != 'All Time') {
      final now = DateTime.now();
      list = list.where((r) {
        final dt = _getBookingDateTime(r);
        if (dt == null) return true;
        if (_filterDateRange == 'Today') {
          return dt.year == now.year && dt.month == now.month && dt.day == now.day;
        } else if (_filterDateRange == 'This Week') {
          return now.difference(dt).inDays.abs() <= 7;
        } else if (_filterDateRange == 'This Month') {
          return dt.year == now.year && dt.month == now.month;
        }
        return true;
      }).toList();
    }

    // 6. Sorting
    if (_filterSortBy == 'Oldest') {
      list.sort((a, b) {
        final dtA = _getBookingDateTime(a) ?? DateTime(2000);
        final dtB = _getBookingDateTime(b) ?? DateTime(2000);
        return dtA.compareTo(dtB);
      });
    } else if (_filterSortBy == 'Nearest Start') {
      list.sort((a, b) {
        final dtA = _getBookingDateTime(a) ?? DateTime(2099);
        final dtB = _getBookingDateTime(b) ?? DateTime(2099);
        return dtA.compareTo(dtB);
      });
    } else if (_filterSortBy == 'Vehicle Number') {
      list.sort((a, b) {
        final nA = (a['vehicle_number'] ?? '').toString();
        final nB = (b['vehicle_number'] ?? '').toString();
        return nA.compareTo(nB);
      });
    } else {
      list.sort((a, b) {
        final dtA = _getBookingDateTime(a) ?? DateTime(2000);
        final dtB = _getBookingDateTime(b) ?? DateTime(2000);
        return dtB.compareTo(dtA);
      });
    }

    return list;
  }

  Map<String, int> _getStatusCounts() {
    int total = _reservations.length;
    int ongoing = 0;
    int upcoming = 0;
    int completed = 0;
    int cancelled = 0;

    for (final r in _reservations) {
      final s = _normalizeStatus(r);
      if (s == 'Ongoing') {
        ongoing++;
      } else if (s == 'Upcoming') {
        upcoming++;
      } else if (s == 'Completed') {
        completed++;
      } else if (s == 'Cancelled') {
        cancelled++;
      }
    }

    return {
      'All': total,
      'Ongoing': ongoing,
      'Upcoming': upcoming,
      'Completed': completed,
      'Cancelled': cancelled,
    };
  }

  void _navigateToDetails(dynamic r) {
    final status = _normalizeStatus(r);
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RideDetailScreen(
          booking: Map<String, dynamic>.from(r),
          status: status,
        ),
      ),
    );
  }

  // --- FILTER MODAL WITH CUSTOM DATE RANGE ---
  void _showFilterModal() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Container(
              height: MediaQuery.of(context).size.height * 0.88,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                children: [
                  // Modal Header
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                    decoration: const BoxDecoration(
                      border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9))),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Text(
                              "Filter Bookings",
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0F172A),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: const Color(0xFFEEF2FF),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                "${_getFilteredReservations().length}",
                                style: const TextStyle(
                                  color: Color(0xFF4313B8),
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            TextButton(
                              onPressed: () {
                                setModalState(() {
                                  _filterDateRange = 'All Time';
                                  _customDateRange = null;
                                  _filterVehicleType = 'All';
                                  _filterPaymentStatus = 'All';
                                  _filterSortBy = 'Newest';
                                });
                                setState(() {});
                              },
                              child: const Text(
                                "Clear All",
                                style: TextStyle(
                                  color: Color(0xFF64748B),
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            IconButton(
                              onPressed: () => Navigator.pop(context),
                              icon: const Icon(Icons.close, color: Color(0xFF64748B), size: 22),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Modal Body
                  Expanded(
                    child: ListView(
                      padding: const EdgeInsets.all(20),
                      children: [
                        // 1. Date Range
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.calendar_today_outlined, size: 16, color: Color(0xFF2B0B78)),
                                SizedBox(width: 8),
                                Text("Date Range", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                              ],
                            ),
                            if (_customDateRange != null)
                              Text(
                                "${_customDateRange!.start.day}/${_customDateRange!.start.month} - ${_customDateRange!.end.day}/${_customDateRange!.end.month}",
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF4313B8)),
                              ),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: ['Today', 'This Week', 'This Month', 'Custom', 'All Time'].map((label) {
                            final isSel = _filterDateRange == label;
                            return ChoiceChip(
                              label: Text(label),
                              selected: isSel,
                              selectedColor: const Color(0xFF2B0B78),
                              backgroundColor: const Color(0xFFF8FAFC),
                              labelStyle: TextStyle(
                                color: isSel ? Colors.white : const Color(0xFF475569),
                                fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                fontSize: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                                side: BorderSide(
                                  color: isSel ? const Color(0xFF2B0B78) : const Color(0xFFE2E8F0),
                                ),
                              ),
                              onSelected: (val) async {
                                if (label == 'Custom') {
                                  final picked = await showDateRangePicker(
                                    context: context,
                                    firstDate: DateTime(2024),
                                    lastDate: DateTime(2028),
                                    initialDateRange: _customDateRange ?? DateTimeRange(
                                      start: DateTime.now().subtract(const Duration(days: 7)),
                                      end: DateTime.now().add(const Duration(days: 7)),
                                    ),
                                    builder: (context, child) {
                                      return Theme(
                                        data: ThemeData.light().copyWith(
                                          scaffoldBackgroundColor: Colors.white,
                                          colorScheme: const ColorScheme.light(
                                            primary: Color(0xFF2B0B78),
                                            onPrimary: Colors.white,
                                            surface: Colors.white,
                                            onSurface: Color(0xFF0F172A),
                                            secondaryContainer: Color(0xFFEDE9FE),
                                            onSecondaryContainer: Color(0xFF2B0B78),
                                          ),
                                          datePickerTheme: DatePickerThemeData(
                                            backgroundColor: Colors.white,
                                            headerBackgroundColor: Colors.white,
                                            headerForegroundColor: const Color(0xFF0F172A),
                                            headerHeadlineStyle: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w800,
                                              color: Color(0xFF0F172A),
                                            ),
                                            surfaceTintColor: Colors.transparent,
                                            rangeSelectionBackgroundColor: const Color(0xFFEDE9FE),
                                            rangeSelectionOverlayColor: WidgetStateProperty.all(const Color(0xFFEDE9FE)),
                                            rangePickerHeaderBackgroundColor: Colors.white,
                                            rangePickerHeaderForegroundColor: const Color(0xFF0F172A),
                                            rangePickerHeaderHeadlineStyle: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w800,
                                              color: Color(0xFF0F172A),
                                            ),
                                            todayBorder: const BorderSide(color: Color(0xFF2B0B78), width: 1.5),
                                            todayForegroundColor: WidgetStateProperty.all(const Color(0xFF2B0B78)),
                                            dayForegroundColor: WidgetStateProperty.resolveWith((states) {
                                              if (states.contains(WidgetState.selected)) {
                                                return Colors.white;
                                              }
                                              return const Color(0xFF0F172A);
                                            }),
                                            dayBackgroundColor: WidgetStateProperty.resolveWith((states) {
                                              if (states.contains(WidgetState.selected)) {
                                                return const Color(0xFF2B0B78);
                                              }
                                              return null;
                                            }),
                                          ),
                                        ),
                                        child: child!,
                                      );
                                    },
                                  );
                                  if (picked != null) {
                                    setModalState(() {
                                      _filterDateRange = 'Custom';
                                      _customDateRange = picked;
                                    });
                                    setState(() {});
                                  }
                                } else {
                                  setModalState(() {
                                    _filterDateRange = label;
                                    _customDateRange = null;
                                  });
                                  setState(() {});
                                }
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),

                        // 2. Booking Status
                        Row(
                          children: const [
                            Icon(Icons.two_wheeler_outlined, size: 16, color: Color(0xFF2B0B78)),
                            SizedBox(width: 8),
                            Text("Booking Status", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            {'id': 0, 'label': 'All', 'color': Colors.transparent},
                            {'id': 1, 'label': 'Ongoing', 'color': Color(0xFF22C55E)},
                            {'id': 2, 'label': 'Upcoming', 'color': Color(0xFF6366F1)},
                            {'id': 3, 'label': 'Completed', 'color': Color(0xFF94A3B8)},
                            {'id': 4, 'label': 'Cancelled', 'color': Color(0xFFEF4444)},
                          ].map((item) {
                            final isSel = _selectedFilterPillIndex == item['id'];
                            final dotClr = item['color'] as Color;
                            return ChoiceChip(
                              label: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (dotClr != Colors.transparent) ...[
                                    Container(width: 6, height: 6, decoration: BoxDecoration(color: dotClr, shape: BoxShape.circle)),
                                    const SizedBox(width: 6),
                                  ],
                                  Text(item['label'] as String),
                                ],
                              ),
                              selected: isSel,
                              selectedColor: const Color(0xFF2B0B78),
                              backgroundColor: const Color(0xFFF8FAFC),
                              labelStyle: TextStyle(
                                color: isSel ? Colors.white : const Color(0xFF475569),
                                fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                fontSize: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                                side: BorderSide(
                                  color: isSel ? const Color(0xFF2B0B78) : const Color(0xFFE2E8F0),
                                ),
                              ),
                              onSelected: (val) {
                                setModalState(() => _selectedFilterPillIndex = item['id'] as int);
                                _tabController.animateTo(item['id'] as int);
                                setState(() {});
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),

                        // 3. Vehicle Type
                        Row(
                          children: const [
                            Icon(Icons.electric_scooter_outlined, size: 16, color: Color(0xFF2B0B78)),
                            SizedBox(width: 8),
                            Text("Vehicle Type", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: ['All', 'Evegah City', 'Evegah Mink'].map((label) {
                            final isSel = _filterVehicleType == label;
                            return ChoiceChip(
                              label: Text(label),
                              selected: isSel,
                              selectedColor: const Color(0xFF2B0B78),
                              backgroundColor: const Color(0xFFF8FAFC),
                              labelStyle: TextStyle(
                                color: isSel ? Colors.white : const Color(0xFF475569),
                                fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                fontSize: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                                side: BorderSide(
                                  color: isSel ? const Color(0xFF2B0B78) : const Color(0xFFE2E8F0),
                                ),
                              ),
                              onSelected: (val) {
                                setModalState(() => _filterVehicleType = label);
                                setState(() {});
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),

                        // 4. Payment Status
                        Row(
                          children: const [
                            Icon(Icons.payment_outlined, size: 16, color: Color(0xFF2B0B78)),
                            SizedBox(width: 8),
                            Text("Payment Status", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: [
                            {'label': 'All', 'color': Colors.transparent},
                            {'label': 'Paid', 'color': Color(0xFF22C55E)},
                            {'label': 'Pending', 'color': Color(0xFFF59E0B)},
                            {'label': 'Failed', 'color': Color(0xFFEF4444)},
                            {'label': 'Refunded', 'color': Color(0xFF64748B)},
                          ].map((item) {
                            final label = item['label'] as String;
                            final dotClr = item['color'] as Color;
                            final isSel = _filterPaymentStatus == label;
                            return ChoiceChip(
                              label: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  if (dotClr != Colors.transparent) ...[
                                    Container(width: 6, height: 6, decoration: BoxDecoration(color: dotClr, shape: BoxShape.circle)),
                                    const SizedBox(width: 6),
                                  ],
                                  Text(label),
                                ],
                              ),
                              selected: isSel,
                              selectedColor: const Color(0xFF2B0B78),
                              backgroundColor: const Color(0xFFF8FAFC),
                              labelStyle: TextStyle(
                                color: isSel ? Colors.white : const Color(0xFF475569),
                                fontWeight: isSel ? FontWeight.bold : FontWeight.w500,
                                fontSize: 12,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                                side: BorderSide(
                                  color: isSel ? const Color(0xFF2B0B78) : const Color(0xFFE2E8F0),
                                ),
                              ),
                              onSelected: (val) {
                                setModalState(() => _filterPaymentStatus = label);
                                setState(() {});
                              },
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 24),

                        // 5. Sort By
                        Row(
                          children: const [
                            Icon(Icons.sort_rounded, size: 16, color: Color(0xFF2B0B78)),
                            SizedBox(width: 8),
                            Text("Sort By", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
                          ],
                        ),
                        const SizedBox(height: 10),
                        Column(
                          children: [
                            _buildSortRadioTile("Booking Date (Newest)", 'Newest', setModalState),
                            _buildSortRadioTile("Booking Date (Oldest)", 'Oldest', setModalState),
                            _buildSortRadioTile("Start Date (Nearest)", 'Nearest Start', setModalState),
                            _buildSortRadioTile("Vehicle Number (A-Z)", 'Vehicle Number', setModalState),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Apply Button
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () {
                          Navigator.pop(context);
                          setState(() {});
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF2B0B78),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          elevation: 0,
                        ),
                        child: Text(
                          "Apply Filters (${_getFilteredReservations().length})",
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildSortRadioTile(String title, String value, StateSetter setModalState) {
    final bool isSelected = _filterSortBy == value;
    return InkWell(
      onTap: () {
        setModalState(() => _filterSortBy = value);
        setState(() {});
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 8),
        child: Row(
          children: [
            Container(
              width: 18,
              height: 18,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? const Color(0xFF2B0B78) : const Color(0xFFCBD5E1),
                  width: 2,
                ),
              ),
              child: isSelected
                  ? Center(
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFF2B0B78),
                        ),
                      ),
                    )
                  : null,
            ),
            const SizedBox(width: 10),
            Text(
              title,
              style: TextStyle(
                fontSize: 13,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? const Color(0xFF0F172A) : const Color(0xFF475569),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = _getFilteredReservations();
    final statusCounts = _getStatusCounts();
    final bool hasActiveFilters = _filterDateRange != 'All Time' || _filterVehicleType != 'All' || _filterPaymentStatus != 'All';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(74),
        child: Container(
          color: Colors.white,
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top + 8,
            left: 20,
            right: 20,
            bottom: 12,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Text(
                    "My Bookings",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.5,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    "Manage and track all your rides",
                    style: TextStyle(
                      fontSize: 12,
                      color: Color(0xFF64748B),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.refresh_rounded, size: 18, color: Color(0xFF334155)),
                      onPressed: _fetchReservations,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Stack(
                    children: [
                      Container(
                        width: 38,
                        height: 38,
                        decoration: BoxDecoration(
                          color: hasActiveFilters ? const Color(0xFFEEF2FF) : Colors.white,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: hasActiveFilters ? const Color(0xFF4313B8) : const Color(0xFFE2E8F0)),
                        ),
                        child: IconButton(
                          icon: Icon(
                            Icons.tune_rounded,
                            size: 18,
                            color: hasActiveFilters ? const Color(0xFF4313B8) : const Color(0xFF334155),
                          ),
                          onPressed: _showFilterModal,
                        ),
                      ),
                      if (hasActiveFilters)
                        Positioned(
                          right: 4,
                          top: 4,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Color(0xFF4313B8),
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          // 1. Top Status Horizontal Pill Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildStatusPill(0, "All", statusCounts['All'] ?? 0),
                  const SizedBox(width: 8),
                  _buildStatusPill(1, "Ongoing", statusCounts['Ongoing'] ?? 0),
                  const SizedBox(width: 8),
                  _buildStatusPill(2, "Upcoming", statusCounts['Upcoming'] ?? 0),
                  const SizedBox(width: 8),
                  _buildStatusPill(3, "Completed", statusCounts['Completed'] ?? 0),
                  const SizedBox(width: 8),
                  _buildStatusPill(4, "Cancelled", statusCounts['Cancelled'] ?? 0),
                ],
              ),
            ),
          ),

          // 2. Search Box with filter toggle
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                      style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A)),
                      decoration: InputDecoration(
                        hintText: "Search by vehicle, booking ID or zone...",
                        hintStyle: const TextStyle(fontSize: 12, color: Color(0xFF94A3B8)),
                        prefixIcon: const Icon(Icons.search_rounded, size: 18, color: Color(0xFF94A3B8)),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, size: 16, color: Color(0xFF94A3B8)),
                                onPressed: () {
                                  _searchController.clear();
                                  setState(() => _searchQuery = '');
                                },
                              )
                            : null,
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  onTap: _showFilterModal,
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: const Icon(Icons.filter_list_rounded, size: 20, color: Color(0xFF334155)),
                  ),
                ),
              ],
            ),
          ),

          // 3. Quick Filter Chips Bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.only(left: 16, right: 16, bottom: 12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterDropdownChip("Date", _filterDateRange != 'All Time' ? _filterDateRange : null, _showFilterModal),
                  const SizedBox(width: 8),
                  _buildFilterDropdownChip("Vehicle", _filterVehicleType != 'All' ? _filterVehicleType : null, _showFilterModal),
                  const SizedBox(width: 8),
                  _buildFilterDropdownChip("Payment", _filterPaymentStatus != 'All' ? _filterPaymentStatus : null, _showFilterModal),
                  const SizedBox(width: 8),
                  _buildFilterDropdownChip("More Filters", null, _showFilterModal, isAction: true),
                ],
              ),
            ),
          ),

          const Divider(height: 1, color: Color(0xFFE2E8F0)),

          // 4. Bookings List (Clean, Expandable, matching target UI)
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: Color(0xFF2B0B78)))
                : filteredList.isEmpty
                    ? _buildEmptyState()
                    : RefreshIndicator(
                        onRefresh: _fetchReservations,
                        color: const Color(0xFF2B0B78),
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: filteredList.length + 1,
                          itemBuilder: (context, index) {
                            if (index == filteredList.length) {
                              return Padding(
                                padding: const EdgeInsets.only(top: 8, bottom: 24),
                                child: _buildSupportCard(),
                              );
                            }
                            final r = filteredList[index];
                            return Padding(
                              padding: const EdgeInsets.only(bottom: 14),
                              child: _buildRiderBookingCard(r),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusPill(int index, String label, int count) {
    final bool isSelected = _selectedFilterPillIndex == index;
    return InkWell(
      onTap: () {
        setState(() {
          _selectedFilterPillIndex = index;
        });
        _tabController.animateTo(index);
      },
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF2B0B78) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF2B0B78) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                color: isSelected ? Colors.white : const Color(0xFF475569),
              ),
            ),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: isSelected ? Colors.white.withValues(alpha: 0.2) : const Color(0xFFF1F5F9),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                "$count",
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? Colors.white : const Color(0xFF64748B),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterDropdownChip(String title, String? activeVal, VoidCallback onTap, {bool isAction = false}) {
    final bool isActive = activeVal != null;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFFEEF2FF) : Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isActive ? const Color(0xFF4313B8) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              activeVal ?? title,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                color: isActive ? const Color(0xFF4313B8) : const Color(0xFF475569),
              ),
            ),
            const SizedBox(width: 4),
            Icon(
              isAction ? Icons.tune_rounded : Icons.keyboard_arrow_down_rounded,
              size: 14,
              color: isActive ? const Color(0xFF4313B8) : const Color(0xFF64748B),
            ),
          ],
        ),
      ),
    );
  }

  // --- REFINED RIDER BOOKING CARD (MATCHING USER SPECIFICATION) ---
  Widget _buildRiderBookingCard(dynamic r) {
    final status = _normalizeStatus(r);
    final vehicleModel = _getVehicleModelName(r);
    final vehicleImage = _getVehicleImagePath(vehicleModel);
    final bookingId = (r['reservation_id'] ?? r['id'] ?? '').toString();

    // Vehicle Assignment Check:
    // "if ride is in upcoming means still the vehicle is not assigned so do not display the vehicle number for the until and unless it assgin from the backend"
    final rawPlate = r['vehicle_number'];
    final bool hasAssignedVehicle = rawPlate != null && rawPlate.toString().trim().isNotEmpty && !rawPlate.toString().contains('GJ-06-EV-1024');
    final bool showVehicleNumber = status != 'Upcoming' || hasAssignedVehicle;
    final String plateText = showVehicleNumber
        ? (rawPlate?.toString() ?? "GJ-06-EV-1024")
        : "Vehicle assignment pending";

    final pickupZone = r['pickup_zone'] ?? r['pickupZone'] ?? 'Gotri Zone';
    final dateTimeString = _formatStartEndDateTime(r);
    final priceStr = _getTotalPriceString(r);

    Color badgeBg;
    Color badgeText;
    Color dotColor;

    if (status == 'Ongoing') {
      badgeBg = const Color(0xFFDCFCE7);
      badgeText = const Color(0xFF16A34A);
      dotColor = const Color(0xFF22C55E);
    } else if (status == 'Upcoming') {
      badgeBg = const Color(0xFFEEF2FF);
      badgeText = const Color(0xFF4313B8);
      dotColor = const Color(0xFF6366F1);
    } else if (status == 'Completed') {
      badgeBg = const Color(0xFFF1F5F9);
      badgeText = const Color(0xFF475569);
      dotColor = const Color(0xFF94A3B8);
    } else {
      badgeBg = const Color(0xFFFEE2E2);
      badgeText = const Color(0xFFEF4444);
      dotColor = const Color(0xFFEF4444);
    }

    // Dynamic Telemetry
    final double rawBattery = double.tryParse("${r['battery_pct'] ?? r['soc'] ?? 85}") ?? 85.0;
    final int dynamicBattery = rawBattery.clamp(5, 100).toInt();
    final int dynamicRange = r['range_km'] != null ? (int.tryParse("${r['range_km']}") ?? 95) : ((dynamicBattery / 100.0) * 110).round();
    final String battery = "$dynamicBattery%";
    final String range = "$dynamicRange km range";

    return InkWell(
      onTap: () => _navigateToDetails(r),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 10,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Thumbnail + Model Name + Status
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Vehicle Thumbnail
                  Container(
                    width: 58,
                    height: 58,
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Image.asset(vehicleImage, fit: BoxFit.contain),
                  ),
                  const SizedBox(width: 12),

                  // Model Name & Plate
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          vehicleModel,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF0F172A),
                            letterSpacing: -0.3,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            if (showVehicleNumber) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(color: const Color(0xFFE2E8F0)),
                                ),
                                child: Text(
                                  plateText,
                                  style: const TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    fontFamily: 'monospace',
                                    color: Color(0xFF334155),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                            ] else ...[
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: const Color(0xFFFEF3C7),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: const Text(
                                  "Assignment Pending",
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Color(0xFFB45309),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                            ],
                            Text(
                              "• $bookingId",
                              style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8)),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Status Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: badgeBg,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: dotColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          status,
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: badgeText,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const Divider(height: 1, color: Color(0xFFF1F5F9)),

            // Middle: Highlighted Zone + Exact Start & End Time
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Highlighted Zone Pill
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F3FF),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFDDD6FE)),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.location_on, size: 13, color: Color(0xFF4313B8)),
                            const SizedBox(width: 4),
                            Text(
                              pickupZone,
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF4313B8)),
                            ),
                          ],
                        ),
                      ),
                      const Spacer(),
                      Text(
                        priceStr,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Exact Booking Start & End Time with Rental Date
                  Row(
                    children: [
                      const Icon(Icons.calendar_month_outlined, size: 15, color: Color(0xFF64748B)),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          dateTimeString,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF334155),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  // Battery & Range Spec Bar (Shown ONLY for Ongoing ride; white background with clean subtle border)
                  if (status == 'Ongoing') ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.battery_charging_full_rounded, size: 15, color: Color(0xFF16A34A)),
                          const SizedBox(width: 6),
                          Text(
                            battery,
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                          ),
                          const SizedBox(width: 16),
                          const Icon(Icons.electric_bolt_rounded, size: 15, color: Color(0xFF2563EB)),
                          const SizedBox(width: 6),
                          Text(
                            range,
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF475569)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Bottom Actions
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => _navigateToDetails(r),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF2B0B78),
                        side: const BorderSide(color: Color(0xFFDDD6FE), width: 1.2),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        minimumSize: Size.zero,
                      ),
                      child: const Text(
                        "View Details",
                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: _buildContextActionButton(r, status, vehicleModel, bookingId, dateTimeString, priceStr),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContextActionButton(dynamic r, String status, String vehicle, String rId, String date, String cost) {
    if (status == 'Ongoing') {
      return ElevatedButton(
        onPressed: () async {
          setState(() {
            r['status'] = 'Completed';
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Ride ended successfully. Battery & vehicle checked in! ⚡"),
              backgroundColor: Color(0xFF16A34A),
            ),
          );
          try {
            final id = (r['id'] ?? r['reservation_id'] ?? rId).toString();
            final urls = [
              '${AppConstants.apiBaseUrl}/reservations/$id/return',
              'http://192.168.1.4:5000/api/reservations/$id/return',
              'http://localhost:5000/api/reservations/$id/return',
            ];
            for (final u in urls) {
              try {
                final res = await http.post(Uri.parse(u)).timeout(const Duration(seconds: 3));
                if (res.statusCode == 200) break;
              } catch (_) {}
            }
          } catch (_) {}
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFDC2626),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 10),
          minimumSize: Size.zero,
          elevation: 0,
        ),
        child: const Text("End Ride", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      );
    } else if (status == 'Upcoming') {
      return ElevatedButton(
        onPressed: () async {
          setState(() {
            r['status'] = 'Ongoing';
          });
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Starting $vehicle ride. Bluetooth vehicle lock unlocked! 🛵"),
              backgroundColor: const Color(0xFF16A34A),
            ),
          );
          try {
            final id = (r['id'] ?? r['reservation_id'] ?? rId).toString();
            final urls = [
              '${AppConstants.apiBaseUrl}/reservations/$id/start',
              'http://192.168.1.4:5000/api/reservations/$id/start',
              'http://localhost:5000/api/reservations/$id/start',
            ];
            for (final u in urls) {
              try {
                final res = await http.post(Uri.parse(u)).timeout(const Duration(seconds: 3));
                if (res.statusCode == 200) break;
              } catch (_) {}
            }
          } catch (_) {}
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF2B0B78),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 10),
          minimumSize: Size.zero,
          elevation: 0,
        ),
        child: const Text("Start Ride", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      );
    } else if (status == 'Completed') {
      return ElevatedButton.icon(
        onPressed: () {
          _generateAndDownloadInvoice(vehicle, rId, date, cost, "14.2 km", r['package_type'] ?? 'Day');
        },
        icon: const Icon(Icons.download_rounded, size: 14),
        label: const Text("Invoice", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF16A34A),
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 10),
          minimumSize: Size.zero,
          elevation: 0,
        ),
      );
    } else {
      return OutlinedButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Redirecting to EV inventory to book a new ride...")),
          );
        },
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFF64748B),
          side: const BorderSide(color: Color(0xFFE2E8F0)),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          padding: const EdgeInsets.symmetric(vertical: 10),
          minimumSize: Size.zero,
        ),
        child: const Text("Book Again", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
      );
    }
  }

  Future<void> _generateAndDownloadInvoice(String vehicle, String rideId, String date, String cost, String distance, String time) async {
    final pdf = pw.Document();

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        build: (pw.Context context) {
          return pw.Padding(
            padding: const pw.EdgeInsets.all(32),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text("EVegah Mobility", style: pw.TextStyle(fontSize: 28, fontWeight: pw.FontWeight.bold, color: PdfColors.green800)),
                pw.SizedBox(height: 8),
                pw.Text("Official Ride Invoice", style: pw.TextStyle(fontSize: 18, color: PdfColors.grey700)),
                pw.SizedBox(height: 40),
                pw.Divider(),
                pw.SizedBox(height: 20),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Ride ID:"), pw.Text(rideId, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Vehicle:"), pw.Text(vehicle, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Date:"), pw.Text(date, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Distance Covered:"), pw.Text(distance, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 8),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [pw.Text("Total Time:"), pw.Text(time, style: pw.TextStyle(fontWeight: pw.FontWeight.bold))],
                ),
                pw.SizedBox(height: 30),
                pw.Divider(),
                pw.SizedBox(height: 20),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text("Total Amount Paid:", style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold)),
                    pw.Text(cost, style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold, color: PdfColors.green800)),
                  ],
                ),
                pw.SizedBox(height: 40),
                pw.Text("Thank you for riding smart and riding green!", style: pw.TextStyle(fontStyle: pw.FontStyle.italic, color: PdfColors.grey)),
              ],
            ),
          );
        },
      ),
    );

    await Printing.sharePdf(
      bytes: await pdf.save(),
      filename: 'EVegah_Invoice_$rideId.pdf',
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: Color(0xFFF1F5F9),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.electric_scooter_rounded, size: 36, color: Color(0xFF94A3B8)),
            ),
            const SizedBox(height: 16),
            const Text(
              "No Bookings Found",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
            ),
            const SizedBox(height: 6),
            const Text(
              "Try changing your search query or reset filters to see all rides.",
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 18),
            ElevatedButton(
              onPressed: () {
                setState(() {
                  _searchController.clear();
                  _searchQuery = '';
                  _selectedFilterPillIndex = 0;
                  _filterDateRange = 'All Time';
                  _customDateRange = null;
                  _filterVehicleType = 'All';
                  _filterPaymentStatus = 'All';
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2B0B78),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: const Text("Reset All Filters", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSupportCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFDCFCE7)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: Color(0xFFDCFCE7),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.headset_mic_outlined, color: Color(0xFF16A34A), size: 18),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  "Need help with your booking?",
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF16A34A)),
                ),
                SizedBox(height: 2),
                Text(
                  "We're here 24/7 to assist you.",
                  style: TextStyle(color: Colors.grey, fontSize: 10),
                ),
              ],
            ),
          ),
          OutlinedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const HelpScreen(),
                ),
              );
            },
            style: OutlinedButton.styleFrom(
              foregroundColor: const Color(0xFF16A34A),
              side: const BorderSide(color: Color(0xFF16A34A), width: 1.5),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              minimumSize: Size.zero,
            ),
            child: const Text("Contact Support", style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
