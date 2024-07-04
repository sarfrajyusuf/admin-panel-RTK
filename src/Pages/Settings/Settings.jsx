import React, { useEffect, useState } from "react";
import "./Settings.scss";
import InputCustom from "../../Common/Components/InputCustom/InputCustom";
import ButtonCustom from "../../Common/Components/ButtonCustom/ButtonCustom";
import qrcode from "../../assets/qr-code.jpg";
import { Switch } from "antd";
import { useChangePasswordMutation, useLazyGetUserVerifyQuery, useLazyGetAuthImageQuery, useUpdate2faGoogleAuthMutation, useLazyUpdateServerMaintenanceQuery, useLazyGetServerStatusQuery } from "../../Utility/Services/UserLoginAPI";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUserState } from "../../Utility/Slices/user.slice";
import { useNavigate } from "react-router-dom";
import { REACT_APP_DOMAIN_KEY, encryption } from "../../Common/comman_fun";
import { CopyOutlined } from "@ant-design/icons";

const validationRule = {
  required: (value, fieldName) => (value ? undefined : `${fieldName} is Required`),
  passwordMatch: (value1, value2) =>
    value1 !== value2 ? "Password Does Not Match" : undefined,
  password: (value) =>
    value &&
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,80}$/.test(
        value
      )
      ? "Password should have at least one uppercase, one lowercase, one number, one special character, minimum 8 characters"
      : undefined,
  email: (value) =>
    value &&
      !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value
      )
      ? "Invalid email address"
      : undefined,
  urlMatch: (value) =>
    value &&
      !/(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,63}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?/.test(
        value
      )
      ? "Invalid Url"
      : undefined,
};

function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [action, setAction] = useState();
  const [errors, setErrors] = useState({});
  const [isMaintenanceMode, setIsMaintenanceMode] = useState();

  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [getAuthImage, { data: getImage }] = useLazyGetAuthImageQuery();
  const [update2faGoogleAuth] = useUpdate2faGoogleAuthMutation();
  const [getUserVerify, { data: getVerify }] = useLazyGetUserVerifyQuery();
  const [updateServerMaintenance] = useLazyUpdateServerMaintenanceQuery();
  const [getServerStatus, { data: serverStatusData }] = useLazyGetServerStatusQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    newErrors.old_password = validationRule.required(old_password, "Old Password");
    newErrors.new_password =
      validationRule.required(new_password, "New Password") ||
      validationRule.password(new_password);
    newErrors.confirmPassword =
      validationRule.required(confirmPassword, "Confirm Password") ||
      validationRule.passwordMatch(new_password, confirmPassword);

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    let data = {
      old_password,
      new_password
    }
    let enc = await encryption(JSON.stringify(data));
    const securedData = { dataString: enc };
    try {
      await changePassword(securedData).unwrap();
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      dispatch(loginUserState(null));
      localStorage.removeItem("persist:root");
      window.location.assign(`/${REACT_APP_DOMAIN_KEY}/login`);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const update2fa = async () => {
    let newErrors = {};
    newErrors.password = validationRule.required(password) ? "Password is Required" : "";
    newErrors.token = validationRule.required(token) ? "Secret Code is Required" : "";
    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const data = {
      password,
      token,
      action: action == 0 ? 1 : 0
    };
    let enc = await encryption(JSON.stringify(data));
    const securedData = { dataString: enc };

    try {
      await update2faGoogleAuth(securedData).unwrap();
      setAction(action == 0 ? 1 : 0);
      toast.success(`2FA ${action == 0 ? 'enabled' : 'disabled'} successfully`);
      setPassword("")
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      await updateServerMaintenance({ isMaintenanceMode: isMaintenanceMode === 0 ? 1 : 0 }).unwrap();
      setIsMaintenanceMode(isMaintenanceMode == 0 ? 1 : 0);
      toast.success(`Server maintenance mode ${isMaintenanceMode === 0 ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  useEffect(() => {
    getAuthImage();
    getUserVerify();
    getServerStatus();
  }, [getAuthImage, getUserVerify, getServerStatus]);

  useEffect(() => {
    if (getImage?.data?.google_secret_key) {
      setSecret(getImage.data.google_secret_key);
    }
  }, [getImage]);

  useEffect(() => {
    if (serverStatusData) {
      setIsMaintenanceMode(serverStatusData?.status);
    }
  }, [serverStatusData]);

  useEffect(() => {
    if (getVerify !== undefined) {
      setAction(getVerify.data);
    }
  }, [getVerify]);

  return (
    <div className="setting">
      <div className="setting_left commonCardBg">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <InputCustom
              label
              placeholder="Old Password"
              type="password"
              passwordInput
              value={old_password}
              error={errors.old_password}
              onChange={(e) => setOldPassword(e.target.value)}
              maxLength={20}
              minLength={8}
            />
            {/* {errors.old_password && <div className="error-message">{errors.old_password}</div>} */}
          </div>
          <div className="input-group">
            <InputCustom
              label
              placeholder="New Password"
              type="password"
              passwordInput
              value={new_password}
              onChange={(e) => setNewPassword(e.target.value)}
              error={errors.new_password}
              maxLength={20}
              minLength={8}
            />
            {/* {errors.new_password && <div className="error-message">{errors.new_password}</div>} */}
          </div>
          <div className="input-group">
            <InputCustom
              label
              placeholder="Confirm Password"
              type="password"
              passwordInput
              value={confirmPassword}
              error={errors.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={20}
              minLength={8}
            />
            {/* {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>} */}
          </div>
          <div className="setting_left_btn">
            <ButtonCustom label="Submit" regularBtn type="submit" disabled={isLoading} />
          </div>
        </form>
      </div>

      <div className="setting_right commonCardBg">
        <div className="setting_right_toggle d-flex accountsPlan">
          <div className="google">
            <h3>Enable Server maintenance mode </h3>
          </div>
          <Switch checked={isMaintenanceMode} onChange={handleMaintenanceToggle} />
        </div>
        <div>
          <h2>Enable 2FA</h2>
          <div className="setting_right_qrCode">
            <img src={getImage?.data?.qr_code} alt="qrcode" />
            <div className="secret-container">
              <span style={{ fontSize: "12px" }}>{secret}</span>
              <CopyOutlined
                onClick={() => {
                  window.navigator.clipboard.writeText(secret);
                  toast.success("Copied");
                }}
              />
            </div>


            <InputCustom
              label
              labletext="Password"
              placeholder="Password"
              type="password"
              passwordInput
              value={password}
              error={errors.password}
              onChange={(e) => {
                console.log("password 2 ===>", e.target.value);
                setPassword(e.target.value)
              }}
            />

            <InputCustom
              label
              labletext="Secret Code"
              placeholder="Enter Your Secret Code"
              type="password"
              passwordInput
              value={token}
              error={errors.token}
              onChange={(e) => setToken(e.target.value)}
            />

            <div className="setting_right_qrCode_btn">
              <ButtonCustom
                label={action === 0 ? "Enable" : "Disable"}
                regularBtn
                className="announcement_top_sendBtn"

                onClick={update2fa}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
