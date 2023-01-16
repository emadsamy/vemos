import React, { useEffect, useState, useRef, Suspense } from "react";
import { Route, Switch, NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import classes from "./Newsfeed.module.css";
import { NavbarComponent } from "../../components/Navbar/Navbar";
import { GetJwt, Test } from "../../helpers/index";
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
import toast from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";

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
    console.log(media.type);
  };

  const addPostHandler = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", media);

    if ((desc == "" && media != "") || (media == "" && desc != "") || (media != "" && desc != "")) {
      const options = {
        url: process.env.BASE_API_URL + "/add_post",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
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
          console.log(error);
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
    // window.addEventListener("blur", () => {
    //   document.title = "Come Back Bro :(";
    // });
    // window.addEventListener("focus", () => {
    //   document.title = "Welcome :)";
    // });

    // document.body.addEventListener("mousemove", (e) => {
    //   const tracker = document.getElementById("tracker");
    //   tracker.style.left = `${e.clientX - 35}px`;
    //   tracker.style.top = `${e.clientY - 35}px`;
    // });
    console.log(process.env.REACT_APP_TITLE);
  }, []);

  function getPosts() {
    setPostsLoading(true);
    const token = localStorage.getItem("token");
    const options = {
      url: process.env.BASE_API_URL + "/posts",
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    };
    axios(options)
      .then((response) => {
        setPostsLoading(false);
        console.log(response.data);
        setPosts(response.data.posts);
        setComments(response.data.comments);
      })
      .catch((error) => {
        setPostsLoading(false);
        console.log(error);
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

  useEffect(() => {
    console.log(Test(10000));
  }, [Test()]);

  return (
    <>
      {/* <div id={"tracker"} className={classes.tracker}></div> */}
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
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder={`Write a post here ....`}
                      ></textarea>
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
                      <input ref={inputFileRef} onChange={postMediaHandler} type="file" />
                    </div>
                    <div className={classes.postAction}>
                      <Button disabled={loading} onClick={addPostHandler} variant="primary" type="button">
                        {loading ? "Loading..." : "Post"}
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
                      <div key={index} className={classes.postRow}>
                        <PostCard
                          id={row.id}
                          index={index}
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
                                return row.id === comment.post_id ? (
                                  <Comment
                                    id={comment.id}
                                    index={comment_Index}
                                    comment={comment.comment}
                                    avatar={comment.user.avatar ? comment.user.avatar : AvatarPost}
                                    name={comment.user.name ? comment.user.name : ""}
                                    email={comment.user.email ? comment.user.email : ""}
                                    date={comment.created_at ? comment.created_at : ""}
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
              <div className={classes.postTitle}>Follow Unfollow System</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { Newsfeed };
