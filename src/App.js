import { useEffect, useState } from "react";
import Bar from "./Bar";

const assetId = 'CJJ8nFi8eWRc6x00OWWmxD028596ufz01pTV4snVzgqr4g';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      fetch(`/stats?assetId=${assetId}`)
        .then(resp => resp.json())
        .then(payload => {
          console.log(payload);
          setData(prevState => [...prevState, payload.data]);
        });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  console.log(data);

  return (
    <div>
      <Bar />
    </div>
  );
}

export default App;
