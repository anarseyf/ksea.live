import React, { useState, useEffect, createContext } from "react";

export const TweetsContext = createContext();

export const useTweets = () => {
    const [tweets, setTweets] = useState([{ tweet: "abc" }]);

    tweets.push({ tweet: "x" });

    return [tweets];
};

export const TweetsProvider = ({ children }) => {
    const [tweets] = useTweets();
    return (
        <TweetsContext.Provider value={tweets}>
            {children}
        </TweetsContext.Provider>
    );
};
