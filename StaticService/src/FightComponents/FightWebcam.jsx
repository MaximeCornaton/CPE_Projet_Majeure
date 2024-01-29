import React, { useEffect, useState, useRef } from "react";

import { Loader } from "semantic-ui-react";

import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

import { useSocketContext } from "../Hooks/SocketProvider.jsx";

import { useSelector } from "react-redux";

const FightWebcam = () => {
  const { nodeSocket } = useSocketContext();
  const [poseLandmarker, setPoseLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  //const [landmarks, setLandmarks] = useState([]);
  const [opponentLandmarks, setOpponentLandmarks] = useState([]);
  const user = useSelector((state) => state.user).user;
  //console.log(user.userId);

  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [userEvent, setUserEvent] = useState(null);
  const [opponentEvent, setOpponentEvent] = useState(null);

  const opponentCanvasRef = useRef(null);

  useEffect(() => {
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      const newPoseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 2,
      });
      setPoseLandmarker(newPoseLandmarker);
      setLoading(false);
    };

    createPoseLandmarker();

    return () => {
      stopCam();
    };
  }, []);

  useEffect(() => {
    if (poseLandmarker) {
      enableCam();
      setupWebSocket();
    }
  }, [poseLandmarker]);

  useEffect(() => {
    drawOpponentLandmarks();
  }, [opponentLandmarks]);

  const sendLandmarks = (landmarks) => {
    console.log("Sending landmarks", user.userId);
    const send = {
      type: "lines",
      id: user.userId,
      data: landmarks[0],
    };
    nodeSocket.emit("landmarks", send);
  };

  const setupWebSocket = () => {
    nodeSocket.on("data_to_react", (data) => {
      if (data.type === "lines") {
        if (data.id != user.userId) {
          //console.log("Received landmarks", data.id);
          setOpponentLandmarks(data.data);
          //console.log("Opponent landmarks", opponentLandmarks);
        }
      } else if (data.type === "event") {
        if (data.id != user.userId) {
          //console.log("Received event", data.id);
          setOpponentEvent(data.data);
        } else {
          //console.log("Received event", data.id);
          setUserEvent(data.data);
        }
      }
    });
  };

  const stopCam = () => {
    if (webcamRunning) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setWebcamRunning(false);
    }
  };

  const enableCam = async () => {
    if (!videoRef.current) {
      console.error("videoRef is null");
      return;
    }

    setWebcamRunning(true);

    const video = videoRef.current;
    video.style.height = "360px";
    video.style.width = "480px";

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });

      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        predictWebcam();
      };
    } catch (error) {
      console.warn("getUserMedia() is not supported by your browser");
    }
  };

  let lastVideoTime = -1;
  const predictWebcam = async () => {
    const video = videoRef.current;
    const canvasElement = canvasRef.current;

    const canvasCtx = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    canvasElement.style.height = "360px";
    canvasElement.style.width = "480px";

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
      lastVideoTime = video.currentTime;
      poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        for (const landmark of result.landmarks) {
          drawingUtils.drawLandmarks(landmark, {
            radius: (data) =>
              DrawingUtils.lerp(data.from.z || 0, -0.15, 0.1, 5, 1),
          });
          drawingUtils.drawConnectors(
            landmark,
            PoseLandmarker.POSE_CONNECTIONS
          );
        }
        sendLandmarks(result.landmarks);
        //setLandmarks(result.landmarks);
        canvasCtx.restore();
      });
    }

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const drawOpponentLandmarks = () => {
    const canvasElement = opponentCanvasRef.current;

    if (!canvasElement) return;

    const canvasCtx = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    canvasElement.style.height = "360px";
    canvasElement.style.width = "480px";

    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    drawingUtils.drawLandmarks(opponentLandmarks, {
      radius: (data) => DrawingUtils.lerp(data.from.z || 0, -0.15, 0.1, 5, 1),
      color: "black",
    });
    drawingUtils.drawConnectors(
      opponentLandmarks,
      PoseLandmarker.POSE_CONNECTIONS,
      { color: "black" }
    );
  };

  if (loading) {
    return <Loader active inline="centered" />;
  }

  return (
    <div>
      <WebcamButton onClick={predictWebcam} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <WebcamView videoRef={videoRef} canvasRef={canvasRef} />
          <p>{userEvent}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <OpponentCanvas canvasRef={opponentCanvasRef} />
          <p>{opponentEvent}</p>
        </div>
      </div>
    </div>
  );
};

const WebcamView = ({ videoRef, canvasRef }) => {
  const style = {
    width: "480px",
    height: "360px",
    position: "relative",
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    position: "absolute",
  };

  return (
    <div style={style}>
      <video ref={videoRef} style={videoStyle} autoPlay playsInline></video>
      <canvas
        className="output_canvas"
        ref={canvasRef}
        width="1280"
        height="720"
        style={{ position: "absolute", left: "0px", top: "0px" }}
      ></canvas>
    </div>
  );
};

const OpponentCanvas = ({ canvasRef }) => {
  const style = {
    width: "480px",
    height: "360px",
    position: "relative",
  };

  return (
    <div style={style}>
      <canvas
        className="opponent_canvas"
        ref={canvasRef}
        width="480"
        height="360"
        style={{ position: "absolute", left: "0px", top: "0px" }}
      ></canvas>
    </div>
  );
};

const WebcamButton = ({ onClick }) => (
  <button
    id="webcamButton"
    className="mdc-button mdc-button--raised"
    onClick={onClick}
  >
    Display Landmarks
  </button>
);

export { WebcamView, WebcamButton };

export default FightWebcam;
