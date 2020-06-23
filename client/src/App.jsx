import React from "react";
import { Router } from "@reach/router";
import { DispatchAll } from "./dispatch/DispatchAll";
import { DispatchArea } from "./dispatch/DispatchArea";
import { StatusProvider } from "./dispatch/StatusContext";
import { UserProvider } from "./dispatch/UserProvider";
import "./colors.scss"
// import styles from "./app.module.scss";
import classnames from 'classnames';

function App() {  
  return (
    <div className={classnames("app", "light")}>
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
