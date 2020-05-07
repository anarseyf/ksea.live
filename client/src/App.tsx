import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styles from "./app.module.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getEnv, getSeattle911 } from "./logic";

function App() {
  const initialData: string[] = [];
  const [data, setData] = useState(initialData);

  function updateEnv() {
    getEnv()
      .then((data) => setData([`NODE_ENV: ${data.NODE_ENV}`]))
      .catch((error) => setData([error]));
  }

  function updateData() {
    getSeattle911()
      .then((data) => {
        console.log("App: ", data);
        setData(data.map((v) => JSON.stringify(v, null, 4)));
      })
      .catch((error) => setData([error]));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>OK then</p>
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
        <Table size="sm" bordered hover variant="dark">
          <tbody>
            {data.map((d) => (
              <tr>
                <td align="left" color="white">
                  <pre>{d}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </header>
    </div>
  );
}

export default App;
