const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Enhances text using AI.
 * 
 * @param {string} text - The text to enhance.
 * @param {string} context - The context for enhancement.
 * @returns {Promise<string>} The enhanced text.
 */
export const enhanceTextWithAI = async (text, context) => {
    const response = await fetch(`${API_BASE_URL}/enhance-text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to enhance text.");
    }

    const result = await response.json();
    return result.enhancedText;
};

/**
 * Generates a PDF from LaTeX content.
 * 
 * @param {string} tex - The LaTeX content.
 * @returns {Promise<Blob>} The generated PDF blob.
 */
export const generatePdf = async (tex) => {
    const response = await fetch(`${API_BASE_URL}/generate-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error generating PDF");
    }

    return await response.blob();
};
