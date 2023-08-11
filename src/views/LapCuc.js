import { useGesture } from "react-use-gesture";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";

import todos from "./todos";
import { routingNavigateBottom } from "./Constanst";

let magnetometer = null;
let accelerometer = null;
function LapCuc(props) {
  const [isImage, setIsImage] = useState(false);
  function imagePreview(e) {
    const blob = new Blob([e.target.files[0]]);
    const blobURL = URL.createObjectURL(blob);
    const avatar = document.getElementById("avatar");
    avatar.style.display = "block";
    avatar.src = blobURL;
    setIsImage(true);
  }

  return (
    <>
      <Image
        src="/home/bg-footer.png"
        style={{
          // width: "100vw",
          // height: "85vh",
          bottom: 0,
          position: "absolute",
          zIndex: -1,
        }}></Image>
      <Image
        src="/home/background.png"
        style={{
          width: "100vw",
          height: "100vh",
          position: "absolute",
          zIndex: -2,
        }}></Image>
      {/* main */}
      <div
        style={{ height: "80%", marginTop: "20%" }}
        className="d-flex flex-column align-items-center justify-content-center">
        {!isImage ? (
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
              width: "100vw",
              height: "120vh",
            }}>
            {[
              { title: "Lập cực từ ảnh upload", onClick: () => {} },
              { title: "Lập cực từ ảnh vệ tinh", onClick: () => {} },
              { title: "Lập cực từ hình tự vẽ", onClick: () => {} },
            ].map((item, index) => {
              return (
                <ButtonLapCuc
                  title={item.title}
                  setIsImage={setIsImage}
                  isImage={isImage}
                  imagePreview={imagePreview}
                />
              );
            })}
          </div>
        ) : (
          <div style={{ position: "absolute", top: 20, left: 20 }}>
            <i
              className="fa fa-chevron-left"
              style={{ fontSize: 30, color: "black" }}></i>
          </div>
        )}
        <img
          id="avatar"
          src=""
          alt="avatar"
          style={{ opacity: isImage ? 1 : 0 }}
          res 
        />

        {/* navigatorBottom */}
        <div
          className="d-flex flex-row justify-content-center position-absolute bottom-2"
          style={{
            width: "100%",
          }}>
          <div style={{}} className="d-flex flex-row align-items-center"></div>
          {routingNavigateBottom.map((item) => {
            return (
              <div
                onClick={item.onClick}
                style={{
                  background: "transparent",
                  border: "0px",
                }}
                className="d-flex flex-column align-items-center">
                <Image
                  src={`/home/icon-round.png`}
                  style={{ width: 50, height: 50, top: -10 }}
                  className="position-absolute"
                />
                <Image
                  src={`/la-kinh/${item.icon}.png`}
                  style={{ width: 25, height: 25 }}
                />
                <p
                  className="mx-4"
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    // margin: 0,
                    // marginTop: 8,
                    color: "white",
                  }}>
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
const TDCBWidth = 50;
const ButtonLapCuc = ({ title, setIsImage, isImage, imagePreview }) => {
  return (
    <div
      style={{
        width: "80%",
        height: 20,
        color: "#C09724",
        border: "1px solid #C09724",
        borderRadius: 12,
        position: "relative",
      }}
      className="d-flex align-items-center justify-content-center my-2 p-3">
      <i className="fa fa-images me-2"></i>
      <div> {title}</div>
      {title == "Lập cực từ ảnh upload" && (
        <input
          type="file"
          id="upload"
          style={{
            width: "100%",
            opacity: 0,
            cursor: "pointer",
            position: "absolute",
          }}
          onChange={imagePreview}
        />
      )}
    </div>
  );
};
export default LapCuc;
