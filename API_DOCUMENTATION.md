# 📚 API Documentation - Backend SDG 11

Dokumentasi lengkap REST API untuk Backend SDG 11. Backend ini menggunakan **Node.js, Express, MySQL, JWT Authentication, dan OTP Account Verification via Nodemailer**.

---

## 🌐 Base URL
```http
http://localhost:8000
```

---

## 🔐 Autentikasi & Header
Untuk endpoint terproteksi (*Protected Endpoints*), sertakan **Bearer Token** pada HTTP Header:

```http
Authorization: Bearer <TOKEN_JWT_ANDA>
Content-Type: application/json
```

> ⚠️ **Catatan Proteksi Akun & Identifikasi (Public ID)**:
> - Seluruh protected endpoint memerlukan **Token JWT yang Valid** dan **Status Akun Terverifikasi (`is_verified = true`)**. Apabila pengguna belum memverifikasi OTP, server akan mengembalikan respon **HTTP 403 Forbidden**.
> - Seluruh endpoint untuk fetch data (GET), update (PUT), dan delete (DELETE) menggunakan `public_id` sebagai identifier eksternal guna keamanan data.

---

## 📑 Daftar Isi Endpoint
1. [Authentication & OTP (`/auth`)](#1-authentication--otp-endpoints)
2. [User Management (`/users`)](#2-user-management-endpoints)
3. [Role Management (`/roles`)](#3-role-management-endpoints)
4. [Profil Donatur (`/donors`)](#4-profil-donatur-endpoints)
5. [Profil Penerima (`/receivers`)](#5-profil-penerima-endpoints)
6. [Donasi Makanan (`/donations/food`)](#6-donasi-makanan-endpoints)
7. [Donasi Uang (`/donations/money`)](#7-donasi-uang-endpoints)
8. [Permintaan Donasi (`/donation-requests`)](#8-permintaan-donasi-endpoints)

---

## 1. Authentication & OTP Endpoints

### 1.1 Registrasi Pengguna Baru
- **URL**: `/auth/register`
- **Method**: `POST`
- **Akses**: Public
- **Request Body**:
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@gmail.com",
    "password": "password123",
    "phone": "081234567890",
    "role": "donor"
  }
  ```
  > 📌 **Ketentuan Field `role`**: Wajib diisi salah satu antara `"donor"` atau `"receiver"`.

- **Response Success (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Registrasi berhasil! Kode OTP telah dikirimkan ke email Anda.",
    "data": {
      "id": "id_k9f8a7b",
      "name": "Budi Santoso",
      "email": "budi@gmail.com",
      "is_verified": false,
      "role": "donor"
    }
  }
  ```

---

### 1.2 Verifikasi Kode OTP
- **URL**: `/auth/verify-otp`
- **Method**: `POST`
- **Akses**: Public
- **Request Body**:
  ```json
  {
    "email": "budi@gmail.com",
    "otp": "492817"
  }
  ```

---

### 1.3 Kirim Ulang Kode OTP
- **URL**: `/auth/resend-otp`
- **Method**: `POST`
- **Akses**: Public
- **Request Body**:
  ```json
  { "email": "budi@gmail.com" }
  ```

---

### 1.4 Login Pengguna
- **URL**: `/auth/login`
- **Method**: `POST`
- **Akses**: Public
- **Request Body**:
  ```json
  {
    "email": "budi@gmail.com",
    "password": "password123"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Login berhasil",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "id_k9f8a7b",
        "name": "Budi Santoso",
        "email": "budi@gmail.com",
        "is_verified": true,
        "roles": ["donor"],
        "role": "donor"
      }
    }
  }
  ```

---

### 1.5 Logout Pengguna
- **URL**: `/auth/logout`
- **Method**: `POST`

---

## 2. User Management Endpoints

> 🔐 **Akses**: Token Auth Admin + `is_verified = true`.

### 2.1 Get All Users
- **URL**: `GET /users`
- **Akses**: Admin Only

### 2.2 Get User By Public ID
- **URL**: `GET /users/:id`
- **Akses**: Admin Only

### 2.3 Create User (Oleh Admin)
- **URL**: `POST /users/create`
- **Akses**: Admin Only

### 2.4 Update User
- **URL**: `PUT /users/:id`
- **Akses**: Admin Only

### 2.5 Delete User
- **URL**: `DELETE /users/:id`
- **Akses**: Admin Only

---

## 3. Role Management Endpoints

> 🔐 **Akses**: Token Auth Admin + `is_verified = true`.

- `GET /roles` - Get All Roles
- `GET /roles/:id` - Get Role Detail
- `POST /roles/create` - Create Role Baru
- `PUT /roles/:id` - Update Role
- `DELETE /roles/:id` - Delete Role

---

## 4. Profil Donatur Endpoints

> 🔐 **Akses**: Token Auth + `is_verified = true`.

### 4.1 Buat / Update Profil Donatur
Membuat atau memperbarui profil donatur. `business_name` bersifat **opsional**.

- **URL**: `POST /donors/profile` atau `PUT /donors/profile`
- **Akses**: `donor` atau `admin`
- **Request Body**:
  ```json
  {
    "business_name": "Warung Berkah",
    "business_type": "warung",
    "address": "Jl. Merdeka No. 12, Jakarta",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "operational_hours": "Senin-Jumat 08:00-17:00",
    "description": "Warung makan yang siap berbagi untuk sesama"
  }
  ```
  > 📌 `business_name` bersifat **opsional** — boleh diisi `null` atau dikosongkan.

- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Profil donatur berhasil dibuat.",
    "data": {
      "public_id": "donor_b6b35yvmjaf",
      "business_name": "Warung Berkah",
      "business_type": "warung",
      "address": "Jl. Merdeka No. 12, Jakarta",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "operational_hours": "Senin-Jumat 08:00-17:00",
      "description": "Warung makan yang siap berbagi untuk sesama",
      "is_verified": 0,
      "user_name": "Budi Santoso",
      "user_email": "budi@gmail.com",
      "user_phone": "081234567890"
    }
  }
  ```

---

### 4.2 Get Profil Donatur Saya
- **URL**: `GET /donors/profile`
- **Akses**: `donor` (atau `admin`)
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "public_id": "donor_b6b35yvmjaf",
      "business_name": "Warung Berkah",
      "business_type": "warung",
      "address": "Jl. Merdeka No. 12",
      "is_verified": 1,
      "user_name": "Budi Santoso",
      "user_email": "budi@gmail.com"
    }
  }
  ```

---

### 4.3 Get Semua Donatur
- **URL**: `GET /donors`
- **Akses**: Admin Only
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "total": 2,
    "data": [...]
  }
  ```

---

### 4.4 Verifikasi Profil Donatur (Admin)
- **URL**: `PUT /donors/:id/verify`
- **Params**: `:id` adalah `public_id` profil donatur (misal: `donor_b6b35yvmjaf`)
- **Akses**: Admin Only
- **Request Body**:
  ```json
  { "is_verified": true }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Status verifikasi donatur 'donor_b6b35yvmjaf' berhasil diperbarui menjadi Terverifikasi."
  }
  ```

---

## 5. Profil Penerima Endpoints

> 🔐 **Akses**: Token Auth + `is_verified = true`.

### 5.1 Buat / Update Profil Penerima
- **URL**: `POST /receivers/profile` atau `PUT /receivers/profile`
- **Akses**: `receiver` atau `admin`
- **Request Body**:
  ```json
  {
    "receiver_type": "panti asuhan",
    "address": "Jl. Pemuda No. 45, Bandung",
    "latitude": -6.9175,
    "longitude": 107.6191,
    "description": "Panti asuhan yang menampung 50 anak yatim piatu"
  }
  ```
  > 📌 `receiver_type` pilihan: `individu`, `komunitas`, `panti asuhan`, atau `lainnya`.

- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Profil penerima berhasil dibuat.",
    "data": {
      "public_id": "rcv_lon2ezbymt",
      "receiver_type": "panti asuhan",
      "address": "Jl. Pemuda No. 45, Bandung",
      "is_verified": 0,
      "user_name": "Siti Aminah",
      "user_email": "siti@gmail.com"
    }
  }
  ```

---

### 5.2 Get Profil Penerima Saya
- **URL**: `GET /receivers/profile`
- **Akses**: `receiver` (atau `admin`)

---

### 5.3 Get Semua Penerima
- **URL**: `GET /receivers`
- **Akses**: Admin Only

---

### 5.4 Verifikasi Profil Penerima (Admin)
- **URL**: `PUT /receivers/:id/verify`
- **Params**: `:id` adalah `public_id` profil penerima (misal: `rcv_lon2ezbymt`)
- **Akses**: Admin Only
- **Request Body**:
  ```json
  { "is_verified": true }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Status verifikasi penerima 'rcv_lon2ezbymt' berhasil diperbarui menjadi Terverifikasi."
  }
  ```

---

## 6. Donasi Makanan Endpoints

### 6.1 Tambah Donasi Makanan
- **URL**: `POST /donations/food`
- **Akses**: `donor` atau `admin`
- **Request Body**:
  ```json
  {
    "title": "Nasi Box Berkah",
    "description": "Nasi box ayam bakar komplit untuk 500 orang",
    "food_type": "makanan berat",
    "photo_url": "https://example.com/photo.jpg",
    "total_portions": 500,
    "pickup_address": "Jl. Merdeka No. 12, Jakarta",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "pickup_start_at": "2026-08-20T08:00:00",
    "pickup_end_at": "2026-08-20T12:00:00"
  }
  ```
  > 📌 `total_portions` wajib diisi dan > 0. `available_portions` akan otomatis diinisialisasi sama dengan `total_portions`.

- **Response Success (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Donasi makanan berhasil ditambahkan.",
    "data": {
      "public_id": "food_gx63diam1bs",
      "title": "Nasi Box Berkah",
      "food_type": "makanan berat",
      "total_portions": 500,
      "available_portions": 500,
      "status": "available",
      "donor_public_id": "donor_b6b35yvmjaf",
      "donor_name": "Budi Santoso"
    }
  }
  ```

---

### 6.2 Get Daftar Donasi Makanan
- **URL**: `GET /donations/food`
- **Akses**: Public (tidak perlu login)
- **Query Params (opsional)**:
  | Param | Deskripsi | Contoh |
  |---|---|---|
  | `status` | Filter berdasarkan status | `available`, `claimed`, `expired`, `cancelled` |
  | `food_type` | Filter berdasarkan tipe makanan | `makanan berat`, `ringan` |
  | `search` | Pencarian berdasarkan judul / deskripsi | `nasi` |

- **Contoh**: `GET /donations/food?status=available&search=nasi`
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "total": 1,
    "data": [
      {
        "public_id": "food_gx63diam1bs",
        "title": "Nasi Box Berkah",
        "total_portions": 500,
        "available_portions": 200,
        "status": "available",
        "donor_name": "Budi Santoso"
      }
    ]
  }
  ```

---

### 6.3 Get Detail Donasi Makanan
- **URL**: `GET /donations/food/:id`
- **Akses**: Public
- **Params**: `:id` adalah `public_id` food item (misal: `food_gx63diam1bs`)
- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "public_id": "food_gx63diam1bs",
      "title": "Nasi Box Berkah",
      "description": "Nasi box ayam bakar komplit",
      "food_type": "makanan berat",
      "total_portions": 500,
      "available_portions": 200,
      "pickup_address": "Jl. Merdeka No. 12",
      "status": "available",
      "donor_public_id": "donor_b6b35yvmjaf",
      "donor_name": "Budi Santoso",
      "donor_email": "budi@gmail.com",
      "donor_phone": "081234567890"
    }
  }
  ```

---

### 6.4 Update Donasi Makanan
- **URL**: `PUT /donations/food/:id`
- **Akses**: `donor` atau `admin`
- **Request Body** (semua field opsional):
  ```json
  {
    "title": "Nasi Box Berkah (Updated)",
    "status": "cancelled"
  }
  ```

---

### 6.5 Hapus Donasi Makanan
- **URL**: `DELETE /donations/food/:id`
- **Akses**: `donor` atau `admin`

---

## 7. Donasi Uang Endpoints

### 7.1 Tambah Donasi Uang
- **URL**: `POST /donations/money`
- **Akses**: `donor` atau `admin`
- **Request Body**:
  ```json
  {
    "title": "Donasi Operasional Dapur Ummat",
    "description": "Bantuan dana pengadaan piring dan kompor",
    "amount": 1000000,
    "payment_method": "Bank Transfer (BCA)",
    "status": "pending"
  }
  ```
  > 📌 `amount` wajib diisi dan > 0. `status` default: `pending`. Pilihan: `pending`, `completed`, `cancelled`.

- **Response Success (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Donasi uang berhasil ditambahkan.",
    "data": {
      "public_id": "mny_58ebqq3316x",
      "title": "Donasi Operasional Dapur Ummat",
      "amount": "1000000.00",
      "payment_method": "Bank Transfer (BCA)",
      "status": "pending",
      "donor_public_id": "donor_b6b35yvmjaf",
      "donor_name": "Budi Santoso"
    }
  }
  ```

---

### 7.2 Get Daftar Donasi Uang
- **URL**: `GET /donations/money`
- **Akses**: Public

---

### 7.3 Get Detail Donasi Uang
- **URL**: `GET /donations/money/:id`
- **Akses**: Public
- **Params**: `:id` adalah `public_id` donasi uang (misal: `mny_58ebqq3316x`)

---

## 8. Permintaan Donasi Endpoints

> 🔐 **Akses**: Token Auth + `is_verified = true`.

### 8.1 Buat Permintaan Donasi Makanan
Penerima manfaat mengajukan permintaan donasi makanan dari item yang tersedia.

- **URL**: `POST /donation-requests`
- **Akses**: `receiver` atau `admin`
- **Request Body**:
  ```json
  {
    "food_item_public_id": "food_gx63diam1bs",
    "requested_portions": 300,
    "notes": "Untuk konsumsi anak panti selama 3 hari"
  }
  ```
  > 📌 `requested_portions` tidak boleh melebihi `available_portions` dari item donasi makanan yang dipilih.

- **Response Success (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Permintaan donasi makanan berhasil diajukan dan menunggu persetujuan (status: pending).",
    "data": {
      "public_id": "req_bqirmemsemp",
      "requested_portions": 300,
      "status": "pending",
      "notes": "Untuk konsumsi anak panti selama 3 hari",
      "food_public_id": "food_gx63diam1bs",
      "food_title": "Nasi Box Berkah",
      "total_portions": 500,
      "available_portions": 500,
      "receiver_name": "Siti Aminah"
    }
  }
  ```

- **Response Error Porsi Tidak Cukup (400 Bad Request)**:
  ```json
  {
    "status": "error",
    "message": "Jumlah porsi yang diminta (600) melebihi porsi yang tersedia (500)."
  }
  ```

---

### 8.2 Get Daftar Permintaan Donasi
- **URL**: `GET /donation-requests`
- **Akses**: Semua user terautentikasi
- **Query Params (opsional)**:
  | Param | Deskripsi | Contoh |
  |---|---|---|
  | `status` | Filter berdasarkan status | `pending`, `confirmed`, `picked_up`, `cancelled`, `rejected` |
  | `food_item_id` | Filter berdasarkan public_id food item | `food_gx63diam1bs` |

- **Response Success (200 OK)**:
  ```json
  {
    "status": "success",
    "total": 1,
    "data": [
      {
        "public_id": "req_bqirmemsemp",
        "requested_portions": 300,
        "status": "confirmed",
        "confirmed_at": "2026-08-17T16:45:31.000Z",
        "food_public_id": "food_gx63diam1bs",
        "food_title": "Nasi Box Berkah",
        "available_portions": 200,
        "receiver_name": "Siti Aminah",
        "donor_name": "Budi Santoso"
      }
    ]
  }
  ```

---

### 8.3 Get Detail Permintaan Donasi
- **URL**: `GET /donation-requests/:id`
- **Akses**: Semua user terautentikasi
- **Params**: `:id` adalah `public_id` request (misal: `req_bqirmemsemp`)

---

### 8.4 Update Status Permintaan Donasi ⭐ (Logika Pemotongan Porsi)
Admin atau Donor mengubah status permintaan donasi.

- **URL**: `PUT /donation-requests/:id/status`
- **Akses**: `donor` atau `admin`
- **Request Body**:
  ```json
  {
    "status": "confirmed",
    "notes": "Disetujui oleh admin"
  }
  ```

- **Pilihan Status**:
  | Status | Deskripsi | Efek pada Porsi |
  |---|---|---|
  | `pending` | Menunggu persetujuan | Tidak ada perubahan |
  | `confirmed` | **Disetujui** oleh admin/donor | ✅ Porsi dikurangi otomatis (`available_portions -= requested_portions`). Jika sisa 0, status donasi menjadi `claimed`. |
  | `picked_up` | Sudah diambil oleh penerima | Tidak ada perubahan |
  | `cancelled` | Dibatalkan (setelah confirmed) | ✅ Porsi dikembalikan (*restored*) |
  | `rejected` | Ditolak (setelah confirmed) | ✅ Porsi dikembalikan (*restored*) |
  | `expired` | Kadaluwarsa | Tidak ada perubahan |

- **Response Success - Confirmed (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Status permintaan donasi 'req_bqirmemsemp' berhasil diperbarui menjadi 'confirmed'.",
    "data": {
      "request_public_id": "req_bqirmemsemp",
      "request_status": "confirmed",
      "requested_portions": 300,
      "remaining_food_portions": 200,
      "food_status": "available"
    }
  }
  ```

- **Response Success - Confirmed (Semua Porsi Habis → Claimed) (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Status permintaan donasi 'req_xyz' berhasil diperbarui menjadi 'confirmed'.",
    "data": {
      "request_public_id": "req_xyz",
      "request_status": "confirmed",
      "requested_portions": 200,
      "remaining_food_portions": 0,
      "food_status": "claimed"
    }
  }
  ```

- **Response Error Porsi Tidak Cukup (400 Bad Request)**:
  ```json
  {
    "status": "error",
    "message": "Gagal menyetujui request. Porsi yang tersisa (100) tidak mencukupi permintaan (300)."
  }
  ```

---

## ⚙️ Ringkasan Status HTTP Response
- `200 OK`: Request berhasil dieksekusi.
- `201 Created`: Resource baru berhasil dibuat.
- `400 Bad Request`: Parameter/Body input tidak lengkap atau tidak valid.
- `401 Unauthorized`: Token autentikasi tidak ada atau tidak valid.
- `403 Forbidden`: Akses ditolak karena role tidak diizinkan atau **akun belum diverifikasi OTP (`is_verified = false`)**.
- `404 Not Found`: Data tidak ditemukan.
- `500 Internal Server Error`: Terjadi kesalahan pada server.

---

## 🗂️ Ringkasan Tabel Database

| Tabel | Deskripsi |
|---|---|
| `users` | Data akun pengguna |
| `roles` | Data role (admin, donor, receiver) |
| `user_roles` | Junction table RBAC |
| `otps` | Kode OTP verifikasi email |
| `donors` | Profil detail donatur (`business_name` opsional) |
| `receivers` | Profil detail penerima manfaat |
| `food_items` | Data donasi makanan (`total_portions`, `available_portions`, `status`) |
| `money_donations` | Data donasi uang |
| `donation_requests` | Pengajuan permintaan donasi dari receiver ke food_item |
