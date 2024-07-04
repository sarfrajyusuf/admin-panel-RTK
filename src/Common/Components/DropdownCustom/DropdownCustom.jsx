import React, { useState } from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./DropdownCustom.scss";
import { Arrow } from "../../../assets/StoreAsset/StoreAsset";

function DropdownCustom(props) {
  const {
    buttonText,
    menuItems,
    handleMenuClick,
    className,
    label,
    isOpen,
    setIsOpen,
    value,
  } = props;

  const renderMenuItems = () => {
    // return menuItems.map((item, index) => {
    // Check if item is an object with value and displayValue properties
    const allObjects = menuItems.every(
      (item) => typeof item === "object" && item.value && item.displayValue
    );
    if (allObjects) {
      return menuItems.map((item, index) => (
        <Menu.Item key={item.value} onClick={() => handleMenuClick(item)}>
          {item.displayValue}
        </Menu.Item>
      ));
    } else {
      return menuItems.map((item, index) => (
        <Menu.Item key={index} onClick={() => handleMenuClick(item)}>
          {item}
        </Menu.Item>
      ));

      // </Menu>
    }
  };

  const menu = <Menu className="dropdownBody">{renderMenuItems()}</Menu>;
  // const menu = (
  //   <Menu className="dropdownBody">
  //     {menuItems.map((item, index) => (
  //       <Menu.Item key={index} onClick={() => handleMenuClick(item)}>
  //         {item}
  //       </Menu.Item>
  //     ))}
  //   </Menu>
  // );
  const handleOpenChange = (flag) => {
    setIsOpen(flag);
  };
  return (
    <div className={`dropdownCustom ${className}`}>
      <label>{label}</label>
      <Space wrap>
        <Dropdown
          overlay={menu}
          trigger={["click"]}
          onOpenChange={handleOpenChange}
        >
          <Button>
            <Space>
              {value ? value : buttonText}
              <Arrow
                style={{
                  transform: !isOpen ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "0.3s all",
                }}
              />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </div>
  );
}

export default DropdownCustom;
