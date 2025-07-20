import React from 'react';

const SettingsPanel = ({ paraphraseLevel, setParaphraseLevel, paraphraseMode, setParaphraseMode }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-6">Pengaturan</h2>
      <div className="space-y-6">
        {/* Paraphrase Level */}
        <div>
          <label className="text-sm text-slate-300 mb-2 block">Tingkat Parafrase</label>
          <select 
            value={paraphraseLevel}
            onChange={(e) => setParaphraseLevel(e.target.value)}
            className="w-full p-3 bg-slate-800/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Ringan</option>
            <option value="medium">Sedang</option>
            <option value="heavy">Berat</option>
          </select>
        </div>

        {/* Paraphrase Mode/Tone */}
        <div>
          <label className="text-sm text-slate-300 mb-2 block">Gaya Bahasa</label>
          <select 
            value={paraphraseMode}
            onChange={(e) => setParaphraseMode(e.target.value)}
            className="w-full p-3 bg-slate-800/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="academic">Akademik</option>
            <option value="casual">Kasual</option>
            <option value="business">Bisnis</option>
            <option value="creative">Kreatif</option>
            <option value="formal">Formal</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
