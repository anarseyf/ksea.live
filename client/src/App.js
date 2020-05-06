import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styles from "./app.module.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getData } from "./logic";

function App() {
  const [data, setData] = useState({});

  function updateData() {
    getData()
      .then(setData)
      .catch((error) => setData({ error }));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>OK then</p>
        <Button className={styles.button} onClick={updateData}>
          Fetch data
        </Button>
        <Table bordered hover variant="dark">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map((key) => (
              <tr>
                <td>{key}</td>
                <td>{data[key]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </header>
    </div>
  );
}

export default App;
