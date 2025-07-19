import React from 'react';
import { MagnifyingGlassIcon, CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';

const PlagiarismChecker = ({ similarityScore, sources, onCheck, isLoading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Pemeriksa Keunikan</h2>
        <button
          onClick={onCheck}
          disabled={isLoading}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all"
        >
          <MagnifyingGlassIcon />
          {isLoading ? 'Mengecek...' : 'Cek Teks'}
        </button>
      </div>
      {similarityScore !== null && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {similarityScore > 20 ? (
              <CrossCircledIcon className="w-10 h-10 text-red-500" />
            ) : (
              <CheckCircledIcon className="w-10 h-10 text-green-500" />
            )}
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">Tingkat Kesamaan Terdeteksi</p>
              <p className={`text-2xl font-bold ${similarityScore > 20 ? 'text-red-500' : 'text-green-500'}`}>
                {`${similarityScore.toFixed(2)}%`}
              </p>
            </div>
          </div>
          {sources.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-600 dark:text-gray-400">Kemungkinan Sumber Ditemukan:</h3>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                {sources.map((source, index) => (
                  <li key={index}>
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlagiarismChecker;
