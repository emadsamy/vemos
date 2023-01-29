import React, { useEffect, useState, useRef, Suspense } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Persons.module.css";
import { NavbarComponent } from "../../components/Navbar/Navbar";
import { GetJwt } from "../../helpers/index";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Alert from "react-bootstrap/Alert";
import AvatarPost from "../../assets/img/default.png";
import moment from "moment";
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Person } from "../../components/Person/Person";
import { Helmet } from "react-helmet";

const Persons = (props) => {
  const [loading, setLoading] = useState(false);
  const [persons, setPersons] = useState([]);
  const nodeRef = useRef(null);

  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);
  const rows = useSelector((state) => state.me);

  useState(() => {
    getPersons();
  }, []);

  function getPersons() {
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
    axios(options)
      .then((response) => {
        setLoading(false);
        setPersons(response.data.users);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  let redirect = "";
  if (!GetJwt()) {
    redirect = <Navigate to="/login" />;
  }

  // Delete Person
  function deletePerson(index, status) {
    if (status) {
      persons.splice(index, 1);
      setPersons((persons) => [...persons]);
    }
  }

  return (
    <>
      <Helmet>
        <title>Persons</title>
      </Helmet>
      {redirect}
      <NavbarComponent />
      <div className={classes.personsContainer}>
        <div className="container">
          <h2 className={`mb-4`}>People you may know</h2>
          {loading ? (
            <div className={classes.personsLoading}>
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
          ) : persons.length > 0 ? (
            <div className={classes.personsGrid}>
              {persons.map((row, index) => (
                <Person
                  deletePerson={deletePerson}
                  index={index}
                  // key={row.id}
                  id={row.id}
                  userId={rows.id}
                  name={row.name}
                  email={row.email}
                  avatar={row.avatar}
                  className={classes.personRow}
                />
              ))}
            </div>
          ) : (
            "Member not available yet"
          )}
        </div>
      </div>
    </>
  );
};

export { Persons };
