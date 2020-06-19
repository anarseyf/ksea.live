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
        <StatusProvider path="/">
          <Dispatch default>
            <DispatchAll default />
            <DispatchArea path=":area" />
          </Dispatch>
        </StatusProvider>
      </Router>
    </div>
  );
}

export default App;
