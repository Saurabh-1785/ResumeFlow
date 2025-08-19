function Education({ data, setData, setStep }) {
  return (
      <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-50 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,3vw,60px)] text-center font-sans font-bold mb-20 p-4 text-yellow-600 italic">Education</h2>

        <input type="text" placeholder="Institution Name"
          value={data.institution}
          onChange={(e) => setData({ ...data, institution: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic"
        />

        <input type="text" placeholder="Title of Study"
          value={data.study}
          onChange={(e) => setData({ ...data, study: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic"
        />

        <input type="text" placeholder="Starting year"
          value={data.datestart}
          onChange={(e) => setData({ ...data, datestart: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic"
        />

        <input type="text" placeholder="Ending year"
          value={data.dateend}
          onChange={(e) => setData({ ...data, dateend: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic"
        />

        <div className="flex justify-between mt-3 mb-5">
          <button
            onClick={() => setStep(0)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Previous
          </button>
          <button
            onClick={() => setStep(2)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Next
          </button>
        </div>
      </div>
  );
}
export default Education;
