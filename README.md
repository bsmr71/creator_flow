# CreatorFlow — Multi-Channel Instagram & WhatsApp DM Automation Platform

Platform SaaS otomatisasi respon komentar Instagram (Reel, Feed, Story) dan WhatsApp Business Cloud API resmi untuk kreator konten, toko online, affiliate, dan agensi.

---

## 🚀 Fitur Unggulan

- **Meta Graph API v21.0 & Instagram Login Resmi**: Integrasi resmi tanpa password atau bot ilegal, bebas risiko shadowban.
- **Respon Cepat 0.1 Detik**: Membalas komentar audiens dan mengirim link checkout/katalog langsung ke DM secara instan.
- **Fitur Follow Gate (Wajib Follow)**: Memeriksa apakah audiens sudah follow akun sebelum mengirimkan link atau kupon promo.
- **WhatsApp Cloud API Terpadu**: Kirim pesan template, notifikasi pesanan, dan follow-up CS dalam satu inbox terpadu.
- **CRM Kontak & Lead Capture**: Mengumpulkan database pembeli (username, nomor WA, waktu interaksi) dan ekspor ke CSV.
- **Pembayaran Lokal Indonesia (DOKU Payment Gateway)**: Mendukung pembayaran QRIS (GoPay, OVO, ShopeePay, DANA) dan Virtual Account (BCA, Mandiri, BRI, BNI).
- **Halaman Kepatuhan Meta Lengkap**: Kebijakan Privasi (`/privacy`), Syarat Layanan (`/terms`), dan Penghapusan Data Pengguna (`/data-deletion`).

---

## 🛠️ Persyaratan Sistem (Server Requirements)

- **PHP**: >= 8.4 (Ekstensi: `bcmath`, `curl`, `mbstring`, `openssl`, `pdo_mysql`, `tokenizer`, `xml`, `redis`)
- **Web Server**: Nginx atau Apache (Wajib SSL / HTTPS)
- **Database**: MySQL 8.0+ atau MariaDB 10.5+
- **Cache & Queue**: Redis atau Database Queue
- **Node.js**: >= 20.x & NPM >= 10.x
- **Composer**: >= 2.x

---

## 📦 Panduan Instalasi di Server Produksi

### 1. Clone Repositori
```bash
git clone https://github.com/bsmr71/creator_flow.git /var/www/creatorflow
cd /var/www/creatorflow
```

### 2. Konfigurasi Environment (.env)
Salin berkas konfigurasi template:
```bash
cp .env.example .env
```
Buka `.env` dan sesuaikan kredensial server produksi:
```env
APP_NAME=CreatorFlow
APP_ENV=production
APP_DEBUG=false
APP_URL=https://app.creatorflow.id

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=creatorflow_db
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

QUEUE_CONNECTION=database
CACHE_STORE=database

# Kredensial Meta Developer
META_APP_ID=2537267343156852
META_APP_SECRET=your_meta_app_secret
INSTAGRAM_APP_ID=241827230249319
INSTAGRAM_APP_SECRET=your_instagram_secret
META_REDIRECT_URI=https://app.creatorflow.id/integrations/meta/callback
META_WEBHOOK_VERIFY_TOKEN=creatorflow_meta_verify_secret
META_GRAPH_VERSION=v21.0

# DOKU Payment Gateway
DOKU_CLIENT_ID=your_doku_client_id
DOKU_SECRET_KEY=your_doku_secret_key
DOKU_ENV=production
DOKU_NOTIFICATION_URL=https://app.creatorflow.id/api/webhooks/doku
```

### 3. Pasang Dependensi & Generate Key
```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
npm ci
npm run build
```

### 4. Migrasi Database & Storage Symlink
```bash
php artisan migrate --force
php artisan storage:link
```

### 5. Optimasi Cache Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 6. Jalankan Background Queue Worker (Supervisor)
Agar balasan otomatis berjalan seketika (non-blocking) di latar belakang, konfigurasikan Supervisor pada server Linux:

Buat file `/etc/supervisor/conf.d/creatorflow-worker.conf`:
```ini
[program:creatorflow-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/creatorflow/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/creatorflow/storage/logs/worker.log
```

Jalankan worker:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start creatorflow-worker:*
```

---

## 🌐 Checklist Pendaftaran di Meta for Developers

Buka [Meta Developer Dashboard](https://developers.facebook.com/apps/):

| Pengaturan Meta | Nilai yang Harus Diisi di Dashboard Meta |
| :--- | :--- |
| **App Domains** | `app.creatorflow.id` (domain server Anda) |
| **Privacy Policy URL** | `https://app.creatorflow.id/privacy` |
| **Terms of Service URL** | `https://app.creatorflow.id/terms` |
| **User Data Deletion URL** | `https://app.creatorflow.id/data-deletion` |
| **Data Deletion Callback** | `https://app.creatorflow.id/api/webhooks/meta/data-deletion` |
| **OAuth Redirect URI** | `https://app.creatorflow.id/integrations/meta/callback` |
| **Webhook Callback URL** | `https://app.creatorflow.id/api/webhooks/meta` |
| **Webhook Verify Token** | `creatorflow_meta_verify_secret` |

---

## 🧪 Pengujian Unit & Fitur

Jalankan rangkaian tes otomatis (PHPUnit) untuk memastikan seluruh fitur stabil:
```bash
php artisan test
```

---

## 📄 Lisensi

Hak Cipta © 2026 CreatorFlow. Seluruh hak cipta dilindungi undang-undang.
