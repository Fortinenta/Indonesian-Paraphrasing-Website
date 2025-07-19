import { toast } from 'react-hot-toast';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// Set the workerSrc to use a CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const useFileProcessor = () => {
  const processFile = async (file) => {
    if (!file) return;

    const fileType = file.type;
    const fileName = file.name;

    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        try {
          let text = '';
          if (fileType === 'text/plain') {
            text = event.target.result;
          } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const arrayBuffer = event.target.result;
            const result = await mammoth.extractRawText({ arrayBuffer });
            text = result.value;
          } else if (fileType === 'application/pdf') {
            const arrayBuffer = event.target.result;
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            let pdfText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              pdfText += textContent.items.map((item) => item.str).join(' ') + '\n';
            }
            text = pdfText;
          } else {
            throw new Error('Unsupported file type.');
          }
          toast.success(`File ${fileName} berhasil diproses.`);
          resolve(text);
        } catch (error) {
          console.error("File processing error:", error);
          toast.error(`Gagal memproses file ${fileName}.`);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        toast.error('Gagal membaca file.');
        reject(error);
      };
      
      if (fileType === 'text/plain') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  return { processFile };
};
