/**
 * Validates a file based on allowed types and size limits.
 * @param {File} file The file to validate.
 * @param {string[]} allowedTypes An array of allowed MIME types (e.g., ['text/plain', 'application/pdf']).
 * @param {number} maxSizeInBytes The maximum allowed file size in bytes.
 * @returns {{isValid: boolean, message: string}}
 */
export const validateFile = (file, allowedTypes, maxSizeInBytes) => {
  if (!file) {
    return { isValid: false, message: 'Tidak ada file yang dipilih.' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: `Tipe file tidak didukung: ${file.type}.` };
  }

  if (file.size > maxSizeInBytes) {
    return { isValid: false, message: `Ukuran file terlalu besar. Maksimal ${maxSizeInBytes / (1024 * 1024)} MB.` };
  }

  return { isValid: true, message: 'File valid.' };
};
