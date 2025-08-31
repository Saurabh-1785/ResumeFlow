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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // form states
  const [general, setGeneral] = useState({ name: "", email: "", phone: "", github: "", linkedin: "", about: "" });
  const [education, setEducation] = useState([{ id: Date.now(), institution: "", place: "", study: "", grade: "", datestart: "", dateend: "" }]);
  const [experience, setExperience] = useState([{ id: Date.now(), company: "", position: "", responsibilities: "", from: "", to: "" }]);
  const [projects, setProjects] = useState([{ id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  const [skills, setSkills] = useState({ languages: "", frameworks: "", libraries: "", tools: "", others: "" });
  const [customSections, setCustomSections] = useState([]);

  const updatePreview = useCallback(async () => {
    // --- NEW VALIDATION CHECK ---
    // If there's no name, don't try to generate a PDF.
    if (!general.name || general.name.trim() === "") {
        console.log("Validation failed: Name is required to generate a preview.");
        setPdfUrl(null); // Ensure the placeholder message is shown
        return;
    }
    
    setIsUpdating(true);
    const data = {
      generalInfo: general,
      education: education.map(e => ({ school: e.institution, location: e.place, degree: `${e.study} - ${e.grade}`, date: `${e.datestart} -- ${e.dateend}` })),
      experience: experience.map(exp => ({ company: exp.company, position: exp.position, description: exp.responsibilities, date: `${exp.from} -- ${exp.to}`, location: "" })),
      projects: projects.map(p => ({ name: p.name, tech: p.technology, description: p.description, link: p.url, date: "" })),
      skills: skills,
      customSections: customSections
    };
    const tex = generateLatex(data);

    try {
      const response = await fetch("http://localhost:5000/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("PDF Generation FAILED on the server. Server says:", errorText);
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

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const tabs = ["General", "Education", "Experience", "Projects", "Skills", "+"];
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <div className="relative flex flex-col items-center justify-center p-10">
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
                {step === 0 && <GeneralInfo data={general} setData={setGeneral} setStep={setStep} setShowForm={setShowForm} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 1 && <Education data={education} setData={setEducation} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 2 && <Experience data={experience} setData={setExperience} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 3 && <Projects data={projects} setData={setProjects} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 4 && <Skills data={skills} setData={setSkills} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 5 && <CustomSection data={customSections} setData={setCustomSections} setStep={setStep} onSaveChanges={updatePreview} isUpdating={isUpdating} />}
                {step === 6 && <Preview general={general} education={education} experience={experience} projects={projects} skills={skills} customSections={customSections} setStep={setStep} />}
              </div>
              
              <div className="w-1/2 p-6 flex flex-col">
                 <h3 className="text-center text-2xl font-lobster text-yellow-600 mb-4">Live Preview</h3>
                 <div className="flex-grow border rounded-lg shadow-inner overflow-hidden">
                    <PdfPreview pdfUrl={pdfUrl} />
                 </div>
              </div>

            </div>
            <div className="flex justify-center"><button className="flex text-center gap-1 font-bold font-dancing text-yellow-600 border-yellow-600 px-6 py-3 rounded-lg border border-solid text-2xl cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-600 hover:text-white dark:hover:text-black"><svg className="w-7 h-7 fill-current transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><g clipPath="url(#clip0_56_10)"><path d="M30 15.03C21.9538 15.515 15.5125 21.9538 15.0287 30H14.97C14.485 21.9538 8.045 15.515 0 15.03V14.9713C8.04625 14.485 14.485 8.04625 14.97 0H15.0287C15.5137 8.04625 21.9538 14.485 30 14.9713V15.03Z" /></g><defs><clipPath id="clip0_56_10"><rect width="30" height="30" fill="white" /></clipPath></defs></svg>Enhance pdf</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;