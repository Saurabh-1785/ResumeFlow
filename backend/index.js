import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API Endpoints ---

/**
 * @route   POST /generate-pdf
 * @desc    Generates a PDF from a LaTeX string
 * @access  Public
 */
app.post('/generate-pdf', (req, res) => {
    const { tex } = req.body;

    if (!tex) {
        return res.status(400).send('Missing TeX content.');
    }
    const fileName = `resume_${Date.now()}`;
    const texPath = path.join(__dirname, `${fileName}.tex`);
    const pdfPath = path.join(__dirname, `${fileName}.pdf`);

    fs.writeFile(texPath, tex, (err) => {
        if (err) {
            console.error('Error writing .tex file:', err);
            return res.status(500).send('Error creating .tex file.');
        }

        exec(`pdflatex -output-directory=${__dirname} ${texPath}`, (error, stdout, stderr) => {
            // Cleanup the temporary files
            fs.unlink(texPath, () => {});
            fs.unlink(path.join(__dirname, `${fileName}.aux`), () => {});
            fs.unlink(path.join(__dirname, `${fileName}.log`), () => {});

            if (error) {
                console.error('PDF Generation Error:', stderr);
                return res.status(500).send('Error generating PDF.');
            }

            res.sendFile(pdfPath, (err) => {
                if (err) {
                    console.error('Error sending PDF file:', err);
                }
                // Cleanup the PDF file after sending
                fs.unlink(pdfPath, () => {});
            });
        });
    });
});

/**
 * @route   POST /generate-word
 * @desc    Generates a Word document from resume data
 * @access  Public
 */
app.post('/generate-word', (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).send('Missing resume data.');
    }

    const { generalInfo = {}, education = [], experience = [], projects = [], skills = {}, customSections = [] } = data;
    
    // Generate HTML content for Word document
    let wordContent = `
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1 { text-align: center; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h2 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; margin-top: 25px; }
        .contact-info { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        .item { margin-bottom: 15px; }
        .item-title { font-weight: bold; color: #2c3e50; }
        .item-subtitle { font-style: italic; color: #7f8c8d; }
        .item-date { float: right; color: #7f8c8d; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
    </style>
    </head>
    <body>
    
    <h1>${generalInfo.name || ''}</h1>
    <div class="contact-info">
        ${generalInfo.email ? `<span>${generalInfo.email}</span>` : ''}
        ${generalInfo.phone ? ` | <span>${generalInfo.phone}</span>` : ''}
        ${generalInfo.github ? `<br><span>GitHub: ${generalInfo.github}</span>` : ''}
        ${generalInfo.linkedin ? ` | <span>LinkedIn: ${generalInfo.linkedin}</span>` : ''}
    </div>
    
    ${generalInfo.about ? `
    <div class="section">
        <h2>Summary</h2>
        <p>${generalInfo.about}</p>
    </div>` : ''}
    
    ${education.length > 0 ? `
    <div class="section">
        <h2>Education</h2>
        ${education.map(edu => `
        <div class="item">
            <div class="item-title">${edu.institution}</div>
            <div class="item-subtitle">${edu.place}</div>
            <div class="item-date">${edu.datestart} - ${edu.dateend}</div>
            <div>${edu.study} ${edu.grade ? `- ${edu.grade}` : ''}</div>
        </div>
        `).join('')}
    </div>` : ''}
    
    ${Object.values(skills).some(s => s && s.trim() !== '') ? `
    <div class="section">
        <h2>Skills</h2>
        ${skills.languages ? `<p><strong>Languages:</strong> ${skills.languages}</p>` : ''}
        ${skills.frameworks ? `<p><strong>Frameworks:</strong> ${skills.frameworks}</p>` : ''}
        ${skills.libraries ? `<p><strong>Libraries:</strong> ${skills.libraries}</p>` : ''}
        ${skills.tools ? `<p><strong>Tools:</strong> ${skills.tools}</p>` : ''}
        ${skills.others ? `<p><strong>Others:</strong> ${skills.others}</p>` : ''}
    </div>` : ''}
    
    ${projects.filter(p => p.name && p.name.trim() !== '').length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        ${projects.filter(p => p.name && p.name.trim() !== '').map(proj => `
        <div class="item">
            <div class="item-title">${proj.name}</div>
            <div class="item-subtitle">${proj.technology}</div>
            ${proj.description ? `<p>${proj.description.split('\n').map(line => line.trim()).filter(line => line).join('<br>')}</p>` : ''}
            ${proj.url ? `<p><strong>Link:</strong> <a href="${proj.url}">${proj.url}</a></p>` : ''}
        </div>
        `).join('')}
    </div>` : ''}
    
    ${experience.filter(e => e.company && e.company.trim() !== '').length > 0 ? `
    <div class="section">
        <h2>Experience</h2>
        ${experience.filter(e => e.company && e.company.trim() !== '').map(exp => `
        <div class="item">
            <div class="item-title">${exp.company}</div>
            <div class="item-subtitle">${exp.position}</div>
            <div class="item-date">${exp.from} - ${exp.to}</div>
            ${exp.responsibilities ? `<p>${exp.responsibilities.split('\n').map(line => line.trim()).filter(line => line).join('<br>')}</p>` : ''}
        </div>
        `).join('')}
    </div>` : ''}
    
    ${customSections.filter(sec => sec.title && sec.title.trim() !== '' && sec.content.length > 0).length > 0 ? `
    ${customSections.filter(sec => sec.title && sec.title.trim() !== '' && sec.content.length > 0).map(section => `
    <div class="section">
        <h2>${section.title}</h2>
        ${section.content.map(item => {
            if (item.type === 'subheading') {
                return `
                <div class="item">
                    <div class="item-title">${item.primary || ''}</div>
                    <div class="item-subtitle">${item.tertiary || ''}</div>
                    <div class="item-date">${item.secondary || ''}</div>
                    ${item.quaternary ? `<p>${item.quaternary.split('\n').map(line => line.trim()).filter(line => line).join('<br>')}</p>` : ''}
                </div>`;
            } else {
                return `<p>• ${item.text || ''}</p>`;
            }
        }).join('')}
    </div>
    `).join('')}` : ''}
    
    </body>
    </html>
    `;

    // Set headers for Word document download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.doc');
    res.send(wordContent);
});

/**
 * @route   POST /enhance-text
 * @desc    Enhances a given text using Google Generative AI
 * @access  Public
 */
app.post('/enhance-text', async (req, res) => {
  const { text, context } = req.body;
  const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;

  // Debug logging
  console.log('Received enhance request:', { text: text?.substring(0, 100) + '...', context });
  console.log('API Key exists:', !!GEMINI_API_KEY);
  console.log('API Key first 10 chars:', GEMINI_API_KEY?.substring(0, 10) + '...');

  if (!text || !context) {
      return res.status(400).json({ error: 'Text and context are required.' });
  }

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('AI API key is missing or not configured in .env file.');
      return res.status(500).json({ error: 'AI API key is not configured.' });
  }
  
  // Updated API URL - using the correct v1 endpoint instead of v1beta
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are an expert ATS (Applicant Tracking System) optimization specialist with 10+ years of experience helping candidates achieve 95%+ ATS compatibility scores. Your task is to transform the provided text into ATS-optimized content that ranks highly in automated screening systems while remaining compelling to human recruiters.

  CRITICAL ATS OPTIMIZATION REQUIREMENTS:

  1. KEYWORD OPTIMIZATION:
    - Incorporate industry-standard keywords naturally (avoid keyword stuffing)
    - Use exact job title variations and synonyms
    - Include technical skills, tools, and methodologies mentioned in typical job descriptions
    - Match verb tenses used in job postings (e.g., "managed" vs "managing")

  2. QUANTIFICATION & METRICS:
    - Every achievement MUST include specific numbers, percentages, or measurable outcomes
    - Use concrete data: revenue generated, costs saved, team size, time periods, growth percentages
    - Format numbers properly: "20%" not "twenty percent", "$1M" not "one million dollars"

  3. ACTION VERB OPTIMIZATION:
    - Start each accomplishment with powerful, ATS-friendly action verbs
    - Use variety: Led, Developed, Implemented, Optimized, Delivered, Achieved, Streamlined, Enhanced
    - Avoid overused buzzwords: "passionate," "team player," "detail-oriented," "go-getter"

  4. STRUCTURAL REQUIREMENTS:
    - Write in past tense for previous roles, present tense for current roles
    - Use parallel sentence structure throughout
    - Keep sentences concise (15-20 words maximum)
    - Ensure proper grammar and punctuation for automated parsing

  5. ATS PARSING COMPATIBILITY:
    - Use standard section formatting
    - Avoid special characters, graphics, or unusual formatting
    - Use common abbreviations (MBA, B.S., etc.) alongside full forms when relevant
    - Include both acronyms and spelled-out versions of technical terms (e.g., "AI (Artificial Intelligence)")

  6. CONTEXT-SPECIFIC OPTIMIZATION:
    Based on the context "${context}", incorporate relevant:
    - Industry-specific terminology and buzzwords
    - Required technical competencies
    - Soft skills valued in this field
    - Achievement patterns typical for this role level

  7. CONTENT ENHANCEMENT RULES:
    - Transform weak statements into strong accomplishments
    - Convert responsibilities into achievements with measurable impact
    - Add strategic context showing business value and ROI
    - Demonstrate progression and growth in capabilities

  8. FORMATTING FOR MAXIMUM ATS SCORE:
    - Output as a single, well-structured paragraph
    - Use consistent punctuation and capitalization
    - Ensure keyword density is 2-3% of total word count
    - Maintain natural flow while optimizing for machine readability

  QUALITY ASSURANCE CHECKLIST:
  ✓ Each sentence contains quantifiable results
  ✓ Industry keywords are naturally integrated
  ✓ Action verbs are strong and varied
  ✓ Content shows clear business impact
  ✓ Grammar is perfect for ATS parsing
  ✓ Text flows naturally for human readers

  AVOID COMPLETELY:
  - Generic phrases like "responsible for," "duties included"
  - Overused buzzwords and clichés
  - Vague accomplishments without metrics
  - First-person pronouns (I, me, my)
  - Passive voice constructions
  - Redundant or filler words

  Original text to optimize: "${text}"

  Enhanced ATS-optimized text (output only the enhanced version without any introductory text):`;

  // Additional context-specific prompts for different sections:

  const sectionSpecificPrompts = {
    experience: `Focus on:
  - Quantified business impact and ROI
  - Leadership and team management metrics
  - Process improvements and efficiency gains
  - Revenue generation or cost savings
  - Project scope, timeline, and outcomes
  - Technology implementations and results`,

    projects: `Emphasize:
  - Technical stack and methodologies used
  - Problem-solving approach and innovation
  - Measurable outcomes and performance metrics
  - Collaboration and stakeholder management
  - Timeline adherence and budget management
  - User impact or business value delivered`,

    about: `Highlight:
  - Years of experience and specialization areas
  - Key technical competencies and certifications
  - Industry expertise and domain knowledge
  - Leadership philosophy and management style
  - Career achievements and recognition received
  - Value proposition and unique differentiators`,

    customSection: `Adapt based on section purpose:
  - Use relevant industry terminology
  - Include specific metrics and achievements
  - Align with career progression narrative
  - Support overall professional brand
  - Demonstrate expertise depth and breadth
  - Show continuous learning and growth`
  };

  // Usage example in your enhance-text endpoint:
  const getContextualPrompt = (text, context) => {
    const basePrompt = prompt.replace('${text}', text).replace('${context}', context);
    
    // Add section-specific guidance if available
    const sectionGuidance = sectionSpecificPrompts[context.toLowerCase()];
    if (sectionGuidance) {
      return basePrompt + `\n\nADDITIONAL CONTEXT-SPECIFIC GUIDANCE:\n${sectionGuidance}`;
    }
    
    return basePrompt;
  };

  const requestBody = {
    contents: [{ 
      parts: [{ text: prompt }] 
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE"
      }
    ]
  };

  console.log('Making API request to:', GEMINI_API_URL);

  try {
    const apiResponse = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    console.log('API Response status:', apiResponse.status);

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error('Error from AI API:', errorBody);
        
        // Try to parse as JSON, but fallback to text if it fails
        let errorMessage = 'Unknown error occurred';
        try {
          const errorJson = JSON.parse(errorBody);
          errorMessage = errorJson.error?.message || errorJson.message || errorBody;
        } catch {
          errorMessage = errorBody;
        }
        
        return res.status(apiResponse.status).json({ 
          error: `Error from AI service: ${errorMessage}` 
        });
    }

    const data = await apiResponse.json();
    console.log('API Response received:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
        console.error('Unexpected response structure from AI API:', data);
        return res.status(500).json({ error: 'Received an unexpected response from the AI service.' });
    }
    
    const enhancedText = data.candidates[0].content.parts[0].text;
    console.log('Enhanced text generated successfully');
    res.json({ enhancedText: enhancedText.trim() });

  } catch (error) {
      console.error('Internal server error while calling AI service:', error);
      res.status(500).json({ error: 'An internal error occurred while enhancing the text.' });
  }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log('Environment variables check:');
    console.log('- GOOGLE_API_KEY exists:', !!process.env.GOOGLE_API_KEY);
    console.log('- PORT:', process.env.PORT || 5000);
});