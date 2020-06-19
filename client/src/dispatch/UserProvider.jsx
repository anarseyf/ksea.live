import React, { useState, createContext, useEffect } from "react";

export const UserContext = createContext();

export const UserContextKeys = {
  SelectedTweet: "SelectedTweet",
  TypeFilter: "TypeFilter",
};

const useUser = () => {
  const [user, setUser] = useState({});

  const setSelection = (key, value) => {
    console.log(`USER: ${key} -->`, value);
    setUser({ ...user, [key]: value });
  };

  useEffect(()=>{console.log('USER/useEffect')},[]);

  return { user, setSelection };
};

export const UserProvider = ({ children }) => {
  return (
    <UserContext.Provider value={useUser()}>{children}</UserContext.Provider>
  );
};
