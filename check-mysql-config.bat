@echo off
echo ========================================
echo    MYSQL CONFIGURATION CHECKER
echo ========================================
echo.

echo [INFO] Checking MySQL/MariaDB configuration...
echo.

echo [STEP 1] Checking for MySQL services...
echo [INFO] Looking for MySQL services...
sc query | findstr -i mysql
echo.

echo [STEP 2] Checking for running MySQL processes...
echo [INFO] Looking for mysqld processes...
tasklist | findstr -i mysqld
echo.

echo [STEP 3] Checking common MySQL installation paths...
echo [INFO] Checking XAMPP installation...
if exist "C:\xampp\mysql\bin\mysqld.exe" (
    echo [FOUND] XAMPP MySQL: C:\xampp\mysql\bin\mysqld.exe
    echo [INFO] Config file: C:\xampp\mysql\bin\my.ini
) else (
    echo [NOT FOUND] XAMPP MySQL
)

echo [INFO] Checking MySQL Server installation...
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" (
    echo [FOUND] MySQL Server 8.0: C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe
    echo [INFO] Config file: C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
) else (
    echo [NOT FOUND] MySQL Server 8.0
)

if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld.exe" (
    echo [FOUND] MySQL Server 5.7: C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld.exe
    echo [INFO] Config file: C:\ProgramData\MySQL\MySQL Server 5.7\my.ini
) else (
    echo [NOT FOUND] MySQL Server 5.7
)

echo [INFO] Checking MariaDB installation...
if exist "C:\Program Files\MariaDB 10.4\bin\mysqld.exe" (
    echo [FOUND] MariaDB 10.4: C:\Program Files\MariaDB 10.4\bin\mysqld.exe
    echo [INFO] Config file: C:\Program Files\MariaDB 10.4\data\my.ini
) else (
    echo [NOT FOUND] MariaDB 10.4
)

echo.
echo [STEP 4] Testing MySQL connection...
echo [INFO] Testing connection with different credentials...
mysql -u root -p -e "SELECT VERSION();" 2>nul
if %errorlevel% equ 0 (
    echo [SUCCESS] MySQL connection successful
) else (
    echo [FAILED] MySQL connection failed
    echo [INFO] Try running: mysql -u root -p
    echo [INFO] Or check if MySQL is running
)

echo.
echo [STEP 5] Checking data directory...
echo [INFO] Looking for InnoDB data files...
if exist "C:\xampp_temp\mysql\data\ib_logfile0" (
    echo [FOUND] XAMPP InnoDB logs: C:\xampp_temp\mysql\data\
) else (
    echo [NOT FOUND] XAMPP InnoDB logs
)

if exist "C:\ProgramData\MySQL\MySQL Server 8.0\Data\ib_logfile0" (
    echo [FOUND] MySQL Server 8.0 InnoDB logs: C:\ProgramData\MySQL\MySQL Server 8.0\Data\
) else (
    echo [NOT FOUND] MySQL Server 8.0 InnoDB logs
)

if exist "C:\Program Files\MariaDB 10.4\data\ib_logfile0" (
    echo [FOUND] MariaDB InnoDB logs: C:\Program Files\MariaDB 10.4\data\
) else (
    echo [NOT FOUND] MariaDB InnoDB logs
)

echo.
echo ========================================
echo    CONFIGURATION CHECK COMPLETED
echo ========================================
echo.
echo [INFO] Use this information to:
echo [INFO] 1. Identify your MySQL installation type
echo [INFO] 2. Locate the correct config file
echo [INFO] 3. Find the data directory for InnoDB files
echo [INFO] 4. Use the appropriate recovery method
echo.
pause
