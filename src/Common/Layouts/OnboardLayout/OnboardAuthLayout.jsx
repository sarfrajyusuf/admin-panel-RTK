import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../../../assets/HeaderLogo.png";

import "./OnboardAuthLayout.scss";
import LoginBanner from "../../../assets/LoginBanner.png";
import { Path } from "../../../Routing/Constant/RoutePaths";
import { ArrowLeftOutlined } from "@ant-design/icons";

function OnboardAuthLayout() {
  const location = useLocation();

  const currentLocation = location.pathname;
  return (
    <div className="loginBoard">
      <div className="loginBoard_left">
        <img src={LoginBanner} alt="" />
      </div>
      <div className="loginBoard_right">
        <div className="loginBoard_right_header">
          {currentLocation === Path.FORGOTPASSWORD && (
            <Link to={Path.LOGIN}>
              <h4 className="loginBoard_right_heading">
                <ArrowLeftOutlined />
              </h4>
            </Link>
          )}
          <img src={logo} alt="" />
        </div>
        <h4 className="loginBoard_right_heading">
          Sign in to Future Wallet Admin
        </h4>
        <p className="loginBoard_right_paragraph">
          Not your device? Use a private or incognito window to sign in.
        </p>
        <Outlet />
      </div>
    </div>
  );
}

export default OnboardAuthLayout;
