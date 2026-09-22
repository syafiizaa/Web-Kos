/**
 * ============================================================
 * DATA KOST H. SAIFULLAH — Ubah data di sini untuk menyesuaikan konten website
 * ============================================================
 * Cukup edit nilai-nilai di bawah, website akan menyesuaikan secara otomatis.
 */

const KOS_DATA = {
    // === INFORMASI UMUM ===
    nama: 'Kost H. Saifullah',
    tagline: 'Kost Nyaman untuk Hunian Anda',
    taglineSorot: 'Hunian Anda', // Bagian tagline yang diberi warna aksen di hero
    deskripsi:
        'Kost H. Saifullah adalah hunian eksklusif laki-laki di Simpang Empat, Batulicin. Tersedia 21 kamar: 15 pintu di lantai bawah yang masing-masing punya dapur dan kamar mandi sendiri, serta 6 kamar di lantai atas dengan dapur dan kamar mandi bersama. Khusus untuk pelajar, mahasiswa, magang, dan karyawan. Sewa bulanan minimal 5 bulan, biaya sudah termasuk air dan listrik.',
    deskripsiSingkat:
        'Kost yang berada di Seberang SMKN 1 Simpang Empat yang cocok untuk anak sekolah SMK karena berada tepat di seberang gerbang sekolah. Di kost ini Air dan listrik sudah termasuk dalam harga sewa perbulan.',
    nomorWA: '6281295256232', // Nomor WhatsApp tanpa "+" atau spasi (0812-9525-6232)
    alamat: 'Jl. Transmigrasi KM 6, seberang SMKN 1 Simpang Empat, Sari Gadung, Kec. Batulicin, Kab. Tanah Bumbu, Kalimantan Selatan 72221',
    kota: 'Batulicin',
    provinsi: 'Kalimantan Selatan',
    // Peta diarahkan ke penanda resmi kost di Google Maps.
    // Angka 5050973779724392863 adalah ID tempat (CID) milik penanda tersebut —
    // permanen, jadi tautannya tidak akan basi seperti tautan pendek goo.gl.
    //   Koordinat penanda : -3.3809677, 115.9668089
    //   Tautan pendek asli: https://maps.app.goo.gl/kzu4qcoqJeMMrhbZA
    // Kalau suatu saat petanya berubah/kosong, ambil ulang lewat
    // Google Maps → Share → Embed a map → COPY HTML, lalu tempel ke `mapsEmbed`
    // (boleh utuh <iframe ...>, isi src-nya diambil otomatis). Alamatnya WAJIB
    // diawali https://www.google.com/maps/embed — lihat PANDUAN.md bagian 4.
    mapsLink: 'https://www.google.com/maps?cid=5050973779724392863',
    mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m3!3m2!1m1!4s5050973779724392863',

    // === TARGET & ATURAN ===
    targetPenghuni: 'Laki-laki (pelajar, mahasiswa, magang, karyawan)',
    maksPerKamar: 2, // Batas umum; tiap kamar bisa menimpanya lewat `maksOrang`.
    // Berapa kartu kamar yang digambar lebih dulu. Sisanya baru muncul kalau
    // pengunjung sendiri menekan tombol "Tampilkan lebih banyak".
    jumlahKamarTersediaAwal: 3, // Bagian "Kamar Tersedia" di beranda
    jumlahKamarAwal: 9,         // Halaman kamar.html (daftar lengkap + filter)
    minimalSewa: '5 bulan',
    sistemPemesanan: 'Siapa cepat, dia dapat (first-come, first-served). Tidak ada reservasi. Kamar diberikan kepada yang pertama konfirmasi setelah kamar kosong.',
    biayaTermasuk: 'Air dan listrik sudah termasuk dalam harga sewa.',

    // === METODE PEMBAYARAN ===
    metodeBayar: [
        { nama: 'SeaBank', ikon: 'bank' },
        { nama: 'Bank Jago', ikon: 'bank' },
        { nama: 'BCA', ikon: 'bank' },
        { nama: 'BNI', ikon: 'bank' },
        { nama: 'GoPay', ikon: 'smartphone' },
        { nama: 'ShopeePay', ikon: 'smartphone' },
    ],

    // === PERINGATAN KEAMANAN ===
    peringatan:
        'Waspada terhadap penipuan! Calon penghuni WAJIB melihat wujud fisik kamar atau mendatangi lokasi langsung sebelum melakukan transfer uang.',

    // === PESAN WHATSAPP OTOMATIS ===
    waPesanKamar: (namaKamar) =>
        `Halo, saya tertarik dengan *${namaKamar}*. Apakah kamar ini masih tersedia? Saya ingin melihat lokasi langsung sebelum melakukan pembayaran. Terima kasih.`,
    waPesanTunggu: (namaKamar) =>
        `Halo, saya melihat *${namaKamar}* sedang tidak tersedia. Boleh saya dikabari jika kamar tersebut kosong? Terima kasih.`,
    // Tidak ada lagi `waPesanUmum`: seluruh tombol WhatsApp umum sudah dihapus
    // agar tidak ada jalan pintas yang melewati form pra-pemesanan.

    // === FORM PRA-PEMESANAN ===
    // Ditampilkan sebelum pengunjung diteruskan ke WhatsApp (tombol pesan/tanya
    // pada kartu kamar maupun di dalam pop up detail kamar).
    // Jawaban TIDAK dikirim atau disimpan ke mana pun — hanya dirangkum menjadi
    // isi pesan WhatsApp yang terbuka di perangkat pengunjung sendiri.
    formPraPesan: {
        aktif: true, // false = tombol WhatsApp kembali langsung tanpa form

        judul: 'Sebelum Lanjut ke WhatsApp',
        deskripsi:
            'Mohon jawab beberapa pertanyaan singkat berikut agar kami bisa langsung menjawab sesuai kebutuhan Anda. Jawaban tidak disimpan di mana pun — hanya dirangkum menjadi isi pesan WhatsApp Anda.',

        labelLanjut: 'Lanjut ke WhatsApp',
        labelLanjutTunggu: 'Lanjut Minta Dikabari',
        pesanBelumLengkap: 'Semua pertanyaan wajib dijawab dan peraturan kost wajib disetujui.',

        // Semua pertanyaan berupa PILIHAN — tidak ada kolom teks bebas.
        // Opsi dengan `nonaktif: true` tampil abu-abu dan tidak bisa diklik;
        // `catatan` di sebelahnya yang menjelaskan alasannya.
        // Opsi dengan `orang: n` menyatakan jumlah penghuni. Angka itu dipakai
        // untuk dua hal: mematikan opsi yang melebihi `maksOrang` kamar, dan
        // memilih tarif kamar (`harga` untuk 1 orang, `hargaBerdua` untuk 2).
        // `ikon` memakai nama dari objek `icons` di script.js.
        pertanyaan: [
            {
                id: 'jenisKelamin',
                label: 'Jenis kelamin',
                ikon: 'users',
                opsi: [
                    { nilai: 'Laki-laki' },
                    {
                        nilai: 'Perempuan',
                        nonaktif: true,
                        catatan: '(Kost khusus laki-laki)',
                    },
                ],
            },
            {
                id: 'targetSewa',
                label: 'Target lama sewa',
                ikon: 'calendar',
                opsi: [
                    { nilai: 'Minimal 5 bulan', catatan: 'Sesuai kontrak minimal kost' },
                    { nilai: 'Lebih dari 5 bulan' },
                ],
            },
            {
                id: 'jumlahOrang',
                label: 'Kamar akan dihuni berapa orang',
                ikon: 'home',
                opsi: [
                    { nilai: '1 orang', orang: 1 },
                    {
                        nilai: '2 orang',
                        orang: 2, // Mati otomatis di kamar yang `maksOrang`-nya 1.
                        catatan: 'Tarif berbeda dari 1 orang',
                        catatanNonaktif: '(Kamar ini khusus 1 orang)',
                    },
                ],
            },
            {
                id: 'statusSekarang',
                label: 'Status Anda saat ini',
                ikon: 'book',
                opsi: [
                    { nilai: 'Mahasiswa' },
                    { nilai: 'Pelajar' },
                    { nilai: 'Magang' },
                ],
            },
        ],

        // === PERATURAN KOST (pop up terpisah) ===
        // Setiap item wajib dicentang sebelum pengunjung bisa melanjutkan.
        // TODO: ganti daftar di bawah dengan rangkuman peraturan asli dari pemilik kost.
        peraturan: {
            judul: 'Peraturan Kost',
            deskripsi:
                'Centang setiap peraturan sebagai tanda Anda sudah membaca dan menyetujuinya. Semua peraturan harus dicentang untuk bisa melanjutkan.',
            labelPemicu: 'Baca & setujui peraturan kost',
            labelSudah: 'Peraturan kost sudah disetujui',
            labelSetuju: 'Saya Setuju & Lanjutkan',
            labelProgres: (dicentang, total) => `${dicentang} dari ${total} peraturan disetujui`,
            pesanBelumSemua: 'Centang semua peraturan untuk melanjutkan.',
            // Satu item = satu peraturan. Jangan menggabungkan beberapa larangan
            // dalam satu item — penghuni mencentangnya satu per satu.
            // Jangan mengulang hal yang sudah ditanyakan di `pertanyaan` di atas
            // (jenis kelamin, lama sewa, jumlah penghuni).
            items: [
                {
                    judul: 'Perempuan dilarang masuk',
                    isi: 'Perempuan dilarang masuk ke dalam kamar maupun area dalam kost, dalam keadaan apa pun.',
                },
                {
                    judul: 'Tamu wajib seizin pemilik',
                    isi: 'Setiap tamu yang berkunjung harus sepengetahuan dan seizin pemilik kost.',
                },
                {
                    judul: 'Tamu dilarang menginap',
                    isi: 'Tamu tidak diperbolehkan menginap di kamar tanpa izin pemilik kost.',
                },
                {
                    judul: 'Dilarang membawa tamu dalam jumlah banyak',
                    isi: 'Air dan listrik kost diperuntukkan bagi penghuni, bukan untuk rombongan tamu. Bila ingin berkumpul ramai-ramai, silakan lakukan di luar kost.',
                },
                {
                    judul: 'Pembayaran tepat waktu',
                    isi: 'Sewa dibayarkan setiap bulan tepat pada tanggal jatuh temponya.',
                },
                {
                    judul: 'Tidak ada sistem reservasi',
                    isi: 'Kamar diberikan kepada yang lebih dulu melakukan konfirmasi setelah kamar kosong — siapa cepat, dia dapat.',
                },
                {
                    judul: 'Menjaga kebersihan',
                    isi: 'Menjaga kebersihan kamar sendiri serta area bersama seperti kamar mandi, dapur, dan halaman.',
                },
                {
                    judul: 'Menjaga ketenangan',
                    isi: 'Tidak membuat kegaduhan yang mengganggu penghuni lain, terutama pada malam hari.',
                },
                {
                    judul: 'Dilarang memakai knalpot brong',
                    isi: 'Motor berknalpot brong tidak boleh dipakai di lingkungan kost karena suaranya mengganggu penghuni lain dan tetangga sekitar.',
                },
                {
                    judul: 'Motor yang masuk ke dalam kost wajib beralas',
                    isi: 'Motor yang dimasukkan ke dalam kost wajib diberi alas di bawahnya agar lantai keramik tidak lecet atau tergores.',
                },
                {
                    judul: 'Menggunakan air & listrik secukupnya',
                    isi: 'Air dan listrik sudah termasuk harga sewa. Gunakan secukupnya dan matikan alat listrik saat tidak dipakai.',
                },
                {
                    judul: 'Dilarang membawa narkoba & minuman keras',
                    isi: 'Dilarang membawa, menyimpan, atau memakai narkoba dan minuman keras di lingkungan kost.',
                },
                {
                    judul: 'Dilarang berjudi',
                    isi: 'Segala bentuk perjudian dilarang di dalam kamar maupun di lingkungan kost.',
                },
                {
                    judul: 'Dilarang membawa senjata tajam',
                    isi: 'Dilarang membawa atau menyimpan senjata tajam dan benda berbahaya lainnya di dalam kost.',
                },
                {
                    judul: 'Kerusakan menjadi tanggung jawab penghuni',
                    isi: 'Kerusakan fasilitas kamar akibat kelalaian penghuni menjadi tanggung jawab penghuni yang bersangkutan.',
                },
                {
                    judul: 'Wajib cek kamar sebelum transfer',
                    isi: 'Calon penghuni wajib melihat wujud fisik kamar atau mendatangi lokasi langsung sebelum melakukan pembayaran.',
                },
            ],
        },

        // Isi pesan WhatsApp yang dirangkai dari jawaban form.
        // `ringkasan` adalah daftar jawaban yang sudah diformat per baris.
        // `harga` sudah disesuaikan dengan jumlah penghuni yang dipilih di form.
        waPesan: (namaKamar, ringkasan, harga) =>
            `Halo, saya tertarik dengan *${namaKamar}* (${harga}/bulan).\n\n*Data calon penghuni:*\n${ringkasan}\n\nSaya sudah membaca dan menyetujui seluruh peraturan kost.\n\nApakah kamar ini masih tersedia? Saya ingin melihat lokasi langsung sebelum melakukan pembayaran. Terima kasih.`,
        waPesanTunggu: (namaKamar, ringkasan, harga) =>
            `Halo, saya melihat *${namaKamar}* (${harga}/bulan) sedang tidak tersedia. Boleh saya dikabari jika kamar tersebut kosong?\n\n*Data calon penghuni:*\n${ringkasan}\n\nSaya sudah membaca dan menyetujui seluruh peraturan kost. Terima kasih.`,
    },

    // === DAFTAR KAMAR ===
    kamar: [
        // LANTAI BAWAH — 15 pintu. Tiap pintu berisi satu kamar plus dapur dan
        // kamar mandi sendiri, tidak berbagi dengan penghuni lain.
        // `maksOrang` menentukan pilihan jumlah penghuni di form pra-pemesanan:
        // kamar dengan maksOrang 1 otomatis mematikan opsi "2 orang" di form.
        // `harga` = tarif untuk 1 orang. `hargaBerdua` = tarif bila dihuni 2 orang,
        // ditulis hanya pada kamar yang memang boleh 2 orang.
        // Status ketersediaan TIDAK di sini — ada di js/status.js.
        // TODO: `foto` masih placeholder.
        {
            id: 'pintu-1',
            nama: 'Pintu 1',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-2',
            nama: 'Pintu 2',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-3',
            nama: 'Pintu 3',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Pintu 3 khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-4',
            nama: 'Pintu 4',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Pintu 4 khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-5',
            nama: 'Pintu 5',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-6',
            nama: 'Pintu 6',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-7',
            nama: 'Pintu 7',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-8',
            nama: 'Pintu 8',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-9',
            nama: 'Pintu 9',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-10',
            nama: 'Pintu 10',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-11',
            nama: 'Pintu 11',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-12',
            nama: 'Pintu 12',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-13',
            nama: 'Pintu 13',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-14',
            nama: 'Pintu 14',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },
        {
            id: 'pintu-15',
            nama: 'Pintu 15',
            tipe: 'Pintu Pribadi',
            lantai: 'Lantai Bawah',
            harga: 600000,
            hargaBerdua: 800000,
            maksOrang: 2,
            kapasitas: 'Maks. 2 orang',
            deskripsi:
                'Satu pintu berisi kamar tidur, dapur, dan kamar mandi sendiri — tidak berbagi dengan penghuni lain. Bisa dihuni 1 sampai 2 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Pribadi', 'Kamar Mandi Dalam', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=800&q=80',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
        },

        // LANTAI ATAS — 6 kamar (A1–A3, B1–B3). Dapur dipakai bersama dan
        // kamar mandi terkumpul jadi satu blok berisi 6 unit. Semua khusus 1 orang.
        {
            id: 'atas-a1',
            nama: 'Kamar A1',
            tipe: 'Kamar Lantai Atas',
            lantai: 'Lantai Atas',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Kamar A1 di lantai atas. Dapur dan kamar mandi dipakai bersama penghuni lantai atas (tersedia 6 kamar mandi). Khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Bersama', 'Kamar Mandi Bersama', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        },
        {
            id: 'atas-a2',
            nama: 'Kamar A2',
            tipe: 'Kamar Lantai Atas',
            lantai: 'Lantai Atas',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Kamar A2 di lantai atas. Dapur dan kamar mandi dipakai bersama penghuni lantai atas (tersedia 6 kamar mandi). Khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Bersama', 'Kamar Mandi Bersama', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        },
        {
            id: 'atas-a3',
            nama: 'Kamar A3',
            tipe: 'Kamar Lantai Atas',
            lantai: 'Lantai Atas',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Kamar A3 di lantai atas. Dapur dan kamar mandi dipakai bersama penghuni lantai atas (tersedia 6 kamar mandi). Khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Bersama', 'Kamar Mandi Bersama', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        },
        {
            id: 'atas-b1',
            nama: 'Kamar B1',
            tipe: 'Kamar Lantai Atas',
            lantai: 'Lantai Atas',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Kamar B1 di lantai atas. Dapur dan kamar mandi dipakai bersama penghuni lantai atas (tersedia 6 kamar mandi). Khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Bersama', 'Kamar Mandi Bersama', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        },
        {
            id: 'atas-b2',
            nama: 'Kamar B2',
            tipe: 'Kamar Lantai Atas',
            lantai: 'Lantai Atas',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Kamar B2 di lantai atas. Dapur dan kamar mandi dipakai bersama penghuni lantai atas (tersedia 6 kamar mandi). Khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Bersama', 'Kamar Mandi Bersama', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        },
        {
            id: 'atas-b3',
            nama: 'Kamar B3',
            tipe: 'Kamar Lantai Atas',
            lantai: 'Lantai Atas',
            harga: 500000,
            maksOrang: 1,
            kapasitas: '1 orang',
            deskripsi:
                'Kamar B3 di lantai atas. Dapur dan kamar mandi dipakai bersama penghuni lantai atas (tersedia 6 kamar mandi). Khusus untuk 1 orang. Air dan listrik sudah termasuk.',
            fasilitas: [
                'Dapur Bersama', 'Kamar Mandi Bersama', 'Tempat Tidur + Kasur', 'Lemari Pakaian',
                'Meja Belajar + Kursi', 'Air & Listrik Gratis', 'Jendela Ventilasi',
            ],
            foto: [
                'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
                'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
            ],
            fotoKamarMandi: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
        },
    ],

    // === FASILITAS UMUM (ikon dari internal SVG system) ===
    fasilitasUmum: [
        { nama: 'WiFi', ikon: 'wifi' },
        { nama: 'CCTV 24 Jam', ikon: 'shield' },
        { nama: 'Air & Listrik Gratis', ikon: 'zap' },
        { nama: 'Parkir Motor', ikon: 'truck' },
        { nama: 'Keamanan 24 Jam', ikon: 'lock' },
        { nama: 'Tempat Jemur', ikon: 'sun' },
        { nama: 'Dapur & Kamar Mandi Dalam (Lantai Bawah)', ikon: 'droplet' },
        { nama: 'Dapur & Kamar Mandi Bersama (Lantai Atas)', ikon: 'coffee' },
        { nama: 'Lokasi Strategis', ikon: 'map-pin' },
    ],

    // === GALERI FOTO ===
    galeri: {
        'Bagian Luar': [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
            'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600&q=80',
        ],
        'Area Kamar': [
            'https://images.unsplash.com/photo-1522771739017-7eb0a0e6b3e2?w=600&q=80',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
            'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
        ],
        'Kamar Mandi': [
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
            'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
        ],
        'Area Bersama': [
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
        ],
        'Dapur': [
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
            'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80',
        ],
        'Parkir': [
            'https://images.unsplash.com/photo-1573342212426-07a3e53f3f6e?w=600&q=80',
            'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&q=80',
        ],
        'Lingkungan Sekitar': [
            'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=80',
            'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&q=80',
        ],
    },

    // === KEUNGGULAN ===
    keunggulan: [
        {
            ikon: 'map-pin',
            judul: 'Lokasi Strategis',
            deskripsi: 'Berada di Simpang Empat, Batulicin — mudah diakses, dekat dengan berbagai fasilitas umum dan pusat kegiatan.',
        },
        {
            ikon: 'home',
            judul: 'Khusus Laki-laki',
            deskripsi: 'Lingkungan eksklusif untuk penghuni laki-laki (pelajar, mahasiswa, magang, karyawan). Suasana lebih kondusif dan nyaman.',
        },
        {
            ikon: 'zap',
            judul: 'Air & Listrik Gratis',
            deskripsi: 'Biaya air dan listrik sudah termasuk dalam harga sewa. Tidak perlu pusing urus tagihan bulanan.',
        },
        {
            ikon: 'dollar-sign',
            judul: 'Harga Terjangkau',
            deskripsi: 'Mulai dari Rp 500.000 per bulan untuk 1 orang. Harga bersahabat dengan fasilitas lengkap.',
        },
        {
            ikon: 'grid',
            judul: 'Dua Pilihan Hunian',
            deskripsi: '15 pintu di lantai bawah dengan dapur dan kamar mandi sendiri, atau 6 kamar di lantai atas yang lebih hemat dengan dapur dan kamar mandi bersama.',
        },
        {
            ikon: 'shield',
            judul: 'Keamanan Terjaga',
            deskripsi: 'CCTV 24 jam dan sistem keamanan terintegrasi. Lingkungan aman dan nyaman untuk ditinggali.',
        },
        {
            ikon: 'wifi',
            judul: 'WiFi Cepat',
            deskripsi: 'Akses internet WiFi cepat untuk menunjang aktivitas belajar dan bekerja online.',
        },
    ],

    // === TEMPAT DI SEKITAR LOKASI ===
    tempatSekitar: [
        { nama: 'Pusat Kecamatan Simpang Empat', jarak: '500 m' },
        { nama: 'Mini Market & Toko', jarak: '100 m' },
        { nama: 'Kawasan Kuliner', jarak: '300 m' },
        { nama: 'Sekolah & Madrasah', jarak: '500 m' },
        { nama: 'Pusat Kesehatan', jarak: '1 km' },
        { nama: 'Pasar Tradisional', jarak: '1,5 km' },
    ],

    // === EDUKASI ===
    edukasi: [
        {
            judul: 'Aturan Kost',
            items: [
                'Khusus penghuni laki-laki (pelajar, mahasiswa, magang, karyawan)',
                'Pintu lantai bawah maksimal 2 orang, kecuali Pintu 3 dan Pintu 4',
                'Kamar lantai atas (A1–B3) dan Pintu 3 & 4 khusus 1 orang',
                'Minimal kontrak sewa 5 bulan (pembayaran per bulan)',
                'Sistem siapa cepat dia dapat — tidak ada reservasi',
                'Dilarang membawa tamu menginap tanpa izin',
                'Menjaga kebersihan dan ketenangan lingkungan',
            ],
        },
    ],
};