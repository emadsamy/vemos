import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import moment from "moment";
import { Avatar } from "../../components/Avatar/Avatar";
import More from "../../assets/img/more.svg";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";

const Comment = ({ id, index, comment, name, email, avatar, date, deleteComment, editComment }) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [toggleInputEdit, setToggleInputEdit] = useState(false);
  const [commentValue, setCommentValue] = useState(comment);

  // Delete Comment
  function deleteCommentHandle() {
    setLoadingDelete(true);
    const options = {
      url: window.baseURL + "/delete_comment/" + id,
      method: "DELETE",
      data: {},
    };
    axios(options)
      .then((response) => {
        setLoadingDelete(false);
        console.log(response.data.data);
        deleteComment(index, response.data.success);
        if (response.data.success) {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        setLoadingDelete(false);
        console.log(error);
      });
  }

  // Edit Comment
  function editCommentHandle() {
    setLoadingEdit(true);
    const options = {
      url: window.baseURL + "/edit_comment/" + id,
      method: "PUT",
      data: {
        comment: commentValue,
        id: id,
      },
    };
    axios(options)
      .then((response) => {
        setLoadingEdit(false);
        console.log(response.data);
        if (response.data.success) {
          toast.success(response.data.message);
          setToggleInputEdit(false);
          editComment(index, response.data.data, response.data.success);
        }

        if (response.data.errors) {
          response.data.errors.map((row, index) => {
            return toast.error(row);
          });
        }
      })
      .catch((error) => {
        setLoadingEdit(false);
      });
  }

  const cancelInputEditHandler = () => {
    setToggleInputEdit(false);
    setCommentValue(comment);
  };

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
          <div className={classes.commentToRead}>
            {toggleInputEdit ? (
              <div className={classes.editComment}>
                <input onChange={(e) => setCommentValue(e.target.value)} value={commentValue} placeholder="Write a Comment..." />
                <div className="text-end text-right mt-2">
                  <Button disabled={loadingEdit} onClick={cancelInputEditHandler} variant="secondary">
                    {loadingEdit ? "Loading..." : "Cancel"}
                  </Button>
                  <Button disabled={loadingEdit} onClick={editCommentHandle} className="ml-3 d-inline-block" variant="primary">
                    {loadingEdit ? "Loading..." : "Edit"}
                  </Button>
                </div>
              </div>
            ) : (
              comment
            )}
          </div>
        </div>
        <div className={classes.userControl}>
          <Dropdown>
            <Dropdown.Toggle disabled={loadingEdit || loadingDelete} variant="Secondary" id="dropdown-basic">
              <img className={`img-fluid`} src={More} style={{ width: "27px" }} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setToggleInputEdit(true)}>Edit</Dropdown.Item>
              <Dropdown.Item onClick={deleteCommentHandle}>Delete</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export { Comment };
