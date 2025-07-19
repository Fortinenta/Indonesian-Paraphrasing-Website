import React, { Fragment } from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

const ExportOptions = ({ outputText, isLoading }) => {
  const handleExportTXT = () => {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'hasil-parafrase.txt');
    toast.success('File .txt berhasil diekspor!');
  };

  const handleExportDOC = () => {
    const htmlString = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset='utf-8'>
          <title>Hasil Parafrase</title>
        </head>
        <body>
          <p>${outputText.replace(/\n/g, '</p><p>')}</p>
        </body>
      </html>
    `;
    const blob = new Blob([htmlString], { type: 'application/msword' });
    saveAs(blob, 'hasil-parafrase.doc');
    toast.success('File .doc berhasil diekspor!');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const maxLineWidth = pageWidth - margin * 2;
    
    const lines = doc.splitTextToSize(outputText, maxLineWidth);
    doc.text(lines, margin, margin);
    doc.save('hasil-parafrase.pdf');
    toast.success('File .pdf berhasil diekspor!');
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <button 
        onClick={handleExportPDF}
        className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
        disabled={!outputText || isLoading}
      >
        PDF
      </button>
      <button 
        onClick={handleExportDOC}
        className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
        disabled={!outputText || isLoading}
      >
        DOCX
      </button>
      <button 
        onClick={handleExportTXT}
        className="py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
        disabled={!outputText || isLoading}
      >
        TXT
      </button>
    </div>
  );
};

export default ExportOptions;