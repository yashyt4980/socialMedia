import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from 'axios';
export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);
  
  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  async function fetchPosts() {
    const token = JSON.parse(localStorage.getItem("userData")).data.token;
    if (!token) {
      navigate("./signup");
    }
    try {
      let result = await axios.get("https://socialmedia-wvkr.onrender.com/api/post/allPosts", {
        headers: {
          Authorization:"Bearer " + token,
        }
      });
      if(result) {
        setData(result.data.data);
      } else {
        console.log("Cant fetch data right now");
      }
    } catch(error) {
      console.log(error.message);
    } 
  }
  useEffect(() => {
    // Fetching all posts
     fetchPosts();
     // eslint-disable-next-line
  },[]);
  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
    }
  };

  const likePost = async (id) => {
    const token = JSON.parse(localStorage.getItem("userData")).data.token;
    if (!token) {
      navigate("./signup");
    }
    if(!id) {
      notifyA("Chat id not provided");
    } else {
      try {
        const { data }  = await axios.put('https://socialmedia-wvkr.onrender.com/api/post/like', {_id: id},{
          headers: {
            authorization: "Bearer " + token,
          }
        });
        if(data) {
          // console.log(data.data.likes);  
          await fetchPosts();

        }
      } catch(error) {
        console.log(error.message);
      }
    }
  };
  
  const unlikePost = async (id) => {
    const token = JSON.parse(localStorage.getItem("userData")).data.token;
    if (!token) {
      navigate("./signup");
    }
    if(!id) {
      notifyA("Chat id not provided");
    } else {
      try {
        const { data }  = await axios.put('https://socialmedia-wvkr.onrender.com/api/post/unlike', {_id: id},{
          headers: {
            authorization: "Bearer " + token,
          }
        });
        if(data) {
          // console.log(data.data.likes);  
          await fetchPosts();

        }
      } catch(error) {
        console.log(error.message);
      }
    }
  };

  const makeComment = async (comment, postID) => {
    const token = JSON.parse(localStorage.getItem("userData")).data.token;
    if (!token) {
      navigate("./signup");
    }
    if(!comment || !postID) {
      notifyA("Incomplete data!");
    } else {
      try {
        const { data } = await axios.put('https://socialmedia-wvkr.onrender.com/api/post/comment', {comment, postID}, {
          headers:{
            authorization: 'Bearer ' + token,
          }
        })
        if(data) {
          console.log(data);
          await fetchPosts();
          notifyB("Comment Posted Successfully! ");

        } else {
          console.log("There is some problem");
          notifyA("Cant post your comment right now, please try after some time");
        }
      } catch(error) {
        console.log(error.message);
        notifyA("Error!");
      }
    }
  } 

  useEffect(() => {
    console.log(item);
  }, [item]);
  return (
    <div className="home">
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card">
            {/* card header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  src={posts.postedBy.Photo ? posts.postedBy.Photo : picLink}
                  alt=""
                />
              </div>
              <h5>
                {posts.postedBy._id === JSON.parse(localStorage.getItem("userData")).data.data._id ? <Link to={`/profile`}>
                  {posts.postedBy.name}
                </Link>: <Link to={`/profile/${posts.postedBy._id}`}>
                  {posts.postedBy.name}
                </Link>}
              </h5>
            </div>
            {/* card image */}
            <div className="card-image">
              <img src={posts.photo === "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" ? " " : posts.photo} alt="" />
            </div>

            {/* card content */}
            <div className="card-content">
              {/* {console.log(posts.likes, JSON.parse(localStorage.getItem("userData")))} */}
              {
              posts.likes.includes(
                JSON.parse(localStorage.getItem("userData")).data.data._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikePost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likePost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>{posts.likes.length} Likes</p>
              <p>{posts.body} </p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all comments
              </p>
            </div>

            {/* add Comment */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood</span>
              <input
                type="text"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
              <button
                className="comment"
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
              >
                Post
              </button>
            </div>
          </div>
        );
      })}

      {/* show Comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              {/* card header */}
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                <div className="card-pic">
                  <img
                    src={item.postedBy.Photo}
                    alt=""
                  />
                </div>
                <h5>{item.postedBy.name}</h5>
              </div>

              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #00000029" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment}</span>
                    </p>
                  );
                })}
              </div>

              {/* card content */}
              <div className="card-content">
                <p>{item.likes.length} Likes</p>
                <p>{item.body}</p>
              </div>

              {/* add Comment */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood</span>
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                />
                <button
                  className="comment"
                  onClick={() => {
                    makeComment(comment, item._id);
                    toggleComment();
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
          <div
            className="close-comment"
            onClick={() => {
              toggleComment();
            }}
          >
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
