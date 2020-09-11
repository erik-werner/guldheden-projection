import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BarChart, ChartData} from "./components/BarChart/BarChart";

const data: ChartData = {
  label: 'hej',
  value: 10
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <BarChart data={[data]} width={100} height={100} />
    </div>
  );
}

export default App;
