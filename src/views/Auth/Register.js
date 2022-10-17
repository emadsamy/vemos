import React, {useEffect, useState} from 'react';
import {Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import classes from './Auth.module.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Alert from 'react-bootstrap/Alert';
import { GetJwt } from "../../helpers/index";


const Register = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const authActionHandler = (e) => {
        e.preventDefault();
        dispatch(actions.register(name, email, password, confirmPassword));
    };

    const { errors, register, loading } = useSelector((state) => ({
            register: state.register,
            errors: state.errors,
            loading: state.loading,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (register.success) {
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }
    }, [register]);

    let redirect = '';
    if (GetJwt()) {
        redirect = <Navigate to="/newsfeed" />
    }

    return (
        <div className={classes.authContainer}>
            {redirect}
            <div className={`container`}>
                <h1>Register</h1>
                {
                    errors ? <div className={classes.alertContainer}>{errors.map((err, index) => {return <Alert key={index} variant={'danger'}>{err}</Alert>})}</div> : ''
                }

                {
                    register.success ? 
                    <div className={classes.alertContainer}><Alert className={`text-capitalize`} variant={'success'}>{register.message} <NavLink className={classes.authLink} to="/login">Go to login now</NavLink> </Alert></div> : ''
                }
                
                <div className={classes.authForm}>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control value={name} onChange={(e) => setName(e.target.value)} className={classes.authInput} name="name" type="name" placeholder="Enter your full name" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} className={classes.authInput} name="email" type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} className={classes.authInput} name="password" type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="formBasicConPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={classes.authInput} name="confirm_password" type="password" placeholder="Confirm Password" />
                        </Form.Group>

                        <Button disabled={loading} onClick={authActionHandler} variant="primary" type="button">
                            {loading ? 'Loading...' : 'Register Now'} 
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export { Register };