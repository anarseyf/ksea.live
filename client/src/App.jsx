import React from "react";
import { Router, Link } from "@reach/router";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { CoffeeMap } from "./maps/CoffeeMap";
import { KitchenSink } from "./kitchensink/KitchenSink";

import "./App.css";
import logo from "./logo.svg";

function App() {
    return (
        <div className="App">
            <Navbar bg="dark" className="text-center">
                <Nav>
                    <Nav.Link>
                        <Link to="/">Home</Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/map">Map</Link>
                    </Nav.Link>
                    <Nav.Link>
                        <Link to="/kitchensink">Charts</Link>
                    </Nav.Link>
                </Nav>
            </Navbar>
            <img src={logo} className="App-logo" alt="logo" />
            <Router>
                <CoffeeMap path="/map"></CoffeeMap>
                <KitchenSink path="/kitchensink"></KitchenSink>
            </Router>
        </div>
    );
}

export default App;
