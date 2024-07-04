import React, { useEffect } from "react";
import "../PaymentRecords/PaymentRecords.scss";
import { Col, Row, Table } from "antd";
import DropdownCustom from "../../../Common/Components/DropdownCustom/DropdownCustom";
import { useLazyGetReferralQuery } from "../../../Utility/Services/ReferralApi";

function ReferralTable({ userList }) {
  console.log(userList, "user::==>")
  const menuPropsType = ["deposit", "withdraw", "swap"];
  const menuPropsStatus = ["confirmed", "pending", "failed"];

  const [getReferral, { da }] = useLazyGetReferralQuery();

  console.log(da, "rrrr::")

  useEffect(() => {
    let walletAdd
    if (userList?.userList) {
      for (const user of userList.userList) {
        walletAdd = user?.user_id
      }
    }
    getReferral(walletAdd)
  }, [])

  const columns = [
    {
      title: "Chain",
      dataIndex: "Chain",
      key: "Chain",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Token",
      dataIndex: "Token",
      key: "Token",
    },
    {
      title: "Wallet Address ",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Price",
      key: "Price",
      dataIndex: "Price",
    },
    {
      title: "Amount",
      key: "Amount",
      dataIndex: "Amount",
    },
    {
      title: "Total Value",
      key: "Value",
      dataIndex: "Value",
    },
  ];
  const data = [
    {
      key: "1",
      Chain: "BNB",
      Token: "USDC (USDC)",
      address: "djb2d5as4dasd2as1s54dasdda",
      Portfolio: "47.37%",
      Price: "$0.9999316",
      Amount: "45,455.8842",
      Value: "$0.9999316",
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
                menuItems={menuPropsType}
                className="action"
              // handleMenuClick={handleTypeFilter}
              // isOpen={isOpenType}
              // setIsOpen={setIsOpenType}
              // value={type}
              />
            </Col>
            <Col>
              <DropdownCustom
                buttonText="Status"
                menuItems={menuPropsStatus}
                className="action"
              // handleMenuClick={handleStatusFilter}
              // isOpen={isOpenStatus}
              // setIsOpen={setIsOpenStatus}
              // value={statusFilter}
              />
            </Col>
          </Row>
        </div>
        <div>
          <Table columns={columns} dataSource={data} />
        </div>
      </div>
    </div>
  );
}

export default ReferralTable;
