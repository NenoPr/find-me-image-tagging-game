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
            src="/where-s-waldo-photo-tagging-app/GitHub-Mark-Light-32px.png"
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
