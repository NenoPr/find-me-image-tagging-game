import React, { useState, useEffect } from "react";
import { ReactDOM } from "react";
import "./styles/footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer-container">
        <a
          href="https://github.com/NenoPr"
          target="_blank"
          rel="noreferrer noopener"
        >
          {" "}
          Created by{" "}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/find-me-game.appspot.com/o/GitHub-Mark-Light-32px.png?alt=media&token=f92346b1-a300-4f65-8f2a-6a6a747da088"
            alt="GitHub Logo"
          />{" "}
          NenoPr
        </a>
        <span>{" : "}</span>
        <a
          href="https://pierreroussel.artstation.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Art By: Pierre Roussel
        </a>
      </div>
    </>
  );
};

export default Footer;
