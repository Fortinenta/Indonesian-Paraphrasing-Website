import { puebiConfig } from '../../puebi.config';

const puebiRules = {
  punctuation: {
    // Regex to find punctuation followed by a non-space, non-punctuation character
    spacing: /([.,:;])(?=[^\s.,:;])/g, 
  },
  capitalization: {
    // Finds sentences that do not start with a capital letter
    sentence: /(^|\.\s+|\!\s+|\?\s+)([a-z])/g,
  },
  spelling: {
    standardize: {
      'praktek': 'praktik',
      'sistim': 'sistem',
      'aktifitas': 'aktivitas',
      'obyektif': 'objektif',
      'subyek': 'subjek',
      'karir': 'karier',
      'atheis': 'ateis',
      'apotek': 'apotik',
      'analisa': 'analisis',
      'resiko': 'risiko',
      'nasehat': 'nasihat',
      'jadual': 'jadwal',
    }
  }
};

export const applyPuebiRules = (text) => {
  if (!text) return '';
  let corrected = text;

  // Apply punctuation spacing rules
  corrected = corrected.replace(puebiRules.punctuation.spacing, '$1 ');

  // Apply capitalization rules
  corrected = corrected.replace(puebiRules.capitalization.sentence, (match, p1, p2) => p1 + p2.toUpperCase());
  
  // Standardize spelling
  Object.entries(puebiRules.spelling.standardize).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    corrected = corrected.replace(regex, (match) => {
        // Preserve case
        if (match.toUpperCase() === match) return correct.toUpperCase();
        if (match.charAt(0).toUpperCase() === match.charAt(0)) return correct.charAt(0).toUpperCase() + correct.slice(1);
        return correct;
    });
  });
  
  return corrected;
};

export const validatePuebiCompliance = (text) => {
  if (!text) return { overallScore: 100, issues: [] };

  const issues = [];
  let totalPossibleIssues = 0;

  // Check for punctuation spacing issues
  const punctuationMatches = text.match(puebiRules.punctuation.spacing) || [];
  punctuationMatches.forEach(match => {
    issues.push({ type: 'Punctuation', value: match, message: 'Missing space after punctuation.' });
  });
  totalPossibleIssues += (text.match(/[.,:;]/g) || []).length;

  // Check for capitalization issues
  const capitalizationMatches = text.match(puebiRules.capitalization.sentence) || [];
  capitalizationMatches.forEach(match => {
    issues.push({ type: 'Capitalization', value: match.trim(), message: 'Sentence should start with a capital letter.' });
  });
  totalPossibleIssues += (text.match(/(^|\.\s+|\!\s+|\?\s+)/g) || []).length;

  // Check for spelling issues
  Object.keys(puebiRules.spelling.standardize).forEach(wrong => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    const spellingMatches = text.match(regex) || [];
    spellingMatches.forEach(match => {
      issues.push({ type: 'Spelling', value: match, message: `Incorrect spelling. Suggested: "${puebiRules.spelling.standardize[wrong]}"` });
    });
  });
  totalPossibleIssues += (text.split(/\s+/).length); // Approximate

  const errorCount = issues.length;
  const score = totalPossibleIssues > 0 
    ? Math.max(0, 100 - (errorCount / totalPossibleIssues) * 100)
    : 100;

  return {
    overallScore: Math.round(score),
    issues: issues
  };
};