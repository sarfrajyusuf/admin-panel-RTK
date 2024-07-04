import { Spin, Table, Tag } from "antd";
import React, { useEffect } from "react";
import swap from "../../../assets/swap.png";
import sent from "../../../assets/send.png";
import recieve from "../../../assets/receive.png";
import Dapp from "../../../assets/Dapp.png";
import btc from "../../../assets/Bitcoin.png";
import Approve from "../../../assets/approve2.png";
import "./RecentTransactions.scss"
import { useGetLatestTransactionMutation } from "../../../Utility/Services/TransactionsAPI";
import moment from "moment";
import { formatNumber } from "../../functions/comman";

function RecentTransactions() {
  const [getLatestTransaction, { data, isLoading }] = useGetLatestTransactionMutation();

  useEffect(() => {
    latestTransaction();
  }, []);

  const latestTransaction = async () => {
    let data = await getLatestTransaction({
      limit: 5, orderBy: "descending",
    });
  };

  const columns = [
    // {
    //   title: "Type",
    //   dataIndex: "type",
    //   render: (text, record) => (
    //     <div className="tableUserProfile">
    //       {["deposit", "withdraw", "cross_chain", "on_chain", "Swap"].includes(text) && (
    //         <img
    //           src={
    //             text === "deposit" ? recieve : text === "withdraw" ? sent : swap
    //           }
    //           alt=""
    //         />
    //       )}
    //       {["cross_chain", "on_chain", "Swap"].includes(text) && (
    //         <p style={{ textTransform: "capitalize" }}>
    //           <span> Swap <br />{moment(record?.updated_at).format("DD/MM/YYYY hh:mm A")}</span>
    //         </p>
    //       )}
    //       {!["cross_chain", "on_chain", "Swap"].includes(text) && (
    //         <p style={{ textTransform: "capitalize" }}>
    //           <span> {text} <br />{moment(record?.updated_at).format("DD/MM/YYYY hh:mm A")}</span>
    //         </p>
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: "Type",
      dataIndex: "type",
      render: (text, record) => {
        const formatType = (type) => {
          switch (type) {
            case 'withdraw':
              return 'Withdrawal';
            case 'Dapp':
              return 'DApp';
            default:
              return type.charAt(0).toUpperCase() + type.slice(1);
          }
        };

        return (
          <div className="tableUserProfile">
            {["deposit", "withdraw", "cross_chain", "on_chain", "Swap", "dapp", "Approve"].includes(text) && (
              <img
                src={
                  text === "deposit" ? recieve : text === "withdraw" ? sent : text === "dapp" ? Dapp : text === "Approve" ? Approve : swap
                }
                alt=""
              />
            )}
            {["cross_chain", "on_chain", "Swap"].includes(text) && (
              <p style={{ textTransform: "capitalize" }}>
                <span> Swap <br />{moment(record?.updated_at).format("DD/MM/YYYY hh:mm A")}</span>
              </p>
            )}
            {text === "dapp" ? (
              <p style={{ textTransform: "capitalize" }}>
                <span> DApp <br />{moment(record?.updated_at).format("DD/MM/YYYY hh:mm A")}</span>
              </p>
            ) : (
              !["cross_chain", "on_chain", "Swap"].includes(text) && (
                <p style={{ textTransform: "capitalize" }}>
                  <span> {formatType(text)} <br />{moment(record?.updated_at).format("DD/MM/YYYY hh:mm A")}</span>
                </p>
              )
            )}
          </div>
        );
      },
    },
    {
      title: "Wallet Address",
      dataIndex: "",
      render: (text, record) => (
        <p>{record?.type === "deposit" ? record?.to_adrs : record?.from_adrs}</p>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
        <div >
          <div className="amountflex">
            {record?.coin_transation_data?.coin_image ? (
              <img
                style={{ height: 20, borderRadius: 50 }}
                src={record?.coin_transation_data?.coin_image}
                alt="Coin"
              />
            ) :
              ""}
            {formatNumber(text, 4)}
            <span className="coin_symbol">
              {record?.coin_transation_data?.coin_symbol}
            </span>
          </div>

          <div>
            ≈$
            {formatNumber(
              text *
              record?.coin_transation_data?.fiat_price_data?.value,
              2
            )}
            {/* {moment(record?.updated_at).format("MM/DD/YYYY hh:mm A")} */}
          </div>
        </div>
      ),
    },
  ];


  return (
    <Spin spinning={isLoading}>
      <div>
        {" "}
        <h2>Payment Records</h2>
        <Table
          pagination={false}
          scroll={{ x: 400 }}
          columns={columns}
          dataSource={data?.data}
        />
      </div>
    </Spin>
  );
}

export default RecentTransactions;
