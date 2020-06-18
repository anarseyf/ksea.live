import React from "react";
import { Router, Redirect } from "@reach/router";

import { Dispatch } from "./dispatch/Dispatch";
import { DispatchAll } from "./dispatch/DispatchAll";
import { DispatchArea } from "./dispatch/DispatchArea";

import styles from "./app.module.scss";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Dispatch path="/">
          <DispatchAll default />
          <DispatchArea path=":area" />
        </Dispatch>
      </Router>
    </div>
  );
}

export default App;
