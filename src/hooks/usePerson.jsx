import React, { useContext } from "react";
import { UserContext } from "../contexts/UserProvider";

const usePerson = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("Context was used outside UserProvider");
  return context;
};

export default usePerson;
