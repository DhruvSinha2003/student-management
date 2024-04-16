import React from 'react';
import Chart from 'react-google-charts';

const LineChart = ({ gpaData }) => {
  const chartData = [['Semester', 'GPA'], ...gpaData.map((gpa, index) => [index + 1, gpa])];

  return (
    <Chart
      width={'100%'}
      height={'400px'}
      chartType="LineChart"
      loader={<div>Loading Chart</div>}
      data={chartData}
      options={{
        title: 'GPA Over Semesters',
        hAxis: {
          title: 'Semester',
          format: '0', 
        },
        vAxis: {
          title: 'GPA',
          minValue: 0,
          maxValue: 10,
        },
        legend: 'none',
      }}
    />
  );
};

export default LineChart;
