import React, { useState, useEffect } from 'react';

import TextInput from './components/TextInput';
import ParaphraseOutput from './components/ParaphraseOutput';
import ExportOptions from './components/ExportOptions';
import QualityMetricsPanel from './components/QualityMetricsPanel';
import SettingsPanel from './components/SettingsPanel'; // Import SettingsPanel
import { Toaster, toast } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAdvancedParaphrase } from './hooks/useAdvancedParaphrase';
import { useClipboard } from './hooks/useClipboard';
import { Upload, FileText, Copy, Download, Settings, Zap, CheckCircle, AlertCircle, RotateCcw, Play, BookOpen } from 'lucide-react'; // New icons
import { fetchWikipediaContext } from './services/apiService';

function App() {
  const {
    paraphraseLevel,
    setParaphraseLevel,
    paraphraseMode,
    setParaphraseMode,
    isProcessing,
    processHumanLikeParaphrase, // Added this line
    humanLikenessScore,
    paraphrasedText, // Use this from the hook
  } = useAdvancedParaphrase();

  const [inputText, setInputText] = useState('');
  // const [paraphrasedText, setParaphrasedText] = useState(''); // Remove this line
  const [showSettings, setShowSettings] = useState(false); // State for settings panel

  const { isCopied, copyToClipboard } = useClipboard();

  const [activeTab, setActiveTab] = useState('text'); // State for input tabs

  const inputWordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const outputWordCount = paraphrasedText.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    // Removed the error toast useEffect as it was causing issues.
    // Errors are now handled directly in the functions that can throw them.
  }, []);

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast.error('Teks input tidak boleh kosong!');
      return;
    }
    const loadingToast = toast.loading('Memparafrasekan teks...');
    try {
      // Using the new, intelligent pipeline
      await processHumanLikeParaphrase(inputText);
      toast.success('Teks berhasil diparafrase!', { id: loadingToast });
    } catch (err) {
      toast.error(err.message || 'Gagal memparafrasekan teks.', { id: loadingToast });
    }
  };

  const handleFileUpload = (content) => {
    setInputText(content);
    setActiveTab('text'); // Switch to text tab after upload
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      <Toaster position="top-center" toastOptions={{
        className: 'dark:bg-slate-700 dark:text-white',
      }}/>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ParafraseAI</h1>
                <p className="text-sm text-slate-300">Advanced Indonesian Paraphrasing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-slate-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
                title={showSettings ? "Tutup Pengaturan" : "Buka Pengaturan"}
              >
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Input */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Input</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab('text')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'text' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    <FileText className="w-4 h-4 inline mr-1.5" />
                    Teks
                  </button>
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      activeTab === 'upload' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline mr-1.5" />
                    Upload
                  </button>
                </div>
              </div>

              <div className="flex-grow">
                {activeTab === 'text' ? (
                  <TextInput
                    inputText={inputText}
                    setInputText={setInputText}
                    wordCount={inputWordCount}
                    isLoading={isProcessing}
                  />
                ) : (
                  <FileUploader onFileUpload={handleFileUpload} />
                )}
              </div>

              {/* Process Button */}
              <button
                onClick={handleParaphrase}
                disabled={!inputText.trim() || isProcessing}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
                  !inputText.trim() || isProcessing
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transform hover:scale-[1.02]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Parafrase
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Panel - Dynamic */}
          <div className="lg:col-span-3">
             <SettingsPanel 
                paraphraseLevel={paraphraseLevel}
                setParaphraseLevel={setParaphraseLevel}
                paraphraseMode={paraphraseMode}
                setParaphraseMode={setParaphraseMode}
              />
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Hasil</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => copyToClipboard(paraphrasedText)}
                    className="p-2 text-slate-300 hover:text-white transition-colors disabled:text-slate-500 rounded-full hover:bg-white/10" 
                    title={isCopied ? "Tersalin!" : "Salin"}
                    disabled={!paraphrasedText || isProcessing}
                  >
                    {isCopied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <ExportOptions 
                    outputText={paraphrasedText}
                    isLoading={isProcessing}
                  />
                </div>
              </div>

              <div className="flex-grow">
                <ParaphraseOutput 
                  inputText={inputText}
                  outputText={paraphrasedText}
                  wordCount={outputWordCount}
                  isLoading={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Features Section */}
        <div className="mt-10">
            <QualityMetricsPanel 
                humanLikenessScore={humanLikenessScore}
            />
        </div>
      </main>
    </div>
  );
}

export default App;