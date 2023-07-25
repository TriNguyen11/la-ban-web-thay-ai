import React, { useState } from "react";
// import SimpleBar from 'simplebar-react';
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import {
  Nav,
  Badge,
  Image,
  Button,
  Dropdown,
  Accordion,
  Navbar,
  Form,
  Row,
  Col,
  Modal,
  Spinner,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { useThree } from "@react-three/fiber";

import { routes, APIs, Lang, Navigation } from "@floorplan/App";

import { useGesture } from "@use-gesture/react";
import globalState from '@floorplan/system/globalState'

function SideBar(props = {}) {
  const { pathname } = location;
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({});
  const [floorplanObjects, setFloorplanObjects] = useState([]);
  const [isActiveDraging, setIsActiveDraging] = useState(false);
  const [data, setData] = useState({});
  const categories = data.categories || [];
  const types = data.types || [];
  const getCategories = async () => {
    let json = await APIs.getFloorplanForm();
    if (json && json.data) {
      setData(json.data);
      // globalState.dispatch({ type: 'setSystemInfo', data: json.data })
    }
  };
  const getFloorObjects = async (req = {}) => {
    setLoading(true);
    setShowFilter(false);
    setFloorplanObjects([]);
    let json = await APIs.getFloorObjects(
      req && req.filter ? req : { filter: filter }
    );
    setLoading(false);
    if (json && json.data && Array.isArray(json.data.results)) {
      setFloorplanObjects(json.data.results);
    }
  };

  React.useEffect(() => {
    getCategories();
    let ft = { type: "room" };
    setFilter(ft);

    getFloorObjects({ filter: ft });
  }, []);
  return (
    <>
      <div
        className={
          "sidebar position-absolute right-0 top-0 bottom-0 pe-auto shadow " +
          (showFilter ? 'bg-white ' : '') + (isActiveDraging ? 'd-none ' : '') +
          props.className
        }>
        <div className="mt-1 border-bottom">
          <a
            onClick={() => {
              setShowFilter(!showFilter);
            }}
            className={showFilter ? "text-dark" : 'text-white'}
            style={{ fontSize: 25 }}>
            <i className="fa fa-list me-2"></i>
            {showFilter ? <i className="fa fa-caret-down"></i> : <i className="fa fa-caret-up"></i>}
          </a>
        </div>
        <div className="sidebar-content mt-1 " id="sidebar-content">
          {
            !showFilter &&
            <>
              
              {filter.type == "room" && (
                <a
                  onClick={() => {
                    props.onAction("draw");
                  }}>
                  <div className="border-bottom border-white pt-1 pb-1">
                    <div className="text-center">
                      <img
                        src={"/image/floorplan/pen-icon.png"}
                        height="40"
                        className=""
                        draggable="false"
                      />
                    </div>
                    <div className="mt-2">Bút vẽ</div>
                  </div>
                </a>
              )}
              {loading == true && (
                <Spinner animation="border" role="status" className="mt-3">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
              {(Array.isArray(floorplanObjects) ? floorplanObjects : []).map(
                (obje, key) => {
                  return (
                    <>
                      <FloorObject
                        key={key}
                        info={obje}
                        onDragStart={(event) => {
                          props.onDragStart({ ...event, floorplan: obje });
                        }}
                        onDraging={(event) => {
                          if (event && event.movement[0] <= -30) {
                            props.onDraging({ ...event, floorplan: obje });
                            if (!isActiveDraging) {
                              setIsActiveDraging(true)
                            }
                          } else {
                            props.onDraging({});
                            setIsActiveDraging(false)
                          }
                        }}
                        onDragEnd={(event) => {
                          if (event && event.movement[0] <= -30) {
                            props.onDragEnd({ ...event, floorplan: obje });
                          }
                          setIsActiveDraging(false)
                        }}
                      />
                    </>
                  );
                }
              )}
            </>
          }
          {
            showFilter &&
            <>
              <OverlayTrigger
                trigger="click"
                placement="left"
                rootClose={true}
                // delay={{ show: 250, hide: 400 }}
                overlay={(
                  <Tooltip {...props}>
                    <div>
                      {(Array.isArray(types) ? types : []).map((type, key) => {
                        return (
                          <div key={key}>
                            <Form.Check
                              className="text-start"
                              type={"radio"}
                              id={`type-checkbox` + type.code}
                              label={type.name}
                              // checked={filter.type == type.code}
                              onClick={() => {
                                let ft = { ...filter, type: type.code };
                                if (ft.type == "room") {
                                  ft = { type: "room" };
                                }
                                setFilter(ft);
                                setShowFilter(false)
                                getFloorObjects({filter: ft})
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Tooltip>
                )}
              >
                <a className="text-dark filt-o">
                  <div className="p-2 ps-1 pe-1 text-start">Chọn cấu trúc</div>
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                trigger="click"
                placement="left"
                rootClose={true}
                // delay={{ show: 250, hide: 400 }}
                overlay={(
                  <Tooltip {...props}>
                    <div>
                      {categories.map((category, i) => {
                        return (
                          <div key={i}>
                            <Form.Check
                              className="text-start"
                              type={"radio"}
                              id={"checkbox-category-" + category.id}
                              label={category.name}
                              // checked={
                              //   Array.isArray(filter.categories) &&
                              //   filter.categories.includes(category.id)
                              // }
                              onClick={() => {
                                let ft = { ...filter, categories: [category.id],type: '' }
                                setFilter(ft);
                                setShowFilter(false)
                                getFloorObjects({filter: ft})
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Tooltip>
                  )}
              >
                <a className="text-dark filt-o">
                  <div className="p-2 ps-1 pe-1 text-start">Chọn loại</div>
                </a>
              </OverlayTrigger>
              <OverlayTrigger
                trigger="click"
                placement="left"
                rootClose={true}
                // delay={{ show: 250, hide: 400 }}
                overlay={(
                  <Tooltip {...props}>
                    <div>
                      <div>
                        <Form.Check
                          className="text-start"
                          type={"radio"}
                          id="checkbox-noi-that"
                          label="Nội thất"
                          // checked={!filter.exterior}
                          onClick={() => {
                            let ft = { ...filter, exterior: 0,type: '' }
                            setFilter(ft);
                            setShowFilter(false)
                            getFloorObjects({filter: ft})
                          }}
                        />
                      </div>
                      <div>
                        <Form.Check
                          className="text-start"
                          type={"radio"}
                          id="checkbox-ngoai-that"
                          label="Ngoại thất"
                          // checked={filter.exterior}
                          onClick={() => {
                            let ft = { ...filter, exterior: 1,type: '' }
                            setFilter(ft);
                            setShowFilter(false)
                            getFloorObjects({filter: ft})
                          }}
                        />
                      </div>
                    </div>
                  </Tooltip>
                  )}
              >
                <a className="text-dark filt-o">
                  <div className="p-2 ps-1 pe-1 text-start">Ngoại thất</div>
                </a>
              </OverlayTrigger>
            </>
          }
        </div>
      </div>
    </>
  );
}
let lastDrag = {}
function FloorObject(props) {
  const container = document.querySelector("#sidebar-content");

  const info = props.info || {};
  const bind = useGesture(
    {
      onDragStart: () => {
        props.onDragStart()
      },
      onDrag: (data) => {
        if (!data.active) {
          return
        }
        // console.log(data.xy)
        props.onDraging({ ...data })
      },
      onDragEnd: (data) => {
        props.onDragEnd({ ...data })
      },
    },
    {
      drag: {
        from: () => [0, 0],
        axisThreshold: 3
      },
    }
  );
  
  return (
    <a>
      <div
        {...bind()}
        className="border-bottom border-white p-1">
        <div className="text-center">
          <img src={info.image} height="40" className="" draggable="false" />
        </div>
        <div className="mt-2">{info.name}</div>
      </div>
    </a>
  );
}
export default SideBar;
