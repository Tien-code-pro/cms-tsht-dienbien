import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Line } from "@ant-design/plots";

const ChartLineDot = () => {
  const data = [
    {
      year: "4/1/2023",
      value: [410, 250, 670],
    },
    {
      year: "5/1/2023",
      value: [250, 410, 670],
    },
    {
      year: "6/1/2023",
      value: [670, 190, 230],
    },
    {
      year: "7/1/2023",
      value: [190, 350, 310],
    },
    {
      year: "8/1/2023",
      value: [230, 350, 310],
    },
    {
      year: "9/1/2023",
      value: [350, 310, 230],
    },
    {
      year: "10/1/2023",
      value: [310, 410, 250],
    },
  ];
  const config = {
    data,
    xField: "year",
    yField: "value",

    color: "#EF6A4E",
    line: {
      size: 3,
    },
    point: {
      size: 3,
      shape: "circle",
      style: {
        fill: "#EF6A4E",
        stroke: "#EF6A4E",
        with: "2px",
        lineWidth: 1,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "red",
          fill: "#000",
        },
      },
    },
    xaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#FF1654",
        },
        labels: {
          style: {
            colors: "#FF1654",
          },
        },
        title: {
          text: "Series A",
          style: {
            color: "#FF1654",
          },
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#247BA0",
        },
        labels: {
          style: {
            colors: "#247BA0",
          },
        },
        title: {
          text: "Series B",
          style: {
            color: "#247BA0",
          },
        },
      },
    ],
    yaxis: {
      categories: ["Lượt like", "Lượt comment", "Lượt chia sẻ"],
    },
    colorfield: "type",
    // color: ["#EF6A4E", "#EF6A4E"],
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };
  return (
    <div style={{ height: "370px" }}>
      <Line {...config} />
    </div>
  );
};

export default ChartLineDot;
