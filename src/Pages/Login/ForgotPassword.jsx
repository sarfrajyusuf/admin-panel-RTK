import React from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./Login.scss";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import { forgetPasswordSchema } from "../../Constant/Validations/Validation";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../Utility/Services/UserLoginAPI";
import { toast } from "react-toastify";
import { encryption } from "../../Common/comman_fun";

function ForgetPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  // const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
    defaultValues: { email: "", name: "" },
  });
  
  const onSubmit = async (data) => {
    let enc = await encryption(JSON.stringify(data));
    const securedData = { dataString: enc };

    try {
      const res = await forgotPassword(securedData).unwrap();
      localStorage.setItem("activeKey", "1");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="forgetPassword login">
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputCustom
              label
              labletext="Name"
              placeholder="Enter Your Name"
              type="text"
              regularInput
              value={getValues("name")}
              onChange={(e) => {
                setValue("name", e.target.value);
              }}
            />
          )}
          name="name"
        />
        {errors.name && <p className="errorMessage">{errors.name.message}</p>}

        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputCustom
              label
              labletext="Email"
              placeholder="Enter Email"
              type="text"
              regularInput
              value={getValues("email")}
              onChange={(e) => {
                setValue("email", e.target.value);
              }}
            />
          )}
          name="email"
        />
        {errors.email && <p className="errorMessage">{errors.email.message}</p>}

        <div className="forgetPassword_button">
          <ButtonCustom label="Submit Request" regularBtn />
        </div>
      </div>
    </form>
  );
}

export default ForgetPassword;
