import React, { useEffect, useState } from "react";
// eslint-disable-next-line
import PostDetail from "./PostDetail";
import "./Profile.css";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";
export default function UserProfile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  // This is to check if the logged in user has already followed the current profile user.
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    const { following } = userData.data.data;
    if(following.includes(userid)) setIsFollow(true);
    // eslint-disable-next-line
  }, [])

  // to follow user
  const followUser = (userId) => {
    try {
      const data = axios.put('http://localhost:5000/api/user/followUser', {_id:userId}, {
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).data.token}`
        }
      });
      if(data) {
        notifyB("Followed User Successfully");
        const localSto = JSON.parse(localStorage.getItem("userData"));
        localSto.data.data.following.push(userId);
        localStorage.setItem("userData", JSON.stringify(localSto));
        setIsFollow(true);
        // window.location.reload();
        fetch();
      } else {
        notifyA("Can't follow this user");
        setIsFollow(false);
      }
    } catch(error) {
      setIsFollow(false);
      notifyA(error.message);
    }
  };

  // to unfollow user
  const unfollowUser = (userId) => {
    try {
      const data = axios.put('http://localhost:5000/api/user/unfollowUser', {_id:userId}, {
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).data.token}`
        }
      });
      if(data) {
        notifyB("Unfollowed User Successfully");
        setIsFollow(false);
        const localSto = JSON.parse(localStorage.getItem("userData"));
        
        const index = localSto.data.data.following.indexOf(userId);
        if (index > -1) { // only splice array when item is found
          localSto.data.data.following.splice(index, 1); // 2nd parameter means remove one item only
        }
        localStorage.setItem("userData", JSON.stringify(localSto));
        // window.location.reload();
        fetch();
      } else {
        notifyA("Can't follow this user");
        setIsFollow(true);
      }
    } catch(error) {
      setIsFollow(true);
      notifyA(error.message);
    }
  };

  // useEffect(() => {
  //   console.log(userid);
  //   fetch(`/api/user/profile/${userid}`, {
  //     headers: {
  //       Authorization: "Bearer " + JSON.parse(localStorage.getItem("userData")).data.token,
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       console.log(result);
  //       setUser(result.user);
  //       setPosts(result.post);
  //       if (
  //         result.user.followers.includes(
  //           JSON.parse(localStorage.getItem("user"))._id
  //         )
  //       ) {
  //         setIsFollow(true);
  //       }
  //     });
  // }, [userid]);

  async function fetch() {
    try {
      const data = await axios.get(`http://localhost:5000/api/user/profile/${userid}`, {
        headers: {
          authorization: "Bearer " + JSON.parse(localStorage.getItem("userData")).data.token,
        },
      });
      if(data) {
        // console.log(data);
        setUser(data.data.data.user);
        setPosts(data.data.data.posts);
      }
    } catch(error) {
      console.log(error.message);
    }
  }
  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [userid]);

  useEffect(() => {
    // console.log(user);
    if(user) {
      // console.log(user.followers);
      const { followers } = user;
      // console.log(followers);
      if (followers.includes(JSON.parse(localStorage.getItem("userData")).data.data._id)) setIsFollow(true);
    }
  }, [user])
  useEffect(() => {
    // console.log(posts);
  }, [posts])
  return (
    <div className="profile">
      {/* Profile frame */}
      <div className="profile-frame">
        {/* profile-pic */}
        <div className="profile-pic">
          <img src={user.Photo ? user.Photo : picLink} alt="" />
        </div>
        {/* profile-data */}
        <div className="pofile-data">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1>{user.name}</h1>
            <button
              className="followBtn"
              onClick={() => {
                if (isFollow) {
                  unfollowUser(user._id);
                } else {
                  followUser(user._id);
                }
              }}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>
          </div>
          <div className="profile-info" style={{ display: "flex" }}>
            <p>{posts.length} posts</p>
            <p>{user.followers ? user.followers.length : "0"} followers</p>
            <p>{user.following ? user.following.length : "0"} following</p>
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
      {/* Gallery */}
      <div className="gallery">
        {posts.map((pics) => {
          return (
            <img
              alt = ""
              key={pics._id}
              src={pics.photo}
              // onClick={() => {
              //     toggleDetails(pics)
              // }}
              className="item"
            ></img>
          );
        })}
      </div>
      {/* {show &&
        <PostDetail item={posts} toggleDetails={toggleDetails} />
      } */}
    </div>
  );
}
