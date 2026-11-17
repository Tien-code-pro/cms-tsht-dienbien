import React, { useEffect, useRef, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ChartColumn2 = (props) => {
  const { dataPageInteract } = props;
  const [option1, setOption1] = useState([]);
  const chartRef = useRef(null);
  useEffect(() => {
    let arr =
      dataPageInteract.length > 0 &&
      dataPageInteract.map((e) => ({ label: e.category_name, y: e.tong }));

    setOption1(arr);
  }, [dataPageInteract]);

  useEffect(() => {
    chartRef.current = chartRef.current.render();
  }, []);

  const options = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: false,
    title: {
      fontFamily: "verdana",
    },
    dataPointWidth: 30,
    axisY: {
      labelFontColor: "#949494",
      title: "",
      includeZero: false,
      gridColor: "#D9D9D9",
    },

    data: [
      {
        type: "stackedColumn",
        name: "Lượt Like",
        showInLegend: false,
        yValueFormatString: "#,###",
        color: "#09B39C",
        dataPoints: option1,
      },
      {
        type: "stackedColumn",
        name: "Lượt comment",
        showInLegend: false,
        yValueFormatString: "#,###",
        color: "#67B7E2",
        dataPoints: [],
      },
      {
        type: "stackedColumn",
        name: "Lượt chia sẻ",
        showInLegend: false,
        yValueFormatString: "#,###",
        color: "#A2D1EB",
        dataPoints: [],
      },
    ],
  };

  return (
    <div>
      <CanvasJSChart
        options={options}
        onRef={(ref) => (chartRef.current = ref)}
      />
    </div>
  );
};

export default ChartColumn2;
