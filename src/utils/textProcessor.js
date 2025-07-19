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
