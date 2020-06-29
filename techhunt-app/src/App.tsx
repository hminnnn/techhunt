import "@fortawesome/fontawesome-free/js/all";
import React, { useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import "./App.css";
import { Dashboard } from "./EmployeeDashboard";
import { MenuPanel } from "./MenuPanel";

function App() {
  useEffect(() => {
    console.log(navigator.language);
  }, []);
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <MenuPanel />
          <Dashboard />
        </Row>
      </Container>

      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>  */}
    </div>
  );
}

export default App;
