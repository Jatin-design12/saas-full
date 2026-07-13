@echo off
echo Building Evegah BMS APK...
call C:\flutter\bin\flutter.bat clean
call C:\flutter\bin\flutter.bat build apk --release
echo Build finished.
