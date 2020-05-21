import React from "react";
import { Router, Link } from "@reach/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import { CoffeeMap } from "./maps/CoffeeMap";
import { KitchenSink } from "./kitchensink/KitchenSink";

import "./App.css";
import logo from "./logo.svg";

function App() {
    return (
        <div className="App">
            <Container>
                <Navbar variant="dark">
                    <Navbar.Brand>
                        <Image
                            src={logo}
                            xs={4}
                            className="App-logo"
                            alt="logo"
                        ></Image>
                    </Navbar.Brand>
                    <Nav>
                        <Link className="nav-link" to="/">
                            Home
                        </Link>
                        <Link className="nav-link" to="/map">
                            Map
                        </Link>
                        <Link className="nav-link" to="/kitchensink">
                            Charts
                        </Link>
                    </Nav>
                </Navbar>
            </Container>
            <Router>
                <CoffeeMap path="/map"></CoffeeMap>
                <KitchenSink path="/kitchensink"></KitchenSink>
            </Router>
        </div>
    );
}

export default App;
