import React from 'react';
import './App.css';
import {Map} from "./components/Map/Map";

const lineData = [[0, 20], [50, 30], [100, 50], [200, 60], [300, 90]];

function App() {
  return (
    <div className="App">
    <div>Map</div>
        <Map data={[lineData]} />
    </div>
  );
}

export default App;
