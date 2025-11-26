import './index.css';
import { useState, useEffect, useCallback } from "react";
import GeneralInfo from "./components/GeneralInfo";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import CustomSection from "./components/CustomSection";
import Preview from "./components/Preview";
import PdfPreview from './components/PdfPreview';
import NavigationBar from './components/NavigationBar';
import SectionOrder from './components/SectionOrder';
import { generateLatex } from "./utils/generateLatex";
import { mapStateToResumeData } from "./utils/resumeMapper";
import { enhanceTextWithAI, generatePdf } from "./services/api";
import TemplateSelector from './components/TemplateSelector';

// --- Main App Component ---
function App() {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState('standard');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [enhancingId, setEnhancingId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // form states
  const [general, setGeneral] = useState({ name: "", email: "", phone: "", github: "", linkedin: "", about: "" });
  const [education, setEducation] = useState([{ id: Date.now(), institution: "", place: "", study: "", grade: "", datestart: "", dateend: "" }]);
  const [experience, setExperience] = useState([{ id: Date.now(), company: "", position: "", responsibilities: "", from: "", to: "" }]);
  const [projects, setProjects] = useState([{ id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  const [skills, setSkills] = useState({ languages: "", frameworks: "", libraries: "", tools: "", others: "" });
  const [customSections, setCustomSections] = useState([]);
  const [sectionOrder, setSectionOrder] = useState([
    { id: 'summary', name: 'Summary', enabled: true },
    { id: 'education', name: 'Education', enabled: true },
    { id: 'skills', name: 'Skills', enabled: true },
    { id: 'projects', name: 'Projects', enabled: true },
    { id: 'experience', name: 'Experience', enabled: true },
    { id: 'custom', name: 'Custom Sections', enabled: true }
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

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
      const enhancedText = await enhanceTextWithAI(currentText, context);
      console.log('Enhancement successful, calling onSuccess');
      onSuccess(enhancedText);
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

    // Pass sectionOrder to the data object
    const data = mapStateToResumeData({ general, education, experience, projects, skills, customSections, sectionOrder });

    const tex = generateLatex(data, templateId);
    try {
      const blob = await generatePdf(tex);
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
  }, [general, education, experience, projects, skills, customSections, sectionOrder, isMobile, enhancingId]); // Add sectionOrder to dependencies

  const handleDownloadPDF = async () => {
    const data = mapStateToResumeData({ general, education, experience, projects, skills, customSections, sectionOrder });
    const tex = generateLatex(data, templateId);
    try {
      const blob = await generatePdf(tex);
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

  const handleDownloadLatex = () => {
    const data = mapStateToResumeData({ general, education, experience, projects, skills, customSections, sectionOrder });
    const tex = generateLatex(data, templateId);

    const blob = new Blob([tex], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.tex";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBackToHome = () => {
    setShowForm(false);
    setStep(0);
  };

  const handleStepChange = (newStep) => {
    setStep(newStep);
    setMobileMenuOpen(false);
  };

  const handleMobilePreview = () => {
    if (isMobile) {
      setStep(7); // Changed from 6 to 7 to go to Preview section
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

  const navItems = [
    { label: "General Info", step: 0 },
    { label: "Education", step: 1 },
    { label: "Experience", step: 2 },
    { label: "Projects", step: 3 },
    { label: "Skills", step: 4 },
    { label: "Custom", step: 5 },
    { label: "Section Order", step: 6 }
  ];

  const isPreviewStep = step === 7;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-gray-900 transition-colors duration-500 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-900">
      {/* Navigation Bar */}
      {showForm && (
        <NavigationBar
          navItems={navItems}
          currentStep={step}
          onNavigate={handleStepChange}
          onDownloadPDF={handleDownloadPDF}
          onDownloadLatex={handleDownloadLatex}
          onBackToHome={handleBackToHome}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />
      )}

      <div className="relative flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 min-h-screen">
        {/* Decorative backgrounds */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-yellow-200/20 dark:bg-yellow-900/10 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        {!showForm ? (
          <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto text-center z-10 animate-fadeIn">
            <button
              onClick={toggleTheme}
              className="absolute top-4 right-4 lg:fixed lg:top-8 lg:right-8 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group z-50"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            <div className="mb-12 relative">
              <div className="absolute -inset-4 bg-yellow-500/20 dark:bg-yellow-500/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-[clamp(3.5rem,8vw,6rem)] font-abril text-yellow-800 dark:text-yellow-500 mb-6 font-bold tracking-tight leading-none drop-shadow-sm">
                ResumeFlow
              </h1>
            </div>

            <p className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-sans font-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12">
              Craft a professional, ATS-optimized resume in minutes with the power of AI.
              <span className="block mt-2 font-medium text-yellow-800 dark:text-yellow-500">Simple. Smart. Effective.</span>
            </p>

            <button
              onClick={() => { setTemplateId('standard'); setShowForm(true); setStep(0); }}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-yellow-800 dark:bg-yellow-600 rounded-full hover:bg-yellow-900 dark:hover:bg-yellow-500 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-yellow-900/30"
            >
              <span className="mr-2">Get Started</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <TemplateSelector onSelect={(id) => { setTemplateId(id); setShowForm(true); setStep(0); }} />
          </div>
        ) : (
          <div className="w-full max-w-[1600px] mx-auto z-10 mt-4 lg:mt-8">
            <div className="flex flex-col lg:flex-row w-full gap-8 xl:gap-12">
              {/* --- MAIN CONTENT (LEFT COLUMN / FULL WIDTH ON MOBILE) --- */}
              <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col">
                {/* --- RENDER CURRENT SECTION --- */}
                <div className="flex-grow bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 transition-all duration-300">
                  {step === 0 && <GeneralInfo data={general} setData={setGeneral} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 1 && <Education data={education} setData={setEducation} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} />}
                  {step === 2 && <Experience data={experience} setData={setExperience} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 3 && <Projects data={projects} setData={setProjects} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                  {step === 4 && <Skills data={skills} setData={setSkills} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} onMobilePreview={handleMobilePreview} isMobile={isMobile} />}
                  {step === 5 && <CustomSection data={customSections} setData={setCustomSections} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} onMobilePreview={handleMobilePreview} isMobile={isMobile} />}
                  {step === 6 && <SectionOrder sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} />}
                  {step === 7 && <Preview general={general} education={education} experience={experience} projects={projects} skills={skills} customSections={customSections} setStep={setStep} onDownloadPDF={handleDownloadPDF} onDownloadLatex={handleDownloadLatex} />}
                </div>

                {/* --- RESPONSIVE PREVIOUS/NEXT BUTTONS --- */}
                {!isPreviewStep && (
                  <div className="flex justify-between items-center mt-6 px-2">
                    <button
                      onClick={step === 0 ? handleBackToHome : () => setStep(step - 1)}
                      className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      {step === 0 ? 'Back' : 'Previous'}
                    </button>
                    <button
                      onClick={() => setStep(step + 1)}
                      className="px-8 py-3 rounded-xl font-semibold text-white bg-yellow-800 dark:bg-yellow-600 hover:bg-yellow-900 dark:hover:bg-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-900/20 hover:shadow-yellow-900/40 hover:-translate-y-0.5 flex items-center gap-2"
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* --- PDF PREVIEW (RIGHT COLUMN - DESKTOP ONLY) --- */}
              {!isMobile && (
                <div className="w-1/2 xl:w-7/12 hidden lg:block">
                  <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col">
                    <div className="flex-grow bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative group">
                      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
                      <PdfPreview pdfUrl={pdfUrl} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;