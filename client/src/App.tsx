import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "react-bootstrap/Button";
import styles from "./app.module.css";
import { getEnv, getSeattle911 } from "./logic";
import { Chart } from "./Chart";
import { DataTable } from "./DataTable";

function App() {
  const initialData: object[] = [
    {
      address: "15TH AV E / E REPUBLICAN ST",
      type: "Aid Response",
      datetime: "2019-11-23T15:41:00.000",
      latitude: "47.623102",
      longitude: "-122.312631",
    },
  ];
  const [data, setData] = useState(initialData);

  function updateEnv() {
    getEnv()
      .then((data) => setData([{ NODE_ENV: data.NODE_ENV }]))
      .catch((error) => setData([{ error }]));
  }

  function updateData() {
    getSeattle911()
      .then((data) => {
        console.log("Data from API: ", data);
        setData(data);
      })
      .catch((error) => setData([{ error }]));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Chart></Chart>

        <Button
          variant="danger"
          className={`${styles.button} m-2`}
          onClick={updateEnv}
        >
          Get env
        </Button>
        <Button
          className={`${styles.button} m-2`}
          variant="danger"
          onClick={updateData}
        >
          Get data
        </Button>
        <DataTable data={data}></DataTable>
      </header>
    </div>
  );
}

export default App;
