import React, { useEffect, useState } from "react";
import "./ReferralList.scss";
import { Table, Tag } from "antd";
import {
  CopyOutlined,
  ExportOutlined,
  FilterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Path } from "../../Routing/Constant/RoutePaths";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import user from "../../assets/maxSmith.jpg";
import { useGetRewardsMutation } from "../../Utility/Services/ReferralApi";
import moment from "moment";
import { toast } from "react-toastify";

function ReferralList() {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [dataa, setTableData] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(10);
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("");

  const limit = 10
  const [getRewards, { data: referralList }] = useGetRewardsMutation();

  useEffect(() => {
    (async () => {
      await getRewardFn();
    })();
  }, [search, page]);

  const getRewardFn = async (search) => {
    let payload = {
      search,

    };
    setListLoading(true);
    await getRewards(payload)
  }

  const tableData = referralList?.data?.map((user, index) => {
    return {
      key: user?.id,
      referee: (
        <div className="tableUserProfile">
          <div>
            {/* <h6>{user?.user_id}</h6> */}
            {/* {user?.address.length > 10
              ? user?.address.substring(0, 10) + "..."
              : user?.address} */}
            <p> <span>{user?.address}</span> <CopyOutlined onClick={() => {
              window.navigator.clipboard.writeText(user?.address);
              toast.success("Copied");
            }} /></p>
          </div>
        </div>
      ),
      referedUser: user?.user?.user_name,
      walletAddress: (
        <div className="copyIcon">
          {user?.user?.device_id}
          <CopyOutlined onClick={() => {
            window.navigator.clipboard.writeText(user?.user?.device_id);
            toast.success("Copied");
          }} />
        </div>
      ),
      referralType: user?.type,
      referralDate: moment(user?.created_at).format("DD/MM/YYYY hh:mm A"),
      rewardEarned: `${user?.amount}`,
      rewardStatus: ["Claimed"],
      // rewardStatus: ["Claimed"],

    }
  })


  const columns = [
    {
      title: "Referee",
      dataIndex: "referee",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Refered User",
      dataIndex: "referedUser",
    },
    {
      title: "Wallet Address (Referral)",
      dataIndex: "walletAddress",
    },
    {
      title: "Referral Type",
      dataIndex: "referralType",
    },
    {
      title: "Referral Date",
      dataIndex: "referralDate",
    },
    {
      title: "Reward Earned",
      dataIndex: "rewardEarned",
    },
    {
      title: "Reward Status",
      dataIndex: "rewardStatus",
      render: (_, { rewardStatus }) => (
        <>
          {rewardStatus.map((tag) => {
            let color = tag.length > 10 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];
  const data = [
    {
      key: "1",
      referee: (
        <div className="tableUserProfile">
          <p>
            Wallet Name
            <br />
            <span>Wallet Address</span>
          </p>
        </div>
      ),
      referedUser: "John",
      walletAddress: (
        <div className="copyIcon">
          0xcvshije125...cfc1
          <CopyOutlined />
        </div>
      ),
      referralType: "Swap reward",
      referralDate: "25 Jul 2024, 10:30 am ",
      rewardEarned: "$100",
      rewardStatus: ["Claimed"],
    },
    {
      key: "2",
      referee: (
        <div className="tableUserProfile">
          <p>
            Wallet Name
            <br />
            <span>Wallet Address</span>
          </p>
        </div>
      ),
      referedUser: "John",
      walletAddress: (
        <div className="copyIcon">
          0xcvshije125...cfc1
          <CopyOutlined />
        </div>
      ),
      referralType: "Swap reward",
      referralDate: "25 Jul 2024, 10:30 am ",
      rewardEarned: "$100",
      rewardStatus: ["To be Claimed"],
    },
  ];

  return (
    <div className="userList">
      <div className="commonCardBg">
        <div className="userList_top">
          <InputCustom searchInputs placeholder="Search User" />

          <div className="userList_top_btn">
            <ButtonCustom
              icon={<FilterOutlined />}
              label="Filter"
              regularBtn
              className="editBtn"
            />
            <ButtonCustom
              icon={<ExportOutlined />}
              label="Export"
              regularBtn
              className="editBtn"
            />
          </div>
        </div>
        <Table columns={columns} dataSource={tableData} />
      </div>
    </div>
  );
}

export default ReferralList;
