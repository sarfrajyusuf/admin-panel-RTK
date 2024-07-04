import React, { useEffect, useState } from "react";
import "./PaymentRecords.scss";
import { Col, Pagination, Row, Table } from "antd";
import {
  ExportOutlined,
  CopyOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import ButtonCustom from "../../../Common/Components/ButtonCustom/ButtonCustom";
import DropdownCustom from "../../../Common/Components/DropdownCustom/DropdownCustom";
import {
  useGetUserTransactionMutation,
  useLazyGetUserDataQuery,
} from "../../../Utility/Services/UserDataListAPI";
import moment from "moment";
import { URL } from "../../../Constant copy/Constant";
import { useLocation } from "react-router-dom";
import { encryption } from "../../../Common/comman_fun";

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};
function PaymentRecords() {
  const location = useLocation();
  const { userData } = location.state;
  const limit = 10;
  const menuPropsType = ["All", "Deposit", "Withdrawal"];
  const menuPropsStatus = ["Confirmed", "Pending", "Failed"];
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [isOpenType, setIsOpenType] = useState(false);
  const [isOpenStatus, setIsOpenStatus] = useState(false);
  const [filter_type, setFilterType] = useState("");
  const [getUserData, { data: userList }] = useLazyGetUserDataQuery();
  const { user_id } = userData;
  const [getUserTransaction, { data: getTransaction }] =
    useGetUserTransactionMutation();

  useEffect(() => {
    if (user_id) {
      getUserData(user_id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await tokenListData();
    };
    fetchData();
  }, [page, statusFilter, filter_type, userList]);

  const tokenListData = async () => {
    if (!userList?.data?.data) {
      return; // Exit early if userList data is not available yet
    }
    let walletAddSet = new Set(); // Using a Set to store unique addresses
    let listing = userList.data.data;

    for (const user of listing) {
      walletAddSet.add(user?.wallet_address); // Adding each address to the set
    }
    let walletAdd = Array.from(walletAddSet); // Converting set back to array if necessary
    let payload = {
      address_list: walletAdd,
      status: statusFilter,
      filter_type: filter_type === "Withdrawal" ? "Withdraw" : filter_type,
      page
    };
    // console.log(payload, "payload::=")
    let enc = await encryption(JSON.stringify(payload));
    console.log("Enc::", payload);
    const securedData = { dataString: enc };
    getUserTransaction(securedData);
  };

  // Function to handle filtering transactions by status
  const handleStatusFilter = (status) => {
    // let orderUpper = status.toLowerCase()
    setStatusFilter(status);
    setIsOpenType(true);
    setPage(1);
  };

  // Function to handle filtering transactions by type
  const handleTypeFilter = (type) => {
    // let orderUpper = type.toLowerCase()
    setFilterType(type);
    setPage(1);
  };

  //Download CSV
  const handleDownloadCSV = () => {
    if (!userList?.data?.data) {
      return; // Exit early if userList data is not available yet
    }
    let walletAddSet = new Set(); // Using a Set to store unique addresses
    let listing = userList.data.data;

    for (const user of listing) {
      walletAddSet.add(user?.wallet_address); // Adding each address to the set
    }

    let walletAdd = Array.from(walletAddSet);
    let commaSeparatedWalletAdd = walletAdd.join(",");
    let filter_type1 = filter_type; // Example initial value
    // Check and replace "withdrawl" with "withdraw"
    if (filter_type === "withdrawl") {
      filter_type = "withdraw";
    }
    const response = `https://api.futurewallet.io/api/v1/admin/users/download?address=${commaSeparatedWalletAdd}&status=${statusFilter}&filter_type=${filter_type1}&type=transaction&page=${page}&limit=${limit}`
    window.open(response);
    return;
  };


  const getExplorerLink1 = (type, value, coinFamily) => {
    switch (coinFamily) {
      case 2: // ETH
        return type === 'address' ? `https://etherscan.io/address/${value}` : `https://etherscan.io/tx/${value}`;
      case 1: // BNB
        return type === 'address' ? `https://bscscan.com/address/${value}` : `https://bscscan.com/tx/${value}`;
      case 6: // TRX
        return type === 'address' ? `https://tronscan.org/#/address/${value}` : `https://tronscan.org/#/transaction/${value}`;
      case 3: // BTC
        return type === 'address' ? `https://btcscan.org/address/${value}` : `https://btcscan.org/tx/${value}`;
      default:
        return '#';
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
    },
    {
      title: "Transaction Type",
      dataIndex: "TranType",
      key: "TranType",
    },
    {
      title: "Asset Name",
      dataIndex: "Chain",
      key: "Chain",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Asset Symbol",
      dataIndex: "Token",
      key: "Token",
    },
    {
      title: "Wallet Address ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Transaction Hash",
      dataIndex: "TranHash",
      key: "TranHash",
    },
    {
      title: "Status",
      key: "Status",
      dataIndex: "Status",
    },
    // {
    //   title: "Price",
    //   key: "Price",
    //   dataIndex: "Price",
    // },
    {
      title: "Crypto Amount",
      key: "Amount",
      dataIndex: "Amount",
    },
    {
      title: "USD Amount",
      key: "Value",
      dataIndex: "Value",
    },

  ];
  // const data = getTransaction?.data?.map((transaction) => {
  //   const {
  //     coin_id: key,
  //     amount,
  //     type,
  //     tx_id,
  //     tx_wallet_address,
  //     fiat_type,
  //     created_at,
  //     coin_transation_data,
  //   } = transaction;

  //   const coinName = coin_transation_data?.coin_name;
  //   const coinSymbol = coin_transation_data?.coin_symbol;
  //   const price = coin_transation_data?.fiat_price_data?.price ?? 0;
  //   const total = price * amount ?? 0;
  //   return {
  //     key: String(key),
  //     Date: moment(created_at).format("DD/MM/YYYY hh:mm A"),
  //     TranType: type,
  //     Chain: coinName,
  //     Token: coinSymbol,
  //     address: tx_wallet_address,
  //     Portfolio: "47.37%",
  //     TranHash: (
  //       <div className="copyIcon">
  //         {tx_id}
  //         <ExportOutlined />
  //       </div>
  //     ),
  //     Price: `$ ${price.toFixed(2)}`,
  //     Amount: amount,
  //     Value: `$ ${total.toFixed(5)}`,
  //   };
  // });
  const data = getTransaction?.data?.map((transaction) => {
    const {
      coin_id: key,
      amount,
      type,
      tx_id,
      tx_wallet_address,
      blockchain_status,
      fiat_type,
      updated_at,
      coin_transation_data,
    } = transaction;
    const coinName = coin_transation_data?.coin_name;
    const coinSymbol = coin_transation_data?.coin_symbol;
    const price = coin_transation_data?.fiat_price_data?.price ?? 0;
    const total = price * amount ?? 0;

    // Determine the appropriate chain for the explorer link
    // const chain = coinSymbol === 'ETH' ? 'ETH' : coinSymbol === 'BNB' ? 'BNB' : 'TRX'; // Adjust logic as needed
    const chain = coinSymbol.toUpperCase() === 'ETH' ? 'ETH'
      : coinSymbol === 'BNB' ? 'BNB'
        : coinSymbol === 'BTC' ? 'BTC'
          : 'TRX';

    const tranType = type.toLowerCase() === 'withdraw' ? 'Withdrawal' : capitalizeFirstLetter(type);

    return {
      key: String(key),
      Date: moment(updated_at).format("DD/MM/YYYY hh:mm A"),
      // TranType: capitalizeFirstLetter(type),
      TranType: tranType,
      Chain: coinName,
      Token: coinSymbol,
      address: (
        <div className="copyIcon">
          {tx_wallet_address.length > 10
            ? tx_wallet_address.substring(0, 15) + "..."
            : tx_wallet_address}
          <a href={getExplorerLink1('address', tx_wallet_address, coin_transation_data?.coin_family)} target="_blank" rel="noopener noreferrer" title={tx_wallet_address}>
            <ExportOutlined />
          </a>
        </div>),
      Portfolio: "47.37%",
      TranHash: (
        <div className="copyIcon">
          {tx_id.length > 10
            ? tx_id.substring(0, 15) + "..."
            : tx_id}
          <a href={getExplorerLink1('tx', tx_id, coin_transation_data?.coin_family)} target="_blank" rel="noopener noreferrer" title={tx_id}>
            <ExportOutlined />
          </a>
        </div>
      ),
      Status: capitalizeFirstLetter(blockchain_status),
      // Price: `$ ${price.toFixed(2)}`,
      Amount: amount.toFixed(4),
      Value: `$ ${total.toFixed(4)}`,
    };
  });

  return (
    <div className="paymentRecords">
      <div className="commonCardBg">
        <div className="paymentRecords_top">
          <h2>Payment Records</h2>

          <Row gutter={[15, 15]}>
            <Col>
              <DropdownCustom
                buttonText="Type"
                menuItems={menuPropsType}
                className="action"
                handleMenuClick={handleTypeFilter}
                isOpen={isOpenType}
                setIsOpen={setIsOpenType}
                value={filter_type}
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
        <div className="paymentRecords_table">
          <Table columns={columns} dataSource={data} pagination={false} />
          <Pagination
            current={page}
            onChange={(e) => { setPage(e), console.log(e) }}
            total={getTransaction?.meta?.total}
            pageSize={limit}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentRecords;
