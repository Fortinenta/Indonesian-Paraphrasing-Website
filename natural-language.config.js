export const naturalLanguageConfig = {
  humanLikeness: 'high', // 'low', 'medium', 'high'
  aiEvasion: 'enabled',
  indonesianAuthenticity: 'preserve',
  colloquialLevel: 'balanced', // 'formal', 'balanced', 'casual'
};

/**
 * Indonesian Cognitive Writing Patterns
 * Based on GEMINI.md, this object contains patterns for mimicking
 * Indonesian-specific writing styles, including cultural and linguistic nuances.
 */
export const indonesianCognitivePatterns = {
  // Pola berpikir khas Indonesia
  culturalThinkingPatterns: {
    // Gaya bercerita melingkar (tidak langsung ke point)
    circularNarrative: {
      enabled: true,
      probability: 0.25,
      patterns: ['context-first', 'relationship-establishment', 'gradual-revelation']
    },

    // Penggunaan analogi dan perumpamaan lokal
    localAnalogies: {
      'sulit': ['seperti mencari jarum dalam jerami', 'bagai pungguk merindukan bulan'],
      'mudah': ['seperti membalikkan telapak tangan', 'bagai makan sirih sepinang'],
      'impossible': ['bagaikan air dengan minyak', 'seperti langit dan bumi']
    },

    // Pola kesopanan berbahasa Indonesia
    politenessLayers: {
      formalMarkers: ['kiranya', 'barangkali', 'agaknya', 'rasanya'],
      hedging: ['sepertinya', 'mungkin', 'bisa jadi', 'kemungkinan besar'],
      indirectness: ['kalau boleh saya katakan', 'sepengetahuan saya', 'menurut hemat saya']
    }
  },

  // Variasi dialek dan register yang natural
  naturalLanguageVariation: {
    regionalInfluences: {
      jakarta: ['gue', 'lo', 'nih', 'sih', 'dong'],
      jawa: ['kok', 'lho', 'toh', 'je'],
      general: ['kan', 'deh', 'kali', 'banget']
    },

    // Manusia sering campur formal-informal tanpa sadar
    registerMixing: {
      probability: 0.15,
      transitions: 'gradual',
      contextualAwareness: true
    },

    // Filler words yang sangat manusiawi (ditambahkan dari GEMINI.md)
    fillerWords: {
      thinking: ['emmm', 'ehh', 'anu', 'gimana ya'],
      hesitation: ['maksudnya', 'jadi gini', 'gitu lho', 'begini nih'],
      transition: ['nah itu dia', 'makanya tuh', 'itu sebabnya', 'jadi ceritanya']
    }
  }
};
