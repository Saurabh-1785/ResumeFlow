import React from "react";

const Education = ({ data, setData, onSaveChanges, isUpdating }) => {
  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [name]: value } : item))
    );
  };

  const addEducation = () => {
    setData([
      ...data,
      {
        id: Date.now(),
        institution: "",
        place: "",
        study: "",
        grade: "",
        datestart: "",
        dateend: "",
      },
    ]);
  };

  const removeEducation = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xl">
            🎓
          </span>
          Education
        </h2>
        <button
          onClick={addEducation}
          className="px-4 py-2 text-sm font-medium text-yellow-800 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Education
        </button>
      </div>

      <div className="space-y-6">
        {data.map((edu, index) => (
          <div
            key={edu.id}
            className="p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Education #{index + 1}
              </h3>
              {data.length > 1 && (
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Remove education"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                <input
                  type="text"
                  name="institution"
                  placeholder="University Name"
                  value={edu.institution}
                  onChange={(e) => handleChange(e, edu.id)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input
                  type="text"
                  name="place"
                  placeholder="City, Country"
                  value={edu.place}
                  onChange={(e) => handleChange(e, edu.id)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Degree / Field of Study</label>
                <input
                  type="text"
                  name="study"
                  placeholder="Bachelor of Science in CS"
                  value={edu.study}
                  onChange={(e) => handleChange(e, edu.id)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade / GPA</label>
                <input
                  type="text"
                  name="grade"
                  placeholder="3.8/4.0"
                  value={edu.grade}
                  onChange={(e) => handleChange(e, edu.id)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                <input
                  type="text"
                  name="datestart"
                  placeholder="MM/YYYY"
                  value={edu.datestart}
                  onChange={(e) => handleChange(e, edu.id)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                <input
                  type="text"
                  name="dateend"
                  placeholder="MM/YYYY or Present"
                  value={edu.dateend}
                  onChange={(e) => handleChange(e, edu.id)}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {onSaveChanges && (
        <div className="flex justify-end pt-4">
          <button
            onClick={onSaveChanges}
            disabled={isUpdating}
            className="px-6 py-2.5 bg-yellow-800 dark:bg-yellow-600 text-white rounded-xl font-medium hover:bg-yellow-900 dark:hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default Education;