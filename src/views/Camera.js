import React from "react";
import { Button, Image, Modal, Offcanvas } from "react-bootstrap";
import { useGesture } from "react-use-gesture";
import * as pico from "@gripeless/pico";
import { Navigation, routes } from "@floorplan/App";

import { routingNavigateBottom } from "./Constanst";
import todos from "./todos";
import html2canvas from "html2canvas";

let magnetometer = null;
let accelerometer = null;
let localstream;
function Camera(props) {
  const docanbangRef = React.useRef();
  const imageRef = React.useRef();
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [visibleSonHuongPicker, setVisibleSonHuongPicker] =
    React.useState(false);
  const [isPermission, setIsPermission] = React.useState(false);
  const [lock, setLock] = React.useState(false);
  const [angle, setAngle] = React.useState(0);
  const [image, setImage] = React.useState();
  const [changeCompass, setChangeCompass] = React.useState({
    visible: false,
    compass: "/la-ban/24-son-huong.png",
  });
  // const [docanbang,setDoCanBang] = React.useState({x: 0,y:0,z:0})
  const [compassPicker, setCompassPicker] = React.useState([]);
  const capOff = () => {
    let vid = document?.getElementById("vid");
    if (vid) {
      vid.pause();
      vid.src = "";
    }
    localstream?.getTracks()?.forEach((x) => x.stop());
    console.log("all capture devices off");
  };

  const camON = () => {
    console.log("123123132");
    let vid = document.getElementById("vid");
    if (navigator.mediaDevices.getUserMedia !== null) {
      var options = {
        video: true,
        audio: true,
      };
      navigator.getUserMedia(
        options,
        function (stream) {
          console.log(stream, "stream");
          vid.srcObject = stream;
          localstream = stream;
          vid.play();
          console.log(stream, "streaming");
        },
        function (e) {
          console.log("background error : " + e.name);
        }
      );
    }
  };
  const constraints = {
    audio: false,
    video: {
      facingMode: "user",
    },
  };

  function getVideo() {
    let video = document.getElementById("vid");

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((localMediaStream) => {
        console.log(localMediaStream);

        //  DEPRECIATION :
        //       The following has been depreceated by major browsers as of Chrome and Firefox.
        //       video.src = window.URL.createObjectURL(localMediaStream);
        //       Please refer to these:
        //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
        //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
        console.dir(video);
        if ("srcObject" in video) {
          video.srcObject = localMediaStream;
        } else {
          video.src = URL.createObjectURL(localMediaStream);
        }
        // video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
      })
      .catch((err) => {
        console.error(`OH NO!!!!`, err);
      });
  }
  // let _angle = useSharedValue(0);
  // _angle.addListener(({value}) => setAngle(Math.round(value)));
  const areaListener = new AbortController();
  const unsubscribe = () => {
    if (magnetometer) {
      magnetometer.unsubscribe();
    }
    if (accelerometer) {
      accelerometer.unsubscribe();
    }
  };

  React.useEffect(() => {
    const cpss = todos.getCompasses();
    const sonhuongs = todos.getDoSonHuongs();
    setCompassPicker(sonhuongs);
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

  function deviceOrientationListener(event) {
    var alpha = event.alpha; //z axis rotation [0,360)
    var beta = event.beta; //x axis rotation [-180, 180]
    var gamma = event.gamma; //y axis rotation [-90, 90]
    //Check if absolute values have been sent
    if (!lock) {
      // document.getElementById("console").innerText = "lock == false";
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
    } else {
      // document.getElementById("console").innerText = `lock is ${lock}`;
    }
  }

  const takeImage = async () => {
    let res;
    await (async () => {
      res = await pico.dataURL(window);
      setImage(res.value);
    })();
  };
  const downloadScreenshot = async () => {
    takeImage();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // html2canvas(document.getElementById("application"), {
    html2canvas(document.getElementById("ImageDownload"), {
      proxy: "server.js",
      useCORS: true,
      onrendered: function (canvas) {
        document.body.appendChild(canvas);
      },
    }).then((canvas) => {
      let a = document.createElement("a");
      a.download = "screenshot.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });
  };
  const shareScreenshot = async () => {
    await takeImage();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const canvas = await html2canvas(document.getElementById("ImageDownload"), {
      proxy: "server.js",
      useCORS: true,
      onrendered: function (canvas) {
        document.body.appendChild(canvas);
      },
    });
    canvas.toBlob(async (blob) => {
      // Even if you want to share just one file you need to
      // send them as an array of files.
      const files = [new File([blob], "image.png", { type: blob.type })];
      const shareData = {
        text: "Some text",
        title: "Some title",
        files,
      };
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.name, err.message);
          }
        }
      } else {
        console.warn("Sharing not supported", shareData);
      }
    });
  };

  React.useEffect(() => {
    if (!lock) {
      window.addEventListener(
        `deviceorientation`,
        deviceOrientationListener,
        true
      );
      // window.addEventListener("deviceorientation", deviceOrientationListener);
    }
    return () => {
      if (lock) {
        window.removeEventListener(
          `deviceorientation`,
          deviceOrientationListener,
          true
        );
      }
    };
  }, [lock]);
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
          zIndex: 2,
        }}></Image>
      <Offcanvas
        show={changeCompass.visible}
        onHide={() => {
          setChangeCompass({ ...changeCompass, visible: false });
        }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {["/la-ban/24-son-huong.png", "/la-ban/60-hoa-giap.png"].map(
            (item, index) => {
              return (
                <Image
                  onClick={() => {
                    setChangeCompass({ visible: false, compass: item });
                  }}
                  style={{ padding: 10 }}
                  src={item}></Image>
              );
            }
          )}
        </Offcanvas.Body>
      </Offcanvas>
      {!isPermission && (
        <div
          onClick={(e) => {
            // camON();
            getVideo();
            setIsPermission(true);
            // console.log("123123");
          }}
          style={{
            position: "fixed",
            height: "100vh",
            width: "100vw",
            background: "red",
            top: 0,
            zIndex: 9,
          }}></div>
      )}
      <div
        style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
        onClick={() => {
          Navigation.navigate(routes.home.path);
        }}>
        <i
          className="fa fa-chevron-left"
          style={{ fontSize: 30, color: "white" }}></i>
      </div>
      <img
        id="ImageDownload"
        alt="data"
        src={image}
        style={{
          position: "absolute",
          opacity: 1,
          zIndex: -3,
          top: 0,
          left: -4,
        }}
      />
      {/* header */}
      <div
        className="d-flex flex-row justify-content-between align-items-start position-absolute"
        style={{ padding: "10px 20px", width: "100%", zIndex: 4 }}>
        {/* left */}
        <div className="opacity-0">_____</div>
        {/* middle */}
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex flex-row align-items-center">
            <div
              onClick={() => setVisibleSonHuongPicker(true)}
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
            <div
              className="position-relative"
              style={{}}
              onClick={() => {
                setLock(!lock);
                document.getElementById(
                  "console"
                ).innerText = `lock is ${lock}`;
              }}>
              <Image
                src={changeCompass.compass}
                // src={"../assets/la-ban/60-hoa-giap.png"}
                style={{
                  width: 30,
                  height: 30,
                  // rotate: `${example ? example : 0}deg`,
                  opacity: lock === true ? 0.5 : 1,
                }}
              />
              <i
                className=" fa fa-lock position-absolute "
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
            onClick={downloadScreenshot}
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
          {/* change compass */}
          <Button
            onClick={() => {
              setChangeCompass({ ...changeCompass, visible: true });
            }}
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
      {/* <div
        className="d-flex flex-row justify-content-between align-items-end"
        style={{ padding: "10px 20px" }}>
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
            onClick={shareScreenshot}
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
      </div> */}

      <video
        id="vid"
        muted={true}
        playsinline="true"
        height={window.innerHeight / 1.7}
        width={window.innerWidth}
        style={{ zIndex: -3, scale: 1.5, transform: "translateY(-5%)" }}
        autoPlay></video>

      {/* la ban */}
      <div
        style={{
          width: "200%",
        }}
        className="d-flex flex-row justify-content-center">
        <div
          style={{
            width: window.innerWidth * 2,
            height: "100%",
            transform: "translateX(-25%) translateY(-15%)",
            overflow: "hidden",
            position: "absolute",
            zIndex: 1,
          }}>
          <div
            style={{
              position: "relative",
              left: crop.x,
              top: crop.y,
            }}>
            <img
              draggable={false}
              alt=""
              src={changeCompass.compass}
              width="300rem"
              ref={imageRef}
              style={{
                width: "100%",
                height: "100%",
                touchAction: "none",
                position: "relative",
                rotate: `${angle ? 360 - angle : 0}deg`,
                transition: "0.1s linear",
              }}
            />
            <div
              style={{
                width: 2,
                height: "100%",
                backgroundColor: "red",
                position: "absolute",
                top: 0,
                left: "50%",
                top: "0%",
              }}
            />
          </div>
        </div>
      </div>
      {/* <div
        style={{
          position: "absolute",
          bottom: "-10%",
          zIndex: -2,
          width: "200%",
        }}
        className="d-flex flex-row justify-content-center">
        <div
          style={{
            width: "100%",
            height: "40%",

            overflow: "hidden",
          }}>
          <div
            style={{
              position: "relative",
              left: crop.x,
              top: crop.y,
            }}>
            <img
              draggable={false}
              alt=""
              src={"/la-ban/24-son-huong.png"}
              width="300rem"
              ref={imageRef}
              style={{
                width: "100%",
                height: "100%",
                touchAction: "none",
                position: "relative",
                rotate: `${angle ? 360 - angle : 0}deg`,
                transition: "0.1s linear",
                transform: "translateX(-25%) translateY(30%)",
              }}
            />
          </div>
        </div>
      </div> */}

      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          zIndex: 3,
          width: "200%",
        }}
        className="d-flex flex-row justify-content-center">
        {/* <img
          draggable={false}
          alt=""
          src={"/la-ban/24-son-huong.png"}
          ref={imageRef}
          style={{
            width: "100%",
            height: "100%",
            touchAction: "none",
            position: "relative",
            rotate: `${angle ? 360 - angle : 0}deg`,
            transition: "0.1s linear",
            objectFit: "cover",
            transform: "translateX(-25%) translateY(30%)",
          }}
        /> */}
      </div>

      {/* navigatorBottom */}
      <div
        className="d-flex flex-row justify-content-center position-absolute bottom-2"
        style={{
          width: "100%",
          zIndex: 3,
        }}>
        <div style={{}} className="d-flex flex-row align-items-center"></div>
        {routingNavigateBottom.map((item) => {
          return (
            <div
              style={{
                background: "transparent",
                border: "0px",
              }}
              onClick={item.onClick}
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
      {/* <div id="console"></div> */}
      <ModalPickDegree
        data={compassPicker}
        setAngle={setAngle}
        visibleSonHuongPicker={visibleSonHuongPicker}
        setVisibleSonHuongPicker={setVisibleSonHuongPicker}
      />
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
const ModalPickDegree = ({
  data,
  setAngle,
  visibleSonHuongPicker,
  setVisibleSonHuongPicker,
}) => {
  return (
    <Modal
      centered
      show={visibleSonHuongPicker}
      onHide={() => setVisibleSonHuongPicker(false)}
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title">
      <Modal.Header className="d-flex flex-row justify-content-center position-relative">
        <Modal.Title style={{}}>
          <div style={{}}>Chọn sơn hướng</div>
        </Modal.Title>
        <div
          onClick={() => {
            setVisibleSonHuongPicker(false);
            window.removeEventListener(
              "deviceorientation",
              deviceOrientationListener
            );
          }}
          className="position-absolute"
          style={{ right: 10, fontSize: 30 }}>
          <i className="fa fa-times"></i>
        </div>
      </Modal.Header>
      <Modal.Body className="grid-example">
        <div class="input-group mb-3">
          <span class="input-group-text" id="basic-addon1">
            <i className="fa fa-search"></i>
          </span>
          <input type="text" class="form-control" placeholder="Nhập độ hướng" />
          <span class="input-group-text" id="basic-addon1">
            <i className="fa fa-times"></i>
          </span>
        </div>
        <div
          style={{ overflow: "scroll", height: 300 }}
          className="d-flex flex-row flex-wrap ">
          {data.map((item, index) => {
            return (
              <div
                onClick={() => {
                  setAngle(item.value);
                  setVisibleSonHuongPicker(false);
                }}
                style={{ width: "33.33%" }}
                className="d-flex flex-column align-items-center border">
                <div className="" style={{ fontWeight: "bold" }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 12 }}>
                  {item.value}
                  <span>&deg;</span>
                </div>
              </div>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default Camera;
