import { useState } from "react";
import GeneralInfo from "./components/GeneralInfo";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";

function App() {
  const [showForm, setShowForm] = useState(false);

  // form states
  const [general, setGeneral] = useState({
    name: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",});
  const [education, setEducation] = useState({
    institution: "",
    study: "",
    datestart: "",
    dateend: "",});
  const [experience, setExperience] = useState({
    company: "",
    position: "",
    responsibilities: "",
    from: "",
    to: "",
  });
  const [projects, setProjects] = useState({
    name: "",
    technology: "",
    description: "",
    url: "",
  });

  return (
    <div className="flex flex-col items-center justify-center p-10">
      {!showForm ? (
        // Landing Page
        <div className="flex flex-col items-center justify-center h-screen w-full text-center">
          <h1 className="text-[clamp(40px,5vw,100px)] text-yellow-600 mb-10 font-bold">
            CV Application
          </h1>
          <p className="mt-10 text-2xl font-roboto text-center italic">
            User inputs the data in the given form and respected CV would be generated
          </p>
          <button onClick={() => setShowForm(true)} className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-lg border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-20 hover:bg-yellow-600 hover:text-white">
            Get Started
          </button>
        </div>

      ) : (
        // Form Section
        <div className="w-full max-w-3xl">
          <h2 className="text-5xl italic font-bold text-yellow-600 mt-5 text-center">
            Fill Out Your Information
          </h2>

          <GeneralInfo data={general} setData={setGeneral} />
          <Education data={education} setData={setEducation} />
          <Experience data={experience} setData={setExperience} />
          <Projects data={projects} setData={setProjects} />

          <button
            onClick={() => setShowForm(false)}
            className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
