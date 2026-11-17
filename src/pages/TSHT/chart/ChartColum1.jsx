import React, { useEffect, useRef, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const ChartColumn = (props) => {
  const { dataPageInteract } = props;
  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  const chartRef = useRef(null);
  useEffect(() => {
    let arr =
      dataPageInteract.length > 0 &&
      dataPageInteract.map((e) => ({ label: e.year, y: e.value[0] }));
    let arr2 =
      dataPageInteract.length > 0 &&
      dataPageInteract.map((e) => ({ label: e.year, y: e.value[1] }));
    let arr3 =
      dataPageInteract.length > 0 &&
      dataPageInteract.map((e) => ({ label: e.year, y: e.value[2] }));
    setOption1(arr);
    setOption2(arr2);
    setOption3(arr3);
  }, [dataPageInteract]);

  // const toggleDataSeries = (e) => {
  //   if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
  //     e.dataSeries.visible = false;
  //   } else {
  //     e.dataSeries.visible = true;
  //   }
  //   chartRef.current.render();
  // };

  useEffect(() => {
    chartRef.current = chartRef.current.render();
  }, []);

  const options = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: false,
    title: {
      // text: "Operating Expenses of ACME",
      fontFamily: "verdana",
    },
    dataPointWidth: 30,
    axisY: {
      labelFontColor: "#949494",
      title: "",
      includeZero: false,
      gridColor: "#D9D9D9",

      // prefix: "€",
      // suffix: "k",
    },

    // toolTip: {
    //   shared: true,
    //   reversed: true,
    // },
    // legend: {
    //   verticalAlign: "center",
    //   horizontalAlign: "right",
    //   reversed: true,
    //   cursor: "pointer",
    //   itemclick: () => toggleDataSeries(),
    // },
    data: [
      {
        type: "stackedColumn",
        name: "Lượt Like",
        showInLegend: false,
        yValueFormatString: "#,###",
        color: "#299CDB",
        dataPoints: option1,
      },
      {
        type: "stackedColumn",
        name: "Lượt comment",
        showInLegend: false,
        yValueFormatString: "#,###",
        color: "#67B7E2",
        dataPoints: option2,
      },
      {
        type: "stackedColumn",
        name: "Lượt chia sẻ",
        showInLegend: false,
        yValueFormatString: "#,###",
        color: "#A2D1EB",
        dataPoints: option3,
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

export default ChartColumn;
