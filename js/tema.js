/**
 * ============================================================
 * PEMILIH TEMA — admin.html
 * ============================================================
 * Dipisah dari js/admin.js dan dimuat di dalam <head> karena berkas ini harus
 * jalan SEBELUM halaman digambar. Kalau pemasangan atribut data-tema menunggu
 * akhir <body>, pemilik kost yang memilih mode gelap akan melihat halaman
 * berkedip terang dulu setiap kali membuka halaman ini.
 *
 * Tidak ada skrip inline di admin.html karena header Content-Security-Policy
 * di netlify.toml memakai script-src 'self' — satu-satunya cara menjalankan
 * sesuatu sedini ini adalah lewat berkas tersendiri seperti ini.
 *
 * Yang disimpan hanya satu kata ('terang'/'gelap') di localStorage perangkat
 * pemilik sendiri. Tidak ada yang dikirim ke mana pun.
 * ============================================================
 */

'use strict';

const KUNCI_TEMA = 'kos-admin-tema';
const TEMA_SAH = ['terang', 'gelap'];

function temaTersimpan() {
    try {
        const nilai = localStorage.getItem(KUNCI_TEMA);
        return TEMA_SAH.indexOf(nilai) === -1 ? null : nilai;
    } catch (err) {
        // localStorage bisa ditolak browser (mode penyamaran, setelan privasi).
        // Bukan keadaan gawat: temanya tinggal ikut setelan sistem saja.
        return null;
    }
}

function simpanTema(tema) {
    try {
        localStorage.setItem(KUNCI_TEMA, tema);
    } catch (err) {
        /* biarkan — pilihannya tetap berlaku sampai halaman ditutup */
    }
}

function temaSistem() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'gelap'
        : 'terang';
}

function temaAktif() {
    return document.documentElement.getAttribute('data-tema') === 'gelap' ? 'gelap' : 'terang';
}

function perbaruiTombolTema() {
    const aktif = temaAktif();
    // Saat dipanggil dari <head>, tombolnya belum ada — querySelectorAll cuma
    // mengembalikan daftar kosong, jadi tidak perlu dijaga khusus.
    document.querySelectorAll('.tema__pilih').forEach(tombol => {
        tombol.setAttribute('aria-pressed', String(tombol.dataset.tema === aktif));
    });
}

function terapkanTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    perbaruiTombolTema();
}

// --- Jalan seketika, saat <head> masih diurai ---
terapkanTema(temaTersimpan() || temaSistem());

// Selama pemilik kost belum pernah memilih sendiri, tampilan ikut setelan
// sistem — termasuk saat Windows berganti ke mode gelap otomatis sore hari.
if (window.matchMedia) {
    const kueriGelap = window.matchMedia('(prefers-color-scheme: dark)');
    const ikutSistem = () => { if (!temaTersimpan()) terapkanTema(temaSistem()); };

    if (kueriGelap.addEventListener) kueriGelap.addEventListener('change', ikutSistem);
    else if (kueriGelap.addListener) kueriGelap.addListener(ikutSistem); // Safari lama
}

function mulaiTema() {
    perbaruiTombolTema();

    const grup = document.querySelector('.tema');
    if (!grup) return;

    grup.addEventListener('click', (e) => {
        const tombol = e.target.closest('.tema__pilih');
        if (!tombol) return;

        const pilihan = tombol.dataset.tema;
        if (TEMA_SAH.indexOf(pilihan) === -1) return;

        simpanTema(pilihan);
        terapkanTema(pilihan);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mulaiTema);
} else {
    mulaiTema();
}
