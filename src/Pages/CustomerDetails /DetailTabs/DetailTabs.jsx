import React from "react";
import "./DetailTabs.scss";
import { Tabs } from "antd";
import PaymentRecords from "../PaymentRecords/PaymentRecords";
import ReferralTable from "../ReferralTable/ReferralTable";
import SwapTable from "../SwapTable/SwapTable";
function DetailTabs(userList) {
  const items = [
    {
      key: "1",
      label: "Send / Receive",
      children: (
        <div>
          <PaymentRecords />
        </div>
      ),
    },
    {
      key: "2",
      label: "Swap",
      children: (
        <div>
          <SwapTable userList={userList} />
        </div>
      ),
    },
    {
      key: "3",
      label: "Referral",
      children: (
        <div>
          <ReferralTable userList={userList}/>
        </div>
      ),
    },
  ];
  return (
    <div className="detailTabs">
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
}

export default DetailTabs;
