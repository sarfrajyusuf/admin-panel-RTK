import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useLazyGetTransactionCountsQuery } from "../../../Utility/Services/SwapTransactionAPI";
import DropdownCustom from "../DropdownCustom/DropdownCustom";

const TransactionGraph = () => {
    const menuProps = [["ALL"], ["1 Day"], ["1 Week"], ["1 Month"]];
    const [active, setActive] = useState(["1 Month"]);
    const [isOpen, setIsOpen] = useState(false);
    const [graphData, setGraphData] = useState({
        label: [],
        value: []
    });

    const [getTransactionCounts, { data: transaction, isLoading, error }] = useLazyGetTransactionCountsQuery();

    useEffect(() => {
        if (transaction?.data) {
            const data = transaction?.data?.data;  // Ensure data is an array
            let labels = [];
            let values = [];
            const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            if (active[0] === "1 Day") {
                const now = new Date();
                for (let i = 0; i < 24; i++) {
                    const hour = (now.getHours() - i + 24) % 24;
                    labels.unshift(`${hour}:00`);
                    const item = data.find(item => (new Date(item.Date)).getHours() === hour);
                    values.unshift(item ? item.total_amount : 0);
                }
            } else if (active[0] === "1 Week") {
                daysOfWeek.forEach(day => {
                    const item = data.find(item => (new Date(item.created_at)).getDay() === daysOfWeek.indexOf(day));
                    labels.push(day);
                    values.push(item ? item.total_amount : 0);
                });
            } else if (active[0] === "1 Month") {
                data.forEach((item) => {
                    labels.push(item.Date);
                    values.push(item.total_amount);
                });
            }
            else if (active[0] === "ALL") {
                data.forEach((item) => {
                    labels.push(item.year);
                    values.push(item.total_amount);
                });
            }

            setGraphData({ label: labels, value: values });
        }
    }, [transaction, active]);


    // useEffect(() => {
    //     if (transaction?.data) {
    //         const { data } = transaction.data;
    //         let labels = [];
    //         let values = [];
    //         const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    //         if (active[0] === "1 Day") {
    //             const now = new Date();
    //             for (let i = 0; i < 24; i++) {
    //                 const hour = (now.getHours() - i + 24) % 24;
    //                 labels.unshift(`${hour}:00`);
    //                 const item = data.find(item => (new Date(item.Date)).getHours() === hour);
    //                 values.unshift(item ? item.total_amount : 0);
    //             }
    //         } else if (active[0] === "1 Week") {
    //             daysOfWeek.forEach(day => {
    //                 const item = data.find(item => (new Date(item.created_at)).getDay() === daysOfWeek.indexOf(day));
    //                 labels.push(day);
    //                 values.push(item ? item.total_amount : 0);
    //             });
    //         } else {
    //             // Generate labels and values from transaction data
    //             data.forEach((item) => {
    //                 labels.push(item.Date);
    //                 values.push(item.total_amount);
    //             });
    //         }

    //         setGraphData({ label: labels, value: values });
    //     }
    // }, [transaction, active]);

    useEffect(() => {
        getCount();
    }, [active]);

    const getCount = () => {
        let payload = "";
        if (active[0] === "1 Day") {
            payload = "1d";
        }
        if (active[0] === "1 Week") {
            payload = "1w";
        }
        if (active[0] === "1 Month") {
            payload = "1m";
        }
        if (active[0] === "ALL") {
            payload = "1y";
        }
        getTransactionCounts(payload);
    };

    const handleMenuClick = (e) => {
        setActive(e);
        setIsOpen(false);
    };

    const data = {
        labels: graphData.label,
        datasets: [
            {
                label: "Transactions",
                data: graphData.value,
                fill: true,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 130, 130, 0.2)",
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    return (
        <div className="transGraph">
            <div className="userReg__head">
                <h4 className="commonHead"></h4>
                <div className="monthitems">
                </div>
            </div>
            <div className="timeLineDrop">
                <DropdownCustom
                    buttonText={active || "Timeline"}
                    menuItems={menuProps}
                    className="action "
                    handleMenuClick={handleMenuClick}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </div>
            <Line data={data} options={chartOptions} />
        </div>
    );
};

export default TransactionGraph;
