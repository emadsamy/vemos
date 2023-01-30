import React, { useEffect, useState } from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import axios from "axios";
import classes from "./Navbar.module.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import { GetJwt } from "../../helpers/index";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Logo from "../../assets/img/logo.png";
import { Avatar } from "../../components/Avatar/Avatar";

const NavbarComponent = ({ avatarUpdated, fullName }) => {
  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);
  const rows = useSelector((state) => state.me);

  return (
    <div className={classes.navbarContainer}>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <NavLink to="/">
            <Navbar.Brand>
              <img className={`img-fluid ${classes.logo}`} src={Logo} alt="Logo" />
            </Navbar.Brand>
          </NavLink>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Dropdown>
              {GetJwt() ? (
                <div className="d-flex align-items-center">
                  <Dropdown.Toggle className={classes.navDropdown} variant="Secondary" id="dropdown-basic">
                    <Avatar avatarUpdated={avatarUpdated} className={classes.avatar} />
                    <span className={`${classes.userName} text-capitalize`}>{fullName ? fullName : rows.name}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className={`text-capitalize`} id="collasible-nav-dropdown">
                    <div className={classes.dropdownLink}>
                      <NavLink to="/profile">Profile</NavLink>
                    </div>
                    <div className={classes.dropdownLink}>
                      <NavLink to="/">News Feed</NavLink>
                    </div>
                    <div className={classes.dropdownLink}>
                      <NavLink to="/logout">Logout</NavLink>
                    </div>
                  </Dropdown.Menu>
                </div>
              ) : (
                <div>
                  <NavLink to="/register" className={classes.navLink}>
                    Register
                  </NavLink>
                  <NavLink to="/login" className={classes.navLink}>
                    Login
                  </NavLink>
                </div>
              )}
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export { NavbarComponent };
