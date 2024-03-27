import React, { useState } from "react";
import "./Createpost.css";
import { toast } from 'react-toastify';
// eslint-disable-next-line
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function Createpost() {
  // const navigate = useNavigate()
  const [ imageProvided, setImageProvided ] = useState(false);
  const [ postData, setPostData ] =  useState({
    body:"",
  });
  function changeHandler(event) {
    // console.log(event.target.name, event.target.value);
    if(event.target.name === 'pic' && event.target.files.length > 0) {
        loadfile(event);
        setPostData({
            ...postData, [event.target.name] : event.target.files[0]
        })
        setImageProvided(true);
    } 
    if(event.target.name !== 'pic') {
        setPostData({
            ...postData, [event.target.name]: event.target.value
        });
    }
}
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)
  async function submitForm(event) {
    if(postData.body === "") {
        notifyA("Give some body");
    } else {
    let out = {...postData};
    if(imageProvided) out = await uploadImage();
    console.log(out);
    try {
        const config = {
            headers: {
                "Content-type" : "application/json", 
                authorization: `Bearer ${JSON.parse(localStorage.getItem('userData')).data.token}`,
            },
        };
        const { data } = await axios.post("http://localhost:5000/api/post/createPost", {...out}, config);
            if(data && data.success === true) {
                notifyB("Posted Successfully");
            } else {
              notifyA("some error");
            }
    }
    catch(error) {
        console.log(error.message);
    }
}
}
  async function uploadImage() {
    var formData = new FormData();
    formData.append('file', postData.pic);
    try {
        let { data } = await axios.post('http://localhost:5000/api/post/uploadPostPic',formData, {headers: {
            'Content-Type': 'multipart/form-data',
            authorization: `Bearer ${JSON.parse(localStorage.getItem('userData')).data.token}`
        }});
        return {...postData, pic : data.data};
    }
    catch(error) {
        console.log(error.message);
        return {...postData};
    }
}

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  };
  
  return (
    <div className="createPost">
      {/* //header */}
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create New Post</h4>
        <button id="post-btn" onClick={submitForm}>Share</button>
      </div>
      {/* image preview */}
      <div className="main-div">
        <img
          id="output"
          src=""
          alt=""
        />
        <input
          name = "pic"
          type="file"
          accept="image/*"
          onChange={changeHandler}
        />
      </div>
      {/* details */}
      <div className="details">
        <div className="card-header">
          <div className="card-pic">
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt=""
            />
          </div>
          <h5>{JSON.parse(localStorage.getItem("userData")).data.data.name}</h5>
        </div>
        <textarea name = "body" value={postData.body} onChange={changeHandler} type="text" placeholder="Write a caption...."></textarea>
      </div>
    </div>
  );
}
