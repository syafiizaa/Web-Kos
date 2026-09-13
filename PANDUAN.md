# Panduan Pemilik — Website Kost H. Saifullah

Panduan ini untuk **pemilik/pengelola kost**, bukan untuk programmer.
Tidak perlu bisa coding — semua tugas di bawah cuma soal mengganti tulisan di dalam file.

---

## Yang perlu dipahami dulu

Website ini **tidak punya halaman login dan tidak punya database.** Isinya tersimpan
sebagai tulisan biasa di dalam beberapa file. Jadi setiap perubahan selalu tiga langkah
yang sama:

1. Buka filenya (pakai Notepad, VS Code, atau editor teks apa pun).
2. Ganti tulisannya.
3. Unggah ulang ke Netlify.

Selama langkah 3 belum dilakukan, **website yang dilihat orang belum berubah.**

Kabar baiknya: karena tidak ada database, website ini tidak bisa diretas lewat form,
tidak menyimpan data pengunjung, dan tidak akan "down" karena servernya penuh.

### File mana untuk apa

| File | Isinya |
|---|---|
| `js/status.js` | **Kamar mana yang kosong dan mana yang terisi.** Ini yang paling sering diubah. |
| `js/data.js` | Semua isi website: harga, foto, nomor WhatsApp, peraturan, fasilitas, alamat. |
| `admin.html` | Alat bantu untuk mengubah status kamar tanpa mengetik manual. |
| `index.html`, `kamar.html`, `css/`, `js/script.js` | Kerangka dan tampilan. **Jangan diutak-atik** kecuali paham. |

### Website ini punya dua halaman

- **Beranda (`index.html`)** — profil kost, fasilitas, aturan, galeri, lokasi, dan
  bagian "Kamar Tersedia" yang cuma memajang 3 kamar dulu. Pengunjung bisa menekan
  "Tampilkan kamar tersedia lainnya" kalau mau lihat lebih banyak.
- **Daftar Kamar (`kamar.html`)** — seluruh 21 kamar lengkap dengan filter status,
  filter tipe, dan kolom pencarian.

Anda tidak perlu menyunting kedua halaman itu. Isinya sama-sama diambil dari
`js/data.js` dan `js/status.js`, jadi satu perubahan langsung terlihat di dua-duanya.

---

## 1. Mengubah status kamar (paling sering)

Ada tiga status yang bisa dipakai:

| Status | Artinya di website |
|---|---|
| `tersedia` | Kamar hijau "Tersedia", bisa dipesan. |
| `hampir-penuh` | Kamar kuning "Hampir Penuh". Masih bisa dipesan. |
| `tidak-tersedia` | Kamar merah "Tidak Tersedia". Tombolnya berubah jadi **"Kabari"**, dan pesan WhatsApp-nya otomatis jadi permintaan dikabari kalau kamar itu kosong. |

### Cara mudah — lewat `admin.html`

1. Buka file `admin.html` dengan klik dua kali (terbuka di browser).
2. Klik status yang benar untuk tiap kamar. Angka ringkasan di atas ikut berubah.
3. Klik **Salin hasil**.
4. Buka `js/status.js`, **hapus seluruh isinya**, tempel hasil salinan tadi, simpan.
5. Unggah ulang ke Netlify (lihat bagian 7).

Di pojok kanan atas ada pilihan **Terang** dan **Gelap** untuk mengatur tampilan
halaman ini. Pilihan Anda diingat, jadi lain kali dibuka tampilannya sudah sesuai.
Kalau belum pernah dipilih, tampilannya mengikuti setelan HP atau komputer Anda.
Ini cuma soal tampilan — tidak memengaruhi website sama sekali.

Dua penanda yang membantu Anda tidak kehilangan jejak:

- Kamar yang baru Anda klik diberi label biru **DIUBAH**. Labelnya hilang sendiri
  kalau statusnya dikembalikan seperti isi file semula.
- Keterangan di bilah atas menghitung berapa kamar yang diubah dan mengingatkan
  bahwa hasilnya **belum ditempel** ke `js/status.js`. Sesudah menekan **Salin hasil**,
  keterangan di bawah kotak teks memberi tahu kalau Anda mengubah status lagi
  sesudah menyalin — kalau begitu, tekan **Salin hasil** sekali lagi.

Halaman `admin.html` ini tidak menyimpan apa pun sendiri — dia cuma menuliskan teks
yang perlu Anda tempel. Jadi kalau salah klik, tutup saja halamannya tanpa menyalin,
tidak ada yang berubah.

> Halaman ini ikut terunggah ke internet dan bisa dibuka siapa saja. Itu tidak berbahaya,
> karena dia tidak bisa mengubah website — dia cuma alat penulis teks. Tapi kalau tidak
> mau terlihat orang, hapus saja file `admin.html` dan `js/admin.js` dari Netlify,
> lalu pakai cara manual di bawah.

### Cara manual — langsung di `js/status.js`

Buka `js/status.js`, cari baris kamarnya, ganti tulisan di dalam tanda kutip:

```js
'pintu-7':  'tersedia',              // Pintu 7
```

menjadi

```js
'pintu-7':  'tidak-tersedia',        // Pintu 7
```

Yang boleh diubah **hanya tulisan di dalam tanda kutip kedua**. Jangan hapus tanda kutip,
titik dua, atau koma.

Tidak perlu hafal tulisan panjangnya — kata sehari-hari juga diterima, huruf besar/kecil
bebas:

| Anda tulis | Hasilnya |
|---|---|
| `'tersedia'`, `'kosong'`, `'ada'` | Tersedia |
| `'hampir-penuh'`, `'hampir'` | Hampir Penuh |
| `'tidak-tersedia'`, `'penuh'`, `'terisi'` | Tidak Tersedia |

Kalau tulisannya tetap tidak dikenal, kamar itu ditandai **Tidak Tersedia**. Ini disengaja:
lebih baik kehilangan satu penanya daripada mengiklankan kamar penuh sebagai kosong, lalu
orangnya datang jauh-jauh dan kecewa.

---

## 2. Mengubah harga

Buka `js/data.js`, cari nama kamarnya, lalu ubah angkanya. Contoh:

```js
nama: 'Pintu 1',
harga: 600000,        <- tarif kalau dihuni 1 orang
hargaBerdua: 800000,  <- tarif kalau dihuni 2 orang
```

- Tulis angkanya **tanpa titik dan tanpa "Rp"**. `600000`, bukan `Rp 600.000`.
- `hargaBerdua` hanya ada pada kamar yang memang boleh diisi 2 orang.
  Kamar khusus 1 orang (Pintu 3, Pintu 4, dan semua kamar lantai atas) tidak punya baris ini —
  **jangan ditambahkan**, nanti tampilan harganya jadi salah.
- Rentang harga di halaman depan dan di Google ikut menyesuaikan sendiri.

---

## 3. Mengubah nomor WhatsApp

Nomor yang terpasang sekarang adalah **0812-9525-6232**. Kalau suatu saat berganti,
ubah di bagian atas `js/data.js`:

```js
nomorWA: '6281295256232',
```

Tulis dengan kode negara **62**, tanpa tanda `+`, tanpa spasi, tanpa strip.
Angka `0` di depan diganti `62` — jadi `0812-9525-6232` ditulis `'6281295256232'`.

Satu nomor ini dipakai oleh semua tombol WhatsApp di seluruh website.

> **Penting:** website ini sengaja **tidak punya tombol WhatsApp umum** — tidak ada
> tombol mengambang di pojok, tidak ada tombol "Hubungi Kami" di footer. Satu-satunya
> jalan ke WhatsApp adalah tombol pesan pada masing-masing kamar, yang selalu melewati
> pertanyaan penyaring dan persetujuan peraturan. Nomornya tetap dipajang sebagai teks
> di bagian Lokasi, footer, dan "Masih Ada Pertanyaan?". Kalau nanti Anda menambahkan
> tombol WhatsApp baru di luar kartu kamar, penyaring itu jadi bisa dilewati.

---

## 4. Mengisi peta Google Maps

Anda sudah punya penanda kost di Google Maps, jadi tinggal mengambil dua tautan dari situ.
Paling gampang dikerjakan **lewat komputer**, bukan HP.

### Langkah 1 — buka penanda kost Anda

Buka [google.com/maps](https://www.google.com/maps), cari nama kost Anda sampai
penandanya muncul dan panel keterangannya terbuka di sebelah kiri.

### Langkah 2 — ambil tautan untuk tombol "Buka di Google Maps"

1. Klik tombol **Share / Bagikan**.
2. Pilih tab **Send a link / Kirim tautan**.
3. Klik **Copy link / Salin tautan**. Hasilnya kira-kira
   `https://maps.app.goo.gl/AbCdEf123`.
4. Buka `js/data.js`, tempel menggantikan tautan lama di baris `mapsLink`:

```js
mapsLink: 'https://maps.app.goo.gl/AbCdEf123',
```

### Langkah 3 — ambil peta yang tampil di halaman

1. Klik **Share / Bagikan** lagi.
2. Kali ini pilih tab **Embed a map / Sematkan peta**.
3. Klik **COPY HTML / SALIN HTML**. Yang tersalin adalah kode panjang seperti ini:

```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12..." width="600" height="450"></iframe>
```

4. Buka `js/data.js`, tempel menggantikan isi baris `mapsEmbed`:

```js
mapsEmbed: '<iframe src="https://www.google.com/maps/embed?pb=!1m18..." width="600"></iframe>',
```

**Boleh ditempel utuh seperti itu** — website akan mengambil sendiri bagian yang
diperlukan. Kalau mau lebih rapi, tempel bagian di dalam `src="..."` saja.

### Yang sering bikin peta tidak muncul

- **Salah tab.** Tautan dari "Send a link" tidak bisa dipakai untuk `mapsEmbed`, dan
  sebaliknya. Keduanya harus diambil sendiri-sendiri.
- **Alamatnya bukan `https://www.google.com/maps/embed`.** Demi keamanan, website ini
  hanya mengizinkan peta dari alamat itu. Alamat lain akan diblokir dan petanya jadi
  kotak kosong — dan anehnya, saat dibuka di komputer sendiri sering terlihat normal,
  baru ketahuan setelah diunggah. Jadi selalu cek ulang setelah diunggah.
- **Tanda kutip kehapus.** Isi `mapsEmbed` harus tetap diapit tanda kutip tunggal `'`
  di awal dan akhir. Kalau kode dari Google mengandung tanda kutip tunggal (jarang),
  pakai bagian `src="..."` saja.

Kalau bingung, kirimkan saja hasil "COPY HTML" tadi — nanti dipasangkan.

---

## 5. Mengganti foto

Semua foto sekarang masih **foto contoh dari internet**, bukan foto kost asli.
Ini harus diganti sebelum website dipromosikan, karena website ini sendiri
mengingatkan calon penghuni untuk mengecek wujud fisik kamar.

Dua pilihan:

- **Cara paling gampang:** unggah foto ke layanan gratis (misalnya Imgur atau Cloudinary),
  ambil tautan gambarnya, lalu tempel menggantikan tautan yang lama di `js/data.js`.
- **Cara rapi:** buat folder `img/` di dalam proyek, taruh fotonya di situ, lalu tulis
  `'img/pintu-1a.jpg'` menggantikan tautan panjang tadi.

Kalau memakai layanan di luar daftar yang sudah diizinkan, foto bisa tidak muncul di
internet padahal muncul saat dibuka di komputer sendiri. Kalau itu terjadi, minta bantuan
untuk menambahkan alamat layanan tersebut ke `netlify.toml`.

---

## 6. Mengubah peraturan & pertanyaan sebelum WhatsApp

Sebelum diteruskan ke WhatsApp, calon penghuni harus menjawab beberapa pertanyaan dan
mencentang seluruh peraturan kost. Semua isinya ada di `js/data.js` di bagian
`formPraPesan`.

- **Menambah peraturan:** salin satu blok peraturan yang sudah ada, tempel di bawahnya,
  ganti `judul` dan `isi`-nya. Satu blok = satu centang.
- **Menghapus peraturan:** hapus satu blok utuh, dari `{` sampai `},`.
- **Mengubah pertanyaan:** ada di bagian `pertanyaan`. Jangan mengubah tulisan `id:` —
  bagian itu dipakai mesin, bukan untuk dibaca pengunjung.
- **Mematikan form seluruhnya:** ubah `aktif: true` menjadi `aktif: false`.
  Tombol WhatsApp akan langsung membuka WhatsApp tanpa pertanyaan.

Aturannya: **satu peraturan satu baris centang.** Jangan menumpuk beberapa larangan
dalam satu peraturan, dan jangan mengulang hal yang sudah ditanyakan di pertanyaan
(jenis kelamin, lama sewa, jumlah penghuni).

---

## 7. Menerbitkan perubahan ke internet

Kalau website di-deploy dengan cara **drag-and-drop** ke Netlify:

1. Buka [app.netlify.com](https://app.netlify.com), masuk ke situs Anda.
2. Buka tab **Deploys**.
3. Seret seluruh folder proyek ke kotak "Drag and drop your site folder here".
4. Tunggu sampai statusnya **Published** (biasanya di bawah satu menit).
5. Buka website Anda, tekan **Ctrl + F5** untuk memaksa memuat versi terbaru.

Kalau di-deploy lewat GitHub, cukup simpan dan push perubahannya — Netlify menerbitkan
sendiri.

---

## 8. Kalau website tiba-tiba jadi putih atau kosong

Hampir selalu penyebabnya sama: ada **tanda baca yang kehapus** saat menyunting
`js/data.js` atau `js/status.js` — biasanya tanda kutip `'`, koma `,`, atau kurung
kurawal `}`.

Yang harus dilakukan:

1. Buka kembali file yang barusan diubah.
2. Periksa baris yang tadi disunting: apakah tanda kutipnya masih sepasang?
   Apakah masih ada koma di ujung baris?
3. Kalau bingung, **kembalikan file ke versi sebelumnya** lalu ulangi perubahannya
   pelan-pelan satu baris saja.

Karena itu: **selalu simpan salinan folder proyek sebelum menyunting.** Itu satu-satunya
cadangan yang Anda punya.

---

## 9. Yang belum boleh dilupakan sebelum promosi

Website ini belum layak disebar luas sampai hal-hal ini diisi data asli:

- [x] ~~Nomor WhatsApp~~ — sudah diisi `0812-9525-6232`.
- [x] ~~Peta lokasi~~ — sudah menunjuk penanda resmi kost di Google Maps.
- [ ] Semua foto masih foto contoh dari internet.
- [ ] Alamat website masih alamat sementara.
- [ ] Daftar peraturan masih rangkuman sementara, belum peraturan asli Anda.
- [ ] Status semua kamar masih tertulis "tersedia" — **ini yang paling berisiko**,
      karena orang akan menghubungi Anda untuk kamar yang sebenarnya sudah terisi.
