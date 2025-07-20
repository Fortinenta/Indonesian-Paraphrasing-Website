import axios from 'axios';

const WIKIPEDIA_API_KEY = import.meta.env.VITE_WIKIPEDIA_API_KEY;
const KBBI_API_URL = import.meta.env.VITE_KBBI_API_ENDPOINT || 'https://kbbi-api.vercel.app';
const PLAGIARISM_CHECK_API = import.meta.env.VITE_PLAGIARISM_CHECK_API;
const GRAMMAR_CHECK_API = import.meta.env.VITE_GRAMMAR_CHECK_API;
const GOOGLE_BOOKS_API = import.meta.env.VITE_GOOGLE_BOOKS_API;
const NEWS_API_INDONESIA = import.meta.env.VITE_NEWS_API_INDONESIA;

/**
 * Fetches synonyms for a given word.
 * Currently mocked to prevent 403 errors from Kateglo API.
 * @param {string} word The word to find synonyms for.
 * @returns {Promise<string[]>} A promise that resolves to an empty array.
 */
export const getKBBISynonyms = async (word) => {
  console.warn(`Synonym fetching for "${word}" is currently mocked and returns no synonyms due to API issues.`);
  return Promise.resolve([]);
};

// Fungsi untuk mengekstrak kata kunci dari teks panjang
const extractKeywords = (text) => {
  // Hapus tanda baca dan normalize text
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  
  // Daftar kata kunci relevan untuk food waste/limbah makanan
  const relevantKeywords = [
    'limbah makanan', 'food waste', 'food loss', 'pangan berkelanjutan',
    'sustainable food', 'pembuangan makanan', 'kehilangan pangan',
    'indonesia', 'emisi gas rumah kaca', 'ketahanan pangan'
  ];
  
  // Cari kata kunci yang ada dalam teks
  const foundKeywords = relevantKeywords.filter(keyword => 
    cleanText.includes(keyword.toLowerCase())
  );
  
  // Jika ada kata kunci yang ditemukan, gunakan 2-3 yang pertama
  if (foundKeywords.length > 0) {
    return foundKeywords.slice(0, 2).join(' ');
  }
  
  // Fallback: ambil 3-5 kata pertama yang meaningful
  const words = cleanText.split(' ').filter(word => 
    word.length > 3 && !['yang', 'dan', 'atau', 'dengan', 'untuk', 'dari', 'pada'].includes(word)
  );
  
  return words.slice(0, 3).join(' ');
};

// Fungsi untuk truncate query jika masih terlalu panjang
const truncateQuery = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim();
};

// Fallback function untuk Wikipedia bahasa Inggris
const fetchEnglishWikipedia = async (searchText) => {
  try {
    const query = extractKeywords(searchText);
    const encodedQuery = encodeURIComponent(query);
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*&srlimit=3`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'FoodWasteApp/1.0 (educational-purpose)',
      },
      timeout: 10000
    });
    
    return response.data;
  } catch (error) {
    console.error('English Wikipedia also failed:', error);
    throw error;
  }
};

// Fungsi utama untuk fetch Wikipedia dengan error handling
export const fetchWikipediaContext = async (searchText) => {
  try {
    // Extract keywords dari teks panjang
    let query = extractKeywords(searchText);
    query = truncateQuery(query);
    
    // Encode query untuk URL
    const encodedQuery = encodeURIComponent(query);
    
    // URL API Wikipedia Indonesia dengan proper endpoint
    const url = `https://id.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*&srlimit=3`;
    
    // Request dengan proper headers
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'FoodWasteApp/1.0 (educational-purpose)',
        'Accept': 'application/json',
      },
      timeout: 10000 // 10 detik timeout
    });
    
    return response.data;
    
  } catch (error) {
    console.error('Wikipedia API Error:', error);
    
    // Handle specific error codes
    if (error.response?.status === 403) {
      console.log('Access forbidden - trying English Wikipedia');
      return await fetchEnglishWikipedia(searchText);
    }
    
    if (error.response?.status === 429) {
      console.log('Rate limited - waiting before retry');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return await fetchWikipediaContext(searchText); // Retry once
    }
    
    // Return fallback data instead of throwing error
    return {
      query: {
        search: [{
          title: "Food Waste Information",
          snippet: "Informasi tentang limbah makanan tidak tersedia saat ini."
        }]
      }
    };
  }
};

/**
 * Fetches definition from KBBI API.
 * @param {string} word The word to find definition for.
 * @returns {Promise<string>} A promise that resolves to the definition.
 */
export const getKBBIDefinition = async (word) => {
  try {
    const response = await axios.get(`${KBBI_API_URL}/search/${encodeURIComponent(word)}`);
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data[0].arti;
    }
    return `Definisi untuk '${word}' tidak ditemukan.`;
  } catch (error) {
    console.error(`Error fetching KBBI definition for "${word}":`, error);
    return `Gagal mengambil definisi untuk '${word}'.`;
  }
};

/**
 * Simulates fetching translation help from Google Translate API.
 * @param {string} text The text to get translation help for.
 * @returns {Promise<string>} A promise that resolves to translation suggestions.
 */
export const getGoogleTranslateHelp = async (text) => {
  // In a real application, you would integrate with Google Translate API here.
  // Note: Google Translate API is not free for general use.
  console.log(`Simulating Google Translate help for: ${text}`);
  return Promise.resolve(`(Simulated) Bantuan terjemahan untuk: '${text}'`);
};

/**
 * Placeholder for Plagiarism Check API.
 * @param {string} text The text to check for plagiarism.
 * @returns {Promise<object>} A promise that resolves to plagiarism check results.
 */
export const checkPlagiarism = async (text) => {
  console.log(`Simulating plagiarism check for: ${text}`);
  // In a real application, integrate with a plagiarism API
  return Promise.resolve({ score: Math.floor(Math.random() * 30), details: "Simulated plagiarism check results." });
};

/**
 * Placeholder for Grammar Check API.
 * @param {string} text The text to check for grammar.
 * @returns {Promise<object>} A promise that resolves to grammar check results.
 */
export const checkGrammar = async (text) => {
  console.log(`Simulating grammar check for: ${text}`);
  // In a real application, integrate with a grammar API
  return Promise.resolve({ errors: [], suggestions: [], score: 95 });
};

/**
 * Placeholder for Google Books API integration.
 * @param {string} query The search query for Google Books.
 * @returns {Promise<object[]>} A promise that resolves to an array of book references.
 */
export const getGoogleBooksReferences = async (query) => {
  console.log(`Simulating Google Books search for: ${query}`);
  // In a real application, integrate with Google Books API
  return Promise.resolve([
    { title: "Simulated Book 1", author: "Author A", year: 2020 },
    { title: "Simulated Book 2", author: "Author B", year: 2018 },
  ]);
};

/**
 * Placeholder for News API Indonesia integration.
 * @param {string} query The search query for news.
 * @returns {Promise<object[]>} A promise that resolves to an array of news articles.
 */
export const getNewsContext = async (query) => {
  console.log(`Simulating News API Indonesia search for: ${query}`);
  // In a real application, integrate with a News API
  return Promise.resolve([
    { title: "Simulated News 1", source: "News Source X", date: "2025-07-19" },
    { title: "Simulated News 2", source: "News Source Y", date: "2025-07-18" },
  ]);
};