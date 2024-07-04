import React, { useCallback, useEffect, useState } from "react";
import "./Announcement.scss";
import {
  Checkbox,
  DatePicker,
  Input,
  Pagination,
  message,
  Table,
  Tag,
  Button,
  Spin,
} from "antd";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
// import TextArea from "../../Common/Components/TextArea/TextArea";
import { HistoryOutlined } from "@ant-design/icons";
import CustomDatePicker from "../../Common/Components/CustomDatePicker/CustomDatePicker";
import { useGetAnnoucementMutation } from "../../Utility/Services/UserLoginAPI";
import { useGetUserListMutation } from "../../Utility/Services/UserListAPI";
import moment from "moment";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
import { ToastContainer } from "react-toastify";
import { converToQueryParams } from "../../Common/functions/comman";

const menuPropsAsc = ["Ascending", "Descending"];

const { TextArea } = Input;
const pageSizeOptions = [10, 20, 50, 100, 500, 1000];

function Announcement() {
  message.config({
    maxCount: 1,
    duration: 1.3,
  });

  const navigate = useNavigate();
  const initilaObj = {
    title: "",
    details: "",
    users: [],
    error: {
      title: "",
      details: "",
      users: "",
    },
  };
  // const [sendMessage] = useSendMessageMutation();
  const [data, setDashboardLocalDatard] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [assetName, setAssetName] = useState("");
  const [from_date, setStartDate] = useState("");
  const [to_date, setEndDate] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [isParentChecked, setIsParentChecked] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [allState, setAllState] = useState(initilaObj);
  const [selectedArray, setSelectedArray] = useState([]);
  const [search, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  const [getAnnoucement] = useGetAnnoucementMutation();
  const [getUserList, { userList }] = useGetUserListMutation();
  console.log(userList)
  useEffect(() => {
    const getData = setTimeout(() => {
      getDashboardFn(1, perPage, from_date, to_date, null, search, filter);
    }, 1000);

    return () => clearTimeout(getData);
  }, [search, from_date, to_date, filter]);

  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return <a>Previous</a>;
    }
    if (type === "next") {
      return <a>Next</a>;
    }
    return originalElement;
  };

  // const [getPushNotificationList, { data: user, isLoading }] = useLazyGetPushNotificationListQuery();
  const getDashboardFn = async (
    page,
    size,
    from_date,
    to_date,
    asset_name,
    search,
    filter,
    is_true,
    reset_true
  ) => {
    let payload = {
      page: page,
      size: size,
      
    };

    if (from_date || to_date) {
      if (from_date) {
        payload.from_date = moment(from_date).format("YYYY-MM-DD");
      } else {
        message.info("Please select start date.");
        return false;
      }

      if (to_date) {
        payload.to_date = moment(to_date).format("YYYY-MM-DD");
      } else {
        message.info("Please select end date.");
        return false;
      }
    }

    if (search) {
      let item = search;

      payload.search =
        typeof item != "boolean" ? item?.replace(/^\s+|\s+$/gm, "") : "";
    }

    let params = converToQueryParams(payload);

    let enc = await encryption(JSON.stringify(payload));
    const securedData = { datastring: enc };

    setListLoading(true);
    try {
      let res = await getUserList(params);
      const userData = res?.data;
      setDashboardLocalDatard([]);

      const columnData = userData?.map((item, index) => {
        const clonedItem = { ...item }; // Create a shallow copy of the item object
        let totalAmount = 0;
        if (!reset_true) {
          if (selectedArray.includes(item.user_id)) {
            clonedItem.isChecked = true; // Modify the clonedItem, not the original item
          }

          if (is_true) {
            clonedItem.isChecked = false;
          }
        } else {
          clonedItem.isChecked = false;
        }

        const accordionData = clonedItem.user_wallets?.map((value, i) => {
          totalAmount = totalAmount + value.fiat_amount;

          return {
            coin_family: value.coin_family,
            wallet_name: value.wallet_name,
            coin_name: value.coin_name,
            coin_image: value.coin_image,
            coin_symbol: value,
            wallet_address: value.wallet_address,
            balance: value.balance,
            status: capitalizeWords(value.wallet_status),
          };
        });

        return {
          ...clonedItem, // Add the modified clonedItem to columnData
          key: (userData?.users?.page - 1) * size + (index + 1),
          fiet_balance: totalAmount > 0 ? totalAmount.toFixed(8) : totalAmount,
          created_at: clonedItem.created_at,
          show: true,
          user_wallets: accordionData,
        };
      });
      console.log("userData?.page:::", userData?.page);
      setCurrentPage(userData?.page);
      setTotal(userData?.users?.count);

      setDashboardLocalDatard(columnData ?? []);
      setListLoading(false);

      const isAllChildsChecked = columnData.every(
        (user) => user.isChecked === true
      );

      if (isAllChildsChecked && !is_true) {
        setIsParentChecked(true);
      } else {
        setIsParentChecked(false);
      }

      if (isSelectAll && !reset_true) {
        changeCheckboxStatus(true, "p1", columnData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleChange = (page, perPage) => {
    setCurrentPage(page);
    setPerPage(perPage);
    getDashboardFn(page, perPage, from_date, to_date, assetName, search);
  };
  const changeCheckboxStatus = (checked, id, data) => {
    const myUsers = data;

    myUsers?.map((user) => {
      if (id === "p1") {
        handleValidaton({ ["users"]: true });
        setIsSelectAll(checked);
        user.isChecked = checked;
      } else {
        if (user.user_id === id) {
          handleValidaton({ ["users"]: true });
          user.isChecked = checked;
          if (checked) {
            setIsSelectAll(false);
          }
        }
        const isAllChildsChecked = myUsers?.every(
          (user) => user.isChecked === true
        );
        if (isAllChildsChecked) {
          setIsSelectAll(checked);
        } else {
          setIsSelectAll(false);
        }
      }
      return user;
    });

    setDashboardLocalDatard([...myUsers]);
    // }
  };
  const changeCheckboxCurrentPage = (checked, id, data) => {
    const myUsers = data;
    let arrayIds = selectedArray;
    if (checked) {
      if (selectedArray.length >= 100) {
        message.error("Manually you can select maximum 100 users at one time!");
        return;
      }
    }
    myUsers.map((user, index) => {
      if (id === "p2") {
        handleValidaton({ ["users"]: true });
        setIsParentChecked(checked);
        if (checked) {
          if (arrayIds.length <= 99) {
            if (!arrayIds.includes(user.user_id)) {
              arrayIds.push(user.user_id);
            }
            user.isChecked = checked;
          }
        } else {
          user.isChecked = checked;
          let tempArray = arrayIds.filter((item) => item != user.user_id);
          arrayIds = tempArray;
          setSelectedArray(arrayIds);
        }
      } else {
        if (user.user_id === id) {
          handleValidaton({ ["users"]: true });

          if (checked) {
            if (arrayIds.length <= 99) {
              if (!arrayIds.includes(user.user_id)) {
                arrayIds.push(user.user_id);
              }
              user.isChecked = checked;
            }
          } else {
            user.isChecked = checked;
            let tempArray = arrayIds.filter((item) => item != id);
            arrayIds = tempArray;
            setSelectedArray(arrayIds);
          }
        }
      }
      const isAllChildsChecked = myUsers.every(
        (user) => user.isChecked === true
      );
      if (isAllChildsChecked) {
        setIsParentChecked(checked);
      } else {
        setIsParentChecked(false);
      }
      return user;
    });
    setDashboardLocalDatard([...myUsers]);
  };

  const handleSubmit = async () => {
    const isAnyChecked = data.some((user) => user.isChecked === true);
    const isValid = handleValidaton({
      title: allState.title.trim(),
      details: allState.details.trim(),
      user_id: isAnyChecked ? isAnyChecked : isSelectAll,
    });
    if (isValid) {
      let payload = {
        title: allState.title,
        details: allState.details,
        user_id: isSelectAll ? "ALL" : selectedArray.join(","),
      };
      let enc = await encryption(JSON.stringify(payload));
      const securedData = { datastring: enc };

      setAddLoading(true);
      await getAnnoucement(securedData).then((res) => {
        setAddLoading(false);
        if (res.error) {
          message.error(res.error.data.message);
        } else {
          message.success(res.data.message);
          setAllState({
            ...allState,
            title: "",
            detals: "",
          });
          // setSelectedArray([]);
          // setAllState(initilaObj)
          // setIsSelectAll(false)
          // setIsParentChecked(false);
          // getDashboardFn(currentPage, perPage, from_date, to_date, assetName);
        }
      });
    }
  };
  const setValue = (event) => {
    handleValidaton({ [event.target.name]: event.target.value });
    setAllState({ ...allState, [event.target.name]: event.target.value });
  };
  const handleValidaton = (data) => {
    var error = allState?.error;
    var isValidate = true;
    for (let [key, value] of Object.entries(data)) {
      switch (key) {
        case "title":
          if (value === undefined || value?.length === 0) {
            error[key] = "Title Field Is Required";
            isValidate = false;
          } else if (value.length > 100) {
            error[key] =
              "Title field length should not be greater than 100 characters";
            isValidate = false;
          } else {
            error[key] = "";
          }
          break;
        case "message":
          if (value === undefined || value?.length === 0) {
            error[key] = "Message Field Is Required";
            isValidate = false;
          } else if (value.length > 1000) {
            error[key] =
              "Title field length should not be greater than 1000 characters";
            isValidate = false;
          } else {
            error[key] = "";
          }
          break;
        case "users":
          if (value === undefined || value === false) {
            error[key] = "Please select user!";
            isValidate = false;
          } else {
            error[key] = "";
          }
          break;
        default:
      }
    }
    setAllState({ ...allState, error: { ...error } });
    return isValidate;
  };

  return (
    <div className="pushNotificationSec">
      <div className="add_banner">
        <ToastContainer />
        <div className="filterForm notificationForm">
          <div className="bannerListOneLine">
            <div className="inputLabel">
              <Input
                className="placeholderColor"
                placeholder="Title"
                name="title"
                onChange={(e) => {
                  setValue(e);
                }}
                maxLength={100}
                value={allState.title}
              />
              <p className="error">
                {allState.error.title ||
                  (allState.title.length === 100 &&
                    "Title field length should not be greater than 100 characters")}
              </p>
            </div>
          </div>
          <div className="inputLabel textField">
            <TextArea
              rows={
                allState.details.length > 350
                  ? parseInt(allState.details.length / 60)
                  : 4
              }
              name="message"
              placeholder="Message"
              onChange={(e) => {
                setValue(e);
              }}
              maxLength={1000}
              value={allState.details}
            />
            {allState.details.length === 1000 && (
              <p className="error">
                Message field length should not be greater than 1000 characters
              </p>
            )}
            {allState.error.details ? (
              <p className="error">{allState.error.details}</p>
            ) : (
              <p className="error">{allState.error.user_id}</p>
            )}
          </div>
          <div className="notificationForm_btn">
            <Button
              loading={addLoading}
              htmlType="submit"
              type="primary"
              onClick={() => {
                handleSubmit().then((res) => {
                  console.log("RESP::", res);
                });
              }}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
      <div className="dashboardSec__dashBoardHeading">
        <Spin
          spinning={listLoading}
          className="spininner"
          tip="Loading..."
          size="large"
        >
          <div className="dashbord_upper">
            <div className="innerItemsSearch">
              <div className="filterForm">
                <div className="inputLabel searchBox">
                  <Input
                    className="placeholderColor"
                    placeholder="Search by Wallet Name"
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      // handleSearchChange(e);
                    }}
                    value={search}
                    maxLength={100}
                  />
                  <Input
                    style={{
                      position: "absolute",
                      top: "23px",
                      fill: "#fff",
                      left: "20px",
                      transform: "translateY(-50%)",
                      color: "#999",
                    }}
                  />
                  {search.length === 100 && (
                    <p className="error">
                      {
                        "Search field length should not be greater than 100 characters"
                      }
                    </p>
                  )}
                </div>
                <div
                  className="dateItems"
                  style={{ display: "flex", gap: "10px" }}
                >
                  <div className="inputLabel reactDatePicker">
                    <DatePicker
                      dayPlaceholder="DD"
                      monthPlaceholder="MM"
                      yearPlaceholder="YYYY"
                      value={from_date !== "" ? moment(from_date) : ""}
                      clearIcon={null}
                      //   calendarIcon={<CalendarIcon />}
                      onChange={(date) => {
                        setStartDate(date);
                        setPerPage(10);
                        setCurrentPage(1);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      maxDate={to_date ? to_date : new Date()}
                    />
                  </div>

                  <div className="inputLabel reactDatePicker">
                    <DatePicker
                      placeholder="End Date"
                      value={to_date !== "" ? moment(to_date) : ""}
                      dayPlaceholder="DD"
                      monthPlaceholder="MM"
                      yearPlaceholder="YYYY"
                      clearIcon={null}
                      //   calendarIcon={<CalendarIcon />}
                      onChange={(date) => {
                        setEndDate(date);
                        setPerPage(10);
                        setCurrentPage(1);
                      }}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      minDate={from_date ? from_date : null}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              </div>
              <div className="filter_btn">
                <Button
                  className="btn-light"
                  htmlType="submit"
                  type="primary"
                  onClick={async () => {
                    setCurrentPage(1);
                    setPerPage(10);
                    setSearchTerm("");
                    setAssetName("");
                    setStartDate("");
                    setIsSelectAll(false);
                    setEndDate("");
                    setSelectedArray([]);
                    await getDashboardFn(1, 10, "", "", "", false, true, true);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="checkHistory">
              <div className="checkboxContainer">
                <div>
                  <Checkbox
                    value="all"
                    id="check"
                    onChange={async (e) => {
                      let checked = e.target.checked;
                      if (checked) {
                        if (
                          search !== "" ||
                          from_date !== "" ||
                          to_date !== ""
                        ) {
                          setAssetName("");
                          setStartDate("");
                          setEndDate("");
                          setIsSelectAll(e.target.checked);
                          await getDashboardFn(
                            currentPage,
                            perPage,
                            "",
                            "",
                            "",
                            search
                          );
                        } else {
                          setIsParentChecked(false);
                          setSelectedArray([]);
                          changeCheckboxStatus(e.target.checked, "p1", data);
                        }
                      } else {
                        setIsParentChecked(false);
                        setSelectedArray([]);
                        changeCheckboxStatus(e.target.checked, "p1", data);
                      }
                    }}
                    checked={isSelectAll}
                  />
                  <label
                    style={{ cursor: "pointer" }}
                    className="selectAll"
                    for="check"
                  >
                    {" "}
                    Select All
                  </label>
                </div>
                <p>
                  <span className="selectAll count">
                    (Note: Manually you can select maximum 100 users at one
                    time)
                  </span>
                </p>
              </div>
              <span
                onClick={() => navigate("/notifications")}
                className="hisdata"
              >
                <HistoryOutlined />
                History
              </span>
            </div>
          </div>
          <div className=" action-btn-tabel commonUserTable push-notificationtable">
            <table class="rwd-table ">
              <thead>
                <tr>
                  <th>
                    {data?.length > 0 && (
                      <>
                        <Checkbox
                          value="parent"
                          onChange={(e) =>
                            changeCheckboxCurrentPage(
                              e.target.checked,
                              "p2",
                              data
                            )
                          }
                          checked={isParentChecked}
                          disabled={
                            isSelectAll ||
                            (selectedArray?.length >= 100 && !isParentChecked)
                          }
                        />
                      </>
                    )}
                  </th>
                  <th>S.No.</th>
                  <th>Wallet Name</th>
                  <th>Multichain Portfolio</th>
                  <th></th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.length <= 0 && (
                  <tr class="ant-table-placeholder">
                    <td colspan="7" class="ant-table-cell">
                      <div class="ant-empty ant-empty-normal">
                        <div class="ant-empty-image">
                          <svg
                            class="ant-empty-img-simple"
                            width="64"
                            height="41"
                            viewBox="0 0 64 41"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              transform="translate(0 1)"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <ellipse
                                class="ant-empty-img-simple-ellipse"
                                cx="32"
                                cy="33"
                                rx="32"
                                ry="7"
                              ></ellipse>
                              <g
                                class="ant-empty-img-simple-g"
                                fill-rule="nonzero"
                              >
                                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                <path
                                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                                  class="ant-empty-img-simple-path"
                                ></path>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div class="ant-empty-description">No data</div>
                      </div>
                    </td>
                  </tr>
                )}
                {data.length > 0 &&
                  data.map((item, index) => {
                    if (search != "" && isSelectAll) {
                      item.isChecked = true;
                    }
                    return [
                      <>
                        <tr>
                          <td>
                            <Checkbox
                              checked={item?.isChecked}
                              value="child"
                              onChange={(e) =>
                                changeCheckboxCurrentPage(
                                  e.target.checked,
                                  item.user_id,
                                  data
                                )
                              }
                              disabled={
                                isSelectAll ||
                                (selectedArray.length >= 100 && !item.isChecked)
                              }
                            />
                          </td>
                          <td>{(currentPage - 1) * perPage + (index + 1)}</td>

                          <td>{item.wallet_name ? item.wallet_name : "N/A"}</td>
                          <td>
                            $ {formatNumberUSD(item?.portfolio_balance || 0)}
                          </td>
                          <td>{item.code}</td>
                          <td>{item.created_at}</td>
                        </tr>
                      </>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
          {total > 10 && (
            <Pagination
              itemRender={itemRender}
              pageSize={perPage}
              current={currentPage}
              total={total}
              onChange={(event, size) => {
                handleChange(event, size);
              }}
              style={{ bottom: "0px" }}
              pageSizeOptions={pageSizeOptions}
            />
          )}
        </Spin>
      </div>
    </div>
  );
}

export default Announcement;
