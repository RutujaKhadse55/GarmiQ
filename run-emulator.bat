@echo off
setlocal enabledelayedexpansion
echo ========================================================
echo        Starting GarmiQ on Android Emulator
echo ========================================================

set ADB="C:\Users\dell\AppData\Local\Android\Sdk\platform-tools\adb.exe"
set EMULATOR="C:\Users\dell\AppData\Local\Android\Sdk\emulator\emulator.exe"
set APK="frontend\citizen-app\android\app\build\outputs\apk\debug\app-debug.apk"

REM 1. Check if emulator is already running
%ADB% devices | findstr "emulator" >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Android Emulator is already running.
) else (
    echo [INFO] Launching Android Emulator 'rutuja'...
    start "" %EMULATOR% -avd rutuja
    echo [INFO] Waiting for emulator to connect...
    %ADB% wait-for-device

    echo [INFO] Waiting for Android system to finish booting...
    :wait_boot
    timeout /t 2 /nobreak >nul
    for /f "tokens=*" %%A in ('%ADB% shell getprop sys.boot_completed 2^>nul') do set BOOT=%%A
    if not "!BOOT!"=="1" goto wait_boot
    echo [OK] Android is fully booted!
)

REM 2. Install the APK
echo [INFO] Installing GarmiQ APK...
%ADB% install -r %APK%

REM 3. Launch the app
echo [INFO] Launching GarmiQ Citizen App...
%ADB% shell monkey -p org.garmiq.citizen -c android.intent.category.LAUNCHER 1 >nul 2>&1
%ADB% shell am start -n org.garmiq.citizen/.MainActivity >nul 2>&1

echo.
echo ========================================================
echo [SUCCESS] GarmiQ is now open on your Android Emulator!
echo ========================================================
