import React from "react";
import ChartComponent from "../component/ChartComponent";

const ChartScreen = ({ data }) => {
  return (
    <div className="chartScreen">
      <ChartComponent data={data} />
    </div>
  );
};

export default ChartScreen;
