import React from 'react';
import { diffWords } from 'diff';

const ParaphraseOutput = ({ inputText, outputText, isLoading }) => {
  const renderDiff = () => {
    if (!outputText) return null;
    const options = { ignoreWhitespace: true };
    const differences = diffWords(inputText, outputText, options);

    return differences.map((part, index) => {
      const style = part.added ? 'bg-green-800/50 text-green-300 rounded' :
                    part.removed ? 'bg-red-800/50 text-red-300 line-through' :
                    'text-slate-300';
      return (
        <span key={index} className={`${style} transition-colors duration-300`}>
          {part.value}
        </span>
      );
    });
  };

  return (
    <div className="h-full p-3 bg-black/20 rounded-xl overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6 mb-2"></div>
            </div>
            <p className="text-slate-500 text-sm mt-4">Sedang memproses...</p>
          </div>
        </div>
      ) : outputText ? (
        <p className="text-base leading-relaxed whitespace-pre-wrap">{renderDiff()}</p>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-500 text-center">Hasil parafrase akan muncul di sini.</p>
        </div>
      )}
    </div>
  );
};

export default ParaphraseOutput;
