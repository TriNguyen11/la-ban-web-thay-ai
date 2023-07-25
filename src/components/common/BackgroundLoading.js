"use client";
import React from "react";
import { Image } from "react-bootstrap";

import ReactLogo from "@floorplan/assets/img/AA1cx9IA.jpeg";

function BackgroundLoading(props) {
  const { show } = props;

  return (
    <div
      className={
        "preloader bg-soft flex-column justify-content-center align-items-center " +
        (show ? "show" : "")
      }>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={ReactLogo}
        height={40}
      />
    </div>
  );
}

export default BackgroundLoading;
