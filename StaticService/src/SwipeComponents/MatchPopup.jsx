import React, { useState, useEffect } from "react";
import { Button, Icon } from "semantic-ui-react";

const MatchPopup = ({ name }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return visible ? (
    <div
      style={{
        zIndex: 1000,
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#4caf50",
          color: "#fff",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
          padding: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", margin: "20px 0" }}>
          Nouveau match !
        </h2>
        <Button icon color="green" style={{ margin: "auto", display: "block" }}>
          <Icon name="check" />
        </Button>
      </div>
    </div>
  ) : null;
};

export default MatchPopup;
