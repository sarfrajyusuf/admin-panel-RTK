import React, { useEffect, useState } from "react";
import "../PaymentRecords/PaymentRecords.scss";
import { Col, Pagination, Row, Table } from "antd";
import {
  CopyOutlined,
  DeleteFilled,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons"; import DropdownCustom from "../../../Common/Components/DropdownCustom/DropdownCustom";
import ButtonCustom from "../../../Common/Components/ButtonCustom/ButtonCustom";
import { useGetSwapTransactionMutation } from "../../../Utility/Services/UserDataListAPI";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { URL } from "../../../Constant copy/Constant";
import { encryption } from "../../../Common/comman_fun";

const capitalizeFirstLetter = (str) => {
  if (!str) return str; // Handle empty string or null
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const capitalizeLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const toUppercase = (arr) => arr.map(capitalizeFirstLetter);
function SwapTable({ userList }) {
  const limit = 10;
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const [filterType, setFilterType] = useState("");
  const [order, setOrder] = useState("Descending");
  //descending
  const [isOpenType, setIsOpenType] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const location = useLocation();
  const { userData } = location.state;
  const [getSwapTransaction, { data: getswapTransaction }] =
    useGetSwapTransactionMutation();

  // coin_ids":[1,2,6],
  // "wallet_address": "0x3b71ec93c9fe8c59f6200b87ea9526ed05fc0830"

  const { wallet_address, user_id } = userData;
  useEffect(() => {
    tokenListData();
  }, [page, statusFilter, filterType]);

  const tokenListData = async (walletAddress) => {
    let stringFormat = filterType;
    if (stringFormat === "Cross-chain Swap") {
      stringFormat = "cross-chain";
    } else if (stringFormat === "All") {
      stringFormat = "all";
    }
    else if (stringFormat === "On-chain Swap") {
      stringFormat = "on-chain";
    }

    const walletAdd = new Set();
    if (userList?.userList) {
      for (const user of userList.userList) {
        walletAdd.add(user?.wallet_address);
      }
    }

    // Convert the Set to an array
    const uniqueWalletAdd = Array.from(walletAdd);

    let payload = {
      address_list: uniqueWalletAdd,
      status: statusFilter,
      filter_type: stringFormat,
      page
    };

    console.log("encDataL", payload);
    let enc = await encryption(JSON.stringify(payload));
    console.log("Enc::", enc);
    const securedData = { dataString: enc };
    getSwapTransaction(securedData);
  };

  const menuPropsType = ["All", "Cross-chain Swap", "On-chain Swap"];
  const menuPropsStatus = ["Confirmed", "Pending", "Failed"];

  const handleDownloadCSV = () => {
    if (!userList?.userList) {
      return; // Exit early if userList data is not available yet
    }
    let walletAddSet = new Set(); // Using a Set to store unique addresses
    let listing = userList?.userList;

    for (const user of listing) {
      walletAddSet.add(user?.wallet_address); // Adding each address to the set
    }

    let walletAdd = Array.from(walletAddSet);
    let commaSeparatedWalletAdd = walletAdd.join(",");

    const response = `https://api.futurewallet.io/api/v1/admin/users/download?address=${commaSeparatedWalletAdd}&status=${statusFilter}&filter_type=${filterType}&page=${page}&limit=${limit}`
    window.open(response);
    return;
  };

  // Function to handle filtering transactions by status
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setIsOpenType(true);
    setPage(1)
  };

  // Function to handle filtering transactions by type
  const handleTypeFilter = (type) => {
    setFilterType(type);
    setIsOpenType(true);
    setPage(1)
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "From Address",
      dataIndex: "FromCoin",
      key: "FromCoin",
    },
    {
      title: "To Address",
      dataIndex: "ToCoin",
      key: "ToCoin",
    },
    {
      title: "Transaction Hash",
      dataIndex: "TranHash",
      key: "TranHash",
    },
    {
      title: "Amount",
      key: "Amount",
      dataIndex: "Amount",
    },
    {
      title: "Type",
      key: "Type",
      dataIndex: "Type",
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "Status",
    }

  ];

  const getExplorerLink1 = (type, value, coinFamily) => {
    switch (coinFamily) {
      case 2: // ETH
        return type === 'address' ? `https://etherscan.io/address/${value}` : `https://etherscan.io/tx/${value}`;
      case 1: // BNB
        return type === 'address' ? `https://bscscan.com/address/${value}` : `https://bscscan.com/tx/${value}`;
      case 6: // TRX
        return type === 'address' ? `https://tronscan.org/#/address/${value}` : `https://tronscan.org/#/transaction/${value}`;
      case 3: // BTC
        return type === 'address' ? `https://btcscan.org/address/${value}` : `https://btcscan.org/address/${value}`;
      default:
        return '#';
    }
  };

  const data1 = getswapTransaction?.data?.map((transaction, i) => {
    const {
      coin_id: key,
      from_adrs,
      to_adrs,
      amount,
      blockchain_status,
      tx_id,
      coin_family,
      updated_at,
      type,
      created_at,
    } = transaction;
    const coinSymbol = transaction?.coin_transation_data?.coin_symbol;
    const displayType = (type) => {
      return type === "cross-chain" ? "Cross-Chain Swap" : type === "on-chain" ? "On-Chain Swap" : capitalizeFirstLetter(type);
    };
    return {
      key: String(key),
      Date: (
        <p>
          {moment(updated_at).format("DD/MM/YYYY hh:mm A")}
        </p>
      ),
      FromCoin: (
        <div className="copyIcon" title={from_adrs}>
          {from_adrs.length > 10 ? from_adrs.substring(0, 15) + "..." : from_adrs}
          <a href={getExplorerLink1('address', from_adrs, coin_family)} target="_blank" rel="noopener noreferrer" title={from_adrs}>
            <ExportOutlined />
          </a>
        </div>),
      ToCoin: (
        <div className="copyIcon" title={to_adrs}>
          {to_adrs.length > 10 ? to_adrs.substring(0, 15) + "..." : to_adrs}
          <a href={getExplorerLink1('address', to_adrs, coin_family)} target="_blank" rel="noopener noreferrer" title={to_adrs}>
            <ExportOutlined />
          </a>
        </div>),
      Status: capitalizeLetter(blockchain_status),
      Type: displayType(type),
      Amount: amount.toFixed(4),
      TranHash: (
        <div className="copyIcon" title={tx_id}>
          {tx_id.length > 20 ? tx_id.substring(0, 20) + "..." : tx_id}
          <a href={getExplorerLink1('transaction', tx_id, coin_family)} target="_blank" rel="noopener noreferrer">
            <ExportOutlined />
          </a>
        </div>
      ),

    }

  })

  const data = [
    {
      key: "1",
      Date: "24/04/2024",
      FromCoin: "USDC (USDC)",
      ToCoin: "sa+fd",
      Amount: "45,455.8842",
      TranHash: (
        <div className="copyIcon">
          x833n......dnn487dnj
          <ExportOutlined />
        </div>
      ),
    },
  ];
  return (
    <div className="paymentRecords">
      <div className="commonCardBg">
        <div className="paymentRecords_top">
          <h2>Payment Records</h2>
          <Row gutter={[15, 15]}>
            <Col>
              <DropdownCustom
                buttonText="Type"
                menuItems={toUppercase(menuPropsType)}
                className="action"
                handleMenuClick={handleTypeFilter}
                isOpen={isOpenType}
                setIsOpen={setIsOpenType}
                value={filterType}
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
              <ButtonCustom
                regularBtn
                label="Download CSV"
                className="downloadcsv"
                onClick={handleDownloadCSV}
              />
            </Col>
          </Row>
        </div>
        <div>
          <Table columns={columns} dataSource={data1} pagination={false} />
          <Pagination
            current={page}
            onChange={(e) => setPage(e)}
            total={getswapTransaction?.meta?.total}
            pageSize={limit}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}

export default SwapTable;
