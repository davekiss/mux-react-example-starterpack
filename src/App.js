import './App.css';
import { useEffect, useState, useCallback } from "react";
import Bar from "./Bar";
import MuxVideo from "@mux-elements/mux-video-react";

import { differenceInMinutes, startOfMinute } from 'date-fns'

function App() {
  const [currentViewers, setCurrentViewers] = useState();
  const [historicalViewers, setHistoricalViewers] = useState();

  const getViewers = useCallback(async () => {
    const response = await fetch(`/my-api/data/v1/realtime/metrics/current-concurrent-viewers/timeseries`)
    const payload = await response.json();

    const rows = payload.data;
    const currentValue = rows[rows.length - 1].value;

    let historicalValues = {};

    rows.forEach(row => {
      const date = startOfMinute(new Date(row.date));
      const delta = differenceInMinutes(date, startOfMinute(new Date()));

      const label = `${delta}m`;
      // set if it doesn't exist, or, if it is less than the incoming value
      if (!historicalValues[label] || historicalValues[label] < row.value) {
        historicalValues[label] = row.value;
      }
    });

    // massage into a shape compatible with react-charts
    historicalValues = Object.keys(historicalValues).map(key => ({
      label: key,
      value: historicalValues[key]
    }))

    return { currentValue, historicalValues }
  }, []);

  const refreshValues = useCallback(async () => {
    const { currentValue, historicalValues } = await getViewers();
    setCurrentViewers(currentValue);
    setHistoricalViewers(historicalValues);
    console.dir(historicalValues);
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
        metadata={{
          video_id: "video-id-123456",
          video_title: "Super Interesting Video",
          viewer_user_id: "user-id-bc-789",
        }}
        envKey="huqs2grm9q4lq9bifqeou30g4"
        streamType="on-demand"
        controls
      />
    </div>
  );
}

export default App;
