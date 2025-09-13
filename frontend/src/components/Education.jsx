function Education({ data, setData, setStep, onSaveChanges, isUpdating }) {
  const handleChange = (id, field, value) => {
    const updated = data.map((edu) => edu.id === id ? { ...edu, [field]: value } : edu);
    setData(updated);
  };
  const addEducation = () => {
    setData([...data, { id: Date.now(), institution: "", place: "", study: "", grade: "", datestart: "", dateend: "" }]);
  };

  return (
    <div className="border md:border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-600">
      <h2 className="text-[clamp(25px,4vw,60px)] text-center font-lobster mb-20 p-4 text-yellow-600">Education</h2>
      {data.map((edu) => (
        <div key={edu.id} className="mb-8 border-b pb-6">
          <input type="text" placeholder="Institution Name" value={edu.institution} onChange={(e) => handleChange(edu.id, "institution", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" required />
          <input type="text" placeholder="Place" value={edu.place} onChange={(e) => handleChange(edu.id, "place", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" required />
          <input type="text" placeholder="Title of Study" value={edu.study} onChange={(e) => handleChange(edu.id, "study", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" required />
          <input type="text" placeholder="Grade (optional)" value={edu.grade} onChange={(e) => handleChange(edu.id, "grade", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
          <div className="flex gap-2">
            <input type="number" placeholder="Year Start" value={edu.datestart} onChange={(e) => handleChange(edu.id, "datestart", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" required />
            <input type="number" placeholder="Year End" value={edu.dateend} onChange={(e) => handleChange(edu.id, "dateend", e.target.value)} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" required />
          </div>
          {data.length > 1 && (<button onClick={() => setData(data.filter((item) => item.id !== edu.id))} className="bg-red-600 text-stone-50 px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700">Delete Education</button>)}
        </div>
      ))}
      <button onClick={addEducation} className="inline cursor-pointer text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border text-2xl">+ Add Education</button>
      
      <div className="mt-8">
          {onSaveChanges && (
            <button 
              onClick={onSaveChanges} 
              disabled={isUpdating} 
              className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-yellow-600 font-bold px-4 py-3 rounded-2xl hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {isUpdating ? 'Updating...' : 'Update Preview'}
            </button>
          )}
        </div>
    </div>
  );
}
export default Education;