import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Line } from "@ant-design/plots";

const ChartLineDot = (props) => {
  const { dataPageReadAritcle } = props;
  const data = dataPageReadAritcle;
  const config = {
    data,
    xField: "year",
    yField: "value",

    label: null,
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
