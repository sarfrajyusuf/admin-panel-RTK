import React, { useEffect, useState } from "react";
import "./RewardControls.scss";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import { useLazyGetAllRewardsQuery, useUpdateRewardsMutation } from "../../Utility/Services/ReferralApi";
import { toast } from "react-toastify";
import { encryption } from "../../Common/comman_fun";

function RewardControls() {
  const [formData, setFormData] = useState({
    swap: "",
    swapReward: "",
    amount: "",
    transaction: ""
  });

  const { swap, swapReward, amount, transaction } = formData;

  const [getAllRewards, { data }] = useLazyGetAllRewardsQuery();
  const [updateRewards, { data: updateData }] = useUpdateRewardsMutation();

  useEffect(() => {
    getAllRewards();
  }, []);

  useEffect(() => {
    if (data) {
      data.data.forEach((item) => {
        if (item.type.toLowerCase() === "swap") {
          setFormData(prevState => ({
            ...prevState,
            swap: item.type_number.toString(),
            swapReward: item.reward_amount.toString()
          }));
        } else if (item.type.toLowerCase() === "transaction") {
          setFormData(prevState => ({
            ...prevState,
            transaction: item.type_number.toString(),
            amount: item.reward_amount.toString()
          }));
        }
      });
    }
  }, [data]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        type_1: "swap",
        type_number_1: parseFloat(swap) || 0,
        reward_amount_1: parseFloat(swapReward) || 0,
        type_2: "TRANSACTION",
        type_number_2: parseFloat(amount),
        reward_amount_2: parseFloat(transaction) || 0
      };
      let enc = await encryption(JSON.stringify(payload));
      const securedData = { dataString: enc };
      const response = await updateRewards(securedData);
      const message = response?.data?.message;
      toast.success(message);
    } catch (error) {
      console.error("Error adding token:", error);
    }
  };

  return (
    <div className="controlReward">
      <div className="commonCardBg">
        <div className="controlReward_head">
          <div className="controlReward_head_left"></div>
          <div className="controlReward_head_right">
            <h2>No. of Swap </h2> <h2>Reward Amount</h2>
          </div>
        </div>

        {/* Mapping and displaying "Swap" data */}
        {data && data?.data.map((item) => (
          item.type.toLowerCase() === "swap" && (
            <div key={item.id} className="controlReward_head">
              <div className="controlReward_head_left">
                <h3>Swap :</h3>
              </div>
              <div className="controlReward_head_right">
                <InputCustom
                  regularInput
                  value={swap === "" ? parseFloat(item.type_number) : parseFloat(swap)}
                  onChange={(e) => handleInputChange(e, 'swap')}
                />
                <InputCustom
                  regularInput
                  value={swapReward === "" ? parseFloat(item.reward_amount) : parseFloat(swapReward)}
                  onChange={(e) => handleInputChange(e, 'swapReward')}
                />
              </div>
            </div>
          )
        ))}

        {/* Mapping and displaying "Transaction" data */}
        {data && data?.data?.map((item) => (
          item.type.toLowerCase() === "transaction" && (
            <div key={item.id} className="controlReward_head">
              <div className="controlReward_head_left">
                <h3>Transaction :</h3>
              </div>
              <div className="controlReward_head_right">
                <InputCustom
                  regularInput
                  value={transaction === "" ? parseFloat(item.type_number) : parseFloat(transaction)}
                  onChange={(e) => handleInputChange(e, 'transaction')}
                />
                <InputCustom
                  regularInput
                  value={amount === "" ? parseFloat(item.reward_amount) : parseFloat(amount)}
                  onChange={(e) => handleInputChange(e, 'amount')}
                />
              </div>
            </div>
          )
        ))}

        {/* Save button */}
        <div className="controlReward_saveBtn">
          <ButtonCustom label="Save" regularBtn onClick={handleUpdate} />
        </div>
      </div>
    </div>
  );
}

export default RewardControls;
