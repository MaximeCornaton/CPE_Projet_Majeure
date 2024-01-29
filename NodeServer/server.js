import express from "express";
import { createServer } from "http";
import socketIo from "socket.io-client";
import * as socketIoServer from "socket.io";
//import fightService from "./fightService";
import { getUserData, processEvent, sendResults } from "./fightService.js";
import cors from "cors"; // Import cors
import { io } from "socket.io-client";
import PoseProcessor from "./pose_detection_class.js";

const app = express();
app.use(cors());
const server = createServer(app);

let fighter1Data;
let fighter2Data;
let actionValidity;
var endFight1;
var endFight2;
let userIDbyFlaskID = new Map();

// const chatSocket = io('http://localhost:3001');

// Connect to Flask WebSocket server
// const flaskSocket = socketIo("http://localhost:5001");

// flaskSocket.on("connect", (flaskID) => {
//   console.log("Connected to Flask server");
// });

// flaskSocket.on("ID_transfer", () => {});

// flaskSocket.on("transfer", (data) => {
//   if (data.type == "event") console.log("Event trigger", data.data);
//   const userID = userIDbyFlaskID.get(data.id);

//   if ((fighter1Data.id = userID)) {
//     let { newFighter1Data, newFighter2Data, newActionValidity } = processEvent(
//       fighter1Data,
//       fighter2Data,
//       data.data,
//       userID
//     );
//     fighter1Data = newFighter1Data;
//     fighter2Data = newFighter2Data;
//     actionValidity = newActionValidity;
//   } else if (fighter2Data == userID) {
//     let { newFighter1Data, newFighter2Data, newActionValidity } = processEvent(
//       fighter1Data,
//       fighter2Data,
//       data.data,
//       userID
//     );
//     fighter1Data = newFighter1Data;
//     fighter2Data = newFighter2Data;
//     actionValidity = newActionValidity;
//   }

//   if (actionValidity == false && data.type == "event") {
//     data.data = "";
//   }
//   ioReact.emit("data_to_react", data);
//   // Data also contains ID. In a first time, react filters out its own id.
//   // In a second time, a method could be called here that handles rooms where
//   // data is sent to one specifically
// });

// flaskSocket.on("disconnect", () => {
//   console.log("Disconnected from Flask server");
// });

// WebSocket (socket.io) server for React
const ioReact = new socketIoServer.Server(server, {
  cors: {
    origin: "http://localhost", // Replace with your React app's origin
    methods: ["GET", "POST"],
  },
});

const registeredUsers = new Map();
const fightRequests = new Map();
let nextfightID = 1;

ioReact.on("connection", (socket) => {
  console.log("React client connected");

  socket.on("landmarks", (landmarks) => {
    //console.log(landmarks);

    if (!landmarks) {
      return;
    }

    const poseProcessor = PoseProcessor.instance;
    poseProcessor.processData(landmarks.data);
    //console.log(poseProcessor.getData());
    let data = {
      data: poseProcessor.getData(),
      type: poseProcessor.getType(),
      id: landmarks.id,
    };
    //console.log(data)
    processAndSend(data);
  });

  socket.on("register", (userID) => {
    console.log("SOCKET ID : ", socket.id);
    registeredUsers.set(socket.id, userID);
    console.log("Registered Users:", registeredUsers);
  });

  socket.on("flaskID_update", (userID, flaskID) => {
    userIDbyFlaskID.set(flaskID, userID);
    console.log("userIDbyFlaskID ", userIDbyFlaskID);
  });

  socket.on("fightRequest", (fightData) => {
    console.log("Fight request:", fightData);
    console.log("Registered Users:", Array.from(registeredUsers.values()));

    const senderSocketId = getKeyByValue(registeredUsers, fightData.senderID);
    const targetSocketId = getKeyByValue(registeredUsers, fightData.targetID);

    console.log("Sender Socket ID:", senderSocketId);
    console.log("Target Socket ID:", targetSocketId);

    if (senderSocketId && targetSocketId) {
      const fightID = nextfightID++;

      fightRequests.set(fightID, {
        id: fightID,
        senderID: fightData.senderID,
        targetID: fightData.targetID,
      });

      ioReact
        .to(targetSocketId)
        .emit("fightRequest", { id: fightID, senderID: fightData.senderID });
    } else {
      console.log("Sender or target not online");
    }
  });

  socket.on("request_accept", async (fightID) => {
    console.log("FIGHTID : ", fightID);
    const receiverSocketId = socket.id;
    if (fightRequests.has(fightID)) {
      const { senderID, targetID } = fightRequests.get(fightID);

      const senderSocketId = getKeyByValue(registeredUsers, senderID);

      if (senderSocketId) {
        ioReact.to(senderSocketId).emit("fight_initiator");
        ioReact.to(receiverSocketId).emit("fight_initiator");

        //fightRequests.delete(fightID);
        if (fightRequests.has(fightID)) {
          const { senderID, targetID } = fightRequests.get(fightID);
          fighter1Data = await getUserData(senderID);
          fighter2Data = await getUserData(targetID);

          console.log("FIGHTER1DATA", fighter1Data);
          fighter1Data["blocking"] = false;
          fighter1Data["dodging_right"] = false;
          fighter1Data["dodging_left"] = false;

          fighter2Data["blocking"] = false;
          fighter2Data["dodging_right"] = false;
          fighter2Data["dodging_left"] = false;
        }
      } else {
        console.log("Sender not online");
      }
    } else {
      console.log("No pending fight request with the specified ID");
    }
  });

  socket.on("chatMessage", (data) => {
    console.log("RECEIVED A MESSAGE : ", data);
    const senderId = data.senderId;
    const sender = data.sender;
    const message = data.message;
    ioReact.emit("broadcastMessage", {
      senderId: senderId,
      sender: sender,
      message: message,
    });
    console.log("MESSAGE EMITTED TO ALL");
  });

  socket.on("disconnect", () => {
    registeredUsers.delete(socket.id);
    //flaskSocket.emit("stop_process");

    fightRequests.forEach((value, key) => {
      if (
        value.senderSocketId === socket.id ||
        value.targetSocketId === socket.id
      ) {
        fightRequests.delete(key);
        const senderSocketId = getKeyByValue(registeredUsers, userID);
        if (senderSocketId) {
          ioReact
            .to(senderSocketId)
            .emit("fight_request_cancelled", { cancelledBy: value.target });
        }
      }
    });

    console.log("React client disconnected");
  });
});

// Start the WebSocket (socket.io) server for React
const REACT_PORT = 3001;
server.listen(REACT_PORT, () => {
  console.log(`WebSocket server for React listening on port ${REACT_PORT}`);
});

function getKeyByValue(map, valueToFind) {
  for (const [key, value] of map.entries()) {
    if (value === valueToFind) {
      return key;
    }
  }
  return null; // Return null if the value is not found
}

function processAndSend(data) {

  const userID = data.id;


  if (data.type == "event") {
    if (fighter1Data.userId == userID) {
      let {
        newFighter1Data,
        newFighter2Data,
        newActionValidity,
        val_bool,  // Corrected property name
      } = processEvent(fighter1Data, fighter2Data, data.data, userID);
  
      if (newFighter1Data != undefined) {fighter1Data = newFighter1Data;}
      if (newFighter2Data != undefined) {fighter2Data = newFighter2Data;}
  
      actionValidity = newActionValidity;
      console.log(val_bool);  // Corrected property name
  
      if (val_bool) {  // Corrected property name
        ioReact.emit("endFight", fighter1Data, fighter2Data);
        sendResults(fighter1Data.userId)
      }
    } else if (fighter2Data.userId == userID) {
      let {
        newFighter1Data,
        newFighter2Data,
        newActionValidity,
        val_bool,  // Corrected property name
      } = processEvent(fighter1Data, fighter2Data, data.data, userID);
  
      if (newFighter1Data != undefined) {fighter1Data = newFighter1Data;}
      if (newFighter2Data != undefined) {fighter2Data = newFighter2Data;}
  
      actionValidity = newActionValidity;
      console.log(val_bool);  // Corrected property name
  
      if (val_bool) {  // Corrected property name
        ioReact.emit("endFight", fighter1Data, fighter2Data);
        sendResults(fighter1Data.userId)
      }
    }
  
    if (actionValidity == false && data.type == "event") {
      data.data = "Don't spam";
    }
  }
  
  
  

  

  

  //console.log(fighter1Data.userId, fighter2Data.userId, userID);
  //console.log(fighter1Data.userId, fighter2Data.userId, userID)

  //console.log(data)
  ioReact.emit("data_to_react", data);

  // Data also contains ID. In a first time, react filters out its own id.
  // In a second time, a method could be called here that handles rooms where
  // data is sent to one specifically
}
