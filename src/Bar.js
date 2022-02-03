import React, { useMemo } from "react";
import { Chart } from "react-charts";

export default function Bar() {
  const data = useMemo(() => [
    {
      label: 'Real-time viewers',
      data: [
        {
          time: "-10m",
          viewers: 6,
        },
        {
          time: "-9m",
          viewers: 12,
        },
        {
          time: "-8m",
          viewers: 20,
        },
        {
          time: "-7m",
          viewers: 19,
        },
        {
          time: "-6m",
          viewers: 23,
        },
        {
          time: "-5m",
          viewers: 6,
        },
        {
          time: "-4m",
          viewers: 12,
        },
        {
          time: "-3m",
          viewers: 20,
        },
        {
          time: "-2m",
          viewers: 19,
        },
        {
          time: "-1m",
          viewers: 23,
        }
      ],
    },
  ], []);

  const primaryAxis = React.useMemo(
    () => ({
      getValue: datum => datum.time,
    }),
    []
  )

  const secondaryAxes = React.useMemo(
    () => [
      {
        getValue: datum => datum.viewers,
        min: 0,
        max: 30
      },
    ],
    []
  )

  return (
    <div style={{ width: "300px", height: "150px", margin: "50px" }}>
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes
        }}
      />
    </div>
  );
}
