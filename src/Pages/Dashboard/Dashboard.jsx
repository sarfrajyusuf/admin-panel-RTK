import React, { useCallback, useEffect, useState } from "react";
import "./Dashboard.scss";
import { Col, Row, Table } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import DoughnutChart from "../../Common/Components/DoughnutChart/DoughnutChart";
import RecentTransactions from "../../Common/Components/RecentTransactions /RecentTransactions";
import DropdownCustom from "../../Common/Components/DropdownCustom/DropdownCustom";
import {
  useLazyGetNewsQuery,
} from "../../Utility/Services/UserListAPI";
import { useGetSwapCoinsMutation } from "../../Utility/Services/SwapcoinAPI";
import { useGetSwapTransactionMutation } from "../../Utility/Services/SwapTransactionAPI";
import moment from "moment";
import TransactionGraph from "../../Common/Components/DoughnutChart/TransactionGraph";
import { Link } from "react-router-dom";

const CoinToken = [["ETH"], ["BNB"], ["BTC"], ["USDT"]];
function Dashboard() {
  const [newsList, setNewsList] = useState(["ETH"]);
  const [isOpenTimeLIne, setIsOpenTimeline] = useState(false);

  // const [getUserCount, { data: count, isLoading }] = useLazyGetUserCountQuery();
  const [getSwap, { data: coinData }] = useGetSwapCoinsMutation();
  const [getSwapCoins, { data: coinDataFromIds }] = useGetSwapTransactionMutation();
  const [getNews, { data: news }] = useLazyGetNewsQuery();

  const [allNews, setAllNews] = useState([])

  const calculateTimeDifference = (postTime) => {
    if (!postTime) {
      console.error("postTime is undefined or null");
      return { differenceInMinutes: NaN, formattedTime: "Invalid" };
    }

    const currentTime = new Date();
    const postDate = new Date(postTime);

    if (isNaN(postDate)) {
      console.error("Invalid date format:", postTime);
      return { differenceInMinutes: NaN, formattedTime: "Invalid" };
    }
    const timeDifference = currentTime - postDate;
    const differenceInMinutes = Math.floor(timeDifference / (1000 * 60));

    let formattedTime;
    if (differenceInMinutes < 60) {
      formattedTime = `${differenceInMinutes} minutes ago`;
    } else if (differenceInMinutes < 1440) {
      const hours = Math.floor(differenceInMinutes / 60);
      formattedTime = `${hours} hour ago`;
    } else {
      const days = Math.floor(differenceInMinutes / 1440);
      formattedTime = `${days} days ago`;
    }
    return { differenceInMinutes, formattedTime };
  };


  useEffect(() => {
    getCoins();
  }, []);

  useEffect(() => {
    setAllNews([])
    if (news?.news?.data?.list) {
      setAllNews(news?.news?.data?.list)
    }
  }, [news]);


  useEffect(() => {
    getLatestNews()

  }, [newsList]);

  const coinIds = useCallback(() => {
    let ids = [];
    coinData?.data?.coin_data.forEach((coin) => ids.push(coin.coin_id));
    coinData?.data?.token_data.forEach((token) => ids.push(token.coin_id));
    return ids;
  }, [coinData]);

  const getSwapTransactionData = useCallback(async () => {
    const ids = coinIds();
    if (ids.length) {
      getSwapCoins({ coin_ids: ids });
    }
  }, [coinIds, getSwapCoins]);

  //useEffect
  useEffect(() => {
    getSwapTransactionData();
  }, [coinData]);

  const getLatestNews = () => {
    let payload = "";
    if (newsList[0] == "ETH") {
      payload = "eth";
    }
    if (newsList[0] == "BNB") {
      payload = "bnb";
    }
    if (newsList[0] == "BTC") {
      payload = "btc";
    }
    if (newsList[0] == "USDT") {
      payload = "usdt";
    }
    getNews(payload);
  };

  const getCoins = () => {
    let data = {
      coin_symbols: ["eth", "bnb", "trx"],
      token_symbols: ["usdt"],
    };
    getSwap(data);
  };

  const handleNewsClick = (e) => {
    setNewsList(e);
    setIsOpenTimeline(false);
  };
  //
  const columns = [
    {
      title: "Asset",
      dataIndex: "Token",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Total Swap Volume",
      dataIndex: "TotalSwapVolume",
    },
    {
      title: "24 Hour",
      dataIndex: "Hour",
    },
    {
      title: "7 Days",
      dataIndex: "Days7",
    },
    {
      title: "30 Days",
      dataIndex: "Days30",
    },
  ];


  const data = coinDataFromIds?.data?.map((coin) => {
    const {
      coin_id: key,
      coin_image,
      coin_name,
      token_type,
      coin_transation_data,
      fiat_price_data,
    } = coin;

    const totalSwapAmount = coin_transation_data[0]?.total_swap_amount || 0;
    const fiatType = coin_transation_data[0]?.fiat_type || "";
    const totalInFiat = (totalSwapAmount * fiat_price_data.value).toFixed(2);
    const hourPriceChange =
      fiat_price_data?.latest_price?.price_change_24h || 0;
    const days7PriceChange =
      fiat_price_data?.latest_price?.percent_change_7d || 0;
    const days30PriceChange =
      fiat_price_data?.latest_price?.percent_change_30d || 0;

    const renderPriceChange = (change, period) => {
      const absChange = Math.abs(change); // Get the absolute value of the change

      return (
        <p className={change >= 0 ? "greenUpIcon" : "redDownIcon"}>
          {change >= 0 ? <ArrowDownOutlined /> : <ArrowDownOutlined />} (
          {absChange}%)
        </p>
      );
    };
    return {
      key,
      Token: (
        <div className="tableUserProfile">
          <img src={coin_image} alt="" />
          <p>
            {coin_name} {token_type ? `(${token_type})` : ""}
            {/* {coin_name} */}
          </p>
        </div>
      ),
      TotalSwapVolume: `$ ${totalInFiat} ${fiatType}`,
      Hour: renderPriceChange(hourPriceChange, "Hour"),
      Days7: renderPriceChange(days7PriceChange, "7 days"),
      Days30: renderPriceChange(days30PriceChange, "30 days"),
    };
  });


  // console.log("news?.news?.data?.list::", news?.news?.data?.list);
  console.log(allNews, "allNews");
  return (
    <div className="dashboard">
      <Row gutter={[25, 25]}>
        <Col sm={24} md={24} lg={9}>
          <div className="dashboard_detailCard">
            <div className="commonCardBg">
              <h4>Active User</h4>
              <DoughnutChart />
            </div>
          </div>
        </Col>

        <Col md={24} lg={15}>
          <div className="dashboard_report commonCardBg">
            <div className="dashboard_report_heading">
              <h5>
                What’s up Today <br />
                <span className="dashboard_report_subheading">
                  Date <span>{moment(Date()).format("DD/MM/YYYY")}</span>
                </span>
              </h5>
              <DropdownCustom
                buttonText={newsList || "News"}
                menuItems={CoinToken}
                className="action"
                handleMenuClick={handleNewsClick}
                isOpen={isOpenTimeLIne}
                setIsOpen={setIsOpenTimeline}
              />
            </div>
            {allNews?.map((newsItem, index) => (
              // <h1>{index}</h1>
              // console.log(newsItem, "newsItem::"),
              <div className="dashboard_report_detail" key={index + "key"}>
                <div className="dashboard_report_detail_left">
                  <span>{calculateTimeDifference(newsItem.post_time).formattedTime}</span>

                  <h6>{newsItem.owner.nickname}</h6>
                  <p>{newsItem.text_content.slice(0, 100)}</p>
                </div>
                <div>
                  <Link to={newsItem?.comment_url} target="_blank">
                    <p
                      style={{ cursor: "pointer", color: "#FFFFFF" }}
                      className="tableViewBtn"
                    >
                      View
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col md={24}>
          <div className="commonCardBg">
            <h2>Swap Volume and Market Trend</h2>
            <Table
              scroll={{ x: 400 }}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          </div>
        </Col>
        <Col sm={24} md={12}>
          <div className="dashboard_userRegistration commonCardBg">
            <h2>Transaction Volume</h2>
            <Col xs={30} md={30}>
              <TransactionGraph />
            </Col>
          </div>
        </Col>
        <Col sm={24} md={12}>
          <div className="commonCardBg">
            <RecentTransactions />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
