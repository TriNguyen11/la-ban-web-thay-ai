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
  const [angle, setAngle] = React.useState(0);
  // const [docanbang,setDoCanBang] = React.useState({x: 0,y:0,z:0})
  const [laban, setLaban] = React.useState(null);
  const [labanWidth, setLabanWidth] = React.useState(0);
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

  const onLock = (bool) => {
    if (bool) {
      setLock(true);
      unsubscribe();
    } else {
      setLock(false);
    }
  };

  React.useEffect(() => {
    const cpss = todos.getCompasses();
    console.log(cpss, "cpss");
    setLaban(cpss[0]);
    window.addEventListener("focus", () => {
      const acl = new Accelerometer({ frequency: 60 });
      acl.addEventListener("reading", () => {
        console.log(`Acceleration along the X-axis ${acl.x}`);
        console.log(`Acceleration along the Y-axis ${acl.y}`);
        console.log(`Acceleration along the Z-axis ${acl.z}`);
      });

      acl.start();
    });
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

  return (
    <>
      <div>
        <Image
          src={"/la-ban/24-son-huong.png"}
          // src={"../assets/la-ban/60-hoa-giap.png"}
          style={{ width: "100%", height: "50%" }}
        />
        asd
      </div>
    </>
  );
}

export default CreateNewProject;
