@echo off
echo ========================================
echo    INNODB RECOVERY SCRIPT FOR eSIR 2.0
echo ========================================
echo.

:: Set variables
set BACKUP_DIR=backups
set DB_NAME=prodsysesirv02
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

echo [INFO] Timestamp: %TIMESTAMP%
echo [INFO] Database: %DB_NAME%
echo.

:: Create backup directory
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo [STEP 1] Creating backup before recovery...
mysqldump -u root -p %DB_NAME% > "%BACKUP_DIR%\backup_%TIMESTAMP%.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Backup failed! Please check your MySQL credentials.
    pause
    exit /b 1
)
echo [SUCCESS] Backup created: %BACKUP_DIR%\backup_%TIMESTAMP%.sql
echo.

echo [STEP 2] Stopping MySQL/MariaDB service...
echo [INFO] Trying different service names...

:: Try different MySQL service names
net stop mysql 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL service stopped
    goto :mysql_stopped
)

net stop mariadb 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MariaDB service stopped
    goto :mysql_stopped
)

net stop "MySQL80" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL80 service stopped
    goto :mysql_stopped
)

net stop "MySQL57" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL57 service stopped
    goto :mysql_stopped
)

:: Try XAMPP control
if exist "C:\xampp\xampp_stop.exe" (
    echo [INFO] Stopping XAMPP MySQL...
    C:\xampp\xampp_stop.exe
    if %errorlevel% equ 0 (
        echo [SUCCESS] XAMPP MySQL stopped
        goto :mysql_stopped
    )
)

:: Try killing mysqld process
echo [INFO] Trying to stop mysqld process...
taskkill /f /im mysqld.exe 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] mysqld.exe process terminated
    goto :mysql_stopped
)

echo [WARNING] Could not stop MySQL/MariaDB automatically.
echo [INFO] Please stop MySQL/MariaDB manually before continuing.
echo [INFO] You can:
echo [INFO] 1. Stop XAMPP Control Panel
echo [INFO] 2. Kill mysqld.exe process in Task Manager
echo [INFO] 3. Or stop the service manually
pause

:mysql_stopped
echo.

echo [STEP 3] Removing InnoDB log files...
if exist "C:\xampp_temp\mysql\data\ib_logfile0" del "C:\xampp_temp\mysql\data\ib_logfile0"
if exist "C:\xampp_temp\mysql\data\ib_logfile1" del "C:\xampp_temp\mysql\data\ib_logfile1"
if exist "C:\xampp_temp\mysql\data\ib_logfile2" del "C:\xampp_temp\mysql\data\ib_logfile2"
echo [SUCCESS] InnoDB log files removed
echo.

echo [STEP 4] Starting MySQL/MariaDB service...
echo [INFO] Trying different service names...

:: Try different MySQL service names
net start mysql 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL service started
    goto :mysql_started
)

net start mariadb 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MariaDB service started
    goto :mysql_started
)

net start "MySQL80" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL80 service started
    goto :mysql_started
)

net start "MySQL57" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL57 service started
    goto :mysql_started
)

:: Try XAMPP control
if exist "C:\xampp\xampp_start.exe" (
    echo [INFO] Starting XAMPP MySQL...
    C:\xampp\xampp_start.exe
    if %errorlevel% equ 0 (
        echo [SUCCESS] XAMPP MySQL started
        goto :mysql_started
    )
)

echo [ERROR] Could not start MySQL/MariaDB automatically.
echo [INFO] Please start MySQL/MariaDB manually:
echo [INFO] 1. Start XAMPP Control Panel
echo [INFO] 2. Or start the service manually
echo [INFO] 3. Then run the restore command manually:
echo [INFO]    mysql -u root -p %DB_NAME% ^< "%BACKUP_DIR%\backup_%TIMESTAMP%.sql"
pause
exit /b 1

:mysql_started
echo.

echo [STEP 5] Waiting for MySQL to initialize...
timeout /t 10 /nobreak > nul
echo.

echo [STEP 6] Restoring database...
mysql -u root -p %DB_NAME% < "%BACKUP_DIR%\backup_%TIMESTAMP%.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Database restoration failed!
    echo [INFO] You can manually restore using: mysql -u root -p %DB_NAME% ^< "%BACKUP_DIR%\backup_%TIMESTAMP%.sql"
    pause
    exit /b 1
)
echo [SUCCESS] Database restored successfully
echo.

echo ========================================
echo    RECOVERY COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo [INFO] Backup file: %BACKUP_DIR%\backup_%TIMESTAMP%.sql
echo [INFO] Database: %DB_NAME%
echo [INFO] You can now start your eSIR 2.0 application
echo.
pause
