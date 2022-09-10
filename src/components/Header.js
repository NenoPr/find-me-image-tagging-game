import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import Timer from "./Timer";
import "./styles/header.css";

const Header = (appProps) => {
  // console.log("Header props", appProps);
  return (
    <>
      <div className="header-container">
        <div className="header-title-logo">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/find-me-game.appspot.com/o/PSLogo.png?alt=media&token=8b4a3592-737b-419a-9840-9c0b0bd05bee"
            alt="Playstation logo"
            className="header-title-logo-image"
          />
          <div>
            <div>Find Me!</div>
            <div className="header-title-description">
              A Playstation themed image tagging game.
            </div>
          </div>
        </div>
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
