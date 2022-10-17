import React, {useEffect, useState, useRef} from 'react';
import {Route, Switch, NavLink, Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import classes from './Newsfeed.module.css';
import { NavbarComponent } from '../../components/Navbar/Navbar';
import { GetJwt } from "../../helpers/index";
import { Avatar } from '../../components/Avatar/Avatar';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as actions from "../../store/index";
import Alert from 'react-bootstrap/Alert';


const Newsfeed = (props) => {
    const [loading, setLoading] = useState(false);
    const [desc, setDesc] = useState("");
    const [userId, seUserId] = useState("");
    const [media, setMedia] = useState("");
    const [success, setSuccess] = useState("");
    const inputFileRef = useRef(null);
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    const [allMedia, setAllMedia] = useState({
        image: '',
        video: '',
        audio: '',
        type: ''
    });

    const dispatch = useDispatch();
    useState(() => {
        if (GetJwt()) {
            dispatch(actions.me());
        }
    }, [dispatch]);
    const [userData, setUserData] = useState("");
    const rows = useSelector((state) => state.me);

    const postMediaHandler = (event) => {
        event.preventDefault();
        setMedia(event.target.files[0]);
        setAllMedia("");
        if (event.target.files[0].type.startsWith("image")) {
            setAllMedia({
                image: URL.createObjectURL(event.target.files[0]),
                type: 'image'
            });
        }

        if (event.target.files[0].type.startsWith("video")) {
            setAllMedia({
                video: URL.createObjectURL(event.target.files[0]),
                type: 'video'
            });
            if (videoRef) {
                videoRef.current.load()
            }
        }

        if (event.target.files[0].type.startsWith("audio")) {
            setAllMedia({
                audio: URL.createObjectURL(event.target.files[0]),
                type: 'audio'
            });
            if (audioRef) {
                audioRef.current.load()
            }
        }
        console.log(media.type);
    }

    const addPostHandler = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", media);

        if (desc == '' && media != '' || media == '' && desc != '' || media != '' && desc != '') {
            const options = {
                url: window.baseURL + "/add_post",
                method: "POST",
                headers: { "Content-Type": "multipart/form-data" },
                data: {
                    desc: desc,
                    user_id: rows.id,
                    media: media
                },
            };
        
            axios(options)
            .then((response) => {
              console.log(response.data);
              console.log(media);
              setLoading(false);
              setDesc("");
              setMedia("");
              setSuccess(response.data);
              inputFileRef.current.value = null;
              setAllMedia("");
                console.log(allMedia);
            })
            .catch((error) => {
              console.log(error);
              setLoading(false);
              inputFileRef.current.value = null;
              
            });
        } else {
            alert('write your post');
            setLoading(false);
        }
    }

    let redirect = '';
    if (!GetJwt()) {
        redirect = <Navigate to="/login" />
    }
    return (
        <>
            {redirect}
            <NavbarComponent />
            <div className={classes.newsfeed}>
                <div className={`container`}>
                    {success.success ? <Alert variant={'success'}>{success.message}</Alert> : ''}
                    <div className={classes.postTitle}>Add New Post</div>
                    <div className={classes.postContainer}>
                        <div className={classes.flexable}>
                            <div className={classes.avatar}>
                                <Avatar className={classes.avatar} />
                            </div>
                            <div className={classes.post}>
                                <div className={classes.createPost}>
                                    <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={`Write a post here ....`}></textarea>
                                </div>
                                <div className={classes.media}>
                                    {allMedia.image ? <img src={allMedia.image} className={`img-fluid`} /> : ''}
                                    {
                                        allMedia.video ? 
                                           <video ref={videoRef} controls>
                                                <source src={allMedia.video} type="video/mp4"></source>
                                           </video> 
                                        : ''
                                    }
                                    {
                                        allMedia.audio ? 
                                            <audio ref={audioRef} controls>
                                                <source src={allMedia.audio} type="audio/mpeg" />
                                            </audio> : ''
                                    }
                                    <input ref={inputFileRef} onChange={postMediaHandler} type="file" />
                                </div>
                                <div className={classes.postAction}>
                                    <Button disabled={loading} onClick={addPostHandler} variant="primary" type="button">
                                        {loading ? 'Loading...' : 'Post'} 
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export { Newsfeed };