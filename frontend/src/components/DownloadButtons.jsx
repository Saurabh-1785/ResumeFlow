import React from 'react';

const DownloadButtons = ({ generatePdf, generateLatex }) => {
  return (
    <div className="download-buttons">
      <button onClick={generatePdf}>Download as PDF</button>
      <button onClick={generateLatex}>Download as LaTeX</button>
    </div>
  );
};

export default DownloadButtons;