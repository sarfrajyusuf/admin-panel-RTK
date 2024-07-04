

import React, { useEffect, useState } from "react";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import CustomDatePicker from "../../Common/Components/CustomDatePicker/CustomDatePicker";
import { Pagination, Table, Tag } from "antd";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import "./History.scss";
import { useGetHistoryMutation } from "../../Utility/Services/UserLoginAPI";
import moment from "moment";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
import _debounce from "lodash/debounce"; // Import debounce function

const menuPropsAsc = ["Ascending", "Descending"];
const capitalizeFirstLetter = (str) => {
  if (!str) return str; // Handle empty string or null
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const toUppercase = (arr) => arr.map(capitalizeFirstLetter);

function History() {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setOrder] = useState("Descending");
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const [isOpenAsc, setIsOpenAsc] = useState(false);

  const [getHistory, { data: history }] = useGetHistoryMutation();

  useEffect(() => {
    userListData();
  }, [page, search, from_date, to_date, filter]);

  const handleSearch = (searchValue) => {
    setSearch(searchValue);
    userListData();
    setPage(1);
  };
  const debouncedSearch = _debounce(handleSearch, 2000);

  const handleDownloadCSV = () => {
    const response = `https://api.futurewallet.io/api/v1/admin/auth/announcement_history/download?from_date=${from_date}&to_date=${to_date}&search=${search}&filter=${filter}&limit=${limit}&page=${page}`;
    window.open(response);
    return;
  };

  const userListData = async () => {
    let payload = { limit, page, search, from_date, to_date, filter };
    // let enc = await encryption(JSON.stringify(payload));
    console.log("Enc::", payload);
    // const securedData = { dataString: enc };
    await getHistory(payload);
  };

  function calculateSerialNumber(index) {
    return (page - 1) * limit + index + 1;
  }

  const columns = [
    {
      title: "S.No",
      dataIndex: "SNo",
    },
    {
      title: "Title",
      dataIndex: "Title",
    },
    {
      title: "Message ",
      dataIndex: "Message",
    },
    {
      title: "Sent users",
      dataIndex: "Sentusers",
    },
    // {
    //   title: "Status",
    //   dataIndex: "Status",
    //   render: (_, { Status }) => (
    //     <>
    //       {Status.map((tag) => {
    //         let color = tag.length > 10 ? "geekblue" : "green";
    //         if (tag === "loser") {
    //           color = "volcano";
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Date",
      dataIndex: "Date",
    },
  ];

  const handleOrderFilter = (filter) => {
    // let toLower = filter.toLowerCase()
    setOrder(filter);
    setPage(1);
  };

  const data1 = history?.data?.map((historyData, index) => {
    const { id, message, title, user_id, updatedAt } = historyData;
    let use = user_id.split(",");
    let user = use.length;
    return {
      key: id,
      SNo: (
        <div className="tableUserProfile">
          <p>{calculateSerialNumber(index)}</p>
        </div>
      ),
      Title: <span title={title}>{title}</span>,
      Message: (
        <span title={message}>
          {message.length > 10 ? message.substring(0, 30) + "..." : message}
        </span>
      ),
      Sentusers: user,
      Date: moment(updatedAt).format("DD/MM/YYYY hh:mm A"),
      // Status: ["complete"],
    };
  });

  const handleFromDateChange = (date) => {
    setFromDate(date ? date.format("YYYY-MM-DD") : "");
  };

  const handleToDateChange = (date) => {
    setToDate(date ? date.format("YYYY-MM-DD") : "");
  };

  const handleResetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setOrder("descending");
    setPage(1);
    window.location.reload(); // Refresh the page
  };

  const handleOnClickHandlerForDatePicker = (value) => {
    if (value === 'From Date') {
      setFromDate("");
    } else if (value === 'To Date') {
      setToDate("");
    }
  }
  //{record?.from_adrs.length > 10 ? record.from_adrs.substring(0, 10) + "..." : record.from_adrs}
  const data = [
    {
      key: "1",
      SNo: 1,
      Title: "Title",
      Message: "Test from your side.",
      Sentusers: "5",
      Status: ["complete"],
      Date: (
        <span>
          21-05-2024 <span>02:46:16</span> <span>PM</span>
        </span>
      ),
    },
    {
      key: "1",
      SNo: 1,
      Title: "Title",
      Message: "Test from your side.",
      Sentusers: "5",
      Status: ["complete"],
      Date: (
        <span>
          21-05-2024 <span>02:46:16</span> <span>PM</span>
        </span>
      ),
    },
  ];

  return (
    <div className="history announcement">
      <div className="commonCardBg">
        <div className="announcement_filters">
          <div className="announcement_filters_left">
            <InputCustom
              searchInputs
              placeholder="Search By Title"
              onChange={debouncedSearch}
            />
            {/* <CustomDatePicker picker="week" placeholder="DD/MM/YYYY" />
            <CustomDatePicker picker="week" placeholder="DD/MM/YYYY" /> */}
            <CustomDatePicker
              picker="date"
              placeholder="From Date"
              value={from_date !== "" ? moment(from_date) : ""}
              onChange={handleFromDateChange}
              to_date={to_date} // Pass to_date for disabling future dates
              onClickHandler={handleOnClickHandlerForDatePicker}

            />
            <CustomDatePicker
              picker="date"
              placeholder="To Date"
              value={to_date !== "" ? moment(to_date) : ""}
              onChange={handleToDateChange}
              from_date={moment(from_date, "YYYY-MM-DD")}
              onClickHandler={handleOnClickHandlerForDatePicker}

            />
            {/* <ButtonCustom label="Filter" regularBtn /> */}
            <DropdownCustom
              buttonText="Ascending"
              menuItems={menuPropsAsc}
              className="action"
              handleMenuClick={handleOrderFilter}
              isOpen={isOpenAsc}
              setIsOpen={setIsOpenAsc}
              value={filter}
            />
            <ButtonCustom label="Reset" regularBtn onClick={handleResetFilters} />
          </div>
          <div className="announcement_filters_right">
            <ButtonCustom label="Download" regularBtn onClick={handleDownloadCSV} />
          </div>
        </div>

        <Table columns={columns} dataSource={data1} pagination={false} />
        <Pagination
          current={page}
          onChange={(e) => setPage(e)}
          total={history?.meta?.total}
          pageSize={limit}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default History;


// import React, { useEffect, useState, useRef } from "react";
// import InputCustom from "../../Common/Components/InputCustom/InputCustom";
// import CustomDatePicker from "../../Common/Components/CustomDatePicker/CustomDatePicker";
// import { Pagination, Table } from "antd";
// import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
// import "./History.scss";
// import { useGetHistoryMutation } from "../../Utility/Services/UserLoginAPI";
// import moment from "moment";
// import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";

// const menuPropsAsc = ["Ascending", "Descending"];
// const capitalizeFirstLetter = (str) => {
//   if (!str) return str; // Handle empty string or null
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };

// const toUppercase = (arr) => arr.map(capitalizeFirstLetter);

// function History() {
//   const limit = 10;
//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");
//   const [filter, setOrder] = useState("Descending");
//   const [from_date, setFromDate] = useState("");
//   const [to_date, setToDate] = useState("");
//   const [isOpenAsc, setIsOpenAsc] = useState(false);
//   const abortControllerRef = useRef(null); // Reference to AbortController

//   const [getHistory, { data: history }] = useGetHistoryMutation();

//   useEffect(() => {
//     userListData();
//     return () => {
//       // Abort any ongoing requests when the component unmounts
//       if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//       }
//     };
//   }, [page, search, from_date, to_date, filter]);

//   const handleSearch = (event) => {
//     setSearch(event.target.value);
//     setPage(1);
//     userListData();
//   };

//   const handleDownloadCSV = () => {
//     const response = `https://api.futurewallet.io/api/v1/admin/auth/announcement_history/download?from_date=${from_date}&to_date=${to_date}&search=${search}&filter=${filter}&limit=${limit}&page=${page}`;
//     window.open(response);
//     return;
//   };

//   const userListData = async () => {
//     // Abort previous request if exists
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }

//     // Create a new AbortController for the current request
//     abortControllerRef.current = new AbortController();
//     const signal = abortControllerRef.current.signal;

//     let payload = { limit, page, search, from_date, to_date, filter };
//     try {
//       await getHistory({ ...payload, signal });
//     } catch (error) {
//       if (error.name === "AbortError") {
//         console.log("Request aborted");
//       } else {
//         console.error("Error fetching history:", error);
//       }
//     }
//   };

//   function calculateSerialNumber(index) {
//     return (page - 1) * limit + index + 1;
//   }

//   const columns = [
//     {
//       title: "S.No",
//       dataIndex: "SNo",
//     },
//     {
//       title: "Title",
//       dataIndex: "Title",
//     },
//     {
//       title: "Message",
//       dataIndex: "Message",
//     },
//     {
//       title: "Sent users",
//       dataIndex: "Sentusers",
//     },
//     {
//       title: "Date",
//       dataIndex: "Date",
//     },
//   ];

//   const handleOrderFilter = (filter) => {
//     setOrder(filter);
//     setPage(1);
//     userListData();
//   };

//   const data1 = history?.data?.map((historyData, index) => {
//     const { id, message, title, user_id, updatedAt } = historyData;
//     let use = user_id.split(",");
//     let user = use.length;
//     return {
//       key: id,
//       SNo: (
//         <div className="tableUserProfile">
//           <p>{calculateSerialNumber(index)}</p>
//         </div>
//       ),
//       Title: <span title={title}>{title}</span>,
//       Message: (
//         <span title={message}>
//           {message.length > 10 ? message.substring(0, 30) + "..." : message}
//         </span>
//       ),
//       Sentusers: user,
//       Date: moment(updatedAt).format("DD/MM/YYYY hh:mm A"),
//     };
//   });

//   const handleFromDateChange = (date) => {
//     setFromDate(date ? date.format("YYYY-MM-DD") : "");
//     setPage(1);
//     userListData();
//   };

//   const handleToDateChange = (date) => {
//     setToDate(date ? date.format("YYYY-MM-DD") : "");
//     setPage(1);
//     userListData();
//   };

//   const handleResetFilters = () => {
//     setSearch("");
//     setFromDate("");
//     setToDate("");
//     setOrder("Descending");
//     setPage(1);
//     userListData(); // Fetch data again after resetting filters
//   };

//   const handleOnClickHandlerForDatePicker = (value) => {
//     if (value === "From Date") {
//       setFromDate("");
//     } else if (value === "To Date") {
//       setToDate("");
//     }
//   };

//   return (
//     <div className="history announcement">
//       <div className="commonCardBg">
//         <div className="announcement_filters">
//           <div className="announcement_filters_left">
//             <InputCustom
//               searchInputs
//               placeholder="Search By Title"
//               onChange={handleSearch}
//             />
//             <CustomDatePicker
//               picker="date"
//               placeholder="From Date"
//               value={from_date !== "" ? moment(from_date) : ""}
//               onChange={handleFromDateChange}
//               to_date={to_date} // Pass to_date for disabling future dates
//               onClickHandler={handleOnClickHandlerForDatePicker}
//             />
//             <CustomDatePicker
//               picker="date"
//               placeholder="To Date"
//               value={to_date !== "" ? moment(to_date) : ""}
//               onChange={handleToDateChange}
//               from_date={moment(from_date, "YYYY-MM-DD")}
//               onClickHandler={handleOnClickHandlerForDatePicker}
//             />
//             <DropdownCustom
//               buttonText="Ascending"
//               menuItems={menuPropsAsc}
//               className="action"
//               handleMenuClick={handleOrderFilter}
//               isOpen={isOpenAsc}
//               setIsOpen={setIsOpenAsc}
//               value={filter}
//             />
//             <ButtonCustom label="Reset" regularBtn onClick={handleResetFilters} />
//           </div>
//           <div className="announcement_filters_right">
//             <ButtonCustom label="Download" regularBtn onClick={handleDownloadCSV} />
//           </div>
//         </div>

//         <Table columns={columns} dataSource={data1} pagination={false} />
//         <Pagination
//           current={page}
//           onChange={(e) => setPage(e)}
//           total={history?.meta?.total}
//           pageSize={limit}
//           showSizeChanger={false}
//         />
//       </div>
//     </div>
//   );
// }

// export default History;
