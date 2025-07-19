import axios from 'axios';

const KATEGLO_API_URL = 'http://kateglo.com/api.php';
// KBBI API is not officially public/free, so we'll simulate it or use a known public proxy if available.
// For now, we'll simulate the KBBI API response.
const KBBI_API_URL = 'https://kbbi.kemdikbud.go.id/api.php'; // Placeholder, actual API might differ or require auth

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
 * Simulates fetching definition from KBBI API.
 * @param {string} word The word to find definition for.
 * @returns {Promise<string>} A promise that resolves to the definition.
 */
export const getKBBIDefinition = async (word) => {
  // In a real application, you would integrate with a KBBI API here.
  // For now, we return a simulated response.
  console.log(`Simulating KBBI definition for: ${word}`);
  return Promise.resolve(`(Simulated) Definisi untuk '${word}': Ini adalah definisi simulasi dari KBBI.`);
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

