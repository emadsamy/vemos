import React, {useEffect, useState} from 'react';
import {Route, Switch, NavLink} from 'react-router-dom';
import axios from 'axios';


const NotFound = (props) => {
    useEffect(() => {
        
    }, []);
    return (
        <div className={''}>
            <div className={`container`}>
                page not found
            </div>
        </div>
    );
}

export { NotFound };