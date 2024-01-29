import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  isWaiting as isWaitingAction,
  isFighting as isFightingAction,
  noAction as noActionAction,
  updateFightRequests,
} from "../actions/fightActions.jsx";
import {
  IS_WAITING,
  IS_FIGHTING,
  NO_ACTION,
  UPDATE_FIGHT_REQUESTS,
} from "../actions/fightActions.jsx";
import { useSocketContext } from "./SocketProvider.jsx";

import { useNavigate } from "react-router-dom";

const useFight = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { nodeSocket } = useSocketContext();

  const [error, setError] = useState(null);
  const [fightRequests, setFightRequests] = useState(
    useSelector((state) => state.fight).fightRequests
  );

  const isWaiting = useSelector((state) => state.fight).status === IS_WAITING;
  const isFighting = useSelector((state) => state.fight).status === IS_FIGHTING;
  const noAction = useSelector((state) => state.fight).status === NO_ACTION;

  const [fightResult, setFightResult] = useState(null);

  const user = useSelector((state) => state.user).user;

  const initiateFight = (targetID) => {
    //console.log(isWaiting, isFighting);
    if (isWaiting || isFighting) {
      console.log("Already fighting or waiting for a fight");
      return;
    }

    console.log("Initiating fight with", targetID);
    console.log("User ID:", user.userId);
    try {
      const fightData = {
        senderID: user.userId,
        targetID,
      };
      dispatch(isWaitingAction());

      nodeSocket.emit("fightRequest", fightData);
    } catch (error) {
      console.error("Error initiating fight:", error.message);
      setError("Error initiating fight");
    }
  };

  const startFight = () => {
    try {
      dispatch(isFightingAction());
    } catch (error) {
      console.error("Error lauching fight:", error.message);
      setError("Error lauching fight");
    }
  };

  const acceptFight = (fightID) => {
    try {
      //console.log(fightID);
      nodeSocket.emit("request_accept", fightID);
      setFightRequests([]);
      dispatch(updateFightRequests([]));
      dispatch(isWaitingAction());
    } catch (error) {
      console.error("Error accepting fight:", error.message);
      setError("Error accepting fight");
    }
  };

  useEffect(() => {
    //console.log("user:", user);
    try {
      nodeSocket.on("endFight", (fighter1, fighter2) => {
        console.log("Fight result:", fighter1, fighter2);
        const result_data = {
          winner: fighter1,
          loser: fighter2,
        };
        setFightResult(result_data);
        dispatch(noActionAction());
        navigate("/fight");
      });

      nodeSocket.on("fight_initiator", () => {
        console.log("Initiating fight, switch to combat page");

        navigate("/fight");

        //dispatch(isFightingAction());
      });

      nodeSocket.on("fightRequest", (fightData) => {
        console.log("FIGHTDATA", fightData);
        console.log("Received fight request from", fightData.senderID);

        setFightRequests((prevRequests) => {
          // Check if a fight request with the same ID already exists
          const existingRequestIndex = prevRequests.findIndex(
            (request) => request.id === fightData.id
          );

          if (existingRequestIndex !== -1) {
            // If exists, replace it with the new one
            const updatedRequests = [...prevRequests];
            updatedRequests[existingRequestIndex] = fightData;
            dispatch(updateFightRequests(updatedRequests));
            console.log("fightRequests", updatedRequests);
            return updatedRequests;
          } else {
            // If not, add the new request
            const newRequests = [...prevRequests, fightData];
            dispatch(updateFightRequests(newRequests));
            console.log("fightRequests", newRequests);
            return newRequests;
          }
        });
      });
    } catch (error) {
      console.error("Error setting up socket events:", error.message);
      setError("Error setting up socket events");
    }

    return () => {
      try {
        nodeSocket.off("fight_initiator");
        nodeSocket.off("fight_request_received");
      } catch (error) {
        console.error("Error removing socket event listeners:", error.message);
        setError("Error removing socket event listeners");
      }
    };
  }, [dispatch]);

  return {
    initiateFight,
    acceptFight,
    startFight,
    isWaiting,
    isFighting,
    noAction,
    fightResult,
    error,
    fightRequests,
  };
};

export default useFight;
