import React, { useState, createContext } from "react";

export const UserContext = createContext();

export const UserContextKeys = {
  SelectedTweet: "SelectedTweet",
};

const useUser = () => {
  const [user, setUser] = useState({});

  const setSelection = (key, value) => {
    console.log(`USER: ${key} --> ${JSON.stringify(value, null, 2)}`);
    setUser({ ...user, [key]: value });
  };

  return [user, setSelection];
};

export const UserProvider = ({ children }) => {
  return (
    <UserContext.Provider value={useUser()}>{children}</UserContext.Provider>
  );
};
