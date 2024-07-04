import React from "react";
import { Path } from "./Constant/RoutePaths.jsx";
import Login from "../Pages/Login/Login.jsx";
import ForgotPassword from "../Pages/Login/ForgotPassword.jsx";
import UserList from "../Pages/UserList/UserList.jsx";
import TransactionHistory from "../Pages/TransactionHistory/TransactionHistory.jsx";
import TokenManagment from "../Pages/TokenManagment/TokenManagment.jsx";
import ReferralList from "../Pages/ReferralList/ReferralList.jsx";
import RewardControls from "../Pages/RewardControls/RewardControls.jsx";
import Announcement from "../Pages/Announcement/Announcement.jsx";
import Settings from "../Pages/Settings/Settings.jsx";
import History from "../Pages/History/History.jsx";

const CustomerDetails = React.lazy(() =>
  import("../Pages/CustomerDetails /CustomerDetails.jsx")
);
const Dashboard = React.lazy(() => import("../Pages/Dashboard/Dashboard.jsx"));

export const PAGES = {
  PUBLIC_PAGES: [
      { path: Path.LOGIN, element: <Login /> },
      { path: Path.FORGOTPASSWORD, element: <ForgotPassword /> },
    ],

  PRIVATE_PAGES: [
    { path: Path.DASHBOARD, element: <Dashboard /> },
    { path: Path.CUSTOMERDETAILS, element: <CustomerDetails /> },
    { path: Path.USERLIST, element: <UserList /> },
    { path: Path.TRANSHISTORY, element: <TransactionHistory /> },
    { path: Path.TOKENMANAGMENT, element: <TokenManagment /> },
    { path: Path.REFERRALLIST, element: <ReferralList /> },
    { path: Path.REWARDCONTROLS, element: <RewardControls /> },
    { path: Path.ANNOUNCEMENT, element: <Announcement /> },
    { path: Path.SETTING, element: <Settings /> },
    { path: Path.HISTORY, element: <History /> }
  ],
};
