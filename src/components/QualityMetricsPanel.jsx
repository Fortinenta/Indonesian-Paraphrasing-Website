import React from 'react';
import { CheckCircle, AlertCircle, BookOpen, Zap, BarChart2 } from 'lucide-react';

const QualityMetricsPanel = ({ qualityMetrics, puebiCompliance, humanLikenessScore }) => {
  // Determine which set of metrics to use
  const isNewPipeline = humanLikenessScore && humanLikenessScore.individual;
  
  let metrics = {};
  if (isNewPipeline) {
    const { lexicalDiversity, sentenceVariation, uniqueness } = humanLikenessScore.individual;
    metrics = {
      uniqueness: uniqueness,
      diversity: lexicalDiversity,
      variation: sentenceVariation,
      overall: humanLikenessScore.overall,
    };
  } else {
    metrics = qualityMetrics || {};
  }

  const metricsExist = Object.keys(metrics).length > 0;

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 h-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart2 className="w-5 h-5 mr-2 text-blue-400"/>
        Analisis Hasil
      </h3>
      {metricsExist ? (
        <div className="space-y-4">
          {isNewPipeline ? (
            <>
              <MetricBar label="Tingkat Perubahan" value={metrics.uniqueness} color="green" />
              <MetricBar label="Keragaman Kata" value={metrics.diversity} color="blue" />
              <MetricBar label="Variasi Kalimat" value={metrics.variation} color="purple" />
              <MetricBar label="Skor Human-Like" value={metrics.overall} color="yellow" />
            </>
          ) : (
            <>
              <MetricBar label="Keunikan" value={metrics.uniqueness} color="green" />
              <MetricBar label="Makna" value={metrics.meaningPreservation} color="blue" />
              <MetricBar label="Tata Bahasa (PUEBI)" value={puebiCompliance?.overallScore} color="purple" />
              <MetricBar label="Kelancaran" value={metrics.fluency} color="yellow" />
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-slate-500">Metrik akan ditampilkan di sini setelah teks diproses.</p>
        </div>
      )}
    </div>
  );
};

const MetricBar = ({ label, value, color }) => {
  const colors = {
    green: 'from-green-500 to-emerald-400',
    blue: 'from-blue-500 to-cyan-400',
    purple: 'from-purple-500 to-pink-400',
    yellow: 'from-yellow-500 to-orange-400',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-slate-300">{label}</span>
        <span className={`text-sm font-bold text-white`}>{value || 0}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className={`bg-gradient-to-r ${colors[color]} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${value || 0}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QualityMetricsPanel;

