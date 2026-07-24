# AI Website Cloner

Tool untuk meng-clone tampilan sebuah website dan mengubahnya jadi project
**Next.js + Tailwind CSS + Framer Motion** yang siap dikembangkan lebih lanjut.

Panduan ini ditulis lengkap untuk pemula — ikuti dari atas ke bawah, tidak perlu
pengalaman sebelumnya dengan Node.js atau Next.js.

> Semua contoh perintah di bawah dijalankan di **Terminal** (macOS/Linux) atau
> **PowerShell/Terminal** (Windows, disarankan pakai [WSL](https://learn.microsoft.com/windows/wsl/install)).

---

## Daftar Isi

1. [Cara Install](#1-cara-install)
2. [Cara Update](#2-cara-update)
3. [Cara Clone Website](#3-cara-clone-website)
4. [Cara Generate Ulang](#4-cara-generate-ulang)
5. [Cara Export](#5-cara-export)
6. [Cara Build](#6-cara-build)
7. [Cara Deploy ke Vercel](#7-cara-deploy-ke-vercel)
8. [Troubleshooting](#8-troubleshooting)
9. [Isi Repo Ini](#9-isi-repo-ini)

---

## 1. Cara Install

### 1.1 Yang perlu disiapkan

| Kebutuhan | Kegunaan | Link |
|---|---|---|
| **Node.js versi 20 ke atas** | menjalankan semua tool di repo ini | [nodejs.org](https://nodejs.org) |
| **Git** | mengunduh (clone) repo ini | [git-scm.com](https://git-scm.com) |
| **Akun Firecrawl (gratis untuk mulai)** | dipakai untuk menemukan semua halaman di website target | [firecrawl.dev](https://www.firecrawl.dev) |

Cek Node.js sudah terpasang dengan:

```bash
node --version
```

Kalau muncul versi seperti `v20.x.x` atau lebih baru, sudah aman.

### 1.2 Download project ini

```bash
git clone https://github.com/diditbudiraharjo/didit.budiraharjo.git
cd didit.budiraharjo
```

### 1.3 Install semua dependency

Repo ini adalah **monorepo** (berisi beberapa package sekaligus). Cukup satu
perintah di folder root untuk install semuanya:

```bash
npm install
```

Proses ini akan mengunduh semua library yang dibutuhkan (Playwright, Next.js,
Tailwind, Framer Motion, dst). Tunggu sampai selesai (biasanya 1-3 menit).

### 1.4 Build semua tool

```bash
npm run build --workspace=packages/ai-cloner
```

Perintah ini mengompilasi TypeScript jadi JavaScript yang bisa dijalankan.

### 1.5 (Opsional, disarankan) Pasang command secara global

Supaya bisa mengetik `clone-site` dan `ai-generate` langsung dari mana saja,
tanpa perlu masuk folder project dulu:

```bash
npm install -g ./packages/ai-cloner
```

Setelah ini, coba jalankan:

```bash
clone-site
```

Kalau muncul pesan `Usage: clone-site <url>`, artinya instalasi berhasil.

> Tidak mau install global? Semua contoh perintah `clone-site ...` dan
> `ai-generate ...` di bawah bisa diganti dengan
> `node packages/ai-cloner/dist/cloneSite.js ...` dan
> `node packages/ai-cloner/dist/generator/cli.js ...`.

### 1.6 Siapkan API key Firecrawl

Tool clone website ini butuh [Firecrawl](https://www.firecrawl.dev) untuk
menemukan semua halaman di sebuah website. Daftar gratis di firecrawl.dev,
lalu ambil API key dari dashboard mereka (formatnya `fc-xxxxxxxxxxxx`).

Set API key sebagai environment variable. Cara paling gampang untuk pemula —
buat file `.env` khusus untuk ini:

```bash
cp packages/ai-cloner/.env.example packages/ai-cloner/.env
```

Buka file `packages/ai-cloner/.env` dengan text editor, lalu isi:

```
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Karena tool ini dijalankan langsung dari terminal (bukan lewat framework yang
otomatis baca file `.env`), cara paling aman adalah export manual sebelum
menjalankan perintah:

```bash
export FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

(Di Windows PowerShell: `$env:FIRECRAWL_API_KEY="fc-xxxx..."`)

Tips: tambahkan baris `export FIRECRAWL_API_KEY=...` itu ke file
`~/.bashrc` atau `~/.zshrc` supaya tidak perlu diketik ulang setiap buka
terminal baru.

> ⚠️ **Jangan pernah membagikan API key ini ke orang lain atau menempelkannya
> di chat/commit ke Git.** Kalau terlanjur ter-share, segera generate key baru
> di dashboard Firecrawl.

Instalasi selesai! Lanjut ke bagian clone website.

---

## 2. Cara Update

Kalau ada perubahan baru di repo ini (fitur baru, perbaikan bug), begini cara
memperbarui project di komputer kamu:

```bash
git pull origin claude/website-cloner-x0iyl2
npm install
npm run build --workspace=packages/ai-cloner
```

Kalau kamu sudah install global (langkah 1.5), pasang ulang supaya command
`clone-site`/`ai-generate` ikut ter-update:

```bash
npm install -g ./packages/ai-cloner
```

Itu saja — tidak perlu `git clone` ulang dari awal.

---

## 3. Cara Clone Website

Ini langkah utama: mengubah website target jadi project Next.js.

```bash
clone-site https://website-target.com
```

Tidak ada pertanyaan tambahan yang akan muncul — semuanya otomatis. Kamu akan
melihat progress seperti ini:

```
clone-site  →  https://website-target.com

✔ Crawl Website
✔ Download Asset
✔ Screenshot
✔ Analyze Layout
✔ Analyze Animation
✔ Generate Prompt
✔ Generate NextJS
✔ Generate Tailwind
✔ Generate Framer Motion
✔ Build Project

Done. 5 page(s), 12 section(s).
  Output:  output/website-target.com
  Next.js: cd output/website-target.com/next-app && npm run dev
```

Proses ini bisa memakan waktu beberapa menit tergantung jumlah halaman di
website target — tool ini benar-benar membuka setiap halaman di browser,
mengunduh semua gambar/CSS/font, lalu menganalisis dan membangun ulang
tampilannya.

### Apa saja yang dihasilkan?

Semua tersimpan di folder `output/<nama-domain>/`:

```
output/website-target.com/
├── pages/                     ← hasil analisis tiap halaman
│   └── home/
│       ├── page.html          (HTML asli yang sudah dibersihkan)
│       ├── page.md             (versi Markdown)
│       ├── dom.json            (struktur DOM)
│       ├── screenshots/        (screenshot tiap section)
│       └── sections/
│           └── section-1/
│               └── analysis/   ← inti dari "AI Analyzer"
│                   ├── layout.json
│                   ├── colors.json
│                   ├── typography.json
│                   ├── animation.json
│                   ├── spacing.json
│                   ├── component.json
│                   └── prompt.json
├── assets/                    ← gambar, CSS, font, svg, icon asli (terkategori)
├── next-app/                  ← project Next.js siap pakai (sudah di-build!)
└── manifest.json
```

`next-app/` di sini adalah clone **langsung** dari markup asli website
(disebut "hasil clone") — tampilannya semirip mungkin dengan aslinya.

---

## 4. Cara Generate Ulang

Kadang kamu tidak mau clone yang identik dengan sumbernya, tapi mau versi
**baru yang dibangun ulang dari nol** berdasarkan analisis desainnya saja
(warna, tipografi, spacing, layout, animasi) — tanpa memakai HTML/teks asli
sama sekali. Untuk ini pakai `ai-generate`.

Keuntungannya: **tidak perlu crawl ulang websitenya** (hemat kuota Firecrawl),
karena `ai-generate` hanya membaca folder `analysis/` yang sudah dihasilkan
langkah sebelumnya.

```bash
ai-generate output/website-target.com output-baru
```

- Argumen pertama = folder yang berisi `analysis/` (bisa folder hasil
  `clone-site` di atas, tool ini otomatis mencari semua folder `analysis/`
  di dalamnya).
- Argumen kedua = folder tujuan hasil generate (bebas nama apa saja).

Kalau dijalankan tanpa argumen sama sekali:

```bash
ai-generate
```

...tool ini akan otomatis membaca dari folder `./analysis` dan menyimpan
hasilnya ke folder `./output` (relatif ke folder tempat kamu menjalankan
perintah).

Hasilnya juga project Next.js + Tailwind + Framer Motion lengkap, tapi:

- Semua teks (judul, label menu, tombol, dll) adalah **teks baru**, bukan
  hasil salin dari website asli.
- Warna, font, spacing tetap mengikuti hasil analisis desain asli.
- Ada mode gelap (dark mode) otomatis, layout responsif, dan komponen
  reusable (`Button`, `Card`, `Container`, dst) yang rapi untuk dikembangkan.

Ulangi perintah `ai-generate` kapan saja untuk mencoba hasil yang berbeda,
tanpa perlu clone ulang.

---

## 5. Cara Export

"Export" di sini artinya mengambil folder project Next.js yang sudah jadi
(`next-app/` dari `clone-site`, atau folder output dari `ai-generate`) untuk
dipindahkan, dibagikan, atau di-upload ke tempat lain.

### Opsi A — Kompres jadi file .zip (paling gampang)

```bash
cd output/website-target.com
zip -r hasil-clone.zip next-app
```

File `hasil-clone.zip` bisa dikirim lewat email, Google Drive, dsb. Orang
yang menerima tinggal extract, lalu ikuti langkah [Cara Build](#6-cara-build).

(Di Windows tanpa `zip`: klik kanan folder `next-app` → **Send to** →
**Compressed (zipped) folder**.)

### Opsi B — Push ke repo GitHub baru

Ini opsi terbaik kalau kamu mau lanjut ke [deploy ke Vercel](#7-cara-deploy-ke-vercel),
karena Vercel paling gampang dipakai lewat GitHub.

```bash
cd output/website-target.com/next-app
git init
git add .
git commit -m "Initial export dari AI Website Cloner"
```

Lalu buat repository kosong baru di [github.com/new](https://github.com/new)
(jangan centang "Add README"), dan jalankan perintah yang GitHub tampilkan,
mirip seperti ini:

```bash
git remote add origin https://github.com/<username-kamu>/<nama-repo>.git
git branch -M main
git push -u origin main
```

---

## 6. Cara Build

"Build" artinya mengubah source code jadi versi production yang siap
dijalankan/di-deploy. Kalau kamu pakai `clone-site`, build **sudah otomatis
dilakukan** di langkah terakhir ("✔ Build Project"). Tapi kalau kamu pakai
`ai-generate`, atau ingin build ulang secara manual:

```bash
cd output/website-target.com/next-app     # atau folder hasil ai-generate
npm install
npm run build
```

Kalau berhasil, akan muncul ringkasan seperti ini:

```
Route (app)                     Size  First Load JS
┌ ○ /                          1.5 kB         143 kB
├ ○ /about                     1.5 kB         143 kB
└ ○ /sitemap.xml                127 B         102 kB

✓ Compiled successfully
```

Untuk melihat hasilnya di browser lokal sebelum deploy:

```bash
npm run start
```

lalu buka [http://localhost:3000](http://localhost:3000).

Kalau mau mode development (auto-reload saat edit file):

```bash
npm run dev
```

---

## 7. Cara Deploy ke Vercel

[Vercel](https://vercel.com) adalah platform hosting paling umum dipakai
untuk project Next.js — gratis untuk pemakaian personal, dan setup-nya
singkat.

### Opsi A — Pakai Vercel CLI (tanpa GitHub, paling cepat)

1. Install Vercel CLI:

   ```bash
   npm install -g vercel
   ```

2. Masuk ke folder project Next.js hasil clone:

   ```bash
   cd output/website-target.com/next-app
   ```

3. Jalankan:

   ```bash
   vercel
   ```

4. Ikuti pertanyaan yang muncul di terminal:
   - **Login/Sign up** (bisa pakai akun GitHub/Google/email)
   - **Set up and deploy?** → ketik `y`
   - **Which scope?** → pilih akun kamu
   - **Link to existing project?** → ketik `n` (kecuali sudah pernah deploy sebelumnya)
   - **Project name?** → tekan Enter untuk pakai nama default, atau ketik nama sendiri
   - **Directory?** → tekan Enter (pakai folder saat ini)
   - Vercel otomatis mendeteksi ini project Next.js — tekan Enter untuk semua pertanyaan konfigurasi berikutnya

5. Tunggu proses build & deploy selesai. Vercel akan menampilkan link seperti
   `https://nama-project.vercel.app` — situs kamu sudah online!

6. Untuk deploy versi **production** (bukan preview) setelah yakin semuanya
   oke:

   ```bash
   vercel --prod
   ```

### Opsi B — Lewat GitHub + Dashboard Vercel (lebih visual)

1. Ikuti [Cara Export Opsi B](#5-cara-export) di atas untuk push project ke
   GitHub terlebih dahulu.
2. Buka [vercel.com/new](https://vercel.com/new) dan login (bisa pakai akun
   GitHub).
3. Klik **Import** di samping nama repo yang baru kamu push.
4. Vercel otomatis mendeteksi framework Next.js — biarkan pengaturan default,
   klik **Deploy**.
5. Tunggu 1-2 menit, situs kamu online di URL `https://nama-repo.vercel.app`.
6. Setiap kali kamu `git push` ke repo itu lagi, Vercel otomatis build &
   deploy ulang.

### (Opsional) Set environment variable SITE_URL

Kalau hasil generate memakai `ai-generate`, ada file `app/sitemap.ts` dan
`app/robots.ts` yang memakai environment variable `SITE_URL` untuk menyusun
sitemap yang benar. Setelah deploy, buka **Project Settings → Environment
Variables** di dashboard Vercel dan tambahkan:

```
SITE_URL = https://nama-project.vercel.app
```

Lalu redeploy (klik **Redeploy** di tab Deployments) supaya perubahan
terpakai.

---

## 8. Troubleshooting

**`FIRECRAWL_API_KEY is not set`**
API key belum di-export di terminal yang sedang kamu pakai. Ulangi langkah
[1.6](#16-siapkan-api-key-firecrawl), pastikan dijalankan di terminal yang
sama sebelum menjalankan `clone-site`.

**`command not found: clone-site`**
Instalasi global (langkah 1.5) belum dijalankan, atau gagal. Coba jalankan
langsung dengan `node packages/ai-cloner/dist/cloneSite.js <url>` sebagai
alternatif.

**Proses `clone-site` gagal di langkah "Crawl Website"**
Biasanya berarti Firecrawl tidak bisa mengakses website target (situs
memblokir bot, butuh login, dsb), atau API key salah/habis kuota. Cek pesan
error yang tampil — biasanya menjelaskan penyebabnya.

**`npm run build` gagal / port sudah dipakai saat `npm run start`**
Jalankan `npm run start -- -p 3001` untuk pakai port lain, atau matikan
proses lain yang memakai port 3000.

**Hasil clone tidak mirip 100% dengan aslinya**
Wajar — tool ini merekonstruksi ulang halaman, bukan menyalin file server
aslinya. Elemen yang sangat interaktif (video player custom, widget pihak
ketiga, dsb) mungkin tidak tertangkap sempurna.

---

## 9. Isi Repo Ini

Repo ini berisi beberapa tool terkait, dari yang paling sederhana sampai
paling lengkap:

- **`packages/core`** — engine dasar untuk scrape + crawl satu/banyak
  halaman jadi project Vite + React (`packages/cli`: `website-cloner clone
  <url>` / `website-cloner crawl <url>`).
- **`packages/server`** + **`packages/web`** — versi web app (paste URL di
  browser, lihat live preview, download hasilnya) dari tool yang sama.
- **`packages/ai-cloner`** — tool utama yang dibahas di panduan ini:
  - `clone-site <url>` — clone lengkap (crawl → download asset →
    screenshot → analisis desain → generate Next.js/Tailwind/Framer Motion
    → build), lihat [bagian 3](#3-cara-clone-website).
  - `ai-generate [analysisDir] [outputDir]` — generate ulang dari hasil
    analisis saja, tanpa markup asli, lihat [bagian 4](#4-cara-generate-ulang).
  - `ai-cloner clone <url> -o <dir>` — versi manual/dapat dikonfigurasi dari
    `clone-site`.
- **`packages/next-app`** — starter Next.js + Tailwind + Framer Motion
  kosong (tanpa logic cloning), untuk mulai project dari nol.
