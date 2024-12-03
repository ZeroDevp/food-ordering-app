import React from "react";
import ReactApexChart from "react-apexcharts";
import { convertDataChart, getLabels } from "../../utils";

const PieChartComponent = (props) => {
  const data = convertDataChart(props.data, "PhuongThucThanhToan");
  const chartLabels = getLabels(props.data, "PhuongThucThanhToan");
  console.log("data", props.data);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: chartLabels,
    legend: {
      position: "bottom", // Đặt chú thích ở phía dưới
      labels: {
        colors: "#ffff", // Đặt màu chữ cho các nhãn
      },
    },
    responsive: [
      {
        breakpoint: 1024, // Màn hình nhỏ hơn 1024px
        options: {
          chart: {
            width: 320, // Đặt chiều rộng nhỏ hơn
          },
          legend: {
            position: "bottom", // Đặt chú thích ở phía dưới
            labels: {
              colors: "#ffff", // Đặt màu chữ cho các nhãn
            },
          },
        },
      },
      {
        breakpoint: 480, // Màn hình nhỏ hơn 480px
        options: {
          chart: {
            width: 200,
          },
          legend: {
            fontSize: "12px", // Giảm kích thước chữ của chú thích
          },
        },
      },
    ],
  };

  const chartSeries = data; // Dữ liệu cho biểu đồ

  return (
    <div>
      <ReactApexChart
        data={data}
        options={chartOptions}
        series={chartSeries}
        type="donut"
        height={500}
        align="center"
        // datakey="value"
      />
    </div>
  );
};

export default PieChartComponent;
