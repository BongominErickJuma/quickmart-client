import React, { createContext, useState, useEffect } from "react";
import { getImageUrl, userService } from "../services/api";

// 1. Create the context
const UserContext = createContext();

// 2. Create the provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await userService.getMe();
        const currentUser = fetchedUser.data.user;

        currentUser.photo = getImageUrl(currentUser.photo);

        setUser(currentUser);
      } catch (err) {
        setError(err.message || "You are not logged in");
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, []); // ← only run on initial render

  error && console.log(error);
  return <UserContext.Provider value={{ user, setUser, isLoadingUser }}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
