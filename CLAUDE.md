# CLAUDE.md

Panduan untuk Claude Code saat bekerja di repositori ini.

## Tentang proyek

Website profil dan katalog kamar untuk **Kost H. Saifullah** — kost khusus laki-laki di
Simpang Empat, Batulicin, Kalimantan Selatan. Situs satu halaman (single page) berbahasa
Indonesia yang menampilkan daftar kamar beserta status ketersediaan, fasilitas, aturan,
galeri foto, lokasi, dan tombol pemesanan yang mengarah ke WhatsApp pemilik.

Kostnya terdiri dari **21 kamar dalam dua bentuk yang berbeda**:

| Kelompok | Jumlah | Nama | Fasilitas | Kapasitas | Tarif / bulan |
|---|---|---|---|---|---|
| Lantai bawah | 13 | Pintu 1, 2, 5 – 15 | Dapur & kamar mandi **sendiri** di tiap pintu | Maks. 2 orang | Rp 600.000 (1 org) · Rp 800.000 (2 org) |
| Lantai bawah | 2 | Pintu 3 & Pintu 4 | sama | **1 orang** | Rp 500.000 |
| Lantai atas | 6 | Kamar A1–A3, B1–B3 | Dapur bersama, blok kamar mandi bersama berisi 6 unit | **1 orang** | Rp 500.000 |

Ukuran kamar sengaja **tidak disimpan dan tidak ditampilkan** — ukurannya tidak seragam
dan pemilik tidak ingin memajangnya. Jangan menambahkan kembali field `ukuran`.

Perbedaan ini terekam di empat field kamar:

- `lantai` — untuk pengelompokan.
- `tipe` — mengisi dropdown filter.
- `maksOrang` — membatasi pilihan jumlah penghuni di form pra-pemesanan.
- `harga` + `hargaBerdua` — **tarif tergantung jumlah penghuni, bukan kelipatan.**
  `harga` selalu tarif untuk 1 orang; `hargaBerdua` hanya ditulis pada kamar yang
  memang boleh 2 orang. Jangan menambahkan `hargaBerdua` pada kamar `maksOrang: 1`.

Pemakaian tarif di `script.js` lewat dua helper: `hargaKamar(kamar, jumlahOrang)` untuk
tarif pasti, dan `hargaTeks(kamar)` untuk teks pajangan (satu angka, atau rentang
"Rp 600.000 – Rp 800.000" bila kamar punya dua tarif).

## Batasan arsitektur (penting)

**Situs statis murni — tidak ada backend, tidak ada build step, tidak ada dependensi npm.**

- Deploy ke hosting statis gratis (**Netlify**). Tidak ada server, database, maupun serverless function.
- Situs **tidak mengumpulkan, mengirim, atau menyimpan data pengunjung apa pun**.
  Semua interaksi berakhir sebagai teks pesan WhatsApp yang dikirim dari perangkat pengunjung sendiri.
- Jangan menambahkan framework, bundler, `package.json`, atau `node_modules` ke repo ini
  tanpa diminta. File dibuka langsung oleh browser apa adanya.
- Jangan menambahkan analytics, cookie, tracking pixel, atau form yang mengirim data ke server.

## Struktur file

```
index.html        Beranda: <head>, meta SEO/Open Graph, navbar, dan wadah kosong
                  (<div id="...">) yang diisi oleh JavaScript.
kamar.html        Halaman daftar lengkap 21 kamar + filter. Memakai css/style.css
                  dan js/script.js yang sama persis dengan beranda.
css/style.css     Seluruh gaya. Blok "PERBAIKAN & KOMPONEN TAMBAHAN" di paling
                  bawah sengaja menimpa aturan di atasnya — tambahkan override baru di sana.
js/data.js        SATU-SATUNYA sumber konten. Objek `KOS_DATA`.
js/status.js      HANYA status ketersediaan per kamar. Objek `STATUS_KAMAR`.
js/script.js      Render engine + interaktivitas. Tidak menyimpan konten apa pun.
admin.html        Alat bantu pemilik kost untuk menyusun ulang isi js/status.js.
js/admin.js       Logika admin.html. Tidak dipakai oleh index.html.
js/tema.js        Pemilih tema terang/gelap admin.html. WAJIB dimuat di <head>.
PANDUAN.md        Panduan non-teknis untuk pemilik kost.
netlify.toml      Konfigurasi deploy: publish dir, header keamanan (termasuk CSP), cache.
robots.txt        Perlu diperbarui domainnya setelah deploy.
sitemap.xml       Perlu diperbarui domainnya setelah deploy.
```

`js/status.js` sengaja dipisah dari `data.js`: status kamar berubah tiap minggu dan
pemiliknya bukan programmer, jadi tidak boleh sampai harus menyusuri file 750 baris
untuk menandai satu kamar terisi. Bacanya lewat `statusKamar(kamar)` di `script.js` —
**jangan pernah membaca `kamar.status` langsung**.

`statusKamar()` menormalkan nilainya lewat `ALIAS_STATUS` (huruf besar/kecil dan spasi
diabaikan; `'penuh'`/`'terisi'`, `'kosong'`/`'ada'`, `'hampir'` juga diterima). Dua
perilaku jatuh-tempo yang sengaja dibedakan:

- Kamar **tanpa baris** di `status.js` → `'tersedia'` (wajar untuk kamar yang baru
  ditambahkan ke `data.js`).
- Kamar dengan nilai **tidak dikenal** → `'tidak-tersedia'` + `console.warn`.
  Dulu ini jatuh ke `'tersedia'`, yang berarti salah ketik akan mengiklankan kamar
  penuh sebagai kosong — arah kegagalan yang paling merugikan pemilik kost.

`js/admin.js` menyalin daftar alias itu (`ALIAS_STATUS_ADMIN`) karena `admin.html`
tidak memuat `script.js`. Kalau salah satu berubah, ubah keduanya.

`admin.html` tidak menyimpan status kamar di mana pun; ia hanya membangkitkan ulang
seluruh isi `js/status.js` untuk disalin-tempel. Formatnya harus tetap sama persis
dengan file aslinya — kalau `buatIsiStatusJs()` di `js/admin.js` diubah, ubah juga
`js/status.js`.

### Tema terang/gelap di `admin.html`

Hanya `admin.html` yang punya pemilih tema; halaman pengunjung tidak. Mekanismenya:

- `js/tema.js` memasang atribut `data-tema="terang"`/`"gelap"` di `<html>`. **File ini
  wajib dimuat di dalam `<head>`** — kalau dipindah ke akhir `<body>`, halaman sempat
  berkedip terang dulu sebelum tema gelap terpasang. CSP `script-src 'self'` melarang
  skrip inline, jadi file terpisah adalah satu-satunya cara menjalankannya sedini itu.
- Palet gelap ditulis **sekali** di blok `:root[data-tema="gelap"]`, dan `@media
  (prefers-color-scheme: dark)` sengaja **tidak dipakai** di CSS. Preferensi sistem
  dibaca `js/tema.js` lewat `matchMedia`, lalu diterjemahkan jadi atribut tadi. Kalau
  palet dipecah antara blok `@media` dan blok atribut, keduanya harus disamakan terus —
  dan di situlah bug warna muncul.
- Setiap token warna di blok terang **wajib** punya pasangan di blok gelap. Token yang
  nilainya terpakai sebagai bidang padat (`--ok`, `--sedang`, `--penuh`) berbeda dari
  token teksnya (`--ok-teks`, dst.) karena ambang kontrasnya berbeda: 3:1 untuk
  komponen non-teks, 4,5:1 untuk teks.
- `--biru-tombol` + `--biru-atas` sengaja berbalik arah antar tema: mode terang memakai
  biru tua berteks putih, mode gelap memakai biru muda berteks gelap. Teks putih di atas
  biru muda hanya 2,7:1.

Pilihan temanya disimpan sebagai satu kata di `localStorage` perangkat pemilik kost
(kunci `kos-admin-tema`). Ini **bukan** pengecualian dari aturan "tidak menyimpan data
pengunjung" di atas: `admin.html` bukan halaman pengunjung (`noindex` + `Disallow` di
`robots.txt`), dan tidak ada apa pun yang dikirim keluar perangkat.

## Aturan kerja

### Konten selalu lewat `data.js`

Semua teks, harga, foto, dan daftar kamar berasal dari `KOS_DATA`. **Jangan pernah
menulis konten langsung (hardcode) di `script.js` atau `index.html`** — pemilik kost
harus bisa mengubah isi website hanya dengan menyunting `data.js`.

Field yang dipakai di banyak tempat: `nama`, `tagline` + `taglineSorot` (hero),
`deskripsi` (footer & structured data), `deskripsiSingkat` (hero), `nomorWA`,
`alamat` + `kota` + `provinsi`.

Status kamar hanya boleh salah satu dari: `'tersedia'`, `'hampir-penuh'`, `'tidak-tersedia'`
(lihat `STATUS_MAP` di `script.js`). Kamar berstatus `tidak-tersedia` otomatis memakai
tombol "Kabari" dengan pesan `waPesanTunggu`, bukan pesan pemesanan biasa.

### Dua halaman, satu `script.js`

Daftar kamar dipecah ke dua tempat supaya beranda tidak kepanjangan dan tidak dobel:

| Halaman | Isi | Batas tampil awal |
|---|---|---|
| `index.html` | Bagian "Kamar Tersedia" — hanya kamar berstatus `tersedia` | `jumlahKamarTersediaAwal` (3) |
| `kamar.html` | Seluruh 21 kamar + filter status/tipe/pencarian | `jumlahKamarAwal` (9) |

Keduanya memuat `script.js` yang sama. Yang menentukan bagian mana yang jalan adalah
**ada-tidaknya wadah di halaman itu** — setiap fungsi render diawali `if (!container) return;`.
Jadi `renderRoomAvailability()` mati sendiri di `kamar.html`, dan `applyRoomFilters()` mati
sendiri di beranda. **Jangan menambahkan pengecekan nama halaman**; cukup andalkan wadahnya.

Sisanya dibuka pengunjung sendiri lewat tombol "Tampilkan N kamar lainnya"
(`tampilkanLebihBanyakTersedia()` dan `tampilkanLebihBanyakKamar()`). **Satu klik membuka
semua sisanya sekaligus, bukan satu batch lagi** — memuat bertahap membuat orang menekan
tombol yang sama berulang kali dan terasa seperti macet. Angka di label tombol memang
jumlah yang akan muncul, jadi jangan diubah jadi bertahap lagi. Batas di `kamar.html`
di-reset setiap kali filter berubah — kalau tidak, mengganti filter setelah membuka semua
kamar akan terasa seperti filternya tidak bekerja.

Footer dirender di dua halaman, jadi tautan section-nya lewat helper `ke('#fasilitas')`
yang menambahkan `index.html` bila kita sedang tidak di beranda. Penandanya keberadaan
section `#beranda`, bukan URL. Scroll spy di `initNavigation()` juga hanya memantau
tautan berawalan `#` — di `kamar.html` navbar menunjuk `index.html#...`.

Pilihan pada dropdown **filter tipe tidak ditulis di `index.html`** — `renderTypeFilterOptions()`
mengisinya dari nilai `tipe` yang ada di daftar kamar. Menambah tipe kamar baru cukup
di `data.js` saja.

### Konvensi kode

- **Penamaan CSS: BEM** (`.room-card__title`, `.modal__gallery-nav--prev`). Warna, jarak,
  radius, dan bayangan memakai custom property di `:root` — jangan tulis nilai mentah.
- **Semua data yang masuk `innerHTML` wajib dibungkus `esc()`.** Sudah diterapkan menyeluruh;
  jangan buat pengecualian saat menambah render baru.
- **Ikon**: `iconSvg('nama', ukuran)`. Nama yang tersedia ada di objek `icons` di `script.js`.
  Nama yang tidak dikenal jatuh ke ikon `home` tanpa error.
- **Event listener untuk elemen yang dirender ulang harus lewat delegasi** di
  `initGlobalClickHandlers()`, bukan dipasang per elemen. Kartu kamar digambar ulang setiap
  filter berubah; memasang listener per tombol dulu menyebabkan listener menumpuk.
- **Listener `scroll` wajib dibungkus `rafThrottle()`**, input teks dibungkus `debounce()`.
- Dialog (modal kamar & lightbox) harus tetap punya: `role="dialog"`, `aria-modal`,
  jebakan fokus (`trapFocus`), tutup dengan Escape, dan pengembalian fokus ke elemen pemicu.

### Menambah resource eksternal

CSP diatur di `netlify.toml`. Menambah CDN, font, atau embed baru **harus** disertai
penambahan sumbernya di header `Content-Security-Policy` — kalau tidak, browser memblokirnya
di production tanpa pesan error yang jelas, padahal saat dibuka lokal terlihat normal.

Sumber yang saat ini diizinkan: Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`),
gambar dari `images.unsplash.com` dan `data:`, serta iframe peta dari `www.google.com`.

## Menjalankan secara lokal

Buka `index.html` langsung di browser sudah cukup. Untuk kondisi yang lebih mirip
production (embed peta dan `fetch` kadang rewel di `file://`), jalankan server statis apa pun,
misalnya `npx serve .` atau ekstensi Live Server di VS Code.

## Yang masih placeholder — WAJIB diganti sebelum publikasi

Situs ini **belum layak dipublikasikan** sampai empat hal ini diisi data asli:

1. Seluruh foto masih stok Unsplash, bukan foto kost asli. Ini bertabrakan dengan
   pesan situs sendiri yang memperingatkan calon penghuni agar mengecek wujud fisik kamar.
   Ke-21 kamar sekarang memakai foto placeholder yang sama per kelompok lantai.
2. Domain placeholder `https://kost-h-saifullah.netlify.app/` ada di `index.html`
   (`canonical`, `og:url`), `robots.txt`, dan `sitemap.xml`. Ganti dengan domain final,
   dan ganti `og:image` dengan foto asli kost berukuran 1200×630.
3. `KOS_DATA.formPraPesan.peraturan.items` masih rangkuman sementara yang disusun dari
   aturan yang sudah ada di situs. Ganti dengan peraturan asli dari pemilik kost.
4. Seluruh isi `js/status.js` masih `'tersedia'`. Pemilik kost harus menandai
   ketersediaan yang sebenarnya lewat `admin.html` sebelum situs disebarkan.

Sudah data asli: nomor WhatsApp, tarif, kapasitas, penamaan kamar, alamat lengkap,
serta peta (`mapsLink`/`mapsEmbed` menunjuk CID penanda resmi kost). Field `ukuran`
sudah dihapus dan **jangan ditambahkan kembali**.

## Form pra-pemesanan (penyaring sebelum WhatsApp)

**Situs ini sengaja tidak punya satu pun tombol WhatsApp umum.** Tombol mengambang,
tombol besar di section "Hubungi Kami", tombol di footer, dan nomor yang bisa diklik di
section Lokasi semuanya sudah dihapus — semuanya dulu melewati form penyaring ini.
Nomornya tetap dipajang sebagai teks biasa di tiga tempat itu. `waPesanUmum` juga sudah
dihapus dari `data.js`. **Jangan menambahkan tautan `wa.me` baru di luar kartu kamar.**
Hanya tiga pemakaian `waUrl(KOS_DATA.nomorWA, ...)` yang boleh ada di `script.js`:
tombol di kartu kamar, tombol di pop up detail, dan `window.open` di `kirimPraPesan()`.

Kedua tombol WhatsApp **milik sebuah kamar** (tombol "WA"/"Kabari" di kartu kamar dan
tombol besar di dalam pop up detail) tidak langsung membuka WhatsApp. Klik-nya ditangkap
oleh delegasi `[data-action="pra-pesan"]` di `initGlobalClickHandlers()`, lalu:

1. **Pop up pertanyaan** (`.prapesan-overlay`) — semua pertanyaan berupa pilihan (radio),
   tidak ada isian teks bebas. Opsi bisa dimatikan dengan dua cara, keduanya dirender
   memakai atribut `disabled` bawaan browser (abu-abu, tidak bisa diklik, dilewati Tab):
   - `nonaktif: true` — mati permanen, alasannya di `catatan`. Dipakai untuk "Perempuan".
   - `orang: n` — jumlah penghuni yang diwakili opsi itu. Opsi mati sendiri di kamar
     yang `maksOrang`-nya lebih kecil (alasannya di `catatanNonaktif`), dan angka yang
     sama dipakai untuk memilih tarif lewat `hargaKamar()`. Itu sebabnya opsi "2 orang"
     mati di Pintu 3, Pintu 4, dan seluruh kamar lantai atas.

   Tarif di kepala dialog ikut berubah begitu jumlah penghuni dipilih, dan tarif itu
   juga masuk ke isi pesan WhatsApp (argumen ketiga `waPesan` / `waPesanTunggu`).
2. **Pop up peraturan** (`.peraturan-overlay`) — menumpuk di atas pop up pertanyaan.
   Setiap peraturan wajib dicentang satu per satu sebelum tombol "Setuju" aktif; setelah
   setuju, pengunjung kembali ke pop up pertanyaan dengan status tercatat.
3. Tombol lanjut baru aktif bila semua pertanyaan dijawab dan peraturan disetujui.

Catatan saat menyunting:

- **Tetap tanpa backend.** Jawaban tidak dikirim atau disimpan ke mana pun, hanya dirangkai
  jadi isi pesan WhatsApp lewat `formPraPesan.waPesan` / `waPesanTunggu` di `data.js`.
- Semua pertanyaan, opsi, peraturan, dan label tombol ada di `KOS_DATA.formPraPesan`.
  Jangan menulis teksnya di `script.js`.
- `formPraPesan.aktif: false` mematikan form — tombol WhatsApp kembali jadi tautan biasa.
  Tautan `wa.me` tetap ada di atribut `href` sebagai cadangan bila form gagal dibuka.
- Kedua pop up ini menumpuk di atas modal kamar, jadi `modalKeyHandler()` sengaja berhenti
  lebih awal saat salah satunya terbuka agar Escape tidak menutup dua dialog sekaligus.
