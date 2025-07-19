import React from 'react';
import { toast } from 'react-hot-toast';
import { diffWords } from 'diff';
import { calculateReadingLevel, getReadingLevelDescription } from '../utils/textProcessor';

const ParaphraseOutput = ({ inputText, outputText, wordCount, isLoading }) => {
  const readingLevelScore = calculateReadingLevel(outputText);
  const readingLevelDescription = getReadingLevelDescription(readingLevelScore);

  const renderDiff = () => {
    const options = { ignoreWhitespace: true };
    const differences = diffWords(inputText, outputText, options);

    return differences.map((part, index) => {
      const style = part.added ? 'bg-green-500/30 text-white rounded px-1' :
                    part.removed ? 'bg-red-500/30 text-white/80 line-through rounded px-1' :
                    'text-white/90';
      return (
        <span key={index} className={`${style} transition-colors duration-300`}>
          {part.value}
        </span>
      );
    });
  };

  return (
    <div className="h-64 p-4 bg-white/5 border border-white/20 rounded-xl overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-5/6 mb-2"></div>
            </div>
            <p className="text-gray-400 text-sm mt-4">Sedang memproses parafrase...</p>
          </div>
        </div>
      ) : outputText ? (
        <p className="text-white leading-relaxed">{renderDiff()}</p>
      ) : (
        <p className="text-gray-400 text-center">Hasil parafrase akan muncul di sini</p>
      )}
    </div>
  );
};

export default ParaphraseOutput;