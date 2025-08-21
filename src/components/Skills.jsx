function Skills({ data, setData, setStep }) {
  return (
      <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-50 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,3vw,60px)] text-center font-sans font-bold mb-20 p-4 text-yellow-600 italic">Skills</h2>

        <input type="text" placeholder="Languages (Python, JavaScript,....)"
          value={data.languages}
          onChange={(e) => setData({ ...data, languages: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white"
        />

        <input type="text" placeholder="Frameworks (Flask, Tailwind CSS,....)"
          value={data.frameworks}
          onChange={(e) => setData({ ...data, frameworks: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white"
        />

        <input type="text" placeholder="Libraries (React, NumPy,....)"
          value={data.libraries}
          onChange={(e) => setData({ ...data, libraries: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white"
        />

        <input type="text" placeholder="Tools (Git,Github,....)"
          value={data.tools}
          onChange={(e) => setData({ ...data, tools: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white"
        />

        <input type="text" placeholder="Others (Soft Skills, Certifications,....)"
          value={data.others}
          onChange={(e) => setData({ ...data, others: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic text-black dark:bg-black dark:text-white"
        />

        <div className="flex justify-between m  t-3 mb-5">
          <button
            onClick={() => setStep(3)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Previous
          </button>
          <button
            onClick={() => alert("form filled!!!Kindly preview")}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Preview
          </button>
        </div>
      </div>
  );
}
export default Skills;
