import logo from './logo.svg';
import './App.css';

import { useEffect } from "react";
import Bar from "./Bar";

function App() {
  useEffect(() => {
    fetch('/stats?assetId=CJJ8nFi8eWRc6x00OWWmxD028596ufz01pTV4snVzgqr4g').then(resp => resp.json()).then(payload => {
      console.log(payload);
    })
  }, []);

  return (
    <div className="App">
      <Bar />
    </div>
  );
}

export default App;
