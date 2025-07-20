# PROMPT PARAFRASE DENGAN ALUR TEKNIS LENGKAP

## 1. PROMPT UTAMA UNTUK API/MODEL

```
SISTEM PARAFRASE BERKUALITAS TINGGI

PERINTAH UTAMA:
Lakukan parafrase teks berikut dengan mengikuti SELURUH protokol di bawah ini tanpa terkecuali.

PROTOKOL WAJIB:

A. ANALISIS AWAL (TAHAP 1):
   1. Identifikasi jenis teks (akademik/populer/teknis/bisnis)
   2. Tentukan kompleksitas bahasa (sederhana/menengah/kompleks)
   3. Mapping ide pokok dan ide pendukung
   4. Identifikasi terminologi kunci yang tidak boleh diubah

B. KAIDAH KEBAHASAAN (TAHAP 2):
   1. EYD: Terapkan ejaan yang disempurnakan 100% akurat
   2. TATA BAHASA: Struktur SPOK yang jelas, konjungsi tepat
   3. DIKSI: Sinonim tepat konteks, hindari redundansi
   4. KOHESI: Transisi mulus antar kalimat, alur logis

C. TRANSFORMASI STRUKTUR (TAHAP 3):
   1. Ubah pola kalimat (aktif↔pasif, kompleks↔sederhana)
   2. Reposisi klausa dan frasa
   3. Variasi panjang kalimat
   4. Pergantian kata penghubung yang sesuai

D. KONTROL KUALITAS (TAHAP 4):
   1. Verifikasi makna tetap 100% sama
   2. Cek tidak ada informasi hilang/bertambah
   3. Pastikan tidak ada kesalahan ejaan/tata bahasa
   4. Validasi kesesuaian register bahasa

E. OUTPUT FINAL:
   - Berikan HANYA hasil parafrase tanpa penjelasan
   - Tidak ada komentar atau catatan tambahan
   - Langsung teks yang siap pakai
   - Panjang relatif sama (±10% dari asli)

TEKS INPUT: {MASUKKAN_TEKS_DISINI}

EKSEKUSI: Lakukan parafrase sekarang dengan mengikuti protokol di atas.
```

## 2. SUMBER REFERENSI PARAFRASE

### A. Kamus dan Referensi Bahasa:
1. **KBBI (Kamus Besar Bahasa Indonesia) Online**
   - URL: https://kbbi.kemdikbud.go.id/
   - Fungsi: Validasi kata baku dan sinonim
   - Akses: Gratis, tidak perlu API key

2. **Tesaurus Bahasa Indonesia**
   - URL: https://tesaurus.kemdikbud.go.id/
   - Fungsi: Mencari sinonim dan antonim
   - Akses: Gratis, tidak perlu registrasi

3. **Kateglo (Kamus, Tesaurus, Glosarium)**
   - URL: https://kateglo.com/
   - Fungsi: Kamus lengkap dengan etimologi
   - API: Tersedia REST API gratis

### B. Pedoman Penulisan:
1. **Pedoman Umum EYD V**
   - Sumber: Badan Pengembangan Bahasa
   - Fungsi: Acuan ejaan dan tata bahasa
   - Download: PDF gratis di situs resmi

2. **Panduan Penulisan Karya Ilmiah**
   - Sumber: LIPI, Kemendikbud
   - Fungsi: Standar penulisan akademik
   - Akses: Dokumen publik

### C. Tools Pendukung:
1. **LanguageTool API (Limited Free)**
   - URL: https://languagetool.org/
   - Fungsi: Grammar checker untuk Indonesia
   - Limit: 20 cek per hari gratis

2. **TextBlob (Python Library)**
   - Repository: https://github.com/sloria/TextBlob
   - Fungsi: NLP untuk analisis teks
   - Lisensi: Open source

## 3. OPEN APIs TANPA API KEY

### A. Text Processing APIs:

1. **Hugging Face Inference API (Rate Limited)**
   ```
   URL: https://api-inference.huggingface.co/
   Model: facebook/bart-large-cnn
   Method: POST
   Headers: {
     "Content-Type": "application/json"
   }
   Body: {
     "inputs": "Your text here",
     "parameters": {"max_length": 150}
   }
   Limit: 1000 requests/month gratis
   ```

2. **JSONBin.io (untuk menyimpan template)**
   ```
   URL: https://jsonbin.io/
   Fungsi: Menyimpan template parafrase
   Limit: 10MB storage gratis
   Fitur: REST API tanpa auth untuk read
   ```

3. **Lorem Picsum Text API**
   ```
   URL: https://loripsum.net/api
   Fungsi: Generate teks sample untuk testing
   Parameter: /medium/plaintext
   Akses: Unlimited gratis
   ```

### B. Language Processing:

1. **DeepL API Free Tier**
   ```
   URL: https://api-free.deepl.com/v2/translate
   Limit: 500,000 karakter/bulan
   Registrasi: Perlu email (tapi gratis)
   Header: DeepL-Auth-Key: YOUR-FREE-KEY
   ```

2. **Microsoft Translator (Guest Access)**
   ```
   URL: https://api.cognitive.microsofttranslator.com/
   Limit: 2M karakter/bulan
   Akses: Cognitive Services free tier
   ```

## 4. ALUR TEKNIS IMPLEMENTASI

### FASE 1: PREPROCESSING (5-10 detik)

```javascript
// 1. Sanitasi Input
function sanitizeInput(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')  // Multiple spaces jadi single
    .replace(/[^\w\s.,!?;:-]/g, '') // Remove special chars
    .split(/[.!?]+/)  // Split ke kalimat
    .filter(sentence => sentence.length > 3);
}

// 2. Analisis Struktur
function analyzeStructure(sentences) {
  return sentences.map(sentence => ({
    original: sentence,
    words: sentence.split(' ').length,
    complexity: calculateComplexity(sentence),
    type: detectSentenceType(sentence)
  }));
}
```

### FASE 2: CORE PROCESSING (15-30 detik)

```javascript
// 3. Template Parafrase
const parafraseTemplates = {
  simple: {
    'menunjukkan bahwa': ['mengindikasikan bahwa', 'memperlihatkan bahwa', 'mengungkapkan bahwa'],
    'penelitian ini': ['studi ini', 'riset tersebut', 'kajian ini'],
    'dapat': ['mampu', 'bisa', 'sanggup']
  },
  academic: {
    'implementasi': ['penerapan', 'pelaksanaan', 'aplikasi'],
    'optimalisasi': ['pengoptimalan', 'maksimalisasi', 'peningkatan optimal']
  }
};

// 4. Proses Parafrase
async function processParafrase(analyzedText, templates) {
  let result = [];
  
  for (let sentence of analyzedText) {
    // Transform struktur kalimat
    let transformed = await transformStructure(sentence);
    
    // Replace dengan sinonim
    let paraphrased = replaceSynonyms(transformed, templates);
    
    // Validasi grammar
    let validated = await validateGrammar(paraphrased);
    
    result.push(validated);
  }
  
  return result.join('. ') + '.';
}
```

### FASE 3: POST-PROCESSING (3-5 detik)

```javascript
// 5. Quality Control
function qualityControl(original, paraphrased) {
  const checks = {
    lengthSimilarity: checkLengthSimilarity(original, paraphrased),
    meaningPreservation: checkMeaning(original, paraphrased),
    grammarCorrectness: checkGrammar(paraphrased),
    uniqueness: checkUniqueness(original, paraphrased)
  };
  
  return {
    score: calculateQualityScore(checks),
    passed: Object.values(checks).every(check => check.passed),
    issues: Object.entries(checks)
      .filter(([key, check]) => !check.passed)
      .map(([key, check]) => check.issue)
  };
}

// 6. Final Output
function finalizeOutput(paraphrased, qualityCheck) {
  if (!qualityCheck.passed) {
    throw new Error(`Kualitas tidak memenuhi standar: ${qualityCheck.issues.join(', ')}`);
  }
  
  return {
    result: paraphrased,
    metadata: {
      originalLength: original.length,
      paraphrasedLength: paraphrased.length,
      qualityScore: qualityCheck.score,
      processingTime: Date.now() - startTime
    }
  };
}
```

## 5. IMPLEMENTASI REACT COMPONENT

```javascript
// Hook untuk parafrase
const useParafrase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const parafrase = async (text, options = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fase 1: Preprocessing
      const sanitized = sanitizeInput(text);
      const analyzed = analyzeStructure(sanitized);
      
      // Fase 2: Core Processing
      const result = await processParafrase(analyzed, options.templates);
      
      // Fase 3: Quality Control
      const quality = qualityControl(text, result);
      
      return finalizeOutput(result, quality);
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { parafrase, isLoading, error };
};
```

## 6. ERROR HANDLING & VALIDATION

```javascript
// Validasi Input
const validateInput = (text) => {
  const errors = [];
  
  if (!text || text.trim().length === 0) {
    errors.push('Teks tidak boleh kosong');
  }
  
  if (text.length < 10) {
    errors.push('Teks terlalu pendek (minimum 10 karakter)');
  }
  
  if (text.length > 10000) {
    errors.push('Teks terlalu panjang (maksimum 10.000 karakter)');
  }
  
  if (!/[.!?]/.test(text)) {
    errors.push('Teks harus mengandung minimal satu kalimat lengkap');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Retry Logic
const withRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 7. PERFORMANCE OPTIMIZATION

```javascript
// Caching untuk hasil parafrase
const parafraseCache = new Map();

const getCachedParafrase = (text) => {
  const hash = btoa(text).slice(0, 16); // Simple hash
  return parafraseCache.get(hash);
};

const setCachedParafrase = (text, result) => {
  const hash = btoa(text).slice(0, 16);
  parafraseCache.set(hash, result);
  
  // Limit cache size
  if (parafraseCache.size > 100) {
    const firstKey = parafraseCache.keys().next().value;
    parafraseCache.delete(firstKey);
  }
};
```

## 8. TESTING FRAMEWORK

```javascript
// Unit Test untuk kualitas parafrase
const testParafraseQuality = (original, paraphrased) => {
  const tests = [
    {
      name: 'Meaning Preservation',
      test: () => checkMeaning(original, paraphrased),
      weight: 0.4
    },
    {
      name: 'Grammar Correctness',
      test: () => checkGrammar(paraphrased),
      weight: 0.3
    },
    {
      name: 'Uniqueness',
      test: () => checkUniqueness(original, paraphrased),
      weight: 0.2
    },
    {
      name: 'Length Appropriateness',
      test: () => checkLengthSimilarity(original, paraphrased),
      weight: 0.1
    }
  ];
  
  const results = tests.map(test => ({
    ...test,
    passed: test.test(),
    score: test.test() ? 100 : 0
  }));
  
  const totalScore = results.reduce((sum, result) => 
    sum + (result.score * result.weight), 0
  );
  
  return {
    totalScore,
    details: results,
    passed: totalScore >= 70 // Minimum 70% untuk pass
  };
};
```

Alur teknis ini memberikan kontrol penuh atas kualitas parafrase dengan validasi berlapis dan optimisasi performa.