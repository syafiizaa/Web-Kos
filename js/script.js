/**
 * ============================================================
 * KOST H. SAIFULLAH — Website JavaScript
 * Rendering engine + interaktivitas
 * ============================================================
 * Semua konten di-render dari data di data.js
 * Tinggal edit data.js, website menyesuaikan otomatis.
 */

'use strict';

/* ============================================================
   UTILITY
   ============================================================ */

/** Escape karakter HTML agar data dari data.js aman dipakai di innerHTML. */
function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function rupiah(n) {
    return 'Rp ' + Number(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function waUrl(phone, text) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/**
 * Tombol "Embed a map" di Google Maps menyalin kode <iframe ...> lengkap,
 * padahal yang dibutuhkan hanya isi src-nya. Terima dua-duanya supaya
 * pemilik kost tidak perlu memotong kodenya sendiri.
 */
/**
 * Tautan ke section di beranda. Footer dirender di dua halaman, jadi dari
 * kamar.html tautannya harus lewat index.html dulu. Section `#beranda` hanya
 * ada di beranda — keberadaannya dipakai sebagai penanda halaman.
 */
function ke(anchor) {
    return (document.getElementById('beranda') ? '' : 'index.html') + anchor;
}

function mapsEmbedUrl(nilai) {
    const teks = String(nilai == null ? '' : nilai).trim();
    if (!teks) return '';

    const cocok = teks.match(/src\s*=\s*["']([^"']+)["']/i);
    const url = cocok ? cocok[1].trim() : teks;

    // CSP di netlify.toml hanya mengizinkan iframe dari www.google.com — alamat
    // lain akan diblokir diam-diam di production walau terlihat normal saat lokal.
    if (url.indexOf('https://www.google.com/maps/embed') !== 0) {
        console.warn(
            'KOS_DATA.mapsEmbed sebaiknya diawali "https://www.google.com/maps/embed". ' +
            'Ambil dari Google Maps → Share → Embed a map. Nilai sekarang: ' + url
        );
    }
    return url;
}

/** Tunda eksekusi sampai user berhenti mengetik (dipakai kolom pencarian). */
function debounce(fn, wait) {
    let timer;
    return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

/** Batasi handler agar maksimal satu kali per frame (dipakai listener scroll). */
function rafThrottle(fn) {
    let queued = false;
    return function throttled(...args) {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            fn.apply(this, args);
        });
    };
}

const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Placeholder abu-abu bila sebuah kamar belum punya foto. */
const PLACEHOLDER_IMG =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23E2E8F0'/%3E%3Ctext x='400' y='305' font-family='sans-serif' font-size='28' fill='%2394A3B8' text-anchor='middle'%3EFoto belum tersedia%3C/text%3E%3C/svg%3E";

function fotoKamar(kamar, index) {
    return (kamar.foto && kamar.foto[index]) ? kamar.foto[index] : PLACEHOLDER_IMG;
}

const icons = {
    'wifi': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
    'shield': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'droplet': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
    'zap': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'truck': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    'coffee': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
    'tv': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>',
    'wind': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>',
    'lock': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    'sun': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    'map-pin': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
    'home': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    'grid': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    'dollar-sign': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    'smile': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    'check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'map': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
    'phone': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    'mail': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    'navigation': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    'maximize': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
    'message-circle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    'arrow-left': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
    'arrow-right': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    'arrow-up': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    'x': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    'menu': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    'search': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    'expand': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    'map-pin-fill': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg>',
    'smartphone': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    'bank': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 22 7 12 2"/><polyline points="2 7 2 12 22 12 22 7"/><path d="M5 12v5M9 12v5M15 12v5M19 12v5"/><line x1="2" y1="17" x2="22" y2="17"/></svg>',
    'alert-triangle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'users': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    'clock': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'calendar': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'activity': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    'info': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    'book': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
};

function iconSvg(name, size) {
    size = size || 24;
    let svg = icons[name] || icons['home'];
    // Replace default 24 with custom size
    if (size !== 24) {
        svg = svg.replace(/width="24"/g, `width="${size}"`).replace(/height="24"/g, `height="${size}"`);
    }
    // Ikon selalu dekoratif — teks di sebelahnya yang dibacakan screen reader.
    return svg.replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
}

/* ============================================================
   STATUS HELPERS
   ============================================================ */

const STATUS_MAP = {
    'tersedia': { label: 'Tersedia', cls: 'room-card__status--tersedia' },
    'hampir-penuh': { label: 'Hampir Penuh', cls: 'room-card__status--hampir-penuh' },
    'tidak-tersedia': { label: 'Tidak Tersedia', cls: 'room-card__status--tidak-tersedia' },
};

/* ============================================================
   HARGA
   ============================================================
   `harga` adalah tarif untuk 1 orang. Kamar yang boleh dihuni 2 orang
   punya `hargaBerdua` — tarifnya berbeda, bukan kelipatan.
   ============================================================ */

/** Tarif kamar untuk jumlah penghuni tertentu. */
function hargaKamar(kamar, jumlahOrang) {
    return (jumlahOrang >= 2 && kamar.hargaBerdua) ? kamar.hargaBerdua : kamar.harga;
}

/** Tarif untuk dipajang: satu angka, atau rentang bila tarif 2 orang berbeda. */
function hargaTeks(kamar) {
    return kamar.hargaBerdua
        ? `${rupiah(kamar.harga)} – ${rupiah(kamar.hargaBerdua)}`
        : rupiah(kamar.harga);
}

/**
 * Kata sehari-hari yang diterima di js/status.js selain tiga nilai resminya.
 * Yang menyunting file itu pemilik kost, bukan programmer — menulis 'penuh'
 * jauh lebih alami daripada 'tidak-tersedia', dan dulu salah tulis begitu
 * diam-diam berubah jadi "Tersedia": kamar penuh diiklankan sebagai kosong.
 */
const ALIAS_STATUS = {
    'tersedia': 'tersedia',
    'kosong': 'tersedia',
    'ada': 'tersedia',
    'hampir-penuh': 'hampir-penuh',
    'hampir penuh': 'hampir-penuh',
    'hampir': 'hampir-penuh',
    'tidak-tersedia': 'tidak-tersedia',
    'tidak tersedia': 'tidak-tersedia',
    'penuh': 'tidak-tersedia',
    'terisi': 'tidak-tersedia',
    'isi': 'tidak-tersedia',
};

/**
 * Status ketersediaan kamar. Sumbernya js/status.js — file kecil terpisah agar
 * pemilik kost tidak perlu menyunting data.js hanya untuk menandai kamar terisi.
 * Huruf besar/kecil dan spasi berlebih diabaikan.
 */
function statusKamar(kamar) {
    const peta = (typeof STATUS_KAMAR !== 'undefined' && STATUS_KAMAR) ? STATUS_KAMAR : {};
    const mentah = peta[kamar.id] != null ? peta[kamar.id] : kamar.status;

    // Kamar yang belum punya baris di status.js dianggap tersedia — itu keadaan
    // wajar untuk kamar yang baru ditambahkan, jadi tidak perlu diprotes.
    if (mentah == null || mentah === '') return 'tersedia';

    const nilai = ALIAS_STATUS[String(mentah).trim().toLowerCase()];
    if (nilai) return nilai;

    console.warn(
        `Status "${mentah}" untuk ${kamar.nama || kamar.id} di js/status.js tidak dikenal. ` +
        'Pakai: tersedia / hampir-penuh / tidak-tersedia (boleh juga kosong / hampir / penuh). ' +
        'Untuk sementara kamar ini ditandai tidak-tersedia agar tidak salah menjanjikan kamar kosong.'
    );
    return 'tidak-tersedia';
}

/** Pesan WhatsApp menyesuaikan status kamar. */
function waTextKamar(kamar) {
    if (statusKamar(kamar) === 'tidak-tersedia' && typeof KOS_DATA.waPesanTunggu === 'function') {
        return KOS_DATA.waPesanTunggu(kamar.nama);
    }
    return KOS_DATA.waPesanKamar(kamar.nama);
}

/* ============================================================
   RENDER — ROOM CARDS
   ============================================================ */

function renderRoomCard(kamar) {
    const kodeStatus = statusKamar(kamar);
    const status = STATUS_MAP[kodeStatus];
    const penuh = kodeStatus === 'tidak-tersedia';
    const nama = esc(kamar.nama);
    const waLabel = penuh ? `Minta dikabari jika ${nama} kosong` : `Tanya ${nama} via WhatsApp`;

    return `
    <article class="room-card" data-id="${esc(kamar.id)}">
      <div class="room-card__image">
        <img src="${esc(fotoKamar(kamar, 0))}" alt="Foto ${nama}" loading="lazy" width="800" height="600">
        <span class="room-card__status ${status.cls}">${status.label}</span>
      </div>
      <div class="room-card__body">
        <h3 class="room-card__title">${nama}</h3>
        <div class="room-card__type">${esc(kamar.tipe)} — ${esc(kamar.kapasitas)}</div>
        <div class="room-card__price${kamar.hargaBerdua ? ' room-card__price--rentang' : ''}">${hargaTeks(kamar)} <span>/ bulan</span></div>
        <div class="room-card__facilities">
          ${kamar.fasilitas.slice(0, 3).map(f => `<span class="room-card__facility-tag">${esc(f)}</span>`).join('')}
          ${kamar.fasilitas.length > 3 ? `<span class="room-card__facility-tag">+${kamar.fasilitas.length - 3}</span>` : ''}
        </div>
        <div class="room-card__action">
          <button type="button" class="btn btn-primary btn-sm btn-detail" data-id="${esc(kamar.id)}" aria-label="Lihat detail ${nama}" style="flex:1;justify-content:center;">
            Lihat Detail
          </button>
          <a href="${waUrl(KOS_DATA.nomorWA, waTextKamar(kamar))}" target="_blank" rel="noopener"
             data-action="pra-pesan" data-id="${esc(kamar.id)}"
             class="btn ${penuh ? 'btn-ghost' : 'btn-wa'} btn-sm" aria-label="${waLabel}" style="justify-content:center;">
            ${iconSvg('message-circle', 16)} ${penuh ? 'Kabari' : 'WA'}
          </a>
        </div>
      </div>
    </article>
  `;
}

/* ============================================================
   RENDER — ROOM DETAIL MODAL
   ============================================================ */

function renderRoomModal(kamar) {
    const kodeStatus = statusKamar(kamar);
    const status = STATUS_MAP[kodeStatus];
    const penuh = kodeStatus === 'tidak-tersedia';
    const nama = esc(kamar.nama);
    const foto = (kamar.foto && kamar.foto.length) ? kamar.foto : [PLACEHOLDER_IMG];

    const dotsHtml = foto.map((_, i) =>
        `<button type="button" class="modal__gallery-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Tampilkan foto ${i + 1}"></button>`
    ).join('');

    const navHtml = foto.length > 1 ? `
        <button type="button" class="modal__gallery-nav modal__gallery-nav--prev" id="modalGalleryPrev" aria-label="Foto sebelumnya">${iconSvg('arrow-left', 20)}</button>
        <button type="button" class="modal__gallery-nav modal__gallery-nav--next" id="modalGalleryNext" aria-label="Foto berikutnya">${iconSvg('arrow-right', 20)}</button>
        <div class="modal__gallery-dots" id="modalGalleryDots">${dotsHtml}</div>` : '';

    const galleryHtml = `
      <div class="modal__gallery" id="modalGallery">
        <img class="modal__gallery-main" id="modalGalleryMain" src="${esc(foto[0])}" alt="Foto ${nama} 1 dari ${foto.length}">
        ${navHtml}
      </div>
    `;

    const fasilitasHtml = kamar.fasilitas.map(f =>
        `<div class="modal__facility-item">${iconSvg('check', 16)} ${esc(f)}</div>`
    ).join('');

    const kamarMandiHtml = kamar.fotoKamarMandi ? `
      <div class="modal__bathroom">
        <h3 class="modal__bathroom-title">Kamar Mandi</h3>
        <img class="modal__bathroom-img" src="${esc(kamar.fotoKamarMandi)}" alt="Kamar mandi ${nama}" loading="lazy">
      </div>
    ` : '';

    return `
    <div class="modal-overlay" id="roomModal">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <button type="button" class="modal__close" id="modalClose" aria-label="Tutup detail kamar">${iconSvg('x', 24)}</button>
        ${galleryHtml}
        <div class="modal__body">
          <div class="modal__header">
            <div>
              <h2 class="modal__title" id="modalTitle">${nama}</h2>
              <span class="room-card__status ${status.cls}" style="position:static;display:inline-block;margin-top:8px;">${status.label}</span>
            </div>
            <div class="modal__price${kamar.hargaBerdua ? ' modal__price--rentang' : ''}">${hargaTeks(kamar)} <span>/ bulan</span></div>
          </div>

          <div class="modal__info-grid">
            <div class="modal__info-item">
              ${iconSvg('grid', 20)}
              <div>
                <div class="modal__info-label">Tipe</div>
                <div class="modal__info-value">${esc(kamar.tipe)}</div>
              </div>
            </div>
            <div class="modal__info-item">
              ${iconSvg('map-pin', 20)}
              <div>
                <div class="modal__info-label">Lantai</div>
                <div class="modal__info-value">${esc(kamar.lantai || '-')}</div>
              </div>
            </div>
            <div class="modal__info-item">
              ${iconSvg('users', 20)}
              <div>
                <div class="modal__info-label">Kapasitas</div>
                <div class="modal__info-value">${esc(kamar.kapasitas || '-')}</div>
              </div>
            </div>
            <div class="modal__info-item">
              ${iconSvg('dollar-sign', 20)}
              <div>
                <div class="modal__info-label">Harga</div>
                <div class="modal__info-value">${kamar.hargaBerdua
                    ? `${rupiah(kamar.harga)} (1 org) · ${rupiah(kamar.hargaBerdua)} (2 org)`
                    : `${rupiah(kamar.harga)}/bln`}</div>
              </div>
            </div>
          </div>

          <p class="modal__desc">${esc(kamar.deskripsi)}</p>

          <h3 class="modal__facilities-title">Fasilitas Kamar</h3>
          <div class="modal__facilities-list">${fasilitasHtml}</div>

          ${kamarMandiHtml}

          <div class="modal__warning">
            <strong>⚠️ Peringatan</strong>
            ${esc(KOS_DATA.peringatan)}
          </div>

          <a href="${waUrl(KOS_DATA.nomorWA, waTextKamar(kamar))}" target="_blank" rel="noopener"
             data-action="pra-pesan" data-id="${esc(kamar.id)}" class="btn btn-wa modal__wa-btn" style="margin-top:20px;">
            ${iconSvg('message-circle', 20)} ${penuh ? 'Minta Dikabari via WhatsApp' : 'Pesan atau Tanya via WhatsApp'}
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   RENDER — ALL SECTIONS
   ============================================================ */

function renderHero() {
    const container = document.getElementById('heroContent');
    if (!container) return;

    const tagline = esc(KOS_DATA.tagline || KOS_DATA.nama);
    const sorot = KOS_DATA.taglineSorot ? esc(KOS_DATA.taglineSorot) : '';
    const judul = (sorot && tagline.indexOf(sorot) !== -1)
        ? tagline.replace(sorot, `<span>${sorot}</span>`)
        : tagline;

    container.innerHTML = `
    <div class="hero__badge">${iconSvg('home', 14)} ${esc(KOS_DATA.nama)} — ${esc(KOS_DATA.kota)}</div>
    <h1 class="hero__title">${judul}</h1>
    <p class="hero__desc">${esc(KOS_DATA.deskripsiSingkat || KOS_DATA.deskripsi)}</p>
    <div class="hero__actions">
      <a href="kamar.html" class="btn btn-primary">
        ${iconSvg('home', 18)} Lihat Semua Kamar
      </a>
      <a href="#ketersediaan" class="btn btn-outline">
        ${iconSvg('search', 18)} Cek Ketersediaan
      </a>
    </div>
  `;
}

/**
 * Bagian "Kamar Tersedia" di beranda sengaja hanya memajang beberapa kartu.
 * Daftar lengkapnya ada di kamar.html — di sini pengunjung yang memutuskan
 * sendiri mau melihat lebih banyak atau tidak.
 */
let jumlahTersediaTampil = 0;

function batasTersediaAwal() {
    const batas = Number(KOS_DATA.jumlahKamarTersediaAwal);
    return (batas > 0) ? batas : 3;
}

function tampilkanLebihBanyakTersedia() {
    // Satu klik membuka seluruh sisanya. Membuka sedikit-sedikit membuat pengunjung
    // harus menekan tombol yang sama berkali-kali — itu terasa seperti macet.
    const sebelumnya = jumlahTersediaTampil;
    jumlahTersediaTampil = KOS_DATA.kamar.length;
    renderRoomAvailability();

    // Fokuskan kartu pertama yang baru muncul agar pengguna keyboard tidak tersesat.
    const kartu = document.querySelectorAll('#roomAvailability .room-card .btn-detail');
    const berikut = kartu[sebelumnya];
    if (berikut) berikut.focus();
}

function renderRoomAvailability() {
    const container = document.getElementById('roomAvailability');
    if (!container) return;

    const available = KOS_DATA.kamar.filter(k => statusKamar(k) === 'tersedia');

    if (available.length === 0) {
        container.innerHTML = `
        <div class="empty-state">
          ${iconSvg('home', 48)}
          <p>Belum ada kamar tersedia saat ini.</p>
          <a href="kamar.html" class="btn btn-primary btn-sm" style="margin-top:1rem;">
            ${iconSvg('home', 16)} Lihat semua kamar &amp; minta dikabari
          </a>
        </div>`;
        return;
    }

    if (jumlahTersediaTampil <= 0) jumlahTersediaTampil = batasTersediaAwal();

    const tampil = available.slice(0, jumlahTersediaTampil);
    const sisa = available.length - tampil.length;

    container.innerHTML = `
      <div class="rooms-grid">${tampil.map(renderRoomCard).join('')}</div>
      ${sisa > 0 ? `
        <div class="rooms-more">
          <button type="button" class="btn rooms-more__btn" data-action="tersedia-lainnya">
            Tampilkan ${sisa} kamar tersedia lainnya
          </button>
        </div>` : ''}
    `;
}

function renderAllRooms() {
    const container = document.getElementById('allRooms');
    if (!container) return;

    if (KOS_DATA.kamar.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>Belum ada data kamar.</p></div>`;
        return;
    }

    // Render awal ditangani applyRoomFilters supaya tidak menggambar dua kali.
    applyRoomFilters();
}

function renderFacilities() {
    const container = document.getElementById('facilitiesGrid');
    if (!container) return;
    if (!KOS_DATA.fasilitasUmum || KOS_DATA.fasilitasUmum.length === 0) return;

    container.innerHTML = KOS_DATA.fasilitasUmum.map(f => `
      <div class="facility-card">
        <div class="facility-card__icon">${iconSvg(f.ikon, 26)}</div>
        <div class="facility-card__name">${esc(f.nama)}</div>
      </div>
    `).join('');
}

function renderInfoPenting() {
    const container = document.getElementById('infoPenting');
    if (!container) return;

    const infoCards = [
        { icon: 'users', label: 'Target Penghuni', value: KOS_DATA.targetPenghuni },
        { icon: 'home', label: 'Maksimal per Kamar', value: `${KOS_DATA.maksPerKamar} orang` },
        { icon: 'clock', label: 'Minimal Sewa', value: KOS_DATA.minimalSewa },
        { icon: 'activity', label: 'Sistem Pemesanan', value: KOS_DATA.sistemPemesanan },
        { icon: 'zap', label: 'Biaya Termasuk', value: KOS_DATA.biayaTermasuk },
    ];

    const cardHtml = infoCards.map(c => `
      <div class="info-card">
        <div class="info-card__icon">${iconSvg(c.icon, 22)}</div>
        <div>
          <div class="info-card__label">${esc(c.label)}</div>
          <div class="info-card__value">${esc(c.value)}</div>
        </div>
      </div>
    `).join('');

    const metodeHtml = KOS_DATA.metodeBayar.map(m => `
      <div class="payment-method">
        ${iconSvg(m.ikon, 18)}
        ${esc(m.nama)}
      </div>
    `).join('');

    const peringatanHtml = KOS_DATA.peringatan ? `
      <div class="alert-banner" role="alert">
        <div class="alert-banner__icon">${iconSvg('alert-triangle', 24)}</div>
        <div>
          <strong style="display:block;margin-bottom:4px;">⚠️ WASPADA PENIPUAN KOST</strong>
          ${esc(KOS_DATA.peringatan)}
        </div>
      </div>
    ` : '';

    const edukasiHtml = (KOS_DATA.edukasi && KOS_DATA.edukasi.length > 0) ? `
      <div class="edu-section">
        ${KOS_DATA.edukasi.map(e => `
          <div class="edu-card">
            <h3 class="edu-card__title">${iconSvg('book', 18)} ${esc(e.judul)}</h3>
            <ul class="edu-card__list">
              ${e.items.map(item => `<li>${iconSvg('check', 14)} ${esc(item)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    ` : '';

    container.innerHTML = `
      <div class="info-grid">${cardHtml}</div>

      <div class="info-subsection">
        <h3 class="info-subsection__title">${iconSvg('smartphone', 20)} Metode Pembayaran</h3>
        <p style="color:var(--text-secondary);margin-bottom:var(--space-md);font-size:var(--font-size-sm);">Pembayaran sewa kost dapat melalui:</p>
        <div class="payment-grid">${metodeHtml}</div>
      </div>

      ${peringatanHtml}
      ${edukasiHtml}
    `;
}

/* ============================================================
   GALERI + LIGHTBOX
   ============================================================ */

// Foto kategori yang sedang tampil — dipakai lightbox untuk navigasi prev/next.
let galeriAktif = [];
let galeriAktifLabel = '';

function galleryGridHtml(images, kategori) {
    return images.map((url, i) => `
      <button type="button" class="gallery-item" data-index="${i}" aria-label="Perbesar foto ${esc(kategori)} ${i + 1}">
        <img src="${esc(url)}" alt="${esc(kategori)} — foto ${i + 1}" loading="lazy" width="600" height="450">
        <span class="gallery-item__overlay">${iconSvg('maximize', 40)}</span>
      </button>
    `).join('');
}

function renderGallery() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;

    const galeri = KOS_DATA.galeri || {};
    const categories = Object.keys(galeri);

    if (categories.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>Belum ada galeri foto.</p></div>`;
        return;
    }

    const tabsHtml = categories.map((cat, i) => `
      <button type="button" role="tab" class="gallery-tab ${i === 0 ? 'active' : ''}"
              data-category="${esc(cat)}" aria-selected="${i === 0}" tabindex="${i === 0 ? '0' : '-1'}">${esc(cat)}</button>
    `).join('');

    const firstCat = categories[0];
    galeriAktif = galeri[firstCat] || [];
    galeriAktifLabel = firstCat;

    container.innerHTML = `
      <div class="gallery-tabs" id="galleryTabs" role="tablist" aria-label="Kategori foto">${tabsHtml}</div>
      <div class="gallery-grid" id="galleryGrid">${galleryGridHtml(galeriAktif, firstCat)}</div>
    `;

    const tabsEl = document.getElementById('galleryTabs');
    const gridEl = document.getElementById('galleryGrid');

    const pilihTab = (tab) => {
        const tabs = Array.from(tabsEl.querySelectorAll('.gallery-tab'));
        tabs.forEach(t => {
            const aktif = t === tab;
            t.classList.toggle('active', aktif);
            t.setAttribute('aria-selected', String(aktif));
            t.tabIndex = aktif ? 0 : -1;
        });

        const cat = tab.dataset.category;
        galeriAktif = galeri[cat] || [];
        galeriAktifLabel = cat;
        gridEl.innerHTML = galleryGridHtml(galeriAktif, cat);
    };

    tabsEl.addEventListener('click', (e) => {
        const tab = e.target.closest('.gallery-tab');
        if (tab) pilihTab(tab);
    });

    // Navigasi tab dengan panah kiri/kanan (pola ARIA tablist).
    tabsEl.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const tabs = Array.from(tabsEl.querySelectorAll('.gallery-tab'));
        const idx = tabs.indexOf(document.activeElement);
        if (idx === -1) return;
        e.preventDefault();
        const next = tabs[(idx + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        pilihTab(next);
        next.focus();
    });

    // Satu listener untuk seluruh grid — tidak perlu dipasang ulang tiap ganti tab.
    gridEl.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (!item) return;
        openLightbox(galeriAktif, Number(item.dataset.index) || 0, galeriAktifLabel, item);
    });
}

function renderLocation() {
    const container = document.getElementById('locationContent');
    if (!container) return;

    container.innerHTML = `
      <div class="location-wrapper">
        <div class="location-info">
          <div class="location-detail">
            <div class="location-detail__icon">${iconSvg('map-pin', 20)}</div>
            <div>
              <div class="location-detail__label">Alamat</div>
              <div class="location-detail__value">${esc(KOS_DATA.alamat)}</div>
            </div>
          </div>

          <div class="location-detail">
            <div class="location-detail__icon">${iconSvg('phone', 20)}</div>
            <div>
              <div class="location-detail__label">WhatsApp</div>
              <div class="location-detail__value">+${esc(KOS_DATA.nomorWA)}</div>
            </div>
          </div>

          <a href="${esc(KOS_DATA.mapsLink)}" target="_blank" rel="noopener" class="btn btn-primary" style="align-self:flex-start;">
            ${iconSvg('navigation', 18)} Buka Google Maps
          </a>

          ${KOS_DATA.tempatSekitar && KOS_DATA.tempatSekitar.length > 0 ? `
            <div class="nearby-places">
              <h3 class="nearby-places__title">Tempat di Sekitar</h3>
              <div class="nearby-places__grid">
                ${KOS_DATA.tempatSekitar.map(t => `
                  <div class="nearby-place">
                    ${iconSvg('map-pin-fill', 14)}
                    <span class="nearby-place__name">${esc(t.nama)}</span>
                    <span class="nearby-place__distance">${esc(t.jarak)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <div class="location-map">
          <iframe src="${esc(mapsEmbedUrl(KOS_DATA.mapsEmbed))}" allowfullscreen loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade" title="Peta lokasi ${esc(KOS_DATA.nama)}"></iframe>
        </div>
      </div>
    `;
}

function renderAdvantages() {
    const container = document.getElementById('advantagesGrid');
    if (!container) return;
    if (!KOS_DATA.keunggulan || KOS_DATA.keunggulan.length === 0) return;

    container.innerHTML = KOS_DATA.keunggulan.map(a => `
      <div class="advantage-card">
        <div class="advantage-card__icon">${iconSvg(a.ikon, 24)}</div>
        <h3 class="advantage-card__title">${esc(a.judul)}</h3>
        <p class="advantage-card__desc">${esc(a.deskripsi)}</p>
      </div>
    `).join('');
}

function renderWACta() {
    const container = document.getElementById('waCta');
    if (!container) return;

    container.innerHTML = `
      <div class="wa-cta">
        <div class="wa-cta__content">
          <h2 class="wa-cta__title">Masih Ada Pertanyaan? 💬</h2>
          <p class="wa-cta__desc">Pilih kamar yang Anda minati, lalu tekan tombol pesan pada kamar tersebut. Anda akan diminta menjawab beberapa pertanyaan singkat dan menyetujui peraturan kost sebelum diteruskan ke WhatsApp. <br><strong>Ingat! Wajib cek fisik kamar sebelum transfer.</strong></p>
          <a href="kamar.html" class="btn btn-primary btn-wa-large">
            ${iconSvg('home', 22)} Lihat Daftar Kamar
          </a>
          <p class="wa-cta__nomor">WhatsApp kost: <strong>+${esc(KOS_DATA.nomorWA)}</strong></p>
        </div>
      </div>
    `;
}

function renderBackToTop() {
    const container = document.getElementById('backToTop');
    if (!container) return;

    container.innerHTML = `
      <button type="button" class="back-to-top" data-action="ke-atas" aria-label="Kembali ke atas halaman">
        ${iconSvg('arrow-up', 22)}
      </button>
    `;
}

function renderFooter() {
    const container = document.getElementById('footerContent');
    if (!container) return;

    container.innerHTML = `
      <div class="footer__grid">
        <div>
          <div class="footer__brand">
            <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;background:var(--primary);border-radius:8px;color:white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
            ${esc(KOS_DATA.nama)}
          </div>
          <p class="footer__desc">${esc(KOS_DATA.deskripsi)}</p>
        </div>

        <div>
          <h4 class="footer__section-title">Navigasi</h4>
          <div class="footer__links">
            <a class="footer__link" href="${ke('#beranda')}">Beranda</a>
            <a class="footer__link" href="kamar.html">Semua Kamar</a>
            <a class="footer__link" href="${ke('#ketersediaan')}">Kamar Tersedia</a>
            <a class="footer__link" href="${ke('#fasilitas')}">Fasilitas</a>
            <a class="footer__link" href="${ke('#info')}">Info &amp; Aturan</a>
            <a class="footer__link" href="${ke('#galeri')}">Galeri</a>
            <a class="footer__link" href="${ke('#lokasi')}">Lokasi</a>
            <a class="footer__link" href="${ke('#hubungi')}">Hubungi Kami</a>
          </div>
        </div>

        <div>
          <h4 class="footer__section-title">Kontak</h4>
          <div class="footer__contact-item">
            ${iconSvg('map-pin', 16)}
            <span>${esc(KOS_DATA.alamat)}</span>
          </div>
          <div class="footer__contact-item">
            ${iconSvg('phone', 16)}
            <span>+${esc(KOS_DATA.nomorWA)}</span>
          </div>
          <div class="footer__contact-item" style="margin-top:12px;">
            ${iconSvg('message-circle', 16)}
            <span>Pemesanan lewat tombol pesan pada masing-masing kamar.</span>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(KOS_DATA.nama)}. All rights reserved.</span>
      </div>
    `;
}

/* ============================================================
   STRUCTURED DATA (SEO) — dibangun dari data.js
   ============================================================ */

function injectStructuredData() {
    // Rentang harga memperhitungkan tarif 1 orang maupun tarif 2 orang.
    const harga = [];
    KOS_DATA.kamar.forEach(k => {
        if (typeof k.harga === 'number') harga.push(k.harga);
        if (typeof k.hargaBerdua === 'number') harga.push(k.hargaBerdua);
    });
    const baseUrl = window.location.href.split('#')[0];

    const data = {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: KOS_DATA.nama,
        description: KOS_DATA.deskripsi,
        url: baseUrl,
        telephone: '+' + KOS_DATA.nomorWA,
        address: {
            '@type': 'PostalAddress',
            streetAddress: KOS_DATA.alamat,
            addressLocality: KOS_DATA.kota,
            addressRegion: KOS_DATA.provinsi,
            addressCountry: 'ID',
        },
        numberOfRooms: KOS_DATA.kamar.length,
        petsAllowed: false,
        amenityFeature: (KOS_DATA.fasilitasUmum || []).map(f => ({
            '@type': 'LocationFeatureSpecification',
            name: f.nama,
            value: true,
        })),
    };

    if (harga.length) {
        data.priceRange = `${rupiah(Math.min(...harga))} – ${rupiah(Math.max(...harga))} / bulan`;
        data.makesOffer = KOS_DATA.kamar.map(k => ({
            '@type': 'Offer',
            name: `${k.nama} — ${k.tipe}`,
            price: k.harga,
            priceCurrency: 'IDR',
            availability: statusKamar(k) === 'tidak-tersedia'
                ? 'https://schema.org/SoldOut'
                : 'https://schema.org/InStock',
        }));
    }

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
}

/* ============================================================
   MODAL — Room Detail
   ============================================================ */

let currentModalData = null;
let currentGalleryIndex = 0;
let lastFocusedBeforeModal = null;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Kunci Tab agar tidak keluar dari dialog yang sedang terbuka. */
function trapFocus(container, e) {
    const items = Array.from(container.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null);
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function openRoomModal(kamarId, pemicu) {
    const kamar = KOS_DATA.kamar.find(k => String(k.id) === String(kamarId));
    if (!kamar) return;

    // Bersihkan sisa modal sebelumnya, termasuk yang masih dalam animasi menutup.
    if (document.getElementById('roomModal')) closeRoomModal(true);
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());

    currentModalData = kamar;
    currentGalleryIndex = 0;
    lastFocusedBeforeModal = pemicu || document.activeElement;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderRoomModal(kamar);
    document.body.appendChild(wrapper.firstElementChild);

    const modal = document.getElementById('roomModal');
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => modal.classList.add('active'));

    document.getElementById('modalClose').addEventListener('click', () => closeRoomModal());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRoomModal();
    });
    document.addEventListener('keydown', modalKeyHandler);

    setupModalGallery();
    document.getElementById('modalClose').focus();
}

function closeRoomModal(instant) {
    const modal = document.getElementById('roomModal');
    if (!modal) return;

    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', modalKeyHandler);

    if (instant) {
        modal.remove();
    } else {
        setTimeout(() => modal.remove(), 300);
    }

    if (lastFocusedBeforeModal && document.contains(lastFocusedBeforeModal)) {
        lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
    currentModalData = null;
}

function modalKeyHandler(e) {
    const modal = document.getElementById('roomModal');
    if (!modal) return;

    // Dialog yang menumpuk di atas modal kamar (form pra-pemesanan & peraturan)
    // menangani tombolnya sendiri — Escape di sana tidak boleh ikut menutup modal ini.
    if (document.getElementById('prapesanOverlay') || document.getElementById('peraturanOverlay')) return;

    if (e.key === 'Escape') {
        closeRoomModal();
        return;
    }
    if (e.key === 'Tab') {
        trapFocus(modal, e);
        return;
    }
    // Panah kiri/kanan untuk berpindah foto kamar.
    if (currentModalData && currentModalData.foto && currentModalData.foto.length > 1) {
        if (e.key === 'ArrowLeft') document.getElementById('modalGalleryPrev')?.click();
        if (e.key === 'ArrowRight') document.getElementById('modalGalleryNext')?.click();
    }
}

function setupModalGallery() {
    const kamar = currentModalData;
    if (!kamar || !kamar.foto || kamar.foto.length <= 1) return;

    const mainImg = document.getElementById('modalGalleryMain');
    const prevBtn = document.getElementById('modalGalleryPrev');
    const nextBtn = document.getElementById('modalGalleryNext');
    const dots = document.getElementById('modalGalleryDots');
    if (!mainImg || !prevBtn || !nextBtn || !dots) return;

    const total = kamar.foto.length;

    const updateGallery = (idx) => {
        currentGalleryIndex = idx;
        mainImg.src = kamar.foto[idx];
        mainImg.alt = `Foto ${kamar.nama} ${idx + 1} dari ${total}`;
        dots.querySelectorAll('.modal__gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    };

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGallery((currentGalleryIndex - 1 + total) % total);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateGallery((currentGalleryIndex + 1) % total);
    });

    dots.querySelectorAll('.modal__gallery-dot').forEach((dot) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            updateGallery(parseInt(dot.dataset.index, 10) || 0);
        });
    });
}

/* ============================================================
   MODAL — Form Pra-Pemesanan (penyaring sebelum ke WhatsApp)
   ============================================================
   Dua dialog bertingkat di atas modal kamar:
   1. .prapesan-overlay  — pertanyaan penyaring (semuanya pilihan, bukan isian teks)
   2. .peraturan-overlay — daftar peraturan kost, wajib dicentang satu per satu
   Semua isinya berasal dari KOS_DATA.formPraPesan — tidak ada teks di file ini.
   Jawaban tidak dikirim ke mana pun, hanya dirangkai jadi isi pesan WhatsApp.
   ============================================================ */

let praPesanKamar = null;   // Kamar yang sedang diproses
let praPesanJawaban = {};   // { idPertanyaan: nilai terpilih }
let praPesanSetuju = false; // Sudah menyetujui seluruh peraturan kost?
let lastFocusedBeforePraPesan = null;
let lastFocusedBeforePeraturan = null;

/** Konfigurasi form dari data.js — null bila dimatikan atau belum diisi. */
function praPesanConfig() {
    const cfg = KOS_DATA.formPraPesan;
    if (!cfg || cfg.aktif === false) return null;
    if (!Array.isArray(cfg.pertanyaan) || !cfg.pertanyaan.length) return null;
    return cfg;
}

/** Persetujuan peraturan hanya diwajibkan bila daftarnya memang ada isinya. */
function praPesanButuhPeraturan(cfg) {
    const aturan = cfg.peraturan;
    return !!(aturan && Array.isArray(aturan.items) && aturan.items.length);
}

/** Jumlah penghuni yang dipilih di form (dari opsi ber-`orang`), atau null. */
function praPesanOrangTerpilih(cfg) {
    for (const pertanyaan of cfg.pertanyaan) {
        const nilai = praPesanJawaban[pertanyaan.id];
        if (nilai == null) continue;
        const opsi = (pertanyaan.opsi || []).find(o => o.nilai === nilai);
        if (opsi && opsi.orang != null) return Number(opsi.orang);
    }
    return null;
}

function praPesanLengkap(cfg) {
    const semuaDijawab = cfg.pertanyaan.every(p => praPesanJawaban[p.id] != null);
    const aturanOk = !praPesanButuhPeraturan(cfg) || praPesanSetuju;
    return semuaDijawab && aturanOk;
}

function renderPraPesan(kamar, cfg) {
    const penuh = statusKamar(kamar) === 'tidak-tersedia';
    const aturan = cfg.peraturan || {};
    // Batas penghuni kamar ini — mematikan opsi jumlah orang yang melebihinya.
    const maksOrang = Number(kamar.maksOrang || KOS_DATA.maksPerKamar || 1);

    const pertanyaanHtml = cfg.pertanyaan.map((pertanyaan, qi) => {
        const labelId = `prapesanQ${qi}Label`;
        const grup = `prapesanQ${qi}`;

        const opsiHtml = (pertanyaan.opsi || []).map((opsi, oi) => {
            const inputId = `${grup}Opsi${oi}`;
            // Opsi nonaktif memakai atribut `disabled` bawaan browser: tidak bisa
            // diklik, tidak bisa dipilih lewat keyboard, dan dilewati saat Tab.
            // `orang` mematikannya per kamar (mis. "2 orang" di kamar khusus 1 orang).
            const nonaktif = !!opsi.nonaktif ||
                (opsi.orang != null && Number(opsi.orang) > maksOrang);
            const catatan = (nonaktif && opsi.catatanNonaktif) ? opsi.catatanNonaktif : opsi.catatan;
            return `
            <label class="prapesan__option${nonaktif ? ' prapesan__option--nonaktif' : ''}" for="${inputId}">
              <input type="radio" class="prapesan__option-input" id="${inputId}" name="${grup}"
                     value="${esc(opsi.nilai)}" data-pertanyaan="${esc(pertanyaan.id)}"${nonaktif ? ' disabled' : ''}>
              <span class="prapesan__option-mark" aria-hidden="true"></span>
              <span class="prapesan__option-text">
                <span class="prapesan__option-label">${esc(opsi.label || opsi.nilai)}</span>
                ${catatan ? `<span class="prapesan__option-note">${esc(catatan)}</span>` : ''}
              </span>
            </label>`;
        }).join('');

        return `
        <div class="prapesan__question">
          <div class="prapesan__question-label" id="${labelId}">
            ${iconSvg(pertanyaan.ikon || 'info', 16)} <span>${esc(pertanyaan.label)}</span>
          </div>
          <div class="prapesan__options" role="radiogroup" aria-labelledby="${labelId}">${opsiHtml}</div>
        </div>`;
    }).join('');

    const aturanHtml = praPesanButuhPeraturan(cfg) ? `
        <div class="prapesan__question">
          <div class="prapesan__question-label">
            ${iconSvg('book', 16)} <span>Persetujuan peraturan kost</span>
          </div>
          <button type="button" class="prapesan__agree-btn" data-action="buka-peraturan" aria-haspopup="dialog">
            <span class="prapesan__agree-mark" aria-hidden="true">${iconSvg('check', 14)}</span>
            <span class="prapesan__agree-text">${esc(aturan.labelPemicu || 'Baca & setujui peraturan kost')}</span>
            <span class="prapesan__agree-arrow" aria-hidden="true">${iconSvg('arrow-right', 16)}</span>
          </button>
        </div>` : '';

    return `
    <div class="prapesan-overlay" id="prapesanOverlay">
      <div class="prapesan" role="dialog" aria-modal="true" aria-labelledby="prapesanTitle" aria-describedby="prapesanDesc">
        <div class="prapesan__header">
          <div class="prapesan__heading">
            <h2 class="prapesan__title" id="prapesanTitle">${esc(cfg.judul || 'Sebelum Lanjut ke WhatsApp')}</h2>
            <p class="prapesan__room">${iconSvg('home', 14)} ${esc(kamar.nama)} — <span id="prapesanHarga">${hargaTeks(kamar)}/bulan</span></p>
          </div>
          <button type="button" class="prapesan__close" data-action="tutup-prapesan" aria-label="Tutup form pra-pemesanan">${iconSvg('x', 20)}</button>
        </div>

        <div class="prapesan__body">
          <p class="prapesan__desc" id="prapesanDesc">${esc(cfg.deskripsi || '')}</p>
          ${pertanyaanHtml}
          ${aturanHtml}
        </div>

        <div class="prapesan__footer">
          <p class="prapesan__hint" id="prapesanHint"></p>
          <button type="button" class="btn btn-wa prapesan__submit" id="prapesanSubmit" data-action="kirim-prapesan" disabled>
            ${iconSvg('message-circle', 18)} ${esc(penuh ? (cfg.labelLanjutTunggu || 'Lanjut Minta Dikabari') : (cfg.labelLanjut || 'Lanjut ke WhatsApp'))}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Buka form penyaring. Mengembalikan false bila form tidak bisa dipakai —
 * pemanggilnya lalu membiarkan tautan WhatsApp jalan seperti biasa.
 */
function openPraPesan(kamarId, pemicu) {
    const cfg = praPesanConfig();
    if (!cfg) return false;

    const kamar = KOS_DATA.kamar.find(k => String(k.id) === String(kamarId));
    if (!kamar) return false;

    // Bersihkan sisa dialog sebelumnya, termasuk yang masih dalam animasi menutup.
    document.removeEventListener('keydown', praPesanKeyHandler);
    document.removeEventListener('keydown', peraturanKeyHandler);
    document.querySelectorAll('.prapesan-overlay, .peraturan-overlay').forEach(el => el.remove());

    praPesanKamar = kamar;
    praPesanJawaban = {};
    praPesanSetuju = false;
    lastFocusedBeforePraPesan = pemicu || document.activeElement;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderPraPesan(kamar, cfg);
    const overlay = wrapper.firstElementChild;
    document.body.appendChild(overlay);
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => overlay.classList.add('active'));

    // Dialog dibuat baru setiap kali dibuka lalu dibuang saat ditutup,
    // jadi listener cukup dipasang sekali di elemen overlay-nya.
    overlay.addEventListener('click', onPraPesanClick);
    overlay.addEventListener('change', onPraPesanChange);
    document.addEventListener('keydown', praPesanKeyHandler);

    updatePraPesanUI();
    overlay.querySelector('.prapesan__close').focus();
    return true;
}

function closePraPesan(instant) {
    const overlay = document.getElementById('prapesanOverlay');
    document.removeEventListener('keydown', praPesanKeyHandler);
    if (!overlay) return;

    closePeraturan(true);

    overlay.classList.remove('active');
    if (instant) overlay.remove();
    else setTimeout(() => overlay.remove(), 300);

    // Modal detail kamar bisa masih terbuka di belakang — kunci scroll-nya jangan dilepas.
    if (!document.getElementById('roomModal')) {
        document.body.classList.remove('no-scroll');
    }

    if (lastFocusedBeforePraPesan && document.contains(lastFocusedBeforePraPesan)) {
        lastFocusedBeforePraPesan.focus();
    }
    lastFocusedBeforePraPesan = null;
    praPesanKamar = null;
}

function praPesanKeyHandler(e) {
    const overlay = document.getElementById('prapesanOverlay');
    if (!overlay) return;
    // Saat pop up peraturan menumpuk di atasnya, dialog itu yang menangani tombol.
    if (document.getElementById('peraturanOverlay')) return;

    if (e.key === 'Escape') {
        closePraPesan();
        return;
    }
    if (e.key === 'Tab') trapFocus(overlay, e);
}

function onPraPesanClick(e) {
    const overlay = document.getElementById('prapesanOverlay');
    if (e.target === overlay) {
        closePraPesan();
        return;
    }

    const tombol = e.target.closest('[data-action]');
    if (!tombol || !overlay || !overlay.contains(tombol)) return;

    if (tombol.dataset.action === 'tutup-prapesan') closePraPesan();
    else if (tombol.dataset.action === 'buka-peraturan') openPeraturan(tombol);
    else if (tombol.dataset.action === 'kirim-prapesan') kirimPraPesan();
}

function onPraPesanChange(e) {
    const input = e.target.closest('.prapesan__option-input');
    if (!input) return;

    praPesanJawaban[input.dataset.pertanyaan] = input.value;

    // Tandai opsi terpilih tanpa render ulang, supaya fokus keyboard tidak lompat.
    const grup = input.closest('.prapesan__options');
    if (grup) {
        grup.querySelectorAll('.prapesan__option').forEach(label => {
            const radio = label.querySelector('.prapesan__option-input');
            label.classList.toggle('prapesan__option--aktif', !!radio && radio.checked);
        });
    }

    updatePraPesanUI();
}

/** Segarkan status persetujuan peraturan dan kunci tombol lanjut. */
function updatePraPesanUI() {
    const cfg = praPesanConfig();
    const overlay = document.getElementById('prapesanOverlay');
    if (!cfg || !overlay) return;

    // Tarif menyesuaikan jumlah penghuni yang dipilih; sebelum dipilih, tampilkan rentangnya.
    const hargaEl = overlay.querySelector('#prapesanHarga');
    if (hargaEl && praPesanKamar) {
        const orang = praPesanOrangTerpilih(cfg);
        hargaEl.textContent = orang
            ? `${rupiah(hargaKamar(praPesanKamar, orang))}/bulan untuk ${orang} orang`
            : `${hargaTeks(praPesanKamar)}/bulan`;
    }

    const aturanBtn = overlay.querySelector('[data-action="buka-peraturan"]');
    if (aturanBtn) {
        const aturan = cfg.peraturan || {};
        aturanBtn.classList.toggle('prapesan__agree-btn--selesai', praPesanSetuju);
        const teks = aturanBtn.querySelector('.prapesan__agree-text');
        if (teks) {
            teks.textContent = praPesanSetuju
                ? (aturan.labelSudah || 'Peraturan kost sudah disetujui')
                : (aturan.labelPemicu || 'Baca & setujui peraturan kost');
        }
    }

    const lengkap = praPesanLengkap(cfg);
    const submit = overlay.querySelector('#prapesanSubmit');
    const hint = overlay.querySelector('#prapesanHint');
    if (submit) submit.disabled = !lengkap;
    if (hint) hint.textContent = lengkap ? '' : (cfg.pesanBelumLengkap || '');
}

function kirimPraPesan() {
    const cfg = praPesanConfig();
    const kamar = praPesanKamar;
    if (!cfg || !kamar || !praPesanLengkap(cfg)) return;

    const ringkasan = cfg.pertanyaan
        .map(p => `• ${p.label}: ${praPesanJawaban[p.id]}`)
        .join('\n');

    const penuh = statusKamar(kamar) === 'tidak-tersedia';
    const harga = rupiah(hargaKamar(kamar, praPesanOrangTerpilih(cfg) || 1));
    const pembuatPesan = penuh ? cfg.waPesanTunggu : cfg.waPesan;
    const teks = typeof pembuatPesan === 'function'
        ? pembuatPesan(kamar.nama, ringkasan, harga)
        : waTextKamar(kamar);

    // Dibuka langsung di dalam event klik agar tidak dianggap pop up liar oleh browser.
    window.open(waUrl(KOS_DATA.nomorWA, teks), '_blank', 'noopener');
    closePraPesan();
}

/* ============================================================
   MODAL — Peraturan Kost (wajib dicentang satu per satu)
   ============================================================ */

function renderPeraturan(cfg) {
    const aturan = cfg.peraturan || {};
    const items = aturan.items || [];

    const itemsHtml = items.map((item, i) => {
        const judul = typeof item === 'string' ? item : (item.judul || '');
        const isi = typeof item === 'string' ? '' : (item.isi || '');
        const inputId = `peraturanCek${i}`;

        return `
        <li class="peraturan__item">
          <label class="peraturan__label ${praPesanSetuju ? 'peraturan__label--aktif' : ''}" for="${inputId}">
            <input type="checkbox" class="peraturan__check" id="${inputId}" ${praPesanSetuju ? 'checked' : ''}>
            <span class="peraturan__mark" aria-hidden="true">${iconSvg('check', 14)}</span>
            <span class="peraturan__text">
              <strong class="peraturan__item-title">${esc(judul)}</strong>
              ${isi ? `<span class="peraturan__item-desc">${esc(isi)}</span>` : ''}
            </span>
          </label>
        </li>`;
    }).join('');

    return `
    <div class="peraturan-overlay" id="peraturanOverlay">
      <div class="peraturan" role="dialog" aria-modal="true" aria-labelledby="peraturanTitle" aria-describedby="peraturanDesc">
        <div class="peraturan__header">
          <div class="peraturan__heading">
            <h2 class="peraturan__title" id="peraturanTitle">${esc(aturan.judul || 'Peraturan Kost')}</h2>
            <p class="peraturan__desc" id="peraturanDesc">${esc(aturan.deskripsi || '')}</p>
          </div>
          <button type="button" class="peraturan__close" data-action="tutup-peraturan" aria-label="Tutup peraturan kost">${iconSvg('x', 20)}</button>
        </div>

        <div class="peraturan__body">
          <ul class="peraturan__list">${itemsHtml}</ul>
        </div>

        <div class="peraturan__footer">
          <p class="peraturan__progress" id="peraturanProgress" aria-live="polite"></p>
          <button type="button" class="btn btn-primary peraturan__submit" id="peraturanSubmit" data-action="setuju-peraturan" disabled>
            ${iconSvg('check', 18)} ${esc(aturan.labelSetuju || 'Saya Setuju & Lanjutkan')}
          </button>
        </div>
      </div>
    </div>
  `;
}

function openPeraturan(pemicu) {
    const cfg = praPesanConfig();
    if (!cfg || !praPesanButuhPeraturan(cfg)) return;

    document.removeEventListener('keydown', peraturanKeyHandler);
    document.querySelectorAll('.peraturan-overlay').forEach(el => el.remove());

    lastFocusedBeforePeraturan = pemicu || document.activeElement;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderPeraturan(cfg);
    const overlay = wrapper.firstElementChild;
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add('active'));

    overlay.addEventListener('click', onPeraturanClick);
    overlay.addEventListener('change', onPeraturanChange);
    document.addEventListener('keydown', peraturanKeyHandler);

    updatePeraturanUI();
    overlay.querySelector('.peraturan__close').focus();
}

function closePeraturan(instant) {
    const overlay = document.getElementById('peraturanOverlay');
    document.removeEventListener('keydown', peraturanKeyHandler);
    if (!overlay) return;

    overlay.classList.remove('active');
    if (instant) overlay.remove();
    else setTimeout(() => overlay.remove(), 300);

    // Kunci scroll tetap dipegang form pra-pemesanan yang ada di belakangnya.
    if (!instant && lastFocusedBeforePeraturan && document.contains(lastFocusedBeforePeraturan)) {
        lastFocusedBeforePeraturan.focus();
    }
    lastFocusedBeforePeraturan = null;
}

function peraturanKeyHandler(e) {
    const overlay = document.getElementById('peraturanOverlay');
    if (!overlay) return;

    if (e.key === 'Escape') {
        closePeraturan();
        return;
    }
    if (e.key === 'Tab') trapFocus(overlay, e);
}

function onPeraturanClick(e) {
    const overlay = document.getElementById('peraturanOverlay');
    if (e.target === overlay) {
        closePeraturan();
        return;
    }

    const tombol = e.target.closest('[data-action]');
    if (!tombol || !overlay || !overlay.contains(tombol)) return;

    if (tombol.dataset.action === 'tutup-peraturan') {
        closePeraturan();
    } else if (tombol.dataset.action === 'setuju-peraturan') {
        if (!peraturanSemuaDicentang(overlay)) return;
        praPesanSetuju = true;
        closePeraturan();
        updatePraPesanUI();
    }
}

function onPeraturanChange(e) {
    const cek = e.target.closest('.peraturan__check');
    if (!cek) return;

    const label = cek.closest('.peraturan__label');
    if (label) label.classList.toggle('peraturan__label--aktif', cek.checked);

    // Mencabut satu centang membatalkan persetujuan yang sudah tercatat.
    if (!cek.checked) praPesanSetuju = false;

    updatePeraturanUI();
}

function peraturanSemuaDicentang(overlay) {
    const semua = Array.from(overlay.querySelectorAll('.peraturan__check'));
    return semua.length > 0 && semua.every(c => c.checked);
}

function updatePeraturanUI() {
    const cfg = praPesanConfig();
    const overlay = document.getElementById('peraturanOverlay');
    if (!cfg || !overlay) return;

    const aturan = cfg.peraturan || {};
    const semua = Array.from(overlay.querySelectorAll('.peraturan__check'));
    const dicentang = semua.filter(c => c.checked).length;
    const lengkap = semua.length > 0 && dicentang === semua.length;

    const progress = overlay.querySelector('#peraturanProgress');
    if (progress) {
        progress.textContent = lengkap
            ? ''
            : (typeof aturan.labelProgres === 'function'
                ? aturan.labelProgres(dicentang, semua.length)
                : `${dicentang} dari ${semua.length} peraturan disetujui`);
    }

    const submit = overlay.querySelector('#peraturanSubmit');
    if (submit) {
        submit.disabled = !lengkap;
        submit.title = lengkap ? '' : (aturan.pesanBelumSemua || '');
    }
}

/* ============================================================
   LIGHTBOX — Gallery image viewer
   ============================================================ */

let lightboxEl = null;
let lightboxImages = [];
let lightboxIndex = 0;
let lastFocusedBeforeLightbox = null;

function openLightbox(images, index, label, pemicu) {
    if (!images || !images.length) return;

    // Bersihkan sisa lightbox sebelumnya, termasuk yang masih dalam animasi menutup.
    if (lightboxEl) closeLightbox(true);
    document.querySelectorAll('.lightbox').forEach(el => el.remove());

    lightboxImages = images;
    lightboxIndex = index;
    lastFocusedBeforeLightbox = pemicu || document.activeElement;

    const banyak = images.length > 1;

    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.setAttribute('role', 'dialog');
    lightboxEl.setAttribute('aria-modal', 'true');
    lightboxEl.setAttribute('aria-label', `Foto ${esc(label)}`);
    lightboxEl.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Tutup foto">${iconSvg('x', 28)}</button>
      ${banyak ? `
        <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Foto sebelumnya">${iconSvg('arrow-left', 24)}</button>
        <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Foto berikutnya">${iconSvg('arrow-right', 24)}</button>
      ` : ''}
      <img src="${esc(images[index])}" alt="${esc(label)} — foto ${index + 1} dari ${images.length}">
      ${banyak ? `<div class="lightbox__counter" aria-live="polite">${index + 1} / ${images.length}</div>` : ''}
    `;
    document.body.appendChild(lightboxEl);
    document.body.classList.add('no-scroll');

    requestAnimationFrame(() => lightboxEl.classList.add('active'));

    lightboxEl.querySelector('.lightbox__close').addEventListener('click', () => closeLightbox());
    lightboxEl.addEventListener('click', (e) => {
        if (e.target === lightboxEl) closeLightbox();
    });

    if (banyak) {
        lightboxEl.querySelector('.lightbox__nav--prev').addEventListener('click', () => stepLightbox(-1));
        lightboxEl.querySelector('.lightbox__nav--next').addEventListener('click', () => stepLightbox(1));
    }

    document.addEventListener('keydown', lightboxKeyHandler);
    lightboxEl.querySelector('.lightbox__close').focus();
}

function stepLightbox(delta) {
    if (!lightboxEl || lightboxImages.length < 2) return;

    lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;

    const img = lightboxEl.querySelector('img');
    const counter = lightboxEl.querySelector('.lightbox__counter');
    img.src = lightboxImages[lightboxIndex];
    img.alt = `${galeriAktifLabel} — foto ${lightboxIndex + 1} dari ${lightboxImages.length}`;
    if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function closeLightbox(instant) {
    if (!lightboxEl) return;

    const el = lightboxEl;
    lightboxEl = null;

    // Listener selalu dilepas di sini, apa pun cara menutupnya (klik, tombol, atau Escape).
    document.removeEventListener('keydown', lightboxKeyHandler);
    el.classList.remove('active');

    // Scroll hanya dibuka lagi kalau tidak ada modal kamar yang masih terbuka.
    if (!document.getElementById('roomModal')) {
        document.body.classList.remove('no-scroll');
    }

    if (instant) {
        el.remove();
    } else {
        setTimeout(() => el.remove(), 300);
    }

    if (lastFocusedBeforeLightbox && document.contains(lastFocusedBeforeLightbox)) {
        lastFocusedBeforeLightbox.focus();
    }
    lastFocusedBeforeLightbox = null;
}

function lightboxKeyHandler(e) {
    if (!lightboxEl) return;

    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
    else if (e.key === 'Tab') trapFocus(lightboxEl, e);
}

/* ============================================================
   FILTERS
   ============================================================ */

/**
 * Dengan 21 kamar, menggambar semuanya sekaligus membuat halaman kepanjangan.
 * Daftar dipotong sampai `jumlahKamarAwal` dan sisanya dibuka lewat tombol.
 */
let jumlahKamarTampil = 0;

function batasKamarAwal() {
    const batas = Number(KOS_DATA.jumlahKamarAwal);
    return (batas > 0) ? batas : KOS_DATA.kamar.length;
}

function resetJumlahKamarTampil() {
    jumlahKamarTampil = batasKamarAwal();
}

function tampilkanLebihBanyakKamar() {
    // Satu klik membuka seluruh sisanya, bukan sebatas satu batch lagi.
    const sebelumnya = jumlahKamarTampil;
    jumlahKamarTampil = KOS_DATA.kamar.length;
    applyRoomFilters();

    // Fokuskan kartu pertama yang baru muncul agar pengguna keyboard tidak tersesat.
    const kartu = document.querySelectorAll('#allRooms .room-card .btn-detail');
    const berikut = kartu[sebelumnya];
    if (berikut) berikut.focus();
}

function applyRoomFilters() {
    const container = document.getElementById('allRooms');
    const statusEl = document.getElementById('filterStatus');
    const typeEl = document.getElementById('filterType');
    const searchEl = document.getElementById('filterSearch');
    const resultEl = document.getElementById('filterResult');

    if (!container || !statusEl || !typeEl || !searchEl) return;

    const statusVal = statusEl.value;
    const typeVal = typeEl.value;
    const searchVal = searchEl.value.toLowerCase().trim();
    const adaFilter = statusVal !== 'all' || typeVal !== '' || searchVal !== '';

    const filtered = KOS_DATA.kamar.filter(k => {
        if (statusVal !== 'all' && statusKamar(k) !== statusVal) return false;
        if (typeVal && k.tipe.toLowerCase() !== typeVal.toLowerCase()) return false;

        if (searchVal) {
            const match = k.nama.toLowerCase().includes(searchVal) ||
                k.tipe.toLowerCase().includes(searchVal) ||
                k.deskripsi.toLowerCase().includes(searchVal) ||
                k.fasilitas.some(f => f.toLowerCase().includes(searchVal));
            if (!match) return false;
        }

        return true;
    });

    if (resultEl) {
        resultEl.innerHTML = `
          <span>Menampilkan <strong>${filtered.length}</strong> dari ${KOS_DATA.kamar.length} kamar</span>
          ${adaFilter ? `<button type="button" class="filter-reset" data-action="reset-filter">${iconSvg('x', 14)} Reset filter</button>` : ''}
        `;
    }

    if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            ${iconSvg('search', 48)}
            <p>Tidak ada kamar yang sesuai dengan filter.</p>
            <button type="button" class="btn btn-primary btn-sm" data-action="reset-filter" style="margin-top:1rem;">Tampilkan semua kamar</button>
          </div>`;
        return;
    }

    if (jumlahKamarTampil <= 0) resetJumlahKamarTampil();

    const tampil = filtered.slice(0, jumlahKamarTampil);
    const sisa = filtered.length - tampil.length;

    container.innerHTML = `
      <div class="rooms-grid">${tampil.map(renderRoomCard).join('')}</div>
      ${sisa > 0 ? `
        <div class="rooms-more">
          <button type="button" class="btn rooms-more__btn" data-action="kamar-lainnya">
            Tampilkan ${sisa} kamar lainnya
          </button>
        </div>` : ''}
    `;
}

function resetRoomFilters() {
    const statusEl = document.getElementById('filterStatus');
    const typeEl = document.getElementById('filterType');
    const searchEl = document.getElementById('filterSearch');

    if (statusEl) statusEl.value = 'all';
    if (typeEl) typeEl.value = '';
    if (searchEl) searchEl.value = '';

    resetJumlahKamarTampil();
    applyRoomFilters();
}

/** Isi dropdown filter tipe dari daftar kamar — tipe tidak ditulis di HTML. */
function renderTypeFilterOptions() {
    const typeEl = document.getElementById('filterType');
    if (!typeEl) return;

    const tipe = [];
    KOS_DATA.kamar.forEach(k => {
        if (k.tipe && tipe.indexOf(k.tipe) === -1) tipe.push(k.tipe);
    });

    typeEl.insertAdjacentHTML('beforeend',
        tipe.map(t => `<option value="${esc(t)}">${esc(t)}</option>`).join(''));
}

function initFilters() {
    const statusEl = document.getElementById('filterStatus');
    const typeEl = document.getElementById('filterType');
    const searchEl = document.getElementById('filterSearch');

    // Ganti filter = mulai lagi dari batas awal, bukan meneruskan daftar yang sudah dibuka.
    const onFilterChange = () => {
        resetJumlahKamarTampil();
        applyRoomFilters();
    };

    // Satu event saja per elemen — 'change' + 'input' bersamaan membuat filter jalan dua kali.
    if (statusEl) statusEl.addEventListener('change', onFilterChange);
    if (typeEl) typeEl.addEventListener('change', onFilterChange);
    if (searchEl) searchEl.addEventListener('input', debounce(onFilterChange, 200));
}

/* ============================================================
   DELEGASI KLIK GLOBAL
   ============================================================ */

/**
 * Kartu kamar dirender ulang setiap kali filter berubah, jadi listener
 * dipasang sekali di document — bukan per tombol, yang dulu menumpuk.
 */
function initGlobalClickHandlers() {
    document.addEventListener('click', (e) => {
        const detailBtn = e.target.closest('.btn-detail');
        if (detailBtn) {
            openRoomModal(detailBtn.dataset.id, detailBtn);
            return;
        }

        // Tombol WhatsApp per kamar disaring dulu lewat form pra-pemesanan.
        // Bila form dimatikan di data.js, tautan WhatsApp-nya dibiarkan jalan apa adanya.
        const pesanBtn = e.target.closest('[data-action="pra-pesan"]');
        if (pesanBtn) {
            if (openPraPesan(pesanBtn.dataset.id, pesanBtn)) e.preventDefault();
            return;
        }

        const lagiBtn = e.target.closest('[data-action="kamar-lainnya"]');
        if (lagiBtn) {
            tampilkanLebihBanyakKamar();
            return;
        }

        const lagiTersediaBtn = e.target.closest('[data-action="tersedia-lainnya"]');
        if (lagiTersediaBtn) {
            tampilkanLebihBanyakTersedia();
            return;
        }

        const atasBtn = e.target.closest('[data-action="ke-atas"]');
        if (atasBtn) {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
            // Fokus ikut naik, kalau tidak pengguna keyboard tetap tertinggal di bawah.
            document.querySelector('.nav__logo')?.focus();
            return;
        }

        const resetBtn = e.target.closest('[data-action="reset-filter"]');
        if (resetBtn) {
            resetRoomFilters();
            document.getElementById('filterSearch')?.focus();
        }
    });
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function initNavigation() {
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    const closeMenu = () => {
        if (!navLinks || !navLinks.classList.contains('open')) return;
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = !navLinks.classList.contains('open');
            navLinks.classList.toggle('open', open);
            hamburger.classList.toggle('active', open);
            hamburger.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('menu-open', open);
        });

        navLinks.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Tutup saat klik di luar menu atau menekan Escape.
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    // Scroll spy: hanya section yang benar-benar punya link di navbar.
    const links = Array.from(document.querySelectorAll('.nav__link'));
    // Sebagian tautan navbar menunjuk halaman lain (kamar.html, index.html#...),
    // bukan section di halaman ini — hanya tautan berawalan "#" yang bisa dipantau.
    const targets = links
        .map(link => {
            const href = link.getAttribute('href') || '';
            return { link, section: href.charAt(0) === '#' ? document.querySelector(href) : null };
        })
        .filter(t => t.section);

    // Tombol "ke atas" ikut menumpang listener scroll yang sudah ada di sini.
    const tombolAtas = document.querySelector('.back-to-top');

    const onScroll = rafThrottle(() => {
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
        if (tombolAtas) tombolAtas.classList.toggle('back-to-top--tampil', window.scrollY > 500);
        if (!targets.length) return;

        const posisi = window.scrollY + 160;
        let aktif = targets[0];
        targets.forEach(t => {
            if (t.section.offsetTop <= posisi) aktif = t;
        });

        // Di dasar halaman, section terakhir mungkin terlalu pendek untuk terpilih.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            aktif = targets[targets.length - 1];
        }

        links.forEach(l => l.classList.toggle('active', l === aktif.link));
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */

function initScrollAnimations() {
    const items = document.querySelectorAll('.animate-on-scroll');

    // Tanpa IntersectionObserver atau saat user minta animasi minimal,
    // konten langsung ditampilkan — jangan sampai section tak terlihat selamanya.
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
        items.forEach(el => el.classList.add('animated'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    });

    items.forEach(el => observer.observe(el));
}

/* ============================================================
   INIT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderRoomAvailability();
    renderAllRooms();
    renderFacilities();
    renderInfoPenting();
    renderGallery();
    renderLocation();
    renderAdvantages();
    renderWACta();
    renderBackToTop();
    renderFooter();

    renderTypeFilterOptions();
    initFilters();
    initGlobalClickHandlers();
    initNavigation();
    initScrollAnimations();
    injectStructuredData();
});
