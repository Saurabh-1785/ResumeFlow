function Projects({ data, setData }) {
  return (
    <div className="flex justify-center items-center flex-col p-5 min-h-screen">
      <div className="border h-screen p-5 rounded-lg w-full max-w-full m-50 border-yellow-600">
        <h2 className="text-4xl text-center font-mono font-bold m-10 p-4 text-yellow-600 italic">Projects</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={data.company}
          onChange={(e) => setData({ ...data, company: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <input
          type="text"
          placeholder="Tech-stack used"
          value={data.position}
          onChange={(e) => setData({ ...data, position: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <textarea
          placeholder="Project Description"
          value={data.responsibilities}
          onChange={(e) => setData({ ...data, responsibilities: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />
        <input
          type="url"
          placeholder="Github link"
          value={data.position}
          onChange={(e) => setData({ ...data, position: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600"
        />

        <button className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white">+ Add Project</button>

        <div className="flex justify-between mt-3">
          <button className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5  hover:bg-white hover:text-yellow-600">Previous</button>
          <button className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">Next</button>
        </div>
      </div>
    </div>
  );
}

export default Projects;
