import React, { useState, useEffect} from "react";
import { ReactDOM } from "react";

const Header = () => {

  return (
    <>
        <div className="header-container">
            <div className="header-title-logo">
                Find Me!
            </div>
            <div className="header-timer">
                <div>Time</div>
                <div>00:00:00</div>
            </div>
            <div className="header-characters-to-find">
                <div className="header-char1"></div>
                <div className="header-char2"></div>
                <div className="header-char3"></div>
            </div>
        </div>
    </>
  );
}

export default Header;
