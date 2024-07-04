import React from 'react'
// import "./TextArea.scss"

// function TextArea({placeholder}) {
//   return (
//     <div className="CommonTextArea">
//         <textarea  id="" cols="30" rows="5" placeholder={placeholder}></textarea>
//     </div>
//   )
// }

// export default TextAreaimport React from 'react';
// import "./TextArea.scss";

// function TextArea({ placeholder, value, onChange, maxLength, error }) {
//   return (
//     <div className="CommonTextArea">
//       <textarea
//         cols="30"
//         rows="5"
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         maxLength={maxLength}
//       // style={{ color: 'dimgray' }}
//       />
//       {error && <p className="error">{error}</p>}
//     </div>

//   );
// }

// export default TextArea;

import "./TextArea.scss";

function TextArea({ placeholder, value, onChange, maxLength, error }) {
  return (
    <div className="CommonTextArea">
      <textarea
        cols="30"
        rows="5"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      // style={{ color: 'dimgray' }}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TextArea;
