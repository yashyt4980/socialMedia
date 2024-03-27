// eslint-disable-next-line
import React, { useEffect, useState, useContext } from "react";
import PostDetail from "./PostDetail";
import "./Profile.css";
import ProfilePic from "./ProfilePic";
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line
import { LoginContext } from "../context/LoginContext";
import axios from 'axios';
export default function Profie() {
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false)
  const [changePic, setChangePic] = useState(false);
  const [ selectedPost, setSelectedPost ] = useState();
  
  const navigate = useNavigate();
  
  const userData = localStorage.getItem("userData");
  if (!userData) {
    navigate('/');
  }

  const [ picLink, setPicLink ] = useState(JSON.parse(localStorage.getItem('userData')).data.data.Photo);
  function setPic(url) {
    setPicLink(url);
  }
  const toggleDetails = (post) => {
    if (show) {
      setShow(false);
      setSelectedPost(null);
    } else {
      setSelectedPost(post);
      setShow(true);
    }
  };
  useEffect(() => {
    async function fetchPosts() {
      const data = await axios.get(`https://socialmedia-wvkr.onrender.com/api/user/profile`,{
        headers: {
          authorization: 'Bearer ' + JSON.parse(localStorage.getItem('userData')).data.token,
        }
      });
      setPosts(data.data.data);
    }
    fetchPosts();
  }, [])
  const changeprofile = () => {
    if (changePic) {
      setChangePic(false)
      // window.location.reload();
    } else {
      setChangePic(true)
    }
  }
    return (
      <div className="profile">
        {/* Profile frame */}
        <div className="profile-frame">
          {/* profile-pic */}
          <div className="profile-pic">
            <img
              onClick={changeprofile}
              src={picLink}
              alt=""
            />
          </div>
          <div className="pofile-data">
            <h1>
            {JSON.parse(localStorage.getItem("userData")).data.data.name}
            </h1>
            <div className="profile-info" style={{ display: "flex" }}>
              <p>{posts ? posts.length : "0"} posts</p>
              <p>{JSON.parse(localStorage.getItem("userData")).data.data.followers.length} followers</p>
              <p>{JSON.parse(localStorage.getItem("userData")).data.data.following.length} following</p>
            </div>
          </div>
        </div>
        <hr
          style={{
            width: "90%",
            opacity: "0.8",
            margin: "25px auto",
          }}
        />
        Gallery
        <div className="gallery">
          {posts.map((post) => {
            return <img key={post._id} src={post.photo}
              onClick={() => {
                toggleDetails(post)
              }}
              alt = ""
              className="item"></img>;    
          })}
        </div>
        {show &&
          <PostDetail item={selectedPost} toggleDetails={toggleDetails} />
        }
        {
          changePic &&
          <ProfilePic changeprofile={changeprofile} setPic = {setPic} />
        }
      </div>
    );
  }