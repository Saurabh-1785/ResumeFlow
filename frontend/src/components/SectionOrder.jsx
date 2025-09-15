import { useState } from 'react';

function SectionOrder({ sectionOrder, setSectionOrder, onSaveChanges, isUpdating }) {
  const moveSection = (index, direction) => {
    const newOrder = [...sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newOrder.length) {
      [newOrder[index], newOrder[targetIndex]] = [newOrder[targetIndex], newOrder[index]];
      setSectionOrder(newOrder);
    }
  };

  const resetToDefault = () => {
    const defaultOrder = [
      { id: 'summary', name: 'Summary', enabled: true },
      { id: 'education', name: 'Education', enabled: true },
      { id: 'skills', name: 'Skills', enabled: true },
      { id: 'projects', name: 'Projects', enabled: true },
      { id: 'experience', name: 'Experience', enabled: true },
      { id: 'custom', name: 'Custom Sections', enabled: true }
    ];
    setSectionOrder(defaultOrder);
  };

  const toggleSection = (index) => {
    const newOrder = [...sectionOrder];
    newOrder[index].enabled = !newOrder[index].enabled;
    setSectionOrder(newOrder);
  };

  return (
    <div className="border md:border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-800 dark:border-yellow-600">
      <h2 className="text-[clamp(25px,4vw,60px)] text-center font-sans font-bold mb-20 p-4 text-yellow-800 dark:text-yellow-600">Order</h2>
      
      <div className="mb-6">
        <p className="text-lg text-yellow-800 dark:text-yellow-600 mb-4">
          Customize the order of sections in your resume. Use the arrows to reorder and checkboxes to enable/disable sections.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {sectionOrder.map((section, index) => (
          <div key={section.id} className="flex items-center gap-4 p-4 bg-stone-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Enable/Disable Checkbox */}
            <input
              type="checkbox"
              checked={section.enabled}
              onChange={() => toggleSection(index)}
              className="w-5 h-5 text-yellow-800 bg-stone-50 border-gray-300 rounded dark:text-yellow-600  dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            
            {/* Section Name */}
            <div className="flex-1">
              <span className={`text-lg font-medium ${section.enabled ? 'text-gray-900 dark:text-stone-50' : 'text-gray-400 dark:text-gray-500'}`}>
                {section.name}
              </span>
            </div>
            
            {/* Move Up Button */}
            <button
              onClick={() => moveSection(index, 'up')}
              disabled={index === 0}
              className="p-2 rounded-md cursor-pointer bg-yellow-800 text-stone-50 hover:bg-yellow-700 dark:bg-yellow-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              aria-label="Move up"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            {/* Move Down Button */}
            <button
              onClick={() => moveSection(index, 'down')}
              disabled={index === sectionOrder.length - 1}
              className="p-2 rounded-md cursor-pointer bg-yellow-800 text-stone-50 hover:bg-yellow-700 dark:bg-yellow-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
              aria-label="Move down"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Reset and Save Buttons */}
      <div className="space-y-3">
        <button 
          onClick={resetToDefault}
          className="w-full cursor-pointer transition-all ease-in duration-300 text-yellow-800 bg-stone-50 border border-yellow-800 font-bold px-4 py-3 rounded-2xl dark:text-yellow-600 dark:border-yellow-600"
        >
          Reset to Default Order
        </button>
        
        {onSaveChanges && (
          <button 
            onClick={onSaveChanges} 
            disabled={isUpdating} 
            className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-yellow-800 font-bold px-4 py-3 rounded-2xl hover:bg-yellow-700 disabled:bg-gray-400 dark:bg-yellow-600"
          >
            {isUpdating ? 'Updating...' : 'Preview'}
          </button>
        )}
      </div>
    </div>
  );
}

export default SectionOrder;