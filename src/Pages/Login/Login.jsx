

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "./Login.scss";
import { Link, useNavigate } from "react-router-dom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import { Path } from "../../Routing/Constant/RoutePaths";
import { loginSchema } from "../../Constant/Validations/Validation";
import {
  useLoginUserMutation,
  useLazyGetAuthImageQuery,
} from "../../Utility/Services/UserLoginAPI";
import { toast } from "react-toastify";
import { Modal, Button } from "antd";
import { loginUserState } from "../../Utility/Slices/user.slice";
import { useDispatch } from "react-redux";
import { toastState } from "../../Utility/Slices/toast.slice";
import { useGetUser2FAVerifyMutation } from "../../Utility/Services/UserListAPI";
import { encryption } from "../../Common/comman_fun";
// import useIdleTimer from "../../Common/comman_fun/sessionLogout";

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [getAuthImage, { data: getImage }] = useLazyGetAuthImageQuery();
  const [getUser2FAVerify, { isLoading: isVerifying }] =
    useGetUser2FAVerifyMutation();
  const [loginResponseData, setLoginResponseData] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  


  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange"
  });

  useEffect(() => {
    setIsSubmitDisabled(!secretKey.trim());
  }, [secretKey]);

  const onSubmit = async (data) => {
    let enc = await encryption(JSON.stringify(data));
    const securedData = { dataString: enc };

    try {
      const response = await loginUser(securedData).unwrap();

      if (response?.code === 200) {
        if (response?.data.google2fa_status === 1) {
          setIsModalOpen(true);
          setLoginResponseData(response.data);
          const { jwt_token, google2fa_status } = response?.data;
          localStorage.setItem("jwtToken", jwt_token);
          localStorage.setItem("pending2fa", JSON.stringify(google2fa_status));
        } else {
          localStorage.setItem("jwtToken", response.data.jwt_token);
          localStorage.setItem("isLogged", "true");
          navigate("/dashboard");
        }
      } else {
        setErrorMessage(response?.message || "Invalid credentials");
        toast.error(response?.message || "Invalid credentials");
      }
    } catch (error) {
      setErrorMessage(error?.data?.message || "Something went wrong");
      toast.error(error?.data?.message);
    }
  };

  const handleModalSubmit = async () => {
    console.log("lets check inside handleModalSubmit ==>");
    try {
      const response = await getUser2FAVerify({ token: secretKey }).unwrap();
      console.log(response, "test");
      if (response?.code === 200) {
        localStorage.setItem("jwtToken", loginResponseData?.jwt_token);
        let pending2fa = JSON.parse(localStorage.getItem("pending2fa"));
        console.log(pending2fa);
        if (pending2fa === 1) {
          dispatch(loginUserState(loginResponseData));
          navigate("/dashboard/");
          toast.success("Logged in successfully");
        }
        setIsModalOpen(false);
      } else {
        setIsModalOpen(false);
        setSecretKey("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "2FA verification failed");
      setIsModalOpen(false);
      setSecretKey("");
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "").slice(0, 6);
    setSecretKey(numericValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={`login ${isModalOpen ? "blur-background" : ""}`}>
        <Controller
          control={control}
          rules={{ required: true }}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputCustom
              label
              labletext="Email"
              placeholder="john.wick007@gmail.com"
              type="text"
              regularInput
              value={getValues("email")}
              onChange={(e) => {
                console.log("GETVALUE   ==>", getValues("email"), "errors", errors)
                onChange(e);
                setValue("email", e.target.value);
              }}
            />
          )}
        />
        {errors.email && <p className="errorMessage">{errors.email.message}</p>}

        <Controller
          control={control}
          rules={{ required: true }}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <InputCustom
              label
              labletext="Password"
              placeholder="*******"
              id="password"
              passwordInput
              tabIndex={2}
              value={getValues("password")}
              onChange={(e) => {
                onChange(e);
                setValue("password", e.target.value);
              }}
            />
          )}
        />
        {errors.password && <p className="errorMessage">{errors.password.message}</p>}

        <div className="login_forget">
          <Link to={Path.FORGOTPASSWORD}>Forgot Password ?</Link>
        </div>
        <div className="login_button">
          <ButtonCustom
            type={"submit"}
            label="Continue"
            regularBtn
            className={errors.password || errors.email ? 'announcement_top_sendBtn1 disabled' : 'announcement_top_sendBtn1'}

            disabled={errors.password || errors.email}
          />
        </div>
      </div>
      <div>
        <Modal
          title="Enter Secret Code"
          centered
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>,
          ]}
          maskClosable={false}
          className="modal-center modal-small"
          maskStyle={{
            backdropFilter: "blur(8px)",
          }}
        >
          <InputCustom
            placeholder="Enter your secret code"
            type="text"
            value={secretKey}
            onChange={handleInputChange}
            regularInput
            loading={isVerifying}
            required
          />
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              key="submit"
              type="primary"
              className={`announcement_top_sendBtn ${isSubmitDisabled ? "disabled" : ""
                }`}
              onClick={handleModalSubmit}
              loading={isVerifying}
              disabled={isSubmitDisabled}
            >
              Submit
            </Button>
          </div>
        </Modal>
      </div>
    </form>
  );
}

export default Login;
