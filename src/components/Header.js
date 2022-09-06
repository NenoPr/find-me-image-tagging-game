import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import "./styles/header.css";

const Header = () => {
  return (
    <>
      <div className="header-container">
        <div className="header-title-logo">Find Me!</div>
        <div className="header-timer">
          <div>Time</div>
          <div>00:00:00</div>
        </div>
        <div className="header-characters-to-find-container">
          <div className="header-characters-title">Find These Characters!</div>
          <div className="header-characters-container">
            <div className="header-characters-1">Kratos</div>
            <div className="header-characters-2">Raiden</div>
            <div className="header-characters-3">Ratchet</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
