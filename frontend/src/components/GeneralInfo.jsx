import React from "react";

const GeneralInfo = ({ data, setData, onSaveChanges, isUpdating, enhancingId, onEnhance }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEnhance = (field) => {
    onEnhance(field, "general info", data[field], (enhancedText) => {
      setData((prev) => ({ ...prev, [field]: enhancedText }));
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 text-xl">
            👤
          </span>
          General Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. John Doe"
            value={data.name}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. john@example.com"
            value={data.email}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="e.g. +1 (555) 123-4567"
            value={data.phone}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">GitHub URL</label>
          <input
            type="text"
            name="github"
            placeholder="github.com/johndoe"
            value={data.github}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">LinkedIn URL</label>
          <input
            type="text"
            name="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={data.linkedin}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Professional Summary</label>
            <button
              onClick={() => handleEnhance("about")}
              disabled={enhancingId === "about"}
              className="text-xs font-medium text-yellow-800 dark:text-yellow-500 hover:text-yellow-900 dark:hover:text-yellow-400 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
            >
              {enhancingId === "about" ? (
                <>
                  <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enhancing...
                </>
              ) : (
                <>
                  ✨ Enhance with AI
                </>
              )}
            </button>
          </div>
          <textarea
            name="about"
            placeholder="Briefly describe your professional background and key achievements..."
            value={data.about}
            onChange={handleChange}
            rows="4"
            className="w-full resize-none"
          />
        </div>
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

export default GeneralInfo;