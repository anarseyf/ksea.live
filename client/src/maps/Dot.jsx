import React from "react";
import { Circle } from "react-leaflet";

const opacity = 0.7;

export function Dot({ coordinates = [51.477, 0], color = "dodgerblue" }) {
    return (
        <>
            <Circle
                center={coordinates}
                radius={200}
                color={color}
                fill={true}
                fillOpacity={opacity}
                stroke={false}
            ></Circle>
            <Circle
                center={coordinates}
                radius={300}
                weight={1}
                color={color}
                opacity={opacity}
                fill={false}
            ></Circle>
            {/* <Circle
                center={coordinates}
                radius={600}
                weight={1}
                color={color}
                opacity={opacity}
                fill={false}
            ></Circle> */}
        </>
    );
}
