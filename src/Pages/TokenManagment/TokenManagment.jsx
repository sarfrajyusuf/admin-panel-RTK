import React, { useCallback, useEffect, useState } from "react";
import { Modal, Pagination, Spin, Table } from "antd";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import "./TokenManagment.scss";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
import {
  useAddNewTokenMutation,
  useLazyDeleteTokenQuery,
  useLazyGetTokenListQuery,
  useTokenSearchMutation,
} from "../../Utility/Services/TokenManagmentAPI";
import moment from "moment";
import { useAddTokenMutation } from "../../Utility/Services/AddTokenAPI";
import { converToQueryParams } from "../../Common/functions/comman";
import { toast } from "react-toastify";
import _debounce from "lodash/debounce"; // Import debounce function
import { CopyOutlined } from "@ant-design/icons";
import { encryption } from "../../Common/comman_fun";
import bnb1 from "../../assets/bnb1.png";
import tron from "../../assets/tron.png";
import ethereum from "../../assets/ethereum.png";


const menuData = [
  {
    value: 1,
    displayValue: "BNB",
  },
  {
    value: 2,
    displayValue: "ETH",
  },
  {
    value: 6,
    displayValue: "TRX",
  },
];
// const menuPropsType = [
//   {
//     value: 1,
//     displayValue: "ETH (ERC20)",
//   },
//   {
//     value: 2,
//     displayValue: "BSC(BEP20)",
//   },
//   {
//     value: 6,
//     displayValue: "TRON (TRC20)",
//   },
// ];
const menuPropsType = ["ERC20", "TRC20", "BEP20"];

const limit = 10;

function TokenManagment() {
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isOpenType, setIsOpenType] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const [selectChain, setSelectChain] = useState("");
  const [selectChainLabel, setSelectChainLabel] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [decimal, setDecimal] = useState("");
  const [symbol, setSymbol] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  // const [selectMenu, setSelectMenu] = useState("");
  const [error, setError] = useState("");
  // const [selectChainLabel, setSelectChainLabel] = useState("");
  const [isSearching, setIsSearching] = useState(false); // State for loading indicator

  // const { addtoken } = useAddTokenMutation();
  const [getTokenList, { data: token, isLoading }] = useLazyGetTokenListQuery();
  const [tokenSearch, { data: searchedToken, isLoading1 }] = useTokenSearchMutation();
  const [addNewToken, { isLoading: addNewLoading }] = useAddNewTokenMutation();
  const [deleteToken, { isLoading: deleteLoading }] = useLazyDeleteTokenQuery();

  const showModal = () => {
    setVisible(true);
  };
  const modalOpen = (coin_id) => {
    setDeleteModal(true);
    setDeleteId(coin_id);
    // setDeleteItem(token);
  };

  useEffect(() => {
    tokenListData();
  }, [search, type, page]);

  const handleTypeFilter = (type) => {
    setType(type);
    setPage(1);
  };
  // const handleSearch = (searchValue) => {
  //   const trimmedSearchValue = searchValue.trim();
  //   setSearch(trimmedSearchValue);
  //   setPage(1);
  //   tokenListData();
  // };


  const debouncedSearch = useCallback(_debounce((e) => handleSearch(e.target.value), 3000), []);

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
    tokenListData();
  }, []);


  const handleInputChange = (value) => {
    setSearch(value);
    tokenListData();
    debouncedSearch(value);
  };
  // Debounce the handleSearch function
  // const debouncedSearch = _debounce(handleSearch, 500);
  const handleDeleteConfirmation = async (coin_id) => {
    try {
      await deleteToken(coin_id);
      setDeleteConfirm(false);
      await getTokenList(); // Refresh token list after deletion
      // setDeleteItem(null);
      setDeleteModal(false); // Close the delete modal
      toast.success("Token deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete token. Please try again later.");
    }
  };

  const handleOk = () => {
    setVisible(false);
    setDeleteModal(false);
  };

  const handleCancel = () => {
    setSelectChain("")
    setTokenAddress(""); // Reset tokenAddress
    setTokenName(""); // Reset tokenName
    setSymbol(""); // Reset symbol
    setDecimal(""); // Reset decimal
    setSelectChainLabel("")
    setVisible(false);
    setDeleteModal(false);
  };

  const tokenListData = async () => {
    let payload = {
      limit,
      page,
      searchBy: search,
      token_type: type,
    };
    let params = converToQueryParams(payload);
    getTokenList(params);
  };

  const handleClick = (e) => {
    setSelectChain(e.value);
    setSelectChainLabel(e.displayValue);
    setTokenName(""); // Clear token name when chain changes
  };

  // const handleContractAddressChange = (e) => {
  //   setTokenAddress(e.target.value);
  // };

  const handleContractAddressChange = async (e) => {
    const value = e.target.value;
    setTokenAddress(value);
    if (value) {
      setIsSearching(true); // Start loading
      try {
        const response = await tokenSearch({ address: value });
        const tokenData = response.data;
        if (tokenData) {
          setTokenName(tokenData.name);
          setSymbol(tokenData.symbol);
          setDecimal(tokenData.decimals);
        } else {
          setTokenName("");
          setSymbol("");
          setDecimal("");
        }
      } catch (error) {
        setTokenName("");
        setSymbol("");
        setDecimal("");
        toast.error("Failed to fetch token details.");
      } finally {
        setIsSearching(false); // Stop loading
      }
    } else {
      setTokenName("");
      setSymbol("");
      setDecimal("");
    }
  };


  const handleSubmit = async () => {
    try {
      // Perform form validation
      if (!selectChain) {
        toast.error("Please Select a Network.");
        return;
      }

      if (!tokenAddress) {
        toast.error("Please Enter a Contract Address.");
        return;
      }

      if (!symbol) {
        toast.error("Please enter the Symbol.");
        return;
      }

      if (!decimal || isNaN(decimal)) {
        toast.error("Please enter a valid number for decimals.");
        return;
      }

      // Proceed with submitting the form if validation passes
      const tokenType =
        selectChain === 1 ? "BEP20" : selectChain === 2 ? "ERC20" : "TRC20";

      const tokenData = {
        coin_family: selectChain,
        token_address: tokenAddress,
        name: tokenName,
        symbol,
        decimals: decimal,
        token_type: tokenType,
      };
      let enc = await encryption(JSON.stringify(tokenData));
      const securedData = { dataString: enc };
      const response = await addNewToken(securedData);
      // Extract the message from the response
      const message = response?.data?.message;

      // Close the modal after submission
      setVisible(false);
      setSelectChain("")
      setSelectChainLabel("")
      setTokenAddress(""); // Reset tokenAddress
      setTokenName(""); // Reset tokenName
      setSymbol(""); // Reset symbol
      setDecimal(""); // Reset decimal
      toast.success(message);
      getTokenList();
    } catch (error) {
      // Handle error if submission fails
      console.error("Error adding token:", error);
      toast.error("Somthing Went Wrong");
    }
  };
  useEffect(() => {
    let timeoutId;

    // Check if both selectChain and tokenAddress have valid values
    if (selectChain && tokenAddress) {
      // Delay execution by 500 milliseconds
      timeoutId = setTimeout(() => {
        tokenSearch({ coinFamily: selectChain, tokenAddress })
          .then((response) => {
            // Update token name based on response
            setTokenName(response?.data?.data?.name);
            setDecimal(response?.data?.data?.decimals);
            setSymbol(response?.data?.data?.symbol);

            // Call handleSubmit after retrieving token information
            // handleSubmit();
          })
          .catch((error) => {
            // Handle error
            console.error("Error searching token:", error);
          });
      }, 1000); // Adjust the delay time as needed
    }

    return () => clearTimeout(timeoutId); // Clear timeout on cleanup

  }, [selectChain, tokenAddress, tokenSearch]);

  const columns = [
    {
      title: "Token",
      dataIndex: "Token",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Token Contract Address",
      dataIndex: "ContractAddress",
    },
    {
      title: "Token Network",
      dataIndex: "TokenType",
    },
    {
      title: "Date",
      dataIndex: "Date",
    },
    {
      title: "Action",
      dataIndex: "Action",
    },
  ];
  const data = token?.data?.map((token) => {
    const {
      coin_id: key,
      coin_image,
      coin_name,
      coin_symbol,
      token_address,
      coin_family,
      token_type,
      updated_at,
      createdAt,
    } = token;
    console.log(coin_family, "tretr::")
    const contractAddress = token_address
      ? `${token_address.substring(0, 6)}...${token_address.substring(
        token_address.length - 6
      )}`
      : "N/A";
    return {
      key: String(key),
      Token: (
        <div className="tableUserProfile">
          {!coin_image ? (
            coin_family === 1 ? (
              <img src={bnb1} alt={coin_name} />
            ) : coin_family === 2 ? (
              <img src={ethereum} alt={coin_name} />
            ) : coin_family === 6 ? (
              <img src={tron} alt={coin_name} />
            ) : (
              <p>Image Unavailable</p>
            )
          ) : (
            <img src={coin_image} alt={coin_name} />

          )}
          {/* <img src={coin_image} alt={coin_name} /> */}
          <p>
            {coin_name} ({coin_symbol.toUpperCase()})
          </p>
        </div>
      ),
      ContractAddress: (<span title={token_address}>{contractAddress || "N/A"}</span>),

      TokenType: token_type || "N/A",
      Date: <p>{moment(updated_at).format("DD/MM/YYYY hh:mm A")}</p>,
      Action: (
        <div className="delteBtn">
          <DeleteFilled onClick={() => modalOpen(token?.coin_id)} />
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
            placeholder="Search By Token Name / Token Symbol"
            onChange={handleInputChange}
            value={search}
          />

          <div className="userList_top_btn">
            <DropdownCustom
              buttonText="Token Type"
              menuItems={menuPropsType}
              className="action"
              handleMenuClick={handleTypeFilter}
              isOpen={isOpenType}
              setIsOpen={setIsOpenType}
              value={type}
            />
            <ButtonCustom
              icon={<PlusOutlined />}
              label="Add New"
              regularBtn
              onClick={showModal}
            />
          </div>
        </div>

        <Spin spinning={isLoading}>
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination
            current={page}
            onChange={(e) => setPage(e)}
            total={token?.meta?.total}
            pageSize={limit}
            showSizeChanger={false}
          />
        </Spin>
      </div>
      <div>
        <Modal
          title="Add Custom Token"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          centered
        >
          <div className="tokenModal">
            <DropdownCustom
              buttonText="Select Network"
              menuItems={menuData}
              className="action"
              handleMenuClick={handleClick}
              isOpen={isOpenFilter}
              setIsOpen={setIsOpenFilter}
              value={selectChainLabel}
            />
            <InputCustom
              label
              labletext="Contract Address"
              regularInput
              placeholder="Contract Address"
              onChange={handleContractAddressChange}
              value={tokenAddress}
            />
            {isSearching && <Spin />} {/* Show loader while searching */}

            <InputCustom
              label
              labletext="Token Name"
              regularInput
              placeholder="Token Name"
              value={tokenName} // Display token name
              disabled // Disable editing
            />
            <div className="tokenModal_symbol">
              <InputCustom
                label
                labletext="Symbol"
                regularInput
                placeholder="Symbol"
                value={symbol} // Display token name
                disabled
              />
              <InputCustom
                label
                labletext="Decimals"
                regularInput
                placeholder="Decimals"
                value={decimal} // Display token name
                disabled
              />
            </div>
            <ButtonCustom
              label="Done"
              regularBtn
              className="announcement_top_sendBtn"
              onClick={handleSubmit}
            />
          </div>
        </Modal>
        <Modal
          visible={deleteModal}
          onOk={() => handleDeleteConfirmation(deleteId)}
          onCancel={handleCancel}
          centered
        >
          <div className="deletModal">
            <h4>Do you want to Delete token?</h4>
            <div className="deletModal_btn">
              <ButtonCustom
                label="Yes"
                regularBtn
                onClick={() => handleDeleteConfirmation(deleteId)}
              />
              <ButtonCustom
                label="No"
                regularBtn
                className="deletModal_btn_no"
                onClick={handleCancel}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
export default TokenManagment;
