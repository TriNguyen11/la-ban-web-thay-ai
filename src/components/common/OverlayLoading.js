import React from "react";
import { Image } from "react-bootstrap";

import ReactLogo from "@floorplan/assets/img/AA1cx9IA.jpeg";

function OverlayLoading(props) {
  const { show } = props;
  if (!show) {
    return <></>;
  }
  return (
    <div
      className={
        "modal-backdrop show d-flex justify-content-center align-items-center"
      }>
      <Image
        className="loader-element animate__animated animate__jackInTheBox"
        src={ReactLogo}
        height={40}
        alt={"No image"}
      />
    </div>
  );
}

export default OverlayLoading;
