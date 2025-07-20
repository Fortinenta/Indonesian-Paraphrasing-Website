
# 📘 Praphrase

**Praphrase** adalah aplikasi web untuk mempermudah pengguna dalam melakukan _paraphrasing_ atau penyederhanaan dokumen berbahasa Inggris, baik dalam bentuk PDF, Word (DOCX), maupun teks biasa.

Aplikasi ini dibangun menggunakan **React + Vite** dan didukung oleh library-library tambahan untuk mengelola dokumen, menampilkan animasi, dan menyediakan fitur pengunduhan hasil.

---

## ✨ Fitur Utama

### 📝 1. Upload dan Tampilkan Dokumen
- Mendukung format: **PDF**, **DOCX**, dan **Teks**.
- Preview isi dokumen secara langsung di layar sebelum diproses.

### 🤖 2. Penyederhanaan (Paraphrasing)
- Paraphrase dilakukan dengan menggunakan LLM (Large Language Model).
- Tersedia dalam berbagai mode:
  - **Simplify**: Menyederhanakan kalimat agar lebih mudah dipahami.
  - **Formalize**: Membuat kalimat lebih profesional.
  - **Paraphrase**: Membuat variasi dari kalimat tanpa mengubah arti.

### 📤 3. Ekspor Hasil
- Hasil _paraphrased_ dapat diunduh sebagai **PDF** atau disalin langsung ke clipboard.

### ⚙️ 4. Fitur Tambahan
- Drag & Drop untuk upload dokumen.
- Kompatibel dengan perangkat mobile dan desktop.
- Dukungan animasi (Framer Motion) dan notifikasi (React Hot Toast).
- Highlight perubahan kata/frasa menggunakan library `diff`.

---

## 🧪 Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **File Handling**: `pdfjs-dist`, `mammoth`, `file-saver`, `jspdf`
- **UX**: `framer-motion`, `@headlessui/react`, `lucide-react`
- **State Management**: React Context API
- **Networking**: Axios

---

## 🏁 Cara Menjalankan

```bash
# Clone repositori
git clone https://github.com/username/praphrase.git
cd praphrase

# Install dependencies
npm install

# Jalankan dalam mode development
npm run dev
```

Aplikasi akan tersedia di: `http://localhost:5173`

---

## 📂 Struktur Folder

```
src/
├── assets/            # Gambar/icon
├── components/        # Komponen UI
├── context/           # React Context (state global)
├── pages/             # Halaman utama (Home, Result, dll)
├── utils/             # Fungsi bantu, pengolahan file
├── hooks/             # Custom React Hooks
├── App.jsx            # Root component
└── main.jsx           # Entry point React
```

---

## 🧩 Catatan Tambahan

- Tailwind CSS v4 digunakan — dengan konfigurasi khusus PostCSS (`@tailwindcss/postcss`).
- Gunakan Node.js versi LTS agar menghindari error dari vite/postcss.
- Komponen-komponen dibuat modular dan reusable.
- Error handling dan loading sudah diterapkan dengan baik di beberapa tempat (toast, animasi loading).

---

## 📜 Lisensi

MIT License.
