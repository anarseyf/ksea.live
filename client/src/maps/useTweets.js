import { useState, useEffect } from "react";
import { getTweets } from "../api";

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
