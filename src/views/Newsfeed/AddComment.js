import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import moment from "moment";
import { Avatar } from "../../components/Avatar/Avatar";
import TextareaAutosize from "react-textarea-autosize";
import Button from "react-bootstrap/Button";
import toast from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";

const AddComment = ({ userId, postId, postIndex, addCommentsHandle }) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  function addComment() {
    setLoading(true);
    const options = {
      url: process.env.BASE_API_URL + "/add_comment",
      method: "POST",
      data: {
        post_id: postId,
        user_id: userId,
        comment: comment,
      },
    };
    axios(options)
      .then((response) => {
        setLoading(false);
        console.log(response.data.data);
        addCommentsHandle(response.data.data, response.data.success);
        if (response.data.success) {
          toast.success(response.data.message);
          setComment("");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }

  const onEnterKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <div className={classes.rcAction}>
      <TextareaAutosize
        minRows={1}
        maxRows={6}
        placeholder="Write a comment..."
        className={classes.rcInput}
        onChange={(e) => setComment(e.target.value)}
        value={comment}
        onKeyDown={onEnterKey}
        disabled={loading}
      />
      <div className={classes.rcActionBtn}>
        <Button className={classes.addCommentAction} disabled={loading} onClick={addComment} variant="primary" type="button">
          {loading ? (
            <RotatingLines strokeColor="#666" strokeWidth="5" animationDuration="0.75" width="20" visible={true} />
          ) : (
            "Comment"
          )}
        </Button>
      </div>
    </div>
  );
};

export { AddComment };
