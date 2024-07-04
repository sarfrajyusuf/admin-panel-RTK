// import React from "react";
// import "./Header.scss";
// import { Link, useLocation } from "react-router-dom";
// import { Path } from "../../Routing/Constant/RoutePaths";
// import {
//   DollarOutlined,
//   HomeFilled,
//   SolutionOutlined,
//   TransactionOutlined,
//   TrophyFilled,
// } from "@ant-design/icons";

// function HeaderMenu({ className }) {
//   const location = useLocation();
//   const menuData = [
//     { label: "Dashboard", to: Path.DASHBOARD, icon: <HomeFilled /> },
//     { label: "User List", to: Path.USERLIST, icon: <SolutionOutlined /> },
//     {
//       label: "Transaction History",
//       to: Path.TRANSHISTORY,
//       icon: <TransactionOutlined />,
//     },
//     {
//       label: "Token Management",
//       to: Path.TOKENMANAGMENT,
//       icon: <DollarOutlined />,
//     },
//     // {
//     //   label: "Reward Management",
//     //   to: Path,
//     //   icon: <TrophyFilled />,
//     //   submenu: [
//     //     { label: "Referral List", to: Path.REFERRALLIST },
//     //     { label: "Reward Controls", to: Path.REWARDCONTROLS },
//     //   ],
//     // },
//   ];
//   return (
//     <div className={`headerLink ${className}`}>
//       <ul className="headerLink_menu">
//         {menuData.map((item, index) => (
//           <li  key={index}
//           className={`headerLink_menu_item ${
//             location.pathname === item.to ? "active" : ""
//           }`}>
//             <Link to={item.to}>
//               {item.icon} {item.label}
//             </Link>
//             {item.submenu && (
//               <ul className="subMenu commonCardBg">
//                 {item.submenu.map((subItem, subIndex) => (
//                   <li key={subIndex}>
//                     <Link to={subItem.to}>{subItem.label}</Link>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default HeaderMenu;

import React from "react";
import "./Header.scss";
import { Link, useLocation } from "react-router-dom";
import { Path } from "../../Routing/Constant/RoutePaths";
import {
  DollarOutlined,
  HomeFilled,
  SolutionOutlined,
  TransactionOutlined,
} from "@ant-design/icons";

function HeaderMenu({ className }) {
  const location = useLocation();
  const menuData = [
    { label: "Dashboard", to: Path.DASHBOARD, icon: <HomeFilled /> },
    { label: "User List", to: Path.USERLIST, icon: <SolutionOutlined /> },
    {
      label: "Transaction History",
      to: Path.TRANSHISTORY,
      icon: <TransactionOutlined />,
    },
    {
      label: "Token Management",
      to: Path.TOKENMANAGMENT,
      icon: <DollarOutlined />,
    },
    // {
    //   label: "Reward Management",
    //   to: Path,
    //   icon: <TrophyFilled />,
    //   submenu: [
    //     { label: "Referral List", to: Path.REFERRALLIST },
    //     { label: "Reward Controls", to: Path.REWARDCONTROLS },
    //   ],
    // },
  ];

  const isActive = (path) => {
    return location.pathname === path || (path === Path.USERLIST && location.pathname.includes('/customerDetail'));
  };

  return (
    <div className={`headerLink ${className}`}>
      <ul className="headerLink_menu">
        {menuData.map((item, index) => (
          <li
            key={index}
            className={`headerLink_menu_item ${isActive(item.to) ? "active" : ""
              }`}
          >
            <Link to={item.to}>
              {item.icon} {item.label}
            </Link>
            {item.submenu && (
              <ul className="subMenu commonCardBg">
                {item.submenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link to={subItem.to}>{subItem.label}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HeaderMenu;
