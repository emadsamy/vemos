import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import moment from "moment";
import { Avatar } from "../../components/Avatar/Avatar";
import AvatarPost from "../../assets/img/default.png";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { Person } from "../../components/Person/Person";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import { GetJwt } from "../../helpers/index";
import { ColorRing } from "react-loader-spinner";

const Persons = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState([]);
  const [count, seCount] = useState(0);

  useState(() => {
    dispatch(actions.me());
  }, [dispatch]);
  const rows = useSelector((state) => state.me);

  useState(() => {
    fetchPersons();
  }, [rows]);

  async function fetchPersons() {
    setLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/get_persons",
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    await axios(options)
      .then((response) => {
        setLoading(false);
        console.log(response);
        setPersons(response.data.users);
        seCount(response.data.count);
      })
      .catch((err) => {
        setLoading(false);
        // dispatch(personsAction());
      });
  }

  // Delete Comment
  function deletePerson(index, status) {
    if (status) {
      persons.splice(index, 1);
      setPersons((persons) => [...persons]);
    }
  }

  return (
    <>
      <div className={classes.personsContainer}>
        {loading ? (
          <div className={classes.spinnerPosts}>
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#0d6efd", "#0d6efd", "#0d6efd", "#0d6efd", "#0d6efd"]}
            />
          </div>
        ) : count > 0 ? (
          persons.map((row, index) => (
            <Person
              deletePerson={deletePerson}
              index={index}
              key={row.id}
              id={row.id}
              userId={rows.id}
              name={row.name}
              email={row.email}
              avatar={row.avatar}
            />
          ))
        ) : (
          "Member not available yet"
        )}
      </div>
    </>
  );
};

export { Persons };
