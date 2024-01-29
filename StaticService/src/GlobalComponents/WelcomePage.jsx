import React from "react";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import fight from "../fight.png"
import { Link } from "react-router-dom";

const WelcomePage = () => {
  return (
    <Container
      textAlign="center"
      style={{ marginTop: "3em", marginBottom: "3em" }}
    >
      <Header as="h1" content="Welcome to UberBagarre" />
      <p>
        The ultimate fighting experience! UberBagarre is not just an app; it's a
        platform where warriors from around the world come together to test
        their skills, courage, and strategy in thrilling battles. Whether you're
        a seasoned fighter or a newcomer looking for excitement, UberBagarre
        provides a unique and engaging environment for everyone.
      </p>
      <Segment>
        <Image
          src={fight}
          size="big"
          centered
        />
        <Button as={Link} to="/fight" primary style={{ marginTop: "1em" }}>
          Start fighting
        </Button>
      </Segment>
    </Container>
  );
};

export default WelcomePage;
