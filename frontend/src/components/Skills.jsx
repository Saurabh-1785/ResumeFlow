function Skills({ data, setData, setStep, onSaveChanges, isUpdating }) {
  return (
      <div className="border md:border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,4vw,60px)] text-center font-lobster mb-20 p-4 text-yellow-600">Skills</h2>
        <input type="text" placeholder="Languages (Python, JavaScript,...)" value={data.languages} onChange={(e) => setData({ ...data, languages: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
        <input type="text" placeholder="Frameworks (Flask, Tailwind CSS,...)" value={data.frameworks} onChange={(e) => setData({ ...data, frameworks: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
        <input type="text" placeholder="Libraries (React, NumPy,...)" value={data.libraries} onChange={(e) => setData({ ...data, libraries: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
        <input type="text" placeholder="Tools (Git, Github,...)" value={data.tools} onChange={(e) => setData({ ...data, tools: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />
        <input type="text" placeholder="Others (Soft Skills, Certifications,...)" value={data.others} onChange={(e) => setData({ ...data, others: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white" />

        <div className="text-center border-t-2 border-yellow-500 pt-4 mt-6">
          <button onClick={onSaveChanges} disabled={isUpdating} className="text-white bg-green-600 font-bold px-10 py-3 rounded-3xl border text-xl cursor-pointer transition-all disabled:bg-gray-400 hover:bg-green-700">
            {isUpdating ? 'Updating...' : 'Update Preview'}
          </button>
        </div>
      </div>
  );
}
export default Skills;