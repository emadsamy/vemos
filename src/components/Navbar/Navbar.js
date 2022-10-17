import React, {useEffect, useState} from 'react';
import {Route, Switch, NavLink } from 'react-router-dom';
import axios from 'axios';
import classes from './Navbar.module.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { GetJwt } from "../../helpers/index";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as actions from "../../store/index";

const NavbarComponent = (props) => {
    const dispatch = useDispatch();
    useState(() => {
        if (GetJwt()) {
            dispatch(actions.me());
        }
    }, [dispatch]);
    const [userData, setUserData] = useState("");
    const rows = useSelector((state) => state.me);

    // const { me } = useSelector((state) => ({
    //         me: state.me,
    //     }), shallowEqual
    // );


    return (
        <div className={classes.navbarContainer}>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                <NavLink to="/"><Navbar.Brand>React Social Media</Navbar.Brand></NavLink>
                    {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                        <Nav>
                            {
                                GetJwt() ? <div>
                                    {/* <NavLink to="/newsfeed" className={classes.navLink}>Profile</NavLink> */}
                                    <NavDropdown className={`text-capitalize`} title={rows.name} id="collasible-nav-dropdown">
                                        <div className={classes.dropdownLink}><NavLink to="/newsfeed">News Feed</NavLink></div>
                                        <div className={classes.dropdownLink}><NavLink to="/logout">Logout</NavLink></div>
                                    </NavDropdown>
                                </div> :
                                <div>
                                    <NavLink to="/register" className={classes.navLink}>Register</NavLink>
                                    <NavLink to="/login" className={classes.navLink}>Login</NavLink>
                                </div> 
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export { NavbarComponent };