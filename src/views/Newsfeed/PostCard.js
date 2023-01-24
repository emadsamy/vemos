import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import moment from "moment";
import { Avatar } from "../../components/Avatar/Avatar";
import AvatarPost from "../../assets/img/default.png";
import LikeImg from "../../assets/img/like.svg";
import More from "../../assets/img/more.svg";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { LazyLoadImage, trackWindowScroll } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import PropTypes from "prop-types";
import { MoreHorizontal, ThumbsUp, MessageCircle, Share } from "react-feather";

const PostCard = ({
  id,
  index,
  userId,
  avatar,
  name,
  email,
  createdAt,
  desc,
  type,
  video,
  audio,
  image,
  deletePost,
  editPost,
  scrollPosition,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [toggleInputEdit, setToggleInputEdit] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(desc);
  const [likesCounter, setLikesCounter] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Delete Comment
  function deletePostHandle() {
    setLoadingDelete(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/delete_post/" + id,
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
        console.log(response);
        console.log(index);
        if (response.data.success) {
          toast.success(response.data.message);
          deletePost(index, response.data.success);
        }
      })
      .catch((error) => {
        setLoadingDelete(false);
      });
  }

  // Edit Comment
  function editPostHandle() {
    setLoadingEdit(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/edit_post/" + id,
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        desc: descriptionValue,
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
          editPost(index, response.data.data, response.data.success);
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

  // Get Likes
  async function getLikes() {
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/get_likes/" + id,
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        user_id: userId,
        post_id: id,
      },
    };
    await axios(options)
      .then((response) => {
        // if (response.data.is_liked > 0) {
        //   setIsLiked(true);
        // } else {
        //   setIsLiked(false);
        // }
        console.log(response);
        setLikesCounter(response.data.count);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Add Like
  function toggleLike() {
    if (isLiked) {
      setLikesCounter(likesCounter - 1);
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setLikesCounter(likesCounter + 1);
    }
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/toggle_like",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        user_id: userId,
        post_id: id,
      },
    };
    axios(options)
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  }

  const setInputEditHandler = () => {
    setToggleInputEdit(true);
    setDescriptionValue(desc);
  };

  const cancelInputEditHandler = () => {
    setToggleInputEdit(false);
    setDescriptionValue(desc);
  };

  useEffect(() => {
    getLikes();
  }, [id]);

  return (
    <>
      <div className={classes.postTop}>
        <div className={classes.postUser}>
          <img src={avatar ? avatar : AvatarPost} className={classes.userImg} alt={"User Name"} />
          <div className={classes.nameDate}>
            <div className={classes.postName}>{name}</div>
            <div className={classes.postDate}>{moment(createdAt).calendar()}</div>
          </div>
        </div>
      </div>
      <div className={classes.postCenter}>
        {toggleInputEdit ? (
          <>
            <TextareaAutosize
              minRows={2}
              maxRows={6}
              placeholder="Edit a Post..."
              className={classes.editPost}
              onChange={(e) => setDescriptionValue(e.target.value)}
              value={descriptionValue}
              disabled={loadingEdit}
              //   onKeyDown={onEnterKey}
            />
            <div className={`${classes.postAction} text-end text-right mt-2`}>
              <Button disabled={loadingEdit} onClick={cancelInputEditHandler} variant="secondary">
                {loadingEdit ? "Loading..." : "Cancel"}
              </Button>
              <Button disabled={loadingEdit} onClick={editPostHandle} className="ml-3 d-inline-block" variant="primary">
                {loadingEdit ? "Loading..." : "Edit"}
              </Button>
            </div>
          </>
        ) : desc ? (
          <div className={classes.postDesc}>{desc}</div>
        ) : (
          ""
        )}
      </div>
      <div className={classes.postBottom}>
        <div className={classes.media}>
          {type == "video" ? (
            <div className={`${classes.postVideo} ${classes.postMedia}`}>
              <video controls>
                <source src={`${video}#t=0.4`} type="video/mp4"></source>
              </video>
            </div>
          ) : (
            ""
          )}

          {type == "audio" ? (
            <div className={`${classes.postAudio} ${classes.postMedia}`}>
              <audio controls>
                <source src={audio} type="audio/mpeg" />
              </audio>
            </div>
          ) : (
            ""
          )}

          {type == "image" ? (
            <div className={`${classes.postImg} ${classes.postMedia}`}>
              <LazyLoadImage
                effect="blur"
                scrollPosition={scrollPosition}
                src={image}
                className={classes.userPostImg}
                alt={"User Name"}
              />
              {/* <img src={image} className={classes.userPostImg} alt={"User Name"} /> */}
            </div>
          ) : (
            ""
          )}
        </div>

        <div className={classes.eventsCounter}>
          <div className={classes.likeCounter}>
            <img className={`img-fluid ${classes.likeCountIcon}`} src={LikeImg} alt="like" /> {likesCounter}
          </div>
        </div>

        <div className={classes.postEvents}>
          <button className={isLiked ? classes.liked : ""} onClick={toggleLike}>
            <ThumbsUp size={21} className={classes.eventIcon} /> {isLiked ? "Liked" : "Like"}
          </button>
          <button disabled={true}>
            <MessageCircle size={21} className={classes.eventIcon} /> Comment
          </button>
          <button disabled={true}>
            <Share size={21} className={classes.eventIcon} /> Share
          </button>
        </div>
      </div>

      <div className={classes.postControl}>
        <Dropdown>
          <Dropdown.Toggle disabled={loadingEdit || loadingDelete} variant="Secondary">
            <MoreHorizontal size={22} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={setInputEditHandler}>Edit</Dropdown.Item>
            <Dropdown.Item onClick={deletePostHandle}>Delete</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export { PostCard };

PostCard.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  userId: PropTypes.number,
  avatar: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  createdAt: PropTypes.string,
  desc: PropTypes.string,
  type: PropTypes.string,
  video: PropTypes.string,
  audio: PropTypes.string,
  image: PropTypes.string,
  deletePost: PropTypes.func,
  editPost: PropTypes.func,
  scrollPosition: PropTypes.string,
};
