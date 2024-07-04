import { Navigate } from "react-router-dom";
import { Suspense } from "react";
import DashboardLayout from "../../Common/Layouts/DashboardLayout/DashboardLayout";
import { Path } from "../Constant/RoutePaths";
import React from "react";
import { useSelector } from "react-redux";
import ScrollToTop from "../../Common/ScrollToTop/ScrollToTop";

const Private = () => {
  const user = useSelector((state) => state.user);

  return user.users ? (
    <Suspense fallback={""}>
      <ScrollToTop>
        <DashboardLayout />
      </ScrollToTop>
    </Suspense>
  ) : (
    <Navigate to={Path.LOGIN} replace={true} />
  );
};

export default Private;
