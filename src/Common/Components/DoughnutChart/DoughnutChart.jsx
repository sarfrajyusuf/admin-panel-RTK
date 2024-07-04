import React, { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import "./DoughnutChart.scss";
import { useLazyGetUserCountQuery } from "../../../Utility/Services/UserListAPI";
import DropdownCustom from "../DropdownCustom/DropdownCustom";

const menuProps = [["1 Day"], ["1 Week"], ["1 Month"]];

const DoughnutChart = () => {
  const [active, setActive] = useState(["1 Month"]);
  const [isOpen, setIsOpen] = useState(false);

  const [getUserCount, { data: count, isLoading }] = useLazyGetUserCountQuery();

  // const total = 200;
  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  const getCount = () => {
    let payload = "";
    if (active[0] === "1 Day") {
      payload = "1d";
    } else if (active[0] === "1 Week") {
      payload = "1w";
    } else if (active[0] === "1 Month") {
      payload = "1m";
    }
    getUserCount(payload);
  };

  useEffect(() => {
    if (chartRef.current) {
      myChartRef.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Active Users", "Inactive Users"],
          datasets: [
            {
              label: "# of Users",
              data: [0, 0], // Initial dummy data
              backgroundColor: ["#FFFFFF", "#008db4"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
            },
            title: {
              display: true,
              text: 'User Distribution'
            },
          },
        },
      });
    }

    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    getCount();
  }, [active]);
  useEffect(() => {
    if (count && myChartRef.current) {
      const newUserCount = count.data;
      const existingUserCount = count.total_user - newUserCount;
      myChartRef.current.data.datasets[0].data = [newUserCount, existingUserCount];
      myChartRef.current.update();
    }
  }, [count]);

  const handleMenuClick = (e) => {
    setActive(e);
    setIsOpen(false);
  };

  return (
    <div className="pieChart">
      <h3 className="percentageHeigh">
        <strong> {count?.data || 0}</strong>
      </h3>
      <div className="timeLineDrop">
        <DropdownCustom
          buttonText={active || "Timeline"}
          menuItems={menuProps}
          className="action"
          handleMenuClick={handleMenuClick}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
      <canvas ref={chartRef} width="200" height="200"></canvas>
    </div>
  );
};

export default DoughnutChart;
