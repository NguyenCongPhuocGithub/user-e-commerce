// import React from "react";

// function InputGroup({
//   label,
//   type = "text",
//   name,
//   placeholder = `Vui lòng nhập thông tin ${label}`,
//   validation,
// }) {
//   const { values, handleChange, handleBlur, errors, touched } = validation;
//   return (
//     <div className="w-full h-full">
//       <label className="flex justify-between items-center w-full h-full">
//         <span className="w-1/5 text-center h-8 text-sm flex items-center">
//           {label}:
//         </span>
//         <input
//           type={type}
//           placeholder={placeholder}
//           name={name}
//           value={values[name]}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           className="w-4/5 py-2 px-4 rounded-lg h-full"
//         />
//       </label>
//       {errors[name] && touched[name] && <div>{errors[name]}</div>}
//     </div>
//   );
// }

// export default InputGroup;


import React from "react";

function InputGroup({
  label,
  type = "text",
  name,
  placeholder = `Vui lòng nhập thông tin ${label}`,
  validation,
}) {
  const { values, handleChange, handleBlur, errors, touched } = validation;
  return (
    <div>
      <label className="block mb-1 text-gray-700">{label}:</label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full border rounded-lg py-2 px-3 focus:outline-none focus:ring focus:border-blue-500 text-gray-700"
      />
      {errors[name] && touched[name] && (
        <div className="text-red-500 mt-1">{errors[name]}</div>
      )}
    </div>
  );
}

export default InputGroup;