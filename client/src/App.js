import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { getData } from "./logic";

function updateData() {
  getData().then((data) => console.log("client: ", data));
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>OK then</p>
        <button onClick={() => updateData()}>get data</button>
      </header>
    </div>
  );
}

export default App;
