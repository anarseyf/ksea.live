import React, { useState, useEffect, createContext } from "react";
import { getTweets } from "../logic";
export const TweetsContext = createContext();

export const useTweets = () => {
    let [tweets, setTweets] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            tweets = await getTweets();
            setTweets(tweets);
        };
        fetch();
    }, []);

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
