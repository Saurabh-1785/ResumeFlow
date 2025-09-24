function CustomSection({ data, setData, setStep, onSaveChanges, isUpdating, enhancingId, onEnhance, onMobilePreview, isMobile }) {

  // ... all your existing functions (addSection, deleteSection, etc.) remain the same ...
  const addSection = () => {
    setData([
      ...data,
      { id: Date.now(), title: 'New Section', content: [] }
    ]);
  };
  const deleteSection = (sectionId) => {
    setData(data.filter(section => section.id !== sectionId));
  };
  const updateSectionTitle = (sectionId, newTitle) => {
    setData(data.map(section =>
      section.id === sectionId ? { ...section, title: newTitle } : section
    ));
  };
  const addContent = (sectionId, type) => {
    setData(data.map(section => {
      if (section.id === sectionId) {
        const newContent = { id: Date.now(), type };
        if (type === 'subheading') {
          newContent.primary = '';
          newContent.secondary = '';
          newContent.tertiary = '';
        } else {
          newContent.text = '';
        }
        return { ...section, content: [...section.content, newContent] };
      }
      return section;
    }));
  };
  const updateContent = (sectionId, contentId, field, value) => {
    setData(data.map(section => {
      if (section.id === sectionId) {
        const newContent = section.content.map(item =>
          item.id === contentId ? { ...item, [field]: value } : item
        );
        return { ...section, content: newContent };
      }
      return section;
    }));
  };
  const deleteContent = (sectionId, contentId) => {
    setData(data.map(section => {
        if (section.id === sectionId) {
            return { ...section, content: section.content.filter(item => item.id !== contentId) };
        }
        return section;
    }));
  };

  const AiEnhanceButton = ({ onClick, isEnhancing, isDisabled }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="text-stone-50 bg-purple-600 font-bold px-4 py-1.5 rounded-lg text-sm cursor-pointer transition-all disabled:bg-gray-400 hover:bg-purple-700 flex items-center gap-2"
    >
      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M30 15.03C21.9538 15.515 15.5125 21.9538 15.0287 30H14.97C14.485 21.9538 8.045 15.515 0 15.03V14.9713C8.04625 14.485 14.485 8.04625 14.97 0H15.0287C15.5137 8.04625 21.9538 14.485 30 14.9713V15.03Z" /></svg>
      {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
    </button>
  );


  return (
    <div className="border border-r-20 rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-800 dark:border-yellow-600">
      <h2 className="text-[clamp(35px,6vw,55px)] text-center font-sans font-bold mb-10 p-4 text-yellow-800 dark:text-yellow-600">OTHERS</h2>

      {data.map((section) => (
        <div key={section.id} className="mb-8 border-t-2 border-yellow-800 dark:border-yellow-600 pt-6">
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Section Title"
              value={section.title}
              onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              className="block w-full border p-3 rounded italic text-xl font-bold active:border-yellow-800 focus:border-yellow-800 text-black dark:bg-black dark:text-stone-50 dark:active:border-yellow-600 dark:focus:border-yellow-600"
            />
            <button
              onClick={() => deleteSection(section.id)}
              className="ml-4 bg-yellow-800 text-stone-50 px-3 py-2 rounded-lg cursor-pointer transition-all ease-in duration-300 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover-bg-yellow-700 text-sm"
            >
              Delete Section
            </button>
          </div>

          {section.content.map(item => {
            const isCurrentlyEnhancing = enhancingId === item.id;
            return (
              <div key={item.id} className="mb-4 pl-4 border-l-2">
                {item.type === 'subheading' ? (
                  <div className="space-y-2">
                    <input type="text" placeholder="Title" value={item.primary} onChange={e => updateContent(section.id, item.id, 'primary', e.target.value)} className="block w-full border p-2 rounded text-black dark:bg-black dark:text-stone-50" />
                    <input type="text" placeholder="Secondary Text (to be appeared on right side)" value={item.secondary} onChange={e => updateContent(section.id, item.id, 'secondary', e.target.value)} className="block w-full border p-2 rounded text-black dark:bg-black dark:text-stone-50" />
                    <div>
                      <textarea placeholder="Description (add new points by pressing Enter)" value={item.tertiary} onChange={e => updateContent(section.id, item.id, 'tertiary', e.target.value)} className="block w-full border p-2 rounded text-black dark:bg-black dark:text-stone-50" />
                      <div className="flex justify-end mt-2">
                        <AiEnhanceButton isEnhancing={isCurrentlyEnhancing}
                          isDisabled={enhancingId !== null && enhancingId !== item.id}
                          onClick={() => onEnhance(
                            item.id,
                            `Custom Section: ${section.title}`,
                            item.tertiary,
                            (newText) => updateContent(section.id, item.id, 'tertiary', newText)
                        )} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <input type="text" placeholder="List item content" value={item.text} onChange={e => updateContent(section.id, item.id, 'text', e.target.value)} className="block w-full border p-2 rounded text-black dark:bg-black dark:text-stone-50" />
                )}
                <button onClick={() => deleteContent(section.id, item.id)} className="text-red-500 text-xs mt-1 cursor-pointer">Remove</button>
              </div>
             )})}
          <button onClick={() => addContent(section.id, 'subheading')} className="text-sm text-yellow-800 border cursor-pointer transition-all ease-in duration-300 border-yellow-800 px-3 py-1 rounded dark:text-yellow-600 dark:border-yellow-600">+ Add Subheading</button>
        
        </div>
      ))}
      
      <button onClick={addSection} className="inline text-yellow-800 border-yellow-800 dark:border-yellow-600 dark:text-yellow-600 px-6 py-3 rounded-2xl border border-solid text-2xl font-inherit cursor-pointer transition-all ease-in duration-300 mt-5 mb-5">+ Add New Section</button>

      <div className="mt-8 space-y-3">
          {onSaveChanges && (
            <button 
              onClick={onSaveChanges} 
              disabled={isUpdating} 
              className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-yellow-800 font-bold px-4 py-3 rounded-2xl hover:bg-yellow-700 disabled:bg-gray-400 dark:bg-yellow-600"
            >
              {isUpdating ? 'Updating...' : 'Preview'}
            </button>
          )}
          
          {/* Mobile Preview Button */}
          {isMobile && onMobilePreview && (
            <button 
              onClick={onMobilePreview}
              className="w-full cursor-pointer transition-all ease-in duration-300 text-stone-50 bg-green-600 font-bold px-4 py-3 rounded-2xl hover:bg-green-700"
            >
              Preview Resume
            </button>
          )}
        </div>
    </div>
  );
}

export default CustomSection;