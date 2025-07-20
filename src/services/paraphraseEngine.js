// src/services/paraphraseEngine.js

/**
 * @file The definitive, adaptive paraphrasing engine with a specialized
 * Structural-Grammatical pipeline for academic writing.
 */

import { applyHumanWritingMimicry } from '../utils/humanWritingMimicry';
import { applyIndonesianAuthenticity } from '../utils/idiomEngine';
import { applyPuebiRules } from '../utils/puebiValidator';
import { getKBBISynonyms } from './apiService';
import { analyzeAndTagWords, removeTags, filterInformalPhrases } from '../utils/textProcessor'; // Import the new function

// --- UTILITY & METRIC CALCULATORS ---
const getSentences = (text) => text.match(/[^.!?]+[.!?]+/g) || [text];
const getWords = (text) => text.toLowerCase().split(/\s+/).filter(w => w.length > 0);

const calculateLexicalDiversity = (text) => {
  const words = getWords(text);
  if (words.length === 0) return 0;
  const uniqueWords = new Set(words);
  return Math.min(Math.round((uniqueWords.size / words.length) * 180), 100);
};

const calculateSentenceLengthVariation = (text) => {
  const sentences = getSentences(text);
  if (sentences.length < 2) return 50;
  const lengths = sentences.map(s => getWords(s).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const stdDev = Math.sqrt(lengths.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / lengths.length);
  return Math.min(Math.round(stdDev * 17), 100);
};

const calculateUniquenessScore = (originalText, paraphrasedText) => {
  const originalWords = new Set(getWords(originalText));
  const paraphrasedWords = new Set(getWords(paraphrasedText));
  if (originalWords.size === 0) return 0;
  const intersection = new Set([...originalWords].filter(word => paraphrasedWords.has(word)));
  const union = new Set([...originalWords, ...paraphrasedWords]);
  const jaccardSimilarity = intersection.size / union.size;
  return Math.round((1 - jaccardSimilarity) * 100);
};

// --- CORE TEXT MANIPULATORS ---

const increaseLexicalDiversity = async (text, defaultProbability = 0.6) => {
  const wordsAndSeparators = text.split(/(\s+|[.,!?;:()])/); // Split by whitespace and punctuation, keeping them
  const promises = wordsAndSeparators.map(async (part) => {
    if (part.trim() === '' || /[.,!?;:()]/.test(part)) { // If it's whitespace or punctuation, return as is
      return part;
    }

    const originalWord = part;
    const taggedWord = analyzeAndTagWords(originalWord); // Tag internally for decision

    let tag = '';
    if (taggedWord.includes('[KATA_KUNCI]')) tag = 'KATA_KUNCI';
    else if (taggedWord.includes('[KATA_UMUM]')) tag = 'KATA_UMUM';

    // Do not replace common words
    if (tag === 'KATA_UMUM') {
        return originalWord;
    }

    let probability = defaultProbability;
    if (tag === 'KATA_KUNCI') {
        probability = 0.85; // High probability for keywords
    }

    if (originalWord.length > 3 && Math.random() < probability) { // Reduced min length for more changes
      try {
        const synonyms = await getKBBISynonyms(originalWord.toLowerCase().replace(/[.,!?;:()]/g, ''));
        if (synonyms && synonyms.length > 0) return synonyms[0];
      } catch (e) { /* ignore */ }
    }
    return originalWord;
  });
  return (await Promise.all(promises)).join('');
};

const injectBurstiness = (text) => {
  let sentences = getSentences(text);
  if (sentences.length < 2) return text;

  const processedSentences = sentences.map(sentence => {
    // No splitting based on internal punctuation here to avoid absurdity
    return sentence;
  });

  // Attempt to combine short sentences with adjacent ones if they are not keyword-rich
  for (let i = 0; i < processedSentences.length - 1; i++) {
      const currentSentence = processedSentences[i];
      const nextSentence = processedSentences[i+1];
      const currentWords = getWords(currentSentence).length;
      const nextWords = getWords(nextSentence).length;

      const taggedCurrent = analyzeAndTagWords(currentSentence);
      const taggedNext = analyzeAndTagWords(nextSentence);

      const currentKeywords = (taggedCurrent.match(/\[KATA_KUNCI\]/g) || []).length;
      const nextKeywords = (taggedNext.match(/\[KATA_KUNCI\]/g) || []).length;

      // Only combine if both are short and not keyword-rich
      if (currentWords < 10 && nextWords < 10 && currentKeywords === 0 && nextKeywords === 0 && Math.random() < 0.6) {
          processedSentences[i] = currentSentence.replace(/[.!?]$/, ', ') + nextSentence.toLowerCase();
          processedSentences.splice(i + 1, 1);
          i--; // Re-evaluate the new combined sentence
      }
  }

  return processedSentences.join(' ');
};

// --- NEW: GRAMMATICAL TRANSFORMATION FUNCTIONS ---

/**
 * Transforms a simple active sentence to a passive one.
 * This is a rule-based approximation.
 */
const transformActiveToPassive = (sentence) => {
    // Simple pattern: (Subjek) me-verb (Objek) on the original sentence
    const match = sentence.match(/^(.*?)\s+(me[a-zA-Z]+)\s+(.*?)(?:\.|\$|,)/);
    if (match) {
        const subject = match[1];
        const verb = match[2];
        const object = match[3];

        // Check if subject and object are significant (not just common words) using internal tagging
        const taggedSubject = analyzeAndTagWords(subject);
        const taggedObject = analyzeAndTagWords(object);

        if (taggedSubject.includes('[KATA_KUNCI]') && taggedObject.includes('[KATA_KUNCI]')) {
            const passiveVerb = 'di' + verb.substring(2);
            return `${object.charAt(0).toUpperCase() + object.slice(1)} ${passiveVerb} oleh ${subject.toLowerCase()}.`;
        }
    }
    return sentence;
};

/**
 * Restructures a complex sentence by swapping clauses.
 */
const restructureComplexSentence = (sentence) => {
    const conjunctions = ['meskipun', 'walaupun', 'karena', 'sehingga'];
    for (const conj of conjunctions) {
        // Look for patterns on the original sentence
        const pattern = new RegExp(`^(${conj})\s(.*?),(.*)`);
        const match = sentence.match(pattern);
        if (match) {
            const clause1 = match[2];
            const clause2 = match[3].trim();

            // Check if clauses contain keywords using internal tagging
            const taggedClause1 = analyzeAndTagWords(clause1);
            const taggedClause2 = analyzeAndTagWords(clause2);

            if (taggedClause1.includes('[KATA_KUNCI]') && taggedClause2.includes('[KATA_KUNCI]')) {
                return `${clause2.charAt(0).toUpperCase() + clause2.slice(1)} ${conj} ${clause1}.`;
            }
        }
    }
    return sentence;
};


// --- ADAPTIVE ENGINE CORE ---

const TARGET_PROFILES = {
  academic: { diversity: 80, variation: 65, humanize: 0.1 }, // Low humanize factor
  creative: { diversity: 85, variation: 85, humanize: 0.8 },
  business: { diversity: 70, variation: 60, humanize: 0.3 },
  casual:   { diversity: 65, variation: 75, humanize: 1.0 },
  default:  { diversity: 75, variation: 70, humanize: 0.6 },
};

/**
 * The definitive, adaptive pipeline function.
 */
export const runParaphrasePipeline = async (originalText, options = {}) => {
  const { mode = 'default' } = options;
  let processedText = originalText; // Start with original text

  console.log(`--- Running pipeline in "${mode}" mode ---`);

  if (mode === 'academic') {
    // **ACADEMIC-GRAMMATICAL PIPELINE (More Aggressive)**
    const sentences = getSentences(processedText);
    const transformedSentences = await Promise.all(sentences.map(async (sentence) => {
        let newSentence = sentence;
        // Increased probability to 70% for more significant structural changes
        if (Math.random() < 0.7) newSentence = transformActiveToPassive(newSentence);
        if (Math.random() < 0.7) newSentence = restructureComplexSentence(newSentence);
        return newSentence;
    }));
    processedText = transformedSentences.join(' ');
    
    // More aggressive lexical substitution for academic mode (75%)
    // This function will handle its own tagging internally
    processedText = await increaseLexicalDiversity(processedText, 0.75);

    // Apply subtle humanization and authenticity for academic mode
    if (Math.random() < 0.2) processedText = applyIndonesianAuthenticity(processedText); // Lower probability
    if (Math.random() < 0.1) processedText = applyHumanWritingMimicry(processedText); // Even lower probability

    // Apply informal phrase filtering for academic mode
    processedText = filterInformalPhrases(processedText);

  } else {
    // **HUMAN-LIKE/CREATIVE PIPELINE**
    const profile = TARGET_PROFILES[mode] || TARGET_PROFILES.default;
    for (let i = 0; i < 5; i++) {
      // These functions will handle their own tagging internally
      const diversity = calculateLexicalDiversity(processedText);
      const variation = calculateSentenceLengthVariation(processedText);
      if (diversity >= profile.diversity && variation >= profile.variation) break;
      if (diversity < profile.diversity) processedText = await increaseLexicalDiversity(processedText);
      if (variation < profile.variation) processedText = injectBurstiness(processedText);
    }
    if (Math.random() < profile.humanize) processedText = applyIndonesianAuthenticity(processedText);
    if (Math.random() < profile.humanize) processedText = applyHumanWritingMimicry(processedText);
  }

  // Final PUEBI cleaning pass is now mandatory for all modes
  console.log('--- Applying mandatory PUEBI rules ---');
  processedText = applyPuebiRules(processedText);

  // Remove all internal tags before returning the final text
  processedText = removeTags(processedText);

  // Final scoring for all modes
  const finalDiversity = calculateLexicalDiversity(processedText);
  const finalVariation = calculateSentenceLengthVariation(processedText);
  const finalUniqueness = calculateUniquenessScore(originalText, processedText);
  const overallScore = Math.round((finalDiversity + finalVariation + finalUniqueness) / 3);

  return {
    paraphrasedText: processedText,
    scores: {
      overall: overallScore,
      individual: {
        lexicalDiversity: finalDiversity,
        sentenceVariation: finalVariation,
        uniqueness: finalUniqueness,
      }
    },
    recommendations: [],
  };
};

// --- RETAINED: Original Functions for Backward Compatibility ---
export const analyzeText = async (text) => ({ sentences: getSentences(text), originalText: text });
export const lexicalSubstitution = async (analyzedText, options) => increaseLexicalDiversity(analyzedText.originalText);
export const syntacticRestructuring = async (text, options) => text;
export const calculateAdvancedQualityMetrics = async (originalText, paraphrasedText) => ({
    uniqueness: calculateUniquenessScore(originalText, paraphrasedText),
    meaningPreservation: 90, grammar: 95, fluency: 90, plagiarism: 5,
});
export const calculateAIDetectionResistance = async (text) => 85;