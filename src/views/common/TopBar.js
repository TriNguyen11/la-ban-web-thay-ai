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
  const selectedItem = props.selectedItem || {}
  const [show, setShow] = useState(false);
  const [length, setLength] = useState(selectedItem.length || 0);
  const [width, setWidth] = useState(selectedItem.width || 0);
  const [keyboardInputVisible, setKeyboardInputVisible] = useState(false);
  const onChange = props.onChange

  const onKeyBoardInputChange = (text) => {
    if(text == null || text == '')return
    let ifo = {...selectedItem}
    if(ifo.type == 'room'){
      const boundaries = ifo.boundaries || []
      const v1 = new THREE.Vector2(boundaries[0][0],boundaries[0][1])
      const v2 = new THREE.Vector2(boundaries[1][0],boundaries[1][1])
      const v3 = new THREE.Vector2(boundaries[2][0],boundaries[2][1])
      const v4 = new THREE.Vector2(boundaries[3][0],boundaries[3][1])
      const v1v2center = v1.clone().sub(v2).multiplyScalar(1/2).add(v2)
      const v2v3center = v2.clone().sub(v3).multiplyScalar(1/2).add(v3)
      const v3v4center = v3.clone().sub(v4).multiplyScalar(1/2).add(v4)
      const v1v4center = v1.clone().sub(v4).multiplyScalar(1/2).add(v4)
      // console.log(v1,v2,v1v2center)
      if (keyboardInputVisible == 'length') {
        const newV1 = v1.clone().sub(v1v2center).setLength(text/2).add(v1v2center)
        boundaries[0] = [newV1.x,newV1.y]
        const newV2 = v2.clone().sub(v1v2center).setLength(text/2).add(v1v2center)
        boundaries[1] = [newV2.x,newV2.y]
        const newV3 = v3.clone().sub(v3v4center).setLength(text/2).add(v3v4center)
        boundaries[2] = [newV3.x,newV3.y]
        const newV4 = v4.clone().sub(v3v4center).setLength(text/2).add(v3v4center)
        boundaries[3] = [newV4.x,newV4.y]
        // console.log(boundaries)
      }
      if (keyboardInputVisible == 'width') {
        const newV1 = v1.clone().sub(v1v4center).setLength(text/2).add(v1v4center)
        boundaries[0] = [newV1.x,newV1.y]
        const newV2 = v2.clone().sub(v2v3center).setLength(text/2).add(v2v3center)
        boundaries[1] = [newV2.x,newV2.y]
        const newV3 = v3.clone().sub(v2v3center).setLength(text/2).add(v2v3center)
        boundaries[2] = [newV3.x,newV3.y]
        const newV4 = v4.clone().sub(v1v4center).setLength(text/2).add(v1v4center)
        boundaries[3] = [newV4.x,newV4.y]
      }
      ifo.boundaries = boundaries
    }else if(ifo.type == 'wall'){
      const boundary = ifo.boundary || []
      const v1 = new THREE.Vector2(boundary[0][0],boundary[0][1])
      const v2 = new THREE.Vector2(boundary[1][0],boundary[1][1])
      const v1v2center = v1.clone().sub(v2).multiplyScalar(1/2).add(v2)
      if (keyboardInputVisible == 'length') {
        const newV1 = v1.clone().sub(v1v2center).setLength(text/2).add(v1v2center)
        boundary[0] = [newV1.x,newV1.y]
        const newV2 = v2.clone().sub(v1v2center).setLength(text/2).add(v1v2center)
        boundary[1] = [newV2.x,newV2.y]
        setLength(text)
        ifo.length = text
      }
      if (keyboardInputVisible == 'width') {
        setWidth(text)
        ifo.width = text
      }
      ifo.boundary = boundary
    }else{
      if (keyboardInputVisible == 'length') {
        setLength(text)
        ifo.length = text
      }
      if (keyboardInputVisible == 'width') {
        setWidth(text)
        ifo.width = text
      }
    }
    onChange(ifo)
    setKeyboardInputVisible(false)
  }

  React.useEffect(() => {
    const ifo = props.selectedItem || {}
    if(props.selectedItem?.type == "room"){
      // showOnlyInfoForRoom = true
      if(selectedItem.boundaries?.length == 4){
        const boundaries = selectedItem.boundaries;
        const v1 = new THREE.Vector2(boundaries[0][0],boundaries[0][1])
        const v2 = new THREE.Vector2(boundaries[1][0],boundaries[1][1])
        const v3 = new THREE.Vector2(boundaries[2][0],boundaries[2][1])
        const v4 = new THREE.Vector2(boundaries[3][0],boundaries[3][1])
        if (v1.clone().sub(v2).angleTo(v4.clone().sub(v3)) < Math.PI/180) {
          // showOnlyInfoForRoom = false
          setLength(v1.clone().sub(v2).length().toFixed(2))
          setWidth(v4.clone().sub(v1).length().toFixed(2))
          return
        }
      }
    }
    
    setLength(ifo.length)
    setWidth(ifo.width)
  },[props.selectedItem])

  React.useImperativeHandle(ref, () => ({
    refresh: () => {
      
    },
    set: (data) => {
      if (data.length) {
        setLength(data.length)
      }
      if (data.width) {
        setWidth(data.width)
      }
    }
  }));
  if (!selectedItem.name) {
    return <></>;
  }
  // console.log(selectedItem)
  // Room
  const showOnlyInfoForRoom = !length || !width
  const main = () => {
    if (showOnlyInfoForRoom) {
      const area = Helper.calcPolygonArea(selectedItem.boundaries).toFixed(2);
      return (
        <div className="d-flex justify-content-start align-items-center">
          <div className="me-2 topbar-name">{selectedItem.name}:</div>
          <div>
            {area}m<sup>2</sup>
          </div>
        </div>
      );
    }
    return (
      <div className="d-flex justify-content-start align-items-center">
        <div className="me-2 topbar-name">{selectedItem.name}</div>
        <a 
          className="lwh-picker"
          onClick={() => {
            setKeyboardInputVisible('length')
          }}
        >{length}m</a>
        {
          <>
            <div className="ms-2 me-2">
              <i className="fa fa-times"></i>
            </div>
            {
              selectedItem.type != 'door'
              ?<a 
                className="lwh-picker"
                onClick={() => {
                  setKeyboardInputVisible('width')
                }}
              >{width}m</a>
              :<span>{width}m</span>
            }
            
          </>
        }
      </div>
    );
  };

  
  
  return (
    <div className={"topbar position-absolute left-0 right-0 top-0 shadow " + props.className}>
      {main()}
      {
        keyboardInputVisible &&
        <KeyboardInput
          onChange={onKeyBoardInputChange}
        />
      }
    </div>
  );
})

function KeyboardInput(props){
  const [value,setValue] = React.useState('')
  return(
    <div className="mt-2 input-board-container">
      <Row className="g-2">
        <Col xs={8}>
          <Form.Control
            value={value}
            readonly
            className="mb-2 w-100"
          />
        </Col>
        <Col xs={4}>
          <Row className="g-2">
            <Col xs={6}>
              <div onClick={() => {
                props.onChange(parseFloat(value))
              }} className="input-board-cell d-flex align-items-center justify-content-center">OK</div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="g-2">
        <Col xs={8}>
          <div>
            <Row className="g-2 flex-row-reverse mb-2">
              {
                Array(9).fill(9).map((i,index) => {
                  return(
                    <Col xs={4} key={index}>
                      <div onClick={() => {
                        const text = value + '' +  (9 - index)
                        setValue(text)
                      }} className="input-board-cell d-flex align-items-center justify-content-center">{ 9 - index }</div>
                    </Col>
                  )
                })
              }
            </Row>
            <Row className="g-2">
              <Col xs={4}></Col>
              <Col xs={4}>
                <div onClick={() => {
                  const text = value + '0'
                  setValue(text)
                }} className="input-board-cell d-flex align-items-center justify-content-center">0</div>
              </Col>
              <Col xs={4}>
                <div onClick={() => {
                  const text = value + '.'
                  setValue(text)
                }} className="input-board-cell d-flex align-items-center justify-content-center">.</div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={4}>
          <Col xs={6}>
            <div onClick={() => {
              const text = value.slice(0, -1)
              setValue(text)
            }} className="input-board-cell d-flex align-items-center justify-content-center"><i className="fa fa-backspace"></i></div>
          </Col>
        </Col>
      </Row>
      
    </div>
  )
}

export default TopBar;
