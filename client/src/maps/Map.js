import React from "react";
import { Map as LeafletMap, TileLayer, Marker, Popup } from "react-leaflet";
// import styles from "./map.module.css";
import "./styles.css";
// import "../../../node_modules/leaflet/dist/leaflet.css";

const coordinates = [47.6, -122.32];
const zoom = 11;

export class CoffeeMap extends React.Component {
    render() {
        return (
            <LeafletMap center={coordinates} zoom={zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coordinates}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </LeafletMap>
        );
    }
}
