// Importing React and the useState hook
import React, { useState } from "react";

// Importing the UserContext object created in another file
import { UserContext } from "./usercontextContext";

// This component wraps the app and provides the user state to all child components
export const UserProvider = ({ children }) => {
  // Creating a user state, initially set to null
  const [user, setUser] = useState(null);

  // Returning the provider component that makes user and setUser available to its children
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children} {/* Rendering all child components inside the provider */}
    </UserContext.Provider>
  );
};
