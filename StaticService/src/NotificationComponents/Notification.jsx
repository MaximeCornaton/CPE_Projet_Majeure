import React from "react";
import { Message, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Notification = ({
  type,
  header,
  content,
  icon,
  link,
  onClick,
  buttonTitle,
}) => (
  <Message
    positive={type === "positive"}
    negative={type === "negative"}
    info={type === "info"}
  >
    {icon && <i className={`icon ${icon}`} />}
    <Message.Content>
      {header && <Message.Header>{header}</Message.Header>}
      {content && <p>{content}</p>}
      {link && (
        <Button as={Link} to={link} onClick={onClick}>
          {buttonTitle}
        </Button>
      )}
    </Message.Content>
  </Message>
);

export default Notification;
