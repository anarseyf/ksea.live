import React from "react";
import { Router } from "@reach/router";
import { DispatchAll } from "./dispatch/DispatchAll";
import { DispatchArea } from "./dispatch/DispatchArea";
import { StatusProvider } from "./dispatch/StatusContext";
import { UserProvider } from "./dispatch/UserProvider";
import "./colors.scss";
// import styles from "./app.module.scss";
import { ThemeProvider } from "./dispatch/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <StatusProvider>
        <Router>
          <UserProvider path="/">
            <DispatchAll default />
          </UserProvider>
          <UserProvider path=":area">
            <DispatchArea path="/" />
          </UserProvider>
        </Router>
      </StatusProvider>
    </ThemeProvider>
  );
}

export default App;
