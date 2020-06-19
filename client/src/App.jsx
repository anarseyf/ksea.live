import React from "react";
import { Router } from "@reach/router";
import { Dispatch } from "./dispatch/Dispatch";
import { DispatchAll } from "./dispatch/DispatchAll";
import { DispatchArea } from "./dispatch/DispatchArea";

import styles from "./app.module.scss";
import { StatusProvider } from "./dispatch/StatusContext";
import { UserProvider } from "./dispatch/UserProvider";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <StatusProvider path="/">
          <UserProvider default>
            <DispatchAll default />
          </UserProvider>
          <UserProvider path=":area">
            <DispatchArea path="/" />
          </UserProvider>
        </StatusProvider>
      </Router>
    </div>
  );
}

export default App;
