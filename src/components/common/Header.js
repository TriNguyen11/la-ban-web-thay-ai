"use client";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCog,
  faEnvelopeOpen,
  faSearch,
  faSignOutAlt,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  Breadcrumb,
  Row,
  Col,
  Nav,
  Form,
  Image,
  Navbar,
  Dropdown,
  Container,
  ListGroup,
  InputGroup,
} from "react-bootstrap";

// import NOTIFICATIONS_DATA from "../data/notifications";

import { routes, globalState, APIs, Components, Lang } from "@floorplan/App";

function Header() {
  const { pathname } = location;
  // --------------------------------------
  const navigate = useNavigate();

  return <div></div>;
}

export default Header;
