import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import moment from "moment";
import { Avatar } from "../../components/Avatar/Avatar";
// import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";

const Comment = ({ id, index, comment, name, email, avatar, date, deleteComment }) => {
  const [loading, setLoading] = useState(false);
  function deleteCommentHandle() {
    setLoading(true);
    const options = {
      url: window.baseURL + "/delete_comment/" + id,
      method: "DELETE",
      data: {},
    };
    axios(options)
      .then((response) => {
        setLoading(false);
        console.log(response.data.data);
        deleteComment(index, response.data.success);
        if (response.data.success) {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  return (
    <div className={classes.fetchComments}>
      <div className={classes.commentRow}>
        <div className={classes.crAvatar}>
          <img className={`${classes.crImg} img-fluid`} src={avatar} alt={comment} />
        </div>
        <div className={classes.crText}>
          <div className={classes.commenterName}>
            {name} <span>({email})</span>
          </div>
          <div className={classes.commentToRead}>{comment}</div>
        </div>
        <div className={classes.userControl}>
          <Dropdown>
            <Dropdown.Toggle variant="Secondary" id="dropdown-basic">
              ...
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item onClick={deleteCommentHandle}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export { Comment };
