// import React from 'react'
// import "./CustomDatePicker.scss"
// import { DatePicker } from 'antd'

// function CustomDatePicker({picker,placeholder}) {
//   return (
//     <div className='commonDatepicker'>
//         <DatePicker picker={picker} placeholder={placeholder} />
//     </div>
//   )
// }

// export default CustomDatePicker


// import React from 'react';
// import "./CustomDatePicker.scss";
// import { DatePicker } from 'antd';

// function CustomDatePicker({ picker, placeholder, onChange, disabledDate }) {
//   return (
//     <div className='commonDatepicker'>
//       <DatePicker picker={picker} placeholder={placeholder} onChange={onChange} disabledDate={disabledDate}

//  />
//     </div>
//   );
// }

// export default CustomDatePicker;

// CustomDatePicker.jsx
import React from 'react';
import "./CustomDatePicker.scss";
import { DatePicker } from 'antd';
import moment from 'moment';

function CustomDatePicker({ picker, placeholder, onChange, from_date, to_date, value, onClickHandler }) {
  console.log(" FROMDATE CUSTOM from_date ==>", from_date, "to_date ==>", to_date, "value ==>", value)
  const disabledDate = (current) => {
    // Disable dates before the selected from_date
    if (from_date && current < from_date) {
      return true;
    }
    if (to_date && current > moment(to_date)) {
      return true;
    }
    // Disable future dates
    return current && current > moment().endOf('day');
  };

  return (
    <div className='commonDatepicker'>
      <DatePicker picker={picker} placeholder={placeholder} onChange={onChange} disabledDate={disabledDate} value={value ? moment(value) : null} onClick={() => onClickHandler(placeholder)}
      />
    </div>
  );
}

export default CustomDatePicker;

