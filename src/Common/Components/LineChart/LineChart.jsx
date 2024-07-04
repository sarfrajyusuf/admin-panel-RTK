import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const generateDataForLastAndThisMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get the last month
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;

    const lastMonthData = [];
    const thisMonthData = [];

    // Generating random data for demonstration purpose
    for (let i = 1; i <= 31; i++) {
        lastMonthData.push({ name: `${lastMonthYear}-${lastMonth + 1}-${i}`, uv: Math.floor(Math.random() * 5000) });
        thisMonthData.push({ name: `${currentYear}-${currentMonth + 1}-${i}`, uv: Math.floor(Math.random() * 5000) });
    }

    return { lastMonthData, thisMonthData };
};

const DarkLineChart = () => {
    const { lastMonthData, thisMonthData } = generateDataForLastAndThisMonth();

    return (
       <div className='transactionChart'>
         <LineChart
            width={600}
            height={300}
            data={lastMonthData} // Using last month's data for setting up the axis and data points
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="uv" stroke="#8884d8" name="Last Month" />
            <Line type="monotone" data={thisMonthData} dataKey="uv" stroke="#82ca9d" name="This Month" />
        </LineChart>
       </div>
    );
};

export default DarkLineChart;
