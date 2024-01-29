import React, { useState } from "react";
import { Message } from "semantic-ui-react";

const InstructionsMessage = ({ onDismiss, header, content }) => {
  const [showMessage, setShowMessage] = useState(true);

  const handleClose = () => {
    setShowMessage(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <>
      {showMessage && (
        <Message
          info
          onDismiss={handleClose}
          header={header || "Instructions"}
          content={content || "No content provided."}
        />
      )}
    </>
  );
};

export default InstructionsMessage;
