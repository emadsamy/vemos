import React, {useEffect, useState, useRef} from 'react';
import {Route, Switch, NavLink, Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import classes from './Profile.module.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SuccessTransferImg from '../../assets/img/success-transfer-money.jpg';

const SuccessTransfer = (props) => {
    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className={classes.modalContainer}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Success Transfer Money
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={`${classes.successTranser} text-center`}>
                        <img className={`img-fluid ${classes.stImg}`} src={SuccessTransferImg} alt={'Success Transfer Money'} />
                    </div>
                    <div className={`text-center ${classes.stText}`}>Success Transfer Money To (<b>emad@emad.com</b>)</div>
                    <div className={`text-center ${classes.stText}`}>fees (<b>15$</b>)</div>
                    <div className={`text-center ${classes.stText}`}>Balance Available (<b>15$</b>)</div>
                    <div className='text-center'>
                        <Button onClick={props.onHide}>Close!</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
export { SuccessTransfer };