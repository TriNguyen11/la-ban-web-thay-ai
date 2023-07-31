import React from "react";
import { Button, Image } from "react-bootstrap";

import todos from "./todos";

let magnetometer = null;
let accelerometer = null;
const SHAKE_THRESHOLD = 10;

function CreateNewProject(props) {
  const docanbangRef = React.useRef();
  const viewshotRef = React.useRef();
  const compassPickerComponent = React.useRef();
  const shareImageViewRef = React.useRef();
  const [visibleSonHuongPicker, setVisibleSonHuongPicker] =
    React.useState(false);
  const [isPermission, setIsPermission] = React.useState(false);
  const [lock, setLock] = React.useState(false);
  const [text, setText] = React.useState([]);
  const [angle, setAngle] = React.useState(0);
  // const [docanbang,setDoCanBang] = React.useState({x: 0,y:0,z:0})
  const [laban, setLaban] = React.useState(null);
  const [labanObj, setLabaObj] = React.useState({});
  // const labanMaTrix = useValue(Skia.Matrix());

  const [example, setExample] = React.useState();
  // let _angle = useSharedValue(0);
  // _angle.addListener(({value}) => setAngle(Math.round(value)));

  const unsubscribe = () => {
    if (magnetometer) {
      magnetometer.unsubscribe();
    }
    if (accelerometer) {
      accelerometer.unsubscribe();
    }
  };

  let is_running = false;
  let demo_button = document.getElementById("start_demo");

  React.useEffect(() => {
    const cpss = todos.getCompasses();
    console.log(cpss, "cpss");
    setLaban(cpss[0]);
    window.addEventListener("focus", () => {});
    window.addEventListener("blur", () => {
      unsubscribe();
    });
  }, []);

  setInterval(() => {
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
  }, 1000);
  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ rotate: `${_angle.value}deg` }],
  //   };
  // });

  // const labanDimensions = rect(0, 0, labanWidth, labanWidth);
  // console.log(labanDimensions)
  const directionName = todos.getDirectionName(angle);
  const directionPhongThuyName = todos.getDirectionPhongThuyName(angle);

  function deviceOrientationListener(event) {
    var alpha = event.alpha; //z axis rotation [0,360)
    var beta = event.beta; //x axis rotation [-180, 180]
    var gamma = event.gamma; //y axis rotation [-90, 90]
    //Check if absolute values have been sent
    if (typeof event.webkitCompassHeading !== "undefined") {
      alpha = event.webkitCompassHeading; //iOS non-standard
      var heading = alpha;
      setAngle(heading.toFixed([1]));
    } else {
      var heading = 360 - alpha; //heading [0, 360)
      setAngle(
        (heading - 210 < 0 ? heading + 360 - 210 : heading - 210).toFixed([1])
      );
    }
  }

  React.useEffect(() => {
    if (
      DeviceMotionEvent &&
      typeof DeviceMotionEvent.requestPermission === "function"
    ) {
      DeviceMotionEvent.requestPermission();
    }
    // DeviceMotionEvent.requestPermission();
    window.addEventListener("deviceorientation", deviceOrientationListener);
  }, []);

  // console.log(labanObj.Accelerometer_z, "labanObj.Accelerometer_z");
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
      {/* header */}
      <div
        className="d-flex flex-row justify-content-between align-items-start"
        style={{ padding: "10px 20px" }}>
        {/* left */}
        <div>
          <ThuocDoCanBang ref={docanbangRef} />
        </div>
        {/* middle */}
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-row align-items-center">
            <div
              style={{
                fontWeight: "bold",
                backgroundColor: "white",
                borderRadius: 8,
                padding: "2px 10px",
                marginRight: 8,
              }}>
              {angle} <span>&deg;</span>
              <i
                className=" fa fa-pen-alt "
                style={{
                  cursor: "pointer",
                  fontSize: 12,
                }}>
                {" "}
              </i>
            </div>
            <div className="position-relative" style={{}}>
              <Image
                src={"/la-ban/24-son-huong.png"}
                // src={"../assets/la-ban/60-hoa-giap.png"}
                style={{
                  width: 30,
                  height: 30,
                  rotate: `${example ? example : 0}deg`,
                }}
              />
              <i
                className=" fa fa-lock  position-absolute "
                style={{
                  cursor: "pointer",
                  fontSize: 12,
                  right: 10,
                  top: 8,
                }}></i>
            </div>
          </div>
          <div
            style={{
              textTransform: "uppercase",
              color: "white",
              marginTop: 8,
            }}>
            Hướng:
            {directionPhongThuyName} ({directionName})<p id="heading"></p>
          </div>
        </div>

        {/* right */}
        <div style={{}} className="d-flex flex-column align-items-center">
          <Button
            onClick={() => {
              if (
                DeviceMotionEvent &&
                typeof DeviceMotionEvent.requestPermission === "function"
              ) {
                DeviceMotionEvent.requestPermission();
              }
            }}
            style={{
              background: "white",
              borderRadius: 9999,
              padding: "8px 11px",
              marginBottom: 12,
              color: "black",
              border: "0px",
            }}>
            <i
              className=" fa fa-camera  "
              style={{
                cursor: "pointer",
                fontSize: 20,
                right: 10,
              }}></i>
          </Button>
          <Button
            style={{
              background: "white",
              borderRadius: 9999,
              padding: "6px 5px",
              border: "0px",
            }}>
            <Image
              src="/la-kinh/icon-2.png"
              style={{
                width: 32,
                height: 28,
              }}></Image>
          </Button>
        </div>
      </div>
      {/* la ban */}
      <div style={{}} className="d-flex flex-row justify-content-center">
        <Image
          src={"/la-ban/24-son-huong.png"}
          // src={"../assets/la-ban/60-hoa-giap.png"}
          style={{
            width: "90%",
            height: "40%",
            rotate: `${angle ? 360 - angle : 0}deg`,
          }}
        />
      </div>
      {/* <div style={{}} className="d-flex flex-row justify-content-center">
        <Image
          src={"/la-ban/24-son-huong.png"}
          // src={"../assets/la-ban/60-hoa-giap.png"}
          style={{
            width: "50%",
            height: "20%",
            rotate: `${labanObj ? labanObj?.z : 0}deg`,
          }}
        />
      </div> */}
      {/* bottom */}
      <div
        className="d-flex flex-row justify-content-between align-items-end"
        style={{ padding: "10px 20px" }}>
        {/* left */}
        <div style={{ width: 50 }}>
          {" "}
          <p></p>
        </div>
        {/* middle */}
        <div className="d-flex flex-column align-items-center">
          <div style={{ textTransform: "uppercase", color: "white" }}>
            Toa:{" "}
            {todos.getDirectionPhongThuyName(
              angle >= 180 ? angle - 180 : 180 + angle
            )}{" "}
            ({todos.getDirectionName(angle >= 180 ? angle - 180 : 180 + angle)})
          </div>

          <div className="d-flex flex-row align-items-center">
            <div
              style={{
                fontWeight: "bold",
                backgroundColor: "white",
                borderRadius: 8,
                padding: "2px 10px",
                marginRight: 8,
              }}>
              {Math.abs(angle >= 180 ? angle - 180 : 180 + angle)}
              <span>&deg;</span>
            </div>
          </div>
        </div>
        {/* right */}
        <div style={{}} className="d-flex flex-column align-items-center">
          <Button
            style={{
              background: "white",
              borderRadius: 9999,
              padding: "10px 12px",
              border: "0px",
              marginBottom: 12,
            }}>
            <Image
              src="/la-kinh/icon-3.png"
              style={{
                width: 20,
                height: 20,
              }}></Image>
          </Button>
          <Button
            style={{
              background: "white",
              borderRadius: 9999,
              padding: "10px 12px",

              border: "0px",
            }}>
            <Image
              src="/la-kinh/icon-4.png"
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
        }}>
        <div style={{}} className="d-flex flex-row align-items-center"></div>
        {[
          { title: "Vật lý", icon: "icon-vat-ly" },
          { title: "Vệ tinh", icon: "icon-ve-tinh" },
          { title: "Lập cực", icon: "icon-lap-cuc" },
        ].map((item) => {
          return (
            <div
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
