import React, { useState } from "react";
import "./InputCustom.scss";
import VisibilityOff from "../../../assets/VisibilityOff.svg";
import VisibilityOn from "../../../assets/VisibilityOn.svg";
import { SearchOutlined } from "@ant-design/icons";

function InputCustom(props) {
  const {
    label,
    labletext,
    placeholder,
    type,
    error,
    regularInput,
    passwordInput,
    id,
    name,
    onChange,
    value, // Use the value from props
    customClass,
    searchInputs,
    tabIndex,
    onBlur,
    disabled,
    required = false,
    maxLength,
    minLength
  } = props;

  const [types, setTypes] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue); // Call the onChange function from props with the new value
    }
  };

  return (
    <div
      className={`customInput ${passwordInput ? "customInput-password" : ""
        } ${customClass} ${error ? "customInput-inputError" : ""}`}
    >
      {label && (
        <label>
          {labletext}
          {required && <span> *</span>}
        </label>
      )}
      {regularInput && (
        <input
          placeholder={placeholder}
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          value={value} // Use the value from props 
          tabIndex={tabIndex}
          onBlur={onBlur}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
      {passwordInput && (
        <div className="customInput-password_wrapper">
          <input
            placeholder={placeholder}
            type={types ? "text" : "password"}
            id={id}
            autocomplete="new-password"
            onfocus="this.removeAttribute('readonly');"
            name={name}
            onChange={onChange}
            value={value} // Use the value from props
            tabIndex={tabIndex}
            onBlur={onBlur}
            maxLength={maxLength}
          />
          <button onClick={() => {
            console.log("TRIGGERING BUTTON")
            setTypes(!types)
          }} type="button">
            {types ? (
              <img
                src={VisibilityOn}
                alt="VisibilityOff"
                width={24}
                height={24}
              />
            ) : (
              <img
                src={VisibilityOff}
                alt="VisibilityOn"
                width={24}
                height={24}
              />
            )}
          </button>
        </div>
      )}
      {error && <p>{error}</p>}
      {searchInputs && (
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder={placeholder}
            value={value} // Use the value from props
            onChange={handleInputChange}
            maxLength={maxLength}
            minLength={minLength}
          />
          <button type="button" className="search-button">
            <SearchOutlined />
          </button>
        </div>
      )}
    </div>
  );
}

export default InputCustom;
