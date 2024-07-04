import { Col, Pagination, Row, Spin, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import "./TransactionHistory.scss";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import { CopyOutlined } from "@ant-design/icons";
import { useGetLatestTransactionMutation } from "../../Utility/Services/TransactionsAPI";
import moment from "moment";
import { formatNumber, toFixedVal } from "../../Common/functions/comman";
import { toast } from "react-toastify";
import { URL } from "../../Constant copy/Constant";
import _debounce from "lodash/debounce"; // Import debounce function
import { encryption } from "../../Common/comman_fun";

const limit = 10;

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const menuPropsType = ["All", "Deposit", "Withdrawal", "Swap", "DApp"];
const menuPropsStatus = ["All", "Confirmed", "Pending", "Failed"];
const menuPropsEntity = ["Date Order", "Usd Amount", "Crypto Amount"];
const menuPropsAsc = ["Ascending", "Descending"];
const menuPropsFilter = [
  "All",
  "From Address",
  "To Address",
  "Asset Name",
  "Hash",
];

//searchBy: for serach
function TransactionHistory() {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");

  const [searchValue, setSearchValue] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [type, setType] = useState("");
  const [order, setOrder] = useState("Descending");
  //descending
  const [isOpenType, setIsOpenType] = useState(false);
  const [isOpenEntity, setisOpenEntity] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);

  const [isOpenAsc, setIsOpenAsc] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [getLatestTransaction, { data, isLoading }] =
    useGetLatestTransactionMutation();

  useEffect(() => {
    latestTransaction();
  }, [page, type, searchValue, statusFilter, order, entityFilter]);

  const latestTransaction = async () => {
    let formattedFilter = searchFilter;

    // Format specific cases
    if (searchFilter === "From Address") {
      formattedFilter = "FromAddress";
    } else if (searchFilter === "To Address") {
      formattedFilter = "ToAddress";
    } else if (searchFilter === "Asset Name") {
      formattedFilter = "CoinName";
    } else if (searchFilter === "") {
      formattedFilter = "All";
    }

    let stringFormat = entityFilter;
    if (entityFilter === "Date Order") {
      stringFormat = "DateOrder";
    } else if (entityFilter === "Usd Amount") {
      stringFormat = "UsdAmount";
    } else if (entityFilter === "Crypto Amount") {
      stringFormat = "CryptoAmount";
    }
    // else if (entityFilter === "") {
    //   stringFormat = "All";
    // }

    let payload = {
      limit,
      page,
      status: statusFilter,
      trnx_type: type === "Withdrawal" ? "Withdraw" : type,
      searchBy: searchValue,
      // filterType: searchFilter === "" ? "All" : searchFilter,
      filterType: formattedFilter,
      entity_type_order: order,
      entity_type: stringFormat,
    };
    console.log("Enc::", payload);
    let enc = await encryption(JSON.stringify(payload));
    console.log("after", enc);
    const securedData = { dataString: enc };
    getLatestTransaction(securedData);
  };
  const getExplorerLink = (type, value, coinFamily) => {
    console.log(coinFamily, "-=-=-=");
    switch (coinFamily) {
      case 2: // ETH
        return type === "address"
          ? `https://etherscan.io/address/${value}`
          : `https://etherscan.io/tx/${value}`;
      case 1: // BNB
        return type === "address"
          ? `https://bscscan.com/address/${value}`
          : `https://bscscan.com/tx/${value}`;
      case 6: // TRX
        return type === "address"
          ? `https://tronscan.org/#/address/${value}`
          : `https://tronscan.org/#/transaction/${value}`;
      case 3: // BTC
        return type === "address"
          ? `https://www.blockchain.com/btc/address/${value}`
          : `https://www.blockchain.com/btc/tx/${value}`;
      default:
        return "#";
    }
  };
  const columns = [
    {
      title: "From",
      dataIndex: "from_adrs",
      key: "from_adrs",
      render: (text, record) => (
        <div className="copyIcon">
          <a
            href={getExplorerLink(
              "address",
              record.from_adrs,
              record?.coin_family
            )}
            target="_blank"
            rel="noopener noreferrer"
            title={record.from_adrs}
          >
            {record?.from_adrs.length > 10
              ? record.from_adrs.substring(0, 10) + "..."
              : record.from_adrs}
          </a>
          <CopyOutlined
            onClick={() => {
              window.navigator.clipboard.writeText(record.from_adrs);
              toast.success("Copied");
            }}
          />
        </div>
      ),
    },

    {
      title: "To",
      dataIndex: "to_adrs",
      key: "to_adrs",
      render: (text, record) => (
        <div className="copyIcon">
          <a
            href={getExplorerLink(
              "address",
              record.to_adrs,
              record?.coin_family
            )}
            target="_blank"
            rel="noopener noreferrer"
            title={record.to_adrs}
          >
            {record?.to_adrs.length > 10
              ? record.to_adrs.substring(0, 10) + "..."
              : record.to_adrs}
          </a>
          <CopyOutlined
            onClick={() => {
              window.navigator.clipboard.writeText(record.to_adrs);
              toast.success("Copied");
            }}
          />
        </div>
      ),
    },
    {
      title: "Asset Name",
      dataIndex: "coin_data?.coin_symbol",
      key: "coin_data?.coin_symbol",
      render: (text, record) => (
        <span>{record?.coin_transation_data?.coin_name}</span>
      ),
    },
    {
      title: "Crypto Amount",
      key: "amount",
      dataIndex: "amount",
      render: (text, record) => <span>{formatNumber(record?.amount, 6)}</span>,
    },
    {
      title: "USD Amount",
      key: "USDAmount",
      dataIndex: "USDAmount",
      // render: (text, record) => (record?.usd_amount),
      render: (text, record) => (
        <span>$ {toFixedVal(record?.usd_amount, 2)}</span>
      ),
    },
    // {
    //   title: "Hash",
    //   key: "tx_id",
    //   dataIndex: "tx_id",
    //   render: (text, record) => (
    //     <div className="copyIcon">
    //       {record?.from_adrs.length > 10
    //         ? <a href={record.from_adrs} target="_blank" rel="noopener noreferrer">{record.from_adrs.substring(0, 10) + "..."}</a>
    //         : <a href={record.from_adrs} target="_blank" rel="noopener noreferrer">{record.from_adrs}</a>}
    //       <CopyOutlined
    //         onClick={() => {
    //           window.navigator.clipboard.writeText(text);
    //           toast.success("Copied");
    //         }}
    //       />
    //     </div>
    //   ),

    // },
    {
      title: "Hash",
      key: "tx_id",
      dataIndex: "tx_id",
      render: (text, record) => (
        <div className="copyIcon">
          <a
            href={getExplorerLink(
              "transaction",
              record.tx_id,
              record?.coin_family
            )}
            target="_blank"
            rel="noopener noreferrer"
            title={record.tx_id}
          >
            {record?.tx_id.length > 20
              ? record.tx_id.substring(0, 20) + "..."
              : record.tx_id}
          </a>
          <CopyOutlined
            onClick={() => {
              window.navigator.clipboard.writeText(record.tx_id);
              toast.success("Copied");
            }}
          />
        </div>
      ),
    },

    {
      title: "Blockchain Status",
      key: "blockchain_status",
      dataIndex: "blockchain_status",
      render: (text, record) => (
        <span>{capitalizeFirstLetter(record?.blockchain_status)}</span>
      ),
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      render: (text, record) => {
        console.log(text);
        const displayText =
          text === "withdraw"
            ? "Withdrawal"
            : text === "dapp"
              ? "DApp"
              : capitalizeFirstLetter(text);
        return <span>{displayText}</span>;
      },
    },

    // {
    //   title: "Type",
    //   key: "type",
    //   dataIndex: "type",
    //   render: (text, record) => {
    //     const displayText = text === 'withdraw' ? 'Withdrawal' : capitalizeFirstLetter(text);
    //     return <span>{displayText}</span>;
    //   },
    // },

    {
      title: "Date",
      key: "Date",
      dataIndex: "Date",
      render: (text, record) => (
        <p>{moment(record?.created_at).format("DD/MM/YYYY hh:mm A")}</p>
      ),
      // <a>moment(record?.created_at).format("DD/MM/YYYY hh:mm")</a>}),
      // moment(record?.created_at).format("MM/DD/YYYY hh:mm")
    },
  ];

  // Function to handle downloading CSV file
  // const handleDownloadCSV = () => {
  //   let entityFilter1 = entityFilter;

  //   // Format specific cases
  //   if (entityFilter === "Date Order") {
  //     entityFilter1 = "DateOrder";
  //   } else if (entityFilter === "Crypto Amount") {
  //     entityFilter1 = "CryptoAmount";
  //   } else if (entityFilter === "Usd Amount") {
  //     entityFilter1 = "UsdAmount";
  //   }
  //   let type = "withdrawl"; // Example initial value
  //   if (type === "withdrawl") {
  //     type = "withdraw";
  //   }
  //   let searchFilter1 = searchFilter; // Example initial value

  //   if (searchFilter === "Asset Name") {
  //     searchFilter = "CoinName";
  //   }
  //   if (searchFilter === "From Address") {
  //     searchFilter = "FromAddress";
  //   } else if (searchFilter === "To Address") {
  //     searchFilter = "ToAddress";
  //   }
  //   const response = `https://api.futurewallet.io/api/v1/admin/transaction/download?trnx_type=${type}&status=${statusFilter}&searchBy=${searchValue}&filterType=${searchFilter1}&entity_type_order=${order}&entity_type=${entityFilter1}&page=${page}&limit=${limit}`;
  //   console.log(response);
  //   window.open(response);
  //   return;
  // };

  const handleDownloadCSV = () => {
    let entityFilter1 = entityFilter;

    // Format specific cases
    if (entityFilter === "Date Order") {
      entityFilter1 = "DateOrder";
    } else if (entityFilter === "Crypto Amount") {
      entityFilter1 = "CryptoAmount";
    } else if (entityFilter === "Usd Amount") {
      entityFilter1 = "UsdAmount";
    }

    let type1 = type; // Example initial value

    if (type === "withdrawl") {
      type1 = "withdraw"; // Changed from type to type1
    } 
    // else if (type === "deposite") {
    //   type1 = "deposite"; // Changed from type to type1
    // } else if (type === "DApp") {
    //   type1 = "DApp"; // Changed from type to type1
    // }

    let searchFilter1 = searchFilter; // Example initial value

    if (searchFilter === "Asset Name") {
      searchFilter1 = "CoinName";
    } else if (searchFilter === "From Address") {
      searchFilter1 = "FromAddress";
    } else if (searchFilter === "To Address") {
      searchFilter1 = "ToAddress";
    }

    const response = `https://api.futurewallet.io/api/v1/admin/transaction/download?trnx_type=${type1}&status=${statusFilter}&searchBy=${searchValue}&filterType=${searchFilter1}&entity_type_order=${order}&entity_type=${entityFilter1}&page=${page}&limit=${limit}`;
    console.log(response);
    window.open(response);
  };


  // Function to handle filtering transactions by status
  const handleStatusFilter = (status) => {
    // let statusU = status.toLowerCase()
    setStatusFilter(status);
    setPage(1);
  };

  // Function to handle filtering transactions by type
  const handleTypeFilter = (type) => {
    // let toLower = type.toLowerCase()
    setType(type);
    setPage(1);
  };

  // Function to handle searching transactions
  const handleSearchFilter = (search) => {
    // let toLower = search.toLowerCase()
    setSearchFilter(search);
    setSearchValue("");
    setEntityFilter("");
    setOrder("");
    setType("");
    setStatusFilter("");
    setPage(1);
    latestTransaction();
  };

  // Function to handle ordering transactions
  const handleOrderFilter = (order) => {
    // let toLower = order.toLowerCase()
    setOrder(order);
    setPage(1);
  };
  // Function to handle searching transactions by a specific value
  // const handleSearch = (searchValue) => {
  //   const trimmedSearchValue = searchValue.trim();
  //   setSearchValue(trimmedSearchValue);
  //   setEntityFilter("")
  //   setOrder("")
  //   setType("")
  //   setStatusFilter("")
  //   setPage(1);
  //   latestTransaction();
  // };

  const handleSelectEntity = (select) => {
    // let toLower = select.toLowerCase()
    setEntityFilter(select);
    setPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter("");
    setType("");
    setSearchFilter("");
    setOrder("");
    setSearchValue("");
    setEntityFilter("");
    setPage(1);
  };
  // const debouncedSearch = _debounce(handleSearch, 500);
  const debouncedSearch = useCallback(
    _debounce((e) => handleSearch(e.target.value), 1000),
    []
  );

  const handleSearch = useCallback((value) => {
    setSearchValue(value);
    setPage(1);
    setEntityFilter("");
    setOrder("");
    setType("");
    setStatusFilter("");
    setPage(1);
    latestTransaction();
    // Include any other logic needed to handle search
  }, []);

  const handleInputChange = (value) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="transactionHistory">
      <div className="commonCardBg">
        <div className="transactionHistory_top">
          <h2>Transaction History</h2>
        </div>
        <div className="transactionHistory_filters">
          <Row gutter={[15, 15]} className="no-wrap-row">
            <Col>
              <DropdownCustom
                buttonText="Filter"
                menuItems={menuPropsFilter}
                className="action"
                handleMenuClick={handleSearchFilter}
                isOpen={isOpenFilter}
                setIsOpen={setIsOpenFilter}
                value={searchFilter}
              />
            </Col>
            <Col>
              {/* <InputCustom
                searchInputs
                // onChange={debouncedSearch}
                onChange={(e)=>setSearchValue(e.target.value)}
                placeholder="Search Transactions"
                value={searchValue}
              /> */}
              <InputCustom
                searchInputs
                value={searchValue} // Pass the state value
                onChange={handleInputChange} // Pass the input change handler
                placeholder="Search Transactions"
              />
            </Col>
          </Row>

          <Row gutter={[15, 15]}>
            <Col>
              <DropdownCustom
                buttonText="Type"
                menuItems={menuPropsType}
                className="action"
                handleMenuClick={handleTypeFilter}
                isOpen={isOpenType}
                setIsOpen={setIsOpenType}
                value={type}
              />
            </Col>
            <Col>
              <DropdownCustom
                buttonText="Status"
                menuItems={menuPropsStatus}
                className="action"
                handleMenuClick={handleStatusFilter}
                isOpen={isOpenStatus}
                setIsOpen={setIsOpenStatus}
                value={statusFilter}
              />
            </Col>
            <Col>
              <DropdownCustom
                buttonText="Select Entity"
                menuItems={menuPropsEntity}
                className="action"
                isOpen={isOpenEntity}
                setIsOpen={setisOpenEntity}
                handleMenuClick={handleSelectEntity}
                value={entityFilter}
              />
            </Col>

            <Col>
              <DropdownCustom
                buttonText="Ascending"
                menuItems={menuPropsAsc}
                className="action"
                handleMenuClick={handleOrderFilter}
                isOpen={isOpenAsc}
                setIsOpen={setIsOpenAsc}
                value={order}
              />
            </Col>
            <Col>
              <div className="downloadReset">
                <ButtonCustom
                  regularBtn
                  label="Download CSV"
                  className="downloadcsv"
                  onClick={handleDownloadCSV}
                />
                <ButtonCustom
                  label="Reset"
                  regularBtn
                  onClick={handleResetFilters}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div>
          <Spin spinning={isLoading}>
            <Table
              columns={columns}
              dataSource={data?.data}
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
      </div>
    </div>
  );
}

export default TransactionHistory;
