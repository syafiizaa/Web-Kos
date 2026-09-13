/**
 * ============================================================
 * PANEL STATUS KAMAR — admin.html
 * ============================================================
 * Alat bantu offline untuk pemilik kost. Halaman ini TIDAK menyimpan
 * apa pun dan tidak mengirim data ke mana pun — ia hanya menyusun teks
 * yang perlu ditempel ke js/status.js.
 *
 * Daftar kamar digambar SEKALI di awal, lalu tiap klik hanya menyentuh
 * baris yang berubah. Dulu seluruh daftar digambar ulang tiap klik, yang
 * membuat tombol yang baru saja ditekan ikut dibuang dari DOM — fokus
 * keyboard langsung lompat ke awal halaman setiap kali satu kamar diubah.
 * ============================================================
 */

'use strict';

const NILAI_STATUS = [
    { kode: 'tersedia', label: 'Tersedia', ikon: 'check-circle' },
    { kode: 'hampir-penuh', label: 'Hampir Penuh', ikon: 'clock' },
    { kode: 'tidak-tersedia', label: 'Terisi', ikon: 'x-circle' },
];

function escAdmin(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function rupiahAdmin(n) {
    return 'Rp ' + Number(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Cerminan iconSvg() di js/script.js; nama tak dikenal jatuh ke 'home'. */
const IKON_ADMIN = {
    'home': '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'x-circle': '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
    'check': '<polyline points="20 6 9 17 4 12"/>',
    'alert': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
};

function ikonAdmin(nama, ukuran) {
    const isi = IKON_ADMIN[nama] || IKON_ADMIN.home;
    const s = ukuran || 18;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24"`
        + ` fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"`
        + ` stroke-linejoin="round" aria-hidden="true">${isi}</svg>`;
}

// Cerminan ALIAS_STATUS di js/script.js — halaman ini berdiri sendiri dan tidak
// memuat script.js. Kalau daftar di sana berubah, ubah juga di sini.
const ALIAS_STATUS_ADMIN = {
    'tersedia': 'tersedia', 'kosong': 'tersedia', 'ada': 'tersedia',
    'hampir-penuh': 'hampir-penuh', 'hampir penuh': 'hampir-penuh', 'hampir': 'hampir-penuh',
    'tidak-tersedia': 'tidak-tersedia', 'tidak tersedia': 'tidak-tersedia',
    'penuh': 'tidak-tersedia', 'terisi': 'tidak-tersedia', 'isi': 'tidak-tersedia',
};

/** Status yang sedang tertulis di js/status.js. */
function statusAwal(id) {
    const peta = (typeof STATUS_KAMAR !== 'undefined' && STATUS_KAMAR) ? STATUS_KAMAR : {};
    const mentah = peta[id];
    if (mentah == null || mentah === '') return 'tersedia';
    return ALIAS_STATUS_ADMIN[String(mentah).trim().toLowerCase()] || 'tidak-tersedia';
}

// --- Keadaan halaman -------------------------------------------------------
// statusFile   : apa yang tertulis di js/status.js saat halaman dibuka.
// statusSunting: apa yang sedang dipilih di sini (belum tersimpan ke mana pun).
// teksTersalin : isi textarea saat penyalinan terakhir berhasil, null bila
//                belum pernah menyalin. Dipakai untuk tahu apakah yang ada di
//                papan klip masih sama dengan yang terlihat sekarang.
const statusFile = Object.create(null);
const statusSunting = Object.create(null);
const petaBaris = Object.create(null);
const petaAngka = Object.create(null);
const petaSegmen = Object.create(null);
let teksTersalin = null;
let timerToast = null;

let daftarEl, ringkasanEl, proporsiEl, bilahEl, hitungEl, ekorEl, keluaranEl, pesanEl, toastEl;

/** Susun ulang seluruh isi js/status.js dari pilihan di halaman ini. */
function buatIsiStatusJs() {
    const lebar = KOS_DATA.kamar.length
        ? Math.max.apply(null, KOS_DATA.kamar.map(k => k.id.length))
        : 0;

    // Kunci dan nilai diratakan agar file hasilnya tetap enak dibaca.
    const baris = (k) => {
        const nilai = statusSunting[k.id];
        return `    '${k.id}':${' '.repeat(lebar - k.id.length)} '${nilai}',`
            + `${' '.repeat(Math.max(1, 22 - nilai.length))}// ${k.nama}`;
    };

    const bawah = KOS_DATA.kamar.filter(k => k.lantai === 'Lantai Bawah');
    const atas = KOS_DATA.kamar.filter(k => k.lantai !== 'Lantai Bawah');

    return `/**
 * ============================================================
 * STATUS KETERSEDIAAN KAMAR — ${KOS_DATA.nama}
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
${bawah.map(baris).join('\n')}

    // --- Lantai atas ---
${atas.map(baris).join('\n')}
};
`;
}

// --- Menggambar halaman ----------------------------------------------------

function barisKamar(kamar) {
    const aktif = statusSunting[kamar.id];
    const harga = kamar.hargaBerdua
        ? `${rupiahAdmin(kamar.harga)} – ${rupiahAdmin(kamar.hargaBerdua)}`
        : rupiahAdmin(kamar.harga);

    // aria-label perlu menyebut nama kamarnya — pembaca layar yang meloncat antar
    // tombol tidak melihat baris tempat tombol itu berada.
    const tombol = NILAI_STATUS.map(n => `
          <button type="button" data-id="${escAdmin(kamar.id)}" data-nilai="${n.kode}"
                  aria-pressed="${aktif === n.kode}"
                  aria-label="Tandai ${escAdmin(kamar.nama)} sebagai ${n.label}">${n.label}</button>`).join('');

    return `
      <div class="kamar kamar--${escAdmin(aktif)}" data-id="${escAdmin(kamar.id)}">
        <span class="kamar__titik" aria-hidden="true"></span>
        <div>
          <div class="kamar__nama">
            ${escAdmin(kamar.nama)}
            <span class="kamar__tanda" hidden>Diubah</span>
          </div>
          <div class="kamar__info">${escAdmin(kamar.kapasitas)} · ${escAdmin(harga)}/bulan</div>
        </div>
        <div class="pilihan" role="group" aria-label="Status ${escAdmin(kamar.nama)}">${tombol}
        </div>
      </div>`;
}

/** Gambar daftar kamar dan kartu ringkasan sekali saja. */
function bangunHalaman() {
    const lantai = [];
    KOS_DATA.kamar.forEach(k => {
        const nama = k.lantai || 'Kamar';
        if (lantai.indexOf(nama) === -1) lantai.push(nama);
    });

    daftarEl.innerHTML = lantai.map(nama => {
        const isi = KOS_DATA.kamar.filter(k => (k.lantai || 'Kamar') === nama);
        return `
      <div class="grup">
        <h3 class="grup__judul">
          ${escAdmin(nama)}
          <span class="grup__jumlah">${isi.length} kamar</span>
        </h3>
        ${isi.map(barisKamar).join('')}
      </div>`;
    }).join('');

    daftarEl.querySelectorAll('.kamar').forEach(el => { petaBaris[el.dataset.id] = el; });

    const kartuTotal = `
      <div class="ringkas__kartu ringkas__kartu--total">
        <span class="ringkas__ikon">${ikonAdmin('home', 19)}</span>
        <span>
          <span class="ringkas__angka" data-hitung="total">${KOS_DATA.kamar.length}</span>
          <span class="ringkas__label">Total kamar</span>
        </span>
      </div>`;

    ringkasanEl.innerHTML = kartuTotal + NILAI_STATUS.map(n => `
      <div class="ringkas__kartu ringkas__kartu--${n.kode}">
        <span class="ringkas__ikon">${ikonAdmin(n.ikon, 19)}</span>
        <span>
          <span class="ringkas__angka" data-hitung="${n.kode}">0</span>
          <span class="ringkas__label">${n.label}</span>
        </span>
      </div>`).join('');

    ringkasanEl.querySelectorAll('[data-hitung]').forEach(el => { petaAngka[el.dataset.hitung] = el; });

    proporsiEl.innerHTML = NILAI_STATUS
        .map(n => `<span class="proporsi__seg proporsi__seg--${n.kode}" data-seg="${n.kode}"></span>`)
        .join('');

    proporsiEl.querySelectorAll('[data-seg]').forEach(el => { petaSegmen[el.dataset.seg] = el; });
}

/** Perbarui satu baris kamar saja — tanpa membuang tombol yang sedang difokus. */
function perbaruiBaris(id) {
    const el = petaBaris[id];
    if (!el) return;

    const nilai = statusSunting[id];
    el.className = 'kamar kamar--' + nilai;
    el.querySelectorAll('.pilihan button').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.nilai === nilai));
    });

    const tanda = el.querySelector('.kamar__tanda');
    if (tanda) tanda.hidden = (nilai === statusFile[id]);
}

function perbaruiRingkasan() {
    const total = KOS_DATA.kamar.length;

    NILAI_STATUS.forEach(n => {
        const jumlah = KOS_DATA.kamar.filter(k => statusSunting[k.id] === n.kode).length;
        if (petaAngka[n.kode]) petaAngka[n.kode].textContent = String(jumlah);
        if (petaSegmen[n.kode]) {
            petaSegmen[n.kode].style.width = total ? (jumlah / total * 100) + '%' : '0%';
        }
    });

    const rincian = NILAI_STATUS
        .map(n => `${petaAngka[n.kode] ? petaAngka[n.kode].textContent : '0'} ${n.label.toLowerCase()}`)
        .join(', ');
    proporsiEl.setAttribute('aria-label', `Dari ${total} kamar: ${rincian}.`);
}

/**
 * Keterangan dipecah dua: bagian inti selalu tampil, ekornya disembunyikan CSS
 * di layar kecil supaya bilah yang menempel itu tetap muat satu baris.
 */
function perbaruiHitung() {
    const jumlah = KOS_DATA.kamar.filter(k => statusSunting[k.id] !== statusFile[k.id]).length;
    bilahEl.classList.toggle('bilah--berubah', jumlah > 0);

    if (jumlah === 0) {
        hitungEl.textContent = 'Sama dengan js/status.js';
        ekorEl.textContent = ' saat ini';
    } else {
        hitungEl.textContent = `${jumlah} kamar diubah`;
        ekorEl.textContent = ' — belum ditempel ke js/status.js';
    }
}

function perbaruiKeluaran() {
    const teks = buatIsiStatusJs();
    // Hanya ditulis ulang bila memang berubah; menyetel .value akan membuang
    // sorotan teks dan posisi gulir di dalam textarea.
    if (keluaranEl.value !== teks) keluaranEl.value = teks;
    perbaruiPesanSalin();
}

/**
 * Pesan di bawah textarea menerangkan hubungan antara papan klip dan isi
 * textarea sekarang. Dulu pesan "Tersalin" tetap terpampang walau statusnya
 * sudah diubah lagi sesudah menyalin — pemilik kost bisa menempel versi lama
 * sambil merasa sudah menyalin yang terbaru.
 */
function perbaruiPesanSalin() {
    let kelas = 'pesan';
    let teks = '';

    if (teksTersalin !== null) {
        if (teksTersalin === keluaranEl.value) {
            kelas = 'pesan pesan--sukses';
            teks = 'Sudah disalin. Tempel ke js/status.js, timpa seluruh isinya.';
        } else {
            kelas = 'pesan pesan--peringatan';
            teks = 'Status berubah setelah disalin — tekan "Salin hasil" sekali lagi.';
        }
    }

    pesanEl.className = kelas;
    // aria-live: hanya ditulis bila benar-benar berbeda, supaya pembaca layar
    // tidak mengumumkan kalimat yang sama tiap kali satu kamar diklik.
    if (pesanEl.textContent !== teks) pesanEl.textContent = teks;
}

function perbaruiTampilan() {
    perbaruiRingkasan();
    perbaruiHitung();
    perbaruiKeluaran();
}

// --- Pemberitahuan sesaat --------------------------------------------------

function tampilkanToast(teks, jenis) {
    toastEl.className = 'toast toast--' + jenis;
    toastEl.innerHTML = ikonAdmin(jenis === 'sukses' ? 'check' : 'alert', 17) + '<span></span>';
    toastEl.querySelector('span').textContent = teks;
    toastEl.hidden = false;

    void toastEl.offsetWidth; // paksa reflow supaya transisi masuknya ikut jalan
    toastEl.classList.add('toast--tampil');

    clearTimeout(timerToast);
    timerToast = setTimeout(() => {
        toastEl.classList.remove('toast--tampil');
        timerToast = setTimeout(() => { toastEl.hidden = true; }, 220);
    }, 4000);
}

// --- Menyalin --------------------------------------------------------------

function salinHasil() {
    const teks = keluaranEl.value;

    // Clipboard API hanya ada di https/localhost. Saat admin.html dibuka
    // langsung lewat file://, jalurnya turun ke execCommand di bawah.
    if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(teks).then(
            () => hasilSalin(true, teks),
            () => salinManual(teks)
        );
        return;
    }
    salinManual(teks);
}

/**
 * Jalur cadangan: sorot seluruh isi textarea lalu coba execCommand. Kalau itu
 * pun ditolak, teksnya sudah tersorot sehingga Ctrl+C tetap bisa dipakai.
 * setSelectionRange dipakai, bukan select(), karena select() pada textarea
 * readonly tidak menyorot apa-apa di Safari iOS.
 */
function salinManual(teks) {
    try {
        keluaranEl.focus({ preventScroll: true });
        keluaranEl.setSelectionRange(0, teks.length);
    } catch (err) {
        /* biarkan — penyorotan hanya pemanis untuk jalur manual */
    }

    let berhasil = false;
    try {
        berhasil = document.execCommand('copy');
    } catch (err) {
        berhasil = false;
    }
    hasilSalin(berhasil, teks);
}

function hasilSalin(berhasil, teks) {
    if (berhasil) {
        teksTersalin = teks;
        tampilkanToast('Tersalin. Tempel ke js/status.js.', 'sukses');
    } else {
        tampilkanToast('Gagal menyalin otomatis — teks sudah tersorot, tekan Ctrl+C.', 'gagal');
    }
    perbaruiPesanSalin();
}

// --- Aksi ------------------------------------------------------------------

function pilihStatus(id, nilai) {
    if (!(id in statusSunting) || statusSunting[id] === nilai) return;
    statusSunting[id] = nilai;
    perbaruiBaris(id);
    perbaruiTampilan();
}

function setSemua(ambilNilai) {
    KOS_DATA.kamar.forEach(k => {
        statusSunting[k.id] = ambilNilai(k);
        perbaruiBaris(k.id);
    });
    perbaruiTampilan();
}

function tampilkanGalat() {
    const galat = document.getElementById('galat');
    if (galat) galat.hidden = false;
    ['panduan', 'ringkas', 'bilah', 'daftar', 'hasil'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.hidden = true;
    });
}

function mulai() {
    // js/data.js gagal dimuat (mis. admin.html disalin keluar dari foldernya)
    // menyisakan halaman putih tanpa keterangan apa pun. Lebih baik dijelaskan.
    if (typeof KOS_DATA === 'undefined' || !KOS_DATA || !Array.isArray(KOS_DATA.kamar)) {
        tampilkanGalat();
        return;
    }

    daftarEl = document.getElementById('daftarKamar');
    ringkasanEl = document.getElementById('ringkasan');
    proporsiEl = document.getElementById('proporsi');
    bilahEl = document.getElementById('bilah');
    hitungEl = document.getElementById('hitungTeks');
    ekorEl = document.getElementById('hitungEkor');
    keluaranEl = document.getElementById('keluaran');
    pesanEl = document.getElementById('pesanSalin');
    toastEl = document.getElementById('toast');

    KOS_DATA.kamar.forEach(k => {
        statusFile[k.id] = statusAwal(k.id);
        statusSunting[k.id] = statusFile[k.id];
    });

    bangunHalaman();
    perbaruiTampilan();

    // Semua tombol dipasangi lewat delegasi: baris kamar tidak digambar ulang,
    // tapi tombol "Salin hasil" ada di dua tempat dan pola ini menjaga keduanya
    // tetap tertangani oleh satu jalur yang sama.
    document.addEventListener('click', (e) => {
        const pilih = e.target.closest('.pilihan button');
        if (pilih) {
            pilihStatus(pilih.dataset.id, pilih.dataset.nilai);
            return;
        }

        const aksi = e.target.closest('[data-aksi]');
        if (!aksi) return;

        if (aksi.dataset.aksi === 'salin') {
            salinHasil();
        } else if (aksi.dataset.aksi === 'semua-tersedia') {
            setSemua(() => 'tersedia');
        } else if (aksi.dataset.aksi === 'kembalikan') {
            setSemua(k => statusFile[k.id]);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulai);
} else {
    mulai();
}
