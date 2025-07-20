import { useState, useCallback } from 'react';
import {
  // New intelligent pipeline
  runParaphrasePipeline,
  // Original step-by-step functions
  analyzeText,
  lexicalSubstitution,
  syntacticRestructuring,
  calculateAdvancedQualityMetrics,
  calculateAIDetectionResistance
} from '../services/paraphraseEngine';
import { applyHumanWritingMimicry } from '../utils/humanWritingMimicry';
import { applyIndonesianAuthenticity } from '../utils/idiomEngine';

/**
 * The definitive hook that connects the UI to the adaptive paraphrasing engine.
 */
export const useAdvancedParaphrase = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paraphrasedText, setParaphrasedText] = useState('');
  
  // --- UI State ---
  const [paraphraseLevel, setParaphraseLevel] = useState('medium');
  const [paraphraseMode, setParaphraseMode] = useState('academic');

  // --- State for Original Process ---
  const [qualityMetrics, setQualityMetrics] = useState({});
  const [aiDetectionScore, setAiDetectionScore] = useState(0);

  // --- State for New Human-Like Pipeline ---
  const [humanLikenessScore, setHumanLikenessScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  /**
   * The new, intelligent pipeline that is controlled by the UI's mode setting.
   */
  const processHumanLikeParaphrase = useCallback(async (text) => {
    setIsProcessing(true);
    try {
      // Pass the original text and the mode to the pipeline
      const result = await runParaphrasePipeline(text, { mode: paraphraseMode });
      
      setParaphrasedText(result.paraphrasedText);
      setHumanLikenessScore(result.scores);
      setRecommendations(result.recommendations);

      return result;
    } catch (error) {
      console.error("An error occurred during the human-like paraphrase process:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [paraphraseMode]); // Dependency on paraphraseMode

  return {
    isProcessing,
    paraphrasedText,
    // UI settings
    paraphraseLevel,
    setParaphraseLevel,
    paraphraseMode,
    setParaphraseMode,
    // New pipeline outputs
    humanLikenessScore,
    recommendations,
    // Functions
    processHumanLikeParaphrase,
  };
};
