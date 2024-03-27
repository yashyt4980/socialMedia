// eslint-disable-next-line
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
export default function ProfilePic({ changeprofile, setPic }) {
  const hiddenFileInput = useRef(null);
  const [image, setImage] = useState("");
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  if(image) {
    const data = new FormData();
    data.append("file", image);
    async function uploadImage() {
      const res = await axios.put('http://localhost:5000/api/user/uploadProfilePic',data, {
        headers: {
          authorization: `Bearer ${JSON.parse(localStorage.getItem("userData")).data.token}`
        }
      });
      if(res) {
        changeprofile();
        // console.log(res.data.url);
        const data = JSON.parse(localStorage.getItem("userData"));
        data.data.Photo = res.data.url;
        setPic(res.data_url);
        localStorage.setItem("userData",JSON.stringify(data));
        window.location.reload();
      } else {
        changeprofile();
        console.log("Okay ji");
      }
    }
    uploadImage();
  }
  // useEffect(() => {
  //   if (image) {
  //     postDetails();
  //   }
  // }, [image]);
  // useEffect(() => {
  //   if (url) {
  //     postPic();
  //   }
  // }, [url]);



  return (
    <div className="profilePic darkBg">
      <div className="changePic centered">
        <div>
          <h2>Change Profile Photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            className="upload-btn"
            style={{ color: "#1EA1F7" }}
            onClick={handleClick}
          >
            Upload Photo
          </button>
          <input
            type="file"
            ref={hiddenFileInput}
            accept="image/*"
            name = "profilepic"
            style={{ display: "none" }}
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button className="upload-btn" style={{ color: "#ED4956" }}>
            {" "}
            Remove Current Photo
          </button>
        </div>
        <div style={{ borderTop: "1px solid #00000030" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={changeprofile}
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
}
