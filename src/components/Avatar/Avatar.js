import React, {useEffect, useState} from 'react';
import {Route, Switch, NavLink } from 'react-router-dom';
import axios from 'axios';
import AvatarImg from '../../assets/img/default.png';
import { GetJwt } from "../../helpers/index";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as actions from "../../store/index";

const Avatar = (props) => {
    const dispatch = useDispatch();
    useState(() => {
        if (GetJwt()) {
            dispatch(actions.me());
        }
    }, [dispatch]);
    const [userData, setUserData] = useState("");
    const rows = useSelector((state) => state.me);

    return <img src={rows.avatar ? rows.avatar : AvatarImg} className={`img-fluid ${props.className}`} />
}

export { Avatar };