import React, {useEffect, useState} from 'react';
import {Route, Switch, NavLink, Navigate} from 'react-router-dom';
import axios from 'axios';
import classes from './Home.module.css';
import { Header } from './Header/Header';


const Home = (props) => {
    useEffect(() => {
        
    }, []);
    return (
        <div className={classes.homeContainer}>
            {/* <Navigate to="/login" /> */}
            <Header />
            <div className={`container`}>
            </div>
        </div>
    );
}

export { Home };