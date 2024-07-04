import React, { useCallback, useEffect, useState } from "react";
import "./Announcement.scss";
import { Checkbox, Pagination, Table } from "antd";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import TextArea from "../../Common/Components/TextArea/TextArea";
import { HistoryOutlined } from "@ant-design/icons";
import CustomDatePicker from "../../Common/Components/CustomDatePicker/CustomDatePicker";
import { useGetAnnoucementMutation } from "../../Utility/Services/UserLoginAPI";
import { useGetUserListMutation } from "../../Utility/Services/UserListAPI";
import moment from "moment";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
// import { useHistory } from "react-router-dom";

const menuPropsAsc = ["Ascending", "Descending"];

const capitalizeFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const toUppercase = (arr) => arr.map(capitalizeFirstLetter);

function Announcement() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserKeys, setSelectedUserKeys] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [isEnabled, setIsEnabled] = useState(true);
  const [selectedUsersPerPage, setSelectedUsersPerPage] = useState({}); // Track selected users on each page
  const [selectAllUsers, setSelectAllUsers] = useState(false); // Track if all users are selected globally
  const [limit, setLimit] = useState(10); // Initial limit value
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [filter, setOrder] = useState("Descending");
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const [isOpenAsc, setIsOpenAsc] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [userData, setUserData] = useState([]);
  const [errors, setErrors] = useState({});
  const [perpage, setPerpage] = useState([]);
  const [isChecked, setIsChecked] = useState(true); // Initially, all selections are checked
  const [loading, setLoading] = useState(false); // Track the loading state

  const [getAnnoucement] = useGetAnnoucementMutation();
  const [getUserList, { userList }] = useGetUserListMutation();

  useEffect(() => {
    userListData();
  }, [page, search, from_date, to_date, filter]);

  const debouncedSearch = useCallback(
    _debounce((e) => handleSearch(e.target.value), 1000),
    []
  );
  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
    userListData();
  }, []);

  const handleInputChange = (value) => {
    setSearch(value)
    debouncedSearch(value);
    setPage(1)

  };

  const userListData = async () => {
    let payload = { limit, page, search, from_date, to_date, filter };
    const { data } = await getUserList(payload);
    if (data) {
      setPerpage(data?.meta);
      setUserData(data.data);
    }
  };

  console.log(selectedUserKeys.size, "888::")
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true
    try {
      let newErrors = {};
      newErrors.title = !title ? "Title is Required" : "";
      newErrors.details = !details ? "Message is Required" : "";
      setErrors(newErrors);

      if (Object.values(newErrors).some((error) => error)) {
        setLoading(false); // Reset loading state
        return;
      }

      console.log("DEBUGGG 2 selectedUserKeys ==>", selectedUserKeys);

      const userIds = selectAllUsers ? [] : Array.from(selectedUserIds);


      let res = await getAnnoucement({
        title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
        details: details.charAt(0).toUpperCase() + details.slice(1).toLowerCase(),
        user_ids: userIds,
      }).unwrap();
      setIsEnabled(true);


      toast.success(res?.data);
      setDetails("");
      setTitle("");
      setSelectionType("");
      setSelectedUsers([]);
      setSelectedUserKeys(new Set()); // Reset global selection
      setSelectedUsersPerPage({}); // Reset selected users on each page
      setSelectAllUsers(false); // Reset select all state
      setPage(1);
      // setIsSubmitDisabled(true);
      setSelectAll(false); // Resetting selectAll state
    } catch (error) {
      console.log(error);
      setSelectAll(false); // Resetting selectAll state
      toast.error(error?.message);
      setLoading(false); // Reset loading state

    }
  };

  const handleOrderFilter = (filter) => {
    setOrder(filter);
    setPage(1);
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "SNo",
      render: (text, record, index) => <a>{calculateSerialNumber(index)}</a>,
    },
    {
      title: "Wallet Name",
      dataIndex: "WalletName",
    },
    {
      title: "Wallet Address",
      dataIndex: "WalletAddress",
    },
    {
      title: "MultichainPortfolio",
      dataIndex: "MultichainPortfolio",
    },
    {
      title: "Date",
      dataIndex: "Date",
    },
  ];

  function calculateSerialNumber(index) {
    return index + 1 + (page - 1) * limit;
  }

  const data1 = userData.map((userData, index) => {
    const { user_id, wallet_name, address, total_user_balance, created_at } = userData;
    return {
      key: user_id,
      SNo: (
        <div className="tableUserProfile">
          <p>{calculateSerialNumber(index)}</p>
        </div>
      ),
      WalletName: wallet_name,
      WalletAddress: <span title={address}>{address.length > 20 ? address.substring(0, 20) + "..." : address}</span>,
      MultichainPortfolio: `$ ${total_user_balance}`,
      Date: moment(created_at).format("DD/MM/YYYY hh:mm A"),
    };
  });

  const handleFromDateChange = (date) => {
    console.log("THIS ONE IS handleFromDateChange")
    setFromDate(date ? date.format("YYYY-MM-DD") : "");
    setPage(1);
  };

  const handleOnClickHandlerForDatePicker = (value) => {
    if (value === 'From Date'){
      setFromDate("");
    } else if (value === 'To Date'){
      setToDate("");
    }
  }

  const handleToDateChange = (date) => {
    setToDate(date ? date.format("YYYY-MM-DD") : "");
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setFromDate("");
    setToDate("");
    setOrder("Descending");
    setPage(1);
    setSelectedUsers([]);
    setSelectedUserKeys(new Set());
    setSelectedUsersPerPage({});
    setSelectAll(false);
    setSelectAllUsers(false); // Reset select all state
  };


  function removeDuplicates(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = [...new Set(obj[key])];
      }
    }
    return obj;
  }


  const handleRowSelectionChange = (selectedRowKeys, selectedRows) => {
    let newSelectedUsersPerPage = { ...selectedUsersPerPage, [page]: selectedRowKeys };
    console.log(newSelectedUsersPerPage, "tet::", selectedRows);
    // Combine selected keys from all pages
    selectedRowKeys.length ? setIsEnabled(false) : setIsEnabled(true)
    const d = [...selectedUserIds, ...selectedRowKeys]
    const da = [...selectedUserKeys, ...selectedRows]

    const uniqueArray = [...new Set(d)];
    const uniqueArrayV2 = [...new Set(da)];
    console.log("uniqueArray", uniqueArray, uniqueArrayV2, newSelectedUsersPerPage, selectionType)
    setSelectedUserIds(uniqueArray);
    console.log("TRACKINGG 1 uniqueArrayV2 ==>", uniqueArrayV2);
    setSelectedUserKeys(uniqueArrayV2);
    console.log("DEBUG 1  newSelectedUsersPerPage ==>", newSelectedUsersPerPage, "selectedRowKeys", selectedRowKeys, "selectedRows", selectedRows, "page ==>", page, "search ==>", search, "search length", search.length);
    let newObj = {}
    if (!Object.keys(selectedUsersPerPage).length) {
      console.log("DEBUG 2 newObj ==>", newObj);
      newObj[page] = selectedRowKeys
      console.log("DEBUG 3 newObj ==>", newObj);
      setSelectedUsersPerPage(removeDuplicates(newObj))

    }
    else {
      console.log("DEBUG 4 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj);
      if (!search.length) {
        console.log("CAME HERE IF page", page, "selectedUsersPerPage", selectedUsersPerPage, "selectedRowKeys", selectedRowKeys)

        for (let key in selectedUsersPerPage) {
          console.log("DEBUG 5 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);
          if (key == page) {
            console.log("DEBUG 6 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);

            if (selectedRowKeys.length) {
              // console.log("DEBUG 7 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);
              // if (search.length) {
              console.log("DEBUG INSIDE IF selectedRowKeys", selectedRowKeys, "selectedUsersPerPage", selectedUsersPerPage, "key", key, "page", page)
              // selectedUsersPerPage[key] = [...selectedRowKeys, ...selectedUsersPerPage[page]]  // Sirf unselect nahi hoo raha
              // } else {
              //   console.log("DEBUG INSIDE ELSE selectedRowKeys", selectedRowKeys, "selectedUsersPerPage", selectedUsersPerPage, "key", key, "page", page)
              selectedUsersPerPage[key] = [...selectedRowKeys]
              // }

              console.log("DEBUG 8 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);

            } else {
              console.log("DEBUG 9 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);

              selectedUsersPerPage[key] = []
              console.log("DEBUG 10 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);

            }
          } else {
            console.log("DEBUG 11 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);

            selectedUsersPerPage[page] = [...selectedRowKeys, ...selectedUsersPerPage[key]]
            console.log("DEBUG 12 selectedUsersPerPage ==>", selectedUsersPerPage, "newObj ==>", newObj, "page", page, "key", key);

          }
        }
      } else {
        console.log("CAME HERE ELSE page", page, "selectedUsersPerPage", selectedUsersPerPage, "selectedRowKeys", selectedRowKeys)
        selectedUsersPerPage[page] = [...selectedRowKeys, ...selectedUsersPerPage[page]]
      }
      setSelectedUsersPerPage(removeDuplicates(selectedUsersPerPage))
    }



    let allSelectedUserKeys = new Set();
    Object.values(newSelectedUsersPerPage).forEach((keys) => {
      keys.forEach((key) => allSelectedUserKeys.add(key));
    });
    console.log(allSelectedUserKeys, "tt::");
    console.log("TRACKINGG 2 allSelectedUserKeys ==>", allSelectedUserKeys, "newSelectedUsersPerPage ", newSelectedUsersPerPage);

    setSelectedUserKeys(allSelectedUserKeys);
    setSelectedUsers(selectedRows);

    // Check if the selected rows exceed the limit
    if (uniqueArray.size > 100) {
      setIsChecked(false);
      toast.info("Maximum 100 users can be selected.");
    } else {
      setIsChecked(true);
    }
  };


  console.log("COMMING selectedUsersPerPage  ===>", selectedUsersPerPage, "selectedUserKeys ==>", selectedUserKeys)

  const rowSelection = {
    selectedRowKeys: selectedUsersPerPage[page] || [],
    onChange: handleRowSelectionChange,
    getCheckboxProps: (record) => {
      console.log("lets check record ==>", record)
      return ({
        disabled: selectAll || selectedUserKeys.size >= 100 && !selectedUserKeys.has(record.key),
        // Disable checkbox if "Select All" is checked or the selected users exceed 100
      })
    },
  };


  const handleSelectAllChange = async (e) => {
    const checked = e.target.checked;
    setIsEnabled(!checked);
    setSelectAll(checked);
    setSelectAllUsers(checked);
    setSelectedUserKeys(new Set());
    setSelectedUsers([]);
    setSelectedUsersPerPage({});


    if (checked) {
      // If "Select All" is checked, clear any individual selections
      toast.info("All users are selected.");
    }
  }
  const navigate = useNavigate();

  console.log("isEnabled outside ==>", isEnabled, "selectedUserKeys ==>", selectedUserKeys);

  return (
    <div className="announcement">
      <div className="announcement_top commonCardBg">
        <InputCustom
          regularInput
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          maxLength={100}
          error={errors.title}
        />
        <TextArea
          placeholder="Message"
          onChange={(e) => setDetails(e.target.value)}
          value={details}
          maxLength={500}
          error={errors.details}
        />
        {errors.selectedUsersPerPage && <div className="error-message">{errors.selectedUsersPerPage}</div>}
        <ButtonCustom
          label="Send Message"
          regularBtn
          className={isEnabled ? 'announcement_top_sendBtn disabled' : 'announcement_top_sendBtn'}
          onClick={handleSubmit}
          disabled={isEnabled}
        />
      </div>
      <div className="commonCardBg">
        <div className="announcement_filters">
          <div className="announcement_filters_left">
            <InputCustom
              searchInputs
              placeholder="Search by Wallet Name"
              onChange={handleInputChange}
              value={search}
            />
            <CustomDatePicker
              picker="date"
              placeholder="From Date"
              value={from_date !== "" ? moment(from_date) : ""}
              onChange={handleFromDateChange}
              to_date={to_date}
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
          </div>
          <div className="announcement_filters_right">
            <DropdownCustom
              buttonText="Ascending"
              menuItems={menuPropsAsc}
              className="action"
              handleMenuClick={handleOrderFilter}
              isOpen={isOpenAsc}
              setIsOpen={setIsOpenAsc}
              value={filter}
            />
            <ButtonCustom
              label="Reset"
              regularBtn
              onClick={handleResetFilters}
            />
          </div>
        </div>
        <div className="announcement_tablehistory">
          <Checkbox onChange={handleSelectAllChange} checked={selectAll}>
            Select All  (Note: Manually you can select maximum 100 users at one
            time)
          </Checkbox>
          <p onClick={() => navigate("/history/")}>
            <HistoryOutlined /> History
          </p>
        </div>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data1}
          pagination={false}
        />
        {data1 && <Pagination
          current={page}
          pageSize={limit}
          total={perpage?.total}
          onChange={(page) => {
            setPage(page);
          }}
          showSizeChanger={false}
        />}
      </div>
    </div>
  );
}

export default Announcement;
