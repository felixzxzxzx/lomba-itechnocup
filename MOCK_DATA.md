# FoodBridge Mock Data

Frontend saat ini berjalan tanpa MySQL menggunakan `front-end/utils/mockApi.ts`.
Service tersebut meniru bentuk data backend untuk `users`, `food_items`, dan `donation_requests`, lalu menyimpannya di `localStorage` browser.

## Akun Demo

| Peran | Email | Password |
| --- | --- | --- |
| Donatur | `donatur@foodbridge.test` | `password123` |
| Penerima | `penerima@foodbridge.test` | `password123` |

## Alur Demo

1. Login dengan akun penerima untuk melihat donasi tersedia.
2. Pilih makanan, tentukan jumlah porsi, lalu konfirmasi klaim.
3. Stok makanan berkurang dan `donation_request` serta riwayat tersimpan di browser.
4. Login dengan akun donatur untuk mempublikasikan donasi baru dari `/donasi/tambah`.

Untuk mengulang seed awal, hapus data situs dengan menjalankan `localStorage.removeItem('foodbridge-mock-db')` dan `localStorage.removeItem('foodbridge-session')` dari DevTools browser.

## Pindah Ke Backend

Saat API siap dipakai, fungsi di `mockApi.ts` dapat diganti implementasi HTTP dengan kontrak endpoint di `back-end/API_DOCUMENTATION.md`. Komponen dan halaman tidak perlu mengubah bentuk data lagi.