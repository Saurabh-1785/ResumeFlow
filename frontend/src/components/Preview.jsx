// frontend/src/components/Preview.jsx

// No need for generateLatex or useState here anymore

function Preview({ general, education, experience, projects, skills, customSections, setStep }) {

  return (
    <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-10 mb-10 w-full max-w-3xl border-yellow-600">
      <h2 className="text-[clamp(25px,3vw,60px)] text-center font-bold mb-10 p-4 text-yellow-600 italic">TEXT PREVIEW</h2>
      <p className="text-center text-sm text-gray-500 -mt-10 mb-6">This is a simple text preview. The final formatting is in the PDF.</p>
      <hr className="mb-6 text-yellow-600" />

      {/* General Info */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">General Info</h3>
        <p><strong>Name:</strong> {general.name}</p>
        <p><strong>Email:</strong> {general.email}</p>
        <p><strong>Phone:</strong> {general.phone}</p>
        {general.github && <p><strong>Github:</strong> {general.github}</p>}
        {general.linkedin && <p><strong>LinkedIn:</strong> {general.linkedin}</p>}
        <p><strong>About:</strong> {general.about}</p>
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Education */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Education</h3>
        {education.map((edu, i) => (<div key={i} className="mb-3"><p><strong>Institution:</strong> {edu.institution}</p></div>))}
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Experience */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Experience</h3>
        {experience.map((exp, i) => (<div key={i} className="mb-3"><p><strong>Company:</strong> {exp.company}</p></div>))}
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Projects */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Projects</h3>
        {projects.map((proj, i) => (<div key={i} className="mb-3"><p><strong>Name:</strong> {proj.name}</p></div>))}
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Skills */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Skills</h3>
        <p><strong>Languages:</strong> {skills.languages}</p>
      </div>

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="mb-6 italic overflow-auto">
          <hr className="mb-6 text-yellow-600" />
          {customSections.map(section => (
            section.title && <div key={section.id} className="mb-4">
              <h3 className="text-2xl mb-3 font-semibold text-yellow-600">{section.title}</h3>
              {section.content.map(item => (
                <div key={item.id} className="pl-4 mb-2">
                  {item.type === 'subheading' ? (
                    <div>
                      <p><strong>{item.primary}</strong></p>
                      <p className="pl-4">{item.quaternary || item.text}</p>
                    </div>
                  ) : (
                    <p>- {item.text}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center mt-6">
        <button onClick={() => setStep(0)} className="text-stone-50 bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-stone-50 hover:text-yellow-600">Back to Editor</button>
      </div>
    </div>
  );
}

export default Preview;