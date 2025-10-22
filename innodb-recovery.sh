#!/bin/bash

echo "========================================"
echo "   INNODB RECOVERY SCRIPT FOR eSIR 2.0"
echo "========================================"
echo

# Set variables
BACKUP_DIR="backups"
DB_NAME="prodsysesirv02"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "[INFO] Timestamp: $TIMESTAMP"
echo "[INFO] Database: $DB_NAME"
echo

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "[STEP 1] Creating backup before recovery..."
mysqldump -u root -p "$DB_NAME" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"
if [ $? -ne 0 ]; then
    echo "[ERROR] Backup failed! Please check your MySQL credentials."
    exit 1
fi
echo "[SUCCESS] Backup created: $BACKUP_DIR/backup_$TIMESTAMP.sql"
echo

echo "[STEP 2] Stopping MySQL service..."
sudo systemctl stop mysql
if [ $? -ne 0 ]; then
    echo "[WARNING] Could not stop MySQL service. Please stop it manually."
    read -p "Press Enter to continue..."
fi
echo

echo "[STEP 3] Removing InnoDB log files..."
sudo rm -f /var/lib/mysql/ib_logfile*
echo "[SUCCESS] InnoDB log files removed"
echo

echo "[STEP 4] Starting MySQL service..."
sudo systemctl start mysql
if [ $? -ne 0 ]; then
    echo "[ERROR] Could not start MySQL service. Please start it manually."
    exit 1
fi
echo "[SUCCESS] MySQL service started"
echo

echo "[STEP 5] Waiting for MySQL to initialize..."
sleep 10
echo

echo "[STEP 6] Restoring database..."
mysql -u root -p "$DB_NAME" < "$BACKUP_DIR/backup_$TIMESTAMP.sql"
if [ $? -ne 0 ]; then
    echo "[ERROR] Database restoration failed!"
    echo "[INFO] You can manually restore using: mysql -u root -p $DB_NAME < $BACKUP_DIR/backup_$TIMESTAMP.sql"
    exit 1
fi
echo "[SUCCESS] Database restored successfully"
echo

echo "========================================"
echo "   RECOVERY COMPLETED SUCCESSFULLY!"
echo "========================================"
echo
echo "[INFO] Backup file: $BACKUP_DIR/backup_$TIMESTAMP.sql"
echo "[INFO] Database: $DB_NAME"
echo "[INFO] You can now start your eSIR 2.0 application"
echo
