import React from "react";

const Skills = ({ data, setData, onSaveChanges, isUpdating, onMobilePreview, isMobile }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xl">
            🛠️
          </span>
          Skills
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Languages</label>
          <input
            type="text"
            name="languages"
            placeholder="e.g. JavaScript, Python, Java"
            value={data.languages}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Frameworks</label>
          <input
            type="text"
            name="frameworks"
            placeholder="e.g. React, Node.js, Spring Boot"
            value={data.frameworks}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Libraries</label>
          <input
            type="text"
            name="libraries"
            placeholder="e.g. Redux, Tailwind CSS, NumPy"
            value={data.libraries}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tools</label>
          <input
            type="text"
            name="tools"
            placeholder="e.g. Git, Docker, AWS"
            value={data.tools}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Others</label>
          <input
            type="text"
            name="others"
            placeholder="e.g. Agile, Scrum, Leadership"
            value={data.others}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-3">
        {isMobile && (
          <button
            onClick={onMobilePreview}
            className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all shadow-sm"
          >
            Preview PDF
          </button>
        )}

        {onSaveChanges && (
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
        )}
      </div>
    </div>
  );
};

export default Skills;