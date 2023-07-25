"use client";
import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Form,
  Breadcrumb,
  ButtonGroup,
  Button,
  Toast,
  ToastContainer,
  Card,
} from "react-bootstrap";
import {
  routes,
  Components,
  APIs,
  globalState,
  Notify,
  View,
  Lang,
} from "@floorplan/App";
import Navigation from "@floorplan/system/navigation";
import { useTranslation } from "react-i18next";

import { AppContext } from "@floorplan/provider";

const AppContent = () => {
  const currentRoute = routes.getCurrentRoute();
  // Setup navigate, call any where.
  const navigate = useNavigate();
  Navigation.setFunction(navigate);
  // Setup global State, call any where.
  const { state, dispatch } = useContext(AppContext);
  globalState.initState(state);
  globalState.initDispatch(dispatch);
  // -----------------------------------------------------------
  const [messageType, setMessageType] = React.useState("danger");
  const [message_title, setMessageTitle] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [showMessageNotify, setShowMessageNotify] = useState(false);
  // Setup Notify, call any where.
  Notify.initShowMessageType(setMessageType);
  Notify.initShowMessageTitle(setMessageTitle);
  Notify.initShowMessage(setMessage);
  Notify.initShowNotify((show) => {
    setShowMessageNotify(false);
    setShowMessageNotify(show);
  });
  const [showBackgroundLoading, setShowBackgroundLoading] = useState(false);
  View.initBgLoading(setShowBackgroundLoading);
  const [showOverlayLoading, setShowOverlayLoading] = useState(false);
  View.initOverlayLoading(setShowOverlayLoading);
  // Setup Translation, call any where.
  const [t, i18n] = useTranslation();
  Lang.setTranslationFunction(t);
  Lang.setI18n(i18n);
  // i18n.on('languageChanged', function(lng) {
  //   setShowBackgroundLoading(true)
  //   setShowBackgroundLoading(false)
  // })
  // -----------------------------------------------------------

  // ------------------------------------------
  useEffect(() => {
    // let accessToken = document.querySelector('meta[name="access-token"]').content
    // if (accessToken) {
    //   localStorage.setItem('accessToken', accessToken)
    // }
    // if (APIs.isLogged()) {
    //   setShowBackgroundLoading(true)
    //   await APIs.syncAuthInfo()
    //   setShowBackgroundLoading(false)
    // }
    // console.log('aaa')
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentRoute != null && currentRoute.name != null) {
        document.title = Lang.t(currentRoute.name);
      }
    }
  }, [currentRoute]);

  return (
    <>
      <Routes>
        {Object.keys(routes).map((route_key, key) => {
          return (
            <Route
              key={key}
              path={routes[route_key].path}
              exact={routes[route_key].exact}
              element={
                <Components.CheckPrivateRoute>
                  {routes[route_key].main}
                </Components.CheckPrivateRoute>
              }
            />
          );
        })}
      </Routes>
      <ToastContainer
        position="top-end"
        className="p-3 position-fixed"
        style={{}}>
        <Toast
          bg={messageType}
          onClose={() => setShowMessageNotify(false)}
          show={showMessageNotify}
          delay={3000}
          autohide>
          <Toast.Header>
            {messageType == "success" && <i className="fa fa-check-circle"></i>}
            {messageType == "danger" && (
              <i className="fa fa-exclamation-circle"></i>
            )}
            {messageType == "warning" && (
              <i className="fa fa-exclamation-circle"></i>
            )}
            {messageType == "info" && <i className="fa fa-info-circle"></i>}
            <strong className="ms-2 me-auto">{message_title}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{message}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Components.BackgroundLoading show={showBackgroundLoading} />
      <Components.OverlayLoading show={showOverlayLoading} />
    </>
  );
};

export default AppContent;
