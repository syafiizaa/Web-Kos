/**
 * ============================================================
 * STATUS KETERSEDIAAN KAMAR — Kost H. Saifullah
 * ============================================================
 * HANYA file ini yang perlu diubah saat ada kamar terisi atau kosong.
 * Ubah tulisan di dalam tanda kutip KEDUA, jangan yang lain:
 *
 *   'tersedia'        Kamar kosong dan bisa dipesan.
 *   'hampir-penuh'    Tinggal sedikit / sedang dinegosiasi.
 *   'tidak-tersedia'  Kamar sudah terisi. Tombolnya berubah jadi "Kabari".
 *
 * Boleh juga memakai kata sehari-hari, huruf besar/kecil bebas:
 *   'kosong' atau 'ada'    = tersedia
 *   'hampir'               = hampir-penuh
 *   'penuh' atau 'terisi'  = tidak-tersedia
 *
 * Kalau tulisannya tetap tidak dikenal, kamar itu ditandai TIDAK TERSEDIA —
 * lebih baik kehilangan satu penanya daripada menjanjikan kamar yang penuh.
 *
 * Cara termudah mengubah file ini: buka admin.html di browser, klik-klik
 * statusnya, lalu salin hasilnya ke sini. Lihat PANDUAN.md.
 * ============================================================
 */

const STATUS_KAMAR = {
    // --- Lantai bawah ---
    'pintu-1':  'tersedia',              // Pintu 1
    'pintu-2':  'tersedia',              // Pintu 2
    'pintu-3':  'tersedia',              // Pintu 3
    'pintu-4':  'tersedia',              // Pintu 4
    'pintu-5':  'tersedia',              // Pintu 5
    'pintu-6':  'tersedia',              // Pintu 6
    'pintu-7':  'tersedia',              // Pintu 7
    'pintu-8':  'tersedia',              // Pintu 8
    'pintu-9':  'tersedia',              // Pintu 9
    'pintu-10': 'tersedia',              // Pintu 10
    'pintu-11': 'tersedia',              // Pintu 11
    'pintu-12': 'tersedia',              // Pintu 12
    'pintu-13': 'tersedia',              // Pintu 13
    'pintu-14': 'tersedia',              // Pintu 14
    'pintu-15': 'tersedia',              // Pintu 15

    // --- Lantai atas ---
    'atas-a1':  'tersedia',              // Kamar A1
    'atas-a2':  'tersedia',              // Kamar A2
    'atas-a3':  'tersedia',              // Kamar A3
    'atas-b1':  'tersedia',              // Kamar B1
    'atas-b2':  'tersedia',              // Kamar B2
    'atas-b3':  'tersedia',              // Kamar B3
};
