function Projects({ data, setData, setStep, onSaveChanges, isUpdating }) {
  const handleChange = (id, field, value) => {
    const updated = data.map((proj) => proj.id === id ? { ...proj, [field]: value } : proj);
    setData(updated);
  };
  const addProject = () => {
    setData([...data, { id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  };

  return (
    <div className="border border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-600">
      <h2 className="text-[clamp(25px,4vw,60px)] text-center font-lobster mb-10 p-4 text-yellow-600">Projects</h2>
      {data.map((proj) => (
        <div key={proj.id} className="mb-8 border-b pb-6">
          <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => handleChange(proj.id, "name", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
          <input type="text" placeholder="Tech-stack used" value={proj.technology} onChange={(e) => handleChange(proj.id, "technology", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
          <textarea placeholder="Project Description" value={proj.description} onChange={(e) => handleChange(proj.id, "description", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
          <input type="url" placeholder="Github link" value={proj.url} onChange={(e) => handleChange(proj.id, "url", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
          {data.length > 1 && (<button onClick={() => setData(data.filter((item) => item.id !== proj.id))} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700">Delete Project</button>)}
        </div>
      ))}
      <button onClick={addProject} className="inline cursor-pointer text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border text-2xl">+ Add Project</button>
      
      <div className="text-center border-t-2 border-yellow-500 pt-4 mt-6">
        <button onClick={onSaveChanges} disabled={isUpdating} className="text-white bg-green-600 font-bold px-10 py-3 rounded-3xl border text-xl cursor-pointer transition-all disabled:bg-gray-400 hover:bg-green-700">
          {isUpdating ? 'Updating...' : 'Update Preview'}
        </button>
      </div>

      <div className="flex justify-between mt-3 mb-5">
        <button onClick={() => setStep(2)} className="text-white cursor-pointer bg-yellow-600 font-bold px-10 py-2 rounded-3xl border text-xl">Previous</button>
        <button onClick={() => setStep(4)} className="text-white cursor-pointer bg-yellow-600 font-bold px-10 py-2 rounded-3xl border text-xl">Next</button>
      </div>
    </div>
  );
}
export default Projects;