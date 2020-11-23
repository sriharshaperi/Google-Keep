import React from "react";

function InputField({ renderInputComponent }) {
  return (
    <input
      type="text"
      className="input__field__component"
      placeholder=" Take a note..."
      onFocus={renderInputComponent}
      style={{
        display: "block",
        margin: "auto",
        width: "40%",
        marginTop: "3%",
        height: "3rem",
        fontSize: "1.5rem",
      }}
    />
  );
}

export default InputField;
