# Project preview images

Taruh screenshot preview tiap proyek di folder ini.

## Penamaan file
Gunakan **slug proyek** (lihat `src/data/projects.js`) dengan ekstensi `.webp`.
Fallback juga didukung: `.png`, `.jpg`, `.jpeg` — tapi kalau pakai ekstensi
selain `.webp`, sesuaikan nilai `image` di `src/data/projects.js`.

Contoh (sesuai yang sudah terdaftar):
- ms-construction.webp
- morarep.webp
- attacargo.webp
- kusuma-jp.webp
- impost-media.webp
- villa-tebing-buluh.webp
- hris-im.webp
- wspace-im.webp
- ops-im.webp

## Ukuran yang dipakai
- Lebar: **1280 px** (tinggi mengikuti rasio asli screenshot)
- Format: **WebP**, target **< 100 KB** per gambar
- Preview di kartu di-crop ke rasio **16:10** dan memakai bagian **atas**
  halaman, jadi pastikan bagian hero/atas situs terlihat.

## Kalau belum diupload
Kartu otomatis menampilkan fallback **gradient + inisial** nama proyek, jadi
halaman tetap rapi walau gambar belum ada.
