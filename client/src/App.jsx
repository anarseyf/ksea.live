import React from "react";
import { Router, Link, Redirect } from "@reach/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import { Dispatch } from "./dispatch/Dispatch";
import { DispatchAll } from "./dispatch/DispatchAll";
import { DispatchArea } from "./dispatch/DispatchArea";
import { KitchenSink } from "./kitchensink/KitchenSink";

import styles from "./app.module.scss";

function App() {
  return (
    <div className={styles.app}>
      <Router>
        <Redirect from="/" to="/dispatch" />
        <Dispatch path="/dispatch/">
          <DispatchAll default />
          <DispatchArea path=":area" />
        </Dispatch>
        <KitchenSink path="/kitchensink" />
      </Router>
    </div>
  );
}

export default App;
