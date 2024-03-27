import React, { useContext } from "react";
import { RiCloseLine } from "react-icons/ri";
import "./Modal.css";
import { useNavigate } from "react-router-dom";
import { LoginContext } from '../context/LoginContext';

export default function Modal({ setModalOpen }) {
  const navigate = useNavigate();
  const { setUserData } = useContext(LoginContext);;
  return (
    <div className="darkBg" onClick={() => setModalOpen(false)}>
      <div className="centered">
        <div className="modal">
          {/* modal header */}
          <div className="modalHeader">
            <h5 className="heading">Confirm</h5>
          </div>
          <button className="closeBtn" onClick={() => setModalOpen(false)}>
            <RiCloseLine></RiCloseLine>
          </button>
          {/* modal content */}
          <div className="modalContent">Are you really want to log Out ?</div>
          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="logOutBtn"
                onClick={() => {
                  setModalOpen(false);
                  localStorage.clear();
                  setUserData(null);
                  navigate("/");
                }}
              >
                Log Out
              </button>

              <button className="cancelBtn" onClick={() => setModalOpen(false)}>
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
