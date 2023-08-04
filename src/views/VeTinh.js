import { useGesture } from "react-use-gesture";
import React, { useEffect } from "react";
import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { compose, withProps, withStateHandlers } from "recompose";

import todos from "./todos";
import { routingNavigateBottom } from "./Constanst";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
let magnetometer = null;
let accelerometer = null;

function VeTinh(props) {
  let autocomplete;
  const lineRef = React.useRef();
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [degPos, setDegPos] = React.useState(0);
  const [tempPos, setTempPos] = React.useState({ x: 0, y: 0 });
  const [degTempPos, setDegTempPos] = React.useState(0);

  useGesture(
    {
      onDrag: ({ offset: [dx, dy] }) => {
        setPos((crop) => ({
          ...crop,
          x: dx - tempPos.x,
          y: dy - tempPos.y,
        }));
        setDegPos(
          Math.atan2(dy - tempPos.y, dx - tempPos.x) * (180 / Math.PI) +
            degTempPos
        );
      },
      onDragEnd: ({ offset: [dx, dy] }) => {
        setTempPos({ x: dx, y: dy });
        setDegTempPos(
          Math.atan2(dy - tempPos.y, dx - tempPos.x) * (180 / Math.PI)
        );
      },
    },
    {
      domTarget: lineRef,
      eventOptions: { passive: false },
    }
  );

  function initAutocomplete() {
    // autocomplete = new google.maps.places.Autocomplete(
    //   document.getElementById("autocomplete"),
    //   {
    //     types: ["establishment"],
    //     componentRestrictions: { country: ["AU"] },
    //     fields: ["place_id", "geometry", "name"],
    //   }
    // );
  }
  autocomplete?.addListener("place_changed", onPlaceChanged);
  function onPlaceChanged() {
    var place = autocomplete?.getPlace();
    if (!place.geometry) {
      // User did not select a prediction; reset the input field
      document.getElementById("autocomplete").placeholder = "Enter a place";
    } else {
      document.getElementById("details").innerHTML = place.name;
    }
  }
  useEffect(() => {}, []);
  initAutocomplete();

  // Display details about the valid place
  return (
    <>
      <Image
        src="/home/bg-footer.png"
        style={{
          width: "100vw",
          bottom: 0,
          position: "absolute",
          zIndex: 1,
        }}></Image>
      <input
        id="autocomplete"
        placeholder="asd"
        type={"text"}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 3 }}></input>
      <div id="details"></div>
      {/* header */}
      {/* <StyledMapWithAnInfoBox /> */}
      <MyMapComponent />
      {/* la ban */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          zIndex: 4,
          msTransform: "translate(-50%, -50%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}>
        {/* la kinh */}
        <div
          style={{
            fontSize: 72,
            // background: "red",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // background: "linear-gradient(45deg,transparent,orange)",
            WebkitMask: "url(/lap-cuc/mac-dinh.png) center/contain no-repeat",
            background: "purple",
          }}>
          <Image
            src="/lap-cuc/mac-dinh.png"
            style={{
              width: window.innerWidth,
              height: "100%",
              maxWidth: window.innerWidth,
              mixBlendMode: "screen",
            }}></Image>
        </div>
      </div>
      {/* line  */}
      <div
        ref={lineRef}
        style={{
          fontSize: 72,
          // background: "red",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          position: "absolute",
          top: "34%",
          left: "50%",
          // left: crop.x,
          // top: crop.y,
          msTransform: "translate(-50%, -50%)",
          transform: "translate(-50%, -50%)",
          rotate: `${degPos}deg`,
        }}>
        <Image
          src="/lap-cuc/LineRotate.png"
          style={{
            width: 120,
            height: "50%",

            mixBlendMode: "screen",
          }}></Image>
      </div>
      {/* navigatorBottom */}
      <div
        className="d-flex flex-row justify-content-center position-absolute bottom-2"
        style={{
          width: "100%",
          zIndex: 2,
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
      {/* {!isPermission && (
        <div
          onClick={(e) => {
            e.preventDefault();
            if (
              DeviceMotionEvent &&
              typeof DeviceMotionEvent.requestPermission === "function"
            ) {
              DeviceMotionEvent.requestPermission();
              setIsPermission(true);
            }
          }}
          style={{
            position: "fixed",
            height: "100vh",
            width: "100vw",
            top: 0,
          }}></div>
      )} */}
    </>
  );
}
const TDCBWidth = 50;

const MyMapComponent = compose(
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyB2iaUASOUYEZOaME6b3d_-0XL5BUHhEqg&v=3.exp&libraries=geometry,drawing,places&callback",

    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 10.5, lng: 106.4 }}></GoogleMap>
));
export default VeTinh;
