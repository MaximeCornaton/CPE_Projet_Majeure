import React from "react";
import { Header } from "semantic-ui-react";

const PageLayout = ({ children, title }) => {
  return (
    <div style={{ margin: "0 auto", maxWidth: "1000px", padding: "3rem 0" }}>
      <Header>
        <h1>{title}</h1>
      </Header>

      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
