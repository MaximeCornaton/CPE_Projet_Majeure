import React, { useState, useEffect } from "react";
import { Popup } from "semantic-ui-react";
import AssistantIcon from "./AssistantIcon";
import "./Assistant.css";
import AssistantSpectre from "./AssistantSpectre";

const AssistantPopup = ({ sendToJarvis, jarvisMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const initializeSpeechRecognition = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("SpeechRecognition is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.lang = "fr-FR";
      recognition.onresult = (event) => {
        const latestTranscript =
          event.results[event.results.length - 1][0].transcript;

        setTranscript(latestTranscript);

        console.log(latestTranscript);

        sendToJarvis(latestTranscript);
      };

      setRecognition(recognition);
    };

    initializeSpeechRecognition();
  }, [sendToJarvis]);

  useEffect(() => {
    if (jarvisMessage) {
      console.log(jarvisMessage);
      readText(jarvisMessage);
    }
  }, [jarvisMessage]);

  const readText = (textToRead) => {
    const speechSynthesis = window.speechSynthesis;

    if (speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = "fr-FR";
      utterance.rate = 2;
      speechSynthesis.speak(utterance);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  const handleToggle = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  return (
    <div className="assistant-popup-container">
      <Popup
        trigger={
          <AssistantIcon
            onClick={() => {
              handleToggle();
              setIsOpen(!isOpen);
            }}
          />
        }
        content={isOpen && <AssistantSpectre message="Listening..." />}
        on="click"
        position="bottom right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default AssistantPopup;
