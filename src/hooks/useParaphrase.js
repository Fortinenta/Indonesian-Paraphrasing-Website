import { useState, useEffect, useCallback } from 'react';
import { paraphraseEngine } from '../services/paraphraseEngine';
import { fetchWikipediaContext, getKBBISynonyms, getGoogleTranslateHelp } from '../services/apiService';

export const useParaphrase = () => {
  const [inputText, setInputText] = useState('');
  const [paraphrasedText, setParaphrasedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paraphraseLevel, setParaphraseLevel] = useState('medium'); // low, medium, high
  const [paraphraseMode, setParaphraseMode] = useState('academic'); // academic, casual, business, creative

  const paraphrase = useCallback(async (textToParaphrase) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API calls for external context (Wikipedia, KBBI, Google Translate)
      const wikipediaContext = await fetchWikipediaContext(textToParaphrase);
      const kbbiSynonyms = await getKBBISynonyms(textToParaphrase);
      const googleTranslateHelp = await getGoogleTranslateHelp(textToParaphrase);

      const result = await paraphraseEngine.process(
        textToParaphrase,
        paraphraseLevel,
        paraphraseMode,
        { wikipediaContext, kbbiSynonyms, googleTranslateHelp }
      );
      setParaphrasedText(result);
    } catch (err) {
      setError('Failed to paraphrase: ' + err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [paraphraseLevel, paraphraseMode]);

  useEffect(() => {
    if (inputText) {
      // Debounce the paraphrase function to avoid excessive API calls
      const handler = setTimeout(() => {
        paraphrase(inputText);
      }, 500); // Adjust debounce time as needed
      return () => clearTimeout(handler);
    } else {
      setParaphrasedText('');
    }
  }, [inputText, paraphrase]);

  return {
    inputText,
    setInputText,
    paraphrasedText,
    isLoading,
    error,
    paraphraseLevel,
    setParaphraseLevel,
    paraphraseMode,
    setParaphraseMode,
    paraphrase,
  };
};
