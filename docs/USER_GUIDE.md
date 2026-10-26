# Panduan Pengguna Webjoz

> AI-powered website builder untuk UMKM Indonesia. Bangun website bisnis profesional melalui percakapan dengan AI.

---

## 🚀 Mulai Cepat

### 1. Daftar Akun
- Kunjungi **`/register`** atau **`/login`**
- Pilih metode:
  - **Email + Password**: Isi formulir daftar
  - **WhatsApp**: Masukkan nomor WhatsApp, terima OTP
  - **Email OTP**: Masukkan email, terima kode verifikasi
  - **Magic Link**: Request link via email, klik untuk login

### 2. Buat Website Baru
- Setelah login, klik **`Buat Website Baru`** atau akses **`/create`**
- AI akan memulai **wizard percakapan** (4 langkah)

### 3. Isi Detail Bisnis (Step 1)
- **Nama Bisnis**: Contoh: "Kopi Rempah Nusantara"
- **Jenis Bisnis**: Pilih kategori (Kuliner, Jasa, Produk, dll)
- **Deskripsi**: Cerita singkat tentang bisnis Anda (opsional, AI bisa generate otomatis)

### 4. Pilih Template (Step 2)
- **Lihat preview** desain untuk setiap template:
  - **Bold**: Tegas & modern (bengkel, jasa)
  - **Produk**: Katalog produk (toko, fashion)
  - **Jasa**: Layanan & booking (konsultan, hotel)
  - **Kuliner**: Food & minuman (kafe, restoran)
  - **Elegant**: Premium & mewah (spa, properti)
  - **Natural**: Organik & alami (herbal, taman)
- **Pilih template** yang sesuai dengan bisnis Anda
- **Preview desain** sebelum lanjut

### 5. Publikasikan (Step 3)
- **Pilih domain**:
  - **Subdomain gratis**: `namamu.webjoz.com`
  - **Domain kustom**: Contoh: `toko-ku.com` (ikuti instruksi DNS)
- Klik **Publish**
- Website live dalam hitungan menit

---

## 📋 Alur Lengkap

### Langkah 1: Register & Onboard
1. Buka **`/register`** atau **`/login`**
2. Isi nama, email/nomor WhatsApp, password
3. Verifikasi akun (email OTP atau WhatsApp OTP)
4. Dashboard terbuka dengan statistik awal

### Langkah 2: Buat Website (Wizard AI)
1. Klik **`Buat Website Baru`**
2. **Step A - Nama Bisnis**: Masukkan nama brand
3. **Step B - Deskripsi**: Berikan deskripsi atau biarkan AI generate
4. **Step C - Jenis Bisnis**: Pilih kategori (Kuliner/Jasa/Produk/ dll)
5. **Step D - Template**: Pilih desain yang suka dari 6 template
6. **Step E - Preview**: Lihat hasil AI, bisa regenerate atau edit
7. **Step F - Publish**: Pilih domain dan publikasi

### Langkah 3: Domain & Publishing
**Subdomain Gratis:**
- Otomatis tersedia: `namamu.webjoz.com`
- Aktif langsung setelah publish

**Domain Kustom:**
1. Buka tab **`Domain`** di dashboard
2. Masukkan domain Anda (contoh: `toko-ku.com`)
3. Ikuti instruksi DNS:
   - Tambahkan **CNAME record**: `www` → `namamu.webjoz.com`
   - Atau **A record** ke IP Webjoz (tersedia di dashboard)
4. Tunggu 5-30 menit propagasi DNS
5. Status berubah menjadi **"Active"**

### Langkah 4: Upgrade & Pembayaran
1. Dari dashboard, klik **`Upgrade Paket`**
2. Pilih paket:
   - **Bulanan**: Akses fitur premium seharian
   - **Tahunan**: Diskon hingga 20%, akses permanen
3. **Pilih metode pembayaran**:
   - **Midtrans (IDR)**: Transfer bank, GoPay, OVO, DANA, ShopeePay
   - **PayPal (USD)**: Bayar melalui akun PayPal
4. Selesaikan pembayaran
5. Akun naik ke **Paket Pro** - fitur premium terbuka

**Fitur Paket Pro:**
- Template premium tambahan
- Domain kustom tanpa batasan
- Analitik lanjut
- WhatsApp integration otomatis
- Backup konten harian

### Langkah 5: Manajemen Website
- **Edit website**: Dari dashboard, klik website, buka editor
- **Buat website tambahan**: Klik `+ Website Baru`, ulangi wizard
- **Hapus/arsipkan**: Pilih website, klik delete/archive
- **Lihat analytics**: Akses tab **`Analytics`** untuk statistik kunjungan

---

## 🛠 Troubleshooting Umum

| Masalah | Solusi |
|---------|--------|
| **Tidak bisa login** | Cek koneksi internet, cek spam email untuk OTP, atur ulang password |
| **Website tidak muncul** | Tunggu 5-10 menit setelah publish, cek kustom domain DNS |
| **PayPal error** | Pastikan akun PayPal valid, cek saldo atau kartu terkait |
| **Domain tidak aktif** | Tunggu propagasi DNS (5-30 menit), cek CNAME/A record |
| **AI generate konten salah** | Regenerate, atau edit manual di editor setelah publish |

---

## 📞 Bantuan

- **Email**: support@webjoz.com (respon dalam 24 jam)
- **Documentasi lengkap**: Lihat `docs/` di repository ini
- **FAQ**: Cek `docs/QA-Manual-Testing.md` untuk test cases umum
- **Komunitas**: Forum diskusi di `community.webjoz.com` (jika tersedia)

---

## 📚 Referensi Dokumentasi

| File | Isi |
|------|-----|
| `docs/QA-Manual-Testing.md` | 50+ test cases alur user kritis |
| `docs/ARCHITECTURE.md` | Struktur sistem & alur AI generation |
| `docs/API_INTEGRATION.md` | Guide integrasi frontend & API |
| `docs/DESIGN_SYSTEM.md` | Konvensi desain, warna, typografi |
| `README.md` | Ringkasan fitur & teknologi stack |

---

## 💡 Tips & Trik

1. **AI lebih baik dengan detail**: Berikan deskripsi bisnis yang lengkap (target, unik, masalah dipecahkan) untuk hasil yang lebih baik
2. **Pilih template sesuai industri**: Setiap template dirancang untuk jenis bisnis tertentu
3. **Domain kustom**: Beli domain dulu sebelum connect ke Webjoz untuk pengalaman lancar
4. **Upgrade**: Paket tahunan menghemat hingga 20% vs bulanan
5. **Backup**: Konten website secara otomatis backup harian (fitur Pro)

---

*Dokumentasi ini dibuat berdasarkan Webjoz v2.1.0. Untuk update terbaru, lihat `CHANGELOG.md`.*