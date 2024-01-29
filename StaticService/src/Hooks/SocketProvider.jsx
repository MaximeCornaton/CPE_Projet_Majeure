import { useEffect, useState, createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setFlaskID } from "../actions/backendActions";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [nodeSocket, setNodeSocket] = useState(null);
  //const [flaskSocket, setFlaskSocket] = useState(null);

  const user = useSelector((state) => state.user).user;

  useEffect(() => {
    const newNodeSocket = io("http://localhost:3001");
    //const newFlaskSocket = io("http://localhost:5001");

    newNodeSocket.on("connect", () => {
      console.log("Connected to Node server");
    });

    // newFlaskSocket.on("connect", () => {
    //   console.log("Connected to Flask server");

    //   newFlaskSocket.on("ID_transfer", (flaskIdentifier) => {
    //     console.log("flaskIdentifier : ", flaskIdentifier);
    //dispatch(setFlaskID(flaskIdentifier));

    //   });

    //   if (user) {
    //     newFlaskSocket.emit("register", {
    //       userID: user.userId,
    //       flaskID: flaskID,
    //     });
    //   }
    // });

    setNodeSocket(newNodeSocket);
    //setFlaskSocket(newFlaskSocket);

    return () => {
      newNodeSocket.disconnect();
      //newFlaskSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        nodeSocket,
        //flaskSocket
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export { SocketProvider };
