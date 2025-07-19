import { getKBBISynonyms, fetchWikipediaContext, getGoogleTranslateHelp } from './apiService';

/**
 * A paraphrasing engine that uses synonym replacement, basic sentence restructuring, and style variation.
 * @param {string} text The input text.
 * @param {string} level The paraphrasing level ('low', 'medium', 'high').
 * @param {string} mode The paraphrasing mode ('academic', 'casual', 'business', 'creative').
 * @param {object} externalData External data like Wikipedia context, KBBI synonyms, Google Translate help.
 * @returns {Promise<string>} The paraphrased text.
 */
export const paraphraseEngine = {
  process: async (text, level, mode, externalData) => {
    const sentences = text.split(/\.\s*|\!\s*|\?\s*/).filter(s => s.trim() !== '');
    const paraphrasedSentences = [];

    const replacementProbability = {
      low: 0.3,
      medium: 0.6,
      high: 0.9,
    }[level];

    for (const sentence of sentences) {
      let currentSentence = sentence.trim();

      // 1. Synonym Replacement (Contextual)
      const words = currentSentence.split(/(\s+|[.,!?;:])/);
      const newWords = [];
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (word.trim() === '' || /[.,!?;:]/.test(word)) {
          newWords.push(word);
          continue;
        }

        if (Math.random() < replacementProbability) {
          const cleanedWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
          const synonyms = await getKBBISynonyms(cleanedWord);
          if (synonyms.length > 0) {
            const randomSynonym = synonyms[Math.floor(Math.random() * synonyms.length)];
            newWords.push(preserveCapitalization(word, randomSynonym));
          } else {
            newWords.push(word);
          }
        } else {
          newWords.push(word);
        }
      }
      currentSentence = newWords.join('');

      // 2. Basic Sentence Restructuring (Simulated)
      // This is a very basic simulation. A real implementation would involve NLP parsing.
      if (level === 'high' || level === 'medium') {
        currentSentence = simulateSentenceRestructuring(currentSentence);
      }

      // 3. Style Variation (Simulated)
      currentSentence = applyStyleVariation(currentSentence, mode);

      paraphrasedSentences.push(currentSentence);
    }

    return paraphrasedSentences.join('. ') + (text.match(/\.\s*|\!\s*|\?\s*$/) ? text.match(/\.\s*|\!\s*|\?\s*$/)[0] : '');
  },
};

/**
 * Simulates basic sentence restructuring.
 * For a real application, this would involve dependency parsing and rephrasing.
 * @param {string} sentence
 * @returns {string}
 */
function simulateSentenceRestructuring(sentence) {
  // Example: Simple reordering of clauses or adding transition words
  if (sentence.includes('karena') && Math.random() < 0.5) {
    return sentence.replace('karena', 'disebabkan oleh');
  }
  if (sentence.includes('dan') && Math.random() < 0.5) {
    return sentence.replace('dan', 'serta');
  }
  return sentence;
}

/**
 * Applies style variation based on the selected mode.
 * @param {string} sentence
 * @param {string} mode
 * @returns {string}
 */
function applyStyleVariation(sentence, mode) {
  let modifiedSentence = sentence;
  switch (mode) {
    case 'casual':
      modifiedSentence = modifiedSentence.replace(/yang/g, 'yg');
      modifiedSentence = modifiedSentence.replace(/adalah/g, 'itu');
      break;
    case 'academic':
      modifiedSentence = modifiedSentence.replace(/yg/g, 'yang');
      modifiedSentence = modifiedSentence.replace(/itu/g, 'adalah');
      // Add more academic specific transformations
      break;
    case 'business':
      // Business specific transformations
      break;
    case 'creative':
      // Creative specific transformations
      break;
    default:
      break;
  }
  return modifiedSentence;
}

/**
 * Preserves the capitalization of the original word on the new word.
 * @param {string} originalWord 
 * @param {string} newWord 
 * @returns {string}
 */
function preserveCapitalization(originalWord, newWord) {
  const isUpperCase = originalWord === originalWord.toUpperCase();
  const isTitleCase = originalWord[0] === originalWord[0].toUpperCase();

  if (isUpperCase) {
    return newWord.toUpperCase();
  }
  if (isTitleCase) {
    return newWord.charAt(0).toUpperCase() + newWord.slice(1);
  }
  return newWord;
}
