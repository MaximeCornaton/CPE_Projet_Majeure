import React from "react";
import { Container, Grid, Segment, Icon } from "semantic-ui-react";

const GlobalFooter = () => {
  return (
      <footer>
        <Segment inverted vertical style={{ padding: "3em 0em" }}>
          <Container>
            <Grid divided inverted stackable>
              <Grid.Row>
                <Grid.Column width={4}>
                  <h4>About</h4>
                  <p>Welcome to UberBagarre – the ultimate fighting experience ! <br/>
                    UberBagarre is not just an app; it's a platform where warriors from around the world come together
                    to test their skills, courage, and strategy in thrilling battles. <br/>
                    Whether you're a seasoned fighter or a newcomer looking for excitement, UberBagarre provides
                    a unique and engaging environment for everyone.</p>
                </Grid.Column>
                <Grid.Column width={4}>
                  <h4>Links</h4>
                  <ul>
                    <li>
                      <a href="">Home</a>
                    </li>
                    <li>
                      <a href="login">Login</a>
                    </li>
                    <li>
                      <a href="register">Register</a>
                    </li>
                  </ul>
                </Grid.Column>
                <Grid.Column width={4}>
                  <h4>Contact</h4>
                  <p>Send us an e-mail !</p>
                  <Icon name="mail" /> <a href="mailto:info@uberbagarre.com">info@uberbagarre.com</a>
                </Grid.Column>
                <Grid.Column width={4}>
                  <h4>Social Media</h4>
                  <div>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                      <Icon name="twitter" size="big" link/>
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                      <Icon name="facebook" size="big" link/>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                      <Icon name="linkedin" size="big" link/>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                      <Icon name="instagram" size="big" link/>
                    </a>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </footer>
  );
};

export default GlobalFooter;
