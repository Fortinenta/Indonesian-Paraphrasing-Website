import React, { useState, useEffect } from 'react';

import TextInput from './components/TextInput';
import ParaphraseOutput from './components/ParaphraseOutput';
import ExportOptions from './components/ExportOptions';
import QualityMetricsPanel from './components/QualityMetricsPanel'; // New component
import { Toaster, toast } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useParaphrase } from './hooks/useParaphrase';
import { useClipboard } from './hooks/useClipboard';
import { Upload, FileText, Copy, Download, Settings, Zap, CheckCircle, AlertCircle, RotateCcw, Play, BookOpen } from 'lucide-react'; // New icons
import { fetchWikipediaContext } from './services/apiService';

function App() {
  const {
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
  } = useParaphrase();

  const { isCopied, copyToClipboard } = useClipboard();

  const [activeTab, setActiveTab] = useState('text'); // State for input tabs
  const [qualityMetrics, setQualityMetrics] = useState({ // Dummy metrics for now
    uniqueness: 85,
    meaningPreservation: 92,
    grammar: 98,
    fluency: 89,
    plagiarism: 15
  });

  // New states for Wikipedia search
  const [wikipediaData, setWikipediaData] = useState(null);
  const [wikipediaLoading, setWikipediaLoading] = useState(false);
  const [wikipediaError, setWikipediaError] = useState(null);

  const inputWordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const outputWordCount = paraphrasedText.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast.error('Teks input tidak boleh kosong!');
      return;
    }
    toast.loading('Memparafrasekan teks...');
    await paraphrase(inputText);
    toast.dismiss(); // Dismiss loading toast
    if (!error) {
      toast.success('Teks berhasil diparafrase!');
    }
  };

  const handleFileUpload = (content) => {
    setInputText(content);
    setActiveTab('text'); // Switch to text tab after upload
  };

  const handleSearchWikipedia = async () => {
    if (!inputText.trim()) {
      toast.error('Teks input tidak boleh kosong untuk mencari di Wikipedia!');
      return;
    }
    setWikipediaLoading(true);
    setWikipediaError(null);
    setWikipediaData(null);
    try {
      const data = await fetchWikipediaContext(inputText);
      setWikipediaData(data);
      toast.success('Informasi Wikipedia berhasil dimuat!');
    } catch (err) {
      setWikipediaError('Tidak dapat mengambil informasi dari Wikipedia.');
      toast.error('Gagal memuat informasi Wikipedia.');
      console.error('Wikipedia search failed:', err);
    } finally {
      setWikipediaLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      <Toaster position="top-center" toastOptions={{
        className: 'dark:bg-slate-700 dark:text-white',
      }}/>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ParafraseAI</h1>
                <p className="text-sm text-gray-300">Advanced Indonesian Paraphrasing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-300 hover:text-white transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel - Input */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Input Teks</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab('text')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'text' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    Teks
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'upload' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload
                  </button>
                </div>
              </div>

              {activeTab === 'text' ? (
                <div className="space-y-4">
                  <TextInput
                    inputText={inputText}
                    setInputText={setInputText}
                    wordCount={inputWordCount}
                    isLoading={isLoading}
                  />
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{inputText.length} karakter</span>
                    <span>{inputWordCount} kata</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Drag & drop file atau klik untuk upload</p>
                    <p className="text-sm text-gray-500">Mendukung .txt, .docx, .pdf (max 10MB)</p>
                    {/* Placeholder for actual file input */}
                    <input type="file" className="hidden" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Simulate file processing
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          handleFileUpload(event.target.result);
                        };
                        reader.readAsText(file);
                      }
                    }} />
                  </div>
                </div>
              )}

              {/* Paraphrase Settings */}
              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-sm font-medium text-white mb-4">Pengaturan Parafrase</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Tingkat Parafrase</label>
                    <select 
                      value={paraphraseLevel}
                      onChange={(e) => setParaphraseLevel(e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="light">Ringan (30-50%)</option>
                      <option value="medium">Sedang (50-70%)</option>
                      <option value="heavy">Berat (70-90%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">Gaya Bahasa</label>
                    <select 
                      value={paraphraseMode}
                      onChange={(e) => setParaphraseMode(e.target.value)}
                      className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="akademik">Akademik</option>
                      <option value="casual">Kasual</option>
                      <option value="bisnis">Bisnis</option>
                      <option value="kreatif">Kreatif</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Process Button */}
              <button
                onClick={handleParaphrase}
                disabled={!inputText.trim() || isLoading}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-medium transition-all ${
                  !inputText.trim() || isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Memproses...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Parafrase
                  </div>
                )}
              </button>
              <button
                onClick={handleSearchWikipedia}
                disabled={!inputText.trim() || wikipediaLoading}
                className={`w-full mt-4 py-4 px-6 rounded-xl font-medium transition-all ${
                  !inputText.trim() || wikipediaLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:shadow-lg hover:shadow-teal-500/25 transform hover:scale-[1.02]'
                }`}
              >
                {wikipediaLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Mencari Wikipedia...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Cari di Wikipedia
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Center - Quality Metrics */}
          <div className="lg:col-span-2">
            <QualityMetricsPanel qualityMetrics={qualityMetrics} />
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Hasil Parafrase</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(paraphrasedText)}
                    className="p-2 text-gray-300 hover:text-white transition-colors" 
                    title="Copy"
                    disabled={!paraphrasedText}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-300 hover:text-white transition-colors" title="Download" disabled={!paraphrasedText}>
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-300 hover:text-white transition-colors" title="Reset" disabled={!paraphrasedText}>
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <ParaphraseOutput 
                  inputText={inputText}
                  outputText={paraphrasedText}
                  wordCount={outputWordCount}
                  isLoading={isLoading}
                  isCopied={isCopied}
                  copyToClipboard={copyToClipboard}
                />

                {paraphrasedText && (
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{paraphrasedText.length} karakter</span>
                    <span>{outputWordCount} kata</span>
                  </div>
                )}
              </div>

              {/* Export Options */}
              {paraphrasedText && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm font-medium text-white mb-4">Opsi Export</h3>
                  <ExportOptions 
                    outputText={paraphrasedText}
                    fileName="paraphrased_document"
                  />
                </div>
              )}

              {/* Wikipedia Results */}
              {(wikipediaLoading || wikipediaError || wikipediaData) && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm font-medium text-white mb-4">Informasi Wikipedia</h3>
                  {wikipediaLoading && (
                    <div className="flex items-center justify-center text-gray-300">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Memuat informasi Wikipedia...
                    </div>
                  )}
                  {wikipediaError && (
                    <div className="text-red-400 text-sm">
                      {wikipediaError}
                    </div>
                  )}
                  {wikipediaData && wikipediaData.query?.search?.length > 0 ? (
                    <div className="space-y-4">
                      {wikipediaData.query.search.map((result, index) => (
                        <div key={index} className="bg-white/10 p-3 rounded-lg">
                          <h4 className="text-white font-semibold text-md mb-1">{result.title}</h4>
                          <p className="text-gray-300 text-sm line-clamp-3">{result.snippet.replace(/<[^>]*>?/gm, '')}</p>
                          <a 
                            href={`https://id.wikipedia.org/wiki/${encodeURIComponent(result.title)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-sm mt-2 inline-block"
                          >
                            Baca lebih lanjut
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : wikipediaData && !wikipediaLoading && !wikipediaError && (
                    <p className="text-gray-400 text-sm">Tidak ada informasi Wikipedia yang ditemukan.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Powered</h3>
            </div>
            <p className="text-gray-300">Menggunakan teknologi AI terdepan untuk menghasilkan parafrase berkualitas tinggi</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg mr-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Quality Assured</h3>
            </div>
            <p className="text-gray-300">Sistem validasi multi-layer memastikan hasil parafrase berkualitas dan bebas plagiat</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Multi Format</h3>
            </div>
            <p className="text-gray-300">Mendukung berbagai format input dan output untuk kemudahan penggunaan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;