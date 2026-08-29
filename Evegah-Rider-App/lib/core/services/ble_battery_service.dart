import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum BleBatteryState {
  disconnected,
  scanning,
  connecting,
  connected,
}

class BleBatteryService {
  // --- SINGLETON SETUP ---
  static final BleBatteryService instance = BleBatteryService._internal();
  factory BleBatteryService() => instance;
  BleBatteryService._internal() {
    loadLastPairedDevice();
  }

  // --- NOTIFIERS FOR UI ---
  final ValueNotifier<BleBatteryState> connectionState = ValueNotifier<BleBatteryState>(BleBatteryState.disconnected);
  final ValueNotifier<double> batteryPercentage = ValueNotifier<double>(0.0);
  final ValueNotifier<double> voltage = ValueNotifier<double>(0.0);
  final ValueNotifier<double> current = ValueNotifier<double>(0.0);
  final ValueNotifier<double> temperature = ValueNotifier<double>(0.0);
  final ValueNotifier<int> health = ValueNotifier<int>(100); // SOH %
  final ValueNotifier<List<double>> cellVoltages = ValueNotifier<List<double>>([]);
  final ValueNotifier<bool> chargeMos = ValueNotifier<bool>(true);
  final ValueNotifier<bool> dischargeMos = ValueNotifier<bool>(true);
  final ValueNotifier<int> cycles = ValueNotifier<int>(0);
  final ValueNotifier<double> remainingCapacity = ValueNotifier<double>(0.0);
  final ValueNotifier<DateTime?> lastUpdatedTimestamp = ValueNotifier<DateTime?>(null);

  final ValueNotifier<String?> connectedDeviceName = ValueNotifier<String?>("DL-BMS Battery");
  final ValueNotifier<String?> errorMessage = ValueNotifier<String?>(null);
  final ValueNotifier<List<ScanResult>> scannedDevices = ValueNotifier<List<ScanResult>>([]);

  // --- PRIVATE BLE VARIABLES ---
  BluetoothDevice? _connectedDevice;
  BluetoothCharacteristic? _writeCharacteristic; // ff01
  BluetoothCharacteristic? _dataCharacteristic;  // fff2 or fallback
  BluetoothCharacteristic? _passCharacteristic;  // ff05
  StreamSubscription<BluetoothConnectionState>? _connStateSub;
  StreamSubscription<List<ScanResult>>? _scanResultSub;
  Timer? _queryTimer;
  final List<int> _accumulator = [];
  final List<StreamSubscription<List<int>>> _notifySubs = [];
  bool _isSimulated = false;

  // --- CONFIG / HANDSHAKE BYTES ---
  static const List<int> _hiLinkPassword = [0x48, 0x69, 0x4C, 0x69, 0x6E, 0x6B]; // "HiLink"
  static const List<int> _modbusInitProbe = [0xD2, 0x03, 0x00, 0x00, 0x00, 0x7E, 0x90, 0xAA];
  static const List<int> _modbusReadLive = [0xD2, 0x03, 0x00, 0x00, 0x00, 0x3E, 0xD7, 0xB9];

  // --- PERSISTENCE ---
  Future<void> loadLastPairedDevice() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final name = prefs.getString("last_bms_name");
      if (name != null && name.isNotEmpty) {
        connectedDeviceName.value = name;
      }
    } catch (_) {}
  }

  Future<void> _saveLastPairedDevice(String macOrId, String name) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString("last_bms_mac", macOrId);
      await prefs.setString("last_bms_name", name);
    } catch (_) {}
  }

  // --- PUBLIC API ---

  Future<bool> checkPermissions() async {
    try {
      final locStatus = await Permission.location.status;
      if (!locStatus.isGranted && !locStatus.isLimited) {
        await Permission.location.request();
      }

      final btStatuses = await [
        Permission.bluetoothScan,
        Permission.bluetoothConnect,
      ].request();

      final scanGranted = btStatuses[Permission.bluetoothScan]?.isGranted == true ||
                          btStatuses[Permission.bluetoothScan]?.isLimited == true ||
                          btStatuses[Permission.bluetoothScan] == PermissionStatus.denied;

      final connGranted = btStatuses[Permission.bluetoothConnect]?.isGranted == true ||
                          btStatuses[Permission.bluetoothConnect]?.isLimited == true ||
                          btStatuses[Permission.bluetoothConnect] == PermissionStatus.denied;

      return scanGranted && connGranted;
    } catch (e) {
      debugPrint("Permission check error: $e");
      return true;
    }
  }

  Future<bool> autoConnectLastDevice() async {
    if (connectionState.value == BleBatteryState.connecting ||
        connectionState.value == BleBatteryState.connected) {
      return true;
    }

    final hasPerms = await checkPermissions();
    if (!hasPerms) {
      errorMessage.value = "Permissions denied. Please grant Bluetooth and Location permissions.";
      return false;
    }

    final prefs = await SharedPreferences.getInstance();
    final savedMac = prefs.getString("last_bms_mac");
    final savedName = prefs.getString("last_bms_name");

    connectionState.value = BleBatteryState.scanning;
    scannedDevices.value = [];

    if (await FlutterBluePlus.adapterState.first != BluetoothAdapterState.on) {
      try {
        await FlutterBluePlus.turnOn();
      } catch (_) {
        errorMessage.value = "Please turn on Bluetooth.";
        connectionState.value = BleBatteryState.disconnected;
        return false;
      }
    }

    final Completer<bool> completer = Completer<bool>();
    BluetoothDevice? foundDevice;

    _scanResultSub?.cancel();
    _scanResultSub = FlutterBluePlus.scanResults.listen((results) async {
      for (var r in results) {
        final pName = r.device.platformName.toUpperCase();
        final aName = r.advertisementData.advName.toUpperCase();
        final devId = r.device.remoteId.str;

        final isMatch = (savedMac != null && devId == savedMac) ||
            (savedName != null && (pName.contains(savedName.toUpperCase()) || aName.contains(savedName.toUpperCase()))) ||
            (pName.contains("DL-") || aName.contains("DL-") || pName.contains("DL_") || aName.contains("DL_"));

        if (isMatch && foundDevice == null) {
          foundDevice = r.device;
          await stopScan();
          await connectToDevice(r.device);
          if (!completer.isCompleted) completer.complete(true);
          break;
        }
      }
    });

    try {
      await FlutterBluePlus.startScan(timeout: const Duration(seconds: 8));
    } catch (_) {}

    Timer(const Duration(seconds: 9), () {
      if (!completer.isCompleted) {
        stopScan();
        if (connectionState.value == BleBatteryState.scanning) {
          connectionState.value = BleBatteryState.disconnected;
        }
        completer.complete(false);
      }
    });

    return completer.future;
  }

  Future<void> startScan() async {
    errorMessage.value = null;
    scannedDevices.value = [];
    final hasPerms = await checkPermissions();
    if (!hasPerms) {
      errorMessage.value = "Permissions denied. Please grant Bluetooth and Location permissions.";
      return;
    }

    if (await FlutterBluePlus.adapterState.first != BluetoothAdapterState.on) {
      try {
        await FlutterBluePlus.turnOn();
      } catch (_) {
        errorMessage.value = "Please turn on Bluetooth.";
        return;
      }
    }

    _clearConnectionStateOnly();

    connectionState.value = BleBatteryState.scanning;
    _scanResultSub?.cancel();
    
    _scanResultSub = FlutterBluePlus.scanResults.listen((results) {
      final List<ScanResult> dlMatches = [];
      for (var r in results) {
        final pName = r.device.platformName.toUpperCase();
        final aName = r.advertisementData.advName.toUpperCase();
        if (pName.contains("DL-") || aName.contains("DL-") || pName.contains("DL_") || aName.contains("DL_")) {
          dlMatches.add(r);
        }
      }
      scannedDevices.value = dlMatches;
    }, onError: (e) {
      errorMessage.value = "Scan error: $e";
      connectionState.value = BleBatteryState.disconnected;
    });

    try {
      await FlutterBluePlus.startScan(
        timeout: const Duration(seconds: 15),
        withServices: [],
      );
    } catch (e) {
      errorMessage.value = "Failed to start scan: $e";
      connectionState.value = BleBatteryState.disconnected;
    }
  }

  Future<void> stopScan() async {
    try {
      await FlutterBluePlus.stopScan();
    } catch (_) {}
    _scanResultSub?.cancel();
    if (connectionState.value == BleBatteryState.scanning) {
      connectionState.value = BleBatteryState.disconnected;
    }
  }

  Future<void> connectToDevice(BluetoothDevice device) async {
    _isSimulated = false;
    connectionState.value = BleBatteryState.connecting;
    _connectedDevice = device;
    final devName = device.platformName.isNotEmpty ? device.platformName : "DL-BMS Battery";
    connectedDeviceName.value = devName;
    _saveLastPairedDevice(device.remoteId.str, devName);

    try {
      await device.connect(
        timeout: const Duration(seconds: 12),
        autoConnect: false,
        license: License.free,
      );

      connectionState.value = BleBatteryState.connected;

      _connStateSub?.cancel();
      _connStateSub = device.connectionState.listen((cs) {
        if (cs == BluetoothConnectionState.disconnected) {
          _handleDisconnect();
        }
      });

      final services = await device.discoverServices();
      await _setupHandshake(device, services);

    } catch (e) {
      errorMessage.value = "Connection failed: $e";
      _handleDisconnect();
    }
  }

  Future<void> disconnect() async {
    _clearConnectionStateOnly();
    if (_connectedDevice != null) {
      try {
        await _connectedDevice!.disconnect();
      } catch (_) {}
      _connectedDevice = null;
    }
    
    _isSimulated = false;
    connectionState.value = BleBatteryState.disconnected;
    // NOTE: Telemetry values and lastUpdatedTimestamp are PRESERVED!
  }

  // --- SIMULATION API ---

  bool get isSimulated => _isSimulated;

  void startSimulation(double startSoc) {
    disconnect();
    _isSimulated = true;
    connectionState.value = BleBatteryState.connected;
    connectedDeviceName.value = "Simulated DL-BMS";
    batteryPercentage.value = startSoc;
    voltage.value = 72.4;
    current.value = -1.8;
    temperature.value = 32.0;
    health.value = 98;
    cycles.value = 42;
    remainingCapacity.value = 45.0;
    chargeMos.value = true;
    dischargeMos.value = true;
    cellVoltages.value = [
      3.64, 3.65, 3.64, 3.65, 3.63, 3.64, 3.65, 3.64,
      3.64, 3.65, 3.63, 3.64, 3.65, 3.65, 3.64, 3.63
    ];
    lastUpdatedTimestamp.value = DateTime.now();
  }

  void updateSimulatedSoc(double newSoc) {
    if (_isSimulated) {
      batteryPercentage.value = newSoc;
      lastUpdatedTimestamp.value = DateTime.now();
    }
  }

  // --- PRIVATE METHODS ---

  void _clearConnectionStateOnly() {
    _queryTimer?.cancel();
    _connStateSub?.cancel();
    for (var sub in _notifySubs) {
      sub.cancel();
    }
    _notifySubs.clear();
    _accumulator.clear();
  }

  void _handleDisconnect() {
    _clearConnectionStateOnly();
    _connectedDevice = null;
    connectionState.value = BleBatteryState.disconnected;
    // PRESERVE telemetry and timestamp on disconnect!
  }

  Future<void> _setupHandshake(BluetoothDevice device, List<BluetoothService> services) async {
    // 1. Request ATT MTU of 247 (Crucial for 124-byte Modbus payloads on Android)
    try {
      await device.requestMtu(247).timeout(const Duration(seconds: 2));
    } catch (e) {
      debugPrint("MTU request info: $e");
    }

    final allChars = services.expand((s) => s.characteristics).toList();

    BluetoothCharacteristic? ff01; // auth write
    BluetoothCharacteristic? ff05; // password write
    BluetoothCharacteristic? fff2; // data write

    for (var ch in allChars) {
      final uuid = ch.uuid.toString().toLowerCase();
      if (uuid.endsWith('ff01')) ff01 = ch;
      if (uuid.endsWith('ff05')) ff05 = ch;
      if (uuid.endsWith('fff2')) fff2 = ch;
    }

    _writeCharacteristic = ff01 ?? allChars.firstWhere((c) => c.properties.write || c.properties.writeWithoutResponse, orElse: () => allChars.first);
    _dataCharacteristic = fff2 ?? _writeCharacteristic;
    _passCharacteristic = ff05 ?? _writeCharacteristic;

    // 2. Subscribe to ALL notification characteristics (ff02, fff1, 2a37, etc.)
    final notifyChars = allChars.where((c) => c.properties.notify || c.properties.indicate).toList();
    for (var nCh in notifyChars) {
      try {
        await nCh.setNotifyValue(true);
        final sub = nCh.onValueReceived.listen((value) {
          _onRxData(value);
        });
        _notifySubs.add(sub);
      } catch (e) {
        debugPrint("Error subscribing to notify char ${nCh.uuid}: $e");
      }
    }

    // 3. Send initial probe to wake up BMS
    if (_writeCharacteristic != null) {
      final woResp = !_writeCharacteristic!.properties.write && _writeCharacteristic!.properties.writeWithoutResponse;
      try {
        await _writeCharacteristic!.write(_modbusInitProbe, withoutResponse: woResp);
      } catch (_) {}
    }

    await Future.delayed(const Duration(milliseconds: 300));

    // 4. Send HiLink password to ff05
    if (_passCharacteristic != null) {
      final woResp = !_passCharacteristic!.properties.write && _passCharacteristic!.properties.writeWithoutResponse;
      try {
        await _passCharacteristic!.write(_hiLinkPassword, withoutResponse: woResp);
      } catch (_) {}
    }

    await Future.delayed(const Duration(milliseconds: 500));

    // 5. Send first live telemetry query
    await _queryLiveTelemetry();

    // 6. Periodic query every 2.5 seconds
    _queryTimer?.cancel();
    _queryTimer = Timer.periodic(const Duration(milliseconds: 2500), (timer) async {
      if (connectionState.value == BleBatteryState.connected) {
        await _queryLiveTelemetry();
      }
    });
  }

  Future<void> _queryLiveTelemetry() async {
    final charToUse = _dataCharacteristic ?? _writeCharacteristic;
    if (charToUse != null) {
      try {
        final woResp = !charToUse.properties.write && charToUse.properties.writeWithoutResponse;
        await charToUse.write(_modbusReadLive, withoutResponse: woResp);
      } catch (_) {
        if (_writeCharacteristic != null && _writeCharacteristic != charToUse) {
          try {
            final woResp = !_writeCharacteristic!.properties.write && _writeCharacteristic!.properties.writeWithoutResponse;
            await _writeCharacteristic!.write(_modbusReadLive, withoutResponse: woResp);
          } catch (_) {}
        }
      }
    }
  }

  void _onRxData(List<int> data) {
    if (data.isEmpty) return;
    _accumulator.addAll(data);

    // 1. Try parsing Daly Standard A5 Protocol Frame (13 bytes: A5 01 [cmd] 08 [data 8B] [crc])
    while (_accumulator.length >= 13) {
      int a5Idx = -1;
      for (int i = 0; i < _accumulator.length - 12; i++) {
        if (_accumulator[i] == 0xA5 && _accumulator[i + 1] == 0x01) {
          a5Idx = i;
          break;
        }
      }

      if (a5Idx != -1) {
        if (a5Idx > 0) {
          _accumulator.removeRange(0, a5Idx);
        }
        final frame = _accumulator.sublist(0, 13);
        _parseDalyA5Frame(frame);
        _accumulator.removeRange(0, 13);
        continue;
      }
      break;
    }

    // 2. Try parsing Modbus RTU Frame (D2 03 [byteCount] [data] [crc])
    while (_accumulator.length >= 5) {
      int startIdx = -1;
      for (int i = 0; i < _accumulator.length - 1; i++) {
        if (_accumulator[i] == 0xD2 && _accumulator[i + 1] == 0x03) {
          startIdx = i;
          break;
        }
      }

      if (startIdx == -1) {
        if (_accumulator.length > 3) {
          _accumulator.removeRange(0, _accumulator.length - 3);
        }
        break;
      }

      if (startIdx > 0) {
        _accumulator.removeRange(0, startIdx);
        continue;
      }

      final byteCount = _accumulator[2];
      final frameLen = 3 + byteCount + 2;

      if (_accumulator.length < frameLen) {
        break;
      }

      final frame = _accumulator.sublist(0, frameLen);
      if (_validateCrc(frame)) {
        _parseModbusFrame(frame.sublist(3, 3 + byteCount));
        _accumulator.removeRange(0, frameLen);
      } else {
        _accumulator.removeAt(0);
      }
    }
  }

  bool _validateCrc(List<int> frame) {
    if (frame.length < 3) return false;
    final crc = _crc16(frame.sublist(0, frame.length - 2));
    final rxLo = frame[frame.length - 2];
    final rxHi = frame[frame.length - 1];
    return crc == ((rxHi << 8) | rxLo);
  }

  int _crc16(List<int> data) {
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

  void _parseDalyA5Frame(List<int> frame) {
    if (frame.length < 13) return;
    final cmd = frame[2];
    final data = frame.sublist(4, 12);

    if (cmd == 0x90) {
      // Voltage (0.1V), Current (0.1A offset 30000), SOC (0.1%)
      final rawV = (data[0] << 8) | data[1];
      if (rawV > 0) voltage.value = double.parse((rawV / 10.0).toStringAsFixed(1));

      final rawC = (data[4] << 8) | data[5];
      if (rawC > 0) {
        final double cVal = (rawC - 30000) / 10.0;
        current.value = double.parse(cVal.toStringAsFixed(1));
      }

      final rawSoc = (data[6] << 8) | data[7];
      if (rawSoc > 0 && rawSoc <= 1000) {
        batteryPercentage.value = double.parse((rawSoc / 10.0).toStringAsFixed(1));
      }
      lastUpdatedTimestamp.value = DateTime.now();
    } else if (cmd == 0x92) {
      final rawT = data[0] - 40;
      temperature.value = rawT.toDouble();
      lastUpdatedTimestamp.value = DateTime.now();
    } else if (cmd == 0x93) {
      chargeMos.value = data[0] == 1;
      dischargeMos.value = data[1] == 1;
      final rawCycles = (data[2] << 8) | data[3];
      if (rawCycles > 0) cycles.value = rawCycles;
      final rawSoh = data[4];
      if (rawSoh > 0 && rawSoh <= 100) health.value = rawSoh;
      lastUpdatedTimestamp.value = DateTime.now();
    } else if (cmd == 0x95) {
      final cellNo = data[0];
      final List<double> currentCells = List.from(cellVoltages.value);
      for (int i = 0; i < 3; i++) {
        final idx = (cellNo - 1) * 3 + i;
        final rawMv = (data[1 + i * 2] << 8) | data[2 + i * 2];
        if (rawMv > 1000 && rawMv < 5000) {
          final double v = double.parse((rawMv / 1000.0).toStringAsFixed(3));
          if (idx < currentCells.length) {
            currentCells[idx] = v;
          } else {
            currentCells.add(v);
          }
        }
      }
      cellVoltages.value = currentCells;
      lastUpdatedTimestamp.value = DateTime.now();
    }
  }

  void _parseModbusFrame(List<int> payload) {
    if (payload.length < 90) return;

    final isConfig = payload.length >= 120 &&
        payload[80] == 0x00 &&
        ((payload[81] == 0x57 && payload[82] == 0x54) ||
         (payload[81] == 0x44 && payload[82] == 0x4C));

    if (isConfig) return;

    int reg(int byteOffset) {
      if (byteOffset + 1 >= payload.length) return 0;
      return (payload[byteOffset] << 8) | payload[byteOffset + 1];
    }

    // 1. Cell Voltages (bytes 0..25, 13-16 cells in mV)
    final List<double> parsedCells = [];
    for (int i = 0; i < 16; i++) {
      final byteOffset = i * 2;
      if (byteOffset + 1 < payload.length) {
        final mv = reg(byteOffset);
        if (mv > 1000 && mv < 5000) {
          parsedCells.add(double.parse((mv / 1000.0).toStringAsFixed(3)));
        } else if (parsedCells.isNotEmpty) {
          break;
        }
      }
    }
    if (parsedCells.isNotEmpty) {
      cellVoltages.value = parsedCells;
    }

    // 2. Temperature (bytes 64..71, raw - 40 = °C)
    for (int i = 0; i < 4; i++) {
      final rawTemp = reg(64 + i * 2);
      if (rawTemp != 0x00FF && rawTemp > 0 && rawTemp < 200) {
        temperature.value = (rawTemp - 40).toDouble();
        break;
      }
    }

    // 3. Voltage (bytes 80..81, unit 0.1V)
    final rawVolt = reg(80);
    if (rawVolt > 0 && rawVolt < 10000) {
      voltage.value = double.parse((rawVolt / 10.0).toStringAsFixed(1));
    } else if (cellVoltages.value.isNotEmpty) {
      final sumV = cellVoltages.value.fold<double>(0.0, (a, b) => a + b);
      voltage.value = double.parse(sumV.toStringAsFixed(1));
    }

    // 4. Current (bytes 82..83, signed 0.1A with 30000 offset or raw signed)
    final rawCurr = reg(82);
    if (rawCurr > 0) {
      final double val = rawCurr > 30000 ? (rawCurr - 30000) / 10.0 : (rawCurr > 32767 ? (rawCurr - 65536) / 10.0 : rawCurr / 10.0);
      current.value = double.parse(val.toStringAsFixed(1));
    }

    // 5. SOC % (bytes 84..85, unit 0.1% or raw %)
    final rawSoc = reg(84);
    if (rawSoc > 0 && rawSoc <= 1000) {
      final double socVal = rawSoc > 100 ? rawSoc / 10.0 : rawSoc.toDouble();
      batteryPercentage.value = double.parse(socVal.toStringAsFixed(1));
    }

    // 6. SOH % (bytes 90..91)
    final rawSoh = reg(90);
    if (rawSoh > 0 && rawSoh <= 100) {
      health.value = rawSoh;
    }

    // 7. Remaining Capacity (bytes 96..97, unit 0.1Ah)
    final rawRemCap = reg(96);
    if (rawRemCap > 0) {
      remainingCapacity.value = double.parse((rawRemCap / 10.0).toStringAsFixed(1));
    }

    // 8. Cycles (bytes 102..103)
    final rawCycles = reg(102);
    if (rawCycles > 0 && rawCycles < 50000) {
      cycles.value = rawCycles;
    }

    // 9. MOS Statuses (bytes 106, 108)
    if (payload.length > 107) {
      chargeMos.value = reg(106) == 1;
    }
    if (payload.length > 109) {
      dischargeMos.value = reg(108) == 1;
    }

    lastUpdatedTimestamp.value = DateTime.now();
  }
}
