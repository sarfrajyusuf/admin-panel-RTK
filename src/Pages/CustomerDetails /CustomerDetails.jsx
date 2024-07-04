import React, { useEffect, useState, useMemo } from "react";
import "./CustomerDetails.scss";
import { CopyOutlined } from "@ant-design/icons";
import SubCard from "../../Common/SubCard/SubCard";
import Accounts from "./Accounts/Accounts";
import DetailTabs from "./DetailTabs/DetailTabs";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyGetUserDataQuery } from "../../Utility/Services/UserDataListAPI";
import { toast } from "react-toastify";
import { useLazyGetReferralQuery } from "../../Utility/Services/ReferralApi";

function CustomerDetails() {
  // const [getReferral, { da }] = useLazyGetReferralQuery();
  // console.log(da,"trtt::")
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalReferral, setTotalReferral] = useState(0);
  const [walletAddresses, setWalletAddresses] = useState([]);

  const [getUserData, { data: userList, error }] = useLazyGetUserDataQuery();
  console.log(userList?.data, "ytyty::")


  useEffect(() => {
    if (userList) {
      setTotalReferral(userList?.data?.total_referrals)
    }
  }, [])


  useEffect(() => {
    if (location?.state?.userData) {
      setData(location?.state?.userData)
      setTotal(location?.state?.totalBalance);
      // console.log(location?.state,"usdufsf====>")
      getUserData(location?.state?.userData?.user_id);
    } else {
      navigate('/userList')
    }
  }, [location]);

  useEffect(() => {
    if (!location?.state?.userData) {
      navigate('/userList')
    }
  }, [location]);

  useEffect(() => {
    if (userList) {
      const addresses = [];
      let total = 0;
      userList.data.data.forEach((item) => {
        if (item.balance && item.coin && item.coin.fiat_price_data) {
          total += item.balance * item.coin.fiat_price_data.value;
        } else if (item.balance) {
          total += item.balance;
        }
        if ([1, 2, 3, 6].includes(item.coin_family)) {
          addresses.push({ family: item.coin_family, address: item.wallet_address });
        }
      });
      setTotalValue(total.toFixed(4));
      setWalletAddresses(addresses);
    }
  }, [userList]);

  const handleCopyAddress = (address) => {
    window.navigator.clipboard.writeText(address);
    toast.success("Copied");
  };

  const userDetails = useMemo(
    () => [
      { label: "Account ID", value: location?.state?.userData?.user_id },
      { label: "Billing Email", value: "info@keenthemes.com" },
    ],
    [location?.state?.userData?.user_id]
  );

  return (
    <div className="customerDetails">
      <div className="customerDetails_top">
        <div className="customerDetails_top_profile commonCardBg">
          <div className="customerDetails_top_profile_head">
            <div className="customerDetails_top_profile_head_top">
              <h2>Wallet Name :</h2>
              <h3>{data?.wallet_name ?? ''}</h3>
            </div>
            <div className="customerDetails_top_profile_head_bottom">
              <h2>Wallet Address :-</h2>
              <ul>
                {walletAddresses
                  .filter((wallet, index, self) =>
                    // Filters out duplicate wallet addresses, ignoring case sensitivity
                    index === self.findIndex((t) => (
                      t.address.toLowerCase() === wallet.address.toLowerCase()
                    ))
                  )
                  .map((wallet, index) => (
                    <li key={index}>
                      <h3>
                        {wallet.address === 3 ? "BTC" :
                          wallet.family === 1 || wallet.family === 2 ? "ETH/BNB" :
                            wallet.family === 6 ? "TRON" :
                              "BTC"}
                      </h3>
                      <p>
                        <span title={wallet.address}>{wallet.address}</span>{" "}
                        <CopyOutlined onClick={() => handleCopyAddress(wallet.address)} />
                      </p>
                    </li>

                  ))}
              </ul>

            </div>
          </div>
          <div className="customerDetails_top_profile_earnings">
            <SubCard earnings={`$ ${total}`} description="Wallet Balance" />
            <SubCard earnings={totalReferral} description="Total Referrals" />
            {/* <SubCard earnings="500" description="Total Rewards Earned" /> */}
          </div>
        </div>
        <div className="customerDetails_top_profile">
          <Accounts user_wallet_data={userList?.data?.data} />
        </div>
      </div>
      <div className="customerDetails_bottom">
        <div className="customerDetails_bottom_tabSection">
          {
            location?.state?.userData && (
              <DetailTabs userList={userList?.data?.data ?? null} />

            )
          }
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;

