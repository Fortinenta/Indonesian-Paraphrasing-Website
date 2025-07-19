import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const QualityMetricsPanel = ({ qualityMetrics }) => {
  const { uniqueness, meaningPreservation, grammar, fluency, plagiarism } = qualityMetrics;

  const getQualityMessage = () => {
    if (plagiarism > 20) {
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-400 mr-2" />,
        text: 'Perlu Perhatian: Risiko Plagiat Tinggi',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/20',
        textColor: 'text-red-300'
      };
    } else if (uniqueness < 70 || meaningPreservation < 80 || grammar < 90 || fluency < 80) {
      return {
        icon: <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />,
        text: 'Kualitas Sedang: Perlu Peninjauan',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/20',
        textColor: 'text-yellow-300'
      };
    } else {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-400 mr-2" />,
        text: 'Kualitas Excellent',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        textColor: 'text-green-300'
      };
    }
  };

  const message = getQualityMessage();

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-fit">
      <h3 className="text-lg font-semibold text-white mb-4">Metrik Kualitas</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Keunikan</span>
            <span className="text-sm font-medium text-green-400">{uniqueness}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${uniqueness}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Makna</span>
            <span className="text-sm font-medium text-blue-400">{meaningPreservation}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${meaningPreservation}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Tata Bahasa</span>
            <span className="text-sm font-medium text-purple-400">{grammar}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${grammar}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Kelancaran</span>
            <span className="text-sm font-medium text-yellow-400">{fluency}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${fluency}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-300">Risiko Plagiat</span>
            <span className="text-sm font-medium text-red-400">{plagiarism}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-red-500 to-rose-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${plagiarism}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className={`mt-6 p-3 ${message.bgColor} border ${message.borderColor} rounded-lg`}>
        <div className="flex items-center">
          {message.icon}
          <span className={`text-sm ${message.textColor}`}>{message.text}</span>
        </div>
      </div>
    </div>
  );
};

export default QualityMetricsPanel;
