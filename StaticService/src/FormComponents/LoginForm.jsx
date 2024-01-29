import React, { useState } from "react";
import {
  Form,
  Header,
  Button,
  Message,
  Container,
  Segment,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../Hooks";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, error, clearError } = useAuthentication();

  const [loginInfo, setLoginInfo] = useState({
    login: "",
    password: "",
  });

  const processInput = (event) => {
    const target = event.currentTarget;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const connectOrder = async () => {
    try {
      await login(loginInfo.login, loginInfo.password);
      clearError();
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const cancelOrder = () => {
    console.log("LoginForm annulé");
    setLoginInfo({
      login: "",
      password: "",
    });
    clearError();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    connectOrder();
  };

  return (
    <Container>
      <Segment>
        <Form onSubmit={handleSubmit}>
          <Header as="h4" dividing>
            User login
          </Header>

          {error && <Message negative>{error}</Message>}

          <Form.Field>
            <Form.Input
              fluid
              label="Login"
              placeholder="Login"
              name="login"
              onChange={processInput}
              value={loginInfo.login}
            />
          </Form.Field>

          <Form.Field>
            <Form.Input
              type="password"
              label="Password"
              placeholder="Password"
              name="password"
              onChange={processInput}
              value={loginInfo.password}
            />
          </Form.Field>

          <Button type="button" onClick={cancelOrder}>
            Cancel
          </Button>
          <Button type="submit">Connect</Button>
        </Form>

        <Message>
          Not registered? <Link to="/register">Register here</Link>
        </Message>
      </Segment>
    </Container>
  );
};

export default LoginForm;
