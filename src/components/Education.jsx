function Education({ data, setData, setStep }) {
  const handleChange = (id, field, value) => {
    const updated = data.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setData(updated);
  };

  const addEducation = () => {
    setData([
      ...data,
      { id: Date.now(), institution: "", place: "", study: "", grade: "", datestart: "", dateend: ""}]);
  };

  const deleteEducation = (index) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  return (
      <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-50 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,3vw,60px)] text-center font-sans font-bold mb-20 p-4 text-yellow-600 italic">Education</h2>

        {data.map((edu,i)=>(
          <div key = {edu.id} className = "mb-8 border-b pb-6">
            <input
              type="text"
              placeholder="Institution Name"
              value={edu.institution}
              onChange={(e) => 
                handleChange(edu.id, "institution", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />
            
            <input
              type="text"
              placeholder="Place"
              value={edu.place}
              onChange={(e) => 
                handleChange(edu.id, "place", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />

            <input
              type="text"
              placeholder="title of Study"
              value={edu.study}
              onChange={(e) => 
                handleChange(edu.id, "study", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />

            <input
              type="text"
              placeholder="Grade"
              value={edu.grade}
              onChange={(e) => 
                handleChange(edu.id, "grade", e.target.value)
              }
              className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
            />

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Year Start"
                value={edu.datestart}
                onChange={(e) => 
                  handleChange(edu.id, "datestart", e.target.value)
                }
                className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
              />
              <input
                type="number"
                placeholder="Year End"
                value={edu.dateend}
                onChange={(e) => 
                  handleChange(edu.id, "dateend", e.target.value)
                }
                className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
              />
            </div>

            {/* Show delete button only if more than 1 experience */}
            {data.length > 1 && (
              <button
                onClick={() => {
                  const updated = data.filter((item) => item.id !== edu.id);
                  setData(updated);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg mt-3 cursor-pointer hover:bg-red-700 transition-all ease-in duration-300"
              >
                Delete Education
              </button>
            )}
          </div>
        ))}
        
        <button onClick={addEducation} className="inline text-yellow-600 border-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-yellow-600 hover:text-white">+ Add Education</button>

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

