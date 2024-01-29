import React, { useState } from "react";
import { Comment, Popup, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const ChatMessageItem = ({ message }) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const handleAuthorClick = () => {
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  return (
    <Comment>
      <Comment.Content>
        <Popup
          trigger={
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
              <Comment.Author as="a" onClick={handleAuthorClick}>
                {message.sender}
              </Comment.Author>
            </div>
          }
          content={
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '5px' }}>
              <Link to={`/profile/${message.senderId}`}>
                <Button content="Profil" icon="user" labelPosition="left" onClick={handlePopupClose} />
              </Link>
              <Button content="Fight" icon="hand rock" labelPosition="left" />
            </div>
          }
          on="click"
          open={popupOpen}
          onClose={handlePopupClose}
        />
        <Comment.Text>{message.content}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default ChatMessageItem;
