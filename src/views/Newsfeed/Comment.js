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
import PropTypes from "prop-types";
import { MoreHorizontal } from "react-feather";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import { GetJwt } from "../../helpers/index";

const Comment = ({ id, index, userId, comment, name, email, avatar, createdAt, deleteComment, editComment }) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [toggleInputEdit, setToggleInputEdit] = useState(false);
  const [commentValue, setCommentValue] = useState(comment);

  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);
  const rows = useSelector((state) => state.me);

  // Delete Comment
  function deleteCommentHandle() {
    setLoadingDelete(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/delete_comment/" + id,
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {},
    };
    axios(options)
      .then((response) => {
        setLoadingDelete(false);
        deleteComment(index, response.data.success);
        if (response.data.success) {
          toast.success(response.data.message);
        }
      })
      .catch((error) => {
        setLoadingDelete(false);
      });
  }

  // Edit Comment
  function editCommentHandle() {
    setLoadingEdit(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/edit_comment/" + id,
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        comment: commentValue,
        id: id,
      },
    };
    axios(options)
      .then((response) => {
        setLoadingEdit(false);
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
            {name} - <span className={classes.commentDate}>{moment(createdAt).calendar()}</span>
          </div>
          <div className={classes.commentToRead}>
            {toggleInputEdit ? (
              <div className={classes.editComment}>
                <textarea
                  onChange={(e) => setCommentValue(e.target.value)}
                  value={commentValue}
                  placeholder="Write a Comment..."
                />
                <div className={`${classes.postAction} text-end text-right mt-2`}>
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
        {rows.id === userId ? (
          <div className={classes.userControl}>
            <Dropdown>
              <Dropdown.Toggle disabled={loadingEdit || loadingDelete} variant="Secondary" id="dropdown-basic">
                <MoreHorizontal size={22} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setToggleInputEdit(true)}>Edit</Dropdown.Item>
                <Dropdown.Item onClick={deleteCommentHandle}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export { Comment };

Comment.propTypes = {
  id: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  deleteComment: PropTypes.func,
  editComment: PropTypes.func,
};
