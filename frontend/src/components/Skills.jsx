function Skills({ data, setData, setStep, onSaveChanges, isUpdating, onMobilePreview, isMobile }) {
  return (
      <div className="border md:border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-800 dark:border-yellow-600">
        <h2 className="text-[clamp(35px,6vw,55px)] text-center font-sans font-bold mb-20 p-4 text-yellow-800 dark:text-yellow-600">SKILLS</h2>
        <input type="text" placeholder="Languages (Python, JavaScript,...)" value={data.languages} onChange={(e) => setData({ ...data, languages: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
        <input type="text" placeholder="Frameworks (Flask, Tailwind CSS,...)" value={data.frameworks} onChange={(e) => setData({ ...data, frameworks: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
        <input type="text" placeholder="Libraries (React, NumPy,...)" value={data.libraries} onChange={(e) => setData({ ...data, libraries: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
        <input type="text" placeholder="Tools (Git, Github,...)" value={data.tools} onChange={(e) => setData({ ...data, tools: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />
        <input type="text" placeholder="Others (Soft Skills, Certifications,...)" value={data.others} onChange={(e) => setData({ ...data, others: e.target.value })} className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-stone-50" />

        <div className="mt-8 space-y-3">
          {onSaveChanges && (
            <button 
              onClick={onSaveChanges} 
              disabled={isUpdating} 
              className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-yellow-800 font-bold px-4 py-3 rounded-2xl hover:bg-yellow-700 disabled:bg-gray-400 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            >
              {isUpdating ? 'Updating...' : 'Preview'}
            </button>
          )}
          
          {/* Mobile Preview Button */}
          {isMobile && onMobilePreview && (
            <button 
              onClick={onMobilePreview}
              className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-green-600 font-bold px-4 py-3 rounded-2xl hover:bg-green-700"
            >
              Preview Resume
            </button>
          )}
        </div>
      </div>
  );
}
export default Skills;