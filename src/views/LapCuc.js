import React, { useState } from "react";
import { Button, Image } from "react-bootstrap";
import { useGesture } from "react-use-gesture";

import * as pico from "@gripeless/pico";
import html2canvas from "html2canvas";
import { Image as Imagess, Layer, Stage, Transformer } from "react-konva";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import useImage from "use-image";
import { getDirectionPhongThuyName, routingNavigateBottom } from "./Constanst";
const INIT_IMAGE = {
  x: 10,
  y: 10,
  width: window.innerWidth / 1,
  height: window.innerWidth / 1,
  id: "rect1",
};
let accelerometer = null;
function LapCuc(props) {
  const [isImage, setIsImage] = useState(false);
  const [degRotate, setDegRotate] = useState(0);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    isRotate: false,
  });
  const [selectedId, selectShape] = React.useState(null);
  const [initImage, setInitImage] = useState([INIT_IMAGE]);
  const [image, setImage] = React.useState();
  const refPinch = React.useRef();

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
  useGesture(
    {
      onPinch: ({ offset: [scaleImage] }) => {
        setCrop((crop) => ({ ...crop, scale: 1 + scaleImage / 100 }));

        // setCrop((crop) => ({ ...crop, x: dx, y: dy }));
      },
      onDrag: ({ offset: [dx, dy] }) => {
        if (selectedId === null) setCrop((crop) => ({ ...crop, x: dx, y: dy }));
      },
    },
    {
      domTarget: refPinch,
      eventOptions: { passive: false },
    }
  );
  function imagePreview(e) {
    const avatar = document.getElementById("avatar");

    const blob = new Blob([e.target.files[0]]);
    const blobURL = URL.createObjectURL(blob);
    avatar.style.display = "block";
    avatar.style.opacity = "1";
    avatar.src = blobURL;
    avatar.onload = () => {
      avatar.style.width = "100%";
    };
    setInitImage([INIT_IMAGE]);
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
          zIndex: 1,
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
      <div
        style={{ height: "75%", marginTop: "15%" }}
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
          <div
            style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}
            onClick={() => {
              setIsImage(false);
            }}>
            <i
              className="fa fa-chevron-left"
              style={{ fontSize: 30, color: "white" }}></i>
          </div>
        )}
        {/* image render */}
        <div
          ref={refPinch}
          id="container"
          style={{
            width: "100%",
            height: "100%",
            display: isImage ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}>
          <div
            onClick={() => {
              selectShape(null);
            }}
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              zIndex: 0,
              background: "black",
              top: 0,
              touchAction: "none",
            }}></div>
          <div
            style={{
              width: "100%",
              display: isImage ? "flex" : "none",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              height: "100%",
              position: "relative",
              transform: `scale(${crop.scale})`,
              top: crop.y,
              left: crop.x,
              rotate: `${crop.rotate}deg`,
              touchAction: "none",
            }}>
            <img
              id="avatar"
              src=""
              alt=""
              style={{
                display: isImage ? "none" : "none",
                position: "absolute",
              }}
            />
            <Konvas
              initImage={initImage}
              setDegRotate={setDegRotate}
              selectShape={selectShape}
              selectedId={selectedId}
            />
          </div>
        </div>
        {/* tools Right */}
        {isImage && (
          <div
            className="d-flex flex-row justify-content-between align-items-end position-absolute "
            style={{ padding: "10px 20px", bottom: "20%", right: 10 }}>
            <div style={{}} className="d-flex flex-column align-items-center">
              {crop.isRotate && (
                <Slider
                  min={0}
                  max={360}
                  step={1}
                  className=" bg-white color-blue-200"
                  value={crop.rotate}
                  orientation={"vertical"}
                  tooltip={false}
                  onChange={(value) => {
                    setCrop({ ...crop, rotate: value });
                  }}
                  // onChangeComplete={Function}
                />
              )}
              {/* rotate */}
              <Button
                onClick={() => {
                  setCrop({ ...crop, isRotate: !crop.isRotate });
                }}
                style={{
                  background: "white",
                  borderRadius: 9999,
                  padding: "10px 12px",
                  border: "0px",
                  marginBottom: 12,
                }}>
                <Image
                  src="/la-kinh/icon-9.png"
                  style={{
                    width: 20,
                    height: 20,
                  }}></Image>
              </Button>
              {/* screen shot */}
              <Button
                onClick={downloadScreenshot}
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
              {/* share */}
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
          </div>
        )}
        {/* degree */}
        {isImage && (
          <div
            style={{
              width: "100%",
              position: "absolute",
              bottom: "11%",
              zIndex: 2,
            }}
            className="d-flex flex-column justify-content-center align-items-center">
            <div className="text-white">
              {getDirectionPhongThuyName(degRotate)}
            </div>
            <div
              style={{
                backgroundColor: "white",
                padding: "5px 20px ",
                borderRadius: 12,
              }}>
              {degRotate}
              <span>&deg;</span>
            </div>
          </div>
        )}
        {/* navigatorBottom */}
        <div
          className="d-flex flex-row justify-content-center position-absolute bottom-2"
          style={{
            width: "100%",
            zIndex: 2,
          }}>
          <div style={{}} className="d-flex flex-row align-items-center"></div>
          {routingNavigateBottom.map((item, index) => {
            if (index < 2)
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
const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  setDegRotate,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const [image] = useImage("/la-ban-ve-tinh/mac-dinh.png");

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Imagess
        image={image}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        // rotation={12}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />

      {isSelected && (
        <Transformer
          ref={trRef}
          anchorCornerRadius={20}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            console.log(newBox, "newBox");
            if (((newBox.rotation / Math.PI) * 180) % 360 >= 0) {
              setDegRotate(
                (((newBox.rotation / Math.PI) * 180) % 360).toFixed(1)
              );
            } else {
              setDegRotate(
                (
                  360 - Math.abs(((newBox.rotation / Math.PI) * 180) % 360)
                ).toFixed(1)
              );
            }

            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

const Konvas = ({ initImage, setDegRotate, selectedId, selectShape }) => {
  const [rectangles, setRectangles] = React.useState(initImage);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight * 0.75}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}>
      <Layer>
        {rectangles.map((rect, i) => {
          return (
            <>
              <Rectangle
                key={i}
                shapeProps={rect}
                setDegRotate={setDegRotate}
                isSelected={rect.id === selectedId}
                onSelect={() => {
                  selectShape(rect.id);
                }}
                onChange={(newAttrs) => {
                  const rects = rectangles.slice();
                  rects[i] = newAttrs;
                  setRectangles(rects);
                }}
              />
            </>
          );
        })}
      </Layer>
    </Stage>
  );
};
export default LapCuc;
