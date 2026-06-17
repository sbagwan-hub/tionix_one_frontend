# MinIO Setup Guide (Windows & Linux)

## Overview

MinIO is a self-hosted, S3-compatible object storage service used for storing:

- Documents
- Attachments
- Profile Images
- Invoices
- Reports
- Export Files

Default Ports:

| Service       | Port |
| ------------- | ---- |
| S3 API        | 9000 |
| Admin Console | 9001 |

---

# Windows Setup

## Download MinIO

Download `minio.exe` and place it in:

```text
C:\minio
```

Create a data directory:

```text
C:\minio\data
```

## Start MinIO

Open PowerShell:

```powershell
$env:MINIO_ROOT_USER="admin"
$env:MINIO_ROOT_PASSWORD="StrongPassword123!"

C:\minio\minio.exe server C:\minio\data --console-address ":9001"
```

## Access Console

```text
http://localhost:9001
```

Login using:

```text
Username: admin
Password: StrongPassword123!
```

---

# Linux Setup

## Download MinIO

```bash
wget https://dl.min.io/server/minio/release/linux-amd64/minio

chmod +x minio

sudo mv minio /usr/local/bin/
```

## Create Storage Directory

```bash
sudo mkdir -p /opt/minio/data
```

## Start MinIO

```bash
export MINIO_ROOT_USER=admin
export MINIO_ROOT_PASSWORD=StrongPassword123!

minio server /opt/minio/data --console-address ":9001"
```

## Access Console

```text
http://SERVER_IP:9001
```

---

# Create Bucket

1. Login to MinIO Console
2. Open **Buckets**
3. Click **Create Bucket**
4. Enter bucket name:

```text
erp-system
```

---

# Public Bucket Access

Allow public file downloads:

```bash
mc alias set local http://localhost:9000 admin StrongPassword123!

mc anonymous set download local/erp-system
```

Verify:

```bash
mc anonymous get local/erp-system
```

---

# Private Bucket Access (Recommended)

Keep the bucket private and generate presigned URLs from the backend.

Benefits:

- Secure file access
- Time-limited URLs
- No public exposure of files

---

# Application Configuration

```env
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_ACCESS_KEY=admin
S3_SECRET_KEY=StrongPassword123!
S3_BUCKET=erp-system
```

Linux Server Example:

```env
S3_ENDPOINT=http://SERVER_IP:9000
```

---

# Node.js Configuration

```ts
import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});
```

---

# Recommended Folder Structure

```text
erp-system/
├── documents/
├── profiles/
├── invoices/
├── attachments/
├── exports/
└── reports/
```

---

# Stop MinIO

Windows:

```cmd
taskkill /F /IM minio.exe
```

Linux:

```bash
pkill minio
```

Or press:

```text
Ctrl + C
```

in the terminal running MinIO.
