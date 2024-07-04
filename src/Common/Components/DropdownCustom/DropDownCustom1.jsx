import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import "./DropdownCustom.scss";

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
        const allObjects = menuItems.every(
            (item) => typeof item === "object" && item.value && item.displayValue
        );
        if (allObjects) {
            return menuItems.map((item) => (
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
        }
    };

    const menu = <Menu className="dropdownBody">{renderMenuItems()}</Menu>;

    // Convert `value` to display the corresponding `displayValue` if it is an object
    const displayValue = typeof value === 'object' && value.displayValue ? value.displayValue : buttonText;

    return (
        <div className={`dropdownCustom ${className}`}>
            <label>{label}</label>
            <Space wrap>
                <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    onOpenChange={() => setIsOpen(!isOpen)}
                >
                    <Button>
                        <Space>
                            {displayValue}
                            <DownOutlined
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
