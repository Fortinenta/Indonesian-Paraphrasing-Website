import React from 'react';

const TextInput = ({ inputText, setInputText, wordCount, isLoading }) => {
  return (
    <div className="h-full flex flex-col">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Masukkan teks yang ingin diparafrase di sini..."
        className="w-full flex-grow p-3 bg-black/20 border border-transparent rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        disabled={isLoading}
      />
      <div className="flex justify-end items-center text-xs text-slate-400 pt-2">
        <span>{wordCount} kata / {inputText.length} karakter</span>
      </div>
    </div>
  );
};

export default TextInput;
