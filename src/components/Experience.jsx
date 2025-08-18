function Experience({ data, setData }) {
  return (
    <div className="flex justify-center items-center flex-col p-5 min-h-screen">
      <div className="border h-screen p-5 rounded-lg w-full max-w-full m-50 border-yellow-600">
        <h2 className="text-4xl text-center font-mono font-bold m-10 p-4 text-yellow-600 italic">Experience</h2>
        <input
          type="text"
          placeholder="Company Name"
          value={data.company}
          onChange={(e) => setData({ ...data, company: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <input
          type="text"
          placeholder="Position Title"
          value={data.position}
          onChange={(e) => setData({ ...data, position: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <textarea
          placeholder="Main Responsibilities"
          value={data.responsibilities}
          onChange={(e) => setData({ ...data, responsibilities: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <div className="flex gap-2">
          <input
            type="date"
            placeholder="From"
            value={data.from}
            onChange={(e) => setData({ ...data, from: e.target.value })}
            className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
          />
          <input
            type="date"
            placeholder="To"
            value={data.to}
            onChange={(e) => setData({ ...data, to: e.target.value })}
            className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
          />
        </div>
        <button className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white">+ Add Experience</button>

        <div className="flex justify-between mt-3">
          <button className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5  hover:bg-white hover:text-yellow-600">Previous</button>
          <button className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">Next</button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
