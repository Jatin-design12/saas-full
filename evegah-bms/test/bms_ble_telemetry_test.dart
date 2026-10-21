import 'package:flutter_test/flutter_test.dart';
import 'package:evegah_maintenance/app/core/ble/ble_decoder.dart';
import 'package:evegah_maintenance/features/battery/data/models/battery_model.dart';

void main() {
  group('Workstream A: BMS BLE Telemetry Unit Tests', () {
    test('1. BleDecoder accurately decodes captured hardware packet', () {
      const capturedHex =
          'd2037c01360e740001000d0000000000040000000000010e101036109a0af00a8c0215022201720165735072d87710778800640069000a00050069006e000a000501f40320000a000f0f3c003200010001014100575430304b5f3231383034325f31310000463930335f453330315f312e32480000323032343131303900009ed8';

      final parsed = BleDecoder.parse(capturedHex);

      expect(parsed['length'], equals(129));
      expect(parsed['u16_0'], equals(978)); // 0x03D2 little endian
      expect(parsed['ascii_chunks'], contains('WT00K_218042_11'));
      expect(parsed['ascii_chunks'], contains('F903_E301_1.2H'));
      expect(parsed['ascii_chunks'], contains('20241109'));
      expect(parsed['trailer_crc'], equals('9ed8'));
    });

    test('2. Modbus CRC-16 calculation matches expected checksum', () {
      int calculateModbusCrc(List<int> data) {
        int crc = 0xFFFF;
        for (var byte in data) {
          crc ^= byte;
          for (int i = 0; i < 8; i++) {
            if ((crc & 0x0001) != 0) {
              crc = (crc >> 1) ^ 0xA001;
            } else {
              crc >>= 1;
            }
          }
        }
        return crc;
      }

      // Sample Modbus command [0xD2, 0x03, 0x00, 0x80, 0x00, 0x3E] should yield CRC [0xD6, 0x51] -> 0x51D6
      final cmd = [0xD2, 0x03, 0x00, 0x80, 0x00, 0x3E];
      final crc = calculateModbusCrc(cmd);
      final lo = crc & 0xFF;
      final hi = (crc >> 8) & 0xFF;

      expect(lo, equals(0xD6));
      expect(hi, equals(0x51));
    });

    test('3. BatteryModel tracks stale data after 10-second threshold', () {
      final now = DateTime.now();

      final freshBattery = BatteryModel(
        id: 'DL-TEST-001',
        name: 'DL Battery 001',
        soc: 85.0,
        temperature: 32.5,
        voltage: 51.8,
        current: -4.2,
        rssi: -65,
        status: BatteryStatus.connected,
        lastUpdatedAt: now,
      );

      expect(freshBattery.isStale, isFalse);

      final staleBattery = freshBattery.copyWith(
        lastUpdatedAt: now.subtract(const Duration(seconds: 15)),
      );

      expect(staleBattery.isStale, isTrue);
    });

    test('4. Hardware fault evaluation detects over-temperature, under-voltage & cell imbalance', () {
      List<String> evaluateFaults({
        required double temperature,
        required double voltage,
        required double maxCellMv,
        required double minCellMv,
        required double soc,
      }) {
        final List<String> faults = [];
        if (temperature > 55.0) {
          faults.add('High Temp Alert: ${temperature.toStringAsFixed(1)}°C (>55°C limit)');
        }
        if (voltage < 42.0 && voltage > 10.0) {
          faults.add('Under-Voltage Alert: ${voltage.toStringAsFixed(1)}V (<42.0V limit)');
        }
        if (voltage > 58.8) {
          faults.add('Over-Voltage Alert: ${voltage.toStringAsFixed(1)}V (>58.8V limit)');
        }
        if (maxCellMv > 0 && minCellMv > 0 && (maxCellMv - minCellMv) > 150) {
          faults.add('Cell Imbalance: ${(maxCellMv - minCellMv).toStringAsFixed(0)}mV delta (>150mV)');
        }
        if (soc <= 10.0 && soc > 0.0) {
          faults.add('Critical Low Battery: ${soc.toStringAsFixed(1)}% SOC');
        }
        return faults;
      }

      // Normal conditions
      final normalFaults = evaluateFaults(
        temperature: 31.0,
        voltage: 52.0,
        maxCellMv: 4010,
        minCellMv: 3995,
        soc: 80.0,
      );
      expect(normalFaults, isEmpty);

      // Faulty conditions: Over-temp (58°C), under-voltage (40.5V), cell imbalance (220mV)
      final criticalFaults = evaluateFaults(
        temperature: 58.5,
        voltage: 40.5,
        maxCellMv: 4120,
        minCellMv: 3900,
        soc: 8.0,
      );
      expect(criticalFaults.length, equals(4));
      expect(criticalFaults, contains(predicate((String s) => s.contains('High Temp Alert'))));
      expect(criticalFaults, contains(predicate((String s) => s.contains('Under-Voltage Alert'))));
      expect(criticalFaults, contains(predicate((String s) => s.contains('Cell Imbalance'))));
      expect(criticalFaults, contains(predicate((String s) => s.contains('Critical Low Battery'))));
    });

    test('5. BatteryModel lifecycle transitions between states cleanly', () {
      var battery = const BatteryModel(
        id: 'BAT-DL-001',
        name: 'DL-001',
        soc: 0,
        temperature: 0,
        voltage: 0,
        current: 0,
        rssi: -70,
        status: BatteryStatus.connecting,
      );
      expect(battery.status, equals(BatteryStatus.connecting));

      battery = battery.copyWith(status: BatteryStatus.connected, soc: 95.0);
      expect(battery.status, equals(BatteryStatus.connected));
      expect(battery.soc, equals(95.0));

      battery = battery.copyWith(
        status: BatteryStatus.faulty,
        faults: ['High Temp Alert: 59.2°C (>55°C limit)'],
      );
      expect(battery.status, equals(BatteryStatus.faulty));
      expect(battery.faults.length, equals(1));

      battery = battery.copyWith(status: BatteryStatus.disconnected);
      expect(battery.status, equals(BatteryStatus.disconnected));
    });
  });
}
