import React, {useEffect, useState} from 'react';
import {Route, Switch, NavLink, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import classes from './Auth.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Alert from 'react-bootstrap/Alert';
import { GetJwt } from "../../helpers/index";
import { NavbarComponent } from '../../components/Navbar/Navbar';


const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authActionHandler = (e) => {
        e.preventDefault();
        dispatch(actions.login(email, password));
    };

    const { loading, login, errors } = useSelector((state) => ({
            loading: state.loading,
            login: state.login,
            errors: state.errors
        }),
        shallowEqual
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            dispatch(actions.login(email, password));
        }
    }

    let redirect = '';
    if (GetJwt()) {
        redirect = <Navigate to="/newsfeed" />
    }

    return (
        <>
            <NavbarComponent />
            <div className={classes.authContainer}>
                {redirect}
                <div className={`container`}>
                    <h1>Login</h1>
                    {
                        errors ? <div className={classes.alertContainer}>{errors.map((err, index) => {return <Alert key={index} variant={'danger'}>{err}</Alert>})}</div> : ''
                    }
                    <div className={classes.authForm}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onKeyDown={handleKeyDown} value={email} onChange={(e) => setEmail(e.target.value)}  className={classes.authInput} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onKeyDown={handleKeyDown} value={password} onChange={(e) => setPassword(e.target.value)}  className={classes.authInput} type="password" placeholder="Password" />
                        </Form.Group>
                        {/* <Form.Group className="mb-5" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group> */}
                        <Button disabled={loading} onClick={authActionHandler} variant="primary" type="button">
                            {loading ? 'Loading...' : 'Login'} 
                        </Button>
                    </Form>
                    </div>
                </div>
            </div>
        </>
    );
}

export { Login };