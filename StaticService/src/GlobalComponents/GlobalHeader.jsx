import React from "react";
import { Button, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { useAuthentication } from "../Hooks";

import { NotificationPopup } from "../NotificationComponents";

const GlobalHeader = () => {
  const { user, logout } = useAuthentication();

  const handleLogout = () => {
    logout();
  };

  if (user) {
    return (
      <>
        <Menu inverted>
          <Menu.Item>
            <Link to="/">Menu</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/leaderboard">Leaderboard</Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/chat">Chat</Link>
          </Menu.Item>

          <Menu.Item>
            <Link to="/fight">Fight</Link>
          </Menu.Item>

          <Menu.Item style={{ marginLeft: "auto" }}>
            <NotificationPopup />
          </Menu.Item>
          <Menu.Item>
            <Link to={`/profile/${user.userId}`}>Profile</Link>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={handleLogout}>Logout</Button>
          </Menu.Item>
        </Menu>
      </>
    );
  } else {
    return (
      <>
        <Menu inverted>
          <Menu.Item>
            <Link to="/">Menu</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/leaderboard">Leaderboard</Link>
          </Menu.Item>

          <Menu.Item style={{ marginLeft: "auto" }}>
            <Link to="/login">Login</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/register">Register</Link>
          </Menu.Item>
        </Menu>
      </>
    );
  }
};

export default GlobalHeader;
