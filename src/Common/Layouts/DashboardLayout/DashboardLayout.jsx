import { Outlet, useLocation } from "react-router-dom";
import Header from "../../Header/Header";
import "./DashboardLayout.scss";

function DashboardLayout() {
  return (
    <div className="dashLayout ">
      <Header />
      <div className="dashLayout_container">
        <div className="dashLayout_body ">
          <Outlet />
        </div>
      </div>
    </div>
    
  );
}

export default DashboardLayout;
