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

import "./App.css";
import logo from "./logo.svg";

function App() {
  return (
    <div className="App">
      <Container>
        <Navbar variant="dark">
          <Navbar.Brand>
            <Image src={logo} xs={4} className="App-logo" alt="logo"></Image>
          </Navbar.Brand>
          <Nav>
            <Link className="nav-link" to="/">
              Home
            </Link>
            <Link className="nav-link" to="/dispatch">
              Dispatch
            </Link>
            <Link className="nav-link" to="/kitchensink">
              Etc.
            </Link>
          </Nav>
        </Navbar>
      </Container>
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
