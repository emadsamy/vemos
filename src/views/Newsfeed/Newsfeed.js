import React, { useEffect, useState, useRef, Suspense } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import { NavbarComponent } from "../../components/Navbar/Navbar";
import { GetJwt } from "../../helpers/index";
import { Avatar } from "../../components/Avatar/Avatar";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import * as actions from "../../store/index";
import Alert from "react-bootstrap/Alert";
import AvatarPost from "../../assets/img/default.png";
import moment from "moment";
import { Comment } from "./Comment";
import { AddComment } from "./AddComment";
import { PostCard } from "./PostCard";
import { Persons } from "./Persons";
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import TextareaAutosize from "react-textarea-autosize";
import { Helmet } from "react-helmet";

const Newsfeed = (props) => {
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState("");
  const inputFileRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  const [allMedia, setAllMedia] = useState({
    image: "",
    video: "",
    audio: "",
    type: "",
  });

  const dispatch = useDispatch();
  useState(() => {
    if (GetJwt()) {
      dispatch(actions.me());
    }
  }, [dispatch]);
  const rows = useSelector((state) => state.me);

  const postMediaHandler = (event) => {
    event.preventDefault();
    setMedia(event.target.files[0]);
    setAllMedia("");
    if (event.target.files[0].type.startsWith("image")) {
      setAllMedia({
        image: URL.createObjectURL(event.target.files[0]),
        type: "image",
      });
    }

    if (event.target.files[0].type.startsWith("video")) {
      setAllMedia({
        video: URL.createObjectURL(event.target.files[0]),
        type: "video",
      });
      if (videoRef) {
        videoRef.current.load();
      }
    }

    if (event.target.files[0].type.startsWith("audio")) {
      setAllMedia({
        audio: URL.createObjectURL(event.target.files[0]),
        type: "audio",
      });
      if (audioRef) {
        audioRef.current.load();
      }
    }
  };

  const addPostHandler = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", media);

    const token = localStorage.getItem("token");

    if ((desc == "" && media != "") || (media == "" && desc != "") || (media != "" && desc != "")) {
      const options = {
        url: window.baseURL + "/add_post",
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
          Accept: "application/json",
        },
        data: {
          desc: desc,
          user_id: rows.id,
          media: media,
        },
      };

      axios(options)
        .then((response) => {
          setLoading(false);
          setDesc("");
          setMedia("");
          inputFileRef.current.value = null;
          setAllMedia("");
          if (response.data.success) {
            toast.success(response.data.message);
            setPosts((posts) => [{ ...response.data.posts }, ...posts]);
          }
        })
        .catch((error) => {
          setLoading(false);
          inputFileRef.current.value = null;
        });
    } else {
      alert("write your post");
      setLoading(false);
    }
  };

  useState(() => {
    getPosts();
  }, []);

  function getPosts() {
    setPostsLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: window.baseURL + "/posts",
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    axios(options)
      .then((response) => {
        setPostsLoading(false);
        setPosts(response.data.posts);
        setComments(response.data.comments);
      })
      .catch((error) => {
        setPostsLoading(false);
      });
  }

  let redirect = "";
  if (!GetJwt()) {
    redirect = <Navigate to="/login" />;
  }

  // Add Comment
  function addCommentsHandle(data, status) {
    if (status) {
      setComments((comments) => [{ ...data }, ...comments]);
    }
  }

  // Edit Comment
  function editComment(index, data, status) {
    if (status) {
      if (comments[index]) {
        let newArr = [...comments];
        newArr[index].comment = data.comment;
        setComments(newArr);
      }
    }
  }

  // Delete Comment
  function deleteComment(index, status) {
    if (status) {
      comments.splice(index, 1);
      setComments((comments) => [...comments]);
    }
  }

  // Delete Post
  function deletePost(index, status) {
    if (status) {
      posts.splice(index, 1);
      setPosts((posts) => [...posts]);
    }
  }

  // Edit Post
  function editPost(index, data, status) {
    if (status) {
      if (posts[index]) {
        let newArr = [...posts];
        newArr[index].desc = data.desc;
        setPosts(newArr);
      }
    }
  }

  // Delete Post
  function filterPostsUnfollow(id, status) {
    if (status) {
      const newArr = posts.filter((row) => row.user_id !== id);
      setPosts(newArr);
    }
  }

  return (
    <>
      <Helmet>
        <title>Newsfeed</title>
      </Helmet>
      {redirect}
      <NavbarComponent />
      <div className={classes.newsfeed}>
        <div className={`container`}>
          <div className={classes.newsfeedFlex}>
            <div className={classes.postCol}>
              <div className={classes.postTitle}>Add New Post</div>
              <div className={classes.postContainer}>
                <div className={classes.flexable}>
                  <div className={classes.avatar}>
                    <Avatar className={classes.avatar} />
                  </div>
                  <div className={classes.post}>
                    <div className={classes.createPost}>
                      <TextareaAutosize
                        minRows={4}
                        maxRows={9}
                        className={classes.rcInput}
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder={`What's on your mind ?`}
                      />
                    </div>
                    <div className={classes.media}>
                      {allMedia.image ? <img src={allMedia.image} className={`img-fluid`} /> : ""}
                      {allMedia.video ? (
                        <video ref={videoRef} controls>
                          <source src={allMedia.video} type="video/mp4"></source>
                        </video>
                      ) : (
                        ""
                      )}
                      {allMedia.audio ? (
                        <audio ref={audioRef} controls>
                          <source src={allMedia.audio} type="audio/mpeg" />
                        </audio>
                      ) : (
                        ""
                      )}
                      <div className={classes.uploadFile}>
                        <input ref={inputFileRef} onChange={postMediaHandler} type="file" />
                        <div className={classes.ufTitle}>Drag your file here</div>
                        <span className={classes.ufTypes}>Image - Video - Audio</span>
                      </div>
                    </div>
                    <div className={classes.postAction}>
                      <Button disabled={loading} onClick={addPostHandler} variant="primary" type="button">
                        {loading ? "Loading..." : "Add Post"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {postsLoading ? (
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
              ) : (
                <div className={classes.postsRows}>
                  {posts.map((row, index) => {
                    return (
                      <div key={row.id} className={classes.postRow}>
                        <PostCard
                          id={row.id}
                          index={index}
                          userId={row.post_user.id}
                          avatar={row.post_user.avatar}
                          name={row.post_user.name}
                          email={row.post_user.email}
                          createdAt={row.post_user.created_at}
                          desc={row.desc}
                          type={row.type}
                          video={row.video}
                          audio={row.audio}
                          image={row.image}
                          deletePost={deletePost}
                          editPost={editPost}
                          filterPostsUnfollow={filterPostsUnfollow}
                          // likesCount={row.like_counter ? row.like_counter.count : 0}
                          // likes={row.likes ? row.likes : null}
                          // likes={row.likes && row.likes.map((like) => (parseInt(like.user_id) == rows.id ? true : false))}
                        />
                        <div className={classes.comments}>
                          <div className={classes.writeComment}>
                            <div className={classes.rcAvatar}>
                              <Avatar className={classes.avatar} />
                            </div>
                            <AddComment
                              addCommentsHandle={addCommentsHandle}
                              userId={rows.id}
                              postId={row.id}
                              postIndex={index}
                            />
                          </div>

                          {/* Fetch Comments */}
                          {comments
                            ? comments.map((comment, comment_Index) => {
                                return row.id === parseInt(comment.post_id) ? (
                                  <Comment
                                    key={comment.id}
                                    id={comment.id}
                                    index={comment_Index}
                                    userId={comment.user.id}
                                    comment={comment.comment}
                                    avatar={comment.user.avatar ? comment.user.avatar : AvatarPost}
                                    name={comment.user.name ? comment.user.name : ""}
                                    email={comment.user.email ? comment.user.email : ""}
                                    createdAt={comment.created_at ? comment.created_at : ""}
                                    deleteComment={deleteComment}
                                    editComment={editComment}
                                  />
                                ) : (
                                  ""
                                );
                              })
                            : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={classes.followCol}>
              <div className={classes.postTitle}>People you may know</div>
              <Persons />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Newsfeed };
