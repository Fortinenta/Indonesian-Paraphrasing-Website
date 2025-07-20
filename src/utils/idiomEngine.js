// src/utils/idiomEngine.js

/**
 * @file Implements a more advanced Indonesian Linguistic Authenticity Engine.
 * This version actively uses configurations to inject analogies, politeness,
 * and other authentic expressions contextually.
 */

import { indonesianCognitivePatterns } from '../../natural-language.config';

// --- Helper Functions ---
const getSentences = (text) => text.match(/[^.!?]+[.!?]+/g) || [text];
const shouldApply = (probability) => Math.random() < probability;
const selectRandomly = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- Core Authenticity Logic ---

const expressionGenerator = {
  /**
   * Injects filler words at the beginning of sentences to mimic hesitation or thought.
   */
  injectFillerWords: (sentence) => {
    const fillers = indonesianCognitivePatterns.naturalLanguageVariation.fillerWords;
    if (shouldApply(0.08)) { // 8% chance to add a thinking/hesitation filler
      const fillerType = shouldApply(0.5) ? fillers.thinking : fillers.hesitation;
      const filler = selectRandomly(fillerType);
      return `${filler.charAt(0).toUpperCase() + filler.slice(1)}, ${sentence.toLowerCase()}`;
    }
    return sentence;
  },

  /**
   * Replaces certain concepts with local analogies.
   */
  replaceWithLocalAnalogies: (sentence) => {
    const analogies = indonesianCognitivePatterns.culturalThinkingPatterns.localAnalogies;
    if (shouldApply(0.1)) { // 10% chance to attempt a replacement
      if (sentence.includes('sulit')) {
        return sentence.replace(/sulit/g, selectRandomly(analogies['sulit']));
      }
      if (sentence.includes('mudah')) {
        return sentence.replace(/mudah/g, selectRandomly(analogies['mudah']));
      }
    }
    return sentence;
  },

  /**
   * Adds politeness markers to soften the tone.
   */
  addPolitenessLayers: (sentence) => {
    const politeness = indonesianCognitivePatterns.culturalThinkingPatterns.politenessLayers;
    if (shouldApply(0.12)) { // 12% chance to add a hedging word
      const hedgingWord = selectRandomly(politeness.hedging);
      return `${hedgingWord}, ${sentence.toLowerCase()}`;
    }
    return sentence;
  },
  
  /**
   * Appends natural Indonesian particles to the end of sentences.
   */
  injectParticles: (sentence) => {
    const particles = indonesianCognitivePatterns.naturalLanguageVariation.regionalInfluences.general;
     if (shouldApply(0.20)) { // 20% chance to add a particle
        const particle = selectRandomly(particles);
        sentence = sentence.replace(/[.!?]$/, ` ${particle}.`);
     }
     return sentence;
  }
};

/**
 * Main Exported Function: Applies a full suite of authenticity techniques.
 * @param {string} text The input text.
 * @param {object} options Configuration options.
 * @returns {string} The processed text with enhanced authenticity.
 */
export const applyIndonesianAuthenticity = (text, options = {}) => {
  if (!text) return '';

  const sentences = getSentences(text);

  const processedSentences = sentences.map(sentence => {
    let processedSentence = sentence;

    // Apply various authenticity layers based on probability
    processedSentence = expressionGenerator.injectFillerWords(processedSentence);
    processedSentence = expressionGenerator.replaceWithLocalAnalogies(processedSentence);
    processedSentence = expressionGenerator.addPolitenessLayers(processedSentence);
    processedSentence = expressionGenerator.injectParticles(processedSentence);

    return processedSentence;
  });

  return processedSentences.join(' ');
};
