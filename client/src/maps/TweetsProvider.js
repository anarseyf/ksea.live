import React, { createContext } from "react";
import { useTweets } from "./useTweets";
export const TweetsContext = createContext();

export const TweetsProvider = ({ children }) => {
    const [tweets] = useTweets();
    return (
        <TweetsContext.Provider value={tweets}>
            {children}
        </TweetsContext.Provider>
    );
};
