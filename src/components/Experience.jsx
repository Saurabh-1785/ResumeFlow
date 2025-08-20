function Experience({ data, setData, setStep }) {
  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const addExperience = () => {
    setData([...data, { company: "", position: "", responsibilities: "", from: "", to: "" }]);
  };

  const deleteExperience = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  return (
      <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-50 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,3vw,60px)] text-center font-sans font-bold mb-20 p-4 text-yellow-600 italic">Experience</h2>

        {data.map((exp,i)=>(
          <div key = {i} className = "mb-8 border-b pb-6">
            <input
              type="text"
              placeholder="Company Name"
              value={data.company}
              onChange={(e) => {
                const updated = [...data];
                updated[i].company = e.target.value;
                setData(updated);
              }}
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />

            <input
              type="text"
              placeholder="Position Title"
              value={data.position}
              onChange={(e) => {
                const updated = [...data];
                updated[i].position = e.target.value;
                setData(updated);
              }}
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />

            <textarea
              placeholder="Main Responsibilities"
              value={data.responsibilities}
              onChange={(e) => {
                const updated = [...data];
                updated[i].responsibilities = e.target.value;
                setData(updated);
              }}
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />

            <div className="flex gap-2">
              <input
                type="date"
                placeholder="From"
                value={data.from}
                onChange={(e) => {
                  const updated = [...data];
                  updated[i].from = e.target.value;
                  setData(updated);
                }}
                className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
              />
              <input
                type="date"
                placeholder="To"
                value={data.to}
                onChange={(e) => {
                  const updated = [...data];
                  updated[i].to = e.target.value;
                  setData(updated);
                }}
                className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
              />
            </div>

            {/* Show delete button only if more than 1 experience */}
            {data.length > 1 && (
              <button
                onClick={() => deleteExperience(i)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700 transition-all ease-in duration-300"
              >
                Delete Experience
              </button>
            )}
          </div>
        ))}
        
        <button onClick={addExperience} className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white">+ Add Experience</button>

        <div className="flex justify-between mt-3 mb-5">
          <button
            onClick={() => setStep(1)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Previous
          </button>
          <button
            onClick={() => setStep(3)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Next
          </button>
        </div>
      </div>
  );
}

export default Experience;
