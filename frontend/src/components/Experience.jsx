function Experience({ data, setData, setStep, onSaveChanges, isUpdating }) {
  const handleChange = (id, field, value) => {
    const updated = data.map((exp) => exp.id === id ? { ...exp, [field]: value } : exp);
    setData(updated);
  };
  const addExperience = () => {
    setData([...data, { id: Date.now(), company: "", position: "", responsibilities: "", from: "", to: "" }]);
  };

  return (
    <div className="border border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-600">
      <h2 className="text-[clamp(25px,4vw,60px)] text-center font-lobster mb-20 p-4 text-yellow-600">Experience</h2>
      {data.map((exp) => (
        <div key={exp.id} className="mb-8 border-b pb-6">

          <input type="text" placeholder="Company Name" value={exp.company} onChange={(e) => handleChange(exp.id, "company", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />

          <input type="text" placeholder="Position Title" value={exp.position} onChange={(e) => handleChange(exp.id, "position", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />

          <textarea placeholder="Main Responsibilities" value={exp.responsibilities} onChange={(e) => handleChange(exp.id, "responsibilities", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />

          <div className="flex gap-2">
            
            <input type="text" placeholder="From" value={exp.from} onChange={(e) => handleChange(exp.id, "from", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />

            <input type="text" placeholder="To" value={exp.to} onChange={(e) => handleChange(exp.id, "to", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
          </div>
          {data.length > 1 && (<button onClick={() => setData(data.filter((item) => item.id !== exp.id))} className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700">Delete Experience</button>)}
        </div>
      ))}
      <button onClick={addExperience} className="inline cursor-pointer text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border text-2xl">+ Add Experience</button>

      <div className="text-center border-t-2 border-yellow-500 pt-4 mt-6">
        <button onClick={onSaveChanges} disabled={isUpdating} className="text-white bg-green-600 font-bold px-10 py-3 rounded-3xl border text-xl cursor-pointer transition-all disabled:bg-gray-400 hover:bg-green-700">
          {isUpdating ? 'Updating...' : 'Update Preview'}
        </button>
      </div>

      <div className="flex justify-between mt-3 mb-5">
        <button onClick={() => setStep(1)} className="text-white cursor-pointer bg-yellow-600 font-bold px-10 py-2 rounded-3xl border text-xl">Previous</button>
        <button onClick={() => setStep(3)} className="text-white cursor-pointer bg-yellow-600 font-bold px-10 py-2 rounded-3xl border text-xl">Next</button>
      </div>
    </div>
  );
}
export default Experience;