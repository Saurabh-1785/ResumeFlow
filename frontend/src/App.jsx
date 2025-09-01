// frontend/src/App.jsx

import './index.css';
import { useState, useEffect, useCallback } from "react";
import GeneralInfo from "./components/GeneralInfo";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import CustomSection from "./components/CustomSection";
import ThemeToggle from "./components/ThemeToggle";
import Preview from "./components/Preview";
import PdfPreview from './components/PdfPreview';
import { generateLatex } from "./utils/generateLatex";

// --- ATS Score Modal Component (Defined within App.jsx) ---
const AtsScoreModal = ({ score, onClose }) => {
  if (!score) return null;

  const getScoreColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-lg text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 text-yellow-600">ATS Score Analysis 📈</h2>
        <div className="text-center mb-6">
          <p className="text-lg">Overall Score:</p>
          <p className={`text-6xl font-bold ${getScoreColor(score.total, 100)}`}>{score.total}<span className="text-3xl text-gray-400">/100</span></p>
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold border-b pb-2 mb-3">Breakdown:</h3>
          {score.feedback.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{item.label}:</span>
              <span className={`font-bold ${getScoreColor(item.score, item.max)}`}>{item.score}/{item.max}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Suggestions for Improvement:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {score.suggestions.length > 0 ? score.suggestions.map((s, i) => <li key={i}>{s}</li>) : <li>Great job! Your resume looks well-optimized.</li>}
          </ul>
        </div>
        <div className="text-center mt-8">
          <button onClick={onClose} className="bg-yellow-600 text-white font-bold px-8 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [atsScore, setAtsScore] = useState(null); // ATS score state
  const [enhancingId, setEnhancingId] = useState(null);

  // form states
  const [general, setGeneral] = useState({ name: "", email: "", phone: "", github: "", linkedin: "", about: "" });
  const [education, setEducation] = useState([{ id: Date.now(), institution: "", place: "", study: "", grade: "", datestart: "", dateend: "" }]);
  const [experience, setExperience] = useState([{ id: Date.now(), company: "", position: "", responsibilities: "", from: "", to: "" }]);
  const [projects, setProjects] = useState([{ id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  const [skills, setSkills] = useState({ languages: "", frameworks: "", libraries: "", tools: "", others: "" });
  const [customSections, setCustomSections] = useState([]);

  // ... (handleEnhanceWithAI and updatePreview functions remain the same) ...
  const handleEnhanceWithAI = async (id, context, currentText, onSuccess) => {
    if (!currentText || currentText.trim() === "") {
        alert("Please enter some text before enhancing.");
        return;
    }
    setEnhancingId(id); // Set the ID of the item being enhanced
    try {
        const response = await fetch("http://localhost:5000/enhance-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: currentText, context }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || "Failed to enhance text.");
        }

        const result = await response.json();
        onSuccess(result.enhancedText);

    } catch (err) {
        console.error("Error enhancing text:", err);
        alert(`Enhancement failed: ${err.message}`);
    } finally {
        setEnhancingId(null); // Reset to null when done
    }
  };

  const updatePreview = useCallback(async () => {
    if (!general.name || general.name.trim() === "") {
        console.log("Validation failed: Name is required to generate a preview.");
        setPdfUrl(null);
        return;
    }
    setIsUpdating(true);
    const data = { generalInfo: general, education: education.map(e => ({ school: e.institution, location: e.place, degree: `${e.study} - ${e.grade}`, date: `${e.datestart} -- ${e.dateend}` })), experience: experience.map(exp => ({ company: exp.company, position: exp.position, description: exp.responsibilities, date: `${exp.from} -- ${exp.to}`, location: "" })), projects: projects.map(p => ({ name: p.name, tech: p.technology, description: p.description, link: p.url, date: "" })), skills: skills, customSections: customSections };
    const tex = generateLatex(data);
    try {
      const response = await fetch("http://localhost:5000/generate-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tex }) });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("PDF Generation FAILED:", errorText);
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(prevUrl => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return url;
      });
    } catch (err) {
      console.error("A network error occurred:", err);
    } finally {
      setIsUpdating(false);
    }
  }, [general, education, experience, projects, skills, customSections]);

  // --- LOGIC MOVED FROM PREVIEW.JSX TO APP.JSX ---
  const handleDownloadPDF = async () => {
    const data = { generalInfo: general, education: education.map(e => ({ school: e.institution, location: e.place, degree: `${e.study} - ${e.grade}`, date: `${e.datestart} -- ${e.dateend}` })), experience: experience.map(exp => ({ company: exp.company, position: exp.position, description: exp.responsibilities, date: `${exp.from} -- ${exp.to}`, location: "" })), projects: projects.map(p => ({ name: p.name, tech: p.technology, description: p.description, link: p.url, date: "" })), skills: skills, customSections: customSections };
    const tex = generateLatex(data);
    try {
      const response = await fetch("http://localhost:5000/generate-pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tex }) });
      if (!response.ok) { alert("Error generating PDF"); return; }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Something went wrong while generating PDF");
    }
  };

  const calculateAtsScore = () => {
    let score = 0;
    const feedback = [];
    const suggestions = [];
    // 1. Contact Info (Max 15)
    let contactScore = 0;
    if (general.name) contactScore += 5;
    if (general.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(general.email)) contactScore += 5;
    if (general.phone) contactScore += 5;
    feedback.push({ label: 'Contact Information', score: contactScore, max: 15 });
    if (contactScore < 15) suggestions.push('Ensure your Name, Email, and Phone are filled out correctly.');
    score += contactScore;
    // 2. Key Sections Present (Max 20)
    let sectionScore = 0;
    if (experience.length > 0 && experience[0].company) sectionScore += 10;
    if (education.length > 0 && education[0].institution) sectionScore += 5;
    if (Object.values(skills).some(s => s)) sectionScore += 5;
    feedback.push({ label: 'Essential Sections', score: sectionScore, max: 20 });
    if (sectionScore < 20) suggestions.push('Include at least one entry in Experience, Education, and Skills.');
    score += sectionScore;
    // 3. Content Analysis (Max 45)
    const actionVerbs = ['managed', 'led', 'developed', 'created', 'implemented', 'designed', 'analyzed', 'negotiated', 'streamlined', 'achieved', 'launched', 'optimized'];
    const allDescriptions = [...experience.map(e => e.responsibilities), ...projects.map(p => p.description)].join(' ').toLowerCase();
    let verbCount = actionVerbs.filter(verb => allDescriptions.includes(verb)).length;
    let verbScore = Math.min(verbCount * 3, 20);
    feedback.push({ label: 'Action Verbs', score: verbScore, max: 20 });
    if (verbScore < 10) suggestions.push('Incorporate more action verbs (e.g., "managed", "developed") in your experience and project descriptions.');
    score += verbScore;
    let quantifiableCount = (allDescriptions.match(/(\d+%?|\$\d+)/g) || []).length;
    let quantifiableScore = Math.min(quantifiableCount * 5, 15);
    feedback.push({ label: 'Quantifiable Results', score: quantifiableScore, max: 15 });
    if (quantifiableScore < 10) suggestions.push('Add measurable results (e.g., numbers, percentages, dollar amounts) to show impact.');
    score += quantifiableScore;
    let summaryScore = (general.about && general.about.length > 50) ? 10 : 0;
    feedback.push({ label: 'Professional Summary', score: summaryScore, max: 10 });
    if (summaryScore === 0) suggestions.push('Write a brief professional summary (2-3 sentences) in the "About" section.');
    score += summaryScore;
    // 4. Skills Detail (Max 20)
    let skillCount = Object.values(skills).reduce((acc, curr) => acc + (curr ? curr.split(',').length : 0), 0);
    let skillScore = Math.min(skillCount * 2, 20);
    feedback.push({ label: 'Skills Detail', score: skillScore, max: 20 });
    if (skillScore < 10) suggestions.push('List more skills, separated by commas, in the skills section.');
    score += skillScore;

    setAtsScore({ total: score, feedback, suggestions });
  };
  // --- END OF MOVED LOGIC ---

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const tabs = ["General", "Education", "Experience", "Projects", "Skills", "+"];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <AtsScoreModal score={atsScore} onClose={() => setAtsScore(null)} />

      <div className="relative flex flex-col items-center justify-center p-10">
        {/* ... Intro screen remains unchanged ... */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center overflow-hidden z-0"><div className="w-[120%] h-[90%] rotate-0 animate-slow-zoom border-8 border-yellow-400 dark:border-yellow-600 opacity-20 "></div></div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0"><div className="w-[120%] h-[90%] rotate-90 animate-slow-zoom border-8 border-yellow-400 dark:border-yellow-600 opacity-20"></div></div>
        {!showForm ? (
          <div className="relative flex flex-col items-center justify-center h-screen w-full text-center z-10">
            <h1 className="text-[clamp(40px,6vw,100px)] font-abril text-yellow-600 mb-10 font-bold hover:text-yellow-700 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-400">ResumeFlow</h1>
            <p className="mt-10 text-[clamp(20px,2vw,50px)] font-lobster text-yellow-700 text-center italic hover:text-yellow-600 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-800">An AI-powered CV generator that transforms your input into a refined, ATS-optimized resume.</p>
            <button onClick={() => { setShowForm(true); setStep(0); }} className="inline font-dancing font-bold text-white bg-yellow-600 px-6 py-3 rounded-lg border border-solid text-3xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-700 hover:text-gray-50 dark:hover:bg-yellow-400 dark:hover:text-gray-900 dark:bg-yellow-600 dark:text-gray-900">Get Started</button>
          </div>
        ) : (
          <div className="w-full z-10">
            <div className='flex justify-center mb-10'><h2 className="text-[clamp(40px,5vw,100px)] font-abril text-yellow-600 mb-10 font-bold hover:text-yellow-700 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-400 ">ResumeFlow</h2></div>
            <div className="flex w-full min-h-screen gap-8">
              <div className="w-1/2 p-6">
                <div className="flex space-x-1 font-inknut border-yellow-600 mb-0">
                  {tabs.map((label, index) => (
                    <button key={index} onClick={() => setStep(index)} className={`flex-1 text-center px-3 py-2 rounded-t-lg transition cursor-pointer border-yellow-600 border-r-6 border-2 ${step === index ? "bg-yellow-600 text-white dark:text-black" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-50 hover:text-yellow-700 dark:hover:text-yellow-400"}`}>{label}</button>
                  ))}
                </div>
                {step === 0 && <GeneralInfo data={general} setData={setGeneral} setStep={setStep} setShowForm={setShowForm} onSaveChanges={updatePreview} isUpdating={isUpdating} isEnhancing={enhancingId} onEnhance={handleEnhanceWithAI} />}
                {step === 1 && <Education data={education} setData={setEducation} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 2 && <Experience data={experience} setData={setExperience} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} isEnhancing={enhancingId} onEnhance={handleEnhanceWithAI} />}
                {step === 3 && <Projects data={projects} setData={setProjects} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} isEnhancing={enhancingId} onEnhance={handleEnhanceWithAI} />}
                {step === 4 && <Skills data={skills} setData={setSkills} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 5 && <CustomSection data={customSections} setData={setCustomSections} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} isEnhancing={enhancingId} onEnhance={handleEnhanceWithAI} />}
                {step === 6 && <Preview general={general} education={education} experience={experience} projects={projects} skills={skills} customSections={customSections} setStep={setStep} />}
              </div>
              
              <div className="w-1/2 p-6 flex flex-col">
                 <h3 className="text-center text-2xl font-lobster text-yellow-600 mb-4">Live Preview</h3>
                 <div className="flex-grow border rounded-lg shadow-inner overflow-hidden">
                    <PdfPreview pdfUrl={pdfUrl} />
                 </div>
              </div>
            </div>

            {/* --- NEW GLOBAL BUTTONS SECTION --- */}
            <div className="mt-8 pt-6 border-t-2 border-yellow-500">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button 
                        onClick={calculateAtsScore} 
                        className="w-full sm:w-auto text-white bg-purple-600 font-bold px-8 py-3 rounded-full border text-lg cursor-pointer transition-all hover:bg-purple-700 shadow-lg">
                        Check ATS Score
                    </button>
                    <button 
                        onClick={handleDownloadPDF} 
                        className="w-full sm:w-auto text-white bg-blue-600 font-bold px-8 py-3 rounded-full border text-lg cursor-pointer transition-all hover:bg-blue-700 shadow-lg">
                        Download PDF
                    </button>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;