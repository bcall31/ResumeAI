import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Navi() {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/');
      };
    
    const handleMouse = (direc) => {
        if (direc === 'enter') {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
      };
    return (
        <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand onMouseEnter={() =>handleMouse('enter')} onMouseLeave={() => handleMouse('leave')} onClick={handleHomeClick}>ResumeAI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto ">
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex">
                    <NavLink className="nav-link" to="/resume">Resume</NavLink> 
                </div>
                {/* <div>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                        Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                        Separated link
                    </NavDropdown.Item>
                    </NavDropdown>
                </div> */}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}