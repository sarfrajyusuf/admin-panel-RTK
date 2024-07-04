import React, { useEffect, useRef, useState } from "react";
import "./Header.scss";
import FutureLogo from "../../assets/HeaderLogo.png";
import SidebarDashboard from "../SidebarDashboard/SidebarDashboard";
import HeaderMenu from "./HeaderMenu";
import search from "../../assets/search.png";
import useCurrentWidth from "../../Hooks/useCurrentWidth";
import { Path } from "../../Routing/Constant/RoutePaths";
import { Link, useLocation } from "react-router-dom";
export default function Header() {
  const width = useCurrentWidth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState("");


  const location = useLocation();


  const currentLocation = location.pathname;

  const handleSearchToggle = () => {
    setIsSearchOpen((prev) => !prev);
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const handleSearch = () => {
    setIsSearchOpen(false);
    setSearchedTerm(searchValue);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
      setIsSearchOpen(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > (width > 991 ? 0 : 100)) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  // return () => {
  //   window.removeEventListener("scroll", handleScroll);
  // };

  return (
    <>
      <div className={`headerHome ${isScrolled ? "scroll" : ""}`} id="home">
        <div className="headerHome_container" ref={dropdownRef}>
          <div className="headerlogo me-auto" style={{ cursor: 'pointer' }}>
            <Link to="/dashboard/">
              {width > 767 ? (
                <img src={FutureLogo} alt="Logo" />
              ) : (
                <img src={FutureLogo} alt="Logo" />
              )}
            </Link>
          </div>
          <HeaderMenu className="headerHome_lgheader" />
          <div className={` headerHome_right ${isSearchOpen ? "open" : ""}`}>
            {/* <img src={search} alt="search" onClick={handleSearchToggle} /> */}
            <input
              className="input"
              type="text"
              placeholder="Searching..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ display: isSearchOpen ? "inline-block" : "" }}
              onKeyPress={handleKeyPress}
            />
            <div className="menu" onClick={toggleDropdown}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div
              className={`menubar ${isOpen ? "openDropDown" : "closeDropDown"}`}
              onClick={() => setIsOpen(false)}
            >
              <SidebarDashboard />
            </div>
          </div>


          <div className="dashLayout_heading">
            <h3>{currentLocation === Path.CUSTOMERDETAILS && "User Details"}

              {currentLocation === Path.DASHBOARD && "Dashboard"}
              {currentLocation === Path.USERLIST && "User List"}
              {currentLocation === Path.TRANSHISTORY && "Transaction History"}
              {currentLocation === Path.TOKENMANAGMENT && "Token Management"}
              {currentLocation === Path.REFERRALLIST && "Referral List"}
              {currentLocation === Path.REWARDCONTROLS && "Reward Controls"}
              {currentLocation === Path.ANNOUNCEMENT && "Announcement"}
              {currentLocation === Path.SETTING && "Settings / Admin Controls"}
              {currentLocation === Path.HISTORY && "History"}

            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
