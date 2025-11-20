import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-yellow-800 dark:border-yellow-600 border-t-transparent"></div>
      <p className="mt-4 text-gray-500 dark:text-gray-300">Loading Preview...</p>
    </div>
  );
}

function PdfPreview({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error) {
    console.error('Error while loading PDF:', error.message);
    setIsLoading(false);
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prevPageNumber) => Math.min(prevPageNumber + 1, numPages));
  }

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto bg-gray-200 dark:bg-gray-700 pt-4">
      {pdfUrl ? (
        <>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<LoadingSpinner />}
            className="pdf-document"
          >
            {!isLoading && (
              <Page
                pageNumber={pageNumber}
                className="shadow-lg mb-4"
              />
            )}
          </Document>
          {!isLoading && numPages && (
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={goToPreviousPage}
                disabled={pageNumber <= 1}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <p className="text-gray-700 dark:text-gray-300">
                Page {pageNumber} of {numPages}
              </p>
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4">
          <p className="text-gray-500 dark:text-gray-300 text-center">
            Resume preview will appear here.
            <br /><br />
            Start by entering your name in the "General" tab and click "Update Preview" or "Ctrl+S".
          </p>
        </div>
      )}
    </div>
  );
}

export default PdfPreview;