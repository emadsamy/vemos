import React, { useEffect, useState } from "react";
import { Route, Switch, NavLink } from "react-router-dom";
import axios from "axios";
import classes from "./Person.module.css";
import { Plus } from "react-feather";
import AvatarPost from "../../assets/img/default.png";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const Person = ({ id, userId, index, name, email, avatar, deletePerson, className }) => {
  const [loading, setLoading] = useState(false);
  const followUser = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/follow",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        sender_id: userId,
        receiver_id: id,
      },
    };
    axios(options)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          deletePerson(index, res.data.success);
          toast.success(`You followed ${name}`);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <div className={`${className} ${classes.personRow}`}>
        <img className={`img-fluid ${classes.personimg}`} src={avatar ? avatar : AvatarPost} alt="username" />
        <div className={classes.personDetails}>
          <div className={`${classes.personName} text-capitalize`}>{name}</div>
          <div className={classes.personFollowers}></div>
          <button onClick={followUser} disabled={loading} className={classes.followBtn}>
            {loading ? "" : <Plus className={classes.followIcon} size={20} />} {loading ? "Loading..." : "Follow"}
          </button>
        </div>
      </div>
    </>
  );
};

export { Person };

Person.propTypes = {
  id: PropTypes.number,
  userId: PropTypes.number,
  index: PropTypes.number,
  name: PropTypes.string,
  email: PropTypes.string,
  avatar: PropTypes.string,
  deletePerson: PropTypes.func,
  className: PropTypes.string,
};
