import React from "react";
import { Router } from "@reach/router";
import { Dispatch } from "./dispatch/Dispatch";
import { DispatchAll } from "./dispatch/DispatchAll";
import { DispatchArea } from "./dispatch/DispatchArea";

import styles from "./app.module.scss";
import { StatusProvider } from "./dispatch/StatusContext";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Dispatch path="/">
          <StatusProvider default>
            <DispatchAll default />
          </StatusProvider>
          <StatusProvider path=":area">
            <DispatchArea path=":area" />
          </StatusProvider>
        </Dispatch>
      </Router>
    </div>
  );
}

export default App;
