export default function InputFormSignIn({name, placeholder}) {
  
  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
      </label>
      <div className="mt-2">
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          required
          className="block w-full rounded-md border-0 p-3 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </>
  );
}
