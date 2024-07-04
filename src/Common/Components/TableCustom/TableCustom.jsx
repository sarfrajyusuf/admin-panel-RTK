import React from "react";
import { Table } from "antd";
import "./TableCustom.scss"

function TableCustom({ columns, data, handleView ,className }) {
  return (
    <div className={`tableCustom ${className}`}>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, index) => index}
        onRow={(record, rowIndex) => ({
          onClick: () => handleView(record, rowIndex)
        })}
      />
    </div>
  );
}

export default TableCustom;
