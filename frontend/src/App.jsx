import './index.css';
import { useState, useEffect } from "react";
import GeneralInfo from "./components/GeneralInfo";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills"
import ThemeToggle from "./components/ThemeToggle";
import Preview from "./components/Preview";
import { generateLatex } from "./utils/generateLatex";

function App() {
  const [showForm, setShowForm] = useState(false);

  // Step state (0 = General, 1 = Education, 2 = Experience, 3 = Projects)
  const [step, setStep] = useState(0);

  // form states
  const [general, setGeneral] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    about: "",
  });
  const [education, setEducation] = useState([
    { id: Date.now(), institution: "", place: "", study: "",grade: "", datestart: "", dateend: ""}
  ]);
  const [experience, setExperience] = useState([
    { id: Date.now(), company: "", position: "", responsibilities: "", from: "", to: "" }
  ]);
  const [projects, setProjects] = useState([
    { id: Date.now(), name: "", technology: "", description: "", url: "" }
  ]);
  const [skills, setSkills] = useState({ 
    languages: "", 
    frameworks: "", 
    libraries: "", 
    tools: "",
    others: ""
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <ThemeToggle />
      <div className="relative flex flex-col items-center justify-center p-10">
        {/* Diamond Shape */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center overflow-hidden z-0">
          <div className="w-[120%] h-[90%] rotate-0 animate-slow-zoom border-8 border-yellow-400 dark:border-yellow-600 opacity-20 ">
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
          <div className="w-[120%] h-[90%] rotate-90 animate-slow-zoom border-8 border-yellow-400 dark:border-yellow-600 opacity-20">
          </div>
        </div>

        {!showForm ? (
          // Landing Page
          <div className="relative flex flex-col items-center justify-center h-screen w-full text-center z-10">
            <h1 className="text-[clamp(40px,6vw,100px)] font-abril text-yellow-600 mb-10 font-bold hover:text-yellow-700 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-400">
              ResumeFlow
            </h1>
            <p className="mt-10 text-[clamp(20px,2vw,50px)] font-lobster text-yellow-700 text-center italic hover:text-yellow-600 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-800">
              An AI-powered CV generator with LaTeX-quality design that transforms your input into a refined, ATS-optimized resume for maximum impact.
            </p>
            <button
              onClick={() => { setShowForm(true); setStep(0); }}
              className="inline font-dancing font-bold text-white bg-yellow-600 px-6 py-3 rounded-lg border border-solid text-3xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-700 hover:text-gray-50 dark:hover:bg-yellow-400 dark:hover:text-gray-900
              dark:bg-yellow-600 dark:text-gray-900"
            >
              Get Started
            </button>
          </div>
        ) : (
          // Form Section
          
          <div className="w-full z-10">
            <div className='flex justify-center mb-10'>
              <h2 className="text-[clamp(40px,5vw,100px)] font-abril text-yellow-600 mb-10 font-bold hover:text-yellow-700 transition-all ease-in duration-300 cursor-pointer dark:hover:text-yellow-400 ">
                ResumeFlow
              </h2>
            </div>
            

            <div className="flex w-full min-h-screen">

              {/* Tabs*/}
              <div className="w-1/2 p-6">
                <div className="flex space-x-1 font-inknut border-yellow-600 mb-0">
                  {["General", "Education", "Experience", "Projects", "Skills"].map((label, index) => (
                    <button
                      key={index}
                      onClick={() => setStep(index)}
                      className={`flex-1 text-center px-3 py-2 rounded-t-lg transition cursor-pointer border-yellow-600 border-r-6 border-2 ${
                        step === index
                          ? "bg-yellow-600 text-white dark:text-black"
                          : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-50 hover:text-yellow-700 dark:hover:text-yellow-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {/*Active Form*/ }
        
                {step === 0 && (
                  <GeneralInfo data={general} setData={setGeneral} setStep={setStep} setShowForm={setShowForm} />
                )}
                {step === 1 && (
                  <Education data={education} setData={setEducation} setStep={setStep} />
                )}
                {step === 2 && (
                  <Experience data={experience} setData={setExperience} setStep={setStep} />
                )}
                {step === 3 && (
                  <Projects data={projects} setData={setProjects} setStep={setStep} />
                )}
                {step === 4 && (
                  <Skills data={skills} setData={setSkills} setStep={setStep} />
                )}
              </div>

              {/* Preview Section (Live PDF) */}
              <div className="w-1/2 p-6 overflow-y-auto">
                <iframe
                  src="http://localhost:5000/resume.pdf"
                  title="Live CV Preview"
                  className="w-full h-full border rounded-lg shadow"
                ></iframe>
                
              </div>
            </div>
            <div className="flex justify-center">
              <button className="flex text-center gap-1 font-bold font-dancing text-yellow-600 border-yellow-600 px-6 py-3 rounded-lg border border-solid text-2xl cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-600 hover:text-white dark:hover:text-black">
                <svg
                  className="w-7 h-7 fill-current transition-colors duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 30 30"
                >
                  <g clipPath="url(#clip0_56_10)">
                    <path d="M30 15.03C21.9538 15.515 15.5125 21.9538 15.0287 30H14.97C14.485 21.9538 8.045 15.515 0 15.03V14.9713C8.04625 14.485 14.485 8.04625 14.97 0H15.0287C15.5137 8.04625 21.9538 14.485 30 14.9713V15.03Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0_56_10">
                      <rect width="30" height="30" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Enhance pdf
              </button>


            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
