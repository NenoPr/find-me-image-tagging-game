import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import Timer from "./Timer";
import "./styles/header.css";

const Header = (appProps) => {
  // console.log("Header props", appProps);
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
            <div className="header-characters-title">Find:</div>
          ) : (
            <div className="header-characters-title"></div>
          )}
          <div className="header-characters-container">
            {appProps.props.characters ? (
              appProps.props.characters.map((item) =>
                item.status ? null : (
                  <div
                    className="header-character-holder"
                    key={item.name + item.imageUrl}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="header-characters-image"
                    />
                    <div className="header-characters">{item.name}</div>
                  </div>
                )
              )
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
