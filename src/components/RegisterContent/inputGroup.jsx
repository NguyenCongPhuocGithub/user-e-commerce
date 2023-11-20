import React from 'react';

function InputGroup({
  label,
  type = 'text',
  name,
  placeholder = `Vui lòng nhập thông tin ${label}`,
  validation,
}) {
  const { values, handleChange, handleBlur, errors, touched  } = validation;
  return (
    <div>
    <label>
      {label}:
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={values[name]}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </label>
    {errors[name] && touched[name] && <div>{errors[name]}</div>}
    </div>
  );
}

export default InputGroup;
