function GeneralInfo({ data, setData, setStep, setShowForm }) {
  return (
      <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-50 w-full max-w-3xl border-yellow-600">
        <h2 className="text-[clamp(25px,3vw,60px)] text-center font-sans italic font-bold mb-20 p-4 text-yellow-600">
          General Info
        </h2>
        
        <input type="text" placeholder="Name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
        />

        <input type="email" placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
        />

        <input type="number" placeholder="Phone"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
        />

        <input type="text" placeholder="Github Username (optional)"
          value={data.github}
          onChange={(e) => setData({ ...data, github: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
        />

        <input type="url" placeholder="LinkedIn Profile URL (optional)"
          value={data.linkedin}
          onChange={(e) => setData({ ...data, linkedin: e.target.value })}
          className="block w-full border p-3 mb-10 rounded italic active:border-yellow-600 focus:border-yellow-600 text-black dark:bg-black dark:text-white"
        />

        <div className="flex justify-between mt-3 mb-5">
          <button
            onClick={() => setShowForm(false)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Previous
          </button>
          <button
            onClick={() => setStep(1)}
            className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">
            Next
          </button>
        </div>
      </div>
   
  );
}
export default GeneralInfo;
