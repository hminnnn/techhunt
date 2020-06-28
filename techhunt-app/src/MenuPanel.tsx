import React from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

export function MenuPanel() {
  return (
    <Col className="menuPanel" xs={2}>
      <Nav>
        <Nav.Item>
          <Nav.Link href="/home">Active</Nav.Link>
        </Nav.Item>
      </Nav>
    </Col>
  );
}
