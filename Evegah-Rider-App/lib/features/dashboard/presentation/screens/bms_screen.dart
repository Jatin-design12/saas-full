import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/ble_battery_service.dart';
import '../../../../core/services/session_service.dart';
import '../widgets/bluetooth_scan_dialog.dart';

class BmsScreen extends StatefulWidget {
  const BmsScreen({super.key});

  @override
  State<BmsScreen> createState() => _BmsScreenState();
}

class _BmsScreenState extends State<BmsScreen> {
  Map<String, dynamic>? activeBooking;
  bool _isLoadingBooking = true;

  // Simulated cell voltages for realistic BMS display
  final List<double> _cellVoltages = [
    3.64, 3.65, 3.64, 3.65, 3.63, 3.64, 3.65, 3.64,
    3.64, 3.65, 3.63, 3.64, 3.65, 3.65, 3.64, 3.63
  ];

  @override
  void initState() {
    super.initState();
    _fetchActiveBooking();
    _triggerAutoConnect();
  }

  void _triggerAutoConnect() {
    final ble = BleBatteryService.instance;
    if (ble.connectionState.value == BleBatteryState.disconnected) {
      ble.autoConnectLastDevice();
    }
  }

  Future<void> _fetchActiveBooking() async {
    setState(() => _isLoadingBooking = true);
    final loggedIn = await SessionService().isLoggedIn();
    if (!loggedIn) {
      _setFallbackBooking();
      return;
    }

    final mobile = await SessionService().getUserMobile();
    if (mobile == null) {
      _setFallbackBooking();
      return;
    }

    final urls = [
      '${AppConstants.apiBaseUrl}/reservations?search=${Uri.encodeComponent(mobile)}',
      'http://192.168.1.4:5000/api/reservations?search=${Uri.encodeComponent(mobile)}',
      'http://localhost:5000/api/reservations?search=${Uri.encodeComponent(mobile)}',
    ];

    for (final url in urls) {
      try {
        final response = await http.get(Uri.parse(url)).timeout(const Duration(seconds: 2));
        if (response.statusCode == 200) {
          final data = json.decode(response.body);
          if (data['status'] == 'success' && data['data'] != null) {
            final List list = data['data'];
            final active = list.firstWhere(
              (r) => r['status'] == 'Confirmed' || r['status'] == 'Upcoming' || r['status'] == 'Ongoing',
              orElse: () => null,
            );
            if (active != null) {
              setState(() {
                activeBooking = active;
                _isLoadingBooking = false;
              });
              return;
            }
          }
        }
      } catch (e) {
        debugPrint("Error fetching active booking in BMS screen: $e");
      }
    }

    _setFallbackBooking();
  }

  void _setFallbackBooking() {
    setState(() {
      activeBooking = {
        'vehicle_category': 'E-Scooter',
        'reservation_id': 'RID-2026-701135',
        'pickup_zone': 'Gotri Zone',
      };
      _isLoadingBooking = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAFBFE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF0F172A), size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "BMS Battery Status",
          style: TextStyle(color: Color(0xFF0F172A), fontSize: 16, fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: ValueListenableBuilder<BleBatteryState>(
        valueListenable: BleBatteryService.instance.connectionState,
        builder: (context, connState, _) {
          final isConnected = connState == BleBatteryState.connected;

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. LIGHT THEME ACTIVE BOOKING / BMS CONNECTION CARD
                _buildLightBookingBmsCard(connState),
                const SizedBox(height: 20),

                // 2. Telemetry Details
                ValueListenableBuilder<DateTime?>(
                  valueListenable: BleBatteryService.instance.lastUpdatedTimestamp,
                  builder: (context, lastSeen, _) {
                    final showTelemetry = isConnected || lastSeen != null;

                    if (showTelemetry) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Timestamp / Connection Status Header
                          Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            decoration: BoxDecoration(
                              color: isConnected ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isConnected ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A),
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  isConnected ? Icons.sensors_rounded : Icons.history_rounded,
                                  size: 18,
                                  color: isConnected ? const Color(0xFF059669) : const Color(0xFFD97706),
                                ),
                                const SizedBox(width: 8),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        isConnected ? "LIVE TELEMETRY ACTIVE" : "OFFLINE • PRESERVED LAST DATA",
                                        style: TextStyle(
                                          color: isConnected ? const Color(0xFF065F46) : const Color(0xFF92400E),
                                          fontSize: 11,
                                          fontWeight: FontWeight.bold,
                                          letterSpacing: 0.5,
                                        ),
                                      ),
                                      Text(
                                        lastSeen != null
                                            ? "Last updated: ${lastSeen.hour.toString().padLeft(2, '0')}:${lastSeen.minute.toString().padLeft(2, '0')}:${lastSeen.second.toString().padLeft(2, '0')}"
                                            : "Receiving BLE telemetry packets...",
                                        style: TextStyle(
                                          color: isConnected ? const Color(0xFF047857) : const Color(0xFFB45309),
                                          fontSize: 10,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Battery Percentage & Core Metrics
                          ValueListenableBuilder<double>(
                            valueListenable: BleBatteryService.instance.batteryPercentage,
                            builder: (context, pct, _) {
                              return Container(
                                width: double.infinity,
                                padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: const Color(0xFFE2E8F0)),
                                  boxShadow: [
                                    BoxShadow(color: Colors.black.withOpacity(0.01), blurRadius: 10, offset: const Offset(0, 4)),
                                  ],
                                ),
                                child: Column(
                                  children: [
                                    // Circular Progress
                                    Stack(
                                      alignment: Alignment.center,
                                      children: [
                                        SizedBox(
                                          width: 130,
                                          height: 130,
                                          child: CircularProgressIndicator(
                                            value: pct / 100.0,
                                            strokeWidth: 9,
                                            backgroundColor: const Color(0xFFF1F5F9),
                                            color: isConnected ? const Color(0xFF10B981) : const Color(0xFFF59E0B),
                                          ),
                                        ),
                                        Column(
                                          mainAxisSize: MainAxisSize.min,
                                          children: [
                                            Text(
                                              "${pct.toStringAsFixed(0)}%",
                                              style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w900, color: Color(0xFF0F172A)),
                                            ),
                                            Text(
                                              isConnected ? "State of Charge" : "Last Known SOC",
                                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 24),
                                    // Row 1: Voltage, Current, Temp
                                    Row(
                                      children: [
                                        Expanded(
                                          child: ValueListenableBuilder<double>(
                                            valueListenable: BleBatteryService.instance.voltage,
                                            builder: (context, v, _) => _buildMetricTile("Voltage", "${v.toStringAsFixed(1)} V", Icons.electric_bolt_rounded, const Color(0xFF3B82F6)),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: ValueListenableBuilder<double>(
                                            valueListenable: BleBatteryService.instance.current,
                                            builder: (context, c, _) => _buildMetricTile("Current", "${c.toStringAsFixed(1)} A", Icons.speed_rounded, const Color(0xFFF59E0B)),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: ValueListenableBuilder<double>(
                                            valueListenable: BleBatteryService.instance.temperature,
                                            builder: (context, t, _) => _buildMetricTile("Temp", "${t.toStringAsFixed(0)} °C", Icons.thermostat_rounded, const Color(0xFFEF4444)),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 8),
                                    // Row 2: Health, Cycles, Capacity
                                    Row(
                                      children: [
                                        Expanded(
                                          child: ValueListenableBuilder<int>(
                                            valueListenable: BleBatteryService.instance.health,
                                            builder: (context, h, _) => _buildMetricTile("Health (SOH)", "$h %", Icons.favorite_rounded, const Color(0xFF10B981)),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: ValueListenableBuilder<int>(
                                            valueListenable: BleBatteryService.instance.cycles,
                                            builder: (context, cy, _) => _buildMetricTile("Cycles", "$cy", Icons.autorenew_rounded, const Color(0xFF8B5CF6)),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: ValueListenableBuilder<double>(
                                            valueListenable: BleBatteryService.instance.remainingCapacity,
                                            builder: (context, cap, _) => _buildMetricTile("Capacity", "${cap.toStringAsFixed(1)} Ah", Icons.battery_charging_full_rounded, const Color(0xFF06B6D4)),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 20),

                          // MOS Protection States
                          ValueListenableBuilder<bool>(
                            valueListenable: BleBatteryService.instance.chargeMos,
                            builder: (context, chgMos, _) {
                              return ValueListenableBuilder<bool>(
                                valueListenable: BleBatteryService.instance.dischargeMos,
                                builder: (context, disMos, _) {
                                  return Container(
                                    padding: const EdgeInsets.all(16),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                      border: Border.all(color: const Color(0xFFE2E8F0)),
                                    ),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Row(
                                            children: [
                                              Icon(
                                                chgMos ? Icons.check_circle_rounded : Icons.cancel_rounded,
                                                color: chgMos ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                                                size: 18,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                "Charge MOS: ${chgMos ? 'ON' : 'OFF'}",
                                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Expanded(
                                          child: Row(
                                            children: [
                                              Icon(
                                                disMos ? Icons.check_circle_rounded : Icons.cancel_rounded,
                                                color: disMos ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                                                size: 18,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                "Discharge MOS: ${disMos ? 'ON' : 'OFF'}",
                                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF334155)),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              );
                            },
                          ),
                          const SizedBox(height: 20),

                          // 16S Cell Voltages Grid
                          ValueListenableBuilder<List<double>>(
                            valueListenable: BleBatteryService.instance.cellVoltages,
                            builder: (context, cells, _) {
                              if (cells.isEmpty) return const SizedBox.shrink();
                              return Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(18),
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(24),
                                  border: Border.all(color: const Color(0xFFE2E8F0)),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        const Text(
                                          "CELL VOLTAGES",
                                          style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF4313B8), letterSpacing: 0.8),
                                        ),
                                        Text(
                                          "${cells.length} Cells Active",
                                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    GridView.builder(
                                      shrinkWrap: true,
                                      physics: const NeverScrollableScrollPhysics(),
                                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                        crossAxisCount: 4,
                                        childAspectRatio: 1.8,
                                        crossAxisSpacing: 6,
                                        mainAxisSpacing: 6,
                                      ),
                                      itemCount: cells.length,
                                      itemBuilder: (context, index) {
                                        final cellV = cells[index];
                                        return Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: const Color(0xFFF8FAFC),
                                            borderRadius: BorderRadius.circular(10),
                                            border: Border.all(color: const Color(0xFFE2E8F0)),
                                          ),
                                          child: Column(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              Text(
                                                "C${index + 1}",
                                                style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8)),
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                "${cellV.toStringAsFixed(3)}V",
                                                style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      );
                    }

                    return Container(
                      width: double.infinity,
                      height: 180,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.bluetooth_searching_rounded, size: 54, color: const Color(0xFF94A3B8).withOpacity(0.5)),
                          const SizedBox(height: 16),
                          const Text(
                            "BMS Telemetry Offline",
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF475569)),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            "Please tap 'Scan & Connect Battery' in the card above to scan for and connect to your DL-BMS smart battery.",
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8), height: 1.4),
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildLightBookingBmsCard(BleBatteryState connState) {
    if (_isLoadingBooking) {
      return Container(
        height: 150,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: const CircularProgressIndicator(color: Color(0xFF4313B8)),
      );
    }

    final String vehicleName = activeBooking?['vehicle_category'] ?? 'E-Scooter';
    final String reservationId = activeBooking?['reservation_id'] ?? 'RID-2026-701135';
    final String pickupZone = activeBooking?['pickup_zone'] ?? 'Gotri Zone';
    final isConnected = connState == BleBatteryState.connected;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.015),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      "ACTIVE BOOKING",
                      style: TextStyle(
                        color: Color(0xFF4313B8),
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      vehicleName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Color(0xFF0F172A),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  "ID: $reservationId",
                  style: const TextStyle(
                    color: Color(0xFF475569),
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const Divider(color: Color(0xFFF1F5F9), height: 24),
          Row(
            children: [
              const Icon(Icons.location_on_rounded, color: Color(0xFF4313B8), size: 14),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  "Pickup: $pickupZone",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Color(0xFF475569),
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Connection Controls
          if (isConnected)
            ValueListenableBuilder<double>(
              valueListenable: BleBatteryService.instance.batteryPercentage,
              builder: (context, batteryPct, _) {
                return Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFBBF7D0)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.battery_charging_full_rounded, color: Color(0xFF16A34A), size: 24),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Connected to Battery",
                              style: TextStyle(
                                color: Color(0xFF14532D),
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            ValueListenableBuilder<String?>(
                              valueListenable: BleBatteryService.instance.connectedDeviceName,
                              builder: (context, name, _) {
                                return Text(
                                  "Live BMS: ${batteryPct.toStringAsFixed(0)}% (${name ?? 'DL Battery'})",
                                  style: const TextStyle(
                                    color: Color(0xFF166534),
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          BleBatteryService.instance.disconnect();
                        },
                        style: TextButton.styleFrom(
                          foregroundColor: const Color(0xFFEF4444),
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                          minimumSize: Size.zero,
                        ),
                        child: const Text("Disconnect", style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                );
              },
            )
          else if (connState == BleBatteryState.connecting || connState == BleBatteryState.scanning)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFBFDBFE)),
              ),
              child: Row(
                children: const [
                  SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF3B82F6)),
                  ),
                  SizedBox(width: 12),
                  Text(
                    "Connecting to Battery...",
                    style: TextStyle(color: Color(0xFF1D4ED8), fontSize: 12, fontWeight: FontWeight.w500),
                  ),
                ],
              ),
            )
          else
            Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      BleBatteryService.instance.autoConnectLastDevice();
                    },
                    icon: const Icon(Icons.flash_on_rounded, size: 16),
                    label: const Text("⚡ Auto-Connect / Reconnect BMS", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF200F54),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  width: double.infinity,
                  height: 40,
                  child: OutlinedButton.icon(
                    onPressed: () {
                      showDialog(
                        context: context,
                        builder: (context) => const BluetoothScanDialog(),
                      );
                    },
                    icon: const Icon(Icons.bluetooth_searching_rounded, size: 16, color: Color(0xFF475569)),
                    label: const Text("Scan New DL- Series BMS", style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFF475569))),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Color(0xFFCBD5E1)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 18),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0F172A)),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
          ),
        ],
      ),
    );
  }

  Widget _buildSpecItem(String label, String value, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 20),
        const SizedBox(height: 6),
        Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Color(0xFF0F172A))),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 9, color: Color(0xFF94A3B8), fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildStatusRow(String label, String statusText, bool isOk, {Color? highlightColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, color: Color(0xFF475569), fontWeight: FontWeight.w500)),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(
            color: highlightColor != null ? highlightColor.withOpacity(0.1) : (isOk ? const Color(0xFFDCFCE7) : const Color(0xFFFEE2E2)),
            borderRadius: BorderRadius.circular(6),
          ),
          child: Text(
            statusText,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: highlightColor ?? (isOk ? const Color(0xFF16A34A) : const Color(0xFFEF4444)),
            ),
          ),
        ),
      ],
    );
  }
}
