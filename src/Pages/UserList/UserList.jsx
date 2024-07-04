import React, { useCallback, useEffect, useState } from "react";
import "./UserList.scss";
import { Modal, Pagination, Spin, Table } from "antd";
import { CopyOutlined, DeleteFilled, ExportOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import { toast } from "react-toastify";
import { useGetUserDataListMutation, useLazyDeleteMultiUserQuery, useLazyDeleteUserQuery } from "../../Utility/Services/UserDataListAPI";
import moment from "moment";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
import { encryption } from "../../Common/comman_fun";
import _debounce from "lodash/debounce"; // Import debounce function

const capitalizeFirstLetter = (str) => {
  if (!str) return str; // Handle empty string or null
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const toUppercase = (arr) => arr.map(capitalizeFirstLetter);

function UserList() {
  const limit = 10;
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("Descending");
  const [isOpenAsc, setIsOpenAsc] = useState(false);

  const [getUserDataList, { data, isLoading }] = useGetUserDataListMutation();
  const [deleteUser, { isLoading: deleteLoading }] = useLazyDeleteUserQuery();
  const [deleteMultiUser] = useLazyDeleteMultiUserQuery();

  const menuPropsAsc = ["Ascending", "Descending"];

  useEffect(() => {
    userListData();
  }, [page, search, order]);

  const handleViewUserDetails = (e, user) => {
    e.preventDefault();
    navigate(`/customerDetail/`, { state: { userData: user, totalBalance: user.total_user_balance } });
  };

  const handleDownloadCSV = () => {
    const response = `https://api.futurewallet.io/api/v1/admin/users/exportCsv?search=${search}&limit=${limit}&page=${page}&filter=${order}`;
    console.log(response, "res::")
    window.open(response);
    return;
  };

  const userListData = async () => {
    let payload = { limit, page, search, filter: order };
    let enc = await encryption(JSON.stringify(payload));
    const securedData = { dataString: enc };
    await getUserDataList(securedData);
  };

  const debouncedSearch = useCallback(_debounce((e) => handleSearch(e.target.value), 1000), []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
    userListData();
    // Include any other logic needed to handle search
  }, []);


  const handleInputChange = (value) => {
    setSearch(value);
    debouncedSearch(value);
  };

  const handleOrderFilter = (order) => {
    // let orderUpper = order.toLowerCase();
    setOrder(order);
    setPage(1);
  };

  const modalOpen = (coin_id) => {
    setDeleteModal(true);
    setDeleteId(coin_id);
  };

  const modalOpen2 = () => {
    setDeleteModal(true);
  };

  const handleOk = () => {
    setDeleteModal(false);
  };

  const handleCancel = () => {
    setDeleteModal(false);
  };

  const handleDelete = async () => {
    try {
      if (selectedUsers?.length === 0) {
        if (deleteId) {
          deleteUser(deleteId);
          userListData();
          toast.success("User deleted successfully.");
        }
      } else {
        console.log("HERE")
        const userIdsToDelete = selectedUsers.map(user => user.key);
        console.log("userIdsToDelete", userIdsToDelete)
        await deleteMultiUser({ user_ids: userIdsToDelete }).unwrap();
        userListData();
      }
    } catch (error) {
      console.log("ERr", error)
      toast.error("Failed to delete user. Please try again later.");
    }
    setDeleteModal(false)
  };

  const handleDeleteConfirmation = async (coin_id) => {
    console.log(coin_id, "TESTETS")
    try {
      await deleteUser(coin_id);
      setDeleteModal(false);
      userListData(); // Refresh user list after deletion
      toast.success("User deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete user. Please try again later.");
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "serialNo",
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Wallet Name",
      dataIndex: "walletName",
    },
    {
      title: "Wallet Address",
      dataIndex: "address",
    },
    {
      title: "Multichain Portfolio",
      dataIndex: "mPort",
    },
    {
      title: "ACTIONS",
      dataIndex: "action",
    },
  ];

  function calculateSerialNumber(index) {
    return (page - 1) * limit + index + 1;
  }
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRows, "selectedRows::")
      console.log(selectedRowKeys, "selectedRowKeys::")
      setSelectedUsers(selectedRows);
    },
  };
  const tableData = data?.data?.map((user, index) => {
    const { user_id, wallet_name, address, total_user_balance } = user;
    return {
      key: user_id,
      serialNo: calculateSerialNumber(index),
      date: moment(user?.created_at).format("DD/MM/YYYY hh:mm A"),
      walletName: wallet_name,
      address: (
        <div title={address}>
          {address?.length > 10 ? address.substring(0, 10) + "..." : address}
          <CopyOutlined
            style={{ marginLeft: "6px" }}
            onClick={() => {
              window.navigator.clipboard.writeText(address);
              toast.success("Copied");
            }}
          />
        </div>
      ),
      mPort: total_user_balance,
      action: (
        <div>
          <Link
            className="tableViewBtn"
            onClick={(event) => handleViewUserDetails(event, user)}
          >
            View
          </Link>

          {/* <span className="deleteBtn">
            {selectedUsers?.length < 2 && (
              <DeleteFilled onClick={() => modalOpen(user.user_id)} />
            )}
          </span> */}
        </div>
      ),
    };
  });



  return (
    <div className="userList">
      <div className="commonCardBg">
        <div className="userList_top">
          <InputCustom
            searchInputs
            placeholder="Search By Wallet Name/Wallet Address."
            onChange={handleInputChange}
            value={search}
          />
          <div className="userList_top_btn">
            <DropdownCustom
              buttonText="Ascending"
              menuItems={menuPropsAsc}
              className="action"
              handleMenuClick={handleOrderFilter}
              isOpen={isOpenAsc}
              setIsOpen={setIsOpenAsc}
              value={order}
            />
            <ButtonCustom
              icon={<ExportOutlined />}
              label="Export"
              regularBtn
              className="editBtn"
              onClick={handleDownloadCSV}
            />
            {/* {selectedUsers?.length < 2 ? (
              <>
                <DropdownCustom
                  buttonText="Ascending"
                  menuItems={menuPropsAsc}
                  className="action"
                  handleMenuClick={handleOrderFilter}
                  isOpen={isOpenAsc}
                  setIsOpen={setIsOpenAsc}
                  value={order}
                />
                <ButtonCustom
                  icon={<ExportOutlined />}
                  label="Export"
                  regularBtn
                  className="editBtn"
                  onClick={handleDownloadCSV}
                />
              </>
            ) : (
              <ButtonCustom icon={<DeleteFilled />} label="Delete" redBtn onClick={modalOpen2} />
            )} */}
          </div>
        </div>

        <Spin spinning={isLoading}>
          <Table
            // rowSelection={{
            //   type: selectionType,
            //   ...rowSelection,
            // }}
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
          <Pagination
            current={page}
            onChange={(e) => setPage(e)}
            total={data?.meta?.total}
            pageSize={limit}
            showSizeChanger={false}
          />
        </Spin>
      </div>
      <Modal
        visible={deleteModal}
        onOk={handleDelete}
        onCancel={handleCancel}
        centered
      >
        <div className="deletModal">
          <h4>Do you want to delete user</h4>
          <div className="deletModal_btn">
            <ButtonCustom label="Yes" regularBtn onClick={handleDelete} />
            <ButtonCustom label="No" regularBtn className="deletModal_btn_no" onClick={handleCancel} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserList;
