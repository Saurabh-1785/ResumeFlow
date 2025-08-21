import { useState } from "react";
import GeneralInfo from "./components/GeneralInfo";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills"
import ThemeToggle from "./components/ThemeToggle";

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
  });
  const [education, setEducation] = useState({
    institution: "",
    study: "",
    datestart: "",
    dateend: "",
  });
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
    tools: "" 
  });

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors">
      <ThemeToggle />
      <div className="flex flex-col items-center justify-center p-10">
        {!showForm ? (
          // Landing Page
          <div className="flex flex-col items-center justify-center h-screen w-full text-center">
            <h1 className="text-[clamp(40px,5vw,100px)] text-yellow-600 mb-10 font-bold">
              CV Application
            </h1>
            <p className="mt-10 text-[clamp(20px,2vw,50px)] font-roboto text-center italic">
              User inputs the data in the given form and respected CV would be generated
            </p>
            <button
              onClick={() => { setShowForm(true); setStep(0); }}
              className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-lg border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-600 hover:text-white"
            >
              Get Started
            </button>
          </div>
        ) : (
          // Form Section
          <div className="w-full max-w-3xl">
            <h2 className="text-5xl text-[clamp(20px,4vw,100px)] border-yellow-600 border-2 border-r-20 rounded-tr-4xl rounded-bl-4xl p-5 font-bold text-yellow-600 mt-5 text-center font-serif">
              CV APPLICATION
            </h2>

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
        )}
      </div>
    </div>
  );
}

export default App;
