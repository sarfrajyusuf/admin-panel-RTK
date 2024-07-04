import React, { useEffect, useState } from "react";
import "./Accounts.scss";
import Ethereum from "../../../assets/Ethereum (ETH).svg";
import BNB from "../../../assets/BinanceCoin.svg";
import { Col, Row } from "antd";
import bnb1 from "../../../assets/bnb1.png";
import tron from "../../../assets/tron.png";
import ethereum from "../../../assets/ethereum.png";
function Accounts({ user_wallet_data }) {

  const len = user_wallet_data?.length;
  const [familyData, setFamiliyData] = useState({})

  const [showMore, setShowMore] = useState(false);
  console.log(user_wallet_data, "user_wallet_data---->")

  // Log the balance object to understand its structure
  // const initialCards = user_wallet_data && user_wallet_data.map((family, i) => {
  //   console.log(family,"trt")
  //   // Extracting relevant properties
  //   const name = family.coin.coin_name;
  //   const value = family.coin?.fiat_price_data?.value ?? 0;
  //   const balance = family.balance ?? 0
  //   let img = family.coin.coin_image;
  //   const total_value = value * balance;

  //   if(!img){
  //   img
  //   }

  //   return {
  //     name,
  //     img,
  //     total_value
  //   };
  // });


  const initialCards = user_wallet_data && user_wallet_data.map((family, i) => {
    console.log(family, "trt")
    // Extracting relevant properties
    const name = family.coin.coin_name;
    const value = family.coin?.fiat_price_data?.value ?? 0;
    const balance = family.balance ?? 0;
    let img = family.coin.coin_image;
    const total_value = value * balance;

    // If img is not provided, add img based on coin_family
    if (!img) {
      switch (family.coin_family) {
        case 1:
          img = bnb1;
          break;
        case 2:
          img = ethereum;
          break;
        case 6:
          img = tron;
          break;
        default:
          // Add a default image here if needed
          break;
      }
    }

    return {
      name,
      img,
      total_value
    };
  });
  const initialCards1 = [
    { name: "Ethereum (5) ", value: "$33,60.08 ", img: Ethereum },
    { name: "BNB Chain (1)", value: "$589,02 ", img: BNB },
  ];
  const additionalCardsData = [
    { name: "Card 1", value: "$100", img: BNB },
    { name: "Card 2", value: "$200", img: BNB },
    { name: "Card 3", value: "$300", img: BNB },
  ];

  return (
    <>
      <div className="accountsCard">
        <Row gutter={[20, 20]} justify={"center"}>
          {(initialCards ? initialCards.slice(0, showMore ? initialCards.length : 4) : []).map((card, index) => (
            card?.total_value >= 0.01 ?
              <Col key={index}>
                <div className="accountsCard_card commonCardBg">
                  <img src={card?.img} alt="" />
                  <div>
                    <h4>{card?.name}</h4>
                    <p>${card?.total_value.toFixed(2)}</p>
                  </div>
                </div>
              </Col>
              : ""
          ))}
        </Row>
        {!showMore && initialCards && initialCards.length >= 3 && (
          <div className="accountsCard_add">
            <span onClick={() => setShowMore(true)}>
              {showMore ? "- Show less" : `+ Show more Assets`}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default Accounts;