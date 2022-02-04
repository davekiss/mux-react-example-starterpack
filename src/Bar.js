import React, { useMemo } from "react";
import { Chart } from "react-charts";

export default function Bar({ historicalViewers }) {
  const data = useMemo(() => [
    {
      label: 'Real-time viewers',
      data: historicalViewers
    },
  ], [historicalViewers]);

  const primaryAxis = React.useMemo(
    () => ({
      getValue: datum => datum.label,
      showGrid: false
    }),
    []
  )

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: datum => datum.value,
        min: 0,
        max: historicalViewers.reduce((prev, current) => current.value > prev.value ? current : prev).value * 1.1,
        show: false
      },
    ],
    [historicalViewers]
  )

  return (
    <div style={{ width: "400px", height: "150px" }}>
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
          dark: true,
          defaultColors: ["#93c5fd"]
        }}
      />
    </div>
  );
}
