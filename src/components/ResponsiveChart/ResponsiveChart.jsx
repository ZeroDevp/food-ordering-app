import React, { useState, useRef, useEffect } from "react";
import Chart from "react-apexcharts";

const ResponsiveChart = ({ options, series }) => {
  const chartRef = useRef(null);

  // Hàm để buộc vẽ lại biểu đồ
  const redrawChart = () => {
    if (chartRef.current) {
      chartRef.current.chart.updateOptions(options);
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện resize để đảm bảo biểu đồ được cập nhật
    window.addEventListener("resize", redrawChart);
    return () => window.removeEventListener("resize", redrawChart);
  }, [options]);

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={300}
      ref={chartRef}
    />
  );
};

export default ResponsiveChart;
