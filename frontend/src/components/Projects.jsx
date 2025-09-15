// frontend/src/components/Projects.jsx

function Projects({ data, setData, setStep, onSaveChanges, isUpdating, enhancingId, onEnhance }) {
  const handleChange = (id, field, value) => {
    const updated = data.map((proj) => proj.id === id ? { ...proj, [field]: value } : proj);
    setData(updated);
  };
  const addProject = () => {
    setData([...data, { id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  };

  const AiEnhanceButton = ({ onClick, isEnhancing, isDisabled }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="text-stone-50 bg-purple-600 font-bold px-4 py-1.5 rounded-lg text-sm cursor-pointer transition-all disabled:bg-gray-400 hover:bg-purple-700 flex items-center gap-2"
    >
      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M30 15.03C21.9538 15.515 15.5125 21.9538 15.0287 30H14.97C14.485 21.9538 8.045 15.515 0 15.03V14.9713C8.04625 14.485 14.485 8.04625 14.97 0H15.0287C15.5137 8.04625 21.9538 14.485 30 14.9713V15.03Z" /></svg>
      {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
    </button>
  );

  return (
    <div className="border md:border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-800 dark:border-yellow-600">
      <h2 className="text-[clamp(25px,5vw,50px)] text-center font-sans font-bold mb-10 p-4 text-yellow-800 dark:text-yellow-600">PROJECT</h2>
      {data.map((proj) => {
        const isCurrentlyEnhancing = enhancingId === proj.id;
        return (
          <div key={proj.id} className="mb-8 border-b pb-6">
            <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => handleChange(proj.id, "name", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
            <input type="text" placeholder="Tech-stack used" value={proj.technology} onChange={(e) => handleChange(proj.id, "technology", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
            
            <div className="mb-10">
              <textarea placeholder="Project Description (one point per line)" value={proj.description} onChange={(e) => handleChange(proj.id, "description", e.target.value)} className="block w-full border p-3 rounded italic text-black dark:bg-black dark:text-stone-50 min-h-[150px]" />
              <div className="flex justify-end mt-2">
                <AiEnhanceButton
                  isEnhancing={isCurrentlyEnhancing}
                  isDisabled={enhancingId !== null && enhancingId !== proj.id}
                  onClick={() => onEnhance(
                    proj.id,
                    "Project Description",
                    proj.description,
                    (newText) => handleChange(proj.id, "description", newText)
                  )}
                />
              </div>
            </div>

            <input type="url" placeholder="Github link" value={proj.url} onChange={(e) => handleChange(proj.id, "url", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
            {data.length > 1 && (<button onClick={() => setData(data.filter((item) => item.id !== proj.id))} className="bg-red-600 text-stone-50 px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700">Delete Project</button>)}
          </div>
        )})}
      <button onClick={addProject} className="inline cursor-pointer text-yellow-800 border-yellow-800 dark:text-yellow-600 dark:border-yellow-600 px-6 py-3 rounded-2xl border text-2xl">+ Add Project</button>
      <div className="mt-8">
          {onSaveChanges && (
            <button 
              onClick={onSaveChanges} 
              disabled={isUpdating} 
              className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-yellow-800 font-bold px-4 py-3 rounded-2xl hover:bg-yellow-700 disabled:bg-gray-400 dark:bg-yellow-600 dark:hover-bg-yellow-700"
            >
              {isUpdating ? 'Updating...' : 'Preview'}
            </button>
          )}
        </div>
    </div>
  );
}
export default Projects;