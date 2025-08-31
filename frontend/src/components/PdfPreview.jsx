import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function PdfPreview({ pdfUrl }) {
  return (
    <div className="w-full h-full flex justify-center overflow-y-auto bg-gray-200 dark:bg-gray-700 pt-4">
      {pdfUrl ? (
        <Document
          file={pdfUrl}
          onLoadError={(error) => console.error('Error while loading PDF:', error.message)}
          className="pdf-document"
        >
          <Page
            pageNumber={1}
            className="shadow-lg mb-4"
          />
        </Document>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
            <p className="text-gray-500 dark:text-gray-300 text-center">
              Your resume preview will appear here.
              <br /><br />
              Start by entering your name in the "General" tab and click "Update Preview".
            </p>
        </div>
      )}
    </div>
  );
}

export default PdfPreview;