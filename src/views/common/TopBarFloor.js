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
import * as THREE from 'three'
import { routes, APIs, Lang, Helper } from "@floorplan/App";

const TopBar = React.forwardRef((props, ref) => {
  const floors = props.floors || []
  const floorIndex = props.floorIndex || 0
  // console.log(floors)
  return (
    <div className={"topbar position-absolute left-0 right-0 top-0 shadow pe-3 " + props.className}>
      <div className="text-start">Đang chọn: <span className="fw-bold">Tầng {floorIndex + 1}</span></div>
      <ul className="list-group" style={{maxHeight: 200,overflow: 'hidden',overflowY: 'auto'}}>
        {floors.map((floor, i) => {
          return(
            <li 
              className={"d-flex justify-content-between list-group-item ps-0 pe-0 " + (i == floorIndex ? 'text-danger' : '')}
              onClick={() => {
                props.onAction("select-floor",{value: i});
              }}
            >
              <span><i className="fa fa-bars"></i> Tầng {i + 1}</span>
              {
                i == floorIndex &&
                <i className="fa fa-check"></i>
              }
            </li>
          )
        })}
      </ul>
    </div>
  );
})

export default TopBar;
