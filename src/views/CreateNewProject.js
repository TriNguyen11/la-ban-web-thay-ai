import React from "react";
import { Button, Image, Tooltip } from "react-bootstrap";

import todos from "./todos";

let magnetometer = null;
let accelerometer = null;
const SHAKE_THRESHOLD = 10;

function CreateNewProject(props) {
  const compassCircle = document.querySelector(".compass-circle");
  const myPoint = document.querySelector(".my-point");
  const startBtn = document.querySelector(".start-btn");
  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/);

  function init() {
    startBtn?.addEventListener("click", startCompass);
    navigator.geolocation.getCurrentPosition(locationHandler);

    if (!isIOS) {
      window.addEventListener("deviceorientationabsolute", handler, true);
    }
  }

  function startCompass() {
    if (isIOS) {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("has to be allowed!");
          }
        })
        .catch(() => alert("not supported"));
    }
  }

  function handler(e) {
    compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
    compassCircle.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`;

    // ±15 degree
    if (
      (pointDegree < Math.abs(compass) &&
        pointDegree + 15 > Math.abs(compass)) ||
      pointDegree > Math.abs(compass + 15) ||
      pointDegree < Math.abs(compass)
    ) {
      myPoint.style.opacity = 0;
    } else if (pointDegree) {
      myPoint.style.opacity = 1;
    }
  }

  let pointDegree;

  function locationHandler(position) {
    const { latitude, longitude } = position.coords;
    pointDegree = calcDegreeToPoint(latitude, longitude);

    if (pointDegree < 0) {
      pointDegree = pointDegree + 360;
    }
  }

  function calcDegreeToPoint(latitude, longitude) {
    // Qibla geolocation
    const point = {
      lat: 21.422487,
      lng: 39.826206,
    };

    const phiK = (point.lat * Math.PI) / 180.0;
    const lambdaK = (point.lng * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;
    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) -
          Math.sin(phi) * Math.cos(lambdaK - lambda)
      );
    return Math.round(psi);
  }

  init();
  setTimeout(() => {
    init();
  }, 1000);
  return (
    // <>
    //   <Image
    //     src="/home/bg-footer.png"
    //     style={{
    //       // width: "100vw",
    //       // height: "85vh",
    //       bottom: 0,
    //       position: "absolute",
    //       zIndex: -1,
    //     }}></Image>
    //   <Image
    //     src="/home/background.png"
    //     style={{
    //       width: "100vw",
    //       height: "100vh",
    //       position: "absolute",
    //       zIndex: -2,
    //     }}></Image>
    //   {/* header */}
    //   <div
    //     className="d-flex flex-row justify-content-between align-items-start"
    //     style={{ padding: "10px 20px" }}>
    //     {/* left */}
    //     <div>
    //       <ThuocDoCanBang ref={docanbangRef} />
    //     </div>
    //     {/* middle */}
    //     <div className="d-flex flex-column align-items-center">
    //       <div className="d-flex flex-row align-items-center">
    //         <div
    //           style={{
    //             fontWeight: "bold",
    //             backgroundColor: "white",
    //             borderRadius: 8,
    //             padding: "2px 10px",
    //             marginRight: 8,
    //           }}>
    //           {angle} <span>&deg;</span>
    //           <i
    //             className=" fa fa-pen-alt "
    //             style={{
    //               cursor: "pointer",
    //               fontSize: 12,
    //             }}>
    //             {" "}
    //           </i>
    //         </div>
    //         <div className="position-relative" style={{}}>
    //           <Image
    //             src={"/la-ban/24-son-huong.png"}
    //             // src={"../assets/la-ban/60-hoa-giap.png"}
    //             style={{
    //               width: 30,
    //               height: 30,
    //               rotate: `${angle ? angle : 0}deg`,
    //             }}
    //           />
    //           <i
    //             className=" fa fa-lock  position-absolute "
    //             style={{
    //               cursor: "pointer",
    //               fontSize: 12,
    //               right: 10,
    //               top: 8,
    //             }}></i>
    //         </div>
    //       </div>
    //       <div
    //         style={{
    //           textTransform: "uppercase",
    //           color: "white",
    //           marginTop: 8,
    //         }}>
    //         Hướng: {directionPhongThuyName} ({directionName})
    //       </div>
    //     </div>

    //     {/* right */}
    //     <div style={{}} className="d-flex flex-column align-items-center">
    //       <Button
    //         style={{
    //           background: "white",
    //           borderRadius: 9999,
    //           padding: "8px 11px",
    //           marginBottom: 12,
    //           color: "black",
    //           border: "0px",
    //         }}>
    //         <i
    //           className=" fa fa-camera  "
    //           style={{
    //             cursor: "pointer",
    //             fontSize: 20,
    //             right: 10,
    //           }}></i>
    //       </Button>
    //       <Button
    //         style={{
    //           background: "white",
    //           borderRadius: 9999,
    //           padding: "6px 5px",
    //           border: "0px",
    //         }}>
    //         <Image
    //           src="/la-kinh/icon-2.png"
    //           style={{
    //             width: 32,
    //             height: 28,
    //           }}></Image>
    //       </Button>
    //     </div>
    //   </div>
    //   {/* la ban */}
    //   <div style={{}} className="d-flex flex-row justify-content-center">
    //     <Image
    //       src={"/la-ban/24-son-huong.png"}
    //       // src={"../assets/la-ban/60-hoa-giap.png"}
    //       style={{
    //         width: "80%",
    //         height: "20%",
    //         rotate: `${angle ? angle : 0}deg`,
    //       }}
    //     />
    //   </div>
    //   {/* bottom */}
    //   <div
    //     className="d-flex flex-row justify-content-between align-items-end"
    //     style={{ padding: "10px 20px" }}>
    //     {/* left */}
    //     <div style={{ width: 50 }}>
    //       {" "}
    //       <p></p>
    //     </div>
    //     {/* middle */}
    //     <div className="d-flex flex-column align-items-center">
    //       <div style={{ textTransform: "uppercase", color: "white" }}>
    //         Toa: {directionOppositePhongThuyName} ({directionOppositeName})
    //       </div>
    //       <div className="d-flex flex-row align-items-center">
    //         <div
    //           style={{
    //             fontWeight: "bold",
    //             backgroundColor: "white",
    //             borderRadius: 8,
    //             padding: "2px 10px",
    //             marginRight: 8,
    //           }}>
    //           {Math.abs(angleOposite)}
    //           <span>&deg;</span>
    //           <i
    //             className=" fa fa-pen-alt "
    //             style={{
    //               cursor: "pointer",
    //               fontSize: 12,
    //             }}>
    //             {" "}
    //           </i>
    //         </div>
    //         <div className="position-relative" style={{}}>
    //           <Image
    //             src={"/la-ban/24-son-huong.png"}
    //             // src={"../assets/la-ban/60-hoa-giap.png"}
    //             style={{
    //               width: 30,
    //               height: 30,
    //               rotate: `${angle ? angle : 0}deg`,
    //             }}
    //           />
    //           <i
    //             className=" fa fa-lock  position-absolute "
    //             style={{
    //               cursor: "pointer",
    //               fontSize: 12,
    //               right: 10,
    //               top: 8,
    //             }}></i>
    //         </div>
    //       </div>
    //     </div>
    //     {/* right */}
    //     <div style={{}} className="d-flex flex-column align-items-center">
    //       <Button
    //         style={{
    //           background: "white",
    //           borderRadius: 9999,
    //           padding: "10px 12px",
    //           border: "0px",
    //           marginBottom: 12,
    //         }}>
    //         <Image
    //           src="/la-kinh/icon-3.png"
    //           style={{
    //             width: 20,
    //             height: 20,
    //           }}></Image>
    //       </Button>
    //       <Button
    //         style={{
    //           background: "white",
    //           borderRadius: 9999,
    //           padding: "10px 12px",

    //           border: "0px",
    //         }}>
    //         <Image
    //           src="/la-kinh/icon-4.png"
    //           style={{
    //             width: 20,
    //             height: 20,
    //           }}></Image>
    //       </Button>
    //     </div>
    //   </div>
    //   {/* navigatorBottom */}
    //   <div
    //     className="d-flex flex-row justify-content-center position-absolute bottom-2"
    //     style={{
    //       width: "100%",
    //     }}>
    //     <div style={{}} className="d-flex flex-row align-items-center"></div>
    //     {[
    //       { title: "Vật lý", icon: "icon-vat-ly" },
    //       { title: "Vệ tinh", icon: "icon-ve-tinh" },
    //       { title: "Lập cực", icon: "icon-lap-cuc" },
    //     ].map((item) => {
    //       return (
    //         <div
    //           style={{
    //             background: "transparent",
    //             border: "0px",
    //           }}
    //           className="d-flex flex-column align-items-center">
    //           <Image
    //             src={`/home/icon-round.png`}
    //             style={{ width: 50, height: 50, top: -10 }}
    //             className="position-absolute"
    //           />
    //           <Image
    //             src={`/la-kinh/${item.icon}.png`}
    //             style={{ width: 25, height: 25 }}
    //           />
    //           <p
    //             className="mx-4"
    //             style={{
    //               marginTop: 8,
    //               fontSize: 13,
    //               // margin: 0,
    //               // marginTop: 8,
    //               color: "white",
    //             }}>
    //             {item.title}
    //           </p>
    //         </div>
    //       );
    //     })}
    //   </div>
    //   {/* <main role="main" className="container">
    //     <div className="p-3 mb-2 bg-secondary" id="demo-div">
    //       <a
    //         id="start_demo"
    //         className="btn btn-lg btn-success py-1"
    //         href="#"
    //         role="button"
    //         style={{}}
    //         onClick={(e) => {
    //           e.preventDefault();

    //           // Request permission for iOS 13+ devices
    //           if (
    //             DeviceMotionEvent &&
    //             typeof DeviceMotionEvent.requestPermission === "function"
    //           ) {
    //             DeviceMotionEvent.requestPermission();
    //           }

    //           if (is_running) {
    //             window.removeEventListener("devicemotion", handleMotion);
    //             window.removeEventListener(
    //               "deviceorientation",
    //               handleOrientation
    //             );
    //             demo_button.innerHTML = "Start demo";
    //             demo_button.classList.add("btn-success");
    //             demo_button.classList.remove("btn-danger");
    //             is_running = false;
    //           } else {
    //             window.addEventListener("devicemotion", handleMotion);
    //             window.addEventListener("deviceorientation", handleOrientation);
    //             document.getElementById("start_demo").innerHTML = "Stop demo";
    //             demo_button.classList.remove("btn-success");
    //             demo_button.classList.add("btn-danger");
    //             is_running = true;
    //           }
    //         }}>
    //         Start the demo
    //       </a>
    //       <p>
    //         Num. of datapoints:{" "}
    //         <span className="badge badge-warning" id="num-observed-events">
    //           0
    //         </span>
    //       </p>

    //       <h4>Orientation</h4>
    //       <ul>
    //         <li>
    //           X-axis (&beta;): <span id="x">0</span>
    //           <span>&deg;</span>
    //         </li>
    //         <li>
    //           Y-axis (&gamma;): <span id="y">0</span>
    //           <span>&deg;</span>
    //         </li>
    //         <li>
    //           ASD-axis (&alpha;): <span id="z">0</span>
    //           <span>&deg;</span>
    //         </li>
    //       </ul>

    //       <h4>Accelerometer</h4>
    //       <ul>
    //         <li>
    //           X-axis: <span id="Accelerometer_x">0</span>
    //           <span>
    //             {" "}
    //             m/s<sup>2</sup>
    //           </span>
    //         </li>
    //         <li>
    //           Y-axis: <span id="Accelerometer_y">0</span>
    //           <span>
    //             {" "}
    //             m/s<sup>2</sup>
    //           </span>
    //         </li>
    //         <li>
    //           Z-axis: <span id="Accelerometer_z">0</span>
    //           <span>
    //             {" "}
    //             m/s<sup>2</sup>
    //           </span>
    //         </li>
    //         <li>
    //           Data Interval: <span id="Accelerometer_i">0</span>
    //           <span> ms</span>
    //         </li>
    //       </ul>

    //       <h4>Accelerometer including gravity</h4>

    //       <ul>
    //         <li>
    //           X-axis: <span id="Accelerometer_gx">0</span>
    //           <span>
    //             {" "}
    //             m/s<sup>2</sup>
    //           </span>
    //         </li>
    //         <li>
    //           Y-axis: <span id="Accelerometer_gy">0</span>
    //           <span>
    //             {" "}
    //             m/s<sup>2</sup>
    //           </span>
    //         </li>
    //         <li>
    //           Z-axis: <span id="Accelerometer_gz">0</span>
    //           <span>
    //             {" "}
    //             m/s<sup>2</sup>
    //           </span>
    //         </li>
    //       </ul>

    //       <h4>Gyroscope</h4>
    //       <ul>
    //         <li>
    //           X-axis: <span id="Gyroscope_x">0</span>
    //           <span>&deg;/s</span>
    //         </li>
    //         <li>
    //           Y-axis: <span id="Gyroscope_y">0</span>
    //           <span>&deg;/s</span>
    //         </li>
    //         <li>
    //           Z-axis: <span id="Gyroscope_z">0</span>
    //           <span>&deg;/s</span>
    //         </li>
    //       </ul>
    //     </div>
    //     <div>{JSON.stringify(labanObj)}</div>
    //     <div id="example">example: {example && JSON.stringify(example)}</div>
    //     <div id="angel">angelhtml :</div>
    //     <div> angel: {angle && JSON.stringify(angle)}</div>
    //     <div>{labanObj ? labanObj?.z : 0}deg</div>
    //   </main> */}
    // </>
    <>
      <div class="compass">
        <div class="arrow"></div>
        <div class="compass-circle"></div>
        <div class="my-point"></div>
      </div>
      <button class="start-btn">Start compass</button>
    </>
  );
}
const TDCBWidth = 50;
const ThuocDoCanBang = React.forwardRef((props, ref) => {
  const color = props.color || "#E2BC3D";
  const [data, setData] = React.useState({ x: 0, y: 0, z: 0 });
  // console.log(data.x,data.y,data.z)
  let x = -data.x;
  let y = data.y;
  // console.log(x,y)
  // const distance = Math.sqrt(Math.pow(x,2) + Math.pow(y,2))
  // x = (x / distance ) * TDCBWidth/4
  // y = (y/ distance ) * TDCBWidth/4
  x = (x * TDCBWidth) / 10 + TDCBWidth / 2;
  y = (y * TDCBWidth) / 10 + TDCBWidth / 2;
  x = x <= 3 ? 3 : x;
  x = x >= TDCBWidth - 3 ? TDCBWidth - 3 : x;
  y = y <= 3 ? 3 : y;
  y = y >= TDCBWidth - 3 ? TDCBWidth - 3 : y;
  // console.log(x,y)
  const start = { x: x, y: y };

  // Use this from another hook.
  React.useImperativeHandle(ref, () => ({
    setData: setData,
  }));

  if (!x || !y) {
    return <></>;
  }

  return (
    <svg width={TDCBWidth + 1} height={TDCBWidth + 1} {...props}>
      <circle
        cx={TDCBWidth / 2}
        cy={TDCBWidth / 2}
        r={TDCBWidth / 2}
        stroke={color}
        strokeWidth="1"
      />
      <circle
        cx={TDCBWidth / 2}
        cy={TDCBWidth / 2}
        r={TDCBWidth / 4}
        stroke={color}
        strokeWidth="1"
      />
      <line
        x1={TDCBWidth / 2}
        y1="0"
        x2={TDCBWidth / 2}
        y2={TDCBWidth}
        stroke={color}
        strokeWidth="1"
      />
      <line
        x1="0"
        y1={TDCBWidth / 2}
        x2={TDCBWidth}
        y2={TDCBWidth / 2}
        stroke={color}
        strokeWidth="1"
      />
      <circle cx={start.x} cy={start.y} r="3" fill={color} />
    </svg>
  );
});
export default CreateNewProject;
