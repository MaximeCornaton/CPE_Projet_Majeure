import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../actions/userActions";
import { useSocketContext } from "../Hooks/SocketProvider";

const useAuthentication = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user).user;
  const [error, setError] = useState(null);
  const { nodeSocket } = useSocketContext();

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost/userservice/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userLogin: username,
          userPwd: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.text();
      console.log("Authentication successful. Response data:", responseData);

      const user = {
        userId: responseData,
        login: username,
      };
      dispatch(setUser(user));
      
      nodeSocket.emit("register", user.userId);

    } catch (error) {
      console.error("Authentication failed:", error);
      setError("Authentication failed. Please check your credentials.");
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const logout = () => {
    dispatch(clearUser());
  };

  return { login, error, user, clearError, logout };
};

export default useAuthentication;
