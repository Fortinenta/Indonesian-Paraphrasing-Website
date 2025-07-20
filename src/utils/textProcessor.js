const commonIndonesianWords = [
    'yang', 'di', 'dari', 'adalah', 'dengan', 'untuk', 'dan', 'atau', 'namun', 'tetapi',
    'jika', 'maka', 'sehingga', 'karena', 'bahwa', 'ini', 'itu', 'tersebut', 'pada', 'dalam',
    'ke', 'oleh', 'akan', 'telah', 'sudah', 'belum', 'bisa', 'dapat', 'harus', 'perlu',
    'tidak', 'bukan', 'sangat', 'lebih', 'kurang', 'paling', 'juga', 'pun', 'saja', 'hanya',
    'seperti', 'sebagai', 'yaitu', 'yakni', 'antara', 'melalui', 'menurut', 'demi', 'bagi',
    'sejak', 'hingga', 'sampai', 'kecuali', 'selain', 'tanpa', 'bersama', 'serta', 'sambil',
    'meskipun', 'walaupun', 'andaikan', 'seandainya', 'agar', 'supaya', 'meski', 'biarpun',
    'seolah-olah', 'seakan-akan', 'daripada', 'daripada', 'kepada', 'terhadap', 'melainkan',
    'bahkan', 'lagi', 'pula', 'justru', 'malah', 'memang', 'tentu', 'pasti', 'mungkin', 'barangkali',
    'agaknya', 'rasanya', 'sepertinya', 'bisa jadi', 'kemungkinan besar', 'kalau boleh saya katakan',
    'sepengetahuan saya', 'menurut hemat saya', 'emmm', 'ehh', 'anu', 'gimana ya', 'maksudnya',
    'jadi gini', 'gitu lho', 'begini nih', 'nah itu dia', 'makanya tuh', 'itu sebabnya',
    'jadi ceritanya', 'kok', 'lho', 'dong', 'sih', 'kan', 'ya kan', 'gitu kan', 'begitu kan',
    'deh', 'aja', 'kali', 'banget', 'gue', 'lo', 'nih', 'toh', 'je', 'lha kok', 'toh ya',
    'ya toh', 'gimana sih', 'masa sih', 'udah deh', 'kan ya', 'gitu lho', 'hmm', 'well',
    'maksud saya', 'eh wait', 'atau lebih tepatnya', 'koreksi dikit', 'bukan gitu'
];

export const analyzeAndTagWords = (text) => {
    const words = text.split(/(\s+)/); // Split by whitespace, keeping the whitespace
    return words.map(word => {
        const cleanedWord = word.toLowerCase().replace(/[^a-z0-9]/g, ''); // Remove punctuation for comparison
        if (commonIndonesianWords.includes(cleanedWord)) {
            return `[KATA_UMUM]${word}[/KATA_UMUM]`;
        }
        return `[KATA_KUNCI]${word}[/KATA_KUNCI]`;
    }).join('');
};

export const removeTags = (text) => {
    return text.replace(/\[KATA_KUNCI\]|\[\/KATA_KUNCI\]|\[KATA_UMUM\]|\[\/KATA_UMUM\]/g, '');
};

const informalPhrasesToAvoid = [
    "menurut saya", "saya rasa", "kayaknya", "mungkin", "gitu", "lho", "deh", "sih",
    "dong", "gue", "lo", "nih", "ya kan", "kan ya", "kok bisa", "masa sih", 
    "kita semua tahu", "tentu saja", "semua orang tahu",
    "saya", "kami", "kita", "anda" // Pronouns to avoid in academic style
];

export const filterInformalPhrases = (text) => {
    let filteredText = text;
    for (const phrase of informalPhrasesToAvoid) {
        // Use a regex with word boundaries to avoid partial matches
        const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
        // Replace with an empty string or a more formal equivalent if applicable
        // For now, simple removal or replacement with a space to avoid merging words
        if (["kayaknya", "gitu", "lho", "deh", "sih", "dong", "nih", "kok bisa", "masa sih"].includes(phrase)) {
            filteredText = filteredText.replace(regex, ''); // Remove filler words
        } else if (["menurut saya", "saya rasa"].includes(phrase)) {
            filteredText = filteredText.replace(regex, 'berdasarkan analisis'); // Replace with a formal phrase
        } else if (["mungkin"].includes(phrase)) {
            filteredText = filteredText.replace(regex, 'kemungkinan besar');
        } else if (["kita semua tahu", "tentu saja", "semua orang tahu"].includes(phrase)) {
            filteredText = filteredText.replace(regex, 'dapat dipahami bahwa');
        } else if (["saya", "kami", "kita", "anda"].includes(phrase)) {
            filteredText = filteredText.replace(regex, 'penulis'); // Replace pronouns with 'penulis' or similar
        } else {
            filteredText = filteredText.replace(regex, ''); // Default to removal
        }
    }
    // Clean up extra spaces left by removals
    filteredText = filteredText.replace(/\s\s+/g, ' ').trim();
    return filteredText;
};

/**
 * Calculates the Flesch-Kincaid Readability Ease score for Indonesian text.
 * This is a simplified adaptation as Flesch-Kincaid is primarily for English.
 * A more accurate score for Indonesian would require a specific algorithm for the language.
 * 
 * Formula (adapted): 206.835 - (1.015 * ASL) - (84.6 * ASW)
 * ASL = Average Sentence Length (total words / total sentences)
 * ASW = Average Syllables per Word (total syllables / total words)
 * 
 * For simplicity, syllable counting is approximated.
 * 
 * @param {string} text The input text.
 * @returns {number} The Flesch-Kincaid Readability Ease score.
 */
export const calculateReadingLevel = (text) => {
  if (!text) return 0;

  const sentences = text.split(/[.!?]+\s*/).filter(s => s.trim() !== '');
  const words = text.split(/\s+/).filter(w => w.trim() !== '');

  const totalSentences = sentences.length;
  const totalWords = words.length;

  if (totalWords === 0) return 0;

  // Simple syllable approximation for Indonesian
  // This is a very rough estimate and not linguistically accurate.
  const countSyllables = (word) => {
    word = word.toLowerCase();
    let syllableCount = 0;
    const vowels = 'aeiou';
    let lastCharWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (vowels.includes(char)) {
        if (!lastCharWasVowel) {
          syllableCount++;
        }
        lastCharWasVowel = true;
      } else {
        lastCharWasVowel = false;
      }
    }
    // Ensure at least one syllable for any word
    return Math.max(1, syllableCount);
  };

  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += countSyllables(word);
  }

  const ASL = totalWords / totalSentences;
  const ASW = totalSyllables / totalWords;

  // Flesch-Kincaid Readability Ease formula (adapted for general use)
  const score = 206.835 - (1.015 * ASL) - (84.6 * ASW);

  return Math.max(0, score);
};

/**
 * Analyzes the reading level and returns a descriptive string.
 * @param {number} score The Flesch-Kincaid Readability Ease score.
 * @returns {string} A descriptive reading level.
 */
export const getReadingLevelDescription = (score) => {
  if (score >= 90) return 'Sangat Mudah';
  if (score >= 80) return 'Mudah';
  if (score >= 70) return 'Cukup Mudah';
  if (score >= 60) return 'Sedang';
  if (score >= 50) return 'Agak Sulit';
  if (score >= 30) return 'Sulit';
  return 'Sangat Sulit';
};

export const processText = (text) => {
    // This function will now be the entry point for the entire pipeline
    // For now, it will just call analyzeAndTagWords
    return analyzeAndTagWords(text);
};

