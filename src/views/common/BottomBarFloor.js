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

function BottomBarFloor(props = {}) {
  const [show, setShow] = useState(false);
  const floors = props.floors || []
  const floorIndex = props.floorIndex || 0
  return (
    <div className={"bottombar position-absolute left-0 right-0 bottom-0 " + props.className}>
      <div className="w-100 bottombar-2 d-flex">
        <a
          onClick={() => {
            props.onAction("levels");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-times-circle"></i>
              </div>
              {Lang.t('Close')}
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("add-floor");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-plus-circle"></i>
              </div>
              {Lang.t('Add')}
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("delete-floor");
          }}>
          <div className={"bottombar-item d-flex justify-content-center align-items-center border-white " + (floors?.length == 1 ? 'btn-disabled ' : '')}>
            <div>
              <div>
                <i className="fa fa-trash-alt"></i>
              </div>
              {Lang.t('Delete')}
            </div>
          </div>
        </a>
        {/* <a
          onClick={() => {
            props.onAction("name-floor");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-comment"></i>
              </div>
              {Lang.t('Edit Name')}
            </div>
          </div>
        </a> */}
        <a
          onClick={() => {
            props.onAction("up-floor");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-chevron-up"></i>
              </div>
              {Lang.t('Up')}
            </div>
          </div>
        </a>
        <a
          onClick={() => {
            props.onAction("down-floor");
          }}>
          <div className="bottombar-item d-flex justify-content-center align-items-center border-white">
            <div>
              <div>
                <i className="fa fa-chevron-down"></i>
              </div>
              {Lang.t('Down')}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default BottomBarFloor;
