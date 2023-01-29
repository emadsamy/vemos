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
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import { GetJwt } from "../../helpers/index";
import { RotatingLines } from "react-loader-spinner";
import Logo from "../../assets/img/logo.png";
import { UserCheck, Plus } from "react-feather";

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
  filterPostsUnfollow,
  likesCount,
  likes,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [toggleInputEdit, setToggleInputEdit] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState(desc);
  const [likesCounter, setLikesCounter] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [followLoading, setfollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState(true);

  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);

  const rows = useSelector((state) => state.me);

  // Delete Post
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

  const setInputEditHandler = () => {
    setToggleInputEdit(true);
    setDescriptionValue(desc);
  };

  const cancelInputEditHandler = () => {
    setToggleInputEdit(false);
    setDescriptionValue(desc);
  };

  const unfollowPerson = (sender_id, receiver_id) => {
    setfollowLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/unfollow",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      },
    };
    axios(options)
      .then((res) => {
        if (res.data.success) {
          // filterPostsUnfollow(res.data.data.id, res.data.success);
          toast.error(`You Unfollowed ${name}`);
          setFollowStatus(false);
          if (res.data.data.receiver_id) {
            setFollowStatus(false);
          }
        }
        setfollowLoading(false);
      })
      .catch((err) => {
        setfollowLoading(false);
      });
  };

  const followPerson = (sender_id, receiver_id) => {
    setfollowLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/follow",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      },
    };
    axios(options)
      .then((res) => {
        setfollowLoading(false);
        if (res.data.success) {
          toast.success(`You followed ${name}`);
          setFollowStatus(true);
        }
      })
      .catch((err) => {
        setfollowLoading(false);
      });
  };

  function checkAuthLiked() {
    // likes && likes.map((row) => (parseInt(row.user_id) === rows.id ? setIsLiked(true) : setIsLiked(false)));

    let result = false;
    if (likes) {
      if (likes.length > 0) {
        let check = likes.filter((row) => row.user_id == rows.id);
        if (check.length > 0) {
          result = true;
        }
        // console.log(result);
      } else {
        result = likes.user_id == rows.id;
        // console.log(result);
      }
      setIsLiked(result);
    }
  }

  useEffect(() => {
    checkAuthLiked();
  }, [likes]);

  useEffect(() => {
    // setLikesCounter((likesCounter) => likesCounter);
  }, [filterPostsUnfollow]);

  async function addLike() {
    setIsLiked(true);
    setLikesCounter(likesCount + 1);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/add_like",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        user_id: rows.id,
        post_id: id,
      },
    };
    await axios(options)
      .then((response) => {
        console.log(response.data);
        // if (response.data.success) {
        //   setLikesCounter(response.data.count);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function deleteLike() {
    setIsLiked(false);
    setLikesCounter(likesCount == 0 ? 0 : likesCount - 1);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/delete_like",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        user_id: rows.id,
        post_id: id,
      },
    };
    await axios(options)
      .then((response) => {
        console.log(response.data);
        // if (response.data.success) {
        //   setLikesCounter(response.data.count);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const checkPerson = (sender_id, receiver_id) => {
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/check_person",
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
      data: {
        sender_id: sender_id,
        receiver_id: receiver_id,
      },
    };
    axios(options)
      .then((res) => {
        if (res.data.success) {
          setFollowStatus(true);
        } else {
          setFollowStatus(false);
        }
      })
      .catch((err) => {});
  };

  return (
    <>
      <div className={classes.postTop}>
        <div className={classes.postUser}>
          <img src={avatar ? avatar : AvatarPost} className={classes.userImg} alt={"User Name"} />
          <div className={classes.nameDate}>
            <div className={classes.userCard}>
              <div onMouseEnter={() => checkPerson(rows.id, userId, index)} className={classes.postName}>
                {name}
                <div className={classes.userHoverd}>
                  <div className={classes.userHoverdCover}>
                    <img className={`img-fluid`} src={Logo} alt={name} />
                  </div>
                  <div className={classes.userHoverdDetails}>
                    <img className={`img-fluid`} src={avatar} alt={name} />
                    <div className={classes.nameEmail}>
                      <div className={`text-capitalize ${classes.hoverdName}`}>{name}</div>
                      <div className={classes.hoverdEmail}>{email}</div>
                    </div>
                  </div>
                  {rows.id !== userId ? (
                    <div className={classes.followStatusBtn}>
                      {followStatus ? (
                        <button onClick={() => unfollowPerson(rows.id, userId, index)} className={`btn ${classes.followingBtn}`}>
                          {followLoading ? (
                            <>
                              <RotatingLines
                                strokeColor="#fff"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="18"
                                visible={true}
                              />
                            </>
                          ) : (
                            <span>
                              <UserCheck className={classes.followIcon} width="18" /> Following
                            </span>
                          )}
                        </button>
                      ) : (
                        <button onClick={() => followPerson(rows.id, userId, index)} className={`btn ${classes.followBtn}`}>
                          {followLoading ? (
                            <>
                              <RotatingLines
                                strokeColor="#0d6efd"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="18"
                                visible={true}
                              />
                            </>
                          ) : (
                            <span>
                              <Plus className={classes.followIcon} width="18" /> Follow
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              {/* {rows.id !== userId ? (
                followStatus ? (
                  <button onClick={() => unfollowPerson(rows.id, userId, index)} className={`btn ${classes.followingBtn}`}>
                    {followLoading ? (
                      <>
                        <RotatingLines strokeColor="#fff" strokeWidth="5" animationDuration="0.75" width="18" visible={true} />
                      </>
                    ) : (
                      "Following"
                    )}
                  </button>
                ) : (
                  <button onClick={() => followPerson(rows.id, userId, index)} className={`btn ${classes.followBtn}`}>
                    {followLoading ? (
                      <>
                        <RotatingLines strokeColor="#0d6efd" strokeWidth="5" animationDuration="0.75" width="18" visible={true} />
                      </>
                    ) : (
                      "Follow"
                    )}
                  </button>
                )
              ) : (
                ""
              )} */}
            </div>
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
            <img className={`img-fluid ${classes.likeCountIcon}`} src={LikeImg} alt="like" /> {id ? likesCounter : null}
          </div>
        </div>

        <div className={classes.postEvents}>
          {isLiked ? (
            <button onClick={deleteLike} className={classes.liked}>
              <ThumbsUp size={21} className={classes.eventIcon} /> Liked
            </button>
          ) : (
            <button onClick={addLike}>
              <ThumbsUp size={21} className={classes.eventIcon} /> Like
            </button>
          )}
          <button>
            <MessageCircle size={21} className={classes.eventIcon} /> Comment
          </button>
          <button disabled={true}>
            <Share size={21} className={classes.eventIcon} /> Share
          </button>
        </div>
      </div>

      {rows.id === userId ? (
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
      ) : (
        ""
      )}
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
  likesCount: PropTypes.number,
  likes: PropTypes.array,
};
