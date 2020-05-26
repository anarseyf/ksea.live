import React, { useState, useMemo, useEffect, useContext } from "react";
import { CoffeeMap } from "./CoffeeMap";
import { CoffeeChart } from "./CoffeeChart";
import { TweetsProvider } from "./TweetsProvider";

export function Coffee() {
    return (
        <TweetsProvider>
            <CoffeeMap />
            <CoffeeChart />
        </TweetsProvider>
    );
}
