function Education({ data, setData }) {
  return (
    <div className="flex justify-center items-center flex-col p-5 min-h-screen">
      <div className="border h-screen p-5 rounded-lg w-full max-w-full m-50 border-yellow-600">
        <h2 className="text-4xl text-center font-mono font-bold m-10 p-4 text-yellow-600 italic">Education</h2>
        <input
          type="text"
          placeholder="Institution Name"
          value={data.school}
          onChange={(e) => setData({ ...data, school: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <input
          type="text"
          placeholder="Title of Study (e.g., BSc, MSc)"
          value={data.study}
          onChange={(e) => setData({ ...data, study: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <input
          type="text"
          placeholder="Starting year"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <input
          type="text"
          placeholder="Ending year"
          value={data.date}
          onChange={(e) => setData({ ...data, date: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <button className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white">+ Add Education</button>

        <div className="flex justify-between mt-3">
          <button className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5  hover:bg-white hover:text-yellow-600">Previous</button>
          <button className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">Next</button>
        </div>
      

      </div>

    </div>
  );
}

export default Education;
