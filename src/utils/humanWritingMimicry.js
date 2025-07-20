// src/utils/humanWritingMimicry.js

/**
 * @file Implements advanced human writing mimicry based on GEMINI.md.
 * This version includes concrete logic for sentence structure variation,
 * natural mistakes, and cognitive patterns.
 */

// --- Helper Functions ---
const getSentences = (text) => text.match(/[^.!?]+[.!?]+/g) || [text];
const getWords = (sentence) => sentence.split(/\s+/);
const shouldApply = (probability) => Math.random() < probability;

// --- Core Simulation Logic ---

const humanWritingSimulator = {
  /**
   * Varies sentence length to avoid robotic consistency.
   */
  varySentenceLength: (sentences) => {
    // This is a simulation. A real implementation would be more complex.
    if (shouldApply(0.2)) { // 20% chance to merge two short sentences
      const shortSentenceIndex = sentences.findIndex(s => getWords(s).length < 8);
      if (shortSentenceIndex > -1 && shortSentenceIndex < sentences.length - 1) {
        sentences[shortSentenceIndex] = sentences[shortSentenceIndex].replace(/[.!?]$/, ' dan ') + sentences[shortSentenceIndex + 1].toLowerCase();
        sentences.splice(shortSentenceIndex + 1, 1);
      }
    }
    if (shouldApply(0.15)) { // 15% chance to split a long sentence
      const longSentenceIndex = sentences.findIndex(s => getWords(s).length > 20);
      if (longSentenceIndex > -1) {
        const words = getWords(sentences[longSentenceIndex]);
        const splitPoint = Math.floor(words.length / 2);
        const firstHalf = words.slice(0, splitPoint).join(' ') + '.';
        const secondHalf = words.slice(splitPoint).join(' ');
        sentences.splice(longSentenceIndex, 1, firstHalf, secondHalf);
      }
    }
    return sentences;
  },

  /**
   * Injects natural-sounding mistakes and variations.
   */
  injectNaturalMistakes: (sentence) => {
    const mistakes = {
      occasionalRedundancy: 0.05,
      informalSlip: 0.03,
      colloquialInsert: 0.12,
    };
    if (shouldApply(mistakes.occasionalRedundancy)) {
      const words = getWords(sentence);
      if (words.length > 5) {
        sentence = sentence.replace(words[2], `${words[2]} yang pada dasarnya`);
      }
    }
    if (shouldApply(mistakes.colloquialInsert)) {
      const colloquialisms = ['sih', 'deh', 'gitu'];
      sentence = sentence.replace(/[.!?]$/, ` ${colloquialisms[Math.floor(Math.random() * colloquialisms.length)]}.`);
    }
    return sentence;
  },

  /**
   * Simulates human thought patterns like self-correction.
   */
  simulateThoughtPatterns: (sentence) => {
    const patterns = {
      selfCorrection: 0.06,
    };
    if (shouldApply(patterns.selfCorrection)) {
      const words = getWords(sentence);
      if (words.length > 7) {
        const originalWord = words[4];
        sentence = sentence.replace(originalWord, `maksud saya, ${originalWord}`);
      }
    }
    return sentence;
  }
};

const cognitiveMimicry = {
  /**
   * Inserts markers that simulate thinking pauses or attention shifts.
   */
  simulateCognitiveLoad: (sentence) => {
    if (shouldApply(0.05)) { // Topic drift / refocus
      const refocusMarkers = ['kembali ke topik', 'oh ya, ngomong-ngomong', 'anyway'];
      sentence = `${refocusMarkers[Math.floor(Math.random() * refocusMarkers.length)]}, ${sentence.toLowerCase()}`;
    }
    if (shouldApply(0.03)) { // Thinking markers
      const markers = ['hmm', 'jadi begini', 'well'];
      sentence = `${markers[Math.floor(Math.random() * markers.length)]}, ${sentence.toLowerCase()}`;
    }
    return sentence;
  }
};

/**
 * Main Exported Function: Applies a full suite of human mimicry techniques.
 * @param {string} text The input text.
 * @param {object} options Configuration options (currently unused, for future expansion).
 * @returns {string} The processed, more human-like text.
 */
export const applyHumanWritingMimicry = (text, options = {}) => {
  if (!text) return '';

  let sentences = getSentences(text);

  // 1. Vary overall sentence structure
  sentences = humanWritingSimulator.varySentenceLength(sentences);

  // 2. Process each sentence individually
  let processedSentences = sentences.map(sentence => {
    let processedSentence = sentence;
    processedSentence = humanWritingSimulator.injectNaturalMistakes(processedSentence);
    processedSentence = humanWritingSimulator.simulateThoughtPatterns(processedSentence);
    processedSentence = cognitiveMimicry.simulateCognitiveLoad(processedSentence);
    return processedSentence;
  });

  return processedSentences.join(' ');
};
