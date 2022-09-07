import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import Timer from "./Timer";
import "./styles/header.css";

const Header = (appProps) => {
  console.log("Header props", appProps);
  return (
    <>
      <div className="header-container">
        <div className="header-title-logo">Find Me!</div>
        <div className="header-timer">
          <div>Time</div>
          <div>
            {" "}
            <Timer props={appProps.props} />{" "}
          </div>
        </div>
        <div className="header-characters-to-find-container">
          {appProps.props.timerRunning ? (
            <div className="header-characters-title">
              Find These Characters!
            </div>
          ) : (
            <div className="header-characters-title"></div>
          )}
          <div className="header-characters-container">
            {appProps.props.characters ? (
              appProps.props.characters.map((item) => (
                <div className="header-characters">{item}</div>
              ))
            ) : (
              <div>Select a level.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
