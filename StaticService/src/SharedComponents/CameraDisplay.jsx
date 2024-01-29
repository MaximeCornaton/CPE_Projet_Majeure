import React, { useRef, useEffect } from "react";
import { useSocketContext } from "../Hooks/SocketProvider.jsx";

const CameraDisplay = () => {
  const videoRef = useRef(null);
  const { nodeSocket } = useSocketContext();

  useEffect(() => {
    let stream;
    let videoTrack;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Capture video frames
          videoTrack = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(videoTrack);

          // Send screenshots to the server
          const sendScreenshot = async () => {
            const blob = await imageCapture.takePhoto();

            holistic.process(blob).then((results) => {
              console.log(results);
            });
            // Send the screenshot to the server
            nodeSocket.emit("videoFrame", blob);
          };

          // Set up interval to send screenshots (adjust interval as needed)
          const screenshotInterval = setInterval(sendScreenshot, 1000);

          // Cleanup function to stop the camera and close the connection
          return () => {
            clearInterval(screenshotInterval);
            videoTrack.stop();
            nodeSocket.close();
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initCamera();
  }, [nodeSocket]);

  return <video ref={videoRef} width="400" height="300" autoPlay playsInline />;
};

export default CameraDisplay;
