import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { Path } from "../Constant/RoutePaths";
import OnboardAuthLayout from "../../Common/Layouts/OnboardLayout/OnboardAuthLayout";
import { useSelector } from "react-redux";
import ScrollToTop from "../../Common/ScrollToTop/ScrollToTop";

const Public = () => {
  const user = useSelector((state) => state.user);
  console.log("VCCCCCCCCCc ", user.users);
  return user.users ? (
    <Navigate to={Path.DASHBOARD} replace={true} />
  ) : (
    <Suspense fallback={""}>
      <ScrollToTop>
        <OnboardAuthLayout />
      </ScrollToTop>
    </Suspense>
  );
};

export default Public;
// import React, { Suspense } from "react";
// import { Navigate } from "react-router-dom";
// import { Path } from "../Constant/RoutePaths";
// import OnboardAuthLayout from "../../Common/Layouts/OnboardLayout/OnboardAuthLayout";
// import { useSelector } from "react-redux";
// import ScrollToTop from "../../Common/ScrollToTop/ScrollToTop";

// const Public = () => {
//   const user = useSelector((state) => state.user);
//   const google2faStatus = localStorage.getItem('pending2fa');

//   return user.users && !google2faStatus ? (
//     <Navigate to={Path.DASHBOARD} replace={true} />
//   ) : (
//     <Suspense fallback={""}>
//       <ScrollToTop>
//         <OnboardAuthLayout />
//       </ScrollToTop>
//     </Suspense>
//   );
// };

// export default Public;
