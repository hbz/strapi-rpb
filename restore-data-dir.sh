#!/usr/bin/env bash

## Dieses Skript wurde von ChatGPT 5 geschrieben
## Prompting: phu.tu@hbz-nrw.de

set -euo pipefail

# --- Argumente prüfen ---
if [ $# -ne 2 ]; then
    echo "Usage: $0 /pfad/zur/archivdatei.tar.gz /pfad/zum/project-verzeichnis"
    exit 1
fi

ARCHIVE_FILE="$1"
PROJECT_DIR="$2"
DATA_DIR="${PROJECT_DIR}/data"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="${PROJECT_DIR}/data-${TIMESTAMP}.tar.gz"
NOTE_FILE="${PROJECT_DIR}/data-backup-location.txt"
SIZE_LIMIT_GB=10

# --- Existenz prüfen ---
if [ ! -f "$ARCHIVE_FILE" ]; then
    echo "❌ Fehler: Archivdatei '$ARCHIVE_FILE' wurde nicht gefunden."
    exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Fehler: Projektverzeichnis '$PROJECT_DIR' existiert nicht."
    exit 1
fi

# --- Backup erstellen, falls DATA_DIR existiert ---
if [ -d "$DATA_DIR" ]; then
    echo "📦 Sicherung von $DATA_DIR wird vorbereitet..."

    # Größe in GB ermitteln
    SIZE_BYTES=$(du -sb "$DATA_DIR" | cut -f1)
    SIZE_GB=$(( SIZE_BYTES / 1024 / 1024 / 1024 ))

    echo "📊 Größe des Verzeichnisses: ${SIZE_GB} GB"

    if (( SIZE_GB > SIZE_LIMIT_GB )); then
        echo "⚠️  Das Verzeichnis ist größer als ${SIZE_LIMIT_GB} GB."
        read -p "Möchten Sie das Verzeichnis stattdessen nach /tmp/ verschieben (y/N)? " move_answer
        case "$move_answer" in
            [Yy]* )
                TMP_TARGET="/tmp/data-backup-${TIMESTAMP}"
                echo "🚚 Verschiebe $DATA_DIR → $TMP_TARGET ..."
                mv "$DATA_DIR" "$TMP_TARGET"
                echo "📝 Speichere Hinweisdatei unter $NOTE_FILE"
                {
                    echo "Backup vom: $(date)"
                    echo "Originalverzeichnis: $DATA_DIR"
                    echo "Verschoben nach: $TMP_TARGET"
                    echo "Größe: ${SIZE_GB} GB"
                } > "$NOTE_FILE"
                ;;
            * )
                echo "🗜️  Erstelle trotzdem komprimiertes Backup (${BACKUP_FILE})..."
                cd "$PROJECT_DIR"
                tar -czf "$BACKUP_FILE" "$(basename "$DATA_DIR")"
                ;;
        esac
    else
        echo "🗜️  Erstelle komprimiertes Backup (${BACKUP_FILE})..."
        cd "$PROJECT_DIR"
        tar -czf "$BACKUP_FILE" "$(basename "$DATA_DIR")"
    fi

    echo "⚠️  Das Verzeichnis $DATA_DIR wird gelöscht, bevor die Wiederherstellung startet."
    read -p "Möchten Sie fortfahren? (y/N): " answer
    case "$answer" in
        [Yy]* )
            echo "🧹 Lösche aktuelles Verzeichnis $DATA_DIR..."
            rm -rf "$DATA_DIR"
            ;;
        * )
            echo "🚫 Abgebrochen."
            exit 0
            ;;
    esac
else
    echo "ℹ️ Hinweis: Das Verzeichnis $DATA_DIR existiert nicht – es wird keine Sicherung erstellt."
fi

# --- Wiederherstellen ---
echo "📂 Stelle Verzeichnis aus Archiv $ARCHIVE_FILE wieder her..."
cd "$PROJECT_DIR"
tar -xzf "$ARCHIVE_FILE"

echo "✅ Wiederherstellung abgeschlossen: $DATA_DIR"
if [ -f "$NOTE_FILE" ]; then
    echo "ℹ️ Hinweis: Alte Daten wurden nach /tmp/ verschoben. Details in:"
    echo "   $NOTE_FILE"
fi
