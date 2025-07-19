import React, { useState } from 'react';
import { Upload, FileText, Copy, Download, Settings, Zap, CheckCircle, AlertCircle, RotateCcw, Play, Pause } from 'lucide-react';

const ParaphraseWebsite = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qualityMetrics, setQualityMetrics] = useState({
    uniqueness: 85,
    meaningPreservation: 92,
    grammar: 98,
    fluency: 89,
    plagiarism: 15
  });
  const [paraphraseLevel, setParaphraseLevel] = useState('medium');
  const [activeTab, setActiveTab] = useState('text');

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setOutputText('Hasil parafrase akan muncul di sini setelah pemrosesan selesai. Sistem akan menggunakan algoritma multi-layer untuk menghasilkan teks yang unik namun tetap mempertahankan makna asli.');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
        {/* Main Content */}
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
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Masukkan teks yang ingin diparafrase di sini..."
                    className="w-full h-64 p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{inputText.length} karakter</span>
                    <span>{inputText.split(' ').filter(word => word.length > 0).length} kata</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-blue-500/50 transition-colors cursor-pointer group">
                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Drag & drop file atau klik untuk upload</p>
                    <p className="text-sm text-gray-500">Mendukung .txt, .docx, .pdf (max 10MB)</p>
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
                    <select className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Formal</option>
                      <option>Kasual</option>
                      <option>Akademik</option>
                      <option>Bisnis</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Process Button */}
              <button
                onClick={handleProcess}
                disabled={!inputText.trim() || isProcessing}
                className={`w-full mt-6 py-4 px-6 rounded-xl font-medium transition-all ${
                  !inputText.trim() || isProcessing
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                }`}
              >
                {isProcessing ? (
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
            </div>
          </div>

          {/* Center - Quality Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-fit">
              <h3 className="text-lg font-semibold text-white mb-4">Metrik Kualitas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Keunikan</span>
                    <span className="text-sm font-medium text-green-400">{qualityMetrics.uniqueness}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${qualityMetrics.uniqueness}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Makna</span>
                    <span className="text-sm font-medium text-blue-400">{qualityMetrics.meaningPreservation}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${qualityMetrics.meaningPreservation}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Tata Bahasa</span>
                    <span className="text-sm font-medium text-purple-400">{qualityMetrics.grammar}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${qualityMetrics.grammar}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Kelancaran</span>
                    <span className="text-sm font-medium text-yellow-400">{qualityMetrics.fluency}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${qualityMetrics.fluency}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Risiko Plagiat</span>
                    <span className="text-sm font-medium text-red-400">{qualityMetrics.plagiarism}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-rose-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${qualityMetrics.plagiarism}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-sm text-green-300">Kualitas Excellent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Hasil Parafrase</h2>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-300 hover:text-white transition-colors" title="Copy">
                    <Copy className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-300 hover:text-white transition-colors" title="Download">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-300 hover:text-white transition-colors" title="Reset">
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-64 p-4 bg-white/5 border border-white/20 rounded-xl overflow-y-auto">
                  {isProcessing ? (
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
                    <p className="text-white leading-relaxed">{outputText}</p>
                  ) : (
                    <p className="text-gray-400 text-center">Hasil parafrase akan muncul di sini</p>
                  )}
                </div>

                {outputText && (
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{outputText.length} karakter</span>
                    <span>{outputText.split(' ').filter(word => word.length > 0).length} kata</span>
                  </div>
                )}
              </div>

              {/* Export Options */}
              {outputText && (
                <div className="mt-6 p-4 bg-white/5 rounded-xl">
                  <h3 className="text-sm font-medium text-white mb-4">Opsi Export</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                      PDF
                    </button>
                    <button className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                      DOCX
                    </button>
                    <button className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors">
                      TXT
                    </button>
                  </div>
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
};

export default ParaphraseWebsite;