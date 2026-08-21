# QA Manual Testing Documentation - Step 3: Business Flows & Critical Paths

## 📋 Overview
**Step 3** menguji alur bisnis utama (critical paths) dari mulai register hingga menjadi pelanggan berbayar. Ini adalah *heart* testing untuk memastikan aplikasi menghasilkan revenue dan nilai bagi pelanggan.

---

## 🎯 Critical Paths yang Harus Ditest

### 1. **Register & Onboard (New User)**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Register New Account** | 1. Navigate to `/register`<br>2. Fill name, email, phone, password<br>3. Click "Daftar"<br>4. Verify email/PN verification if required | Account created successfully<br>Redirect to login or dashboard<br>Data tersimpan di database |
| 2 | **Email Verification** | 1. Register with unverified email<br>2. Cek email inbox untuk link verifikasi<br>3. Klik link verifikasi<br>4. Login dengan akun verified | Status akun berubah menjadi `verified`<br>Bisa login tanpa halangan |
| 3 | **Social Login (Google)** | 1. Klik "Login dengan Google"<br>2. Pilih akun Google<br>3. Izinkan izin<br>4. Verify login berhasil | Login berhasil tanpa password<br>Akun terhubung dengan Google |
| 4 | **Social Login (Facebook)** | 1. Klik "Login dengan Facebook"<br>2. Masukkan kredensial FB<br>3. Verify login berhasil | Login berhasil tanpa password<br>Akun terhubung dengan Facebook |

### 2. **Login & Auth (Access Control)**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Login Password** | 1. Navigate to `/login`<br>2. Masuk email & password<br>3. Klik Login<br>4. Verify dashboard loads | Dashboard terbuka<br>Token disimpan di localStorage |
| 2 | **Login Passwordless (WhatsApp)** | 1. Klik "Masuk dengan WhatsApp"<br>2. Masukkan nomor WhatsApp<br>3. Terima kode OTP dari WhatsApp<br>4. Masukkan kode<br>5. Login berhasil | Login tanpa password<br>WhatsApp number terverifikasi |
| 3 | **Login Passwordless (Email)** | 1. Klik "Masuk dengan Email"<br>2. Masukkan email<br>3. Terima kode OTP via email<br>4. Masukkan kode<br>5. Login berhasil | Login tanpa password<br>Email terverifikasi |
| 4 | **Login with Magic Link** | 1. Request magic link via email<br>2. Buka email, klik link<br>3. Login otomatis | Login tanpa password<br>Link satu pakai |

### 3. **Dashboard & Onboarding (First Time User)**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Dashboard Load** | 1. Login sebagai user baru<br>2. Dashboard muncul<br>3. Cek statistik cards | Dashboard terbuka<br>Stats menampilkan 0 website, 0 leads |
| 2 | **Wizard Step 1: Business Name** | 1. Klik "Buat Website Baru"<br>2. Masukkan nama bisnis<br>3. Next ke langkah selanjutnya | Langkah 1 disimpan<br>Bisa kembali ke langkah sebelumnya |
| 3 | **Wizard Step 2: Description** | 1. Deskripsikan bisnis (jenis, produk, target)<br>2. AI generate konten<br>3. Next ke langkah selanjutnya | AI generate konten, desain, struktur |
| 4 | **Wizard Step 3: Template Pilih** | 1. Pilih template: Bold, Produk, Jasa, Kuliner, Elegant, Natural<br>2. Preview desain<br>3. Next ke langkah selanjutnya | Template diterapkan<br>Bisa preview website |
| 5 | **Wizard Step 4: Publish** | 1. Klik "Publish"<br>2. Pilih domain (subdomain atau custom)<br>3. Confirm publish | Website publish<br>URL website aktif |

### 4. **Domain & Publishing**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Connect Custom Domain** | 1. Create website<br>2. Buka tab "Domain"<br>3. Masukkan domain sendiri (contoh: `toko-ku.com`)<br>4. Ikuti instruksi DNS (CNAME/A record)<br>5. Verify verifikasi | Domain terhubung<br>Status: "Verifikasi"... hingga selesai |
| 2 | **Verify DNS Propagation** | 1. Wait 5-30 menit<br>2. Cek status di dashboard<br>3. Website langsung aktif | Status berubah menjadi "Active"<br>Website bisa diakses via domain |
| 3 | **Publish Site** | 1. Dari editor, klik "Publish"<br>2. Pilih domain (baru atau existing)<br>3. Confirm publish | Website live di `*.webjoz.com`<br>Atau domain kustom langsung aktif |

### 5. **Upgrade & Payment**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Upgrade Ke Paket Pro** | 1. Dari dashboard, klik "Upgrade Paket"<br>2. Pilih paket (Bulanan/Tahunan)<br>3. Masukkan metode pembayaran | Halaman pembayaran muncul<br>Pilihan Midtrans/PayPal |
| 2 | **Midtrans Payment (IDR)** | 1. Pilih pembayaran Midtrans<br>2. Pilih bank (BCA, Mandiri, BRI, BNI)<br>3. Atau E-Wallet (GoPay, OVO, DANA, ShopeePay)<br>4. Selesaikan pembayaran | Status pembayaran berubah menjadi "Sukses"<br>Akun naik ke paket Pro |
| 3 | **PayPal Payment (USD)** | 1. Pilih pembayaran PayPal<br>2. Sinkronisasi ke PayPal<br>3. Bayar via akun PayPal | Status pembayaran berubah menjadi "Sukses"<br>Akun naik ke paket Pro |
| 3 | **Manual Override by Admin** | 1. Admin login<br>2. Cari payment status "pending"<br>4. Force status menjadi "paid"<br>5. Akun user naik paket | Payment dipaksa menjadi sukses<br>Plan user aktif |

### 4. **Site Management (Post-Launch)**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Create Additional Website** | 1. Login<br>2. Klik "+ Website Baru"<br>2. Ulangi wizard proses<br>3. Website baru dibuat | Dashboard menampilkan 2 website |
| 2 | **Edit Website** | 1. Dari dashboard, klik website yang ada<br>2. Buka editor<br>3. Ubah konten/desain<br>4. Simpan perubahan | Perubahan tersimpan<br>Website di-update |
| 3 | **Delete Website** | 1. Dari dashboard, pilih website<br>2. Klik "Hapus" atau "Arsipkan"<br>3. Konfirmasi hapus | Website dihapus/dariarsipkan<br>Dashboard menampilkan jumlah website yang benar |

### 4. **Admin & Moderator Functions**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Admin Login** | 1. Gunakan akun admin (admin@webjoz.com / AdminPassword123!)<br>2. Login berhasil | Dashboard admin terbuka<br>Role: superadmin |
| 2 | **Moderator Capabilities** | 1. Login sebagai admin<br>2. Verify `isModerator` property aktif | Admin punya akses fitur moderator<br>Bisa lihat/moderate konten |
| 3 | **Manage Payments (Admin)** | 1. Dari menu Admin > Payments<br>2. Lihat daftar pembayaran<br>3. Force status payment menjadi "paid" | Daftar pembayaran muncul<br>Bisa ubah status manual |
| 4 | **User Management** | 1. Admin > Users > Lihat daftar user<br>2. Edit role user<br>3. Activate/Deactivate user | Daftar user muncul<br>Bisa mengubah role/user status |

### 5. **Responsive & Mobile Testing**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **Mobile Layout** | 1. Resize browser ke < 768px<br>2. Navigasi semua halaman<br>3. Coba sign up & login | UI menyesuaikan<br>Tidak ada element yang "pecah" |
| 2 | **Touch Friendly** | 1. Coba tap tombol di mobile<br>2. Scroll dengan gesture<br>3. Isi form dengan keyboard mobile | Semua interaksi bekerja<br>Keyboard muncul menutup form dengan benar |

### 5. **Error Handling & Edge Cases**
| # | Test Case | Steps | Expected Result |
|---|-----------|-------|----------------|
| 1 | **404 Page** | 1. Navigate ke URL yang salah (misal `/halamansalah`)<br>2. Verify custom 404 page | Halaman 404 menampilkan<br>Link navigasi still works |
| 2 | **Failed Login** | 1. Masukkan salah password 3x<br>3. Akun terkunci atau wait time | Pesan error muncul<br>Atau wait time sebelum bisa coba lagi |
| 3 | **Session Expired** | 1. Login, tunggu 30 menit<br>2. Refresh halaman<br>3. Coba aksi di dashboard | Session expired message<br>Harus login ulang |
| 4 | **Concurrent Login** | 1. Login dari Browser A<br>2. Login dari Browser B dengan akun yang sama<br>3. Coba aksi di Browser A | Browser A tetap bisa digunakan<br>Atau warning muncul di salah satu browser |

---

## 📊 Test Execution Priority

### **Phase 1: Critical Revenue Flows (Testing First)**
- [ ] Register → Email Verify → Login
- [ ] Wizard: Name → Description → Template → Publish
- [ ] Domain Purchase & Verification
- [ ] Payment: Midtrans sandbox → Activate plan
- [ ] Payment: PayPal → Activate plan
- [ ] Admin: Manual payment override

### **Phase 2: User Experience Flows**
- [ ] Social login (Google/Facebook)
- [ ] Passwordless (WhatsApp/Email OTP)
- [ ] Additional website creation
- [ ] Site editing & updates
- [ ] Admin user management

### **Phase 3: Edge Cases & Polish**
- [ ] 404 & error pages
- [ ] Session expiry
- [ ] Concurrent login
- [ ] Mobile responsiveness
- [ ] SEO meta tags

### **Phase 4: Performance**
- [ ] Page load times (< 3 detik)
- [ ] Core Web Vitals
- [ ] API response times
- [ ] Database query optimization

---

## 📝 Catatan Penting bagi QA

1. **Setiap fitur baru harus memiliki test case minimal 1 path happy path + 1 path negative**
2. **Flow bisnis harus diuji dari register hingga value delivery** (user mendapatkan nilai dari produk)
3. **Test data harus bersih** - setiap test harus bisa dijalankan berulang tanpa interfere test lain
4. **Data produksi jangan pernah rusak** - gunakan environment staging/test untuk test intensive
5. **Cek business logic**, bukan hanya "button muncul" - pastikan data berubah sebagaimana mestinya di database

---

## 🎯 Success Criteria untuk Launch

Business flows dianggap **lolos** jika:
- ✅ 100% register → verified → login sukses
- ✅ 100% wizard completion → website publish
- ✅ 100% domain purchase → aktivasi (atau gagal dengan pesan jelas)
- ✅ 100% payment berhasil (sandbox) → plan aktif
- ✅ Admin bisa override payment status
- ✅ Tidak ada data yang rusak setelah test extensive

---

*Document ini menggantikan dokumentasi QA langkah sebelumnya yang terlalu fokus pada UI. Step 3 ini fokus pada **value delivery** dan **critical business paths** untuk SaaS platform.*