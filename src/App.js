import "./App.css";
import { useEffect, useState, useCallback } from "react";
import Bar from "./Bar";
import MuxVideo from "@mux-elements/mux-video-react";

import { differenceInSeconds } from "date-fns";

function App() {
  const [currentViewers, setCurrentViewers] = useState();
  const [historicalViewers, setHistoricalViewers] = useState();

  const getViewers = useCallback(async () => {
    const response = await fetch(`/ccv`);
    const { data: rows } = await response.json();

    const currentValue = new Intl.NumberFormat().format(rows[rows.length - 1].value);
    const now = new Date();

    const historicalValues = [...Array(30).keys()]
      .map((i) => {
        const valuesAtInterval = rows
          .filter((row) => {
            const delta = differenceInSeconds(now, new Date(row.date));
            return delta >= i * 60 && delta <= (i + 1) * 60;
          })
          .sort((a, b) => b.concurrent_viewers - a.concurrent_viewers);

        return {
          label: `-${i}m`,
          value: valuesAtInterval[0]?.concurrent_viewers || 0,
        };
      })
      .reverse();

    return { currentValue, historicalValues };
  }, []);

  const refreshValues = useCallback(async () => {
    const { currentValue, historicalValues } = await getViewers();
    setCurrentViewers(currentValue);
    setHistoricalViewers(historicalValues);
  }, [getViewers]);

  useEffect(() => {
    refreshValues();
    const timer = setInterval(refreshValues, 5000);
    return () => clearInterval(timer);
  }, [refreshValues]);

  return (
    <div>
      <div className="p-10 shadow m-10 rounded w-min bg-blue-600 text-white">
        <h1 className="text-sm">Active viewers right now</h1>
        <span className="text-5xl mb-10 block">{currentViewers}</span>

        {historicalViewers && <Bar historicalViewers={historicalViewers} />}
      </div>

      <MuxVideo
        playbackId="yVvUsu1ON3vuBRzfTBucWQzT96702ey02x5s1HR9nmcyA"
        envKey="huqs2grm9q4lq9bifqeou30g4"
        streamType="on-demand"
        controls
      />
    </div>
  );
}

export default App;
