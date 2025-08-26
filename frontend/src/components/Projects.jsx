function Projects({ data, setData, setStep }) {
  const handleChange = (id, field, value) => {
    const updated = data.map((proj) =>
      proj.id === id ? { ...proj, [field]: value } : proj
    );
    setData(updated);
  };

  const addProject = () => {
    setData([...data, {id: Date.now(), name: "", technology: "", description: "", url: "" }]);
  };

  const deleteProject = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };
  return (
      <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-50 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,3vw,60px)] text-center font-sans font-bold mb-10 p-4 text-yellow-600 italic">Projects</h2>

        {data.map((proj, i) => (
          <div key={proj.id} className="mb-8 border-b pb-6">
            <input
              type="text"
              placeholder="Project Name"
              value={proj.name}
              onChange={(e) => 
                handleChange(proj.id, "name", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />
            <input
              type="text"
              placeholder="Tech-stack used"
              value={proj.technology}
              onChange={(e) => 
                handleChange(proj.id, "technology", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />
            <textarea
              placeholder="Project Description"
              value={proj.description}
              onChange={(e) => 
                handleChange(proj.id, "description", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />
            <input
              type="url"
              placeholder="Github link"
              value={proj.url}
              onChange={(e) => 
                handleChange(proj.id, "url", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />
            {/* Show delete button only if more than 1 project */}
            {data.length > 1 && (
              <button
                onClick={() => {
                  const updated = data.filter((item) => item.id !== proj.id);
                  setData(updated);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700 transition-all ease-in duration-300"
              >
                Delete Project
              </button>
            )}
          </div>
        ))}

        <button onClick={addProject} className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white">+ Add Project</button>

        <div className="flex justify-between mt-3 mb-5">
          <button
            onClick={() => setStep(2)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Previous
          </button>
          <button
            onClick={() => setStep(4)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Next
          </button>
        </div>

      </div>
  );
}

export default Projects;
