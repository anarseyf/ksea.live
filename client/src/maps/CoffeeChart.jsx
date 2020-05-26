import React, { useContext } from "react";
import d3 from "d3";
import { TweetsContext } from "./TweetsProvider";

export function CoffeeChart() {
    const tweets = useContext(TweetsContext);

    return (
        <div>
            Tweets:
            <pre>
                <code>{JSON.stringify(tweets, null, 2)}</code>
            </pre>
        </div>
    );
}
