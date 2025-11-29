import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import NavigationBar from '../components/NavigationBar';
import TemplateSelector from '../components/TemplateSelector';
import { generateLatex } from "../utils/generateLatex";
import { mapStateToResumeData } from "../utils/resumeMapper";
import { enhanceTextWithAI, generatePdf } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

// Lazy load heavy components for code splitting
const GeneralInfo = lazy(() => import("../components/GeneralInfo"));
const Education = lazy(() => import("../components/Education"));
const Experience = lazy(() => import("../components/Experience"));
const Projects = lazy(() => import("../components/Projects"));
const Skills = lazy(() => import("../components/Skills"));
const CustomSection = lazy(() => import("../components/CustomSection"));
const Preview = lazy(() => import("../components/Preview"));
const PdfPreview = lazy(() => import('../components/PdfPreview'));
const SectionOrder = lazy(() => import('../components/SectionOrder'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-800 dark:border-yellow-500"></div>
    </div>
);

const Dashboard = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(0);
    const [templateId, setTemplateId] = useState(location.state?.templateId || 'standard');
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
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

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

    const handleEnhanceWithAI = async (id, context, currentText, onSuccess) => {
        if (!currentText || currentText.trim() === "") {
            alert("Please enter some text before enhancing.");
            return;
        }

        setEnhancingId(id);

        try {
            const enhancedText = await enhanceTextWithAI(currentText, context);
            onSuccess(enhancedText);
        } catch (err) {
            console.error("Error enhancing text:", err);
            alert(`Enhancement failed: ${err.message}`);
        } finally {
            setEnhancingId(null);
        }
    };

    const updatePreview = useCallback(async () => {
        if (isMobile) return; // Disable on mobile
        if (!general.name || general.name.trim() === "") {
            setPdfUrl(null);
            return;
        }

        // Prevent preview update if AI is enhancing
        if (enhancingId !== null) {
            return;
        }

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
        } catch (err) {
            console.error("A network error occurred:", err);
        } finally {
            setIsUpdating(false);
        }
    }, [general, education, experience, projects, skills, customSections, sectionOrder, isMobile, enhancingId, templateId]);

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
        navigate('/');
    };

    const handleStepChange = (newStep) => {
        setStep(newStep);
        setMobileMenuOpen(false);
    };

    const handleMobilePreview = () => {
        if (isMobile) {
            setStep(7);
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
            if (event.ctrlKey || event.metaKey) {
                switch (event.key.toLowerCase()) {
                    case 's':
                        event.preventDefault();
                        updatePreview();
                        break;
                    default:
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [updatePreview]);

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

    if (loading) return <LoadingFallback />;

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-gray-900 transition-colors duration-500 font-sans selection:bg-yellow-200 dark:selection:bg-yellow-900">
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
                user={user}
                logout={logout}
            />

            <div className="relative flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 min-h-screen pt-24">
                {/* Decorative backgrounds */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-yellow-200/20 dark:bg-yellow-900/10 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                </div>

                <div className="w-full max-w-[1600px] mx-auto z-10">
                    <div className="flex flex-col lg:flex-row w-full gap-8 xl:gap-12">
                        {/* --- MAIN CONTENT (LEFT COLUMN / FULL WIDTH ON MOBILE) --- */}
                        <div className="w-full lg:w-1/2 xl:w-5/12 flex flex-col">
                            {/* --- RENDER CURRENT SECTION --- */}
                            <div className="flex-grow bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20 dark:border-gray-700/30 transition-all duration-300">
                                <Suspense fallback={<LoadingFallback />}>
                                    {step === 0 && <GeneralInfo data={general} setData={setGeneral} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                                    {step === 1 && <Education data={education} setData={setEducation} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} />}
                                    {step === 2 && <Experience data={experience} setData={setExperience} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                                    {step === 3 && <Projects data={projects} setData={setProjects} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} />}
                                    {step === 4 && <Skills data={skills} setData={setSkills} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} onMobilePreview={handleMobilePreview} isMobile={isMobile} />}
                                    {step === 5 && <CustomSection data={customSections} setData={setCustomSections} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} enhancingId={enhancingId} onEnhance={handleEnhanceWithAI} onMobilePreview={handleMobilePreview} isMobile={isMobile} />}
                                    {step === 6 && <SectionOrder sectionOrder={sectionOrder} setSectionOrder={setSectionOrder} onSaveChanges={!isMobile ? updatePreview : undefined} isUpdating={isUpdating} />}
                                    {step === 7 && <Preview general={general} education={education} experience={experience} projects={projects} skills={skills} customSections={customSections} setStep={setStep} onDownloadPDF={handleDownloadPDF} onDownloadLatex={handleDownloadLatex} />}
                                </Suspense>
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
                                        <Suspense fallback={<LoadingFallback />}>
                                            <PdfPreview pdfUrl={pdfUrl} />
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
