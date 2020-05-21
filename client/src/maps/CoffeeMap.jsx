import React from "react";
import {
    Map as LeafletMap,
    TileLayer,
    GeoJSON,
    SVGOverlay,
    Rectangle,
    Circle,
} from "react-leaflet";
import zipcodes from "./zip-codes.json";

// import styles from "./map.module.css";
import "./styles.css";
// import "../../../node_modules/leaflet/dist/leaflet.css";

const zipcodeGeoJSON = zipcodes;
const coordinates = [47.66, -122.42];
const svgBounds = [
    coordinates.map((c) => c - 0.05),
    coordinates.map((c) => c + 0.05),
];
const zoom = 11;

const geojsonStyle = {
    color: "dodgerblue",
    weight: 1,
    fillOpacity: 0.3,
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
            <LeafletMap
                center={coordinates}
                zoom={zoom}
                minZoom={zoom - 1}
                maxZoom={zoom + 3}
                zoomControl={false}
            >
                <TileLayer {...options} />
                <GeoJSON data={zipcodeGeoJSON} style={geojsonStyle}></GeoJSON>
                <Rectangle
                    bounds={svgBounds}
                    opacity="0.5"
                    color="slategray"
                ></Rectangle>
                <Circle
                    center={coordinates}
                    radius={2000}
                    color="magenta"
                ></Circle>
                <SVGOverlay
                    bounds={svgBounds}
                    // viewBox="0 0 100 100"
                    opacity="0.7"
                >
                    <circle r="10" cx="50%" cy="50%" fill="dodgerblue" />
                </SVGOverlay>
            </LeafletMap>
        );
    }
}
