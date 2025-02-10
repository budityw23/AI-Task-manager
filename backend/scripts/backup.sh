#!/bin/bash

# Configuration
BACKUP_DIR="/backups"
POSTGRES_USER="postgres"
POSTGRES_DB="taskmanagement"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete