import React from "react";
import { Image } from "react-bootstrap";

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
  const [lock, setLock] = React.useState(false);
  const [text, setText] = React.useState([]);
  const [angle, setAngle] = React.useState(0);
  // const [docanbang,setDoCanBang] = React.useState({x: 0,y:0,z:0})
  const [laban, setLaban] = React.useState(null);
  const [labanObj, setLabaObj] = React.useState({});
  // const labanMaTrix = useValue(Skia.Matrix());

  const [snapshot, setSnapshot] = React.useState("");
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
  function handleOrientation(event) {
    updateFieldIfNotNull("Orientation_a", event.alpha);
    // updateFieldIfNotNull("Orientation_b", event.beta);
    // updateFieldIfNotNull("Orientation_g", event.gamma);
    incrementEventCount();
  }

  function incrementEventCount() {
    let counterElement = document.getElementById("num-observed-events");
    let eventCount = parseInt(counterElement.innerHTML);
    counterElement.innerHTML = eventCount + 1;
  }

  function updateFieldIfNotNull(fieldName, value, precision = 10) {
    if (value != null) {
      document.getElementById(fieldName).innerHTML = value.toFixed(precision);
      setLabaObj({ ...labanObj, [fieldName]: value.toFixed(precision) });
    }
  }

  function handleMotion(event) {
    updateFieldIfNotNull(
      "Accelerometer_gx",
      event.accelerationIncludingGravity.x
    );
    updateFieldIfNotNull(
      "Accelerometer_gy",
      event.accelerationIncludingGravity.y
    );
    updateFieldIfNotNull(
      "Accelerometer_gz",
      event.accelerationIncludingGravity.z
    );

    updateFieldIfNotNull("Accelerometer_x", event.acceleration.x);
    updateFieldIfNotNull("Accelerometer_y", event.acceleration.y);
    updateFieldIfNotNull("Accelerometer_z", event.acceleration.z);

    updateFieldIfNotNull("Accelerometer_i", event.interval, 2);

    updateFieldIfNotNull("Gyroscope_z", event.rotationRate.alpha);
    updateFieldIfNotNull("Gyroscope_x", event.rotationRate.beta);
    updateFieldIfNotNull("Gyroscope_y", event.rotationRate.gamma);
    incrementEventCount();
  }

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

  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ rotate: `${_angle.value}deg` }],
  //   };
  // });

  // const labanDimensions = rect(0, 0, labanWidth, labanWidth);
  // console.log(labanDimensions)
  const directionName = todos.getDirectionName(angle);
  const directionPhongThuyName = todos.getDirectionPhongThuyName(angle);
  const angleOposite = angle >= 180 ? angle - 180 : 180 + angle;
  const directionOppositeName = todos.getDirectionName(angleOposite);
  const directionOppositePhongThuyName =
    todos.getDirectionPhongThuyName(angleOposite);
  React.useEffect(() => {}, []);
  // console.log(labanObj.Accelerometer_z, "labanObj.Accelerometer_z");
  return (
    <>
      <div>
        <Image
          src={"/la-ban/24-son-huong.png"}
          // src={"../assets/la-ban/60-hoa-giap.png"}
          style={{
            width: "100%",
            height: "50%",
            rotate: `${labanObj ? labanObj?.Orientation_a : 0}deg`,
          }}
        />{" "}
        asdsds
      </div>
      <main role="main" className="container">
        <div className="p-3 mb-2 bg-secondary" id="demo-div">
          <a
            id="start_demo"
            className="btn btn-lg btn-success py-1"
            href="#"
            role="button"
            style={{}}
            onClick={(e) => {
              e.preventDefault();

              // Request permission for iOS 13+ devices
              if (
                DeviceMotionEvent &&
                typeof DeviceMotionEvent.requestPermission === "function"
              ) {
                DeviceMotionEvent.requestPermission();
              }

              if (is_running) {
                // window.removeEventListener("devicemotion", handleMotion);
                window.removeEventListener(
                  "deviceorientation",
                  handleOrientation
                );
                demo_button.innerHTML = "Start demo";
                demo_button.classList.add("btn-success");
                demo_button.classList.remove("btn-danger");
                is_running = false;
              } else {
                // window.addEventListener("devicemotion", handleMotion);
                window.addEventListener("deviceorientation", handleOrientation);
                document.getElementById("start_demo").innerHTML = "Stop demo";
                demo_button.classList.remove("btn-success");
                demo_button.classList.add("btn-danger");
                is_running = true;
              }
            }}>
            Start the demo
          </a>
          <p>
            Num. of datapoints:{" "}
            <span className="badge badge-warning" id="num-observed-events">
              0
            </span>
          </p>

          <h4>Orientation</h4>
          <ul>
            <li>
              X-axis (&beta;): <span id="Orientation_b">0</span>
              <span>&deg;</span>
            </li>
            <li>
              Y-axis (&gamma;): <span id="Orientation_g">0</span>
              <span>&deg;</span>
            </li>
            <li>
              ASD-axis (&alpha;): <span id="Orientation_a">0</span>
              <span>&deg;</span>
            </li>
          </ul>

          {/* <h4>Accelerometer</h4>
          <ul>
            <li>
              X-axis: <span id="Accelerometer_x">0</span>
              <span>
                {" "}
                m/s<sup>2</sup>
              </span>
            </li>
            <li>
              Y-axis: <span id="Accelerometer_y">0</span>
              <span>
                {" "}
                m/s<sup>2</sup>
              </span>
            </li>
            <li>
              Z-axis: <span id="Accelerometer_z">0</span>
              <span>
                {" "}
                m/s<sup>2</sup>
              </span>
            </li>
            <li>
              Data Interval: <span id="Accelerometer_i">0</span>
              <span> ms</span>
            </li>
          </ul>

          <h4>Accelerometer including gravity</h4>

          <ul>
            <li>
              X-axis: <span id="Accelerometer_gx">0</span>
              <span>
                {" "}
                m/s<sup>2</sup>
              </span>
            </li>
            <li>
              Y-axis: <span id="Accelerometer_gy">0</span>
              <span>
                {" "}
                m/s<sup>2</sup>
              </span>
            </li>
            <li>
              Z-axis: <span id="Accelerometer_gz">0</span>
              <span>
                {" "}
                m/s<sup>2</sup>
              </span>
            </li>
          </ul>

          <h4>Gyroscope</h4>
          <ul>
            <li>
              X-axis: <span id="Gyroscope_x">0</span>
              <span>&deg;/s</span>
            </li>
            <li>
              Y-axis: <span id="Gyroscope_y">0</span>
              <span>&deg;/s</span>
            </li>
            <li>
              Z-axis: <span id="Gyroscope_z">0</span>
              <span>&deg;/s</span>
            </li>
          </ul> */}
        </div>
        <div>{JSON.stringify(labanObj)}</div>
        <div>{labanObj ? labanObj?.Orientation_a : 0}deg</div>
      </main>
    </>
  );
}

export default CreateNewProject;
