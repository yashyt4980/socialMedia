import React, { useState, useContext, useEffect } from "react";
import "./SignIn.css";
import logo from "../img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { LoginContext } from "../context/LoginContext";
import axios from 'axios';
export default function SignIn() {
  // const [ userData, setUserData ] = useState(null);
  // eslint-disable-next-line
  const { setUserLogin, userData, setUserData  } = useContext(LoginContext);
  // console.log(userData);
  const navigate = useNavigate();
  // form controls
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Toast functions
  const notifyA = (msg) => toast.error(msg)
  const notifyB = (msg) => toast.success(msg)

  // eslint-disable-next-line
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const postData = async () => {
    //checking email
    if (!emailRegex.test(email)) {
      notifyA("Invalid email")
      return
    }
    // Sending data to server
    try {
      const data = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      })
      if(data) {
        // console.log(data);
        localStorage.setItem("userData", JSON.stringify(data));
        notifyB("Logged In");
        setUserLogin(true);
        setUserData(JSON.parse(localStorage.getItem("userData")));
        navigate("/home");
      }
    }
    catch(error) {
      console.log(error.message);
      notifyA("Invalid Credentials");
    }
  }

  useEffect(() => {
    if(localStorage.getItem("userData")) navigate('/home');
    // if(userData) navigate('/home');
    // eslint-disable-next-line
  },[]);

  // useEffect(() => {
    
  // }, [localStorage.getItem("userData")]);
  return (
    <div className="signIn">
      <div>
        <div className="loginForm">
          <img className="signUpLogo" src={logo} alt="" />
          <div>
            <input type="email" name="email" id="email" value={email} placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div>
          <input type="submit" id="login-btn" onClick={() => { postData() }} value="Sign In" />
        </div>
        <div className="loginForm2">
          Don't have an account ?
          <Link to="/signup">
            <span style={{ color: "blue", cursor: "pointer" }}>Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
