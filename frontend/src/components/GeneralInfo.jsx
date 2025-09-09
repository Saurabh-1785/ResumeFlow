function GeneralInfo({ data, setData, setStep, setShowForm, onSaveChanges, isUpdating, enhancingId, onEnhance }) {
  const handleAboutEnhance = () => {
    onEnhance(
      'general_about',
      "Personal Summary", 
      data.about, 
      (newText) => setData({ ...data, about: newText })
    );
  };
  
  const AiEnhanceButton = ({ onClick, isEnhancing, isDisabled }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="text-white bg-purple-600 font-bold px-4 py-1.5 rounded-lg text-sm cursor-pointer transition-all disabled:bg-gray-400 hover:bg-purple-700 flex items-center gap-2"
    >
      <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M30 15.03C21.9538 15.515 15.5125 21.9538 15.0287 30H14.97C14.485 21.9538 8.045 15.515 0 15.03V14.9713C8.04625 14.485 14.485 8.04625 14.97 0H15.0287C15.5137 8.04625 21.9538 14.485 30 14.9713V15.03Z" /></svg>
      {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
    </button>
  );

  const isCurrentlyEnhancing = enhancingId === 'general_about';

  return (
      <div className="border md:border-r-20 rounded-br-4xl rounded-bl-4xl p-10 mt-0 w-full max-w-3xl border-yellow-600 ">
        <h2 className="text-[clamp(30px,4vw,60px)] text-center font-lobster mb-20 p-4 text-yellow-600">General Info</h2>
  
        <input type="text" placeholder="Name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white" required />
        <input type="email" placeholder="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white" required />
        <input type="number" placeholder="Phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white" required />
        <input type="text" placeholder="Github Username (optional)" value={data.github} onChange={(e) => setData({ ...data, github: e.target.value })} className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white" />
        <input type="url" placeholder="LinkedIn Profile URL (optional)" value={data.linkedin} onChange={(e) => setData({ ...data, linkedin: e.target.value })} className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white" />
        
        <div className="mb-10">
          <textarea placeholder="About Yourself (optional)" value={data.about} onChange={(e) => setData({ ...data, about: e.target.value })} className="block w-full border p-3 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white min-h-[120px]" />
          <div className="flex justify-end mt-2">
            <AiEnhanceButton  
              isEnhancing={isCurrentlyEnhancing}
              isDisabled={enhancingId !== null && enhancingId !== 'general_about'}
              onClick={handleAboutEnhance} />
          </div>
        </div>
        <div className="mt-8">
          {onSaveChanges && (
            <button 
              onClick={onSaveChanges} 
              disabled={isUpdating} 
              className="w-full cursor-pointer transition-all ease-in duration-300 text-white bg-yellow-600 font-bold px-4 py-3 rounded-2xl hover:bg-yellow-700 disabled:bg-gray-400"
            >
              {isUpdating ? 'Updating...' : 'Update Preview'}
            </button>
          )}
        </div>
      </div>
  );
}
export default GeneralInfo;