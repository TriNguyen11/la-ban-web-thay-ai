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
} from "react-bootstrap";

import { routes, APIs, Lang, Navigation } from "@floorplan/App";

function BottomBar(props = {}) {
  const [show, setShow] = useState(false);
  return (
    <div className={"bottombar position-absolute left-0 right-0 bottom-0 " + props.className}>
      {props.hasSelectItem && (
        <div className="w-100 bottombar-1 d-flex">
          <a
            onClick={() => {
              props.onAction("delete");
            }}>
            <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
              <div>
                <div>
                  <i className="fa fa-trash-alt"></i>
                </div>
                Delete
              </div>
            </div>
          </a>
          {
            props.selectedItem.type != "room" && props.selectedItem.type != "door" &&
            <a
              onClick={() => {
                props.onAction("clone");
              }}>
              <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
                <div>
                  <div>
                    <i className="fa fa-clone"></i>
                  </div>
                  {Lang.t('Clone')}
                </div>
              </div>
            </a>
          }
          {
            props.selectedItem.type == "room" &&
            <a
              onClick={() => {
                props.onAction("mirror");
              }}>
              <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
                <div>
                  <div>
                  <img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBB
ZG9iZSBJbGx1c3RyYXRvciAyNy4xLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9u
OiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1s
bnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53
My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCA1OS42IDY5
IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1OS42IDY5OyIgeG1sOnNwYWNlPSJw
cmVzZXJ2ZSI+DQo8cG9seWdvbiBwb2ludHM9IjIxLjMsNjQgMCw2NCAwLDQuNiAyMS4zLDQuNiAy
MS4zLDEzLjYgOSwxMy42IDksNTUgMjEuMyw1NSAiLz4NCjxyZWN0IHg9IjI1LjYiIHdpZHRoPSI5
IiBoZWlnaHQ9IjY5Ii8+DQo8cmVjdCB4PSIzOC43IiB5PSI1IiB3aWR0aD0iOSIgaGVpZ2h0PSI5
Ii8+DQo8cmVjdCB4PSI1MC42IiB5PSI1IiB3aWR0aD0iOSIgaGVpZ2h0PSI5Ii8+DQo8cmVjdCB4
PSI1MC42IiB5PSIxNi45IiB3aWR0aD0iOSIgaGVpZ2h0PSI5Ii8+DQo8cmVjdCB4PSI1MC42IiB5
PSIzMCIgd2lkdGg9IjkiIGhlaWdodD0iOSIvPg0KPHJlY3QgeD0iNTAuNiIgeT0iNDMiIHdpZHRo
PSI5IiBoZWlnaHQ9IjkiLz4NCjxyZWN0IHg9IjUwLjYiIHk9IjU1IiB3aWR0aD0iOSIgaGVpZ2h0
PSI5Ii8+DQo8cmVjdCB4PSIzOC43IiB5PSI1NSIgd2lkdGg9IjkiIGhlaWdodD0iOSIvPg0KPC9z
dmc+DQo="/>
                  </div>
                  {Lang.t('Mirror')}
                </div>
              </div>
            </a>
          }
          <a
            onClick={() => {
              props.onAction(
                props.selectedItem && props.selectedItem.lock == true
                  ? "unlock"
                  : "lock"
              );
            }}>
            <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
              <div>
                <div>
                  <i
                    className={
                      props.selectedItem && props.selectedItem.lock == true
                        ? "fa fa-lock"
                        : "fa fa-unlock"
                    }></i>
                </div>
                {Lang.t('Size')}
              </div>
            </div>
          </a>
          <a
            onClick={() => {
              props.onAction(
                props.selectedItem && props.selectedItem.lock == true
                  ? "unlock"
                  : "lock"
              );
            }}>
            <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
              <div>
                <div>
                  <i
                    className={
                      props.selectedItem && props.selectedItem.lock == true
                        ? "fa fa-lock"
                        : "fa fa-unlock"
                    }></i>
                </div>
                {Lang.t('Position')}
              </div>
            </div>
          </a>
          {
            props.selectedItem.type != "room" && props.selectedItem.type != "door" &&
            <a
              onClick={() => {
                props.onAction(
                  props.selectedItem && props.selectedItem.lock == true
                    ? "unlock"
                    : "lock"
                );
              }}>
              <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
                <div>
                  <div>
                    <i
                      className={
                        props.selectedItem &&
                        props.selectedItem.rotationLock == true
                          ? "fa fa-lock"
                          : "fa fa-unlock"
                      }></i>
                  </div>
                  {Lang.t('Rotation')}
                </div>
              </div>
            </a>
          }
        </div>
      )}

      <div className="w-100 bottombar-2 d-flex">
        <a
          onClick={() => {
            props.onAction("undo");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-undo"></i>
              </div>
              {Lang.t('Undo')}
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("redo");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-redo"></i>
              </div>
              {Lang.t('Redo')}
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("paste");
          }}>
          <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-paste"></i>
              </div>
              {Lang.t('Copy')}
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("3d");
          }}>
          <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-cubes"></i>
              </div>
              3D
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("levels");
          }}>
          <div className="bottombar-item bottombar-item-s d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-layer-group"></i>
              </div>
              {Lang.t('Levels')}
            </div>
          </div>
        </a>
        {/* <a
          onClick={() => {
            props.onAction("phan-cung");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-compass"></i>
              </div>
              Phân cung
            </div>
          </div>
        </a> */}
      </div>
    </div>
  );
}

export default BottomBar;
