import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../constant";
import { IUser } from "../types/User";
import { useNavigate } from "react-router-dom";

export interface CurrentUserContextType {
  currentUser: IUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  fetchUser: (accessToken?: string) => Promise<void>;
}

// Create the context with a default value
export const CurrentUserContext = createContext<
  CurrentUserContextType | undefined
>(undefined);

interface CurrentUserProviderProps {
  children: ReactNode;
}

export const CurrentUserProvider: React.FC<CurrentUserProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  // Example of fetching user data from an API or some auth service
  const fetchUser = async (accessToken?: string) => {
    try {
      // Replace this with your actual API call
      if (accessToken || localStorage.getItem("access_token")) {
        const { data: user } = await axios.get<IUser>(
          BACKEND_BASE_URL + "/auth/user-info",
          {
            headers: {
              access_token: accessToken || localStorage.getItem("access_token"),
            },
          },
        );
        setCurrentUser(user);
      }
    } catch (error) {
      navigate("/auth/sign-in");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{ currentUser, setCurrentUser, fetchUser }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
