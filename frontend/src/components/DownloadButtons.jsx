import React from 'react';

const DownloadButtons = ({ generatePdf, generateWord, generateLatex }) => {
  return (
    <div className="space-y-2 px-2">
      <button 
        onClick={generatePdf}
        className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        📄 Download as PDF
      </button>
      <button 
        onClick={generateLatex}
        className="w-full text-left px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium"
      >
        📝 Download LaTeX Code
      </button>
    </div>
  );
};

export default DownloadButtons;