// import { useGesture } from "react-use-gesture";
import React, { createRef, useEffect } from "react";
import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { compose, withProps, withStateHandlers } from "recompose";
import { useGesture } from "@use-gesture/react";
import { ChromePicker } from "react-color";
import * as htmlToImage from "html-to-image";
import todos from "./todos";
import { routingNavigateBottom } from "./Constanst";
import { useScreenshot, createFileName } from "use-react-screenshot";
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
} from "react-google-maps";
import "./example.scss";

let magnetometer = null;
let accelerometer = null;

function VeTinh(props) {
  let autocomplete;
  const myUse = document.getElementById("myUse");
  const lineRef = React.useRef();
  const refDownload = createRef(null);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });

  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [posLaKinh, setPosLaKinh] = React.useState({ x: 0, y: 0 });

  const [degPos, setDegPos] = React.useState(0);
  const [degPosLaKinh, setDegPosLaKinh] = React.useState(0);
  const [isLineRotate, setIsLineRotate] = React.useState(true);
  const [visibleTools, setVisibleTools] = React.useState({
    pickColor: false,
    visbleRotate: true,
  });
  const [dataTools, setDataTools] = React.useState({
    pickColor: "#000000",
  });
  const bind = useGesture(
    {
      onDragStart: () => {},
      onDrag: ({ offset: [x, y] }) => {
        const a = caculateDegree(x, -y, 125, 0);
        if (isLineRotate) {
          myUse?.style.setProperty("--r", `${a}deg`);
          setDegPos(a);
        } else setDegPosLaKinh(a);
      },
      onDragEnd: ({ offset: [x, y] }) => {
        if (isLineRotate) setPos({ x, y });
        else setPosLaKinh({ x, y });
      },
    },
    {
      // enabled: active && !lock,
      drag: {
        from: () => [
          isLineRotate ? pos.x : posLaKinh.x,
          isLineRotate ? pos.y : posLaKinh.y,
        ],
      },
      transform: ([x, y]) => [
        Math.round(x * 100) / 100,
        -Math.round(y * 100) / 100,
      ],
    }
  );
  const onChangeColor = (e) => {
    setDataTools({ ...visibleTools, pickColor: e.hex });
  };
  // function initAutocomplete() {
  //   // autocomplete = new google.maps.places.Autocomplete(
  //   //   document.getElementById("autocomplete"),
  //   //   {
  //   //     types: ["establishment"],
  //   //     componentRestrictions: { country: ["AU"] },
  //   //     fields: ["place_id", "geometry", "name"],
  //   //   }
  //   // );
  // }
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

  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () =>
    takeScreenshot(refDownload.current).then(download);
  useEffect(() => {}, []);
  // initAutocomplete();

  useEffect(() => {
    document.ontouchmove = function (event) {
      event.preventDefault();
    };
    document.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );
  }, []);
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
      {/* <input
        id="autocomplete"
        placeholder="asd"
        type={"text"}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 3 }}></input> */}
      <div id="details"></div>
      {/* header */}
      {/* <StyledMapWithAnInfoBox /> */}
      {/* <div ref={refDownload}> */}
      <MyMapComponent />
      {/* </div> */}
      {/* la ban */}
      {visibleTools.visbleRotate && (
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            zIndex: 4,
            msTransform: "translate(-50%, -50%)",
            transform: "translate(-50%, -50%)",
            pointerEvents: isLineRotate ? "none" : "all",
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
              background: dataTools.pickColor,
              rotate: degPosLaKinh + "deg",
              width: window.innerWidth,
              height: "100%",
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
      )}
      {/* line  */}
      {visibleTools.visbleRotate && (
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: "50%",
            zIndex: 4,
            msTransform: "translate(-50%, -50%)",
            transform: "translate(-50%, -50%)",
          }}
          {...bind()}>
          <svg height={400} width={400} style={{ pointerEvents: "none" }}>
            <use
              href="#carrot"
              id="myUse"
              height={400}
              width={400}
              ref={lineRef}>
              <svg id="carrot">
                <path
                  d="M 135 175 l 30 0"
                  stroke="red"
                  stroke-width="2"
                  fill="none"
                />
                <circle
                  id="pointA"
                  cx="175"
                  cy="175"
                  r="10"
                  stroke="red"
                  fill="none"
                />
                <path
                  d="M 185 175 l 30 0"
                  stroke="red"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  d="M 175 165 l 0 -180"
                  stroke="red"
                  stroke-width="2"
                  fill="none"
                />
                <path
                  d="M 175 185 l 0 180"
                  stroke="none"
                  stroke-width="2"
                  fill="none"
                />
              </svg>
            </use>
          </svg>
          <div
            style={{
              position: "absolute",
              rotate: degPos + "deg",
              top: 0,
              left: 0,
              width: 400,
              height: 400,
              display: "flex",
              justifyContent: "center",
            }}>
            <span
              className="d-flex flex-row justify-content-center align-items-center"
              style={{
                marginTop: 10,
                height: 20,
                width: 60,
                color: "white",
                background: "red",
                padding: "2px 5px",
                fontSize: 14,
              }}>
              {degPos.toFixed([1])}
              <span>&deg;</span>
            </span>{" "}
            <img
              style={{
                width: 30,
                height: 30,
                position: "absolute",
                top: 70,
                backgroundColor: "white",
                borderRadius: "50%",
                padding: 5,
              }}
              src="/home/favicon.png"></img>
          </div>
        </div>
      )}
      {/* bottom */}
      <div
        className="d-flex flex-row justify-content-between align-items-end"
        style={{
          padding: "10px 20px",
          zIndex: 6,
          position: "absolute",
          right: 0,
          bottom: 120,
          width: "100%",
        }}>
        {/* left */}
        <div className="d-flex flex-column ">
          <div style={{ left: 0 }} className="mb-2">
            <Button
              onClick={() => {
                setIsLineRotate(!isLineRotate);
              }}
              style={{
                background: "white",
                borderRadius: 9999,
                padding: "10px 12px",
                border: "0px",
                marginRight: 8,
              }}>
              <Image
                src={`/la-kinh/icon-${isLineRotate ? "7.png" : "2.png"}`}
                style={{
                  width: 20,
                  height: 20,
                }}></Image>
            </Button>
            <Button
              onClick={() => {
                console.log(123123);
              }}
              style={{
                background: "white",
                borderRadius: 9999,
                padding: "10px 12px",

                border: "0px",
              }}>
              <Image
                src="/la-kinh/icon-8.png"
                style={{
                  width: 20,
                  height: 20,
                }}></Image>
            </Button>
          </div>
          <div style={{ left: 0 }}>
            {/* Reset */}
            <Button
              onClick={() => {
                setDegPos(0);
                setDegPosLaKinh(0);
                setPos({ x: 0, y: 0 });
                setPosLaKinh({ x: 0, y: 0 });
                myUse?.style.setProperty("--r", `${0}deg`);
              }}
              style={{
                background: "white",
                borderRadius: 9999,
                padding: "10px 12px",
                border: "0px",
                marginRight: 8,
              }}>
              <Image
                src="/la-kinh/icon-9.png"
                style={{
                  width: 20,
                  height: 20,
                }}></Image>
            </Button>
            {/* Visible Rotatie */}
            <Button
              onClick={() => {
                setVisibleTools({
                  ...visibleTools,
                  visbleRotate: !visibleTools.visbleRotate,
                });
              }}
              style={{
                background: visibleTools.visbleRotate ? "white" : "black",
                borderRadius: 9999,
                padding: "10px 12px",

                border: "0px",
              }}>
              <Image
                src={`/la-kinh/${
                  visibleTools.visbleRotate ? "icon-10.png" : "icon-10-1.png"
                }`}
                style={{
                  width: 20,
                  height: 10,
                }}></Image>
            </Button>
          </div>
        </div>
        {/* middle */}
        <div className="d-flex flex-column align-items-center">
          <div style={{ textTransform: "uppercase", color: "white" }}></div>
        </div>
        {/* right */}
        <div style={{}} className="d-flex flex-column align-items-center">
          <Button
            onClick={() => {
              setVisibleTools({
                ...visibleTools,
                pickColor: !visibleTools.pickColor,
              });
            }}
            style={{
              background: "white",
              borderRadius: 9999,
              padding: "10px 12px",
              border: "0px",
              marginBottom: 12,
            }}>
            <Image
              src="/la-kinh/icon-11.png"
              style={{
                width: 20,
                height: 20,
              }}></Image>
          </Button>
          {/* Screenshot */}
          <Button
            onClick={() => {
              downloadScreenshot();
            }}
            style={{
              background: "white",
              borderRadius: 9999,
              padding: "10px 12px",

              border: "0px",
            }}>
            <Image
              src="/la-kinh/icon-1.png"
              style={{
                width: 20,
                height: 20,
              }}></Image>
          </Button>
        </div>
      </div>
      {/* navigatorBottom */}
      <div
        className="d-flex flex-row justify-content-center position-absolute bottom-2"
        style={{
          width: "100%",
          zIndex: 2,
        }}>
        <div style={{}} className="d-flex flex-row align-items-center"></div>
        {routingNavigateBottom.map((item, index) => {
          if (index !== 1)
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
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          zIndex: 10,
          right: 0,
        }}>
        {visibleTools.pickColor && (
          <ChromePicker
            styles={{
              input: {
                border: "none",
                color: "white",
              },
              label: {
                fontSize: "12px",
                color: "white",
              },
            }}
            disableAlpha={true}
            onChange={onChangeColor}
            color={dataTools.pickColor}
          />
        )}
      </div>
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
const caculateDegree = (x, y, a, b) => {
  "worklet";
  // console.log(x,y,a,b)
  const R = Math.sqrt(Math.pow(a - x, 2) + Math.pow(b - y, 2));
  if (a - x < 0 && b - y > 0) {
    const sina = (x - a) / R;
    return (Math.asin(sina) * 180) / Math.PI;
  } else if (a - x < 0 && b - y < 0) {
    const sina = (x - a) / R;
    // console.log(180 - Math.asin(sina) * 180 / Math.PI)
    return 180 - (Math.asin(sina) * 180) / Math.PI;
  } else if (a - x > 0 && b - y < 0) {
    const sina = (a - x) / R;
    return 180 + (Math.asin(sina) * 180) / Math.PI;
  } else if (a - x > 0 && b - y > 0) {
    const sina = (b - y) / R;
    return 270 + (Math.asin(sina) * 180) / Math.PI;
  } else {
    return 0;
  }
};
export default VeTinh;
