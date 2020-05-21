import React from "react";
import { Map as LeafletMap, TileLayer, GeoJSON } from "react-leaflet";
import zipcodes from "./zip-codes.json";

// import styles from "./map.module.css";
import "./styles.css";
// import "../../../node_modules/leaflet/dist/leaflet.css";

const zipcodeGeoJSON = zipcodes;
const coordinates = [47.6, -122.32];
const zoom = 11;

const geojsonStyle = {
    color: "darkslategray",
    weight: 2,
    fillOpacity: 0.4,
    fillColor: "orangered",
};

console.log(zipcodes);

export class CoffeeMap extends React.Component {
    render() {
        const options = {
            url:
                "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}",
            ext: "png",
            accessToken:
                "pk.eyJ1IjoiYW5hcnNleWYiLCJhIjoiY2thZXlra3llMGF4MDJ4cXYzY2ZkamVkdyJ9.K8CENC0jz2D0O6ziL_jnNg", // Mapbox: 'coffee' token
            attribution:
                'Map tiles by <a href="http://stamen.com">Stamen</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        };
        return (
            <LeafletMap center={coordinates} zoom={zoom}>
                <TileLayer {...options} />
                <GeoJSON data={zipcodeGeoJSON} style={geojsonStyle}></GeoJSON>
            </LeafletMap>
        );
    }
}
