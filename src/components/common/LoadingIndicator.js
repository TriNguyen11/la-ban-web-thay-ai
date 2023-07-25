import React from "react";
import { Form, Image } from "react-bootstrap";

import ReactLogo from "@floorplan/assets/img/AA1cx9IA.jpeg";

function LoadingIndicator() {
  return (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={ReactLogo}
        height={40}
        alt={"No image"}
      />
    </div>
  );
}

export default LoadingIndicator;
