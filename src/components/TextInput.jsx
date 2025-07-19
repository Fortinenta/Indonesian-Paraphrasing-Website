import React from 'react';
import { calculateReadingLevel, getReadingLevelDescription } from '../utils/textProcessor';

const TextInput = ({ inputText, setInputText, wordCount, isLoading }) => {
  const readingLevelScore = calculateReadingLevel(inputText);
  const readingLevelDescription = getReadingLevelDescription(readingLevelScore);

  return (
    <div className="space-y-4">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Masukkan teks yang ingin diparafrase di sini..."
        className="w-full h-64 p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        disabled={isLoading}
      />
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{inputText.length} karakter</span>
        <span>{wordCount} kata</span>
      </div>
    </div>
  );
};

export default TextInput;