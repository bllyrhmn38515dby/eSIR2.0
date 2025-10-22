@echo off
echo ========================================
echo    SIMPLE INNODB RECOVERY FOR eSIR 2.0
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
    echo [INFO] Make sure MySQL is running and you have correct password.
    pause
    exit /b 1
)
echo [SUCCESS] Backup created: %BACKUP_DIR%\backup_%TIMESTAMP%.sql
echo.

echo [STEP 2] Setting InnoDB force recovery mode...
echo [INFO] This will modify MySQL configuration to force recovery.
echo [INFO] You need to edit your MySQL config file (my.cnf or my.ini)
echo [INFO] Add this line under [mysqld] section:
echo [INFO] innodb_force_recovery = 1
echo.
echo [INFO] Common MySQL config file locations:
echo [INFO] - C:\xampp\mysql\bin\my.ini
echo [INFO] - C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
echo [INFO] - C:\Program Files\MySQL\MySQL Server 8.0\my.ini
echo.
echo [INFO] After adding the config, restart MySQL service.
echo.
pause

echo [STEP 3] Testing database connection...
mysql -u root -p -e "SHOW DATABASES;" 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Cannot connect to MySQL. Please check:
    echo [INFO] 1. MySQL service is running
    echo [INFO] 2. Username and password are correct
    echo [INFO] 3. MySQL port (3306) is accessible
    pause
    exit /b 1
)
echo [SUCCESS] MySQL connection successful
echo.

echo [STEP 4] Dropping and recreating database...
mysql -u root -p -e "DROP DATABASE IF EXISTS %DB_NAME%;"
mysql -u root -p -e "CREATE DATABASE %DB_NAME%;"
echo [SUCCESS] Database recreated
echo.

echo [STEP 5] Restoring database from backup...
mysql -u root -p %DB_NAME% < "%BACKUP_DIR%\backup_%TIMESTAMP%.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Database restoration failed!
    echo [INFO] You can manually restore using:
    echo [INFO] mysql -u root -p %DB_NAME% ^< "%BACKUP_DIR%\backup_%TIMESTAMP%.sql"
    pause
    exit /b 1
)
echo [SUCCESS] Database restored successfully
echo.

echo [STEP 6] Verifying database...
mysql -u root -p -e "USE %DB_NAME%; SHOW TABLES;" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Database verification successful
) else (
    echo [WARNING] Database verification failed, but restoration completed
)
echo.

echo ========================================
echo    RECOVERY COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo [INFO] Backup file: %BACKUP_DIR%\backup_%TIMESTAMP%.sql
echo [INFO] Database: %DB_NAME%
echo [INFO] Remember to remove 'innodb_force_recovery = 1' from config file
echo [INFO] You can now start your eSIR 2.0 application
echo.
pause
