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

// --- Main App Component ---
function App() {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancingId, setEnhancingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [menuOpen, setMenuOpen] = useState(false);

  // form states
  const [general, setGeneral] = useState({ name: "", email: "", phone: "", github: "", linkedin: "", about: "" });
  const [education, setEducation] = useState([{ id: Date.now(), institution: "", place: "", study: "", grade: "", datestart: "", dateend: "" }]);
  const [experience, setExperience] = useState([{ id: Date.now(), company: "", position: "", responsibilities: "", from: "", to: "" }]);
  const [projects, setProjects] = useState([{ id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  const [skills, setSkills] = useState({ languages: "", frameworks: "", libraries: "", tools: "", others: "" });
  const [customSections, setCustomSections] = useState([]);

  // --- Responsive Check ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug logging - Add this temporarily to see what's happening
  useEffect(() => {
    console.log('enhancingId changed:', enhancingId);
  }, [enhancingId]);

  const handleEnhanceWithAI = async (id, context, currentText, onSuccess) => {
    console.log('handleEnhanceWithAI called with:', { id, context, currentText: currentText?.substring(0, 50) + '...' });
    
    if (!currentText || currentText.trim() === "") {
        alert("Please enter some text before enhancing.");
        return;
    }
    
    console.log('Setting enhancingId to:', id);
    setEnhancingId(id);
    
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
        console.log('Enhancement successful, calling onSuccess');
        onSuccess(result.enhancedText);
    } catch (err) {
        console.error("Error enhancing text:", err);
        alert(`Enhancement failed: ${err.message}`);
    } finally {
        console.log('Resetting enhancingId to null');
        setEnhancingId(null);
    }
  };

  const updatePreview = useCallback(async () => {
    if (isMobile) return; // Disable on mobile
    if (!general.name || general.name.trim() === "") {
        console.log("Validation failed: Name is required to generate a preview.");
        setPdfUrl(null);
        return;
    }
    
    // Prevent preview update if AI is enhancing
    if (enhancingId !== null) {
        console.log("AI enhancement in progress, skipping preview update");
        return;
    }
    
    console.log("Starting preview update...");
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
      console.log("Preview updated successfully");
    } catch (err) {
      console.error("A network error occurred:", err);
    } finally {
      setIsUpdating(false);
    }
  }, [general, education, experience, projects, skills, customSections, isMobile, enhancingId]);

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

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Use event.metaKey for Command key on macOS
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault(); // Prevent browser's save action
            updatePreview();
            break;
          // Ctrl+Z and Ctrl+Y are handled natively by input fields.
          // We don't prevent the default action, so the browser can do its thing.
          case 'z':
          case 'y':
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [updatePreview]); // Re-bind the listener if updatePreview function changes

  const tabs = ["General", "Education", "Experience", "Projects", "Skills", "+"];
  
  const handleStepChange = (newStep) => {
    setStep(newStep);
    setMenuOpen(false);
  };

  const isPreviewStep = step === tabs.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <div className="relative flex flex-col items-center justify-center p-4 sm:p-10">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 hidden lg:flex items-center justify-center overflow-hidden z-0"><div className="w-[120%] h-[90%] rotate-0 animate-slow-zoom border-8 border-yellow-400 dark:border-yellow-600 opacity-20 "></div></div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0"><div className="w-[120%] h-[90%] rotate-90 animate-slow-zoom border-8 border-yellow-400 dark:border-yellow-600 opacity-20"></div></div>
        
        {!showForm ? (
          <div className="relative flex flex-col items-center justify-center h-screen w-full text-center z-10">
            <h1 className="text-[clamp(40px,6vw,100px)] font-abril text-yellow-600 mb-10 font-bold hover:text-yellow-700 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-400">ResumeFlow</h1>
            <p className="mt-10 text-[clamp(20px,2vw,50px)] font-lobster text-yellow-700 text-center italic hover:text-yellow-600 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-800">An AI-powered CV generator that transforms your input into a refined, ATS-optimized resume.</p>
            <button onClick={() => { setShowForm(true); setStep(0); }} className="inline font-dancing font-bold text-white bg-yellow-600 px-6 py-3 rounded-lg border border-solid text-3xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-700 hover:text-gray-50 dark:hover:bg-yellow-400 dark:hover:text-gray-900 dark:bg-yellow-600 dark:text-gray-900">Get Started</button>
          </div>
        ) : (
          <div className="w-full max-w-7xl mx-auto z-10">
            <div className='flex justify-center mb-10'><h2 className="text-[clamp(40px,5vw,100px)] font-abril text-yellow-600 font-bold hover:text-yellow-700 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-400 ">ResumeFlow</h2></div>
            
            <div className="flex flex-col lg:flex-row w-full gap-8">
              {/* --- MAIN CONTENT (LEFT COLUMN / FULL WIDTH ON MOBILE) --- */}
              <div className="w-full lg:w-1/2 p-2">
                {isMobile ? (
                  // --- MOBILE MENU ---
                    <div className="relative mb-4">
                      <button onClick={() => setMenuOpen(!menuOpen)} className="font-bold text-white bg-yellow-600 px-4 py-2 rounded-lg w-full flex justify-between items-center">
                        <span>{tabs[step]}</span>
                        <span>&#9662;</span>
                      </button>
                      {menuOpen && (
                        <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-yellow-600 rounded-b-lg z-20 shadow-lg">
                          {tabs.map((label, index) => (
                            <button key={index} onClick={() => handleStepChange(index)} className="block w-full text-left px-4 py-2 hover:bg-yellow-100 dark:hover:bg-gray-700">
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                ) : (
                  // --- DESKTOP TABS ---
                  <div className="flex space-x-1 font-inknut border-yellow-600 mb-0">
                    {tabs.map((label, index) => (
                      <button key={index} onClick={() => setStep(index)} className={`flex-1 text-center px-3 py-2 rounded-t-lg transition cursor-pointer border-yellow-600 border-r-6 border-2 ${step === index ? "bg-yellow-600 text-white dark:text-black" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-50 hover:text-yellow-700 dark:hover:text-yellow-400"}`}>{label}</button>
                    ))}
                  </div>
                )}
                
                {/* --- RENDER CURRENT SECTION --- */}
                <div className="min-h-[50vh]">
                  {step === 0 && <GeneralInfo data={general} setData={setGeneral} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 1 && <Education data={education} setData={setEducation} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} />}
                  {step === 2 && <Experience data={experience} setData={setExperience} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 3 && <Projects data={projects} setData={setProjects} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 4 && <Skills data={skills} setData={setSkills} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} />}
                  {step === 5 && <CustomSection data={customSections} setData={setCustomSections} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 6 && <Preview general={general} education={education} experience={experience} projects={projects} skills={skills} customSections={customSections} setStep={setStep} />}
                </div>

                {/* --- RESPONSIVE PREVIOUS/NEXT BUTTONS --- */}
                {!isPreviewStep && (
                  <div className="flex justify-between items-center mt-8 pt-4 border-t border-yellow-500/30">
                        <button 
                          onClick={() => setStep(step - 1)}
                          disabled={step === 0}
                          className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:disabled:bg-gray-800"
                        >
                          Previous
                        </button>
                        <button 
                          onClick={() => setStep(step + 1)}
                          className="px-6 py-2 bg-yellow-600 text-white rounded-md font-semibold hover:bg-yellow-700"
                        >
                          Next
                        </button>
                  </div>
                )}
              </div>
              
              {/* --- PDF PREVIEW (RIGHT COLUMN - DESKTOP ONLY) --- */}
              {!isMobile && (
                  <div className="w-1/2 p-6">
                    <div className="sticky top-10 h-[calc(100vh-5rem)] flex flex-col">
                      <h3 className="text-center text-2xl font-lobster text-yellow-600 mb-4">Live Preview</h3>
                      <div className="flex-grow border rounded-lg shadow-inner overflow-hidden">
                          <PdfPreview pdfUrl={pdfUrl} />
                      </div>
                    </div>
                  </div>
              )}
            </div>

            {/* --- GLOBAL DOWNLOAD BUTTON --- */}
            <div className="mt-12 pt-6 border-t-2 border-yellow-500 flex justify-center">
              <button 
                onClick={handleDownloadPDF} 
                className="w-full sm:w-auto text-white bg-blue-600 font-bold px-8 py-3 rounded-full border text-lg cursor-pointer transition-all hover:bg-blue-700 shadow-lg">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;