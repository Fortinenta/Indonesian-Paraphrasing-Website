import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileProcessor } from '../hooks/useFileProcessor';
import { UploadIcon } from '@radix-ui/react-icons';

const FileUploader = ({ onFileUpload }) => {
  const { processFile } = useFileProcessor();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const text = await processFile(file);
      onFileUpload(text);
    } catch (error) {
      // Error is already handled by toast in the hook
    }
  }, [processFile, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors bg-white dark:bg-gray-800 shadow-sm
      ${isDragActive ? 'border-primary bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600 hover:border-primary'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
        <UploadIcon className="w-8 h-8 mb-2 text-primary" />
        <p className="text-sm">
          <span className="font-semibold text-primary">Klik untuk upload</span> atau seret & jatuhkan file
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">TXT, DOCX, DOC, atau PDF</p>
      </div>
    </div>
  );
};

export default FileUploader;
