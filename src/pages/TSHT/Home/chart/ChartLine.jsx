import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Line } from "@ant-design/plots";

const ChartLine = () => {
  const data = [
    {
      year: "4/1/2023",
      value: 510,
    },
    {
      year: "5/1/2023",
      value: 564,
    },
    {
      year: "6/1/2023",
      value: 713,
    },
    {
      year: "7/1/2023",
      value: 810,
    },
    {
      year: "8/1/2023",
      value: 436,
    },
    {
      year: "9/1/2023",
      value: 345,
    },
    {
      year: "10/1/2023",
      value: 618,
    },
  ];

  const config = {
    data,
    xField: "year",
    yField: "value",

    label: {
      // size: 10,
      style: {
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 30,
      },
      offset: 15,
    },
    color: "#09B39C",
    line: {
      size: 4,
    },
    point: {
      size: 0,
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
    yAxis: {
      min: 100, // Giá trị y tối thiểu là 100
      max: 900, // Giá trị y tối đa là 900
      nice: true,
      tickCount: 9,
    },
    colorfield: "type",
    interactions: [
      {
        type: "marker-active",
      },
    ],
  };
  return (
    <div style={{ height: "430px" }}>
      <Line {...config} />
    </div>
  );
};

export default ChartLine;
